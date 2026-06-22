#!/usr/bin/env python3
"""
AI信息源聚合器
每天跑一次，拉取所有RSS源的最新内容，按优先级排列输出

用法：
    python aggregator.py              # 拉取过去24小时
    python aggregator.py --days 3     # 拉取过去3天
    python aggregator.py --source 量子位  # 只看某个源
    python aggregator.py --export markdown  # 输出markdown文件
"""

import json
import sys
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

SCRIPTS_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPTS_DIR.parent
FEEDS_FILE = PROJECT_DIR / "sources" / "feeds.json"
TRACKER_FILE = SCRIPTS_DIR / "tracker.json"

try:
    import feedparser
except ImportError:
    print("❌ 需要安装 feedparser：pip install feedparser")
    sys.exit(1)

try:
    import requests
except ImportError:
    print("❌ 需要安装 requests：pip install requests")
    sys.exit(1)


def load_feeds():
    with open(FEEDS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["feeds"]


def load_tracker():
    """加载已覆盖话题追踪"""
    if not TRACKER_FILE.exists():
        return {"covered_urls": [], "covered_topics": []}
    with open(TRACKER_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_tracker(tracker):
    with open(TRACKER_FILE, "w", encoding="utf-8") as f:
        json.dump(tracker, f, ensure_ascii=False, indent=2)


def fetch_feed(feed_info, days=1):
    """拉取单个RSS源"""
    try:
        resp = requests.get(feed_info["url"], timeout=15, headers={
            "User-Agent": "Mozilla/5.0 (compatible; AI-News-Bot/1.0)"
        })
        resp.raise_for_status()
    except Exception as e:
        return {"feed": feed_info, "entries": [], "error": str(e)}

    feed = feedparser.parse(resp.content)
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    entries = []
    for entry in feed.entries:
        # 解析发布时间
        published = None
        for attr in ["published_parsed", "updated_parsed"]:
            val = getattr(entry, attr, None)
            if val:
                published = datetime(*val[:6], tzinfo=timezone.utc)
                break

        # 跳过太旧的内容
        if published and published < cutoff:
            continue

        entries.append({
            "title": entry.get("title", "无标题"),
            "link": entry.get("link", ""),
            "published": published.isoformat() if published else "未知",
            "summary": (entry.get("summary", "") or "")[:300],
        })

    return {"feed": feed_info, "entries": entries, "error": None}


def filter_source(feeds, source_name):
    """按源名称过滤"""
    return [f for f in feeds if source_name.lower() in f["name"].lower()]


def export_markdown(all_results, days):
    """导出为markdown文件"""
    out_dir = PROJECT_DIR / "articles" / "briefs"
    out_dir.mkdir(exist_ok=True)

    date_str = datetime.now().strftime("%Y%m%d")
    out_file = out_dir / f"brief-{date_str}.md"

    lines = [
        f"# 🤖 AI资讯简报 — {datetime.now().strftime('%Y年%m月%d日')}",
        f"",
        f"> 自动聚合自 {len(all_results)} 个信息源，时间窗口：{days}天",
        f"",
    ]

    for r in all_results:
        feed = r["feed"]
        entries = r["entries"]
        if not entries:
            continue

        lines.append(f"## {feed['name']} ({feed['category']})")
        lines.append(f"")
        for e in entries[:5]:  # 每个源最多5条
            lines.append(f"- [{e['title']}]({e['link']}) — *{e['published'][:10]}*")
            if e["summary"]:
                lines.append(f"  > {e['summary'][:120]}...")
        lines.append(f"")

    lines.append("---")
    lines.append(f"*由AI公众号聚合器自动生成*")

    content = "\n".join(lines)
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(content)

    return out_file


def main():
    # 简易CLI
    days = 1
    source_filter = None
    export_fmt = None

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--days" and i + 1 < len(args):
            days = int(args[i + 1])
            i += 2
        elif args[i] == "--source" and i + 1 < len(args):
            source_filter = args[i + 1]
            i += 2
        elif args[i] == "--export":
            export_fmt = args[i + 1] if i + 1 < len(args) else "markdown"
            i += 2
        else:
            i += 1

    feeds = load_feeds()
    if source_filter:
        feeds = filter_source(feeds, source_filter)
        if not feeds:
            print(f"❌ 没有找到匹配 '{source_filter}' 的源")
            return

    tracker = load_tracker()

    total_entries = 0
    all_results = []

    # 按优先级排序拉取
    priority_order = {"critical": 0, "high": 1, "medium": 2}
    feeds.sort(key=lambda f: priority_order.get(f.get("priority", "medium"), 2))

    print(f"\n{'='*60}")
    print(f"🤖 AI信息源聚合器 — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*60}")
    print(f"📡 拉取 {len(feeds)} 个源 | ⏰ 时间窗口: {days}天")
    print(f"{'='*60}\n")

    for i, feed_info in enumerate(feeds):
        print(f"[{i+1}/{len(feeds)}] 📡 {feed_info['name']}...", end=" ", flush=True)
        result = fetch_feed(feed_info, days=days)
        all_results.append(result)

        entries = result["entries"]
        total_entries += len(entries)

        if result["error"]:
            print(f"❌ {result['error'][:60]}")
        else:
            # 用emoji标记优先级
            emoji = {"critical": "🔴", "high": "🟡", "medium": "🟢"}.get(
                feed_info.get("priority", "medium"), "⚪"
            )
            print(f"{emoji} {len(entries)}条")

        # 打印每条标题
        for j, entry in enumerate(entries):
            title = entry["title"]
            # 标记是否覆盖过
            covered = entry["link"] in tracker.get("covered_urls", [])
            marker = " ✓" if covered else ""
            print(f"    {j+1}. [{entry['published'][:10]}] {title}{marker}")

    # 按优先级重新排列结果
    print(f"\n{'='*60}")
    print(f"🔴 CRITICAL 源更新汇总：")
    print(f"{'='*60}")
    for r in all_results:
        if r["feed"].get("priority") == "critical" and r["entries"]:
            print(f"\n📌 {r['feed']['name']}:")
            for e in r["entries"]:
                print(f"  → {e['title']}")
                print(f"    {e['link']}")

    print(f"\n📊 统计: 共 {total_entries} 条新内容")

    # 导出
    if export_fmt == "markdown":
        out_file = export_markdown(all_results, days)
        print(f"📝 已导出到: {out_file}")

    print(f"\n💡 下一步：")
    print(f"  1. 从上面挑一个选题")
    print(f"  2. 打开 templates/ 选模板")
    print(f"  3. 写文章 → 发布")
    print(f"  4. 更新 tracker: python scripts/update_tracker.py --add '<url>'")


if __name__ == "__main__":
    main()

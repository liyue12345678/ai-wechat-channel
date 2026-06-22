#!/usr/bin/env python3
"""
每日简报生成器
从聚合结果中提取最值得写的选题，生成可直接用的文章骨架

用法：
    python daily_brief.py              # 生成今日选题建议
    python daily_brief.py --top 5      # 只输出前5个选题
    python daily_brief.py --export     # 导出选题文章骨架到 articles/drafts/
"""

import json
import sys
import os
from datetime import datetime
from pathlib import Path

SCRIPTS_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPTS_DIR.parent
TRACKER_FILE = SCRIPTS_DIR / "tracker.json"

# 选题价值评分关键词
HIGH_VALUE_KEYWORDS = [
    "发布", "上线", "开源", "免费", "更新", "更新了", "新功能",
    "教程", "教程", "how to", "guide",
    "对比", "vs", "versus",
    "涨价", "降价", "收费", "免费",
    "launch", "release", "announce", "new", "update",
    "open source", "free", "benchmark", "comparison",
    "DeepSeek", "ChatGPT", "Claude", "Gemini", "GPT-5", "GPT-4",
    "Sora", "Midjourney", "Stable Diffusion", "Llama", "Qwen",
    "豆包", "Kimi", "文心一言", "通义千问", "智谱", "百川",
    "AI Agent", "RAG", "Fine-tune", "微调",
]

# 选题类型模板映射
TOPIC_TEMPLATES = {
    "产品发布": "tool-review.md",
    "工具更新": "tool-review.md",
    "对比评测": "comparison.md",
    "教程": "tutorial.md",
    "行业分析": "opinion.md",
    "资讯": "news-roundup.md",
}


def load_tracker():
    if not TRACKER_FILE.exists():
        return {"covered_urls": [], "covered_topics": []}
    with open(TRACKER_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def score_topic(title, summary, source_priority):
    """给选题打分"""
    text = (title + " " + summary).lower()
    score = 0
    matched_keywords = []

    for kw in HIGH_VALUE_KEYWORDS:
        if kw.lower() in text:
            score += 5
            matched_keywords.append(kw)

    # 源优先级加成
    priority_bonus = {"critical": 20, "high": 10, "medium": 5}
    score += priority_bonus.get(source_priority, 0)

    # 中文优先（公众号受众）
    if any("一" <= c <= "鿿" for c in title):
        score += 3

    return score, matched_keywords


def classify_topic(title, summary):
    """判断选题类型"""
    text = (title + " " + summary).lower()
    if any(w in text for w in ["发布", "上线", "launch", "release", "更新", "update", "新功能"]):
        return "产品发布"
    if any(w in text for w in ["对比", "vs", "versus", "测评", "实测"]):
        return "对比评测"
    if any(w in text for w in ["教程", "how to", "guide", "手把手", "教你"]):
        return "教程"
    if any(w in text for w in ["分析", "趋势", "预测", "观点", "深度"]):
        return "行业分析"
    return "资讯"


def generate_article_skeleton(topic):
    """生成文章骨架"""
    template_file = TOPIC_TEMPLATES.get(topic["type"], "tool-review.md")
    template_path = PROJECT_DIR / "templates" / template_file

    skeleton = f"""# {topic["title"]}

> 选题类型: {topic["type"]} | 信息源: {topic["source"]} | 评分: {topic["score"]}

## 核心信息
{topic["summary"]}

## 选题角度
- 角度1:
- 角度2:
- 角度3:

## 文章结构（用 {template_file} 模板）
<!-- 打开 templates/{template_file} 按结构填充 -->

## 关键配图/截图
- [ ]
- [ ]

## 参考链接
- 原文: {topic["link"]}
"""
    return skeleton


def main():
    # 简易CLI — 从标准输入读取JSON聚合结果
    top_n = 5
    export = False

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--top" and i + 1 < len(args):
            top_n = int(args[i + 1])
            i += 2
        elif args[i] == "--export":
            export = True
            i += 1
        else:
            i += 1

    print(f"\n📋 AI公众号选题推荐 — {datetime.now().strftime('%Y-%m-%d')}")
    print("=" * 60)

    # 尝试从最近一次聚合的brief文件读取
    briefs_dir = PROJECT_DIR / "articles" / "briefs"
    if briefs_dir.exists():
        brief_files = sorted(briefs_dir.glob("brief-*.md"), reverse=True)
        if brief_files:
            print(f"📂 读取最近简报: {brief_files[0].name}")
            content = brief_files[0].read_text(encoding="utf-8")
            # 简单解析出标题行
            lines = content.split("\n")
            entries = []
            current_source = ""
            for line in lines:
                if line.startswith("## "):
                    current_source = line.replace("## ", "").strip()
                elif line.startswith("- [") and "](" in line:
                    # 提取标题和链接
                    title_part = line[2:].split("](")[0]
                    link_part = line.split("](")[1].split(")")[0] if "](" in line else ""
                    entries.append({
                        "title": title_part,
                        "link": link_part,
                        "source": current_source,
                        "summary": "",
                    })
        else:
            entries = []
    else:
        entries = []

    if not entries:
        print("⚠️  暂未找到聚合数据，请先运行: python scripts/aggregator.py --export markdown")
        print("下面展示一个示例选题流程：\n")
        # 示例选题
        print("【示例】如果你今天发现DeepSeek更新了新功能：")
        print("  1. 选题: DeepSeek新功能实测")
        print("  2. 模板: templates/tool-review.md")
        print("  3. 角度: 对比更新前后效果 + 手把手使用教程")
        return

    # 评分排序
    tracker = load_tracker()
    scored = []
    for entry in entries:
        if entry["link"] in tracker.get("covered_urls", []):
            continue
        score, matched = score_topic(
            entry["title"], entry["summary"], "medium"
        )
        entry["score"] = score
        entry["matched_keywords"] = matched
        entry["type"] = classify_topic(entry["title"], entry["summary"])
        scored.append(entry)

    scored.sort(key=lambda x: x["score"], reverse=True)

    print(f"\n🎯 今日TOP {top_n} 选题：\n")
    for i, topic in enumerate(scored[:top_n]):
        icon = {10: "🔥", 7: "⭐", 5: "📌"}.get(i + 1, "  ")
        print(f"{i+1}. {icon} [{topic['type']}] {topic['title']}")
        print(f"   信息源: {topic['source']} | 评分: {topic['score']}")
        if topic["matched_keywords"]:
            print(f"   关键词: {', '.join(topic['matched_keywords'][:5])}")
        print(f"   链接: {topic['link']}")
        print()

    # 导出文章骨架
    if export and scored:
        drafts_dir = PROJECT_DIR / "articles" / "drafts"
        drafts_dir.mkdir(parents=True, exist_ok=True)

        best = scored[0]
        skeleton = generate_article_skeleton(best)
        draft_file = drafts_dir / f"draft-{datetime.now().strftime('%Y%m%d')}.md"
        with open(draft_file, "w", encoding="utf-8") as f:
            f.write(skeleton)
        print(f"📝 已导出文章骨架到: {draft_file}")
        print(f"   用模板填充后即可发布。")

    print(f"\n💡 建议: 选第1个选题，打开对应模板，30分钟内出稿")


if __name__ == "__main__":
    main()

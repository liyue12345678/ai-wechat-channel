#!/usr/bin/env python3
"""手动标记：这篇文章已经写过了"""

import json
import sys
from pathlib import Path
from datetime import datetime

TRACKER_FILE = Path(__file__).parent / "tracker.json"


def load():
    if not TRACKER_FILE.exists():
        return {"covered_urls": [], "covered_topics": [], "stats": {}}
    with open(TRACKER_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save(tracker):
    with open(TRACKER_FILE, "w", encoding="utf-8") as f:
        json.dump(tracker, f, ensure_ascii=False, indent=2)


def main():
    if len(sys.argv) < 2:
        print("用法：")
        print('  python update_tracker.py --add "<url>" "<topic>"')
        print('  python update_tracker.py --list')
        print('  python update_tracker.py --stats')
        return

    tracker = load()

    if sys.argv[1] == "--add":
        url = sys.argv[2] if len(sys.argv) > 2 else ""
        topic = sys.argv[3] if len(sys.argv) > 3 else ""
        if url and url not in tracker["covered_urls"]:
            tracker["covered_urls"].append(url)
            tracker["stats"]["total_articles"] = tracker["stats"].get("total_articles", 0) + 1
            print(f"✅ 已标记: {url}")
        if topic and topic not in tracker["covered_topics"]:
            tracker["covered_topics"].append(topic)
            print(f"✅ 已标记选题: {topic}")
        save(tracker)
        print(f"📊 累计文章数: {tracker['stats']['total_articles']}")

    elif sys.argv[1] == "--list":
        print(f"📝 已覆盖 {len(tracker['covered_urls'])} 个话题")
        for i, url in enumerate(tracker["covered_urls"][-20:]):
            print(f"  {i+1}. {url}")
        print(f"\n📊 累计文章数: {tracker['stats'].get('total_articles', 0)}")

    elif sys.argv[1] == "--stats":
        started = tracker["stats"].get("started_at", "未知")
        total = tracker["stats"].get("total_articles", 0)
        print(f"📊 公众号数据：")
        print(f"  启动日期: {started}")
        print(f"  累计发文: {total}篇")
        if started != "未知":
            days = (datetime.now() - datetime.strptime(started, "%Y-%m-%d")).days
            if days > 0:
                print(f"  平均频率: {total/days:.1f}篇/天")


if __name__ == "__main__":
    main()

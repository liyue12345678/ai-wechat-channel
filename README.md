# 🤖 AI公众号运营系统

> 一套帮你从信息采集到文章发布的完整工作流

## 项目结构

```
ai-wechat-channel/
├── README.md                   ← 你正在看的
├── sources/                    ← 信息源配置（你只需要维护这里）
│   ├── feeds.json             ← RSS源配置（18个AI信息源）
│   ├── twitter_accounts.json  ← Twitter/X必关注账号
│   ├── wechat_accounts.json   ← 同行公众号参考
│   └── websites.json          ← 每日必刷网站
├── scripts/                    ← 自动化脚本 (Node.js)
│   ├── aggregator.js          ← RSS聚合器：一键拉取所有源
│   ├── daily_brief.js         ← 每日简报生成器
│   ├── update_tracker.js      ← 手动标记已写选题
│   └── tracker.json           ← 已覆盖话题追踪（自动维护）
├── templates/                  ← 5套文章模板，直接套用
│   ├── tool-review.md         ← AI工具实测/测评
│   ├── tutorial.md            ← 手把手教程
│   ├── news-roundup.md        ← 周度/日度资讯汇总
│   ├── comparison.md          ← 横向对比评测
│   └── opinion.md             ← 观点/分析文
├── articles/                   ← 你的文章
│   └── drafts/                ← 草稿区
└── content-calendar.md        ← 内容日历
```

## 快速开始

### 1. 安装依赖
```bash
cd c:/Users/86176/Desktop/ai-wechat-channel
npm install
```

### 2. 每天早上8点，跑这个
```bash
node scripts/aggregator.js --export
```
这会拉取过去24小时所有信息源的内容，并生成一份 Markdown 简报到 `articles/briefs/`。

### 3. 生成选题
```bash
node scripts/daily_brief.js --top 5
```
从简报中自动评分选出最值得写的选题。

### 4. 有了选题后，选模板开始写
```bash
ls templates/
# 选一个模板复制到 articles/drafts/
```

### 4. 写完后移到 articles/ 发布

## 核心工作流（每天30分钟）

| 时间 | 动作 | 耗时 |
|------|------|------|
| 08:00 | 跑 aggregator.py，扫一遍今日AI新闻 | 5min |
| 08:05 | 从热点里挑1个选题，记录到 content-calendar.md | 5min |
| 08:10 | 套用模板开始写正文 | 15min |
| 08:25 | 配图、排版、定时发布 | 5min |
| 全天 | 刷 sources/websites.json 里的网站保持信息敏感度 | 碎片时间 |

## 你的定位

按照之前的讨论，建议聚焦：**AI工具实操 + 副业案例**

第一梯队选题：
- 实测对比（ChatGPT vs DeepSeek vs 豆包 干同一件事）
- 教程（用AI做XX的完整流程）
- 揭秘（XX AI工具的隐藏用法）

## 广告主类型（备查）

等你5000粉后，主动联系这些类型的广告主：
- AI工具/平台（DeepSeek、豆包、Kimi等）
- AI课程/知识付费
- 云服务/API平台
- 效率工具/软件
- 科技硬件

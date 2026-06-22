#!/usr/bin/env node
/**
 * 每日简报生成器
 * 从聚合结果中提取最值得写的选题，生成文章骨架
 *
 * 用法:
 *   node scripts/daily_brief.js              # 生成今日选题建议
 *   node scripts/daily_brief.js --top 5      # 只输出前5个
 *   node scripts/daily_brief.js --export     # 导出文章骨架
 */

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = __dirname;
const PROJECT_DIR = path.resolve(__dirname, '..');
const TRACKER_FILE = path.join(SCRIPTS_DIR, 'tracker.json');

const HIGH_VALUE_KEYWORDS = [
  '发布', '上线', '开源', '免费', '更新', '更新了', '新功能',
  '教程', 'how to', 'guide',
  '对比', 'vs', 'versus',
  '涨价', '降价', '收费',
  'launch', 'release', 'announce', 'new', 'update',
  'open source', 'free', 'benchmark', 'comparison',
  'DeepSeek', 'ChatGPT', 'Claude', 'Gemini', 'GPT-5', 'GPT-4',
  'Sora', 'Midjourney', 'Stable Diffusion', 'Llama', 'Qwen',
  '豆包', 'Kimi', '文心一言', '通义千问', '智谱', '百川',
  'AI Agent', 'RAG', 'Fine-tune', '微调',
];

const TOPIC_TEMPLATES = {
  '产品发布': 'tool-review.md',
  '工具更新': 'tool-review.md',
  '对比评测': 'comparison.md',
  '教程': 'tutorial.md',
  '行业分析': 'opinion.md',
  '资讯': 'news-roundup.md',
};

function loadTracker() {
  if (!fs.existsSync(TRACKER_FILE)) {
    return { covered_urls: [], covered_topics: [], stats: {} };
  }
  return JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf-8'));
}

function scoreTopic(title, summary, sourcePriority) {
  const text = (title + ' ' + summary).toLowerCase();
  let score = 0;
  const matched = [];

  for (const kw of HIGH_VALUE_KEYWORDS) {
    if (text.includes(kw.toLowerCase())) {
      score += 5;
      matched.push(kw);
    }
  }

  const bonus = { critical: 20, high: 10, medium: 5 };
  score += bonus[sourcePriority] || 0;

  // 中文加分
  if (/[一-鿿]/.test(title)) score += 3;

  return { score, matched };
}

function classifyTopic(title, summary) {
  const text = (title + ' ' + summary).toLowerCase();
  if (/发布|上线|launch|release|更新|update|新功能/.test(text)) return '产品发布';
  if (/对比|vs|versus|测评|实测/.test(text)) return '对比评测';
  if (/教程|how to|guide|手把手|教你/.test(text)) return '教程';
  if (/分析|趋势|预测|观点|深度/.test(text)) return '行业分析';
  return '资讯';
}

function generateSkeleton(topic) {
  const tpl = TOPIC_TEMPLATES[topic.type] || 'tool-review.md';
  return `# ${topic.title}

> 选题类型: ${topic.type} | 信息源: ${topic.source} | 评分: ${topic.score}

## 核心信息
${topic.summary}

## 选题角度
- 角度1:
- 角度2:
- 角度3:

## 文章结构（用 ${tpl} 模板）
<!-- 打开 templates/${tpl} 按结构填充 -->

## 关键配图/截图
- [ ]
- [ ]

## 参考链接
- 原文: ${topic.link}
`;
}

function main() {
  let topN = 5;
  let doExport = false;

  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--top' && args[i + 1]) {
      topN = parseInt(args[i + 1]); i++;
    } else if (args[i] === '--export') {
      doExport = true;
    }
  }

  const today = new Date().toLocaleDateString('zh-CN');
  console.log(`\n📋 AI公众号选题推荐 — ${today}`);
  console.log('='.repeat(60));

  // 读取最近的brief文件
  const briefsDir = path.join(PROJECT_DIR, 'articles', 'briefs');
  let entries = [];

  if (fs.existsSync(briefsDir)) {
    const files = fs.readdirSync(briefsDir)
      .filter(f => f.startsWith('brief-'))
      .sort()
      .reverse();

    if (files.length > 0) {
      console.log(`📂 读取最近简报: ${files[0]}`);
      const content = fs.readFileSync(path.join(briefsDir, files[0]), 'utf-8');
      const lines = content.split('\n');
      let currentSource = '';

      for (const line of lines) {
        if (line.startsWith('## ')) {
          currentSource = line.replace('## ', '').trim();
        } else if (line.startsWith('- [') && line.includes('](')) {
          const titleMatch = line.match(/- \[(.+?)\]/);
          const linkMatch = line.match(/\]\((.+?)\)/);
          if (titleMatch && linkMatch) {
            entries.push({
              title: titleMatch[1],
              link: linkMatch[1],
              source: currentSource,
              summary: '',
            });
          }
        }
      }
    }
  }

  if (entries.length === 0) {
    console.log('⚠️  暂未找到聚合数据，请先运行: node scripts/aggregator.js --export');
    console.log('\n下面展示一个示例选题流程：\n');
    console.log('【示例】如果你发现DeepSeek更新了新功能：');
    console.log('  1. 选题: DeepSeek新功能实测');
    console.log('  2. 模板: templates/tool-review.md');
    console.log('  3. 角度: 对比更新前后效果 + 手把手使用教程');
    return;
  }

  const tracker = loadTracker();
  const scored = [];

  for (const entry of entries) {
    if (tracker.covered_urls?.includes(entry.link)) continue;
    const { score, matched } = scoreTopic(entry.title, entry.summary, 'medium');
    entry.score = score;
    entry.matched_keywords = matched;
    entry.type = classifyTopic(entry.title, entry.summary);
    scored.push(entry);
  }

  scored.sort((a, b) => b.score - a.score);

  console.log(`\n🎯 今日TOP ${topN} 选题：\n`);
  for (let i = 0; i < Math.min(topN, scored.length); i++) {
    const t = scored[i];
    const icon = i === 0 ? '🔥' : i < 3 ? '⭐' : '📌';
    console.log(`${i + 1}. ${icon} [${t.type}] ${t.title}`);
    console.log(`   信息源: ${t.source} | 评分: ${t.score}`);
    if (t.matched_keywords.length > 0) {
      console.log(`   关键词: ${t.matched_keywords.slice(0, 5).join(', ')}`);
    }
    console.log(`   链接: ${t.link}`);
    console.log();
  }

  if (doExport && scored.length > 0) {
    const draftsDir = path.join(PROJECT_DIR, 'articles', 'drafts');
    if (!fs.existsSync(draftsDir)) fs.mkdirSync(draftsDir, { recursive: true });

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const draftFile = path.join(draftsDir, `draft-${dateStr}.md`);
    fs.writeFileSync(draftFile, generateSkeleton(scored[0]), 'utf-8');
    console.log(`📝 已导出文章骨架到: ${draftFile}`);
    console.log(`   用模板填充后即可发布。`);
  }

  console.log(`\n💡 建议: 选第1个选题，打开对应模板，30分钟内出稿`);
}

main();

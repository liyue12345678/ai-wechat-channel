#!/usr/bin/env node
/**
 * AI信息源聚合器 (Node.js版)
 * 每天跑一次，拉取所有RSS源的最新内容
 *
 * 用法:
 *   node scripts/aggregator.js              # 拉取过去24小时
 *   node scripts/aggregator.js --days 3     # 拉取过去3天
 *   node scripts/aggregator.js --source 量子位  # 只看某个源
 *   node scripts/aggregator.js --export      # 输出markdown简报文件
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SCRIPTS_DIR = __dirname;
const PROJECT_DIR = path.resolve(__dirname, '..');
const FEEDS_FILE = path.join(PROJECT_DIR, 'sources', 'feeds.json');
const TRACKER_FILE = path.join(SCRIPTS_DIR, 'tracker.json');

let RssParser;
try {
  RssParser = require('rss-parser');
} catch {
  console.log('❌ 需要安装 rss-parser，正在自动安装...');
  execSync('npm install', { cwd: PROJECT_DIR, stdio: 'inherit' });
  RssParser = require('rss-parser');
}

const parser = new RssParser({
  timeout: 15000,
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AI-News-Bot/1.0)' },
});

function loadFeeds() {
  const data = JSON.parse(fs.readFileSync(FEEDS_FILE, 'utf-8'));
  return data.feeds;
}

function loadTracker() {
  if (!fs.existsSync(TRACKER_FILE)) {
    return { covered_urls: [], covered_topics: [], stats: {} };
  }
  return JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf-8'));
}

async function fetchFeed(feedInfo, days = 1) {
  try {
    const feed = await parser.parseURL(feedInfo.url);
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    const entries = (feed.items || [])
      .filter((item) => {
        const pubDate = item.pubDate ? new Date(item.pubDate).getTime() : Date.now();
        return pubDate >= cutoff;
      })
      .map((item) => ({
        title: item.title || '无标题',
        link: item.link || '',
        published: item.pubDate || '未知',
        summary: (item.contentSnippet || item.summary || '').slice(0, 300),
      }));

    return { feed: feedInfo, entries, error: null };
  } catch (err) {
    return { feed: feedInfo, entries: [], error: err.message };
  }
}

function exportMarkdown(allResults, days) {
  const briefsDir = path.join(PROJECT_DIR, 'articles', 'briefs');
  if (!fs.existsSync(briefsDir)) fs.mkdirSync(briefsDir, { recursive: true });

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const outFile = path.join(briefsDir, `brief-${dateStr}.md`);

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  let md = `# 🤖 AI资讯简报 — ${today}\n\n`;
  md += `> 自动聚合自 ${allResults.length} 个信息源，时间窗口：${days}天\n\n`;

  for (const r of allResults) {
    const { feed, entries } = r;
    if (entries.length === 0) continue;

    md += `## ${feed.name} (${feed.category})\n\n`;
    for (const e of entries.slice(0, 5)) {
      const dateLabel = typeof e.published === 'string'
        ? e.published.slice(0, 10)
        : new Date(e.published).toISOString().slice(0, 10);
      md += `- [${e.title}](${e.link}) — *${dateLabel}*\n`;
      if (e.summary) md += `  > ${e.summary.slice(0, 120)}...\n`;
    }
    md += '\n';
  }

  md += '---\n*由AI公众号聚合器自动生成*\n';
  fs.writeFileSync(outFile, md, 'utf-8');
  return outFile;
}

async function main() {
  let days = 1;
  let sourceFilter = null;
  let doExport = false;

  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--days' && args[i + 1]) {
      days = parseInt(args[i + 1]); i++;
    } else if (args[i] === '--source' && args[i + 1]) {
      sourceFilter = args[i + 1]; i++;
    } else if (args[i] === '--export') {
      doExport = true;
    }
  }

  let feeds = loadFeeds();
  if (sourceFilter) {
    feeds = feeds.filter((f) => f.name.includes(sourceFilter));
    if (feeds.length === 0) {
      console.log(`❌ 没有找到匹配 '${sourceFilter}' 的源`);
      return;
    }
  }

  const tracker = loadTracker();
  const priorityOrder = { critical: 0, high: 1, medium: 2 };
  feeds.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));

  const now = new Date().toLocaleString('zh-CN');
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🤖 AI信息源聚合器 — ${now}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`📡 拉取 ${feeds.length} 个源 | ⏰ 时间窗口: ${days}天`);
  console.log(`${'='.repeat(60)}\n`);

  let totalEntries = 0;
  const allResults = [];

  for (let i = 0; i < feeds.length; i++) {
    const feedInfo = feeds[i];
    process.stdout.write(`[${i + 1}/${feeds.length}] 📡 ${feedInfo.name}... `);
    const result = await fetchFeed(feedInfo, days);
    allResults.push(result);

    const { entries, error } = result;
    totalEntries += entries.length;

    if (error) {
      console.log(`❌ ${error.slice(0, 60)}`);
    } else {
      const emoji = { critical: '🔴', high: '🟡', medium: '🟢' }[feedInfo.priority] || '⚪';
      console.log(`${emoji} ${entries.length}条`);
    }

    for (let j = 0; j < entries.length; j++) {
      const e = entries[j];
      const dateLabel = typeof e.published === 'string'
        ? e.published.slice(0, 10)
        : new Date(e.published).toISOString().slice(0, 10);
      const covered = tracker.covered_urls?.includes(e.link) ? ' ✓' : '';
      console.log(`    ${j + 1}. [${dateLabel}] ${e.title}${covered}`);
    }
  }

  // 展示 critical 源汇总
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔴 CRITICAL 源更新汇总：`);
  console.log(`${'='.repeat(60)}`);
  for (const r of allResults) {
    if (r.feed.priority === 'critical' && r.entries.length > 0) {
      console.log(`\n📌 ${r.feed.name}:`);
      for (const e of r.entries) {
        console.log(`  → ${e.title}`);
        console.log(`    ${e.link}`);
      }
    }
  }

  console.log(`\n📊 统计: 共 ${totalEntries} 条新内容`);

  if (doExport) {
    const outFile = exportMarkdown(allResults, days);
    console.log(`📝 已导出到: ${outFile}`);
  }

  console.log(`\n💡 下一步：`);
  console.log(`  1. 从上面挑一个选题`);
  console.log(`  2. 打开 templates/ 选模板`);
  console.log(`  3. 写文章 → 发布`);
}

main().catch((err) => {
  console.error('❌ 运行出错:', err.message);
  process.exit(1);
});

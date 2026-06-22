#!/usr/bin/env node
/** 手动标记：已写过的选题 */

const fs = require('fs');
const path = require('path');
const TRACKER_FILE = path.join(__dirname, 'tracker.json');

function load() {
  if (!fs.existsSync(TRACKER_FILE)) {
    return { covered_urls: [], covered_topics: [], stats: { started_at: new Date().toISOString().slice(0, 10) } };
  }
  return JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf-8'));
}

function save(tracker) {
  fs.writeFileSync(TRACKER_FILE, JSON.stringify(tracker, null, 2), 'utf-8');
}

const args = process.argv.slice(2);
const tracker = load();

if (args.length === 0) {
  console.log('用法：');
  console.log('  node scripts/update_tracker.js --add "<url>" "<topic>"');
  console.log('  node scripts/update_tracker.js --list');
  console.log('  node scripts/update_tracker.js --stats');
  process.exit(0);
}

if (args[0] === '--add') {
  const url = args[1] || '';
  const topic = args[2] || '';

  if (url && !tracker.covered_urls.includes(url)) {
    tracker.covered_urls.push(url);
    tracker.stats.total_articles = (tracker.stats.total_articles || 0) + 1;
    console.log(`✅ 已标记: ${url}`);
  }
  if (topic && !tracker.covered_topics.includes(topic)) {
    tracker.covered_topics.push(topic);
    console.log(`✅ 已标记选题: ${topic}`);
  }
  save(tracker);
  console.log(`📊 累计文章数: ${tracker.stats.total_articles}`);
} else if (args[0] === '--list') {
  console.log(`📝 已覆盖 ${tracker.covered_urls.length} 个话题`);
  tracker.covered_urls.slice(-20).forEach((url, i) => {
    console.log(`  ${i + 1}. ${url}`);
  });
  console.log(`\n📊 累计文章数: ${tracker.stats.total_articles || 0}`);
} else if (args[0] === '--stats') {
  const started = tracker.stats.started_at || '未知';
  const total = tracker.stats.total_articles || 0;
  console.log('📊 公众号数据：');
  console.log(`  启动日期: ${started}`);
  console.log(`  累计发文: ${total}篇`);
  if (started !== '未知') {
    const days = Math.floor((Date.now() - new Date(started).getTime()) / 86400000);
    if (days > 0) console.log(`  平均频率: ${(total / days).toFixed(1)}篇/天`);
  }
}

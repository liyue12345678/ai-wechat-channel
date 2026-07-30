const pptxgen = require("pptxgenjs");
const path = require("path");

const pptx = new pptxgen();

// ====== 全局主题设置 ======
const DARK_BG = "1a1a2e";
const DARK_CARD = "16213e";
const ACCENT_CYAN = "00D4FF";
const ACCENT_ORANGE = "FF6B35";
const ACCENT_GREEN = "2ECC71";
const ACCENT_RED = "E74C3C";
const ACCENT_PURPLE = "9B59B6";
const WHITE = "FFFFFF";
const LIGHT_GRAY = "BDC3C7";
const DIM_GRAY = "7F8C8D";

const Shape = pptx.shapes;

pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
pptx.layout = "WIDE";

// ====== 辅助函数 ======
function bg(slide, color = DARK_BG) {
  slide.background = { color };
}

function h1(slide, text, opts = {}) {
  slide.addText(text, {
    x: 0.8, y: opts.y || 0.6, w: 11.7, h: 0.9,
    fontSize: 36, fontFace: "Microsoft YaHei", bold: true,
    color: WHITE, align: "left", ...opts
  });
}

function body(slide, text, opts = {}) {
  slide.addText(text, {
    x: 0.8, y: opts.y || 2.4, w: opts.w || 11.7, h: opts.h || 0.5,
    fontSize: 16, fontFace: "Microsoft YaHei",
    color: LIGHT_GRAY, align: "left", lineSpacing: 28, ...opts
  });
}

function cardText(slide, x, y, w, h, title, desc) {
  slide.addShape(Shape.RECTANGLE, { x, y, w, h, fill: { color: DARK_CARD }, rectRadius: 0.15 });
  slide.addText(title, { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.45, fontSize: 16, fontFace: "Microsoft YaHei", bold: true, color: ACCENT_CYAN });
  slide.addText(desc, { x: x + 0.2, y: y + 0.55, w: w - 0.4, h: h - 0.7, fontSize: 12, fontFace: "Microsoft YaHei", color: LIGHT_GRAY, lineSpacing: 20 });
}

function accentLine(slide, x, y, w, color = ACCENT_CYAN) {
  slide.addShape(Shape.RECTANGLE, { x, y, w, h: 0.04, fill: { color } });
}

function footer(slide, text = "AI元思 · 公众号运营系统") {
  slide.addText(text, { x: 0.8, y: 7.0, w: 11.7, h: 0.35, fontSize: 10, fontFace: "Microsoft YaHei", color: DIM_GRAY, align: "center" });
}

function sectionNumber(slide, num) {
  slide.addText(String(num).padStart(2, "0"), {
    x: 0.8, y: 0.3, w: 1.5, h: 0.8,
    fontSize: 48, fontFace: "Consolas", bold: true,
    color: ACCENT_CYAN, align: "left", transparency: 60
  });
}

function divider(slide) {
  slide.addShape(Shape.RECTANGLE, { x: 0.8, y: 1.45, w: 0.6, h: 0.04, fill: { color: ACCENT_CYAN } });
}

function centerText(slide, text, opts = {}) {
  slide.addText(text, { x: 0.8, y: 3.0, w: 11.7, h: 2.0, fontSize: 24, fontFace: "Microsoft YaHei", color: WHITE, align: "center", ...opts });
}

// ====== 幻灯片 ======

// --- SLIDE 1: 封面 ---
{
  const s = pptx.addSlide();
  bg(s);
  s.addShape(Shape.OVAL, { x: 7.5, y: -1.5, w: 7, h: 7, fill: { color: ACCENT_CYAN }, transparency: 92 });
  s.addShape(Shape.OVAL, { x: 9, y: 3, w: 5, h: 5, fill: { color: ACCENT_ORANGE }, transparency: 94 });
  s.addText("AI\n元思", { x: 0.8, y: 1.2, w: 6, h: 3.5, fontSize: 72, fontFace: "Microsoft YaHei", bold: true, color: WHITE, lineSpacing: 90 });
  accentLine(s, 0.8, 4.8, 1.5);
  s.addText("AI公众号运营系统 · 项目介绍", { x: 0.8, y: 5.1, w: 6, h: 0.6, fontSize: 20, fontFace: "Microsoft YaHei", color: LIGHT_GRAY });
  s.addText("用工程化思维做内容，把公众号当成产品运营", { x: 0.8, y: 5.7, w: 6, h: 0.5, fontSize: 14, fontFace: "Microsoft YaHei", color: DIM_GRAY });
  footer(s, "2026年7月");
}

// --- SLIDE 2: 痛点 ---
{
  const s = pptx.addSlide();
  bg(s);
  sectionNumber(s, 1);
  h1(s, "做AI内容，你一定会遇到的三个问题");
  divider(s);
  const cards = [
    { title: "❓ 写什么？", desc: "每天AI行业几百条新闻，技术论文堆成山。哪条值得写？哪条读者爱看？选题困难是内容创作者的头号杀手。" },
    { title: "✍️ 怎么写？", desc: "文章质量忽高忽低。灵感来了写出爆款，状态差了划水凑数。没有标准化的生产流程，质量全靠运气。" },
    { title: "📊 如何坚持？", desc: "写了几个月没涨粉，热点追不完，精力跟不上。没有系统支撑，内容创作就是一场消耗战。" }
  ];
  cards.forEach((c, i) => { cardText(s, 0.8 + i * 4.0, 2.1, 3.7, 2.8, c.title, c.desc); });
  body(s, "这些问题本质上是同一个答案：缺少一套系统化的内容运营体系。", { y: 5.4, color: ACCENT_CYAN, bold: true, fontSize: 17 });
  footer(s);
}

// --- SLIDE 3: 核心思路 ---
{
  const s = pptx.addSlide();
  bg(s);
  sectionNumber(s, 2);
  h1(s, "核心思路：工程化思维 × 内容创作");
  divider(s);
  centerText(s, "\"不用比别人聪明，只要比别人系统。\"", { fontSize: 28, color: ACCENT_CYAN, bold: true, italic: true });
  const pillars = ["信息采集\n自动化", "选题决策\n标准化", "模板生产\n流程化", "品牌体系\n前置化"];
  pillars.forEach((p, i) => {
    const x = 0.8 + i * 3.1;
    s.addShape(Shape.RECTANGLE, { x, y: 4.2, w: 2.7, h: 2.0, fill: { color: DARK_CARD }, rectRadius: 0.15 });
    s.addShape(Shape.RECTANGLE, { x, y: 4.2, w: 2.7, h: 0.06, fill: { color: ACCENT_CYAN } });
    s.addText(p, { x, y: 4.5, w: 2.7, h: 1.5, fontSize: 16, fontFace: "Microsoft YaHei", bold: true, color: WHITE, align: "center", lineSpacing: 30 });
  });
  footer(s);
}

// --- SLIDE 4: 项目定位 ---
{
  const s = pptx.addSlide();
  bg(s);
  sectionNumber(s, 3);
  h1(s, "项目定位：让普通人用好AI");
  divider(s);
  body(s, "\"用数据说话，让每个普通人都能用好AI\"", { y: 2.4, fontSize: 20, color: ACCENT_CYAN, bold: true });
  body(s, "我们不做\"行业发生了什么\"的资讯搬运工，而是回答\"对你意味着什么，你该怎么用\"。", { y: 3.2, w: 11.7, fontSize: 15 });
  const rows = [
    ["维度", "传统AI媒体", "AI元思"],
    ["视角", "行业视角 · 偏技术", "用户视角 · 偏实用"],
    ["内容形态", "一次性资讯", "系列化 · 可收藏的工具箱"],
    ["语气", "官方口吻 · 零观点", "真人实测 · 有主观判断"],
    ["核心问题", "\"发生了什么\"", "\"你该怎么用\""]
  ];
  const tblY = 4.0;
  rows.forEach((row, i) => {
    s.addShape(Shape.RECTANGLE, { x: 1.2, y: tblY + i * 0.52, w: 10.9, h: 0.5, fill: { color: i === 0 ? ACCENT_CYAN : (i % 2 === 0 ? "1e2d4a" : DARK_CARD) } });
    s.addText(row[0], { x: 1.4, y: tblY + i * 0.52, w: 3.2, h: 0.5, fontSize: 13, fontFace: "Microsoft YaHei", color: i === 0 ? DARK_BG : LIGHT_GRAY, bold: i === 0, align: "center" });
    s.addText(row[1], { x: 4.7, y: tblY + i * 0.52, w: 3.5, h: 0.5, fontSize: 13, fontFace: "Microsoft YaHei", color: i === 0 ? DARK_BG : DIM_GRAY, align: "center" });
    s.addText(row[2], { x: 8.3, y: tblY + i * 0.52, w: 3.5, h: 0.5, fontSize: 13, fontFace: "Microsoft YaHei", color: i === 0 ? DARK_BG : ACCENT_CYAN, align: "center", bold: i > 0 });
  });
  footer(s);
}

// --- SLIDE 5: 目标受众与平台 ---
{
  const s = pptx.addSlide();
  bg(s);
  h1(s, "目标受众 & 分发平台");
  divider(s);
  // 左：受众
  s.addShape(Shape.RECTANGLE, { x: 0.8, y: 2.1, w: 5.6, h: 4.2, fill: { color: DARK_CARD }, rectRadius: 0.15 });
  s.addText("🎯 目标受众", { x: 1.1, y: 2.3, w: 5.0, h: 0.5, fontSize: 18, fontFace: "Microsoft YaHei", bold: true, color: ACCENT_CYAN });
  ["想用AI提升效率的职场人", "不知道该选哪个AI工具的纠结者", "想跟AI趋势但不想读论文的普通人", "对AI有好奇心的自由职业者/学生"].forEach((a, i) => {
    s.addText("▶ " + a, { x: 1.4, y: 3.1 + i * 0.6, w: 4.8, h: 0.45, fontSize: 13, fontFace: "Microsoft YaHei", color: LIGHT_GRAY });
  });
  // 右：平台
  s.addShape(Shape.RECTANGLE, { x: 6.9, y: 2.1, w: 5.6, h: 4.2, fill: { color: DARK_CARD }, rectRadius: 0.15 });
  s.addText("📡 分发平台", { x: 7.2, y: 2.3, w: 5.0, h: 0.5, fontSize: 18, fontFace: "Microsoft YaHei", bold: true, color: ACCENT_ORANGE });
  const platforms = [
    { label: "公众号", desc: "主平台 · 深度长文" },
    { label: "小红书", desc: "副平台 · 短文导流" },
    { label: "即刻", desc: "社区互动 · 即时反馈" }
  ];
  platforms.forEach((p, i) => {
    s.addShape(Shape.RECTANGLE, { x: 7.2, y: 3.1 + i * 0.85, w: 5.0, h: 0.7, fill: { color: DARK_BG }, rectRadius: 0.1 });
    s.addText(p.label, { x: 7.5, y: 3.15 + i * 0.85, w: 2.0, h: 0.6, fontSize: 14, fontFace: "Microsoft YaHei", bold: true, color: WHITE });
    s.addText(p.desc, { x: 9.2, y: 3.15 + i * 0.85, w: 2.8, h: 0.6, fontSize: 12, fontFace: "Microsoft YaHei", color: DIM_GRAY });
  });
  footer(s);
}

// --- SLIDE 6: 系统架构总览 ---
{
  const s = pptx.addSlide();
  bg(s);
  sectionNumber(s, 4);
  h1(s, "系统架构：四层内容生产体系");
  divider(s);
  const layers = [
    { label: "Layer 1", title: "信息采集层", details: "OpenAI / Anthropic / 量子位 / 机器之心 / Hacker News / Product Hunt…", color: ACCENT_CYAN, y: 2.1 },
    { label: "Layer 2", title: "选题决策层", details: "30+高价值关键词 · 5大分类自动匹配 · 模板智能推荐", color: ACCENT_GREEN, y: 3.3 },
    { label: "Layer 3", title: "内容生产层", details: "实测 · 教程 · 对比 · 观点 · 周报 — 每套模板含标题公式+结构+检查清单", color: ACCENT_ORANGE, y: 4.5 },
    { label: "Layer 4", title: "发布运营层", details: "公众号(主) → 小红书(副) → 即刻(社区) · 2小时评论回复 · 打开率监控", color: ACCENT_PURPLE, y: 5.7 }
  ];
  layers.forEach(l => {
    s.addShape(Shape.RECTANGLE, { x: 0.8, y: l.y, w: 11.7, h: 1.0, fill: { color: DARK_CARD }, rectRadius: 0.12 });
    s.addShape(Shape.RECTANGLE, { x: 0.8, y: l.y, w: 0.08, h: 1.0, fill: { color: l.color } });
    s.addText(l.label, { x: 1.1, y: l.y + 0.1, w: 1.3, h: 0.35, fontSize: 10, fontFace: "Consolas", color: l.color, bold: true });
    s.addText(l.title, { x: 1.1, y: l.y + 0.35, w: 2.5, h: 0.45, fontSize: 15, fontFace: "Microsoft YaHei", bold: true, color: WHITE });
    s.addText(l.details, { x: 3.7, y: l.y + 0.1, w: 8.5, h: 0.8, fontSize: 11, fontFace: "Microsoft YaHei", color: LIGHT_GRAY, valign: "middle" });
  });
  footer(s);
}

// --- SLIDE 7: 信息采集层 ---
{
  const s = pptx.addSlide();
  bg(s);
  h1(s, "信息采集层：22个RSS源 × 3个自动化脚本");
  divider(s);
  const cats = [
    { label: "🔴 官方动态 (4)", items: "OpenAI · Anthropic · Google DeepMind · Meta AI", color: ACCENT_RED, y: 2.1 },
    { label: "🟡 科技媒体 (8)", items: "Hacker News · The Verge · TechCrunch · 量子位 · 机器之心 · 36氪 · 少数派 · Product Hunt", color: ACCENT_ORANGE, y: 3.0 },
    { label: "🟢 社区/论文 (10)", items: "Reddit r/ChatGPT · ArXiv · GitHub Trending · 极客公园 · 虎嗅", color: ACCENT_GREEN, y: 3.9 }
  ];
  cats.forEach(c => {
    s.addShape(Shape.RECTANGLE, { x: 0.8, y: c.y, w: 7.5, h: 0.75, fill: { color: DARK_CARD }, rectRadius: 0.1 });
    s.addText(c.label, { x: 1.0, y: c.y + 0.05, w: 3.5, h: 0.35, fontSize: 13, fontFace: "Microsoft YaHei", bold: true, color: c.color });
    s.addText(c.items, { x: 1.0, y: c.y + 0.35, w: 7.0, h: 0.35, fontSize: 10, fontFace: "Microsoft YaHei", color: LIGHT_GRAY });
  });
  // Right side: scripts
  s.addShape(Shape.RECTANGLE, { x: 8.7, y: 2.1, w: 3.8, h: 4.2, fill: { color: DARK_CARD }, rectRadius: 0.15 });
  s.addText("⚡ 自动化脚本", { x: 8.9, y: 2.3, w: 3.4, h: 0.5, fontSize: 16, fontFace: "Microsoft YaHei", bold: true, color: ACCENT_CYAN });
  [
    { name: "aggregator.js", desc: "RSS聚合 · 生成每日简报" },
    { name: "daily_brief.js", desc: "选题推荐 · 自动评分分类" },
    { name: "update_tracker.js", desc: "话题追踪 · 防重复覆盖" }
  ].forEach((sc, i) => {
    s.addText("▸ " + sc.name, { x: 9.0, y: 3.0 + i * 1.05, w: 3.2, h: 0.35, fontSize: 12, fontFace: "Consolas", bold: true, color: ACCENT_CYAN });
    s.addText(sc.desc, { x: 9.0, y: 3.3 + i * 1.05, w: 3.2, h: 0.3, fontSize: 11, fontFace: "Microsoft YaHei", color: LIGHT_GRAY });
  });
  body(s, "每天早上8:00 → 5分钟拉取22个源 → 自动按优先级排序 → 输出每日简报", { x: 0.8, y: 5.2, w: 7.5, fontSize: 14, color: ACCENT_CYAN });
  footer(s);
}

// --- SLIDE 8: 内容生产层 - 模板 ---
{
  const s = pptx.addSlide();
  bg(s);
  h1(s, "内容生产层：5套模板 · 固定栏目体系");
  divider(s);
  const temps = [
    { icon: "🔬", name: "工具实测", day: "周一", words: "1500-2500字", value: "实操类 · 高转发", color: ACCENT_CYAN },
    { icon: "📖", name: "手把手教程", day: "周三", words: "2000-3500字", value: "收藏率最高", color: ACCENT_GREEN },
    { icon: "⚔️", name: "横向对比", day: "周五", words: "2000-3000字", value: "爆款率最高", color: ACCENT_ORANGE },
    { icon: "💭", name: "观点分析", day: "灵活", words: "1500-2500字", value: "最利建IP", color: ACCENT_RED },
    { icon: "📰", name: "AI周报", day: "周日", words: "1500-2500字", value: "养成阅读习惯", color: ACCENT_PURPLE }
  ];
  temps.forEach((t, i) => {
    const y = 2.1 + i * 0.98;
    s.addShape(Shape.RECTANGLE, { x: 0.8, y, w: 11.7, h: 0.82, fill: { color: DARK_CARD }, rectRadius: 0.1 });
    s.addShape(Shape.RECTANGLE, { x: 0.8, y, w: 0.07, h: 0.82, fill: { color: t.color } });
    s.addText(t.icon, { x: 1.1, y: y + 0.12, w: 0.6, h: 0.55, fontSize: 22 });
    s.addText(t.name, { x: 1.8, y: y + 0.08, w: 2.2, h: 0.4, fontSize: 16, fontFace: "Microsoft YaHei", bold: true, color: WHITE });
    s.addText(t.day + "发布", { x: 4.2, y: y + 0.08, w: 1.3, h: 0.4, fontSize: 13, fontFace: "Microsoft YaHei", color: t.color });
    s.addText(t.words, { x: 5.8, y: y + 0.08, w: 2.0, h: 0.4, fontSize: 12, fontFace: "Microsoft YaHei", color: LIGHT_GRAY });
    s.addText(t.value, { x: 8.5, y: y + 0.08, w: 3.5, h: 0.4, fontSize: 13, fontFace: "Microsoft YaHei", color: ACCENT_CYAN, bold: true });
    s.addText("标题公式 + 正文结构 + 发布检查清单", { x: 1.8, y: y + 0.45, w: 6.0, h: 0.3, fontSize: 10, fontFace: "Microsoft YaHei", color: DIM_GRAY });
  });
  footer(s);
}

// --- SLIDE 9: 30分钟工作流 ---
{
  const s = pptx.addSlide();
  bg(s);
  sectionNumber(s, 5);
  h1(s, "每日工作流：30分钟极速生产");
  divider(s);
  const steps = [
    { time: "08:00", action: "拉取RSS信息源", tool: "aggregator.js", duration: "5min", y: 2.1 },
    { time: "08:05", action: "扫读简报 · 挑选选题", tool: "人工筛选", duration: "5min", y: 3.1 },
    { time: "08:10", action: "套用模板写正文", tool: "5套模板", duration: "15min", y: 4.1 },
    { time: "08:25", action: "配图 · 排版 · 定时发布", tool: "Canva + 公众号后台", duration: "5min", y: 5.1 }
  ];
  steps.forEach(st => {
    s.addShape(Shape.RECTANGLE, { x: 0.8, y: st.y, w: 11.7, h: 0.85, fill: { color: DARK_CARD }, rectRadius: 0.12 });
    s.addShape(Shape.RECTANGLE, { x: 0.8, y: st.y, w: 1.4, h: 0.85, fill: { color: DARK_BG } });
    s.addText(st.time, { x: 0.8, y: st.y + 0.1, w: 1.4, h: 0.65, fontSize: 18, fontFace: "Consolas", bold: true, color: ACCENT_CYAN, align: "center" });
    s.addText(st.action, { x: 2.5, y: st.y + 0.1, w: 4.5, h: 0.45, fontSize: 16, fontFace: "Microsoft YaHei", bold: true, color: WHITE });
    s.addText("工具：" + st.tool, { x: 2.5, y: st.y + 0.5, w: 4.0, h: 0.3, fontSize: 11, fontFace: "Microsoft YaHei", color: DIM_GRAY });
    s.addText(st.duration, { x: 10.5, y: st.y + 0.1, w: 1.7, h: 0.65, fontSize: 20, fontFace: "Consolas", bold: true, color: ACCENT_ORANGE, align: "center" });
    if (st.y < 5.1) {
      s.addText("↓", { x: 1.2, y: st.y + 0.85, w: 0.6, h: 0.25, fontSize: 16, fontFace: "Microsoft YaHei", color: ACCENT_CYAN, align: "center" });
    }
  });
  body(s, "技术栈极简：只需1个npm包（rss-parser）· 无数据库 · 无后端 · Markdown管理一切", { y: 6.2, fontSize: 14, color: ACCENT_CYAN });
  footer(s);
}

// --- SLIDE 10: 品牌体系 ---
{
  const s = pptx.addSlide();
  bg(s);
  sectionNumber(s, 6);
  h1(s, "品牌体系：从第一天开始建设");
  divider(s);
  // 品牌调性
  s.addShape(Shape.RECTANGLE, { x: 0.8, y: 2.1, w: 5.6, h: 2.5, fill: { color: DARK_CARD }, rectRadius: 0.15 });
  s.addText("🎨 品牌调性", { x: 1.1, y: 2.3, w: 5.0, h: 0.5, fontSize: 18, fontFace: "Microsoft YaHei", bold: true, color: ACCENT_CYAN });
  ["真实", "数据驱动", "不装", "有态度"].forEach((t, i) => {
    s.addShape(Shape.RECTANGLE, { x: 1.1 + i * 1.35, y: 3.1, w: 1.15, h: 1.0, fill: { color: DARK_BG }, rectRadius: 0.1 });
    s.addText(t, { x: 1.1 + i * 1.35, y: 3.2, w: 1.15, h: 0.8, fontSize: 16, fontFace: "Microsoft YaHei", bold: true, color: WHITE, align: "center" });
  });
  // 权威公式
  s.addShape(Shape.RECTANGLE, { x: 6.9, y: 2.1, w: 5.6, h: 2.5, fill: { color: DARK_CARD }, rectRadius: 0.15 });
  s.addText("✅ 权威内容公式（每篇至少命中3个）", { x: 7.2, y: 2.3, w: 5.0, h: 0.5, fontSize: 14, fontFace: "Microsoft YaHei", bold: true, color: ACCENT_ORANGE });
  [
    { icon: "🔢", name: "数据", desc: "具体数字，不写\"很多\"" },
    { icon: "🧪", name: "实测", desc: "真机截图，非官方图" },
    { icon: "📚", name: "引用", desc: "原始来源+链接" },
    { icon: "⚖️", name: "双面", desc: "优缺点都讲" },
    { icon: "🗓️", name: "时效", desc: "标注测试时间+版本" }
  ].forEach((a, i) => {
    s.addText(a.icon + " " + a.name + ": " + a.desc, { x: 7.2, y: 3.0 + i * 0.32, w: 5.0, h: 0.3, fontSize: 11, fontFace: "Microsoft YaHei", color: LIGHT_GRAY });
  });
  // 视觉规范
  s.addShape(Shape.RECTANGLE, { x: 0.8, y: 5.0, w: 11.7, h: 1.8, fill: { color: DARK_CARD }, rectRadius: 0.15 });
  s.addText("🎯 视觉规范", { x: 1.1, y: 5.1, w: 11.0, h: 0.5, fontSize: 16, fontFace: "Microsoft YaHei", bold: true, color: WHITE });
  const visColors = [
    { color: ACCENT_CYAN, label: "实测 #00D4FF" },
    { color: ACCENT_GREEN, label: "教程 #2ECC71" },
    { color: ACCENT_ORANGE, label: "对比 #FF6B35" },
    { color: ACCENT_RED, label: "观点 #E74C3C" },
    { color: ACCENT_PURPLE, label: "周报 #9B59B6" }
  ];
  visColors.forEach((vc, i) => {
    s.addShape(Shape.RECTANGLE, { x: 1.1 + i * 2.3, y: 5.7, w: 2.0, h: 0.5, fill: { color: vc.color }, rectRadius: 0.08 });
    s.addText(vc.label, { x: 1.1 + i * 2.3, y: 5.7, w: 2.0, h: 0.5, fontSize: 10, fontFace: "Microsoft YaHei", color: WHITE, align: "center", bold: true });
  });
  body(s, "封面：900×383px · 深蓝/黑底+亮色文字  |  正文：15px字号 · 1.75行距 · 每300字一图", { y: 6.35, fontSize: 11, w: 11.2 });
  footer(s);
}

// --- SLIDE 11: 成果数据 ---
{
  const s = pptx.addSlide();
  bg(s);
  sectionNumber(s, 7);
  h1(s, "成果数据：系统化运营的验证");
  divider(s);
  const stats = [
    { num: "16天", label: "连续日更天数", x: 0.8, color: ACCENT_CYAN },
    { num: "14篇", label: "累计原创文章", x: 3.2, color: ACCENT_GREEN },
    { num: "22个", label: "RSS信息源", x: 5.6, color: ACCENT_ORANGE },
    { num: "5套", label: "标准化模板", x: 8.0, color: ACCENT_RED },
    { num: "30min", label: "日均耗时", x: 10.4, color: ACCENT_PURPLE }
  ];
  stats.forEach(st => {
    s.addShape(Shape.RECTANGLE, { x: st.x, y: 2.3, w: 2.1, h: 2.0, fill: { color: DARK_CARD }, rectRadius: 0.15 });
    s.addText(st.num, { x: st.x, y: 2.5, w: 2.1, h: 1.0, fontSize: 36, fontFace: "Consolas", bold: true, color: st.color, align: "center" });
    s.addText(st.label, { x: st.x, y: 3.5, w: 2.1, h: 0.5, fontSize: 12, fontFace: "Microsoft YaHei", color: LIGHT_GRAY, align: "center" });
  });
  [
    "🎯 固定栏目 5个：实测 · 教程 · 对比 · 观点 · 周报",
    "📡 多平台分发：公众号（主）+ 小红书（副）+ 即刻（社区）",
    "📅 启动时间：2026年6月21日 · 至今无断更",
    "🔧 极简技术栈：1个npm包 · Node.js · Markdown"
  ].forEach((item, i) => {
    s.addText(item, { x: 0.8, y: 4.7 + i * 0.45, w: 11.7, h: 0.4, fontSize: 13, fontFace: "Microsoft YaHei", color: LIGHT_GRAY });
  });
  footer(s);
}

// --- SLIDE 12: 代表性文章 ---
{
  const s = pptx.addSlide();
  bg(s);
  h1(s, "代表性内容产出");
  divider(s);
  const articles = [
    { title: "AI写文章实测：DeepSeek vs ChatGPT vs 豆包谁更强", type: "对比类爆款", color: ACCENT_ORANGE },
    { title: "Vibe Coding全流程教程：不会写代码也能做App", type: "教程类 · 高收藏", color: ACCENT_GREEN },
    { title: "AI这么强，初级程序员还有必要存在吗？", type: "观点类 · 高转发", color: ACCENT_RED },
    { title: "用AI做小红书爆款封面（全流程）", type: "实操类 · 精准切入", color: ACCENT_CYAN },
    { title: "免费AI编程助手实测：Cursor vs Copilot vs 通义灵码", type: "工具实测 · 覆盖面广", color: ACCENT_CYAN },
    { title: "用AI帮你做数据分析：Excel+AI实操教程", type: "教程类 · 实用性强", color: ACCENT_GREEN }
  ];
  articles.forEach((a, i) => {
    const y = 2.1 + i * 0.78;
    s.addShape(Shape.RECTANGLE, { x: 0.8, y, w: 11.7, h: 0.65, fill: { color: DARK_CARD }, rectRadius: 0.1 });
    s.addShape(Shape.RECTANGLE, { x: 0.8, y, w: 0.07, h: 0.65, fill: { color: a.color } });
    s.addText("0" + (i + 1), { x: 1.1, y: y + 0.08, w: 0.5, h: 0.5, fontSize: 16, fontFace: "Consolas", bold: true, color: a.color });
    s.addText(a.title, { x: 1.7, y: y + 0.08, w: 7.8, h: 0.5, fontSize: 14, fontFace: "Microsoft YaHei", bold: true, color: WHITE });
    s.addShape(Shape.RECTANGLE, { x: 10.0, y: y + 0.15, w: 2.2, h: 0.35, fill: { color: a.color }, rectRadius: 0.08 });
    s.addText(a.type, { x: 10.0, y: y + 0.15, w: 2.2, h: 0.35, fontSize: 10, fontFace: "Microsoft YaHei", color: WHITE, align: "center", bold: true });
  });
  footer(s);
}

// --- SLIDE 13: 内容日历 ---
{
  const s = pptx.addSlide();
  bg(s);
  h1(s, "内容日历 & 热点响应机制");
  divider(s);
  const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const slots = [
    { label: "🔬 实测", color: ACCENT_CYAN },
    { label: "灵活选题", color: DIM_GRAY },
    { label: "📖 教程", color: ACCENT_GREEN },
    { label: "灵活选题", color: DIM_GRAY },
    { label: "⚔️ 对比/观点", color: ACCENT_ORANGE },
    { label: "灵活选题", color: DIM_GRAY },
    { label: "📰 周报", color: ACCENT_PURPLE }
  ];
  days.forEach((d, i) => {
    s.addShape(Shape.RECTANGLE, { x: 0.8 + i * 1.75, y: 2.1, w: 1.5, h: 2.0, fill: { color: DARK_CARD }, rectRadius: 0.1 });
    s.addText(d, { x: 0.8 + i * 1.75, y: 2.2, w: 1.5, h: 0.5, fontSize: 14, fontFace: "Microsoft YaHei", bold: true, color: WHITE, align: "center" });
    s.addText(slots[i].label, { x: 0.8 + i * 1.75, y: 2.8, w: 1.5, h: 1.0, fontSize: 12, fontFace: "Microsoft YaHei", color: slots[i].color, align: "center", bold: true });
  });
  s.addText("⚡ 热点响应预案", { x: 0.8, y: 4.5, w: 11.7, h: 0.5, fontSize: 18, fontFace: "Microsoft YaHei", bold: true, color: ACCENT_ORANGE });
  const hots = [
    { label: "重大发布", example: "OpenAI / Anthropic / DeepSeek / Google新品", time: "4小时内" },
    { label: "争议事件", example: "AI安全 / 裁员 / 监管政策", time: "6小时内" },
    { label: "数据榜单", example: "知名排名 / 测评报告发布", time: "8小时内" }
  ];
  hots.forEach((h, i) => {
    const y = 5.1 + i * 0.55;
    s.addShape(Shape.RECTANGLE, { x: 0.8, y, w: 11.7, h: 0.45, fill: { color: DARK_CARD }, rectRadius: 0.08 });
    s.addText(h.label, { x: 1.0, y, w: 2.0, h: 0.45, fontSize: 13, fontFace: "Microsoft YaHei", bold: true, color: ACCENT_ORANGE });
    s.addText(h.example, { x: 3.1, y, w: 6.5, h: 0.45, fontSize: 11, fontFace: "Microsoft YaHei", color: LIGHT_GRAY });
    s.addText("⏱ " + h.time, { x: 10.2, y, w: 2.0, h: 0.45, fontSize: 12, fontFace: "Consolas", bold: true, color: ACCENT_CYAN });
  });
  footer(s);
}

// --- SLIDE 14: 小红书策略 ---
{
  const s = pptx.addSlide();
  bg(s);
  sectionNumber(s, 8);
  h1(s, "多平台分发：小红书策略");
  divider(s);
  s.addShape(Shape.RECTANGLE, { x: 0.8, y: 2.1, w: 5.6, h: 4.5, fill: { color: DARK_CARD }, rectRadius: 0.15 });
  s.addText("📕 小红书运营方案", { x: 1.1, y: 2.3, w: 5.0, h: 0.5, fontSize: 18, fontFace: "Microsoft YaHei", bold: true, color: ACCENT_RED });
  ["公众号长文 → 500-800字短文改写", "封面图 + 标题钩子 + 干货密度 + 互动引导", "每篇结尾：\"全文在公众号「AI元思」\"", "发布频率：每天1篇，中午12:00", "7天冷启动方案已制定"].forEach((item, i) => {
    s.addText("▸ " + item, { x: 1.3, y: 3.0 + i * 0.55, w: 4.8, h: 0.45, fontSize: 13, fontFace: "Microsoft YaHei", color: LIGHT_GRAY });
  });
  // 分发流程
  s.addShape(Shape.RECTANGLE, { x: 6.9, y: 2.1, w: 5.6, h: 4.5, fill: { color: DARK_CARD }, rectRadius: 0.15 });
  s.addText("🔄 内容分发流程", { x: 7.2, y: 2.3, w: 5.0, h: 0.5, fontSize: 18, fontFace: "Microsoft YaHei", bold: true, color: ACCENT_GREEN });
  [
    { step: "Step 1", desc: "早8:00 完成公众号文章写作" },
    { step: "Step 2", desc: "改写为小红书短文（500-800字）" },
    { step: "Step 3", desc: "制作3张干货卡片图" },
    { step: "Step 4", desc: "中午12:00 同步发布小红书" },
    { step: "Step 5", desc: "转发朋友圈 + 即刻 + 微信群" }
  ].forEach((f, i) => {
    const y = 3.0 + i * 0.65;
    s.addText(f.step, { x: 7.4, y, w: 1.2, h: 0.4, fontSize: 11, fontFace: "Consolas", bold: true, color: ACCENT_GREEN });
    s.addText(f.desc, { x: 8.7, y, w: 3.5, h: 0.4, fontSize: 12, fontFace: "Microsoft YaHei", color: LIGHT_GRAY });
  });
  body(s, "核心逻辑：公众号做深度 → 小红书做广度 → 多渠道导流回公众号", { x: 6.9, y: 5.8, w: 5.6, fontSize: 13, color: ACCENT_CYAN, bold: true });
  footer(s);
}

// --- SLIDE 15: 未来规划 ---
{
  const s = pptx.addSlide();
  bg(s);
  sectionNumber(s, 9);
  h1(s, "未来规划：三阶段目标");
  divider(s);
  const phases = [
    { phase: "近期", icon: "🚀", desc: "坚持每日发布 · 积累100篇原创", items: ["每日1篇稳定输出", "小红书日均200+阅读", "建立读者社群"], color: ACCENT_GREEN, y: 2.1 },
    { phase: "中期", icon: "💰", desc: "5000粉丝 · 开启商业化", items: ["接AI工具/平台广告", "付费深度测评合集", "行业分析报告"], color: ACCENT_ORANGE, y: 3.8 },
    { phase: "长期", icon: "🏆", desc: "从公众号 → AI可信品牌", items: ["AI工具评测数据库", "\"选AI工具看AI元思\"认知", "多平台品牌矩阵"], color: ACCENT_CYAN, y: 5.5 }
  ];
  phases.forEach(p => {
    s.addShape(Shape.RECTANGLE, { x: 0.8, y: p.y, w: 11.7, h: 1.4, fill: { color: DARK_CARD }, rectRadius: 0.12 });
    s.addShape(Shape.RECTANGLE, { x: 0.8, y: p.y, w: 0.08, h: 1.4, fill: { color: p.color } });
    s.addText(p.icon + " " + p.phase + "：" + p.desc, { x: 1.2, y: p.y + 0.1, w: 10.5, h: 0.45, fontSize: 18, fontFace: "Microsoft YaHei", bold: true, color: p.color });
    p.items.forEach((item, j) => {
      s.addShape(Shape.RECTANGLE, { x: 1.2 + j * 2.1, y: p.y + 0.65, w: 1.9, h: 0.55, fill: { color: DARK_BG }, rectRadius: 0.08 });
      s.addText(item, { x: 1.2 + j * 2.1, y: p.y + 0.65, w: 1.9, h: 0.55, fontSize: 10, fontFace: "Microsoft YaHei", color: LIGHT_GRAY, align: "center" });
    });
  });
  footer(s);
}

// --- SLIDE 16: 结语 ---
{
  const s = pptx.addSlide();
  bg(s);
  s.addShape(Shape.OVAL, { x: 4, y: -2, w: 6, h: 6, fill: { color: ACCENT_CYAN }, transparency: 94 });
  s.addShape(Shape.OVAL, { x: 1, y: 4, w: 5, h: 5, fill: { color: ACCENT_PURPLE }, transparency: 95 });
  h1(s, "总结：给内容创作者的三句话", { fontSize: 32 });
  accentLine(s, 0.8, 1.8, 1.5);
  const quotes = [
    { text: "\"不用比别人聪明，只要比别人系统。\"", sub: "—— 系统化 > 天赋" },
    { text: "\"内容的下限靠模板，上限靠判断。\"", sub: "—— 模板保证60分，判断突破90分" },
    { text: "\"好的内容系统，让普通人也能持续产出。\"", sub: "—— 把内容当产品，用工程化思维运营" }
  ];
  quotes.forEach((q, i) => {
    const y = 2.5 + i * 1.5;
    s.addShape(Shape.RECTANGLE, { x: 0.8, y, w: 11.7, h: 1.2, fill: { color: DARK_CARD }, rectRadius: 0.15 });
    s.addShape(Shape.RECTANGLE, { x: 0.8, y, w: 0.08, h: 1.2, fill: { color: ACCENT_CYAN } });
    s.addText(q.text, { x: 1.3, y: y + 0.1, w: 10.8, h: 0.6, fontSize: 18, fontFace: "Microsoft YaHei", bold: true, italic: true, color: WHITE });
    s.addText(q.sub, { x: 1.3, y: y + 0.7, w: 10.8, h: 0.4, fontSize: 13, fontFace: "Microsoft YaHei", color: DIM_GRAY });
  });
  body(s, "谢谢大家！欢迎交流讨论", { y: 6.5, fontSize: 18, color: ACCENT_CYAN, bold: true, align: "center" });
  footer(s, "AI元思 · 公众号运营系统");
}

// ====== 生成文件 ======
const outputPath = path.join(__dirname, "..", "ai-yuansi-presentation.pptx");
pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log("✅ PPT已生成: " + outputPath);
}).catch(err => {
  console.error("生成失败:", err);
});

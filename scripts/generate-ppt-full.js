#!/usr/bin/env node
/** 生成完整30页PPT */
const pptxgen = require('pptxgenjs');
const path = require('path');

const C = {
  bg:'1A1A2E',bgLight:'16213E',cyan:'00D4FF',orange:'FF6B35',
  green:'00E676',red:'FF5252',purple:'BB86FC',white:'FFFFFF',
  gray:'AAAAAA',darkGray:'666666',cardBg:'1E2A45'
};
const F='Microsoft YaHei';
const TOTAL=30;
let n=0;

const pres=new pptxgen();
pres.defineLayout({name:'CUSTOM',width:13.33,height:7.5});
pres.layout='CUSTOM';
pres.author='AI元思';pres.title='AI元思-项目介绍';

function fn(s){
  n++;
  s.addText(n+'/'+TOTAL,{x:11.5,y:7.1,w:1.5,h:0.3,fontSize:8,color:C.darkGray,align:'right',fontFace:F});
}
function h1(s,t,o={}){
  s.addText(t,{x:0.8,y:0.5,w:11.7,h:0.7,fontSize:28,fontFace:F,color:C.cyan,bold:true,...o});
}
function hb(s,t,x,y,w,h,o={}){
  s.addShape(pres.ShapeType.rect,{x:x,y:y,w:w,h:h,fill:{color:C.cyan,transparency:92},line:{color:C.cyan,width:0.5},rectRadius:0.05});
  s.addText(t,{x:x+0.2,y:y,w:w-0.4,h:h,fontSize:o.fs||12,fontFace:F,color:o.c||C.white,align:'left',valign:'middle'});
}
function card(s,x,y,w,h,icon,title,desc,ac){
  s.addShape(pres.ShapeType.roundRect,{x,y,w,h,fill:{color:C.cardBg},line:{color:ac||C.cyan,width:0.3,transparency:70},rectRadius:0.12});
  s.addText(icon,{x,y:y+0.1,w,h:0.65,fontSize:28,align:'center'});
  s.addText(title,{x,y:y+0.8,w,h:0.4,fontSize:13,fontFace:F,color:ac||C.cyan,align:'center',bold:true});
  s.addText(desc,{x:x+0.15,y:y+1.3,w:w-0.3,h:0.5,fontSize:10,fontFace:F,color:C.gray,align:'center'});
}
function tbl(s,rows,x,y,w,cw){
  s.addTable(rows,{x,y,w,colW:cw,border:{type:'solid',color:'333333',pt:0.5},fontFace:F});
}
function sec(s,num){
  s.addText(num,{x:0,y:0.8,w:13.33,h:1.5,fontSize:72,fontFace:F,color:C.cyan,align:'center',bold:true,transparency:80});
  s.addText('',{x:0,y:2.2,w:13.33,h:1,fontSize:36,fontFace:F,color:C.white,align:'center',bold:true});
}
function secSlide(num,title,subtitle){
  const s=pres.addSlide();s.background={fill:C.bg};
  sec(s,num);
  s.addText(title,{x:0,y:2.2,w:13.33,h:1,fontSize:36,fontFace:F,color:C.white,align:'center',bold:true});
  s.addText(subtitle,{x:0,y:3.2,w:13.33,h:0.5,fontSize:14,fontFace:F,color:C.gray,align:'center'});
  fn(s);return s;
}

// ===== S1 封面 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  s.addShape(pres.ShapeType.rect,{x:0,y:0,w:13.33,h:0.06,fill:{color:C.cyan}});
  s.addText('🚀',{x:0,y:1.2,w:13.33,h:1.2,fontSize:48,align:'center'});
  s.addText('AI元思',{x:0,y:2.3,w:13.33,h:1,fontSize:48,fontFace:F,color:C.cyan,align:'center',bold:true});
  s.addText('用工程化思维做AI内容',{x:0,y:3.3,w:13.33,h:0.6,fontSize:20,fontFace:F,color:C.gray,align:'center'});
  s.addText('一个AI公众号的半自动化运营系统',{x:0,y:3.9,w:13.33,h:0.5,fontSize:16,fontFace:F,color:C.orange,align:'center'});
  s.addText('2026年7月 | 项目介绍演讲',{x:0,y:5.5,w:13.33,h:0.4,fontSize:11,fontFace:F,color:C.darkGray,align:'center'});
  s.addShape(pres.ShapeType.rect,{x:0,y:7.44,w:13.33,h:0.06,fill:{color:C.cyan}});
  n++;
}

// ===== S2 开场提问 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'先问一个问题');
  s.addText('如果你想做一个AI领域的公众号，你打算怎么做？',{x:0.8,y:1.5,w:11.7,h:0.8,fontSize:18,fontFace:F,color:C.white,align:'center'});
  const pains=[['🌊','信息太多','每天几十条AI新闻\n不知该写哪一个'],['📄','白纸焦虑','面对空白编辑器\n每次重新想结构'],['🔄','选题撞车','写完才发现\n选题已经有人写了']];
  pains.forEach((p,i)=>card(s,1.0+i*4.1,3.0,3.5,2.2,p[0],p[1],p[2],C.red));
  fn(s);
}

// ===== S3 核心思路 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'解决方案');
  hb(s,'用工程化思维做内容，把公众号当成一个产品来运营。',0.8,1.5,11.7,0.7,{fs:16});
  [['🤖','信息采集自动化','解决"写什么"'],['📝','模板驱动生产','解决"怎么写"'],['🎯','品牌体系先行','解决"差异化"'],['📡','多平台分发','解决"传播"']].forEach((c,i)=>card(s,0.9+i*3.15,2.8,2.8,2.4,c[0],c[1],c[2],C.cyan));
  fn(s);
}

// ===== S4 章节01 =====
secSlide('01','项目定位','谁是我们的读者，我们提供什么价值');

// ===== S5 一句话定位 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'一句话定位');
  s.addShape(pres.ShapeType.roundRect,{x:1.5,y:2.2,w:10.3,h:1.2,fill:{color:C.cyan,transparency:92},line:{color:C.cyan,width:1},rectRadius:0.1});
  s.addText('"用数据说话，让每个普通人都能用好AI"',{x:1.5,y:2.2,w:10.3,h:1.2,fontSize:22,fontFace:F,color:C.white,align:'center',valign:'middle',bold:true});
  s.addText('我们不报道「AI行业发生了什么」\n我们回答「这对你意味着什么，你该怎么用」',{x:0.8,y:3.9,w:11.7,h:1.2,fontSize:15,fontFace:F,color:C.gray,align:'center'});
  fn(s);
}

// ===== S6 差异化定位 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'差异化定位');
  const ho=()=>({bold:true,color:C.white,fill:{color:C.bgLight},fontSize:11});
  tbl(s,[
    [{text:'',options:ho()},{text:'传统AI媒体',options:ho()},{text:'AI元思',options:{...ho(),color:C.cyan}}],
    [{text:'视角',options:{color:C.gray,fontSize:11}},{text:'行业视角，偏技术',options:{color:C.white,fontSize:11}},{text:'用户视角，偏实用',options:{color:C.cyan,fontSize:11,bold:true}}],
    [{text:'形式',options:{color:C.gray,fontSize:11}},{text:'一次性资讯',options:{color:C.white,fontSize:11}},{text:'系列化内容，可收藏的工具箱',options:{color:C.cyan,fontSize:11,bold:true}}],
    [{text:'口吻',options:{color:C.gray,fontSize:11}},{text:'官方、第三人称',options:{color:C.white,fontSize:11}},{text:'真人实测，有主观判断',options:{color:C.cyan,fontSize:11,bold:true}}],
    [{text:'核心',options:{color:C.gray,fontSize:11}},{text:'"发生了什么"',options:{color:C.white,fontSize:11}},{text:'"你该怎么用"',options:{color:C.cyan,fontSize:11,bold:true}}],
  ],1.5,1.8,10.3,[1.6,4.35,4.35]);
  fn(s);
}

// ===== S7 目标受众 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'目标受众');
  s.addText('不是AI从业者，而是对AI感兴趣的普通人',{x:0,y:1.3,w:13.33,h:0.5,fontSize:14,fontFace:F,color:C.gray,align:'center'});
  [['💼','职场人','想用AI提升效率'],['🤔','纠结者','不知道该选哪个AI工具'],['📖','普通用户','想跟上AI趋势但不想读论文']].forEach((a,i)=>card(s,1.0+i*4.1,2.5,3.5,2.5,a[0],a[1],a[2],C.cyan));
  fn(s);
}

// ===== S8 章节02 =====
secSlide('02','系统架构','四层架构：采集 → 决策 → 生产 → 分发');

// ===== S9 系统全景图 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'系统全景图');
  const layers=[{color:C.cyan,icon:'📡',title:'信息采集层',desc:'22个RSS源 + 手动网站 → 每日简报'},{color:C.orange,icon:'🎯',title:'选题决策层',desc:'30+关键词评分 → TOP 5选题 → 匹配模板'},{color:C.green,icon:'✍️',title:'内容生产层',desc:'5套模板 → 30分钟出稿 → 检查清单'},{color:C.purple,icon:'📡',title:'发布分发层',desc:'公众号 → 小红书 → 即刻 | 数据追踪'}];
  layers.forEach((l,i)=>{
    const ly=1.3+i*1.5;
    s.addShape(pres.ShapeType.roundRect,{x:2.0,y:ly,w:9.3,h:1.1,fill:{color:l.color,transparency:93},line:{color:l.color,width:0.5},rectRadius:0.1});
    s.addText(l.icon+'  '+l.title,{x:2.3,y:ly+0.05,w:8.7,h:0.45,fontSize:15,fontFace:F,color:l.color,bold:true});
    s.addText(l.desc,{x:2.3,y:ly+0.5,w:8.7,h:0.45,fontSize:11,fontFace:F,color:C.gray});
    if(i<3)s.addText('▼',{x:6.2,y:ly+1.1,w:1,h:0.4,fontSize:14,color:C.cyan,align:'center'});
  });
  fn(s);
}

// ===== S10 信息采集层 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'第一层：信息采集');
  s.addText('覆盖 22个RSS信息源，按优先级分类',{x:0.8,y:1.2,w:11.7,h:0.4,fontSize:13,fontFace:F,color:C.gray});
  const ho=()=>({bold:true,color:C.white,fill:{color:C.bgLight},fontSize:11});
  const td=(c)=>({color:c||C.white,fontSize:11});
  tbl(s,[
    [{text:'优先级',options:ho()},{text:'类别',options:ho()},{text:'来源',options:ho()},{text:'数量',options:ho()}],
    [{text:'🔴 Critical',options:td()},{text:'官方动态',options:td()},{text:'OpenAI、Anthropic、DeepMind、Meta AI',options:td()},{text:'4',options:td(C.cyan)}],
    [{text:'🟡 High',options:td()},{text:'科技媒体',options:td()},{text:'The Verge、TechCrunch、Hacker News',options:td()},{text:'8+',options:td(C.cyan)}],
    [{text:'🟢 Medium',options:td()},{text:'社区/论文',options:td()},{text:'Reddit、ArXiv、GitHub Trending',options:td()},{text:'5+',options:td(C.cyan)}],
    [{text:'🔵 国内',options:td()},{text:'中文资讯',options:td()},{text:'量子位、机器之心、36氪、少数派',options:td()},{text:'5+',options:td(C.cyan)}],
  ],0.8,1.9,11.7,[2.0,2.0,5.7,1.0]);
  hb(s,'⏰ 每天早8点自动拉取 → 生成每日简报 → articles/briefs/brief-YYYYMMDD.md',0.8,4.6,11.7,0.6);
  fn(s);
}

// ===== S11 选题决策层 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'第二层：选题决策');
  s.addText('三条核心标准：',{x:0.8,y:1.4,w:11.7,h:0.4,fontSize:16,fontFace:F,color:C.white,bold:true});
  ['有热度 — 24小时内被多个源报道','有用户价值 — 普通人看得懂、用得上','能形成差异化观点 — 不重复别人已经说过的'].forEach((c,i)=>s.addText((i+1)+'.  '+c,{x:1.2,y:2.0+i*0.55,w:10,h:0.4,fontSize:14,fontFace:F,color:C.orange}));
  hb(s,'30+ 关键词评分系统：标题中包含「发布」「开源」「对比」「教程」等词自动加分，来源优先级加权（critical +20分），中文内容额外加分',0.8,4.0,11.7,0.8);
  s.addText('选题自动分类 → 匹配最佳模板 → 导出文章骨架',{x:0.8,y:5.2,w:11.7,h:0.5,fontSize:13,fontFace:F,color:C.gray,align:'center'});
  fn(s);
}

// ===== S12 5套模板 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'第三层：内容生产 — 5套模板');
  const ho=()=>({bold:true,color:C.white,fill:{color:C.bgLight},fontSize:11});
  const td=(c,sz)=>({color:c,fontSize:sz||11});
  tbl(s,[
    [{text:'模板',options:ho()},{text:'栏目',options:ho()},{text:'发布',options:ho()},{text:'字数',options:ho()},{text:'爆款潜力',options:ho()}],
    [{text:'🔬 工具实测',options:td(C.cyan)},{text:'周一',options:td(C.white)},{text:'tool-review',options:td(C.cyan,10)},{text:'1500-2500',options:td(C.white)},{text:'★★★☆',options:td(C.white)}],
    [{text:'📖 手把手教程',options:td(C.green)},{text:'周三',options:td(C.white)},{text:'tutorial',options:td(C.green,10)},{text:'2000-3500',options:td(C.white)},{text:'★★★★',options:td(C.white)}],
    [{text:'⚔️ 横向对比',options:td(C.orange)},{text:'周五',options:td(C.white)},{text:'comparison',options:td(C.orange,10)},{text:'2000-3000',options:td(C.white)},{text:'★★★★★',options:td(C.white)}],
    [{text:'💭 观点分析',options:td(C.red)},{text:'灵活',options:td(C.white)},{text:'opinion',options:td(C.red,10)},{text:'1500-2500',options:td(C.white)},{text:'★★★★★',options:td(C.white)}],
    [{text:'📰 AI周报',options:td(C.purple)},{text:'周日',options:td(C.white)},{text:'news-roundup',options:td(C.purple,10)},{text:'1500-2500',options:td(C.white)},{text:'★★★★',options:td(C.white)}],
  ],0.5,1.6,12.3,[2.5,1.2,2.3,2.0,2.3]);
  s.addText('周一实测 → 周三教程 → 周五对比/观点 → 周日周报',{x:0,y:5.0,w:13.33,h:0.4,fontSize:12,fontFace:F,color:C.gray,align:'center'});
  hb(s,'模板不是限制创意，而是保证质量下限。确保状态不好的那天，产出也在60分以上。',0.8,5.7,11.7,0.6);
  fn(s);
}

// ===== S13 模板内容包含 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'每套模板包含什么');
  [['📝','5个标题公式','直接套用，告别标题苦思'],['📋','逐段正文框架','第一段写什么、第二段写什么…'],['🖼️','配图位置标注','在哪个位置放什么截图'],['✅','发布检查清单','5-6条，发之前逐项打勾'],['🪝','钩子设计','评论区引导 + 下期预告']].forEach((it,i)=>{const col=i%3,row=Math.floor(i/3);card(s,0.8+col*4.2,1.6+row*2.0,3.7,1.6,it[0],it[1],it[2],C.cyan);});
  fn(s);
}

// ===== S14 发布分发层 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'第四层：发布与分发');
  s.addShape(pres.ShapeType.roundRect,{x:4.2,y:1.6,w:5.0,h:1.0,fill:{color:C.cyan,transparency:90},line:{color:C.cyan,width:0.8},rectRadius:0.1});
  s.addText('📱 公众号发布\n主平台，深度长文',{x:4.2,y:1.6,w:5.0,h:1.0,fontSize:13,fontFace:F,color:C.white,align:'center',valign:'middle'});
  [{x:1.5,t:'📕 小红书短文版\n500-800字'},{x:7.8,t:'💬 即刻 / 朋友圈\n社区互动'}].forEach(sub=>{
    s.addText('↙',{x:sub.x+0.8,y:2.0,w:1,h:0.5,fontSize:14,color:C.cyan,align:'center'});
    s.addShape(pres.ShapeType.roundRect,{x:sub.x,y:3.0,w:4.0,h:0.9,fill:{color:C.cardBg},line:{color:C.purple,width:0.3},rectRadius:0.1});
    s.addText(sub.t,{x:sub.x,y:3.0,w:4.0,h:0.9,fontSize:12,fontFace:F,color:C.white,align:'center',valign:'middle'});
  });
  s.addText('发布后标准动作：',{x:0.8,y:4.4,w:11.7,h:0.4,fontSize:14,fontFace:F,color:C.white,bold:true});
  s.addText('⏱️ 2小时内回复每条评论     📊 记录数据（阅读/转发/收藏）     🔄 打开率>20%时追加转发',{x:0.8,y:5.0,w:11.7,h:0.5,fontSize:11,fontFace:F,color:C.gray});
  fn(s);
}

// ===== S15 章节03 =====
secSlide('03','工作流演示','每天只需30分钟，三个脚本驱动');

// ===== S16 每日工作流 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'每日工作流：30分钟');
  const ho=()=>({bold:true,color:C.white,fill:{color:C.bgLight},fontSize:11});
  const td=(c,sz)=>({color:c,fontSize:sz||11});
  tbl(s,[
    [{text:'时间',options:ho()},{text:'动作',options:ho()},{text:'耗时',options:ho()},{text:'工具',options:ho()}],
    [{text:'08:00',options:td(C.cyan)},{text:'📡 拉取22个RSS源，生成简报',options:td(C.white)},{text:'5min',options:td(C.white)},{text:'aggregator.js',options:td(C.cyan,10)}],
    [{text:'08:05',options:td(C.cyan)},{text:'🎯 扫读简报，挑选选题',options:td(C.white)},{text:'5min',options:td(C.white)},{text:'人工判断',options:td(C.gray,10)}],
    [{text:'08:10',options:td(C.cyan)},{text:'✍️ 套用模板开始写正文',options:td(C.white)},{text:'15min',options:td(C.white)},{text:'5套模板',options:td(C.cyan,10)}],
    [{text:'08:25',options:td(C.cyan)},{text:'🖼️ 配图、排版、定时发布',options:td(C.white)},{text:'5min',options:td(C.white)},{text:'Canva/公众号后台',options:td(C.gray,10)}],
  ],0.8,1.6,11.7,[1.6,5.0,1.5,3.6]);
  hb(s,'⏱️ 从选题到发布：30分钟 ｜ 传统方式：约2.5小时 ｜ 效率提升 55%',0.8,4.8,11.7,0.6,{fs:13,c:C.green});
  fn(s);
}

// ===== S17 三个核心脚本 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'三个核心脚本');
  [['📡','aggregator.js','RSS聚合器，从22个源拉取信息\n按优先级排序，生成每日简报','node scripts/aggregator.js --export'],['🎯','daily_brief.js','选题推荐器，关键词匹配+打分\n自动匹配最佳模板，导出文章骨架','node scripts/daily_brief.js --top 5'],['📊','update_tracker.js','话题追踪器，记录已覆盖选题\n追踪发文总量和频率','node scripts/update_tracker.js --stats']].forEach((sc,i)=>{card(s,0.7+i*4.2,1.6,3.8,3.2,sc[0],sc[1],sc[2],C.cyan);s.addText(sc[3],{x:0.7+i*4.2+0.3,y:3.8,w:3.2,h:0.4,fontSize:8,fontFace:'Consolas',color:C.cyan,align:'center'});});
  s.addText('技术栈：仅需1个npm包（rss-parser）· 无数据库 · 无后端 · Markdown驱动一切',{x:0.8,y:5.4,w:11.7,h:0.4,fontSize:11,fontFace:F,color:C.darkGray,align:'center'});
  fn(s);
}

// ===== S18 章节04 =====
secSlide('04','品牌体系','从第一天就建立完整的品牌手册');

// ===== S19 品牌调性 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'品牌调性');
  ['📊 真实','🔢 数据驱动','🤝 不装','🎯 有态度'].forEach((t,i)=>{const tx=1.0+i*3.1;s.addShape(pres.ShapeType.roundRect,{x:tx,y:2.0,w:2.6,h:2.5,fill:{color:C.cardBg},line:{color:C.cyan,width:0.3,transparency:70},rectRadius:0.15});s.addText(t,{x:tx,y:2.0,w:2.6,h:2.5,fontSize:22,fontFace:F,color:C.white,align:'center',valign:'middle'});});
  fn(s);
}

// ===== S20 权威内容公式 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'权威内容公式');
  s.addText('每篇文章必须至少命中 5个锚点中的3个',{x:0,y:1.2,w:13.33,h:0.4,fontSize:14,fontFace:F,color:C.orange,align:'center'});
  [['🔢','具体数据','用数字说话'],['🧪','真机实测','真实截图'],['📚','引用来源','附链接'],['⚖️','双面评价','优缺点都说'],['🗓️','时效标注','版本号+日期']].forEach((a,i)=>card(s,0.7+i*2.55,2.0,2.2,2.2,a[0],a[1],a[2],C.cyan));
  fn(s);
}

// ===== S21 视觉规范 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'视觉规范');
  s.addText('封面设计',{x:0.8,y:1.5,w:5.5,h:0.4,fontSize:16,fontFace:F,color:C.white,bold:true});
  s.addText('• 深蓝/黑底 + 亮色文字\n• 品牌色： #00D4FF  /  #FF6B35',{x:1.0,y:2.0,w:5.5,h:0.8,fontSize:12,fontFace:F,color:C.gray});
  s.addText('正文排版',{x:0.8,y:3.0,w:5.5,h:0.4,fontSize:16,fontFace:F,color:C.white,bold:true});
  s.addText('• 15px 字号  •  1.75 行距\n• 每300字配一张图',{x:1.0,y:3.5,w:5.5,h:0.8,fontSize:12,fontFace:F,color:C.gray});
  s.addText('分类配色',{x:7.5,y:1.5,w:5.0,h:0.4,fontSize:16,fontFace:F,color:C.white,bold:true});
  [{l:'🔬 实测',c:C.cyan},{l:'📖 教程',c:C.green},{l:'⚔️ 对比',c:C.orange},{l:'💭 观点',c:C.red},{l:'📰 周报',c:C.purple}].forEach((c,i)=>{const cy=2.1+i*0.7;s.addShape(pres.ShapeType.roundRect,{x:7.7,y:cy,w:0.5,h:0.4,fill:{color:c.c},rectRadius:0.05});s.addText(c.l,{x:8.4,y:cy,w:3.0,h:0.4,fontSize:12,fontFace:F,color:C.white,valign:'middle'});});
  fn(s);
}

// ===== S22 章节05 =====
secSlide('05','成果数据','16天，14篇文章，从0到1');

// ===== S23 关键数据 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'关键数据');
  [{n:'14',l:'篇原创文章'},{n:'22',l:'个RSS信息源'},{n:'5',l:'套标准化模板'},{n:'~30',l:'分钟/天'}].forEach((st,i)=>{s.addText(st.n,{x:1.0+i*3.1,y:1.5,w:2.6,h:1.0,fontSize:44,fontFace:F,color:C.cyan,align:'center',bold:true});s.addText(st.l,{x:1.0+i*3.1,y:2.5,w:2.6,h:0.4,fontSize:12,fontFace:F,color:C.gray,align:'center'});});
  const ho=()=>({bold:true,color:C.white,fill:{color:C.bgLight},fontSize:11});
  const td=(c)=>({color:c,fontSize:11});
  tbl(s,[
    [{text:'维度',options:ho()},{text:'数据',options:ho()}],
    [{text:'项目启动',options:td(C.gray)},{text:'2026年6月21日',options:td(C.white)}],
    [{text:'发布时间线',options:td(C.gray)},{text:'连续16天日更（6/21 → 7/6）',options:td(C.white)}],
    [{text:'固定栏目',options:td(C.gray)},{text:'5个（实测/教程/对比/观点/周报）',options:td(C.white)}],
    [{text:'多平台分发',options:td(C.gray)},{text:'公众号 + 小红书 + 即刻',options:td(C.white)}],
    [{text:'选题储备',options:td(C.gray)},{text:'8+待写选题 + 灵感池',options:td(C.white)}],
  ],1.2,3.3,10.9,[2.5,8.4]);
  fn(s);
}

// ===== S24 代表性文章 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'代表性文章');
  const ho=()=>({bold:true,color:C.white,fill:{color:C.bgLight},fontSize:11});
  const td=(c)=>({color:c,fontSize:11});
  tbl(s,[
    [{text:'类型',options:ho()},{text:'标题',options:ho()},{text:'表现',options:ho()}],
    [{text:'⚔️ 对比',options:td(C.orange)},{text:'DeepSeek vs ChatGPT vs 豆包：写公众号谁更强',options:td(C.white)},{text:'对比类爆款',options:td(C.white)}],
    [{text:'📖 教程',options:td(C.green)},{text:'Vibe Coding全流程教程',options:td(C.white)},{text:'高收藏',options:td(C.white)}],
    [{text:'💭 观点',options:td(C.red)},{text:'AI这么强，初级程序员还有必要存在吗？',options:td(C.white)},{text:'高转发',options:td(C.white)}],
    [{text:'🔬 实测',options:td(C.cyan)},{text:'用AI做PPT的5个工具实测对比',options:td(C.white)},{text:'350+行深度横评',options:td(C.white)}],
    [{text:'📖 教程',options:td(C.green)},{text:'用AI做小红书爆款封面（全流程）',options:td(C.white)},{text:'痛点精准切入',options:td(C.white)}],
  ],0.5,1.6,12.3,[1.8,8.0,2.5]);
  fn(s);
}

// ===== S25 章节06 =====
secSlide('06','未来规划','从工具到品牌的进化路径');

// ===== S26 三段式路线图 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'三段式路线图');
  [{color:C.green,label:'🟢 近期',items:'• 坚持日更，积累100篇原创\n• 小红书日均200+阅读\n• 建立读者社群'},{color:C.orange,label:'🟠 中期（5000粉后）',items:'• 开启商业化\n• AI工具深度测评合集\n• 行业分析报告'},{color:C.cyan,label:'🔵 长期',items:'• 升级为AI领域可信品牌\n• 建立AI工具评测数据库\n• 「选AI工具，看AI元思」'}].forEach((p,i)=>{const px=0.7+i*4.2;s.addShape(pres.ShapeType.roundRect,{x:px,y:1.6,w:3.8,h:3.8,fill:{color:C.cardBg},line:{color:p.color,width:1.5},rectRadius:0.12});s.addText(p.label,{x:px,y:1.7,w:3.8,h:0.5,fontSize:14,fontFace:F,color:p.color,align:'center',bold:true});s.addText(p.items,{x:px+0.3,y:2.5,w:3.2,h:2.5,fontSize:11,fontFace:F,color:C.gray});});
  fn(s);
}

// ===== S27 技术演进 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  h1(s,'技术演进路线');
  const ho=()=>({bold:true,color:C.white,fill:{color:C.bgLight},fontSize:11});
  const td=(c)=>({color:c,fontSize:11});
  tbl(s,[
    [{text:'阶段',options:ho()},{text:'目标',options:ho()},{text:'状态',options:ho()}],
    [{text:'Phase 1',options:td(C.cyan)},{text:'模板 + 聚合 + 日历',options:td(C.white)},{text:'✅ 已完成',options:td(C.green)}],
    [{text:'Phase 2',options:td(C.cyan)},{text:'阅读数据分析 + 选题效果反馈闭环',options:td(C.white)},{text:'🟡 规划中',options:td(C.orange)}],
    [{text:'Phase 3',options:td(C.cyan)},{text:'AI辅助初稿生成',options:td(C.white)},{text:'🟡 规划中',options:td(C.orange)}],
    [{text:'Phase 4',options:td(C.cyan)},{text:'多平台分发适配（知乎/掘金/头条）',options:td(C.white)},{text:'⏳ 远期',options:td(C.gray)}],
  ],1.2,2.0,10.9,[2.0,6.4,2.5]);
  fn(s);
}

// ===== S28 总结 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  s.addText('总结',{x:0,y:0.5,w:13.33,h:0.8,fontSize:34,fontFace:F,color:C.cyan,align:'center',bold:true});
  s.addText('这个项目回答了三个问题：',{x:0,y:1.4,w:13.33,h:0.5,fontSize:14,fontFace:F,color:C.gray,align:'center'});
  [{q:'写什么？',a:'聚合器 + 选题池 + 内容日历 → 永远不缺选题'},{q:'怎么写？',a:'5套模板 + 标题公式 + 检查清单 → 30分钟出稿'},{q:'怎么持续？',a:'固定节奏 + 追踪系统 + 月度复盘 → 日更不焦虑'}].forEach((ans,i)=>{const ay=2.3+i*1.4;hb(s,'',0.8,ay,11.7,1.0);s.addText(ans.q,{x:1.2,y:ay+0.05,w:2.0,h:0.9,fontSize:20,fontFace:F,color:C.cyan,bold:true,valign:'middle'});s.addText(ans.a,{x:3.2,y:ay+0.05,w:9.0,h:0.9,fontSize:13,fontFace:F,color:C.white,valign:'middle'});});
  fn(s);
}

// ===== S29 核心金句 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  ['"不用比别人聪明，只要比别人系统。"','"内容的下限靠模板，上限靠判断。"','"好的内容系统，让普通人也能持续产出60分以上的内容。"'].forEach((q,i)=>{const qy=1.2+i*2.0;s.addText(q,{x:1.0,y:qy,w:11.3,h:1.2,fontSize:20,fontFace:F,color:C.cyan,align:'center',valign:'middle',italic:true});if(i<2)s.addShape(pres.ShapeType.rect,{x:3.0,y:qy+1.65,w:7.3,h:0.01,fill:{color:C.darkGray}});});
  s.addText('— AI元思',{x:0,y:6.4,w:13.33,h:0.4,fontSize:11,fontFace:F,color:C.darkGray,align:'center'});
  fn(s);
}

// ===== S30 结尾 =====
{
  const s=pres.addSlide();s.background={fill:C.bg};
  s.addShape(pres.ShapeType.rect,{x:0,y:0,w:13.33,h:0.06,fill:{color:C.cyan}});
  s.addText('🙏',{x:0,y:0.8,w:13.33,h:1.2,fontSize:48,align:'center'});
  s.addText('谢谢',{x:0,y:2.0,w:13.33,h:1,fontSize:44,fontFace:F,color:C.cyan,align:'center',bold:true});
  s.addText('AI元思 · 项目介绍',{x:0,y:3.2,w:13.33,h:0.5,fontSize:18,fontFace:F,color:C.gray,align:'center'});
  s.addText('📂 项目仓库：ai-wechat-channel    📋 品牌手册：brand-kit.md\n📅 内容日历：content-calendar.md    📕 小红书策略：xiaohongshu-strategy.md',{x:0,y:4.2,w:13.33,h:1.0,fontSize:11,fontFace:F,color:C.darkGray,align:'center'});
  s.addShape(pres.ShapeType.rect,{x:0,y:7.44,w:13.33,h:0.06,fill:{color:C.cyan}});
  n++;
}

// ===== 生成文件 =====
const outPath=path.join(__dirname,'..','ai-yuansi-presentation.pptx');
pres.writeFile({fileName:outPath}).then(()=>{
  console.log('✅ PPT已生成: '+outPath);
  console.log('   共 '+n+' 页幻灯片');
}).catch(err=>{console.error('生成失败:',err.message);});

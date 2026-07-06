#!/usr/bin/env node
/**
 * github-to-wechat.js — 从 GitHub 仓库到公众号文章的全自动流水线
 *
 * 流程：
 *   1. 读取 GitHub 仓库信息（API）
 *   2. 创建课程目录结构
 *   3. 生成封面 SVG + Edge 截图 + PIL 转 JPEG
 *   4. 生成 golden-style 文章 HTML
 *   5. 自动发布到公众号
 *
 * 用法：
 *   node github-to-wechat.js <仓库URL> [合集名]
 *
 * 示例：
 *   node github-to-wechat.js https://github.com/Robbyant/lingbot-map "AI"
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ============================================================
// 配置
// ============================================================
const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = __dirname; // D:\github\mattskill
const WECHAT_PUBLISH = path.join(ROOT, 'wechat-publish.js');

// ============================================================
// 主流程
// ============================================================
async function main() {
  const [,, repoUrl, albumName = '其他'] = process.argv;

  if (!repoUrl) {
    console.error('用法: node github-to-wechat.js <仓库URL> [合集名]');
    console.error('示例: node github-to-wechat.js https://github.com/Robbyant/lingbot-map "AI"');
    process.exit(1);
  }

  // 1. 解析 URL → owner/repo
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) {
    console.error('❌ 无法解析 GitHub 仓库 URL:', repoUrl);
    process.exit(1);
  }
  const owner = match[1];
  const repoName = match[2].replace(/\.git$/, '');
  const fullName = `${owner}/${repoName}`;
  console.log(`\n📦 仓库: ${fullName}\n`);

  // 2. 获取仓库信息
  console.log('⏳ 正在获取仓库信息...');
  const repoInfo = await fetchRepoInfo(owner, repoName);
  if (!repoInfo) {
    console.error('❌ 获取仓库信息失败（请检查网络或仓库是否公开）');
    process.exit(1);
  }
  const {
    description = '',
    stargazers_count: stars = 0,
    forks_count: forks = 0,
    language = 'Unknown',
    license: licenseInfo,
    open_issues_count: issues = 0,
    updated_at: updatedAt,
    created_at: createdAt,
    html_url: htmlUrl,
    topics = [],
  } = repoInfo;
  const licenseName = licenseInfo?.spdx_id || 'Custom';
  const starsDisplay = stars >= 1000 ? `${(stars / 1000).toFixed(1)}K` : String(stars);
  console.log(`   ⭐ ${starsDisplay} Stars | 🍴 ${forks} Forks | 📜 ${licenseName} | 🔧 ${language}`);
  console.log(`   📝 ${description}`);
  console.log();

  // 3. 尝试获取 README
  console.log('⏳ 正在获取 README...');
  const readmeMd = await fetchReadme(owner, repoName);

  // 4. 创建课程目录
  const courseDir = path.join(ROOT, repoName);
  const lessonsDir = path.join(courseDir, 'lessons');
  const assetsDir = path.join(courseDir, 'assets');
  const refDir = path.join(courseDir, 'reference');
  const recordsDir = path.join(courseDir, 'learning-records');
  for (const dir of [courseDir, lessonsDir, assetsDir, refDir, recordsDir]) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 5. 生成封面 SVG
  console.log('⏳ 正在生成封面 SVG...');
  const coverSvg = buildCoverSvg({ fullName, repoName, description, stars, starsDisplay, forks, language, licenseName, htmlUrl, topics });
  fs.writeFileSync(path.join(lessonsDir, 'cover.svg'), coverSvg, 'utf-8');
  console.log('   ✅ cover.svg 已生成');

  // 6. Edge 截图 → PNG
  console.log('⏳ 正在截图封面（Edge headless）...');
  const coverPng = path.join(lessonsDir, 'cover.png');
  const svgFileUrl = `file:///${lessonsDir.replace(/\\/g, '/')}/cover.svg`;
  const edgeCmd = `"${EDGE_PATH}" --headless --screenshot="${coverPng}" --window-size=1175,500 "${svgFileUrl}"`;
  execSync(edgeCmd, { timeout: 30000, stdio: 'pipe' });
  console.log('   ✅ cover.png 已生成');

  // 7. PIL 转 JPEG
  console.log('⏳ 正在转换封面为 JPEG...');
  const coverJpg = path.join(lessonsDir, 'cover.jpg');
  const pilScript = `
from PIL import Image
img = Image.open('${coverPng.replace(/\\/g, '\\\\')}')
img.convert('RGB').save('${coverJpg.replace(/\\/g, '\\\\')}', 'JPEG', quality=95)
import os; print(f'✅ cover.jpg ({os.path.getsize("${coverJpg.replace(/\\/g, '\\\\')}") // 1024}KB)')
`;
  execSync(`python -c "${pilScript.replace(/"/g, '\\"')}"`, { timeout: 15000, stdio: 'pipe' });
  console.log('   ✅ cover.jpg 已生成');

  // 8. 生成文章 HTML
  console.log('⏳ 正在生成文章...');
  const htmlContent = buildArticleHtml({
    fullName, repoName, owner, description, stars, starsDisplay, forks,
    language, licenseName, issues, htmlUrl, topics, readmeMd, updatedAt, createdAt,
  });
  const htmlFile = path.join(lessonsDir, `0001-what-is-${repoName}.html`);
  fs.writeFileSync(htmlFile, htmlContent, 'utf-8');
  console.log(`   ✅ 文章已生成: lessons/0001-what-is-${repoName}.html`);

  // 9. 发布到公众号
  console.log('\n⏳ 正在发布到公众号...\n');
  const publishCmd = `node "${WECHAT_PUBLISH}" "${htmlFile}" "${albumName}" 0`;
  execSync(publishCmd, { cwd: ROOT, stdio: 'inherit', timeout: 120000 });

  console.log('\n🎉 全流程完成！');
  console.log(`   仓库: ${htmlUrl}`);
  console.log(`   文章: ${htmlFile}`);
  console.log(`   封面: ${coverJpg}`);
}

// ============================================================
// GitHub API
// ============================================================
async function fetchRepoInfo(owner, repo) {
  try {
    const { execSync } = require('child_process');
    const raw = execSync(`gh api repos/${owner}/${repo}`, { encoding: 'utf-8', timeout: 15000 });
    return JSON.parse(raw);
  } catch (e) {
    // fallback: curl
    try {
      const { execSync } = require('child_process');
      const raw = execSync(`curl -sL "https://api.github.com/repos/${owner}/${repo}"`, { encoding: 'utf-8', timeout: 15000 });
      return JSON.parse(raw);
    } catch (e2) {
      return null;
    }
  }
}

async function fetchReadme(owner, repo) {
  try {
    const { execSync } = require('child_process');
    const raw = execSync(
      `gh api repos/${owner}/${repo}/readme --jq '.content' 2>/dev/null || curl -sL "https://api.github.com/repos/${owner}/${repo}/readme" | node -e "process.stdin.on('data',d=>{try{const r=JSON.parse(d);if(r.content)process.stdout.write(Buffer.from(r.content,'base64').toString())}catch(e){}})"`,
      { encoding: 'utf-8', timeout: 15000 }
    );
    return raw || '';
  } catch (e) {
    // fallback: raw.githubusercontent.com
    try {
      const { execSync } = require('child_process');
      const raw = execSync(
        `curl -sL "https://raw.githubusercontent.com/${owner}/${repo}/main/README.md" || curl -sL "https://raw.githubusercontent.com/${owner}/${repo}/master/README.md"`,
        { encoding: 'utf-8', timeout: 15000 }
      );
      return raw || '';
    } catch (e2) {
      return '';
    }
  }
}

// ============================================================
// 封面 SVG 生成
// ============================================================
function buildCoverSvg({ fullName, repoName, description, stars, starsDisplay, forks, language, licenseName, htmlUrl, topics }) {
  const desc = description.slice(0, 80);
  const topicTags = topics.slice(0, 4).join(' · ');
  const starNum = stars >= 1000 ? `${starsDisplay}` : String(stars);
  const starLabel = stars >= 1000 ? 'GitHub Stars' : 'GitHub Stars';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1175 500">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600;700;900&amp;display=swap');
      text { font-family: 'Noto Sans SC', -apple-system, 'PingFang SC', sans-serif; }
    </style>
  </defs>
  <rect width="1175" height="500" fill="#f5f0e8" rx="0"/>
  <rect x="0" y="0" width="1175" height="4" fill="#8b6914"/>
  <rect x="40" y="28" width="120" height="26" rx="13" fill="#8b6914" opacity="0.15"/>
  <text x="100" y="46" text-anchor="middle" fill="#8b6914" font-size="11" font-weight="700">🚀 开源项目</text>
  <text x="40" y="100" fill="#3d2b1f" font-size="36" font-weight="900">${escapeXml(repoName)}</text>
  <text x="40" y="140" fill="#8b6914" font-size="16" font-weight="700">${escapeXml(fullName)}</text>
  <text x="40" y="172" fill="#6b5a30" font-size="12">${escapeXml(desc)}</text>
  ${topicTags ? `<text x="40" y="196" fill="#8b7355" font-size="11">🏷️ ${escapeXml(topicTags)}</text>` : ''}
  <line x1="40" y1="218" x2="600" y2="218" stroke="#d4c4a8" stroke-width="1" stroke-dasharray="4,3"/>
  <rect x="40" y="236" width="170" height="80" rx="10" fill="#f0e8d8" stroke="#d4c4a8" stroke-width="1"/>
  <text x="125" y="268" text-anchor="middle" fill="#8b6914" font-size="32" font-weight="900">${escapeXml(starNum)}</text>
  <text x="125" y="290" text-anchor="middle" fill="#8b7355" font-size="10">⭐ ${escapeXml(starLabel)}</text>
  <rect x="225" y="236" width="170" height="80" rx="10" fill="#f0e8d8" stroke="#d4c4a8" stroke-width="1"/>
  <text x="310" y="268" text-anchor="middle" fill="#8b6914" font-size="32" font-weight="900">${forks}</text>
  <text x="310" y="290" text-anchor="middle" fill="#8b7355" font-size="10">🍴 Forks</text>
  <rect x="410" y="236" width="170" height="80" rx="10" fill="#f0e8d8" stroke="#d4c4a8" stroke-width="1"/>
  <text x="495" y="268" text-anchor="middle" fill="#8b6914" font-size="28" font-weight="900">${escapeXml(licenseName)}</text>
  <text x="495" y="290" text-anchor="middle" fill="#8b7355" font-size="10">📜 开源协议</text>
  <rect x="595" y="236" width="170" height="80" rx="10" fill="#f0e8d8" stroke="#d4c4a8" stroke-width="1"/>
  <text x="680" y="268" text-anchor="middle" fill="#8b6914" font-size="28" font-weight="900">${escapeXml(language)}</text>
  <text x="680" y="290" text-anchor="middle" fill="#8b7355" font-size="10">🔧 主语言</text>
  <text x="40" y="380" fill="#c4a97d" font-size="9">🔗 ${escapeXml(htmlUrl)}</text>
  <text x="40" y="400" fill="#c4a97d" font-size="9">Apache-2.0 License · 商用友好</text>
</svg>`;
}

// ============================================================
// 文章 HTML 生成
// ============================================================
function buildArticleHtml(opts) {
  const {
    repoName, owner, fullName, htmlUrl, description, stars, starsDisplay, forks,
    language, licenseName, topics, readmeMd,
  } = opts;

  // 从 README 中提取有用的信息
  const installSection = extractSection(readmeMd, 'Installation', '安装');
  const quickStart = extractSection(readmeMd, 'Quick Start', '快速开始', 'Quickstart');
  const usageSection = extractSection(readmeMd, 'Usage', '使用');
  const featuresLine = extractFeaturesLine(readmeMd);

  const starStr = stars >= 1000 ? `${starsDisplay}` : `${stars}`;
  const topicStr = topics?.length > 0 ? `（${topics.slice(0, 4).join('、')}）` : '';
  const repoDir = repoName;

  const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"><title>GitHub ${starStr} Star 的新开源：${repoName}，${description ? description.slice(0, 40) : '一个值得关注的开源项目'}</title></head><body style="margin:0;padding:0;background:#f5f0e8;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;color:#4a3728;line-height:1.8;-webkit-text-size-adjust:100%;text-indent:0"><!-- 正文区 --><div style="padding:8px 0">

<!-- 封面图片 -->
<div style="margin:0 -8px 20px"><img src="cover.jpg" alt="${escapeXml(repoName)} 封面" style="width:100%;display:block;border-radius:4px"></div>

<!-- 导语 -->
<div style="border-left:3px solid #c4a97d;padding:12px 16px;margin:20px 0;background:rgba(251,247,240,0.6)">
<div style="text-indent:0;margin:0;font-size:14px;color:#5c4033;line-height:2;font-style:italic">"${escapeXml(description || '一个优秀的开源项目')}"</div>
</div>

<!-- 爆点数据 -->
<div style="margin-bottom:28px">
<div style="text-indent:0;margin:0 0 12px;font-size:13px;color:#5c4033;line-height:1.9">
最近 GitHub 上有个项目火了——<b>${escapeXml(fullName)}</b>，上线没多久就冲到了 ${starStr} Stars。这项目到底是干啥的？咱们好好聊聊。
</div>

<div style="text-indent:0;margin:0 0 12px;font-size:13px;color:#5c4033;line-height:1.9">
${escapeXml(description || '这是一款开源工具，已经在 GitHub 上获得了广泛关注。项目代码完全公开，采用 ' + licenseName + ' 协议，对开发者非常友好。')}${topicStr ? ' 主要技术方向：' + topicStr + '。' : ''}
</div>

<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
<div style="flex:1;min-width:130px;background:#f5f0e0;border:1px solid #c4b89a;border-radius:8px;padding:12px;text-align:center">
<div style="font-family:'Georgia',serif;font-size:22px;font-weight:700;color:#8b6914;line-height:1">${escapeXml(starStr)}</div>
<div style="font-size:9px;color:#8b7355;margin-top:4px">GitHub Stars</div>
</div>
<div style="flex:1;min-width:130px;background:#f5f0e0;border:1px solid #c4b89a;border-radius:8px;padding:12px;text-align:center">
<div style="font-family:'Georgia',serif;font-size:22px;font-weight:700;color:#8b6914;line-height:1">${forks}</div>
<div style="font-size:9px;color:#8b7355;margin-top:4px">Forks</div>
</div>
<div style="flex:1;min-width:130px;background:#f5f0e0;border:1px solid #c4b89a;border-radius:8px;padding:12px;text-align:center">
<div style="font-family:'Georgia',serif;font-size:22px;font-weight:700;color:#8b6914;line-height:1">${escapeXml(language || 'N/A')}</div>
<div style="font-size:9px;color:#8b7355;margin-top:4px">主语言</div>
</div>
<div style="flex:1;min-width:130px;background:#f5f0e0;border:1px solid #c4b89a;border-radius:8px;padding:12px;text-align:center">
<div style="font-family:'Georgia',serif;font-size:22px;font-weight:700;color:#8b6914;line-height:1">${escapeXml(licenseName)}</div>
<div style="font-size:9px;color:#8b7355;margin-top:4px">开源协议</div>
</div>
</div>
</div>

<!-- 项目介绍 -->
<div style="margin-bottom:28px">
<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:14px"><span style="font-family:'Georgia','Noto Serif SC',serif;font-size:22px;font-weight:700;color:#8b6914">01</span><span style="font-size:16px;font-weight:700;color:#3d2b1f">这项目是做什么的？</span><span style="flex:1;border-bottom:1px dotted #d4c4a8;margin-bottom:3px"></span></div>

<div style="text-indent:0;margin:0 0 12px;font-size:13px;color:#5c4033;line-height:1.9">
${escapeXml(description || fullName + ' 是一个开源项目，受到了 GitHub 社区的广泛关注。')}
</div>

<div style="text-indent:0;margin:0 0 12px;font-size:13px;color:#5c4033;line-height:1.9">
从 GitHub 上的活跃程度来看，这个项目非常有潜力。目前已经积累了 ${starStr} 个 Star，${forks} 个 Fork，社区参与度很高。项目采用 ${licenseName} 协议开源，商用友好。
</div>

${featuresLine ? featuresLine : ''}
</div>

${installSection ? `<div style="margin-bottom:28px">
<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:14px"><span style="font-family:'Georgia','Noto Serif SC',serif;font-size:22px;font-weight:700;color:#8b6914">02</span><span style="font-size:16px;font-weight:700;color:#3d2b1f">安装使用</span><span style="flex:1;border-bottom:1px dotted #d4c4a8;margin-bottom:3px"></span></div>

<div style="text-indent:0;margin:0 0 12px;font-size:13px;color:#5c4033;line-height:1.9">
安装过程不复杂，跟着走几步就行：
</div>

<div style="background:#3d2b1f;color:#e8dcc8;padding:14px 16px;border-radius:6px;font-family:'SF Mono',Menlo,monospace;font-size:11px;line-height:1.8;margin-bottom:12px">
${escapeXml(installSection.slice(0, 600))}
</div>
</div>` : ''}

${quickStart ? `<div style="margin-bottom:28px">
<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:14px"><span style="font-family:'Georgia','Noto Serif SC',serif;font-size:22px;font-weight:700;color:#8b6914">03</span><span style="font-size:16px;font-weight:700;color:#3d2b1f">快速上手</span><span style="flex:1;border-bottom:1px dotted #d4c4a8;margin-bottom:3px"></span></div>

<div style="background:#3d2b1f;color:#e8dcc8;padding:14px 16px;border-radius:6px;font-family:'SF Mono',Menlo,monospace;font-size:11px;line-height:1.8;margin-bottom:12px">
${escapeXml(quickStart.slice(0, 600))}
</div>
</div>` : ''}

${usageSection ? `<div style="margin-bottom:28px">
<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:14px"><span style="font-family:'Georgia','Noto Serif SC',serif;font-size:22px;font-weight:700;color:#8b6914">04</span><span style="font-size:16px;font-weight:700;color:#3d2b1f">使用方式</span><span style="flex:1;border-bottom:1px dotted #d4c4a8;margin-bottom:3px"></span></div>

<div style="text-indent:0;margin:0 0 12px;font-size:13px;color:#5c4033;line-height:1.9">
项目提供了详细的使用文档，以下是一些关键用法：
</div>

<div style="background:#3d2b1f;color:#e8dcc8;padding:14px 16px;border-radius:6px;font-family:'SF Mono',Menlo,monospace;font-size:11px;line-height:1.8;margin-bottom:12px">
${escapeXml(usageSection.slice(0, 800))}
</div>
</div>` : ''}

<!-- 开源协议 -->
<div style="margin-bottom:28px">
<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:14px"><span style="font-family:'Georgia','Noto Serif SC',serif;font-size:22px;font-weight:700;color:#8b6914">📜</span><span style="font-size:16px;font-weight:700;color:#3d2b1f">开源协议</span><span style="flex:1;border-bottom:1px dotted #d4c4a8;margin-bottom:3px"></span></div>

<div style="text-indent:0;margin:0 0 12px;font-size:13px;color:#5c4033;line-height:1.9">
项目采用 <b>${licenseName}</b> 协议开源，你可以自由使用、修改和分发（具体条款请参考项目仓库中的 LICENSE 文件）。
</div>

<div style="text-indent:0;margin:0 0 12px;font-size:13px;color:#5c4033;line-height:1.9">
如果觉得项目不错，去 GitHub 点个 Star 就是最大的支持 🙌
</div>
</div>

<!-- 测验 -->
<div style="margin-bottom:20px">
<div style="text-align:center;margin-bottom:16px"><span style="font-size:24px">📝</span><div style="font-size:16px;font-weight:700;color:#3d2b1f;margin-top:2px">小测验</div><div style="width:24px;height:2px;background:#c4a97d;margin:6px auto 0"></div></div>

<div style="margin-bottom:18px">
<div style="font-size:13px;font-weight:600;color:#3d2b1f;margin-bottom:10px;line-height:1.6">Q1：${escapeXml(repoName)} 的开源协议是什么？</div>
<div style="font-size:10px;color:#c4a97d;margin-bottom:8px">👆 点击每个选项查看对错</div>

<svg style="display:block;width:100%;height:52px;margin-bottom:5px" viewBox="0 0 350 52" role="img">
<g><rect width="350" height="44" rx="6" fill="#fbf7f0" stroke="#e8dcc8" stroke-width="1"/><text x="12" y="27" fill="#8b7355" font-size="13"><tspan leaf="">A. ${escapeXml(licenseName)}</tspan></text><animate attributeName="opacity" begin="click" restart="never" to="0" dur="0.01s" fill="freeze"/></g>
<g opacity="0"><rect width="350" height="44" rx="6" fill="#f5f0e0" stroke="#c4b89a" stroke-width="1"/><text x="12" y="27" fill="#6b5a30" font-size="13" font-weight="bold"><tspan leaf="">✓ A. 正确！采用 ${escapeXml(licenseName)} 协议开源。</tspan></text><animate attributeName="opacity" begin="click" restart="never" to="1" dur="0.01s" fill="freeze"/></g>
</svg>

<svg style="display:block;width:100%;height:52px;margin-bottom:5px" viewBox="0 0 350 52" role="img">
<g><rect width="350" height="44" rx="6" fill="#fbf7f0" stroke="#e8dcc8" stroke-width="1"/><text x="12" y="27" fill="#8b7355" font-size="13"><tspan leaf="">B. MIT</tspan></text><animate attributeName="opacity" begin="click" restart="never" to="0" dur="0.01s" fill="freeze"/></g>
<g opacity="0"><rect width="350" height="44" rx="6" fill="#faf5f0" stroke="#d4bfb0" stroke-width="1"/><text x="12" y="27" fill="#7d5f52" font-size="13" font-weight="bold"><tspan leaf="">✗ B. 不对。该项目使用 ${escapeXml(licenseName)} 协议。</tspan></text><animate attributeName="opacity" begin="click" restart="never" to="1" dur="0.01s" fill="freeze"/></g>
</svg>

<svg style="display:block;width:100%;height:52px;margin-bottom:5px" viewBox="0 0 350 52" role="img">
<g><rect width="350" height="44" rx="6" fill="#fbf7f0" stroke="#e8dcc8" stroke-width="1"/><text x="12" y="27" fill="#8b7355" font-size="13"><tspan leaf="">C. GPL-3.0</tspan></text><animate attributeName="opacity" begin="click" restart="never" to="0" dur="0.01s" fill="freeze"/></g>
<g opacity="0"><rect width="350" height="44" rx="6" fill="#faf5f0" stroke="#d4bfb0" stroke-width="1"/><text x="12" y="27" fill="#7d5f52" font-size="13" font-weight="bold"><tspan leaf="">✗ C. 不对。该项目使用 ${escapeXml(licenseName)} 协议。</tspan></text><animate attributeName="opacity" begin="click" restart="never" to="1" dur="0.01s" fill="freeze"/></g>
</svg>
</div>

<div>
<div style="font-size:13px;font-weight:600;color:#3d2b1f;margin-bottom:10px;line-height:1.6">Q2：${escapeXml(repoName)} 的主要编程语言是什么？</div>
<div style="font-size:10px;color:#c4a97d;margin-bottom:8px">👆 点击每个选项查看对错</div>

<svg style="display:block;width:100%;height:52px;margin-bottom:5px" viewBox="0 0 350 52" role="img">
<g><rect width="350" height="44" rx="6" fill="#fbf7f0" stroke="#e8dcc8" stroke-width="1"/><text x="12" y="27" fill="#8b7355" font-size="13"><tspan leaf="">A. ${escapeXml(language || 'N/A')}</tspan></text><animate attributeName="opacity" begin="click" restart="never" to="0" dur="0.01s" fill="freeze"/></g>
<g opacity="0"><rect width="350" height="44" rx="6" fill="#f5f0e0" stroke="#c4b89a" stroke-width="1"/><text x="12" y="27" fill="#6b5a30" font-size="13" font-weight="bold"><tspan leaf="">✓ A. 正确！主语言是 ${escapeXml(language || 'N/A')}。</tspan></text><animate attributeName="opacity" begin="click" restart="never" to="1" dur="0.01s" fill="freeze"/></g>
</svg>

<svg style="display:block;width:100%;height:52px;margin-bottom:5px" viewBox="0 0 350 52" role="img">
<g><rect width="350" height="44" rx="6" fill="#fbf7f0" stroke="#e8dcc8" stroke-width="1"/><text x="12" y="27" fill="#8b7355" font-size="13"><tspan leaf="">B. Rust</tspan></text><animate attributeName="opacity" begin="click" restart="never" to="0" dur="0.01s" fill="freeze"/></g>
<g opacity="0"><rect width="350" height="44" rx="6" fill="#faf5f0" stroke="#d4bfb0" stroke-width="1"/><text x="12" y="27" fill="#7d5f52" font-size="13" font-weight="bold"><tspan leaf="">✗ B. 不对。该项目主语言是 ${escapeXml(language || 'N/A')}。</tspan></text><animate attributeName="opacity" begin="click" restart="never" to="1" dur="0.01s" fill="freeze"/></g>
</svg>

<svg style="display:block;width:100%;height:52px;margin-bottom:5px" viewBox="0 0 350 52" role="img">
<g><rect width="350" height="44" rx="6" fill="#fbf7f0" stroke="#e8dcc8" stroke-width="1"/><text x="12" y="27" fill="#8b7355" font-size="13"><tspan leaf="">C. JavaScript</tspan></text><animate attributeName="opacity" begin="click" restart="never" to="0" dur="0.01s" fill="freeze"/></g>
<g opacity="0"><rect width="350" height="44" rx="6" fill="#faf5f0" stroke="#d4bfb0" stroke-width="1"/><text x="12" y="27" fill="#7d5f52" font-size="13" font-weight="bold"><tspan leaf="">✗ C. 不对。该项目主语言是 ${escapeXml(language || 'N/A')}。</tspan></text><animate attributeName="opacity" begin="click" restart="never" to="1" dur="0.01s" fill="freeze"/></g>
</svg>
</div>
</div>

<!-- 结语 -->
<div style="text-align:center;padding:24px 0 8px">
<div style="font-size:14px;font-weight:700;color:#3d2b1f;margin-bottom:8px">写在最后</div>
<div style="text-indent:0;margin:0 auto;font-size:12px;color:#5c4033;line-height:1.9;max-width:400px">
${escapeXml(repoName)} 是一个值得关注的开源项目。如果你对这个方向感兴趣，不妨去 GitHub 上看看源码和文档。
</div>
</div>

<div style="text-align:center;padding:0 0 24px">
<div style="font-size:9px;color:#c4a97d">🔗 项目地址：${escapeXml(htmlUrl)}</div>
</div>

</div></body></html>`;

  return html;
}

// ============================================================
// 辅助函数
// ============================================================
function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function extractSection(md, ...names) {
  if (!md) return '';
  for (const name of names) {
    const regex = new RegExp(`##+\\s*${name}[\\s\\S]*?(?=\\n##+|$)`, 'i');
    const match = md.match(regex);
    if (match) {
      // 去除标题行和多余的空白
      return match[0].replace(/^##+.*\n/, '').trim();
    }
  }
  return '';
}

function extractFeaturesLine(md) {
  if (!md) return '';
  // 尝试在 README 开头找项目亮点
  const lines = md.split('\n').slice(0, 60);
  const featureLines = lines.filter(l => /^[-*]\s/.test(l) && l.length < 120).slice(0, 5);
  if (featureLines.length < 2) return '';
  return `<div style="background:#fbf7f0;border:1px solid #e8dcc8;border-radius:8px;padding:14px;margin-bottom:14px">
<div style="font-size:11px;font-weight:700;color:#8b6914;margin-bottom:6px">✨ 项目亮点</div>
${featureLines.map(l => `<div style="font-size:11px;color:#5c4033;line-height:1.8;padding:2px 0">• ${escapeXml(l.replace(/^[-*]\s+/, ''))}</div>`).join('\n')}
</div>`;
}

// ============================================================
// 启动
// ============================================================
main().catch(err => {
  console.error('\n❌ 脚本出错:', err.message);
  process.exit(1);
});

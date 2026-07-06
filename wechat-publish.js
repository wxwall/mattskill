/**
 * 公众号文章上传工具
 *
 * 用法（在 D:\github\mattskill 目录下）：
 *   node wechat-publish.js <html文件路径> [合集名] [封面图索引]
 *
 * 示例：
 *   node wechat-publish.js ./goal-mode/lessons/0001-what-is-goal.html
 *   node wechat-publish.js ./container/lessons/0001-what-is-apple-container.html "其他" 0
 *
 * 说明：
 *   - 标题从 HTML 的 <title> 标签自动提取
 *   - 正文中的本地图片自动内嵌为 base64
 *   - 封面从正文第 1 张图选择
 *   - 合集默认 "其他"
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const [,, htmlFile, albumName = '其他', coverIndex = '0'] = process.argv;

if (!htmlFile) {
  console.log('用法: node wechat-publish.js <html文件路径> [合集名] [封面图索引]');
  console.log('示例: node wechat-publish.js ./goal-mode/lessons/0001-what-is-goal.html');
  process.exit(1);
}

const absPath = path.resolve(htmlFile);
if (!fs.existsSync(absPath)) {
  console.error('文件不存在:', absPath);
  process.exit(1);
}

// 读取标题
const html = fs.readFileSync(absPath, 'utf-8');
const titleMatch = html.match(/<title>([^<]+)<\/title>/);
const title = titleMatch ? titleMatch[1] : path.basename(absPath, '.html');
console.log('标题:', title);

// 提取正文 — 优先找 <!-- 正文区 --> 标记，否则从 <div style="padding:8px 0"> 开始
let start = html.indexOf('<!-- 正文区 -->');
let content;

if (start !== -1) {
  const end = html.lastIndexOf('</body>');
  content = '<div style="padding:8px 0">' +
    html.slice(start, end)
      .replace(/^<!-- 正文区 --><div style="padding:8px 0">/, '')
      .replace(/<\/div>\s*$/, '');
} else {
  // 后备：从第一个 <div style="padding:8px 0"> 开始到 </body>
  const bodyStart = html.indexOf('<div style="padding:8px 0">');
  const bodyEnd = html.lastIndexOf('</body>');
  if (bodyStart === -1) {
    console.error('未找到正文区域');
    process.exit(1);
  }
  content = html.slice(bodyStart, bodyEnd);
}

const contentFile = path.join(path.dirname(absPath), '.wechat-temp-content.html');
fs.writeFileSync(contentFile, content, 'utf-8');

const publishScript = 'D:/projects/claude/teach/wechat-scripts/publish.js';
if (!fs.existsSync(publishScript)) {
  console.error('发布脚本不存在:', publishScript);
  fs.unlinkSync(contentFile);
  process.exit(1);
}

const env = {
  ...process.env,
  TITLE: title,
  ALBUM_NAME: albumName,
  COVER_INDEX: coverIndex,
  CONTENT_FILE: contentFile,
};

console.log(`\n发布参数:`);
console.log(`  标题: ${title}`);
console.log(`  合集: ${albumName}`);
console.log(`  封面: 正文第 ${Number(coverIndex) + 1} 张图`);
console.log(`  文件: ${absPath}\n`);

try {
  execSync(`node "${publishScript}" all`, {
    cwd: path.dirname(publishScript),
    env,
    stdio: 'inherit',
  });
} finally {
  // 清理临时文件
  try { fs.unlinkSync(contentFile); } catch {}
}

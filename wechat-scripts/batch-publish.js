/**
 * 批量发布课程到公众号
 *
 * 读取 lessons/ 下的 HTML 文件，逐篇发布到公众号。
 *
 * 用法：
 *   node batch-publish.js                # 发布全部课程
 *   node batch-publish.js 1              # 只发布第 1 课
 *   node batch-publish.js 1 3            # 发布第 1-3 课
 */
const fs = require('fs');
const path = require('path');
const { step1, step3, step4, step5, step7, getPage, init, closeBrowser, setAlbumName, setCoverIndex } = require('./publish');

const LESSONS_DIR = path.resolve(__dirname, '..', 'simplex-chat', 'lessons');
const ALBUM_NAME = '其他分类';
const COVER_INDEX = 7; // 第8张图（从0开始）
setAlbumName(ALBUM_NAME);
setCoverIndex(COVER_INDEX);

/** 解析 HTML 文件，提取标题和正文内容 */
function parseLesson(filePath) {
  const html = fs.readFileSync(filePath, 'utf-8');

  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const rawTitle = titleMatch ? titleMatch[1].trim() : path.basename(filePath, '.html');

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1].trim() : '';

  const cleanBody = bodyHtml
    .replace(/<script[\s\S]*?<\/script>/g, '');

  return { title: rawTitle, content: cleanBody };
}

async function publishOne(filePath, index, total) {
  const { title, content } = parseLesson(filePath);
  const shortName = path.basename(filePath);
  console.log(`\n${'='.repeat(50)}`);
  console.log(`\u{1F4C4} [${index}/${total}] ${title}`);
  console.log(`   文件: ${shortName}`);
  console.log(`   正文: ${content.length} 字符`);
  console.log(`${'='.repeat(50)}`);

  // Step 1: 创建文章（打开编辑器）
  await step1();

  // Step 2: 填写标题 + 作者
  const page = getPage();
  await page.evaluate((t) => {
    const titleEditor = document.querySelector('.title-editor__input .ProseMirror');
    if (titleEditor) {
      titleEditor.focus();
      const dt = new DataTransfer();
      dt.setData('text/plain', t);
      titleEditor.dispatchEvent(new ClipboardEvent('paste', {
        clipboardData: dt, bubbles: true, cancelable: true
      }));
    }
    const titleEl = document.querySelector('textarea#title');
    if (titleEl) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value'
      ).set;
      setter.call(titleEl, t);
      titleEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, title);
  await page.evaluate(() => {
    const authorEl = document.querySelector('input.js_author');
    if (authorEl) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      ).set;
      setter.call(authorEl, '物理知识点');
      authorEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  console.log('✅ Step 2: 标题和作者已填写');

  // Step 3-5: 标准步骤
  await step3();
  await step4();
  await step5();

  // Step 6: 填入正文
  await page.evaluate((html) => {
    const editors = document.querySelectorAll('.ProseMirror');
    let bodyEditor = null;
    for (const el of editors) {
      const parent = el.parentElement;
      if (parent && parent.className.includes('rich_media_content')) {
        bodyEditor = el;
        break;
      }
    }
    if (!bodyEditor) return;

    bodyEditor.focus();
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(bodyEditor);
    sel.removeAllRanges();
    sel.addRange(range);

    const dt = new DataTransfer();
    dt.setData('text/html', html);
    bodyEditor.dispatchEvent(new ClipboardEvent('paste', {
      clipboardData: dt, bubbles: true, cancelable: true
    }));

    bodyEditor.innerHTML = html;
    bodyEditor.dispatchEvent(new Event('input', { bubbles: true }));
    bodyEditor.dispatchEvent(new Event('change', { bubbles: true }));
  }, content);
  await page.waitForTimeout(800);

  // 重设标题
  await page.evaluate(() => {
    const titleEl = document.querySelector('textarea#title');
    if (titleEl) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value'
      ).set;
      setter.call(titleEl, titleEl.value);
      titleEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  console.log('✅ Step 6: 正文已填入');

  // Step 7: 保存为草稿
  await step7();

  return { title, shortName };
}

async function main() {
  const args = process.argv.slice(2);

  const files = fs.readdirSync(LESSONS_DIR)
    .filter(f => f.endsWith('.html'))
    .sort()
    .map(f => path.join(LESSONS_DIR, f));

  if (files.length === 0) {
    console.error('未找到 HTML 文件');
    process.exit(1);
  }

  let start, end;
  if (args.length === 0) {
    start = 0; end = files.length - 1;
  } else if (args.length === 1) {
    start = parseInt(args[0]) - 1;
    end = start;
  } else {
    start = parseInt(args[0]) - 1;
    end = parseInt(args[1]) - 1;
  }

  const selected = files.slice(start, end + 1);
  console.log(`共 ${files.length} 篇课程，将发布 ${selected.length} 篇`);

  for (let i = 0; i < selected.length; i++) {
    const result = await publishOne(selected[i], start + i + 1, files.length);
    console.log(`  ✅ ${result.title}`);
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log('🎉 全部发布完成！');
  closeBrowser();
}

main().catch(err => {
  console.error('批量发布失败:', err);
  closeBrowser();
});

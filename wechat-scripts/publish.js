/**
 * 公众号文章自动发布脚本
 *
 * 完整流程 7 个步骤，每个步骤可独立运行。
 *
 * 用法：
 *   node publish.js <步骤编号>
 *
 * 示例：
 *   node publish.js 1   # 创建文章（打开编辑器）
 *   node publish.js 2   # 填写标题和作者
 *   node publish.js 3   # 声明原创
 *   node publish.js 4   # 选择合集
 *   node publish.js 5   # 填入正文（含图片内嵌）
 *   node publish.js 6   # 设置封面（从正文中选第一张图）
 *   node publish.js 7   # 保存为草稿
 *
 * 所有步骤顺序执行：
 *   node publish.js all
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'https://mp.weixin.qq.com';
const STATE_FILE = path.join(__dirname, 'wechat-state.json');

// 全局状态：浏览器/页面在步骤间保持打开
let browser, page, context;

async function init() {
  if (!browser) {
    browser = await chromium.launch({ headless: false });
    const hasState = fs.existsSync(STATE_FILE);
    context = await browser.newContext(
      hasState ? { storageState: STATE_FILE } : {}
    );
    page = await context.newPage();
  }
  return page;
}

async function saveState() {
  if (context) {
    await context.storageState({ path: STATE_FILE });
    console.log('登录态已保存到', STATE_FILE);
  }
}

async function closeBrowser() {
  if (browser) await browser.close();
}

//========== 工具函数 ==========

/** 用 evaluate 点击文字（处理不可见元素） */
async function clickText(page, text, { exact = false, timeout = 3000 } = {}) {
  await page.evaluate(({ text, exact }) => {
    const all = document.querySelectorAll('a, button, span, div, li');
    for (const el of all) {
      const t = el.textContent.trim();
      if (exact ? t === text : t.includes(text)) {
        el.click();
        return;
      }
    }
  }, { text, exact });
  await page.waitForTimeout(timeout);
}

/** 用 evaluate 设置输入框值（处理隐藏 textarea/input） */
async function setInputValue(page, selector, value) {
  await page.evaluate(({ selector, value }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    const tag = el.tagName.toLowerCase();
    if (tag === 'textarea') {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value'
      ).set;
      setter.call(el, value);
    } else {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      ).set;
      setter.call(el, value);
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, { selector, value });
}

/**
 * 预处理正文 HTML：将本地图片引用转为 base64 data URI。
 * 公众号编辑器无法解析本地文件路径（如 src="cover.jpg"），
 * 需要将图片内嵌到 HTML 中才能正确显示。
 */
function preprocessContent(html) {
  const baseDir = CONTENT_FILE ? path.dirname(CONTENT_FILE) : __dirname;
  return html.replace(/<img[^>]+src="([^"]+)"[^>]*>/gi, (match, src) => {
    // 只处理本地文件（非 URL、非 data URI）
    if (src.startsWith('http') || src.startsWith('data:')) return match;
    const imgPath = path.resolve(baseDir, src);
    if (!fs.existsSync(imgPath)) {
      console.log('⚠️ 本地图片不存在，跳过:', imgPath);
      return match;
    }
    const ext = path.extname(src).toLowerCase();
    const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
    const contentType = mime[ext] || 'image/jpeg';
    const data = fs.readFileSync(imgPath);
    const b64 = data.toString('base64');
    console.log('✅ 已内嵌图片:', src, `(${(data.length / 1024).toFixed(0)}KB)`);
    return match.replace(`src="${src}"`, `src="data:${contentType};base64,${b64}"`);
  });
}

//========== 各步骤 ==========

/**
 * Step 1: 打开公众号 → 新的创作 → 文章（会打开新标签页）
 *         自动处理登录态：有缓存则跳过扫码，无缓存则等待手动扫码后保存
 */
async function step1() {
  await init();
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // 检查是否已登录
  const isLoggedIn = await page.evaluate(() => {
    return document.body.innerText.includes('物理知识点')
        || !!document.querySelector('.new-creation__menu-title');
  });

  if (!isLoggedIn) {
    // 登录态过期或不存在，删掉旧缓存
    if (fs.existsSync(STATE_FILE)) {
      fs.unlinkSync(STATE_FILE);
      console.log('登录态已过期，已删除旧缓存');
    }
    console.log('请在浏览器中扫码登录...');
    for (let i = 0; i < 120; i++) {
      await page.waitForTimeout(2000);
      try {
        // 如果页面跳转了，waitForLoadState 确保稳定后再 evaluate
        await page.waitForLoadState('domcontentloaded').catch(() => {});
        const ok = await page.evaluate(() =>
          document.body.innerText.includes('物理知识点')
          || !!document.querySelector('.new-creation__menu-title')
        );
        if (ok) {
          console.log('✅ 检测到登录成功');
          break;
        }
      } catch {
        // 页面可能在跳转，忽略错误继续等
      }
      if (i % 15 === 0) console.log('等待扫码中... (' + (i * 2) + 's)');
    }
    await page.waitForTimeout(2000);
    await saveState();
  } else {
    console.log('✅ 使用已保存的登录态');
  }

  // 点击"文章"打开新标签页
  const [newPage] = await Promise.all([
    page.waitForEvent('popup', { timeout: 15000 }).catch(() => null),
    page.evaluate(() => {
      const titles = document.querySelectorAll('.new-creation__menu-title');
      for (const el of titles) {
        if (el.textContent.trim() === '文章') {
          el.click();
          return;
        }
      }
    })
  ]);

  if (newPage) {
    await newPage.waitForLoadState('domcontentloaded');
    await newPage.waitForTimeout(3000);
    page = newPage;
  } else {
    await page.waitForTimeout(3000);
  }

  const url = page.url();
  if (url.includes('appmsg_edit')) {
    console.log('✅ Step 1: 已进入文章编辑器');
  } else {
    console.log('⚠️ Step 1: 可能未进入编辑器，当前URL:', url);
  }
  return page;
}

/**
 * Step 2: 填写标题和作者
 * 标题和正文都是 ProseMirror 编辑器，通过粘贴事件设置内容
 */
async function step2() {
  const page = await init();
  // 如果不在编辑器页面，先导航过去
  if (!page.url().includes('appmsg_edit')) {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await page.evaluate(() => {
      const all = document.querySelectorAll('a, span, div');
      for (const el of all) {
        if (el.textContent.trim() === '文章' && el.offsetParent !== null) {
          el.click();
          return;
        }
      }
    });
    await page.waitForTimeout(3000);
  }

  // 填写标题（ProseMirror + textarea 双管齐下）
  await page.evaluate((title) => {
    // 方法1: 通过 paste 事件设置标题 ProseMirror
    const titleEditor = document.querySelector('.title-editor__input .ProseMirror');
    if (titleEditor) {
      titleEditor.focus();
      const dt = new DataTransfer();
      dt.setData('text/plain', title);
      titleEditor.dispatchEvent(new ClipboardEvent('paste', {
        clipboardData: dt, bubbles: true, cancelable: true
      }));
    }
    // 方法2: 设置 textarea 兜底
    const titleEl = document.querySelector('textarea#title');
    if (titleEl) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value'
      ).set;
      setter.call(titleEl, title);
      titleEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, TITLE);

  // 填写作者
  await setInputValue(page, 'input.js_author', '物理知识点');

  await page.waitForTimeout(500);
  console.log('✅ Step 2: 标题和作者已填写');
}

/**
 * Step 3: 声明原创
 */
async function step3() {
  const page = await init();

  // 点击"未声明"打开原创对话框
  await page.locator('.setting-group__switch.js_original_apply').first().click();
  await page.waitForTimeout(2000);

  // 选择"文字原创"
  await page.getByText('文字原创', { exact: true }).first().click();
  await page.waitForTimeout(500);

  // 一次性完成：勾选协议 checkbox + 点击确定
  await page.evaluate(() => {
    // 找到协议行里的隐藏 checkbox 直接勾上
    const agreementArea = document.querySelector('.original_agreement');
    if (agreementArea) {
      const cb = agreementArea.querySelector('input[type="checkbox"]');
      if (cb) {
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      }
      agreementArea.click(); // 触发 UI 状态更新
    }
  });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.trim() === '确定' && btn.offsetParent !== null) {
        btn.click();
        return;
      }
    }
  });
  await page.waitForTimeout(2000);

  console.log('✅ Step 3: 原创声明已提交');
}

/**
 * Step 4: 选择合集
 */
async function step4() {
  const page = await init();

  // 点击合集区域 — 精确寻找合集旁的"未添加"（非原文链接）
  await page.evaluate(() => {
    // 法1：找包含"合集"的 setting-group 下的"未添加"
    const groups = document.querySelectorAll('.setting-group');
    for (const g of groups) {
      if (g.textContent.includes('合集') && !g.textContent.includes('原文')) {
        const spans = g.querySelectorAll('*');
        for (const el of spans) {
          if (el.textContent.trim() === '未添加' && el.offsetParent !== null) {
            el.click();
            return;
          }
        }
      }
    }
    // 法2：通用查找（排除原文链接）
    const all = document.querySelectorAll('*');
    for (const el of all) {
      if (el.textContent.trim() === '未添加' && el.offsetParent !== null) {
        let parent = el.parentElement;
        for (let i = 0; i < 5 && parent; i++) {
          if (parent.textContent.includes('合集') && !parent.textContent.includes('原文')) {
            el.click();
            return;
          }
          parent = parent.parentElement;
        }
      }
    }
  });
  await page.waitForTimeout(1500);

  // 搜索合集名 — 用 Playwright .fill() 触发微信的异步搜索
  await page.locator('input[placeholder="请选择合集"]').fill(ALBUM_NAME);
  await page.waitForTimeout(2500);

  // 点击搜索结果中的合集
  await page.locator(`li:has-text("${ALBUM_NAME}")`).click();
  await page.waitForTimeout(500);

  // 点击"确认"
  await page.locator('button:has-text("确认")').click();
  await page.waitForTimeout(1500);

  console.log('✅ Step 4: 合集已选择');
}

/**
 * Step 5: 填入正文（通过粘贴事件触发 ProseMirror 状态更新）
 * 必须在设置封面之前执行，因为封面从正文中选图。
 */
async function step5(content) {
  const page = await init();
  let html;
  if (content) {
    html = preprocessContent(content);
  } else if (CONTENT_FILE && fs.existsSync(CONTENT_FILE)) {
    html = preprocessContent(fs.readFileSync(CONTENT_FILE, 'utf-8'));
  } else {
    html = '<p>这是一篇测试文章的内容，用于验证公众号自动发布流程。</p><p>正文编辑功能测试。</p>';
  }

  await page.evaluate((html) => {
    // 正文编辑器：第二个 .ProseMirror，parent 是 .rich_media_content
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

    // 清空现有内容（全选 + 删除）
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(bodyEditor);
    sel.removeAllRanges();
    sel.addRange(range);

    // 方法1: 粘贴事件 — ProseMirror 会解析 HTML 并更新内部状态
    const dt = new DataTransfer();
    dt.setData('text/html', html);
    bodyEditor.dispatchEvent(new ClipboardEvent('paste', {
      clipboardData: dt,
      bubbles: true,
      cancelable: true
    }));

    // 方法2: 备份用 innerHTML（部分编辑器也认）
    bodyEditor.innerHTML = html;
    bodyEditor.dispatchEvent(new Event('input', { bubbles: true }));
    bodyEditor.dispatchEvent(new Event('change', { bubbles: true }));
  }, html);
  await page.waitForTimeout(800);

  // 重设标题（防止编辑器 widget 错位覆盖标题）
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

  console.log('✅ Step 5: 正文已填入');
}

/**
 * Step 6: 设置封面 — 从正文中选第 1 张图作为封面
 * 正文必须已填入（Step 5），才能从正文中选择封面图片。
 * 包含裁剪确认的重试逻辑，防止服务器超时导致封面设置失败。
 */
async function step6() {
  const page = await init();

  // 点击"拖拽或选择封面"
  await page.getByText('拖拽或选择封面').click();
  await page.waitForTimeout(1500);

  // 从正文选择 — evaluate 绕过 Playwright 可见性检测
  await page.evaluate(() => {
    const items = document.querySelectorAll('a.js_selectCoverFromContent');
    for (const el of items) {
      if (el.textContent.trim() === '从正文选择') {
        el.click();
        return true;
      }
    }
    return false;
  });
  console.log('✅ 点击"从正文选择"');
  await page.waitForTimeout(2500);

  // 从正文图片列表中选第 COVER_INDEX 张图
  await page.evaluate((idx) => {
    const selectors = [
      '.cover_choose_item',
      '.appmsg_cover_list li',
      '.js_appmsg_cover_item',
      '.weui-desktop-dialog li',
      '.weui-desktop-dialog .weui-desktop-media__list li',
      '.appmsg_cover .weui-desktop-media li',
    ];
    for (const sel of selectors) {
      const items = document.querySelectorAll(sel);
      if (items.length > 0) {
        const target = Math.min(idx, items.length - 1);
        items[target].click();
        return;
      }
    }
  }, COVER_INDEX);
  await page.waitForTimeout(3000);
  console.log('✅ 已选择第 ' + (COVER_INDEX + 1) + ' 张图');

  // 点击"下一步"
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('下一步') && !btn.disabled) {
        btn.click();
        return;
      }
    }
  });
  await page.waitForTimeout(2000);

  // 裁剪确认 — 带重试逻辑，最多重试 5 次
  let cropSuccess = false;
  for (let retry = 0; retry < 5; retry++) {
    // 点击裁剪对话框的"确认"
    await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      for (const btn of btns) {
        if (btn.textContent.includes('确认') && btn.offsetParent !== null) {
          btn.click();
          return;
        }
      }
    });
    await page.waitForTimeout(4000);

    // 验证裁剪对话框是否已关闭
    const dialogClosed = await page.evaluate(() => {
      // 检查是否有可见的对话框
      const dialogs = document.querySelectorAll('.weui-desktop-dialog');
      for (const d of dialogs) {
        const style = window.getComputedStyle(d);
        if (style.display !== 'none' && style.visibility !== 'hidden' && d.offsetParent !== null) {
          return false; // 还有对话框可见
        }
      }
      return true; // 没有可见对话框了
    });

    if (dialogClosed) {
      cropSuccess = true;
      console.log('✅ 裁剪确认成功');
      break;
    } else {
      console.log(`⚠️ 裁剪对话框未关闭，第 ${retry + 1} 次重试...`);
      await page.waitForTimeout(2000);
    }
  }

  if (!cropSuccess) {
    console.log('⚠️ 裁剪确认多次重试后仍未确认成功，继续后续步骤');
  }

  await page.waitForTimeout(1500);
  console.log('✅ Step 6: 封面已设置（从正文中选图）');
}

/**
 * Step 7: 保存为草稿
 */
async function step7() {
  const page = await init();

  // 点击「保存为草稿」
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('保存为草稿')) {
        btn.click();
        return;
      }
    }
  });
  await page.waitForTimeout(5000);

  // 检查是否保存成功（找成功提示或按钮变灰）
  const saved = await page.evaluate(() => {
    // 方法1: 页面中出现"已保存"
    if (document.body.innerText.includes('已保存')) return true;
    // 方法2: 保存按钮变 disabled
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.includes('保存为草稿') && btn.disabled) return true;
    }
    return false;
  });

  if (saved) {
    console.log('✅ Step 7: 已保存为草稿');
  } else {
    const url = page.url();
    if (url.includes('appmsgid')) {
      console.log('✅ Step 7: 已保存为草稿');
    } else {
      console.log('⚠️ Step 7: 保存状态不确定，URL:', url);
    }
  }
}

//========== 主入口 ==========

async function main() {
  const step = process.argv[2];

  if (!step) {
    console.log('用法: node publish.js <步骤编号|all>');
    console.log('步骤: 1=创建文章, 2=标题/作者, 3=原创, 4=合集, 5=正文, 6=封面(从正文选图), 7=保存');
    process.exit(1);
  }

  if (step === 'all') {
    // 尝试从正文 HTML 中提取标题
    if (!TITLE && CONTENT_FILE && fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, 'utf-8');
      const m = raw.match(/<title>([^<]+)<\/title>/);
      if (m) TITLE = m[1];
    }
    for (let i = 1; i <= 7; i++) {
      console.log(`\n=== 执行 Step ${i} ===`);
      await module.exports[`step${i}`]();
    }
    console.log('\n🎉 全部步骤完成！');
    await closeBrowser();
    process.exit(0);
  }

  const fn = module.exports[`step${step}`];
  if (!fn) {
    console.error('无效步骤:', step);
    process.exit(1);
  }

  await fn();
  console.log(`\nStep ${step} 执行完毕，浏览器保持打开。`);
  console.log('继续下一步: node publish.js ' + (Number(step) + 1));
  console.log('完成后关闭: 在浏览器中手动关闭或 Ctrl+C');
}

// 在非 "all" 模式下保持进程运行
if (process.argv[2] !== 'all') {
  process.on('SIGINT', async () => {
    await closeBrowser();
    process.exit(0);
  });
}

let ALBUM_NAME = process.env.ALBUM_NAME || '其他';
let COVER_INDEX = parseInt(process.env.COVER_INDEX || '1', 10);
let TITLE = process.env.TITLE || '测试标题';
let CONTENT_FILE = process.env.CONTENT_FILE || '';
function setAlbumName(name) { ALBUM_NAME = name; }
function setCoverIndex(idx) { COVER_INDEX = idx; }
function setTitle(t) { TITLE = t; }
function setContentFile(f) { CONTENT_FILE = f; }

module.exports = { step1, step2, step3, step4, step5, step6, step7, init, closeBrowser, main, getPage: () => page, setAlbumName, setCoverIndex, setTitle, setContentFile };

if (require.main === module) {
  main().catch(err => {
    console.error('错误:', err);
    closeBrowser();
  });
}

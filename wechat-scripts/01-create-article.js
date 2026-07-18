/**
 * Step 1: 创建文章 - 点击"新的创作"→"文章"，进入编辑器
 *
 * 使用方式：
 *   1. 先手动在浏览器中登录微信公众号平台
 *   2. 运行此脚本
 *
 * 此脚本会打开公众号首页，点击"新的创作"→"文章"，
 * 然后保持浏览器打开以便后续步骤操作。
 */

const { chromium } = require('playwright');

const BASE_URL = 'https://mp.weixin.qq.com';

(async () => {
  const browser = await chromium.launch({ headless: false, channel: 'chrome' });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 导航到公众号首页
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  console.log('已打开公众号首页');

  // 等待手动登录或检查是否已登录
  await page.waitForTimeout(3000);

  // 点击"新的创作"
  await page.evaluate(() => {
    const items = document.querySelectorAll('a, [cursor=pointer], [class*="new_creation"], [class*="new-creation"]');
    for (const el of items) {
      if (el.textContent.includes('新的创作')) {
        el.click();
        return;
      }
    }
  });
  await page.waitForTimeout(1000);

  // 在弹出菜单中点击"文章"
  await page.evaluate(() => {
    const items = document.querySelectorAll('a, li, div[class*="menu"] span, [class*="menu"] a');
    for (const el of items) {
      if (el.textContent.trim() === '文章') {
        el.click();
        return;
      }
    }
  });
  await page.waitForTimeout(3000);

  // 验证是否进入编辑器
  const url = page.url();
  if (url.includes('appmsg_edit')) {
    console.log('✅ Step 1 完成：已进入文章编辑器');
  } else {
    console.error('❌ 未进入编辑器，当前URL:', url);
  }

  // 保持浏览器打开，用于后续步骤
  console.log('浏览器保持打开，请执行下一步脚本');
  await new Promise(() => {}); // 保持进程运行
})();

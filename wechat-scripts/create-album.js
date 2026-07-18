/**
 * 创建公众号合集
 *
 * 用法：
 *   node create-album.js <合集名称> [合集简介]
 *
 * 示例：
 *   node create-album.js "codebase-memory"
 *   node create-album.js "codebase-memory" "CodeBase Memory 系列课程"
 */
const { init, closeBrowser } = require('./publish');

async function main() {
  const args = process.argv.slice(2);
  const albumName = args[0];
  if (!albumName) {
    console.error('用法: node create-album.js <合集名称> [合集简介]');
    process.exit(1);
  }
  const albumDesc = args[1] || '';

  const page = await init();

  // 先访问首页获取 token
  await page.goto('https://mp.weixin.qq.com', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const token = (page.url().match(/token=(\d+)/) || [])[1];
  if (!token) { console.error('无法获取 token'); await closeBrowser(); process.exit(1); }
  console.log('Token:', token);

  // 打开合集列表
  await page.goto(
    `https://mp.weixin.qq.com/cgi-bin/appmsgalbummgr?action=list&token=${token}&lang=zh_CN`,
    { waitUntil: 'domcontentloaded' }
  );
  await page.waitForTimeout(2000);

  // 点击创建合集 → 文章合集，等待编辑器弹窗
  const [popup] = await Promise.all([
    page.waitForEvent('popup', { timeout: 15000 }),
    (async () => {
      await page.locator('.weui-desktop-btn_wrp.weui-desktop-btn_main button').click();
      await page.waitForTimeout(800);
      await page.locator('.weui-desktop-dropdown__list-ele').first().click({ force: true });
    })()
  ]);

  await popup.waitForLoadState('domcontentloaded');
  await popup.waitForTimeout(2000);
  console.log('弹窗已打开');

  // 填写合集名称 — 找页面中可见的 input
  await popup.evaluate((name) => {
    // 找标签文字为"名称"旁边的 input
    const all = document.querySelectorAll('*');
    for (const el of all) {
      if (el.textContent.trim() === '名称' && el.offsetParent !== null) {
        // 找附近的 input
        let parent = el.parentElement;
        for (let i = 0; i < 5 && parent; i++) {
          const input = parent.querySelector('input');
          if (input && input.offsetParent !== null) {
            const setter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype, 'value'
            ).set;
            setter.call(input, name);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('填入了名称:', name);
            return;
          }
          const textarea = parent.querySelector('textarea');
          if (textarea && textarea.offsetParent !== null) {
            const setter = Object.getOwnPropertyDescriptor(
              window.HTMLTextAreaElement.prototype, 'value'
            ).set;
            setter.call(textarea, name);
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            return;
          }
          parent = parent.parentElement;
        }
      }
    }
    // 备用：找第一个可见的 input
    const inputs = document.querySelectorAll('input');
    for (const inp of inputs) {
      if (inp.offsetParent !== null) {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 'value'
        ).set;
        setter.call(inp, name);
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('备用填写名称');
        return;
      }
    }
  }, albumName);
  await popup.waitForTimeout(500);

  // 填写简介
  if (albumDesc) {
    await popup.evaluate((desc) => {
      const textareas = document.querySelectorAll('textarea');
      for (const ta of textareas) {
        if (ta.offsetParent !== null) {
          const setter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, 'value'
          ).set;
          setter.call(ta, desc);
          ta.dispatchEvent(new Event('input', { bubbles: true }));
          return;
        }
      }
    }, albumDesc);
  }

  await popup.waitForTimeout(1000);

  // 点击「发布」（取第一个非禁用的发布按钮）
  await popup.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.trim() === '发布' && btn.offsetParent !== null && !btn.disabled) {
        btn.click();
        console.log('点击了发布');
        return;
      }
    }
    console.log('未找到可用的发布按钮');
  });
  await popup.waitForTimeout(2000);

  console.log(`\n✅ 合集「${albumName}」已创建！`);
  await closeBrowser();
}

main().catch(err => {
  console.error('创建合集失败:', err);
  closeBrowser();
});

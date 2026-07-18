const { init } = require('./publish');

async function main() {
  const page = await init();
  const base = 'https://mp.weixin.qq.com/cgi-bin/appmsgalbummgr?action=list&token=1751905515&lang=zh_CN';

  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 方案1: 点击主按钮
  console.log('=== 方案1: 点创建合集主按钮 ===');
  await page.locator('.weui-desktop-btn_wrp.weui-desktop-btn_main button').click();
  await page.waitForTimeout(1000);

  // 看下拉菜单是否出现
  let dd = await page.evaluate(() => {
    const m = document.querySelector('.weui-desktop-dropdown-menu_bottom');
    return m ? m.style.display : 'not found';
  });
  console.log('下拉菜单display:', dd);

  // 方案2: 点扩展按钮
  console.log('\n=== 方案2: 点扩展按钮 ===');
  await page.locator('.weui-desktop-btn_extend button').click();
  await page.waitForTimeout(1000);

  dd = await page.evaluate(() => {
    const m = document.querySelector('.weui-desktop-dropdown-menu_bottom');
    return m ? getComputedStyle(m).display : 'not found';
  });
  console.log('下拉菜单display:', dd);

  // 如果下拉菜单可见，点第1项
  const items = page.locator('.weui-desktop-dropdown__list-ele');
  const count = await items.count();
  console.log('菜单项数:', count);
  if (count > 0) {
    const text = await items.first().textContent();
    console.log('第1项:', text.trim().substring(0, 20));

    // 用 evaluate 点击
    await page.evaluate(() => {
      const item = document.querySelector('.weui-desktop-dropdown__list-ele');
      if (item) {
        const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        item.dispatchEvent(evt);
      }
    });
    await page.waitForTimeout(2000);

    // 查看页面变化
    const body = await page.evaluate(() => document.body.innerText);
    const hasNewSection = body.includes('名称') || body.includes('合集信息') || body.includes('简介');
    console.log('出现编辑界面:', hasNewSection);

    if (hasNewSection) {
      const idx = body.indexOf('合集信息');
      console.log('合集编辑区域:', body.substring(Math.max(0, idx - 50), idx + 500));
    }
  }

  // 方案3: 直接点击编辑链接看能获得什么信息，然后用 JS 在页面中找创建合集的方法
  console.log('\n=== 方案3: 找全局JS方法 ===');
  const jsMethods = await page.evaluate(() => {
    const keys = Object.keys(window).filter(k =>
      k.toLowerCase().includes('album') ||
      k.toLowerCase().includes('appmsg') ||
      k.toLowerCase().includes('collection')
    );
    return keys;
  });
  console.log('相关全局变量:', jsMethods);

  console.log('\n浏览器保持打开, Ctrl+C退出');
  await new Promise(() => {});
}

main().catch(console.error);

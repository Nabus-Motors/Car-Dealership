const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const logs = [];
    page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));
    page.on('pageerror', err => logs.push({ type: 'pageerror', text: String(err) }));
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' }).catch(e => logs.push({ type: 'goto-error', text: String(e) }));
    await page.screenshot({ path: 'page-screenshot.png', fullPage: true }).catch(e => logs.push({ type: 'screenshot-error', text: String(e) }));
    const html = await page.content();
    fs.writeFileSync('page.html', html);
    fs.writeFileSync('console-logs.json', JSON.stringify(logs, null, 2));
    console.log('Done', { logsPath: 'console-logs.json', htmlPath: 'page.html', screenshot: 'page-screenshot.png' });
    await browser.close();
})();
// Genera una captura de cada web en /previews/<carpeta>.jpg
// Uso: node herramientas/generar-previews.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const carpetas = fs.readdirSync(path.join(raiz, 'proyectos'))
  .filter(d => fs.existsSync(path.join(raiz, 'proyectos', d, 'index.html')));

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  for (const d of carpetas) {
    const url = 'file://' + path.join(raiz, 'proyectos', d, 'index.html');
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(raiz, 'previews', d + '.jpg'), type: 'jpeg', quality: 72 });
    console.log('✓', d);
  }
  await browser.close();
})();

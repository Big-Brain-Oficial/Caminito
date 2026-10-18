// Renderiza la escena cuadro por cuadro con Chrome y la codifica en MP4.
// Uso:
//   node render.mjs                         → salida/03-como-funciona.mp4 (completo)
//   node render.mjs --escena ruta-andador   → salida/04-ruta-andador.mp4
//   node render.mjs --desde 9 --hasta 19.5  → solo un tramo
//   node render.mjs --fotos 3,12,22,35      → solo capturas PNG para revisar
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer-core';
import ffmpegPath from 'ffmpeg-static';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(import.meta.dirname, 'salida');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => {
  if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1]?.startsWith('--') ? true : all[i + 1] ?? true]);
  return acc;
}, []));
const fps = Number(args.fps ?? 30);
const fotos = typeof args.fotos === 'string' ? args.fotos.split(',').map(Number) : null;
const escena = typeof args.escena === 'string' ? args.escena : 'como-funciona';
const nombre = { 'como-funciona': '03-como-funciona', 'ruta-andador': '04-ruta-andador' }[escena] ?? escena;

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/video/${escena}/escena.html?render`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--ignore-gpu-blocklist', '--enable-gpu', '--use-angle=d3d11', '--enable-unsafe-swiftshader', '--hide-scrollbars', '--force-device-scale-factor=1'],
});
const page = await browser.newPage();
page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('[página]', m.text()); });
page.on('pageerror', e => console.log('[página]', e.message));
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.waitForFunction('window.sceneReady === true', { timeout: 120000 });
const duration = await page.evaluate('window.DURATION');
const gpu = await page.evaluate(() => { const g = document.createElement('canvas').getContext('webgl2'); const d = g.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'desconocido'; });
console.log('WebGL:', gpu);
fs.mkdirSync(OUT_DIR, { recursive: true });

const shot = async t => {
  await page.evaluate(t => window.renderAt(t), t);
  return page.screenshot({ type: 'png', optimizeForSpeed: true });
};

if (fotos) {
  for (const t of fotos) {
    const file = path.join(OUT_DIR, `${escena}-foto-${String(t).replace('.', '_')}s.png`);
    fs.writeFileSync(file, await shot(t));
    console.log('→', file);
  }
} else {
  const desde = Number(args.desde ?? 0), hasta = Number(args.hasta ?? duration);
  const salida = path.resolve(import.meta.dirname, args.salida ?? path.join('salida', desde === 0 && hasta === duration ? `${nombre}.mp4` : `${nombre}_${desde}-${hasta}s.mp4`));
  const ff = spawn(ffmpegPath, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', salida], { stdio: ['pipe', 'inherit', 'inherit'] });
  const total = Math.round((hasta - desde) * fps), t0 = Date.now();
  for (let i = 0; i < total; i++) {
    const buf = await shot(desde + i / fps);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 30 === 0) {
      const el = (Date.now() - t0) / 1000, eta = el / (i + 1) * (total - i - 1);
      console.log(`cuadro ${i + 1}/${total} · ${(el / (i + 1)).toFixed(2)} s/cuadro · faltan ~${Math.ceil(eta / 60)} min`);
    }
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => c === 0 ? res() : rej(new Error('ffmpeg terminó con código ' + c))));
  console.log('→', salida);
}
await browser.close();
server.close();

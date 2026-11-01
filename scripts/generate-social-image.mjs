// Renders public/social-image-v2.png (1200x630) from an inline HTML template
// using headless Chrome. Usage: node scripts/generate-social-image.mjs
// Set CHROME_PATH to override the browser binary.
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../public/social-image-v2.png");
const candidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) throw new Error("Chrome not found; set CHROME_PATH");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#05080c;color:#d7e3ea;overflow:hidden;
  font-family:ui-monospace,Menlo,"SF Mono",Consolas,monospace;position:relative}
.glow{position:absolute;inset:0;background:
  radial-gradient(600px 400px at 85% 0%,rgba(0,229,255,.18),transparent 70%),
  radial-gradient(500px 350px at 0% 100%,rgba(0,229,255,.08),transparent 70%)}
.grid{position:absolute;inset:0;background-image:
  linear-gradient(rgba(0,229,255,.05) 1px,transparent 1px),
  linear-gradient(90deg,rgba(0,229,255,.05) 1px,transparent 1px);background-size:40px 40px}
.win{position:absolute;left:70px;top:70px;right:70px;bottom:70px;border:2px solid rgba(0,229,255,.45);
  border-radius:16px;background:rgba(8,14,20,.92);box-shadow:0 0 60px rgba(0,229,255,.15)}
.bar{height:48px;border-bottom:1px solid rgba(0,229,255,.25);display:flex;align-items:center;padding:0 22px;gap:10px}
.dot{width:14px;height:14px;border-radius:50%;background:#26343f}
.dot:nth-child(1){background:#ff5f56}.dot:nth-child(2){background:#ffbd2e}.dot:nth-child(3){background:#27c93f}
.path{margin-left:16px;color:#6b8594;font-size:20px}
.body{padding:44px 56px}
.prompt{color:#00e5ff;font-size:28px}
h1{font-size:84px;color:#00e5ff;margin:22px 0 18px;letter-spacing:-2px;text-shadow:0 0 30px rgba(0,229,255,.4)}
.sub{font-size:30px;line-height:1.45;color:#d7e3ea}
.sub b{color:#fff;font-weight:600}
.tags{position:absolute;left:56px;bottom:36px;display:flex;gap:16px}
.tag{border:1px solid rgba(0,229,255,.5);color:#00e5ff;padding:8px 18px;border-radius:8px;font-size:24px}
.url{position:absolute;right:56px;bottom:44px;color:#6b8594;font-size:22px}
.cur{display:inline-block;width:16px;height:30px;background:#00e5ff;vertical-align:-5px;margin-left:6px}
</style></head><body><div class="glow"></div><div class="grid"></div>
<div class="win"><div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span>
<span class="path">~/home</span></div>
<div class="body"><div class="prompt">$ whoami</div>
<h1>&lt;Ang Yong Liang /&gt;</h1>
<div class="sub">NUS Computer Science graduate.<br><b>Software engineer</b> &middot; security &middot; platform<span class="cur"></span></div>
<div class="tags"><span class="tag">Projects</span><span class="tag">Patterns</span><span class="tag">Whiteboard</span></div>
<div class="url">yl-ang.github.io/home</div></div></div></body></html>`;

const dir = mkdtempSync(join(tmpdir(), "social-"));
const page = join(dir, "card.html");
writeFileSync(page, html);
execFileSync(chrome, [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
  "--window-size=1200,630", `--screenshot=${out}`, `file://${page}`,
], { stdio: "ignore" });
console.log("wrote", out);

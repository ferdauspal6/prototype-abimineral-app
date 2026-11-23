#!/usr/bin/env node
// Generates static canvas previews for every screen in screens.json.
// Usage:
//   node canvas/build.mjs
//   node canvas/capture.mjs
//
// Requires playwright-core. Set PLAYWRIGHT_CORE to an explicit module path
// when it is installed outside this project, and CHROME_PATH to a Chromium
// executable when the browser is not in the default Playwright cache.

import { createServer } from "node:http";
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");
const outDir = join(scriptDir, "previews");
const only = process.argv.find((value) => value.startsWith("--only="));
const onlyId = only ? only.slice("--only=".length) : "";

const playwright = await import(process.env.PLAYWRIGHT_CORE || "playwright-core");
const chromium = playwright.chromium || (playwright.default && playwright.default.chromium);

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cache = join(process.env.HOME || "", ".cache", "ms-playwright");
  try {
    const dirs = readdirSync(cache).filter((name) => name.startsWith("chromium-")).sort().reverse();
    for (const dir of dirs) {
      for (const candidate of ["chrome-linux64/chrome", "chrome-linux/chrome", "chrome-mac/Chromium.app/Contents/MacOS/Chromium", "chrome-win/chrome.exe"]) {
        const file = join(cache, dir, candidate);
        if (existsSync(file)) return file;
      }
    }
  } catch {}
  return undefined;
}

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon"
};

const server = createServer((req, res) => {
  let path = decodeURIComponent((req.url || "/").split("?")[0]);
  if (path.endsWith("/")) path += "index.html";
  const file = resolve(root, "." + path);
  if (!file.startsWith(root) || !existsSync(file)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "content-type": mime[extname(file).toLowerCase()] || "application/octet-stream" });
  res.end(readFileSync(file));
});

await new Promise((resolveReady) => server.listen(0, "127.0.0.1", resolveReady));
const port = server.address().port;
const base = `http://127.0.0.1:${port}/`;
mkdirSync(outDir, { recursive: true });

const manifest = JSON.parse(readFileSync(join(root, "screens.json"), "utf8"));
const screens = (manifest.screens || []).filter((screen) => screen.type !== "asset" && (!onlyId || screen.id === onlyId));
const browser = await chromium.launch({ executablePath: findChrome(), args: ["--no-sandbox"] });
const workers = 2;
let cursor = 0;
let done = 0;

async function capture(workerId) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  while (true) {
    const index = cursor++;
    if (index >= screens.length) break;
    const screen = screens[index];
    const width = Number(screen.w || manifest.defaultWidth || 1440);
    const height = Number(screen.h || screen.previewH || 900);
    await page.setViewportSize({ width, height });
    const url = new URL(screen.src, base);
    url.searchParams.set("v", String(Date.now()));
    try {
      await page.goto(url.href, { waitUntil: "load", timeout: 30000 });
      if (screen.src.startsWith("index.html")) {
        await page.waitForFunction(() => document.body && document.body._x_dataStack && document.body._x_dataStack.length, { timeout: 8000 }).catch(() => {});
        await page.waitForTimeout(screen.virtual ? 1400 : 900);
      } else {
        await page.waitForTimeout(900);
      }
      await page.addStyleTag({ content: ".toast{display:none!important} *{animation:none!important;transition:none!important;caret-color:transparent!important}" });
      await page.waitForTimeout(120);
      await page.screenshot({ path: join(outDir, screen.id + ".jpg"), type: "jpeg", quality: 72, animations: "disabled" });
      done += 1;
      console.log(`[${done}/${screens.length}] ${screen.id}`);
    } catch (error) {
      console.warn(`! ${screen.id}: ${error.message}`);
    }
  }
  await page.close();
}

await Promise.all(Array.from({ length: workers }, (_, index) => capture(index)));
await browser.close();
await new Promise((resolveClose) => server.close(resolveClose));
console.log(`Previews: ${done} generated in canvas/previews`);
try { execFileSync(process.execPath, [join(scriptDir, "build.mjs")], { cwd: root, stdio: "inherit" }); } catch (error) { console.warn("Manifest rebuild failed:", error.message); }

#!/usr/bin/env node
// Minimal static server for the Design Canvas kit. No dependencies.
// Usage: node canvas/serve.mjs [--port 8000] [--no-open] [--root <dir>]
//
// Serves the project folder that contains this canvas/ kit, then opens the
// viewer at http://localhost:<port>/canvas/ in your default browser.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, resolve, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const scriptDir = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
let startPort = 8000;
let openBrowser = true;
let rootArg = null;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--port" || a === "-p") startPort = parseInt(args[++i], 10) || startPort;
  else if (a === "--no-open") openBrowser = false;
  else if (a === "--root") rootArg = args[++i];
  else if (!a.startsWith("-")) rootArg = a;
}
const root = rootArg ? resolve(rootArg) : resolve(scriptDir, "..");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  let target = resolve(join(root, decoded));
  if (target !== root && !target.startsWith(root + sep)) return null;
  try {
    let s = await stat(target);
    if (s.isDirectory()) {
      target = join(target, "index.html");
      s = await stat(target);
    }
    return s.isFile() ? target : null;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const file = await resolveFile(req.url || "/");
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": MIME[extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500 Internal Server Error");
  }
});

function openUrl(url) {
  const platform = process.platform;
  let cmd, cmdArgs;
  if (platform === "win32") { cmd = "cmd"; cmdArgs = ["/c", "start", "", url]; }
  else if (platform === "darwin") { cmd = "open"; cmdArgs = [url]; }
  else { cmd = "xdg-open"; cmdArgs = [url]; }
  try {
    const child = spawn(cmd, cmdArgs, { stdio: "ignore", detached: true });
    child.on("error", () => {});
    child.unref();
  } catch {}
}

function listen(port, attemptsLeft) {
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE" && attemptsLeft > 0) {
      listen(port + 1, attemptsLeft - 1);
    } else {
      console.error(`Could not start server: ${err.message}`);
      process.exit(1);
    }
  });
  server.listen(port, () => {
    const url = `http://localhost:${port}/canvas/`;
    console.log(`Design Canvas serving ${root}`);
    console.log(`  ${url}`);
    console.log("Press Ctrl+C to stop.");
    if (openBrowser) openUrl(url);
  });
}

listen(startPort, 20);

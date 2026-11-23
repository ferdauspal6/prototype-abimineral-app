#!/usr/bin/env node
// Generates / updates screens.json (the Design Canvas manifest).
// No dependencies.
// Usage: node canvas/build.mjs [--root <dir>] [rootDir]
// Root defaults to the project folder that contains this canvas/ kit.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
let rootArg = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--root") rootArg = args[++i];
  else if (!args[i].startsWith("-")) rootArg = args[i];
}
const root = rootArg ? resolve(rootArg) : resolve(scriptDir, "..");
const OUT = join(root, "screens.json");

const KIT_VERSION = (() => {
  try {
    return readFileSync(join(scriptDir, "VERSION"), "utf8").trim() || "0.0.0";
  } catch {
    return "0.0.0";
  }
})();

const DEFAULTS = {
  title: "Screen Canvas",
  defaultWidth: 1440,
  rowWidth: 6000,
  ignore: [
    "assets",
    "node_modules",
    "partials",
    "components",
    "includes",
    "layouts",
    "dist",
    "build",
    "public",
    "canvas",
  ],
  groups: [],
  screens: [],
  links: [],
  assets: {
    dirs: ["assets"],
    extensions: ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"],
    recursive: true,
    displayWidth: 260,
    group: { id: "assets", name: "Assets" },
  },
};

function readJson(path, fallback) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

// Natural, numeric-aware comparison.
function natural(a, b) {
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function prettify(name) {
  const cleaned = name.replace(/[-_]+/g, " ").trim();
  if (cleaned.toLowerCase() === "root") return "Root";
  return cleaned
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return m ? m[1] : null;
}

// Reads <meta name="canvas" content="390x844"> (width-only also allowed).
function readCanvasMeta(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const name = attr(tag, "name");
    if (name && name.toLowerCase() === "canvas") {
      const content = attr(tag, "content");
      if (!content) continue;
      const parts = content.trim().split(/[x×\s]+/i).filter(Boolean);
      const w = parseInt(parts[0], 10);
      const h = parts[1] ? parseInt(parts[1], 10) : NaN;
      const size = {};
      if (!Number.isNaN(w)) size.w = w;
      if (!Number.isNaN(h)) size.h = h;
      return size;
    }
  }
  return {};
}

function idFromRel(rel) {
  return rel
    .replace(/\.[^./\\]+$/, "")
    .split(/[\\/]/)
    .join("-")
    .toLowerCase();
}

// Detects the viewer itself (rather than relying on its filename).
function isViewer(html) {
  return html.includes('id="stage"') && html.includes("screens.json");
}

function scan(dir, ignore, acc) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".")) continue;
      if (ignore.has(entry.name.toLowerCase())) continue;
      scan(full, ignore, acc);
    } else if (entry.isFile() && /\.html?$/i.test(entry.name)) {
      acc.push(full);
    }
  }
}

const prev = readJson(OUT, {});
const cfg = {
  title: prev.title ?? DEFAULTS.title,
  defaultWidth: prev.defaultWidth ?? DEFAULTS.defaultWidth,
  rowWidth: prev.rowWidth ?? DEFAULTS.rowWidth,
  ignore: Array.isArray(prev.ignore) ? prev.ignore : DEFAULTS.ignore.slice(),
};
const ignoreSet = new Set(cfg.ignore.map((s) => String(s).toLowerCase()));

const files = [];
scan(root, ignoreSet, files);

const prevScreens = Array.isArray(prev.screens) ? prev.screens : [];
const prevById = new Map(prevScreens.map((s) => [s.id, s]));
const prevGroups = Array.isArray(prev.groups) ? prev.groups : [];
const links = Array.isArray(prev.links) ? prev.links : [];

const screens = [];
const seen = new Set();
const added = [];
const groupNameById = new Map(prevGroups.map((g) => [g.id, g.name]));
const neededGroupIds = new Set();

for (const full of files) {
  const rel = relative(root, full).split(sep).join("/");
  const id = idFromRel(rel);
  if (seen.has(id)) {
    console.warn(`! duplicate id skipped: ${rel}`);
    continue;
  }
  seen.add(id);

  const existing = prevById.get(id);
  if (existing) {
    // Preserve manual edits untouched.
    screens.push(existing);
    if (existing.group) neededGroupIds.add(existing.group);
    continue;
  }

  let html = "";
  try {
    html = readFileSync(full, "utf8");
  } catch {
    continue;
  }
  if (isViewer(html)) continue;

  const segments = rel.split("/");
  const folder = segments.length > 1 ? segments[0] : "root";
  const group = segments.length > 1 ? slugify(folder) : "root";
  const size = readCanvasMeta(html);
  const name = (segments[segments.length - 1] || rel).replace(/\.html?$/i, "");

  const screen = { id, name, src: rel, group };
  if (size.w) screen.w = size.w;
  if (size.h) screen.h = size.h;

  screens.push(screen);
  neededGroupIds.add(group);

  let desc;
  if (size.w && size.h) desc = `${size.w}x${size.h}`;
  else if (size.w) desc = `${size.w}px wide, auto height`;
  else desc = `default width, auto height`;
  added.push({ rel, desc });

  if (segments.length > 1 && !groupNameById.has(group)) {
    groupNameById.set(group, prettify(folder));
  }
}

// ---- Asset images (rendered as frames, not iframes) ----
const assetsCfg = Object.assign(
  {
    dirs: ["assets"],
    extensions: ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"],
    recursive: true,
    displayWidth: 260,
    group: { id: "assets", name: "Assets" },
  },
  prev.assets || {}
);
assetsCfg.group = Object.assign({ id: "assets", name: "Assets" }, assetsCfg.group || {});
assetsCfg.dirs = (Array.isArray(assetsCfg.dirs) ? assetsCfg.dirs : ["assets"]).map(String);
assetsCfg.extensions = (Array.isArray(assetsCfg.extensions) ? assetsCfg.extensions : ["png"])
  .map((e) => String(e).toLowerCase().replace(/^\./, ""));

function scanImages(dir, exts, recursive, acc) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (recursive) scanImages(full, exts, recursive, acc);
    } else if (entry.isFile()) {
      const ext = (entry.name.split(".").pop() || "").toLowerCase();
      if (exts.includes(ext)) acc.push(full);
    }
  }
}

const imageFiles = [];
// Resolve each configured folder case-insensitively (Assets === assets).
function resolveDirCI(base, name) {
  try {
    const entries = readdirSync(base, { withFileTypes: true });
    const lower = String(name).toLowerCase();
    const hit = entries.find((e) => e.isDirectory() && e.name.toLowerCase() === lower);
    return hit ? hit.name : null;
  } catch {
    return null;
  }
}
const seenImagePaths = new Set();
for (const dir of assetsCfg.dirs) {
  const actual = resolveDirCI(root, dir) || dir;
  const found = [];
  scanImages(join(root, actual), assetsCfg.extensions, assetsCfg.recursive !== false, found);
  for (const full of found) {
    if (seenImagePaths.has(full)) continue;
    seenImagePaths.add(full);
    imageFiles.push(full);
  }
}

// Bundle file list: EVERY file under the assets dirs (any extension), exposed as
// screens.json "bundleFiles" so the viewer's Export ZIP can include non-image
// assets too (scripts, demo html, fonts, etc.).
function scanAllFiles(dir, acc) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) scanAllFiles(full, acc);
    else if (entry.isFile()) acc.push(full);
  }
}
const bundleFiles = [];
const seenBundlePaths = new Set();
for (const dir of assetsCfg.dirs) {
  const actual = resolveDirCI(root, dir) || dir;
  const found = [];
  scanAllFiles(join(root, actual), found);
  for (const full of found) {
    if (seenBundlePaths.has(full)) continue;
    seenBundlePaths.add(full);
    bundleFiles.push(relative(root, full).split(sep).join("/"));
  }
}
bundleFiles.sort(natural);

for (const full of imageFiles) {
  const rel = relative(root, full).split(sep).join("/");
  const id = idFromRel(rel);
  if (seen.has(id)) {
    console.warn(`! duplicate id skipped: ${rel}`);
    continue;
  }
  seen.add(id);

  const existing = prevById.get(id);
  if (existing) {
    screens.push(existing);
    if (existing.group) neededGroupIds.add(existing.group);
    continue;
  }

  let bytes = 0;
  try {
    bytes = statSync(full).size;
  } catch {}
  const name = (rel.split("/").pop() || rel).replace(/\.[^.]+$/, "");
  const screen = { id, name, src: rel, group: assetsCfg.group.id, type: "asset", bytes };
  screens.push(screen);
  neededGroupIds.add(assetsCfg.group.id);
  if (!groupNameById.has(assetsCfg.group.id)) {
    groupNameById.set(assetsCfg.group.id, assetsCfg.group.name);
  }
  added.push({ rel, desc: `image, ${(bytes / 1024).toFixed(1)} KB` });
}

// ---- Virtual screens (SPA states) ----
// canvas-screens.json defines page/popup states of index.html. They are
// rendered as index.html?canvas=<id> so the viewer can inspect each state.
let canvasScreens = [];
try {
  const raw = JSON.parse(readFileSync(join(root, "canvas-screens.json"), "utf8"));
  canvasScreens = Array.isArray(raw) ? raw : raw.screens || [];
} catch {}

for (const def of canvasScreens) {
  if (!def || !def.id) continue;
  const id = String(def.id);
  if (seen.has(id)) {
    console.warn(`! duplicate virtual screen skipped: ${id}`);
    continue;
  }
  seen.add(id);
  const existing = prevById.get(id) || {};
  const group = def.group || "root";
  const screen = {
    ...existing,
    id,
    name: def.name || id,
    src: `index.html?canvas=${encodeURIComponent(id)}`,
    group,
    virtual: true,
    w: def.w || cfg.defaultWidth || 1440,
  };
  // Let the viewer measure the real page height unless the definition pins one.
  delete screen.h;
  if (def.h != null) screen.h = def.h;
  screens.push(screen);
  neededGroupIds.add(group);
  if (!groupNameById.has(group)) {
    groupNameById.set(group, def.groupName || prettify(group));
  }
  added.push({ rel: screen.src, desc: `${screen.w}px wide, virtual screen` });
}

const removed = prevScreens.filter((s) => !seen.has(s.id)).map((s) => s.src);

// Order: preserved screens keep their order; new screens are naturally sorted
// and appended.
const prevOrder = new Map(prevScreens.map((s, i) => [s.id, i]));
const preserved = screens
  .filter((s) => prevOrder.has(s.id))
  .sort((a, b) => prevOrder.get(a.id) - prevOrder.get(b.id));
const fresh = screens
  .filter((s) => !prevOrder.has(s.id))
  .sort((a, b) => natural(a.id, b.id));
const orderedScreens = [...preserved, ...fresh];

// Groups: keep existing order, drop empties, append new needed groups.
const usedGroupIds = new Set(orderedScreens.map((s) => s.group).filter(Boolean));
const groups = prevGroups
  .filter((g) => usedGroupIds.has(g.id))
  .map((g) => ({ id: g.id, name: g.name }));

for (const gid of [...neededGroupIds].sort(natural)) {
  if (groups.some((g) => g.id === gid)) continue;
  groups.push({ id: gid, name: groupNameById.get(gid) || prettify(gid) });
}

// Present modules in workflow order instead of raw id order.
const GROUP_ORDER = ["root", "penjualan", "logistik", "pembelian", "keuangan", "pengguna", "auth", "assets"];
const groupRank = (gid) => {
  const index = GROUP_ORDER.indexOf(gid);
  return index === -1 ? GROUP_ORDER.length : index;
};
groups.sort((a, b) => groupRank(a.id) - groupRank(b.id) || natural(a.id, b.id));

// Keep the curated order from canvas-screens.json inside each module.
const screenDefIndex = new Map(canvasScreens.map((d, i) => [String(d.id), i]));
orderedScreens.sort((a, b) => {
  const diff = groupRank(a.group) - groupRank(b.group);
  if (diff) return diff;
  const ia = screenDefIndex.has(a.id) ? screenDefIndex.get(a.id) : -1;
  const ib = screenDefIndex.has(b.id) ? screenDefIndex.get(b.id) : -1;
  if (ia !== ib) return ia - ib;
  const pa = prevOrder.has(a.id) ? prevOrder.get(a.id) : Number.MAX_SAFE_INTEGER;
  const pb = prevOrder.has(b.id) ? prevOrder.get(b.id) : Number.MAX_SAFE_INTEGER;
  return pa - pb;
});

for (const screen of orderedScreens) {
  const previewFile = join(scriptDir, "previews", screen.id + ".jpg");
  if (existsSync(previewFile)) {
    screen.preview = `canvas/previews/${screen.id}.jpg`;
    screen.previewW = Number(screen.w || cfg.defaultWidth || 1440);
    screen.previewH = Number(screen.h || 900);
  }
}

const RESERVED = ["title", "defaultWidth", "rowWidth", "ignore", "canvasVersion", "assets", "bundleFiles", "groups", "screens", "links"];
const extras = {};
for (const k of Object.keys(prev)) {
  if (!RESERVED.includes(k)) extras[k] = prev[k];
}

const out = {
  title: cfg.title,
  defaultWidth: cfg.defaultWidth,
  rowWidth: cfg.rowWidth,
  ignore: cfg.ignore,
  canvasVersion: KIT_VERSION,
  assets: assetsCfg,
  bundleFiles,
  ...extras,
  groups,
  screens: orderedScreens,
  links,
};

writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");

console.log(`Design Canvas v${KIT_VERSION}`);
for (const a of added) console.log(`+ ${a.rel} (${a.desc})`);
for (const r of removed) console.log(`- ${r}`);
console.log(
  `Done: ${orderedScreens.length} screens, ${groups.length} modules (+${added.length} added, -${removed.length} removed)`
);

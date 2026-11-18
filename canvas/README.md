# Design Canvas — mini-framework

A pannable, zoomable canvas that shows every page of a static HTML design at
once, grouped by module, with an element inspector (Tailwind classes, size,
spacing, typography, colors, computed CSS). Vanilla JS, no build step, no npm
dependencies. Works for desktop pages and mobile screens alike.

## Quick start

```bash
# from the project root
node canvas/serve.mjs
# -> serves the project and opens http://localhost:8000/canvas/
```

Or double-click `canvas/start.command` (macOS) / `canvas/start.bat` (Windows).

The viewer **must be served over HTTP** — opening `canvas/index.html` by
double-clicking (`file://`) cannot load `screens.json` or inspect frames, and
will show a warning.

## Use in another project

```bash
# from the target project root
npx degit <user>/design-canvas-kit --force   # adds canvas/, _headers.example, screens.json.example
# optional: cp _headers.example _headers
node canvas/build.mjs                        # creates screens.json for this project
node canvas/serve.mjs                         # http://localhost:8000/canvas/
```

- `screens.json` is **not** part of the kit, so pulling the kit never
  overwrites your manifest or manual edits.
- **Upgrade** an existing project: `npx degit <user>/design-canvas-kit --force`
  again (only `canvas/` is replaced), then re-run `node canvas/build.mjs`.
- If `degit` refuses a non-empty folder: `npx degit <user>/design-canvas-kit .tmp-kit`
  then copy `canvas/` into the project root.
- The viewer warns (toast + console) when `screens.json` was built by a
  different kit version — just run `node canvas/build.mjs`.

## How it works

The kit lives in `canvas/` and treats the **parent folder as the project root**:

```
your-project/
├─ index.html, about.html, …      ← your design pages
├─ mobile/                        ← a folder = a module (group)
│  ├─ onboarding.html
│  └─ home.html
├─ assets/                        ← images become an "Assets" module
│  ├─ logo.png
│  └─ icon.png
├─ screens.json                   ← generated manifest + config
└─ canvas/
   ├─ index.html                  ← the viewer
   ├─ build.mjs                   ← manifest generator
   ├─ serve.mjs                   ← local server
   └─ README.md
```

Regenerate the manifest after adding or removing pages:

```bash
node canvas/build.mjs
```

It is **incremental and non-destructive**: new files are added, removed files
are dropped, and existing screens/groups/links plus manual edits (name, group,
`w`, `h`, `x`, `y`, and extra config fields) are preserved. Running it twice
changes nothing.

## Conventions (no config needed)

- One `.html` file = one screen. A name above each frame is clickable.
- One top-level folder = one module/group; root-level files go to `Root`.
- Declare a screen size in the page `<head>`:

  ```html
  <meta name="canvas" content="390x844">  <!-- width x height -->
  <meta name="canvas" content="1440">     <!-- width only, auto height -->
  ```

  Without it a page uses `defaultWidth` (1440) and auto height.
- The `canvas/` folder itself is ignored, and the viewer is auto-detected.

## `screens.json`

```json
{
  "title": "My Design",
  "defaultWidth": 1440,
  "rowWidth": 6000,
  "ignore": ["assets", "node_modules", "canvas"],
  "flow": { "defaultOn": false, "focusMode": true, "remember": true },
  "bundle": {
    "filename": "my-design.zip",
    "include": ["index.html", "assets/**"],
    "exclude": ["canvas/**", "*.md", "screens.json", "*.zip", "**/*.zip"]
  },
  "assets": {
    "dirs": ["assets"],
    "extensions": ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"],
    "recursive": true,
    "displayWidth": 260,
    "group": { "id": "assets", "name": "Assets" }
  },
  "groups":  [{ "id": "mobile", "name": "Mobile" }],
  "screens": [{ "id": "mobile-home", "name": "Home", "src": "mobile/home.html", "group": "mobile", "w": 390 }],
  "links":   [{ "from": "mobile-home", "to": "mobile-detail", "label": "Tap row" }]
}
```

- Screen `id` = path without extension, `/` replaced by `-`, lowercased.
- `w`/`h` optional (missing `w` = `defaultWidth`, missing `h` = auto height).
- Screens **without** `x`/`y` are auto-laid-out; a screen **with** `x`/`y` is
  pinned to that position.
- Any extra top-level keys (like `flow`, `assets` or `theme`) are preserved by
  the build.

### Assets module

Every image inside the folders listed in `assets.dirs` (recursively) becomes a
frame in an **Assets** module — rendered as an image preview on a checkered
background, sized to `displayWidth` (height follows the image ratio). Click an
asset frame to see its path, pixels and file size, and to copy its path, URL or
an `<img>` snippet. The `assets` folders stay in `ignore`, so they are never
scanned as page screens. Set `assets.dirs` to `[]` to disable the module.

### Export ZIP

The viewer toolbar has an **Export ZIP** button that downloads the project's
client-ready source files as a single ZIP (rendered entirely in the browser, so
it also works on static hosting). It uses [fflate](https://github.com/101arrowz/fflate)
from a CDN.

Configure what gets bundled with the optional `bundle` key in `screens.json`:

```json
"bundle": {
  "filename": "my-design.zip",
  "include": ["index.html", "assets/**"],
  "exclude": ["canvas/**", "node_modules/**", "*.md", "screens.json", "*.log", "*.zip", "**/*.zip"]
}
```

- `include` — globs matched against the candidate file list. When omitted, all
  screens are candidates.
- `exclude` — globs to drop. Patterns use `*` (no `/`), `**` (any depth) and `?`.
  Note: `*.md` only matches top-level files; use `**/*.md` for every depth.
- `filename` — downloaded ZIP name (default `export.zip`).

Candidates are the page/asset screens **plus** every file under `assets.dirs`,
which the build lists in the generated **`bundleFiles`** array (so scripts,
demo HTML, fonts, etc. are included too — not just images). `bundleFiles` is
regenerated by `node canvas/build.mjs`; do not edit it by hand.

### Flow arrows

Add entries to `links` to draw labeled arrows between screens. `flow` controls
their behavior:

| Key | Default | Meaning |
| --- | --- | --- |
| `defaultOn` | `false` | Whether arrows show on first open |
| `focusMode` | `true` | Hovering a screen shows only its links; labels appear on focus |
| `remember` | `true` | Remember the Flow on/off state in the browser |

Toggle arrows with the **Flow** button or `F`.

## Pointer tools & panning

Two pointer tools (toolbar `Cursor | Move`, or `H` to toggle; icon-only):

- **Cursor** (default) — left-click selects; left-drag does nothing, so you can
  click precisely. Pan with **middle-click drag** or **Space + drag**.
- **Move** — left-drag pans (hand cursor).

Middle-click drag pans in both modes. The wheel scrolls (pans) the canvas;
Ctrl/⌘ + wheel or trackpad pinch zooms around the cursor.

## Controls

| Action | How |
| --- | --- |
| Pan | `Cursor`: middle-drag or Space+drag · `Move`: drag · wheel scrolls |
| Tool | `H` toggles Cursor / Move |
| Zoom | Ctrl/⌘ + scroll, or trackpad pinch (around the cursor) |
| Zoom range | 5% – 400% |
| Fit all | `Fit` or `0` |
| 100% | `100%` or `1` |
| Zoom in/out | `+` / `-` |
| Inspect / Preview | mode toggle, or `V` / `P` |
| Flow arrows | `Flow` or `F` |
| Jump | the `Jump to screen…` dropdown |
| Select frame (colors) | click the name above a frame |
| Zoom to frame / module | double-click its name / its title |
| Select element | click it (Inspect mode) |
| Parent / child | `↑` / `↓` |
| Measure distance | hold `Alt`, hover another element |
| Deselect | click empty canvas, or `Esc` |
| Reset pages | `Reset` (Preview mode) |
| Reload frames | `Reload` (forces pages/images to reload, bypassing cache) |
| Image menu | right-click an image → Download · Copy URL · Copy data URI · Open |

## Downloading & copying images

- **Right-click any image** (inside a page or an asset frame) for a menu with
  **Download image**, **Copy image URL**, **Copy as data URI** and **Open**.
- In **Inspect**, when the selected element contains an image (`<img>`,
  `<picture>`, or a CSS `background-image`), an **Image** section appears with
  **Download** and **Copy data URI**.
- **Asset frames** also have a **Download** button.
- Downloads use `fetch` → blob → `<a download>`; if a cross-origin image blocks
  this, it opens in a new tab instead.

## Colors & Fonts scope

The palette is contextual:

| Selection | Shows |
| --- | --- |
| An element/component | colors & fonts used **inside that element only** |
| A screen (click its name) | all colors & fonts on that screen |
| Nothing | **global** palette across all screens |

Click any swatch to copy the hex; click a text style to copy its font rule.

Every value, class chip, color swatch and text style is click-to-copy; so are
the `HTML`, `CSS` and `Selector` buttons. `CSS` is generated from computed
styles with defaults omitted.

Frames are loaded with a cache-busting stamp (`?v=…`), so a normal browser
refresh always reflects your latest files — even with a plain static server
that sends no cache headers. Use `Reload` to force a reload without refreshing
the whole canvas.

## Auto height caveat

A page's height is measured on load and kept updated with a `ResizeObserver`
(so late-loading Tailwind CDN styles are handled). Pages sized to the viewport
(`min-h-screen`, `h-screen`, `100vh`) cannot be auto-sized inside a frame —
give them an explicit height in `screens.json` instead.

## Deploy

Deploy the project folder as-is. `_headers` (Cloudflare Pages / Netlify) sets
`X-Frame-Options: SAMEORIGIN` and `Content-Security-Policy: frame-ancestors
'self'`, allowing same-origin framing. Open `/canvas/` after deploy.

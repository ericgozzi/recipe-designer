# Grid Recipe Generator

Build a recipe as a left-to-right flow graph (ingredients → steps → final dish),
then print it as a compact "grid recipe" sheet with merged cells.

Built with Vue 3 + Vite.

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build

```bash
npm run build     # -> dist/index.html (one self-contained file, works offline)
npm run preview
```

The build inlines all JS and CSS into a single `dist/index.html`, so you can open it
straight from disk.

## Deploy to GitHub Pages

Every push to `main` builds the app and publishes it with
[.github/workflows/deploy.yml](.github/workflows/deploy.yml).
One-time setup: in the repository go to **Settings → Pages → Build and deployment** and set
**Source** to **GitHub Actions**. The site appears at `https://<user>.github.io/<repo>/`.

## Features

- **Flow Graph**: drag nodes, drag from a node's blue port to another node to wire them.
  Wires that would create a cycle, start from a final dish, or end at an ingredient are refused.
  - `Delete` / `Backspace` removes the selected node or wire, `Esc` clears the selection.
  - `Ctrl` + mouse wheel zooms around the cursor.
- **Grid Recipe**: hover a cell to highlight what feeds it and what it feeds; click to tick it off.
  Scale the yield (0.5× / 1× / 2×), choose A4 or A5 (always landscape) and export a PDF
  (the print dialog opens: choose "Save as PDF"). The recipe is always fitted to exactly one page,
  and the screen shows a true-to-size preview of that page. Optional black & white mode.
- 7 languages (EN, FR, IT, DE, ES, JA, PT). Built-in presets re-translate until you edit them.
- Work is autosaved in the browser (localStorage). JSON import/export (paste or load a `.json` file).

## Project layout

```
src/
  App.vue                 shell, keyboard shortcuts
  store.js                reactive state and every action (presets, editing, import, autosave)
  data/                   translations (i18n.js), presets, units
  lib/grid.js             graph → merged-cell grid compiler, auto-layout
  lib/typeIcons.js        icon for each node type
  components/             header, canvas, nodes, inspector, grid sheet, modal, toasts
  styles/base.css         design tokens and shared controls
legacy/                   the original single-file version
```

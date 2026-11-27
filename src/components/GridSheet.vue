<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { state, t, servings, toggleCellCompleted, amountLabel, PAPER } from '../store.js';
import { compileGridMatrix } from '../lib/grid.js';
import { formatQuantity } from '../lib/format.js';
import PillTag from './PillTag.vue';
import { SYMBOLS } from '../data/symbols.js';
import { categoryByKey } from '../data/categories.js';

const stageEl = ref(null);
const sheetEl = ref(null);

const compiled = computed(() => (state.nodes.length ? compileGridMatrix(state.nodes, state.edges) : null));
const preSteps = computed(() => state.preStartSteps.map((s) => s.trim()).filter(Boolean));
const yieldNum = computed(() => formatQuantity(servings() * state.yieldMultiplier));

function colTitle(c) {
  return c === 0 ? t('colIngredients') : `${t('colStage')} ${String(c).padStart(2, '0')}`;
}
const category = computed(() => categoryByKey(state.category));
const activeSymbols = computed(() => SYMBOLS.filter((s) => state.symbols.includes(s.key)));
const pad = (n) => String(n).padStart(2, '0');

// ---------------------------------------------------------------------------
// Hover lineage: highlight everything upstream and downstream of a cell
// ---------------------------------------------------------------------------
const hovered = ref(null);
function lineageClass(origId) {
  if (!hovered.value || !compiled.value) return null;
  return compiled.value.lineage.get(hovered.value)?.has(origId) ? 'lineage-active' : 'lineage-dim';
}
function cellClasses(cell) {
  if (cell.kind === 'passthrough') return ['cell-passthrough', lineageClass(cell.sourceOrigId)];
  if (cell.kind === 'empty') return ['cell-empty'];
  const id = cell.node.origId;
  return [`cell-${cell.node.type}`, { 'cell-done': state.completedCells.has(id) }, lineageClass(id)];
}

// ---------------------------------------------------------------------------
// Page fitting. The sheet is laid out at width W/z and drawn with CSS zoom z, so
// it is exactly W wide on paper; z is the largest value for which the content
// also fits the page height. The on-screen paper is the same page, scaled by s.
// ---------------------------------------------------------------------------
const PX_PER_MM = 96 / 25.4;
const page = computed(() => PAPER[state.paperSize]);
const contentPx = computed(() => ({
  w: (page.value.w - 2 * page.value.margin) * PX_PER_MM,
  h: (page.value.h - 2 * page.value.margin) * PX_PER_MM,
}));

const fitZ = ref(1);
const stageWidth = ref(0);
const viewHeight = ref(window.innerHeight);
const onWinResize = () => (viewHeight.value = window.innerHeight);

// The whole page stays in view; A5 previews smaller than A4, as on a real desk.
const displayScale = computed(() => {
  const pageW = page.value.w * PX_PER_MM;
  const pageH = page.value.h * PX_PER_MM;
  const byHeight = (Math.max(320, viewHeight.value - 250) / (PAPER.A4.h * PX_PER_MM)) * pageH;
  const display = Math.min(stageWidth.value || pageW, pageW * 1.2, (byHeight * pageW) / pageH);
  return display / pageW;
});

const paperStyle = computed(() => {
  const s = displayScale.value;
  const p = page.value;
  return {
    width: `${p.w * PX_PER_MM * s}px`,
    height: `${p.h * PX_PER_MM * s}px`,
    padding: `${p.margin * PX_PER_MM * s}px`,
    '--page-w': `${p.w}mm`,
    '--page-h': `${p.h}mm`,
    '--page-m': `${p.margin}mm`,
    '--print-zoom': String(fitZ.value * 0.985),
  };
});

function applySheetStyle() {
  const sheet = sheetEl.value;
  if (!sheet) return;
  sheet.style.width = `${contentPx.value.w / fitZ.value}px`;
  sheet.style.zoom = String(fitZ.value * displayScale.value);
}

function measureFit() {
  const sheet = sheetEl.value;
  if (!sheet || !sheet.offsetParent) return; // hidden: keep the last fit
  const { w, h } = contentPx.value;
  sheet.style.zoom = '1';
  const fits = (z) => {
    sheet.style.width = `${w / z}px`;
    return sheet.scrollWidth <= w / z + 1 && sheet.offsetHeight * z <= h;
  };
  let z = 1.3; // small recipes may grow a little to fill the page
  if (!fits(z)) {
    let lo = 0.2;
    let hi = z;
    for (let i = 0; i < 16; i++) {
      const mid = (lo + hi) / 2;
      if (fits(mid)) lo = mid;
      else hi = mid;
    }
    z = lo;
  }
  fitZ.value = z;
  applySheetStyle();
}

watch(
  () => [compiled.value, preSteps.value, state.title, state.category, state.symbols.length, yieldNum.value, state.paperSize, state.lang, state.activeTab, state.yieldMultiplier],
  () => nextTick(measureFit),
  { flush: 'post' }
);
watch(displayScale, applySheetStyle, { flush: 'post' });

let resizeObs = null;
function onBeforePrint() {
  hovered.value = null;
  measureFit();
}
onMounted(() => {
  resizeObs = new ResizeObserver(([entry]) => {
    const w = Math.round(entry.contentRect.width);
    if (w) stageWidth.value = w;
  });
  resizeObs.observe(stageEl.value);
  window.addEventListener('beforeprint', onBeforePrint);
  window.addEventListener('resize', onWinResize);
  measureFit();
  document.fonts?.ready.then(measureFit);
});
onBeforeUnmount(() => {
  resizeObs?.disconnect();
  window.removeEventListener('beforeprint', onBeforePrint);
  window.removeEventListener('resize', onWinResize);
});
</script>

<template>
  <div ref="stageEl" class="paper-stage">
    <div class="paper" :class="{ mono: state.monoInk }" :style="paperStyle">
      <article ref="sheetEl" class="sheet" @mouseleave="hovered = null">
        <header class="sheet-head">
          <div class="head-col">
          <div v-if="category" class="sheet-category">
            <component :is="category.icon" :size="12" :stroke-width="2" />{{ t('categories')[category.key] }}
          </div>
          <div class="head-main">
            <h2 class="sheet-title">{{ state.title.trim() || 'Untitled Recipe' }}</h2>
            <ul v-if="activeSymbols.length" class="sheet-symbols">
              <li v-for="s in activeSymbols" :key="s.key" :class="s.tone" :data-tip="t('symbols')[s.key]">
                <component :is="s.icon" :size="14" :stroke-width="1.75" />
              </li>
            </ul>
          </div>
          </div>
          <div class="yield">
            <span class="yield-num">{{ yieldNum }}</span>
            <span class="yield-unit">{{ t('servingsUnit') }}</span>
          </div>
        </header>

        <section v-if="preSteps.length" class="prestart">
          <span class="prestart-label">{{ t('sheetBefore') }}</span>
          <ol class="prestart-list">
            <li v-for="(step, i) in preSteps" :key="i">
              <span class="pre-num">{{ pad(i + 1) }}</span>{{ step }}
            </li>
          </ol>
        </section>

        <table v-if="compiled" class="grid-table">
          <thead :title="t('gridHint')">
            <tr>
              <th v-for="c in compiled.numCols" :key="c">{{ colTitle(c - 1) }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, r) in compiled.rows" :key="r">
              <td
                v-for="cell in row"
                :key="cell.key"
                :rowspan="cell.rowspan > 1 ? cell.rowspan : undefined"
                :colspan="cell.colspan > 1 ? cell.colspan : undefined"
                :class="cellClasses(cell)"
                @mouseenter="cell.kind === 'node' ? (hovered = cell.node.origId) : null"
                @click="cell.kind === 'node' && toggleCellCompleted(cell.node.origId)"
              >
                <div v-if="cell.kind === 'passthrough'" class="track"></div>

                <template v-else-if="cell.kind === 'node' && cell.node.type === 'ingredient'">
                  <div class="cell-head">
                    <span class="cell-label">{{ cell.node.name }}</span>
                    <span class="cell-qty">{{ amountLabel(cell.node) }}</span>
                  </div>
                  <div v-if="cell.node.note" class="cell-note">{{ cell.node.note }}</div>
                </template>

                <template v-else-if="cell.kind === 'node'">
                  <div class="cell-label">{{ cell.node.title }}</div>
                  <div v-if="cell.node.tags?.length" class="cell-tags">
                    <PillTag v-for="(tag, i) in cell.node.tags" :key="i" :tag="tag" />
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="sheet-empty">{{ t('gridEmpty') }}</div>
      </article>
    </div>
  </div>

</template>

<style scoped>
/* ---------- Desk and paper ---------- */
.paper-stage {
  display: flex;
  justify-content: center;
  min-width: 0;
}
/* "Graphite" palette: near-monochrome warm greys with a single orange accent
   that marks the final dish and time/heat tags. Light on ink when printed. */
.paper {
  --paper: #ffffff;
  --sheet-ink: #1b1b19;
  --sheet-rule: rgba(27, 27, 25, 0.22);
  --tint-ing: #f2f2ef;
  --tint-ing-hover: #e8e8e4;
  --tint-lav: #ffffff;
  --tint-lav-hover: #f5f5f2;
  --tint-out: #fff0e8;
  --tint-out-hover: #ffe3d4;
  /* accents used by pills, numbers, category and symbols on the sheet */
  --green-ink: #55554f;
  --orange-ink: #e5470e;
  --orange-deep: #ff5b1f;
  --saffron-ink: #55554f;
  flex-shrink: 0;
  background: var(--paper);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(60, 50, 30, 0.08), 0 14px 30px -10px rgba(80, 70, 50, 0.3), -8px -8px 20px rgba(255, 255, 255, 0.8);
  color: var(--sheet-ink);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.paper.mono {
  --paper: #ffffff;
  --sheet-rule: rgba(0, 0, 0, 0.55);
  --tint-ing: transparent;
  --tint-ing-hover: rgba(0, 0, 0, 0.04);
  --tint-lav: transparent;
  --tint-lav-hover: rgba(0, 0, 0, 0.04);
  --tint-out: transparent;
  --tint-out-hover: rgba(0, 0, 0, 0.04);
  background: #fff;
}
.sheet {
  display: block;
  transform-origin: 0 0;
}

/* ---------- Head: menu-card title ---------- */
.sheet-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 12px;
  border-bottom: 1.5px solid var(--sheet-ink);
}
.head-col {
  min-width: 0;
}
.sheet-category {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 6px;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--orange-deep);
}
.mono .sheet-category {
  color: var(--sheet-ink);
}
.head-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 18px;
  min-width: 0;
}
.sheet-symbols {
  display: flex;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.sheet-symbols li {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px currentColor;
}
.sheet-symbols .green { color: var(--green-ink); }
.sheet-symbols .orange { color: var(--orange-deep); }
.sheet-symbols .saffron { color: var(--saffron-ink); }
.mono .sheet-symbols li { color: var(--sheet-ink); }
.sheet-title {
  margin: 0;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: 40px;
  line-height: 1;
  letter-spacing: -0.015em;
}
.yield {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}
.yield-num {
  font-family: var(--font-display);
  font-size: 36px;
  line-height: 0.9;
}
.yield-unit {
  margin-top: 3px;
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.2em;
}

/* ---------- Before you start ---------- */
.prestart {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 9px 0 10px;
}
.prestart-label {
  flex-shrink: 0;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 15px;
}
.prestart-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 11px;
  line-height: 1.4;
}
.pre-num {
  margin-right: 6px;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  color: var(--saffron-ink);
}
.mono .pre-num {
  color: var(--sheet-ink);
}

/* ---------- The grid ---------- */
.grid-table {
  width: 100%;
  border-collapse: collapse;
}
.prestart + .grid-table,
.sheet-head + .grid-table {
  margin-top: 0;
}
.grid-table th,
.grid-table td {
  border: 1px solid var(--sheet-rule);
  vertical-align: middle;
  transition: background-color 0.12s ease, opacity 0.12s ease;
}
.grid-table tr > :first-child {
  border-left: none;
}
.grid-table tr > :last-child {
  border-right: none;
}
.grid-table tbody tr:last-child td {
  border-bottom: 1.5px solid var(--sheet-ink);
}
.grid-table thead th {
  border-top: 1.5px solid var(--sheet-ink);
  border-bottom: 1px solid var(--sheet-ink);
  padding: 6px 9px;
  font-family: var(--font-mono);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-align: left;
  color: rgba(34, 32, 28, 0.65);
}
.sheet-head + .grid-table thead th {
  border-top: none;
}

.cell-ingredient,
.cell-lavoration,
.cell-output {
  cursor: pointer;
}
.cell-ingredient {
  min-width: 180px;
  max-width: 250px;
  padding: 7px 10px;
  background: var(--tint-ing);
}
.cell-ingredient:hover { background: var(--tint-ing-hover); }
.cell-lavoration {
  min-width: 170px;
  max-width: 250px;
  padding: 8px 11px;
  background: var(--tint-lav);
}
.cell-lavoration:hover { background: var(--tint-lav-hover); }
.cell-output {
  min-width: 190px;
  max-width: 270px;
  padding: 10px 14px;
  background: var(--tint-out);
}
.cell-output:hover { background: var(--tint-out-hover); }
.cell-passthrough {
  min-width: 40px;
  padding: 4px 8px;
}
.track {
  position: relative;
  height: 0;
  border-bottom: 1px dashed rgba(34, 32, 28, 0.45);
}
.track::after {
  content: '';
  position: absolute;
  right: -1px;
  top: -3px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--sheet-ink);
  opacity: 0.5;
}

.cell-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}
.cell-label {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.38;
}
.cell-ingredient .cell-label {
  font-weight: 600;
}
.cell-output .cell-label {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.18;
}
.cell-qty {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.cell-note {
  margin-top: 1px;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 13px;
  line-height: 1.2;
  color: rgba(34, 32, 28, 0.62);
}
.cell-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}
.sheet :deep(.pill) {
  padding: 1px 7px;
  font-size: 8.5px;
  background: transparent;
  box-shadow: inset 0 0 0 1px currentColor;
}
.sheet :deep(.pill-tech) { color: var(--green-ink); }
.sheet :deep(.pill-param) { color: var(--orange-ink); }
.mono :deep(.pill) {
  color: var(--sheet-ink) !important;
}

.lineage-dim {
  opacity: 0.28;
}
.lineage-active:not(.cell-passthrough) {
  box-shadow: inset 0 0 0 2px var(--orange);
}
.cell-done .cell-label {
  text-decoration: line-through;
  text-decoration-thickness: 1px;
  opacity: 0.55;
}
.cell-done :deep(.pill),
.cell-done .cell-qty,
.cell-done .cell-note {
  opacity: 0.45;
}

.sheet-empty {
  padding: 60px 20px;
  text-align: center;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 20px;
  color: rgba(34, 32, 28, 0.5);
}

/* ---------- Print: the paper becomes the page ---------- */
@media print {
  .paper-stage {
    display: block;
  }
  .paper {
    width: var(--page-w) !important;
    height: calc(var(--page-h) - 0.6mm) !important;
    padding: var(--page-m) !important;
    border-radius: 0;
    box-shadow: none;
    break-after: avoid;
    break-inside: avoid;
  }
  .sheet {
    zoom: var(--print-zoom) !important;
  }
  .lineage-dim {
    opacity: 1;
  }
  .lineage-active:not(.cell-passthrough) {
    box-shadow: none;
  }
}
</style>

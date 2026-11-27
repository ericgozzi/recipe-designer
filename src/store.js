import { reactive, watch } from 'vue';
import { I18N } from './data/i18n.js';
import { PRESETS } from './data/presets.js';
import { computeAutoLayout } from './lib/grid.js';
import { SYMBOL_KEYS, PRESET_SYMBOLS } from './data/symbols.js';
import { formatQuantity } from './lib/format.js';

const STORAGE_KEY = 'grid-recipe-generator:v1';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'ja', label: '日本語' },
  { code: 'pt', label: 'Português' },
];

export const state = reactive({
  lang: 'en',
  activeTab: 'graph',
  currentPresetKey: 'carbonara',
  // Once the user edits content, switching language no longer re-translates the preset.
  isCustomModified: false,
  title: '',
  baseServings: 4,
  yieldMultiplier: 1,
  preStartSteps: [],
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  zoom: 1,
  paperSize: 'A4', // 'A4' | 'A5', always landscape
  monoInk: false, // black & white sheet (preview and PDF)
  completedCells: new Set(),
  symbols: [], // recipe symbols (vegan, spicy, pork…), see data/symbols.js
});

export const toasts = reactive([]);

// Landscape page geometry in millimetres; margin is applied inside the page.
export const PAPER = {
  A4: { w: 297, h: 210, margin: 10 },
  A5: { w: 210, h: 148, margin: 7 },
};

export function t(key) {
  const dict = I18N[state.lang] || I18N.en;
  return dict[key] !== undefined ? dict[key] : I18N.en[key];
}

export function servings() {
  const n = Number(state.baseServings);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/** Ingredient amount as shown on the canvas and the sheet, scaled by the yield multiplier. */
export function amountLabel(node) {
  if (node.unit === 'qb') return t('unitQb');
  return `${formatQuantity((Number(node.qty) || 0) * state.yieldMultiplier)} ${node.unit || ''}`.trim();
}

export function nodeLabel(node) {
  if (!node) return '';
  return node.type === 'ingredient' ? node.name : node.title;
}

let toastSeq = 0;
export function showToast(message, tone = 'info') {
  const id = ++toastSeq;
  toasts.push({ id, message, tone });
  setTimeout(() => {
    const idx = toasts.findIndex((x) => x.id === id);
    if (idx >= 0) toasts.splice(idx, 1);
  }, 2800);
}

function markModified() {
  state.isCustomModified = true;
}

function generateId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function confirmReplace() {
  return !state.isCustomModified || window.confirm(t('confirmReplace'));
}

// ---------------------------------------------------------------------------
// Language & presets
// ---------------------------------------------------------------------------
export function setLanguage(code) {
  if (!I18N[code]) return;
  state.lang = code;
  if (state.currentPresetKey && !state.isCustomModified && PRESETS[state.currentPresetKey]) {
    applyPresetLanguageContent(state.currentPresetKey);
  }
}

function applyPresetLanguageContent(presetKey) {
  const loc = PRESETS[presetKey].l10n[state.lang] || PRESETS[presetKey].l10n.en;
  state.title = loc.title;
  state.preStartSteps = [...loc.preStartSteps];
  state.nodes.forEach((node) => {
    const locNode = loc.nodes[node.id];
    if (!locNode) return;
    if (node.type === 'ingredient') {
      node.name = locNode.name;
      node.note = locNode.note || '';
    } else {
      node.title = locNode.title;
      node.tags = locNode.tags ? [...locNode.tags] : [];
    }
  });
}

function resetView(nodes, edges) {
  state.nodes = nodes;
  state.edges = edges;
  state.selectedNodeId = nodes[0] ? nodes[0].id : null;
  state.selectedEdgeId = null;
  state.yieldMultiplier = 1;
  state.completedCells = new Set();
}

/** Returns false when the user cancelled the replacement. */
export function loadPreset(presetKey, { silent = false, force = false } = {}) {
  const preset = PRESETS[presetKey];
  if (!preset) return false;
  if (!force && !confirmReplace()) return false;
  const loc = preset.l10n[state.lang] || preset.l10n.en;

  state.currentPresetKey = presetKey;
  state.isCustomModified = false;
  state.title = loc.title;
  state.baseServings = preset.baseServings;
  state.preStartSteps = [...loc.preStartSteps];
  state.symbols = [...(PRESET_SYMBOLS[presetKey] || [])];
  resetView(
    preset.nodes.map((n) => {
      const l = loc.nodes[n.id] || {};
      return { ...n, name: l.name || '', note: l.note || '', title: l.title || '', tags: l.tags ? [...l.tags] : [] };
    }),
    preset.edges.map((e) => ({ ...e }))
  );
  if (!silent) showToast(loc.title, 'success');
  return true;
}

/** Starts a blank recipe. The New-recipe dialog asks for the title and confirms the replacement. */
export function clearRecipe(title = '') {
  const tech = t('quickTechTags');
  state.currentPresetKey = null;
  state.isCustomModified = true;
  state.title = title.trim() || 'Untitled Recipe';
  state.baseServings = 4;
  state.preStartSteps = [];
  state.symbols = [];
  resetView(
    [
      { id: 'ing_1', type: 'ingredient', x: 60, y: 120, name: t('typeIngredient'), qty: 250, unit: 'g', note: '' },
      { id: 'lav_1', type: 'lavoration', x: 380, y: 120, title: t('typeLavoration'), tags: [tech[0], '5 MIN'] },
      { id: 'out_1', type: 'output', x: 710, y: 120, title: t('typeOutput'), tags: [tech[9]] },
    ],
    [
      { id: 'e_init_1', from: 'ing_1', to: 'lav_1' },
      { id: 'e_init_2', from: 'lav_1', to: 'out_1' },
    ]
  );
}

// ---------------------------------------------------------------------------
// Recipe meta & pre-start steps
// ---------------------------------------------------------------------------
export function setTitle(value) {
  state.title = value;
  markModified();
}

export function addPreStart(text) {
  const clean = text.trim();
  if (!clean) return;
  markModified();
  state.preStartSteps.push(clean);
}

export function updatePreStart(idx, value) {
  markModified();
  state.preStartSteps[idx] = value;
}

export function movePreStart(idx, direction) {
  const target = idx + direction;
  if (target < 0 || target >= state.preStartSteps.length) return;
  markModified();
  const list = state.preStartSteps;
  [list[idx], list[target]] = [list[target], list[idx]];
}

export function deletePreStart(idx) {
  markModified();
  state.preStartSteps.splice(idx, 1);
}

// ---------------------------------------------------------------------------
// Graph editing
// ---------------------------------------------------------------------------
export function selectNode(id) {
  state.selectedNodeId = id;
  state.selectedEdgeId = null;
}

export function selectEdge(id) {
  state.selectedEdgeId = id;
  state.selectedNodeId = null;
}

export function clearSelection() {
  state.selectedNodeId = null;
  state.selectedEdgeId = null;
}

export function addNode(type, pos) {
  markModified();
  const tech = t('quickTechTags');
  const node = {
    id: generateId(type === 'ingredient' ? 'ing' : type === 'lavoration' ? 'lav' : 'out'),
    type,
    x: Math.max(24, Math.round(pos.x)),
    y: Math.max(72, Math.round(pos.y)),
  };
  if (type === 'ingredient') {
    Object.assign(node, { name: t('typeIngredient'), qty: 100, unit: 'g', note: '' });
  } else if (type === 'lavoration') {
    Object.assign(node, { title: t('typeLavoration'), tags: [tech[0]] });
  } else {
    Object.assign(node, { title: t('typeOutput'), tags: [tech[9]] });
  }
  state.nodes.push(node);
  selectNode(node.id);
  return node;
}

export function spawnNextStep(sourceId) {
  const src = state.nodes.find((n) => n.id === sourceId);
  if (!src) return;
  const next = addNode('lavoration', { x: src.x + 320, y: src.y });
  tryConnectNodes(src.id, next.id);
  selectNode(next.id);
}

export function deleteNode(id) {
  markModified();
  state.nodes = state.nodes.filter((n) => n.id !== id);
  state.edges = state.edges.filter((e) => e.from !== id && e.to !== id);
  state.completedCells.delete(id);
  if (state.selectedNodeId === id) state.selectedNodeId = null;
}

export function deleteEdge(id) {
  markModified();
  state.edges = state.edges.filter((e) => e.id !== id);
  if (state.selectedEdgeId === id) state.selectedEdgeId = null;
}

export function deleteSelection() {
  if (state.selectedEdgeId) deleteEdge(state.selectedEdgeId);
  else if (state.selectedNodeId) deleteNode(state.selectedNodeId);
}

function wouldCreateCycle(fromId, toId) {
  if (fromId === toId) return true;
  const visited = new Set();
  const stack = [toId];
  while (stack.length) {
    const curr = stack.pop();
    if (curr === fromId) return true;
    if (visited.has(curr)) continue;
    visited.add(curr);
    state.edges.forEach((e) => {
      if (e.from === curr) stack.push(e.to);
    });
  }
  return false;
}

export function tryConnectNodes(fromId, toId) {
  const from = state.nodes.find((n) => n.id === fromId);
  const to = state.nodes.find((n) => n.id === toId);
  if (!from || !to || fromId === toId) return false;
  if (from.type === 'output') return showToast(t('toastOutSrc'), 'error'), false;
  if (to.type === 'ingredient') return showToast(t('toastIngDst'), 'error'), false;
  if (state.edges.some((e) => e.from === fromId && e.to === toId)) return false;
  if (wouldCreateCycle(fromId, toId)) return showToast(t('toastCycle'), 'error'), false;

  markModified();
  state.edges.push({ id: generateId('edge'), from: fromId, to: toId });
  return true;
}

export function autoLayout() {
  if (!state.nodes.length) return;
  const positions = computeAutoLayout(state.nodes, state.edges);
  state.nodes.forEach((n) => Object.assign(n, positions.get(n.id)));
  showToast(t('toastAligned'), 'success');
}

export function setZoom(value) {
  state.zoom = Math.min(1.6, Math.max(0.4, +value.toFixed(2)));
}

export function updateNodeField(node, field, value) {
  markModified();
  node[field] = value;
}

export function toggleNodeTag(node, tag) {
  markModified();
  if (!Array.isArray(node.tags)) node.tags = [];
  const idx = node.tags.indexOf(tag);
  if (idx >= 0) node.tags.splice(idx, 1);
  else node.tags.push(tag);
}

export function removeNodeTag(node, idx) {
  markModified();
  node.tags.splice(idx, 1);
}

/**
 * Replaces the node's first tag matching `isKind` with `tag` (keeping its position),
 * adds it if none matches, or removes it when `tag` is null. Used by the fader and knob.
 */
export function setParamTag(node, isKind, tag) {
  markModified();
  if (!Array.isArray(node.tags)) node.tags = [];
  const idx = node.tags.findIndex(isKind);
  if (tag === null) {
    if (idx >= 0) node.tags.splice(idx, 1);
  } else if (idx >= 0) {
    node.tags[idx] = tag;
  } else {
    node.tags.push(tag);
  }
}

export function addCustomTag(node, raw) {
  const tag = raw.trim().toUpperCase();
  if (!tag) return;
  markModified();
  if (!Array.isArray(node.tags)) node.tags = [];
  if (!node.tags.includes(tag)) node.tags.push(tag);
}

// Symbols don't depend on the language, so toggling them doesn't stop preset re-translation.
export function toggleSymbol(key) {
  if (!SYMBOL_KEYS.includes(key)) return;
  state.symbols = state.symbols.includes(key)
    ? state.symbols.filter((k) => k !== key)
    : SYMBOL_KEYS.filter((k) => k === key || state.symbols.includes(k)); // keep a stable order
}

export function toggleCellCompleted(origId) {
  if (state.completedCells.has(origId)) state.completedCells.delete(origId);
  else state.completedCells.add(origId);
}

// ---------------------------------------------------------------------------
// Snapshots: JSON export/import and local autosave
// ---------------------------------------------------------------------------
export function exportPayload() {
  return {
    title: state.title,
    baseServings: servings(),
    preStartSteps: state.preStartSteps,
    symbols: state.symbols,
    nodes: state.nodes,
    edges: state.edges,
  };
}

function snapshot() {
  return {
    ...exportPayload(),
    lang: state.lang,
    currentPresetKey: state.currentPresetKey,
    isCustomModified: state.isCustomModified,
    yieldMultiplier: state.yieldMultiplier,
    paperSize: state.paperSize,
    monoInk: state.monoInk,
  };
}

function sanitizeNodes(rawNodes) {
  return rawNodes
    .filter((n) => n && typeof n.id === 'string' && ['ingredient', 'lavoration', 'output'].includes(n.type))
    .map((n) => ({
      ...n,
      x: Number(n.x) || 40,
      y: Number(n.y) || 80,
      ...(n.unit === 'to taste' ? { unit: 'qb' } : {}), // older files used a plain-English unit
      tags: Array.isArray(n.tags) ? n.tags.map(String) : n.type === 'ingredient' ? undefined : [],
    }));
}

// Keeps only wires the editor itself would allow: known endpoints, no wires out of
// a final dish or into an ingredient, no duplicates, and nothing that closes a cycle.
function sanitizeEdges(rawEdges, nodes) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const out = new Map(nodes.map((n) => [n.id, []]));
  const reaches = (start, goal) => {
    const stack = [start];
    const seen = new Set();
    while (stack.length) {
      const id = stack.pop();
      if (id === goal) return true;
      if (seen.has(id)) continue;
      seen.add(id);
      stack.push(...out.get(id));
    }
    return false;
  };
  const kept = [];
  rawEdges.forEach((e, i) => {
    const from = byId.get(e?.from);
    const to = byId.get(e?.to);
    if (!from || !to || from === to || from.type === 'output' || to.type === 'ingredient') return;
    if (out.get(from.id).includes(to.id) || reaches(to.id, from.id)) return;
    out.get(from.id).push(to.id);
    kept.push({ id: typeof e.id === 'string' ? e.id : `edge_${i}`, from: from.id, to: to.id });
  });
  return kept;
}

function restore(saved) {
  const nodes = sanitizeNodes(saved.nodes);
  state.lang = I18N[saved.lang] ? saved.lang : state.lang;
  state.currentPresetKey = PRESETS[saved.currentPresetKey] ? saved.currentPresetKey : null;
  state.isCustomModified = saved.isCustomModified ?? true;
  state.title = typeof saved.title === 'string' ? saved.title : 'Saved Recipe';
  state.baseServings = Number(saved.baseServings) > 0 ? Number(saved.baseServings) : 4;
  state.preStartSteps = Array.isArray(saved.preStartSteps) ? saved.preStartSteps.map(String) : [];
  state.symbols = Array.isArray(saved.symbols) ? SYMBOL_KEYS.filter((k) => saved.symbols.includes(k)) : [];
  resetView(nodes, sanitizeEdges(saved.edges, nodes));
  if ([0.5, 1, 2].includes(saved.yieldMultiplier)) state.yieldMultiplier = saved.yieldMultiplier;
  if (PAPER[saved.paperSize]) state.paperSize = saved.paperSize;
  if (typeof saved.monoInk === 'boolean') state.monoInk = saved.monoInk;
}

export function importJson(raw) {
  const parsed = JSON.parse(raw);
  if (!parsed || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
    throw new Error('JSON must contain "nodes" and "edges" arrays.');
  }
  restore({ ...parsed, lang: state.lang, currentPresetKey: null, isCustomModified: true, yieldMultiplier: 1 });
}

export function boot() {
  const sources = [() => localStorage.getItem(STORAGE_KEY)];
  for (const read of sources) {
    try {
      const saved = JSON.parse(read() || 'null');
      if (saved && Array.isArray(saved.nodes) && Array.isArray(saved.edges)) {
        restore(saved);
        startAutosave();
        return;
      }
    } catch {
      /* fall through to the next source */
    }
  }
  loadPreset('carbonara', { silent: true, force: true });
  startAutosave();
}

function startAutosave() {
  let timer = null;
  watch(
    snapshot,
    (snap) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
        } catch {
          /* storage full or disabled: autosave is best-effort */
        }
      }, 400);
    },
    { deep: true }
  );
}

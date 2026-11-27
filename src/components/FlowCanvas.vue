<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { Minus, Plus, Wand2, FileDown, FileUp } from 'lucide-vue-next';
import { TYPE_ICON } from '../lib/typeIcons.js';
import {
  state,
  t,
  addNode,
  autoLayout,
  clearSelection,
  selectEdge,
  selectNode,
  setZoom,
  spawnNextStep,
  tryConnectNodes,
} from '../store.js';
import FlowNode from './FlowNode.vue';

const ADD_KEYS = [
  { type: 'ingredient', label: 'addIng' },
  { type: 'lavoration', label: 'addLav' },
  { type: 'output', label: 'addOut' },
];

// 'tap' = a node or wire was tapped/clicked without dragging (phones open the inspector)
const emit = defineEmits(['json', 'tap']);
const TAP_SLOP = 5; // px a pointer may wobble before a press becomes a drag

const NODE_W = 240;
const NODE_H = 80;

const viewport = ref(null);
const stage = ref(null);
const sizes = reactive({}); // nodeId -> { w, h } measured from the DOM
const viewportSize = reactive({ w: 1200, h: 800 });
const drag = reactive({ mode: null, nodeId: null, offX: 0, offY: 0, fromId: null, end: null, targetId: null, sx: 0, sy: 0, moved: false });

const nodesById = computed(() => new Map(state.nodes.map((n) => [n.id, n])));

function sizeOf(id) {
  return sizes[id] || { w: NODE_W, h: NODE_H };
}

function port(id, side) {
  const n = nodesById.value.get(id);
  if (!n) return { x: 0, y: 0 };
  const s = sizeOf(id);
  return { x: side === 'out' ? n.x + s.w : n.x, y: n.y + s.h / 2 };
}

function curve(p1, p2) {
  const dx = Math.max(50, Math.abs(p2.x - p1.x) * 0.45);
  return `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
}

const edgePaths = computed(() =>
  state.edges
    .filter((e) => nodesById.value.has(e.from) && nodesById.value.has(e.to))
    .map((e) => ({ id: e.id, d: curve(port(e.from, 'out'), port(e.to, 'in')), selected: e.id === state.selectedEdgeId }))
);

const tempWire = computed(() => (drag.mode === 'wire' && drag.end ? curve(port(drag.fromId, 'out'), drag.end) : null));

// The stage grows with the graph and always fills the visible viewport.
const stageSize = computed(() => {
  let w = 0;
  let h = 0;
  state.nodes.forEach((n) => {
    const s = sizeOf(n.id);
    w = Math.max(w, n.x + s.w);
    h = Math.max(h, n.y + s.h);
  });
  return {
    w: Math.max(w + 480, viewportSize.w / state.zoom),
    h: Math.max(h + 360, viewportSize.h / state.zoom),
  };
});

function toStage(e) {
  const rect = stage.value.getBoundingClientRect();
  return { x: (e.clientX - rect.left) / state.zoom, y: (e.clientY - rect.top) / state.zoom };
}

function addAtView(type) {
  const vp = viewport.value;
  const stagger = (state.nodes.length % 5) * 36;
  addNode(type, {
    x: (vp.scrollLeft + 120 + stagger) / state.zoom,
    y: (vp.scrollTop + 110 + stagger) / state.zoom,
  });
}

// ---------------------------------------------------------------------------
// Pointer interactions (mouse, pen and touch)
// ---------------------------------------------------------------------------
function startNodeDrag(node, e) {
  selectNode(node.id);
  const p = toStage(e);
  Object.assign(drag, { mode: 'node', nodeId: node.id, offX: p.x - node.x, offY: p.y - node.y, sx: e.clientX, sy: e.clientY, moved: false });
  listen();
}

function startWire(node, e) {
  Object.assign(drag, { mode: 'wire', fromId: node.id, end: toStage(e), targetId: null });
  listen();
}

function nodeIdAt(e) {
  const hit = document.elementFromPoint(e.clientX, e.clientY);
  return hit?.closest('[data-node-id]')?.getAttribute('data-node-id') || null;
}

function onMove(e) {
  if (drag.mode === 'node') {
    const node = nodesById.value.get(drag.nodeId);
    if (!node) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < TAP_SLOP) return;
    drag.moved = true;
    const p = toStage(e);
    node.x = Math.max(8, Math.round(p.x - drag.offX));
    node.y = Math.max(8, Math.round(p.y - drag.offY));
  } else if (drag.mode === 'wire') {
    drag.end = toStage(e);
    const id = nodeIdAt(e);
    const target = id && nodesById.value.get(id);
    drag.targetId = target && id !== drag.fromId && target.type !== 'ingredient' ? id : null;
  }
}

function onUp(e) {
  if (drag.mode === 'node' && !drag.moved && e.type === 'pointerup') emit('tap');
  if (drag.mode === 'wire') {
    const id = nodeIdAt(e);
    if (id && id !== drag.fromId) tryConnectNodes(drag.fromId, id);
  }
  Object.assign(drag, { mode: null, nodeId: null, fromId: null, end: null, targetId: null, moved: false });
  unlisten();
}

function listen() {
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
}
function unlisten() {
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
  window.removeEventListener('pointercancel', onUp);
}

function onBackgroundDown(e) {
  if (e.target === viewport.value || e.target === stage.value || e.target.closest?.('.edges-bg')) clearSelection();
}

// Ctrl/⌘ + wheel zooms around the cursor.
async function onWheel(e) {
  if (!e.ctrlKey && !e.metaKey) return;
  e.preventDefault();
  const vp = viewport.value;
  const rect = vp.getBoundingClientRect();
  const before = toStage(e);
  setZoom(state.zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1));
  await nextTick();
  vp.scrollLeft = before.x * state.zoom - (e.clientX - rect.left);
  vp.scrollTop = before.y * state.zoom - (e.clientY - rect.top);
}

let vpObserver = null;
onMounted(() => {
  vpObserver = new ResizeObserver(([entry]) => {
    if (entry.contentRect.width > 0) {
      viewportSize.w = entry.contentRect.width;
      viewportSize.h = entry.contentRect.height;
    }
  });
  vpObserver.observe(viewport.value);
});
onBeforeUnmount(() => {
  vpObserver?.disconnect();
  unlisten();
});
</script>

<template>
  <section class="canvas-wrap">
    <div class="toolbar">
      <div class="cluster">
        <button
          v-for="k in ADD_KEYS"
          :key="k.type"
          type="button"
          class="btn add-key"
           data-tip-pos="bottom" :data-tip="t(k.label)"
          :aria-label="t(k.label)"
          @click="addAtView(k.type)"
        >
          <span class="led" :class="k.type"></span>
          <component :is="TYPE_ICON[k.type]" :size="17" />
          <Plus :size="11" :stroke-width="3" class="plus" />
        </button>
      </div>

      <div class="cluster">
        <button type="button" class="knob"  data-tip-pos="bottom" :data-tip="t('autoLayout')" :aria-label="t('autoLayout')" @click="autoLayout">
          <Wand2 :size="15" />
        </button>
        <button type="button" class="knob"  data-tip-pos="bottom" :data-tip="t('exportJson')" :aria-label="t('exportJson')" @click="$emit('json', 'export')">
          <FileDown :size="15" />
        </button>
        <button type="button" class="knob"  data-tip-pos="bottom" :data-tip="t('importJson')" :aria-label="t('importJson')" @click="$emit('json', 'import')">
          <FileUp :size="15" />
        </button>
        <span class="divider"></span>
        <button type="button" class="knob knob-sm" data-tip-pos="bottom" data-tip="−" aria-label="Zoom out" @click="setZoom(state.zoom - 0.1)"><Minus :size="13" /></button>
        <button type="button" class="lcd zoom-readout" data-tip-pos="bottom" data-tip="100%" @click="setZoom(1)">
          {{ Math.round(state.zoom * 100) }}%
        </button>
        <button type="button" class="knob knob-sm" data-tip-pos="bottom" data-tip="+" aria-label="Zoom in" @click="setZoom(state.zoom + 0.1)"><Plus :size="13" /></button>
      </div>
    </div>

    <div
      ref="viewport"
      class="viewport"
      :style="{ backgroundSize: `${24 * state.zoom}px ${24 * state.zoom}px` }"
      @pointerdown="onBackgroundDown"
      @wheel="onWheel"
    >
      <div class="sizer" :style="{ width: stageSize.w * state.zoom + 'px', height: stageSize.h * state.zoom + 'px' }">
        <div
          ref="stage"
          class="stage"
          :class="{ dragging: drag.mode }"
          :style="{ width: stageSize.w + 'px', height: stageSize.h + 'px', transform: `scale(${state.zoom})` }"
        >
          <svg class="edges" :width="stageSize.w" :height="stageSize.h">
            <defs>
              <marker id="arrow-selected" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0,1 L9,5 L0,9 z" fill="#ff5b1f" />
              </marker>
              <marker id="arrow-temp" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0,1 L9,5 L0,9 z" fill="#ff5b1f" />
              </marker>
            </defs>
            <g v-for="edge in edgePaths" :key="edge.id" class="edge" :class="{ selected: edge.selected }">
              <path :d="edge.d" class="edge-line" :marker-end="edge.selected ? 'url(#arrow-selected)' : undefined" />
              <path :d="edge.d" class="edge-hit" @pointerdown.stop="selectEdge(edge.id); emit('tap')" />
            </g>
            <path v-if="tempWire" :d="tempWire" class="temp-wire" marker-end="url(#arrow-temp)" />
          </svg>

          <FlowNode
            v-for="node in state.nodes"
            :key="node.id"
            :node="node"
            :selected="node.id === state.selectedNodeId"
            :drop-target="node.id === drag.targetId"
            :wiring="drag.mode === 'wire' && node.id !== drag.fromId && node.type !== 'ingredient'"
            @grab="startNodeDrag(node, $event)"
            @wire="startWire(node, $event)"
            @next="spawnNextStep(node.id)"
            @size="sizes[node.id] = $event"
          />
        </div>
      </div>

      <div v-if="!state.nodes.length" class="canvas-empty">
        <div class="empty-box">{{ t('inspectorNone') }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* The canvas is a recessed "screen" in the device body. */
.canvas-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: var(--r-lg);
  background: var(--well);
  box-shadow: var(--inset);
  overflow: hidden;
}

.toolbar {
  position: relative;
  z-index: 10;
  padding: 14px 14px 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.cluster {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: var(--body);
  border-radius: 15px;
  box-shadow: var(--raise-sm);
}
.divider {
  width: 1px;
  height: 18px;
  margin: 0 2px;
  background: var(--hair);
}
.add-key {
  position: relative;
  gap: 8px;
  height: 34px;
  padding: 0 14px 0 12px;
  color: var(--ink-2);
}
.add-key .plus {
  position: absolute;
  right: 5px;
  top: 5px;
  color: var(--ink-3);
}
.zoom-readout {
  width: 52px;
  border: none;
  cursor: pointer;
}

.viewport {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: auto;
  background-image: radial-gradient(circle, rgba(27, 27, 25, 0.16) 1px, transparent 1.3px);
  background-attachment: local;
}
.sizer {
  position: relative;
}
.stage {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
}
.stage.dragging {
  cursor: grabbing;
}

.edges {
  position: absolute;
  inset: 0;
  overflow: visible;
  pointer-events: none;
}
.edge-line {
  fill: none;
  stroke: #b3b3ab;
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke 0.12s ease;
}
.edge-hit {
  fill: none;
  stroke: transparent;
  stroke-width: 16;
  pointer-events: stroke;
  cursor: pointer;
}
.edge:hover .edge-line {
  stroke: var(--ink-2);
}
.edge.selected .edge-line {
  stroke: var(--orange);
  stroke-width: 2.5;
}
.temp-wire {
  fill: none;
  stroke: var(--orange);
  stroke-width: 2;
  stroke-dasharray: 2 6;
  stroke-linecap: round;
}

.canvas-empty {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}
.canvas-empty .empty-box {
  max-width: 320px;
  background: var(--body);
  box-shadow: var(--raise-sm);
}

/* Phones / portrait tablets: one toolbar row that scrolls sideways */
@media (max-width: 899px) {
  .toolbar {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 10px 10px 12px;
    scrollbar-width: none;
  }
  .toolbar::-webkit-scrollbar {
    display: none;
  }
  .cluster {
    flex-wrap: nowrap;
    flex-shrink: 0;
  }
  .sizer {
    margin-bottom: 90px; /* keep the last nodes reachable above the dock */
  }
}
</style>

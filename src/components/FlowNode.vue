<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ArrowRight, Plus } from 'lucide-vue-next';
import { TYPE_ICON } from '../lib/typeIcons.js';
import { t, amountLabel } from '../store.js';
import PillTag from './PillTag.vue';

const props = defineProps({
  node: { type: Object, required: true },
  selected: Boolean,
  dropTarget: Boolean,
  wiring: Boolean,
});
const emit = defineEmits(['grab', 'wire', 'next', 'size']);

const el = ref(null);
let observer = null;

const kindLabel = computed(() =>
  props.node.type === 'ingredient' ? t('typeIngredient') : props.node.type === 'lavoration' ? t('typeLavoration') : t('typeOutput')
);
const amount = computed(() => amountLabel(props.node));

function onPointerDown(e) {
  if (e.button !== 0) return;
  if (e.target.closest('button, [data-port]')) return;
  emit('grab', e);
}

onMounted(() => {
  observer = new ResizeObserver(() => {
    // offsetWidth/Height ignore the canvas zoom transform; skip while hidden (0×0).
    if (el.value && el.value.offsetWidth > 0) emit('size', { w: el.value.offsetWidth, h: el.value.offsetHeight });
  });
  observer.observe(el.value);
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div
    ref="el"
    class="node"
    :class="[node.type, { selected, 'drop-target': dropTarget, wiring }]"
    :data-node-id="node.id"
    :style="{ transform: `translate(${node.x}px, ${node.y}px)` }"
    @pointerdown="onPointerDown"
  >
    <div class="node-head">
      <span class="kind" :title="kindLabel"><span class="led" :class="node.type"></span><component :is="TYPE_ICON[node.type]" :size="15" /></span>
      <span v-if="node.type === 'ingredient'" class="qty">{{ amount }}</span>
      <button v-else-if="node.type === 'lavoration'" type="button" class="next-btn" :title="t('nextBtn')" @click.stop="emit('next')">
        <Plus :size="11" :stroke-width="2.5" /><ArrowRight :size="12" />
      </button>
    </div>

    <div class="node-title" :class="{ serif: node.type === 'output' }">
      {{ (node.type === 'ingredient' ? node.name : node.title) || kindLabel }}
    </div>
    <div v-if="node.type === 'ingredient' && node.note" class="node-note">{{ node.note }}</div>
    <div v-if="node.type !== 'ingredient' && node.tags?.length" class="node-tags">
      <PillTag v-for="(tag, i) in node.tags" :key="i" :tag="tag" />
    </div>

    <div v-if="node.type !== 'ingredient'" class="port port-in" data-port="in"></div>
    <div
      v-if="node.type !== 'output'"
      class="port port-out"
      data-port="out"
      @pointerdown.stop.prevent="emit('wire', $event)"
    ></div>
  </div>
</template>

<style scoped>
.node {
  position: absolute;
  left: 0;
  top: 0;
  width: 240px;
  padding: 12px 14px 14px;
  background: var(--body);
  border-radius: 16px;
  box-shadow: 6px 6px 14px rgba(160, 160, 150, 0.5), -5px -5px 12px rgba(255, 255, 255, 0.9);
  cursor: grab;
  touch-action: none;
  user-select: none;
  transition: box-shadow 0.15s ease;
}
.node:active {
  cursor: grabbing;
}
.node.selected {
  box-shadow: 6px 6px 14px rgba(160, 160, 150, 0.5), -5px -5px 12px rgba(255, 255, 255, 0.9), 0 0 0 2px var(--orange);
}
.node.drop-target {
  box-shadow: 6px 6px 14px rgba(160, 160, 150, 0.5), -5px -5px 12px rgba(255, 255, 255, 0.9), 0 0 0 2px var(--green);
}

.node-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  min-height: 22px;
}
.kind {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ink-3);
}
.kind .led {
  width: 7px;
  height: 7px;
}
.qty {
  padding: 3px 8px;
  border-radius: 7px;
  background: var(--well);
  box-shadow: var(--inset-sm);
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.next-btn {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  height: 22px;
  padding: 0 7px;
  border: none;
  border-radius: 7px;
  background: var(--body);
  box-shadow: var(--raise-xs);
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--green-ink);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.12s ease, box-shadow 0.12s ease;
}
.node:hover .next-btn,
.node.selected .next-btn,
.next-btn:focus-visible {
  opacity: 1;
}
.next-btn:active {
  box-shadow: var(--inset-sm);
}

.node-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.38;
  color: var(--ink);
}
.node-title.serif {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.2;
}
.node-note {
  margin-top: 3px;
  font-size: 11.5px;
  color: var(--ink-3);
}
.node-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 9px;
}

/* Ports: input is a recessed socket, output is an orange knob you pull wires from. */
.port {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  margin-top: -8px;
  border-radius: 999px;
  z-index: 2;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease;
}
.port-in {
  left: -8px;
  background: var(--well);
  box-shadow: inset 2px 2px 4px rgba(140, 140, 130, 0.6), inset -1px -1px 3px #fff, 0 0 0 3px var(--body);
}
.port-out {
  right: -8px;
  background: radial-gradient(circle at 35% 30%, #ff8a5c, var(--orange) 55%, var(--orange-deep));
  box-shadow: 2px 2px 5px rgba(150, 60, 20, 0.4), 0 0 0 3px var(--body);
  cursor: crosshair;
  touch-action: none;
}
.port-out::after {
  /* Larger invisible hit area for easier grabbing */
  content: '';
  position: absolute;
  inset: -8px;
}
.port-out:hover {
  transform: scale(1.2);
}
.node.wiring .port-in {
  box-shadow: inset 2px 2px 4px rgba(140, 140, 130, 0.6), 0 0 0 3px var(--body), 0 0 0 5px var(--green-soft);
}
.node.drop-target .port-in {
  background: var(--green);
  box-shadow: 0 0 10px var(--green), 0 0 0 3px var(--body);
  transform: scale(1.2);
}
</style>

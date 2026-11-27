<script setup>
import { computed, ref, watch } from 'vue';
import { ListChecks, Sparkles, SlidersHorizontal, X } from 'lucide-vue-next';
import { state, t } from '../store.js';
import { useLayout } from '../lib/useLayout.js';
import PrestartPanel from './PrestartPanel.vue';
import SymbolPanel from './SymbolPanel.vue';
import FlowCanvas from './FlowCanvas.vue';
import InspectorPanel from './InspectorPanel.vue';

defineEmits(['json']);

// desktop: three columns · tablet: canvas + inspector, the rest in the dock ·
// phone: canvas only, every panel opens as a bottom sheet from the dock.
const layout = useLayout();
const sheet = ref(null); // 'prep' | 'symbols' | 'inspector' | null

const dockKeys = computed(() => {
  const keys = [
    { id: 'prep', icon: ListChecks, label: t('preStartTitle'), count: state.preStartSteps.length },
    { id: 'symbols', icon: Sparkles, label: t('symbolsTitle'), count: state.symbols.length },
  ];
  if (layout.value === 'phone') {
    keys.push({ id: 'inspector', icon: SlidersHorizontal, label: t('inspectorTitle'), lit: Boolean(state.selectedNodeId || state.selectedEdgeId) });
  }
  return keys;
});

function toggle(id) {
  sheet.value = sheet.value === id ? null : id;
}

// On phones, tapping a node or wire brings up its inspector.
function onCanvasTap() {
  if (layout.value === 'phone') sheet.value = 'inspector';
}

// Close sheets that the current layout shows as columns.
watch(layout, (l) => {
  if (l === 'desktop' || (l === 'tablet' && sheet.value === 'inspector')) sheet.value = null;
});
</script>

<template>
  <main class="workspace" :class="layout">
    <div v-if="layout === 'desktop'" class="left">
      <PrestartPanel class="slab prestart" />
      <SymbolPanel class="slab" />
    </div>

    <div class="canvas-area">
      <FlowCanvas class="canvas" @json="$emit('json', $event)" @tap="onCanvasTap" />

      <template v-if="layout !== 'desktop'">
        <Transition name="sheet">
          <section v-if="sheet" class="sheet slab" :aria-label="dockKeys.find((k) => k.id === sheet)?.label">
            <button type="button" class="knob knob-sm sheet-close" :aria-label="t('close')" @click="sheet = null">
              <X :size="14" />
            </button>
            <PrestartPanel v-if="sheet === 'prep'" class="sheet-panel" />
            <SymbolPanel v-else-if="sheet === 'symbols'" class="sheet-panel" />
            <InspectorPanel v-else class="sheet-panel" />
          </section>
        </Transition>

        <nav class="dock" aria-label="Panels">
          <button
            v-for="k in dockKeys"
            :key="k.id"
            type="button"
            class="dock-key"
            :class="{ active: sheet === k.id }"
            :aria-pressed="sheet === k.id"
            :aria-label="k.label"
            @click="toggle(k.id)"
          >
            <component :is="k.icon" :size="18" />
            <span v-if="k.count" class="dock-count">{{ k.count }}</span>
            <span v-else-if="k.lit" class="dock-led"></span>
          </button>
        </nav>
      </template>
    </div>

    <InspectorPanel v-if="layout !== 'phone'" class="slab side" />
  </main>
</template>

<style scoped>
.workspace {
  flex: 1;
  min-height: 0;
  display: grid;
  gap: 16px;
}
.workspace.desktop {
  grid-template-columns: 290px minmax(0, 1fr) 320px;
}
.workspace.tablet {
  grid-template-columns: minmax(0, 1fr) 300px;
}
.workspace.phone {
  grid-template-columns: minmax(0, 1fr);
}

.left {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
}
.prestart {
  flex: 1;
  min-height: 0;
}
.side {
  min-height: 0;
}
.canvas-area {
  position: relative;
  min-width: 0;
  min-height: 0;
  display: flex;
}
.canvas {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

/* ---------- Dock: a row of keys floating at the bottom of the canvas ---------- */
.dock {
  position: absolute;
  left: 50%;
  bottom: 14px;
  z-index: 20;
  display: flex;
  gap: 8px;
  padding: 6px;
  transform: translateX(-50%);
  background: var(--body);
  border-radius: 18px;
  box-shadow: 8px 8px 20px rgba(150, 150, 140, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.9);
}
.dock-key {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 44px;
  border: none;
  border-radius: 13px;
  background: var(--body);
  color: var(--ink-2);
  box-shadow: var(--raise-xs);
  cursor: pointer;
  transition: box-shadow 0.12s ease, color 0.12s ease;
}
.dock-key.active {
  color: var(--orange);
  box-shadow: var(--inset-sm);
}
.dock-count {
  position: absolute;
  top: 4px;
  right: 6px;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  color: var(--ink-3);
}
.dock-led {
  position: absolute;
  top: 6px;
  right: 8px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--orange);
  box-shadow: 0 0 6px var(--orange);
}

/* ---------- Bottom sheet ---------- */
.sheet {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 74px;
  z-index: 19;
  max-height: calc(100% - 140px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -10px 30px -8px rgba(120, 120, 110, 0.45), -6px -6px 16px rgba(255, 255, 255, 0.8);
}
.tablet .sheet {
  left: auto;
  width: 340px;
}
.sheet-panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
.sheet-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
}
/* Leave room for the close knob in each panel header */
.sheet-panel :deep(.panel-head) {
  padding-right: 56px;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
.sheet-leave-active {
  pointer-events: none;
}
</style>

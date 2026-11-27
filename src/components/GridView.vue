<script setup>
import { computed } from 'vue';
import { Minus, Plus, FileDown, Users, Contrast } from 'lucide-vue-next';
import { state, t, setTitle, setCategory, servings, PAPER } from '../store.js';
import GridSheet from './GridSheet.vue';
import CategoryPicker from './CategoryPicker.vue';

const title = computed({ get: () => state.title, set: setTitle });
const category = computed({ get: () => state.category, set: setCategory });
const yieldTitle = computed(() => t('yieldLabel').replace(/[:：\s]+$/, ''));

function normalizeServings() {
  state.baseServings = servings();
}
function stepServings(delta) {
  state.baseServings = Math.max(1, Math.round(servings()) + delta);
}

// The browser's print engine produces a crisp vector PDF (and handles every
// script, including Japanese). The document title becomes the default file name.
function exportPdf() {
  const previous = document.title;
  document.title = state.title.trim() || 'Grid Recipe';
  const restore = () => {
    document.title = previous;
    window.removeEventListener('afterprint', restore);
  };
  window.addEventListener('afterprint', restore);
  window.print();
}
</script>

<template>
  <main class="grid-view">
    <section class="controls slab no-print">
      <div class="group">
        <input v-model="title" type="text" class="input title-input" aria-label="Recipe title" />
        <CategoryPicker v-model="category" />

        <div class="stepper" data-tip-pos="bottom" :data-tip="yieldTitle">
          <Users :size="16" class="ctl-icon" />
          <button type="button" class="knob knob-sm" :disabled="servings() <= 1" aria-label="−" @click="stepServings(-1)">
            <Minus :size="12" />
          </button>
          <input
            v-model.number="state.baseServings"
            type="number"
            min="1"
            max="200"
            class="lcd servings-input"
            :aria-label="yieldTitle"
            @blur="normalizeServings"
          />
          <button type="button" class="knob knob-sm" aria-label="+" @click="stepServings(1)">
            <Plus :size="12" />
          </button>
        </div>

        <div class="segmented">
          <button
            v-for="m in [0.5, 1, 2]"
            :key="m"
            type="button"
            :class="{ active: state.yieldMultiplier === m }"
            @click="state.yieldMultiplier = m"
          >
            {{ m }}×
          </button>
        </div>
      </div>

      <div class="group">
        <div class="segmented">
          <button
            v-for="size in Object.keys(PAPER)"
            :key="size"
            type="button"
            :class="{ active: state.paperSize === size }"
            data-tip-pos="bottom" :data-tip="`${t('paper')} ${PAPER[size].w} × ${PAPER[size].h} mm`"
            @click="state.paperSize = size"
          >
            {{ size }}
          </button>
        </div>

        <label class="toggle" data-tip-pos="bottom" :data-tip="t('monoInk')">
          <Contrast :size="16" class="ctl-icon" />
          <input v-model="state.monoInk" type="checkbox" class="sr-only" :aria-label="t('monoInk')" />
          <span class="switch"></span>
        </label>

        <button
          type="button"
          class="btn btn-primary"
          data-tip-pos="bottom" :data-tip="t('pdfHint')"
          :aria-label="t('exportPdf')"
          @click="exportPdf"
        >
          <FileDown :size="16" />PDF
        </button>
      </div>
    </section>

    <GridSheet />
  </main>
</template>

<style scoped>
.grid-view {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 4px 4px 12px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px 24px;
  padding: 14px 18px;
}
.group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 20px;
}
.title-input {
  width: 280px;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 19px;
}
.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
}
.ctl-icon {
  color: var(--ink-3);
  flex-shrink: 0;
}
.stepper .ctl-icon {
  margin-right: 2px;
}
.servings-input {
  width: 52px;
  height: 30px;
  border: none;
  text-align: center;
  font-size: 13px;
  outline: none;
  appearance: textfield;
  -moz-appearance: textfield;
}
.servings-input::-webkit-inner-spin-button,
.servings-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.servings-input:focus {
  box-shadow: var(--inset-sm), 0 0 0 2px var(--orange);
}
.segmented {
  height: 36px;
}
.toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 36px;
  cursor: pointer;
}

@media print {
  .grid-view {
    display: block;
    padding: 0;
    overflow: visible;
  }
}

@media (max-width: 640px) {
  .controls {
    padding: 12px;
    gap: 12px;
  }
  .group {
    gap: 12px;
    width: 100%;
  }
  .title-input {
    flex: 1 1 100%;
    width: auto;
  }
}
</style>

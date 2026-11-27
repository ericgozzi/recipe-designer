<script setup>
import { computed } from 'vue';
import { Minus, Plus, FileDown, Users, Contrast, RotateCcw } from 'lucide-vue-next';
import { state, t, setTitle, setCategory, servings, targetServings, scaleFactor, PAPER } from '../store.js';
import { formatQuantity } from '../lib/format.js';
import GridSheet from './GridSheet.vue';
import CategoryPicker from './CategoryPicker.vue';

const title = computed({ get: () => state.title, set: setTitle });
const category = computed({ get: () => state.category, set: setCategory });

// "Recipe for" is what the ingredient amounts are written for; "Cook for" is how many
// people the user is cooking for. Every amount is scaled by cookFor ÷ recipeFor.
const cookFor = computed(() => targetServings());
const isScaled = computed(() => cookFor.value !== servings());
const factorLabel = computed(() => formatQuantity(scaleFactor()));

function normalizeBase() {
  state.baseServings = servings();
}
function setCookFor(value) {
  const n = Math.min(200, Math.max(1, Math.round(Number(value)) || servings()));
  state.targetServings = n === servings() ? null : n;
}
function stepCookFor(delta) {
  setCookFor(Math.round(cookFor.value) + delta);
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

        <div class="servings">
          <label class="serv-field" data-tip-pos="bottom" :data-tip="t('recipeForHint')">
            <span class="field-label">{{ t('recipeFor') }}</span>
            <input
              v-model.number="state.baseServings"
              type="number"
              min="1"
              max="200"
              class="lcd servings-input"
              :aria-label="t('recipeFor')"
              @blur="normalizeBase"
            />
          </label>

          <span class="arrow" aria-hidden="true">→</span>

          <div class="serv-field" data-tip-pos="bottom" :data-tip="t('cookForHint')">
            <Users :size="16" class="ctl-icon" />
            <span class="field-label">{{ t('cookFor') }}</span>
            <button type="button" class="knob knob-sm" :disabled="cookFor <= 1" aria-label="−" @click="stepCookFor(-1)">
              <Minus :size="12" />
            </button>
            <input
              :value="cookFor"
              type="number"
              min="1"
              max="200"
              class="lcd servings-input"
              :class="{ scaled: isScaled }"
              :aria-label="t('cookFor')"
              @change="setCookFor($event.target.value)"
            />
            <button type="button" class="knob knob-sm" aria-label="+" @click="stepCookFor(1)">
              <Plus :size="12" />
            </button>
            <button
              v-if="isScaled"
              type="button"
              class="scale-badge"
              :data-tip="t('resetScale')"
              :aria-label="t('resetScale')"
              @click="state.targetServings = null"
            >
              ×{{ factorLabel }}<RotateCcw :size="12" />
            </button>
          </div>
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
.servings {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
}
.serv-field {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
}
.field-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink-3);
  white-space: nowrap;
}
.arrow {
  color: var(--ink-3);
}
.scale-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
  border: none;
  border-radius: 999px;
  background: var(--orange);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.servings-input.scaled {
  color: var(--orange-ink);
  font-weight: 700;
}
.ctl-icon {
  color: var(--ink-3);
  flex-shrink: 0;
}
.serv-field .ctl-icon {
  margin-right: -2px;
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

<script setup>
import { computed } from 'vue';
import { FilePlus, Workflow, LayoutGrid } from 'lucide-vue-next';
import { state, t, loadPreset, clearRecipe } from '../store.js';
import { PRESETS } from '../data/presets.js';
import LangMenu from './LangMenu.vue';

const presetKeys = Object.keys(PRESETS);
const presetValue = computed(() => state.currentPresetKey || '');

function onPresetChange(e) {
  const ok = loadPreset(e.target.value);
  // Cancelled: put the select back on the current recipe.
  if (!ok) e.target.value = presetValue.value;
}
</script>

<template>
  <header class="app-header">
    <div class="brand">
      <div class="brand-mark" aria-hidden="true">
        <span class="k ing"></span>
        <span class="k lav"></span>
        <span class="k out"></span>
        <span class="k"></span>
      </div>
      <div class="brand-text">
        <h1 class="brand-title">{{ t('appTitle') }}</h1>
      </div>
    </div>

    <nav class="segmented tabs" aria-label="Views">
      <button type="button" :class="{ active: state.activeTab === 'graph' }" @click="state.activeTab = 'graph'">
        <Workflow :size="14" />
        {{ t('tabGraph') }}
      </button>
      <button type="button" :class="{ active: state.activeTab === 'grid' }" @click="state.activeTab = 'grid'">
        <LayoutGrid :size="14" />
        {{ t('tabGrid') }}
      </button>
    </nav>

    <div class="actions">
      <select class="select preset-select" :value="presetValue" aria-label="Recipe presets" @change="onPresetChange">
        <option v-if="!state.currentPresetKey" value="" disabled>{{ t('customRecipe') }}</option>
        <option v-for="key in presetKeys" :key="key" :value="key">{{ t('presetNames')[key] }}</option>
      </select>
      <button type="button" class="knob new-btn" data-tip-pos="bottom" :data-tip="t('newBtn').replace(/^\+\s*/, '')" :aria-label="t('newBtn')" @click="clearRecipe">
        <FilePlus :size="16" />
      </button>
      <LangMenu />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  padding: 4px 6px 0;
  position: relative;
  z-index: 30;
}

.brand {
  flex: 1 1 280px;
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}
.brand-mark {
  display: grid;
  grid-template-columns: repeat(2, 15px);
  gap: 5px;
  padding: 7px;
  border-radius: 13px;
  box-shadow: var(--raise-sm);
  flex-shrink: 0;
}
.k {
  width: 15px;
  height: 15px;
  border-radius: 999px;
  background: linear-gradient(145deg, #ffffff, #e2e2dc);
  box-shadow: 1px 1px 2px var(--sh-dark);
}
.k.ing { background: var(--saffron); }
.k.lav { background: var(--green); }
.k.out { background: var(--orange); }
.brand-text {
  min-width: 0;
}
.brand-title {
  margin: 0;
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  font-size: 27px;
  letter-spacing: -0.01em;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.new-btn {
  width: 36px;
  height: 36px;
}

.tabs button {
  height: 32px;
  padding: 0 16px;
}

.actions {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
}
.preset-select {
  width: auto;
  max-width: 250px;
  height: 36px;
  font-weight: 600;
}

</style>

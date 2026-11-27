<script setup>
import { ref } from 'vue';
import { ArrowUp, ArrowDown, X, Plus, ListChecks } from 'lucide-vue-next';
import { state, t, addPreStart, updatePreStart, movePreStart, deletePreStart } from '../store.js';

const draft = ref('');

function submit() {
  addPreStart(draft.value);
  draft.value = '';
}
</script>

<template>
  <aside class="panel">
    <header class="panel-head">
      <h2 class="panel-title" :title="t('preStartSub')"><ListChecks :size="15" />{{ t('preStartTitle') }}</h2>
      <span class="lcd">{{ String(state.preStartSteps.length).padStart(2, '0') }}</span>
    </header>

    <div class="panel-body">
      <form class="add-row" @submit.prevent="submit">
        <input v-model="draft" type="text" class="input" :placeholder="t('preStartPlaceholder')" />
        <button type="submit" class="knob add-knob" :title="t('addBtn')">
          <Plus :size="16" />
          <span class="sr-only">{{ t('addBtn') }}</span>
        </button>
      </form>

      <ol v-if="state.preStartSteps.length" class="steps">
        <li v-for="(step, idx) in state.preStartSteps" :key="idx" class="step">
          <span class="num">{{ String(idx + 1).padStart(2, '0') }}</span>
          <textarea
            rows="2"
            class="step-text"
            :aria-label="`${t('preStartTitle')} ${idx + 1}`"
            :value="step"
            @input="updatePreStart(idx, $event.target.value)"
          ></textarea>
          <div class="step-tools">
            <button type="button" class="icon-btn" :disabled="idx === 0" title="Move up" @click="movePreStart(idx, -1)">
              <ArrowUp :size="13" />
            </button>
            <button
              type="button"
              class="icon-btn"
              :disabled="idx === state.preStartSteps.length - 1"
              title="Move down"
              @click="movePreStart(idx, 1)"
            >
              <ArrowDown :size="13" />
            </button>
            <button type="button" class="icon-btn danger" title="Delete" @click="deletePreStart(idx)">
              <X :size="13" />
            </button>
          </div>
        </li>
      </ol>

      <div v-else class="empty-box">{{ t('preStartEmpty') }}</div>
    </div>
  </aside>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 70px;
  padding: 18px 18px 14px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.panel-title svg {
  color: var(--saffron);
}
.panel-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.add-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.add-knob {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}
.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.step {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 6px 11px 12px;
  border-radius: var(--r);
  box-shadow: var(--raise-sm);
}
.step:focus-within {
  box-shadow: var(--raise-sm), 0 0 0 2px var(--orange);
}
.num {
  flex-shrink: 0;
  margin-top: 2px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--saffron-ink);
}
.step-text {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-size: 12.5px;
  line-height: 1.45;
  resize: none;
  outline: none;
  padding: 1px 0;
  field-sizing: content; /* grow with the text */
  min-height: 2.9em;
}
.step-tools {
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: 0.4;
  transition: opacity 0.12s ease;
}
.step:hover .step-tools,
.step:focus-within .step-tools {
  opacity: 1;
}
.step-tools .icon-btn {
  width: 22px;
  height: 20px;
}
</style>

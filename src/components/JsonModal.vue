<script setup>
import { onMounted, ref } from 'vue';
import { Copy, X, Upload } from 'lucide-vue-next';
import { t, exportPayload, importJson, showToast } from '../store.js';

const props = defineProps({ mode: { type: String, required: true } });
const emit = defineEmits(['close']);

const text = ref(props.mode === 'export' ? JSON.stringify(exportPayload(), null, 2) : '');
const area = ref(null);
const fileInput = ref(null);

onMounted(() => {
  area.value?.focus();
  if (props.mode === 'export') area.value?.select();
});

async function copy() {
  try {
    await navigator.clipboard.writeText(text.value);
  } catch {
    area.value.select();
    document.execCommand('copy');
  }
  showToast(t('toastCopied'), 'success');
}

function apply() {
  if (!text.value.trim()) return;
  try {
    importJson(text.value);
    emit('close');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function readFile(e) {
  const file = e.target.files?.[0];
  if (file) text.value = await file.text();
  e.target.value = '';
}
</script>

<template>
  <div class="backdrop no-print" @pointerdown.self="emit('close')">
    <div class="card" role="dialog" aria-modal="true" :aria-label="mode === 'export' ? t('exportJson') : t('importJson')">
      <header class="card-head">
        <h3 class="panel-title">{{ mode === 'export' ? t('exportJson') : t('importJson') }}</h3>
        <button type="button" class="knob knob-sm" :aria-label="t('close')" @click="emit('close')"><X :size="16" /></button>
      </header>

      <textarea
        ref="area"
        v-model="text"
        rows="14"
        class="textarea code"
        spellcheck="false"
        :readonly="mode === 'export'"
        placeholder='{ "title": "…", "nodes": [...], "edges": [...] }'
      ></textarea>

      <footer class="card-foot">
        <button v-if="mode === 'export'" type="button" class="btn" @click="copy"><Copy :size="15" />{{ t('copyBtn') }}</button>
        <template v-else>
          <button type="button" class="btn" @click="fileInput.click()"><Upload :size="15" />.json</button>
          <input ref="fileInput" type="file" accept=".json,application/json" hidden @change="readFile" />
        </template>
        <div class="right">
          <button type="button" class="btn btn-flat" @click="emit('close')">{{ t('close') }}</button>
          <button v-if="mode === 'import'" type="button" class="btn btn-primary" :disabled="!text.trim()" @click="apply">
            {{ t('loadRecipe') }}
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(220, 220, 214, 0.55);
  backdrop-filter: blur(6px);
}
.card {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px;
  background: var(--body);
  border-radius: var(--r-lg);
  box-shadow: 0 30px 60px -18px rgba(60, 60, 50, 0.45), -10px -10px 30px rgba(255, 255, 255, 0.6);
}
.card-head,
.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.right {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.code {
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 12px;
}
.btn:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>

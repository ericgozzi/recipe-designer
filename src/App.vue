<script setup>
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import { state, boot, deleteSelection, clearSelection, exportPayload } from './store.js';
import { downloadFile, slugify } from './lib/format.js';
import AppHeader from './components/AppHeader.vue';
import FlowWorkspace from './components/FlowWorkspace.vue';
import GridView from './components/GridView.vue';
import JsonModal from './components/JsonModal.vue';
import ToastStack from './components/ToastStack.vue';

boot();

const jsonMode = ref(null); // 'import' while the import dialog is open

// Export saves a .json file straight away; import opens the paste / file dialog.
function onJson(mode) {
  if (mode === 'export') {
    const json = JSON.stringify(exportPayload(), null, 2);
    downloadFile(`${slugify(state.title, 'recipe')}.json`, json, 'application/json;charset=utf-8');
  } else {
    jsonMode.value = mode;
  }
}

watchEffect(() => {
  document.documentElement.lang = state.lang;
});

// Page margins live inside the sheet (so the cream paper reaches the edges).
watchEffect(() => {
  const el = document.getElementById('dynamic-print-page-style');
  if (el) el.textContent = `@page { size: ${state.paperSize} landscape; margin: 0; }`;
});

function isTyping(target) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    if (jsonMode.value) jsonMode.value = null;
    else if (!isTyping(e.target)) clearSelection();
    return;
  }
  if ((e.key === 'Delete' || e.key === 'Backspace') && state.activeTab === 'graph' && !jsonMode.value && !isTyping(e.target)) {
    e.preventDefault();
    deleteSelection();
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <div class="app-shell">
    <AppHeader class="no-print" />
    <FlowWorkspace v-show="state.activeTab === 'graph'" class="no-print" @json="onJson" />
    <GridView v-show="state.activeTab === 'grid'" class="grid-view" />
    <JsonModal v-if="jsonMode" @close="jsonMode = null" />
    <ToastStack />
  </div>
</template>

<style scoped>
.app-shell {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px 16px 16px;
  min-height: 0;
}

@media print {
  .app-shell {
    display: block;
    height: auto;
    padding: 0;
  }
  /* The recipe sheet prints even if the graph tab is open. */
  .grid-view {
    display: block !important;
  }
}

@media (max-width: 640px) {
  .app-shell {
    gap: 10px;
    padding: 10px 10px 12px;
  }
}
</style>

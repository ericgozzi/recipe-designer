<script setup>
import PrestartPanel from './PrestartPanel.vue';
import SymbolPanel from './SymbolPanel.vue';
import FlowCanvas from './FlowCanvas.vue';
import InspectorPanel from './InspectorPanel.vue';

defineEmits(['json']);
</script>

<template>
  <main class="workspace">
    <div class="left">
      <PrestartPanel class="slab prestart" />
      <SymbolPanel class="slab" />
    </div>
    <FlowCanvas class="canvas" @json="$emit('json', $event)" />
    <InspectorPanel class="slab side" />
  </main>
</template>

<style scoped>
.workspace {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr) 320px;
  gap: 16px;
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
.canvas {
  min-width: 0;
  min-height: 0;
}

@media (max-width: 1100px) {
  .workspace {
    grid-template-columns: 250px minmax(0, 1fr) 290px;
  }
}
@media (max-width: 900px) {
  .workspace {
    grid-template-columns: 1fr;
    grid-template-rows: auto minmax(460px, 70vh) auto;
    overflow-y: auto;
    padding: 4px;
  }
  .prestart {
    max-height: 300px;
  }
}
</style>

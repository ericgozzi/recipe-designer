<script setup>
import { onMounted, ref } from 'vue';
import { FilePlus, X, TriangleAlert } from 'lucide-vue-next';
import { state, t, clearRecipe } from '../store.js';
import CategoryPicker from './CategoryPicker.vue';

const emit = defineEmits(['close']);
const title = ref('');
const category = ref(null);
const input = ref(null);

onMounted(() => input.value?.focus());

function create() {
  clearRecipe(title.value, category.value);
  emit('close');
}
</script>

<template>
  <Teleport to="body">
    <div class="backdrop no-print" @pointerdown.self="emit('close')" @keydown.esc.stop="emit('close')">
      <form class="card" role="dialog" aria-modal="true" :aria-label="t('newRecipe')" @submit.prevent="create">
        <header class="card-head">
          <h3 class="panel-title"><FilePlus :size="15" />{{ t('newRecipe') }}</h3>
          <button type="button" class="knob knob-sm" :aria-label="t('close')" @click="emit('close')"><X :size="16" /></button>
        </header>

        <input ref="input" v-model="title" type="text" class="input title-input" :placeholder="t('titlePh')" :aria-label="t('titlePh')" />

        <CategoryPicker v-model="category" />

        <p v-if="state.isCustomModified" class="warning"><TriangleAlert :size="14" />{{ t('confirmReplace') }}</p>

        <footer class="card-foot">
          <button type="button" class="btn btn-flat" @click="emit('close')">{{ t('close') }}</button>
          <button type="submit" class="btn btn-primary"><FilePlus :size="15" />{{ t('createBtn') }}</button>
        </footer>
      </form>
    </div>
  </Teleport>
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
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
.card-foot {
  justify-content: flex-end;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.panel-title svg {
  color: var(--orange);
}
.title-input {
  height: 48px;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 22px;
}
.warning {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  color: var(--orange-ink);
}
.warning svg {
  flex-shrink: 0;
  margin-top: 1px;
}
</style>

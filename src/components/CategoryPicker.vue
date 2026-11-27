<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ChevronDown, Check, FolderOpen } from 'lucide-vue-next';
import { t } from '../store.js';
import { CATEGORIES, categoryByKey } from '../data/categories.js';

const props = defineProps({
  modelValue: { type: String, default: null },
  // Open the menu upwards (e.g. near the bottom of a dialog)
  up: Boolean,
});
const emit = defineEmits(['update:modelValue']);

const open = ref(false);
const root = ref(null);
const current = computed(() => categoryByKey(props.modelValue));

function choose(key) {
  emit('update:modelValue', key);
  open.value = false;
}
function onDocPointer(e) {
  if (root.value && !root.value.contains(e.target)) open.value = false;
}
function onKey(e) {
  if (e.key === 'Escape' && open.value) {
    e.stopPropagation();
    open.value = false;
  }
}
onMounted(() => document.addEventListener('pointerdown', onDocPointer));
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocPointer));
</script>

<template>
  <div ref="root" class="picker" @keydown="onKey">
    <button
      type="button"
      class="btn trigger"
      :class="{ empty: !current }"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-label="t('categoryLabel')"
      @click="open = !open"
    >
      <component :is="current ? current.icon : FolderOpen" :size="16" class="cat-icon" />
      <span class="name">{{ current ? t('categories')[current.key] : t('categoryLabel') }}</span>
      <ChevronDown :size="14" />
    </button>

    <Transition name="pop">
      <div v-if="open" class="menu" :class="{ up }" role="listbox" :aria-label="t('categoryLabel')">
        <button
          v-for="c in CATEGORIES"
          :key="c.key"
          type="button"
          role="option"
          class="option"
          :class="{ current: modelValue === c.key }"
          :aria-selected="modelValue === c.key"
          @click="choose(c.key)"
        >
          <component :is="c.icon" :size="17" class="cat-icon" />
          <span>{{ t('categories')[c.key] }}</span>
        </button>
        <button type="button" role="option" class="option none" :aria-selected="!modelValue" @click="choose(null)">
          <FolderOpen :size="17" class="cat-icon" />
          <span>{{ t('noCategory') }}</span>
          <Check v-if="!modelValue" :size="14" class="check" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.picker {
  position: relative;
}
.trigger {
  gap: 9px;
  max-width: 240px;
  text-transform: none;
  letter-spacing: 0.02em;
  font-size: 12px;
}
.trigger .name {
  overflow: hidden;
  text-overflow: ellipsis;
}
.trigger .cat-icon {
  color: var(--orange);
}
.trigger.empty {
  color: var(--ink-3);
}
.trigger.empty .cat-icon {
  color: var(--ink-3);
}

.menu {
  position: absolute;
  left: 0;
  top: calc(100% + 10px);
  z-index: 70;
  width: min(380px, calc(100vw - 40px));
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 8px;
  background: var(--body);
  border-radius: var(--r);
  box-shadow: 10px 10px 24px rgba(150, 150, 140, 0.45), -6px -6px 16px var(--sh-light);
}
.menu.up {
  top: auto;
  bottom: calc(100% + 10px);
}
.option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border: none;
  border-radius: 10px;
  background: transparent;
  font-size: 12.5px;
  text-align: left;
  color: var(--ink-2);
  cursor: pointer;
  transition: box-shadow 0.12s ease, color 0.12s ease;
}
.option .cat-icon {
  flex-shrink: 0;
  color: var(--ink-3);
  transition: color 0.12s ease, filter 0.12s ease;
}
.option:hover {
  color: var(--ink);
  box-shadow: var(--raise-xs);
}
.option.current {
  color: var(--ink);
  font-weight: 600;
  box-shadow: var(--inset-sm);
}
.option.current .cat-icon {
  color: var(--orange);
  filter: drop-shadow(0 0 4px rgba(255, 91, 31, 0.55));
}
.option.none {
  grid-column: 1 / -1;
  color: var(--ink-3);
}
.check {
  margin-left: auto;
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.pop-leave-active {
  pointer-events: none; /* a fading menu must not swallow the next click */
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { ChevronDown, Check, Languages } from 'lucide-vue-next';
import { I18N } from '../data/i18n.js';
import { LANGUAGES, state, setLanguage } from '../store.js';

const open = ref(false);
const root = ref(null);

function choose(code) {
  setLanguage(code);
  open.value = false;
}

function onDocPointer(e) {
  if (root.value && !root.value.contains(e.target)) open.value = false;
}
function onKey(e) {
  if (e.key === 'Escape') open.value = false;
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointer);
  document.addEventListener('keydown', onKey);
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointer);
  document.removeEventListener('keydown', onKey);
});
</script>

<template>
  <div ref="root" class="lang">
    <button
      type="button"
      class="btn lang-trigger"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="open = !open"
    >
      <Languages :size="15" />
      <span class="lcd">{{ I18N[state.lang].code }}</span>
      <ChevronDown :size="14" />
    </button>
    <Transition name="pop">
      <ul v-if="open" class="lang-menu" role="listbox">
        <li v-for="lang in LANGUAGES" :key="lang.code">
          <button
            type="button"
            role="option"
            :aria-selected="state.lang === lang.code"
            :class="{ current: state.lang === lang.code }"
            @click="choose(lang.code)"
          >
            <span class="code">{{ I18N[lang.code].code }}</span>
            <span class="name">{{ lang.label }}</span>
            <Check v-if="state.lang === lang.code" :size="14" />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.lang {
  position: relative;
}
.lang-trigger {
  padding: 0 8px 0 12px;
  gap: 7px;
}
.lang-trigger .lcd {
  height: 22px;
  min-width: 30px;
  font-size: 10px;
}
.code {
  width: 26px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--ink-3);
}
.lang-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 180px;
  margin: 0;
  padding: 5px;
  list-style: none;
  background: var(--body);
  border-radius: var(--r);
  box-shadow: 10px 10px 24px rgba(150, 150, 140, 0.45), -6px -6px 16px var(--sh-light);
  z-index: 60;
}
.lang-menu button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border: none;
  border-radius: 9px;
  background: transparent;
  font-size: 12.5px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}
.lang-menu button:hover {
  box-shadow: var(--raise-xs);
}
.lang-menu button.current {
  box-shadow: var(--inset-sm);
}
.lang-menu button.current {
  font-weight: 700;
}
.name {
  flex: 1;
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

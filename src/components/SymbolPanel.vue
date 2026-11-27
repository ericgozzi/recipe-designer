<script setup>
import { Sparkles } from 'lucide-vue-next';
import { state, t, toggleSymbol } from '../store.js';
import { SYMBOLS } from '../data/symbols.js';
</script>

<template>
  <section class="panel">
    <header class="panel-head">
      <h2 class="panel-title"><Sparkles :size="15" />{{ t('symbolsTitle') }}</h2>
      <span class="lcd">{{ String(state.symbols.length).padStart(2, '0') }}</span>
    </header>

    <div class="board">
      <button
        v-for="s in SYMBOLS"
        :key="s.key"
        type="button"
        role="switch"
        class="cell"
        :class="[s.tone, { on: state.symbols.includes(s.key) }]"
        :aria-checked="state.symbols.includes(s.key)"
        :aria-label="t('symbols')[s.key]"
        :data-tip="t('symbols')[s.key]"
        @click="toggleSymbol(s.key)"
      >
        <component :is="s.icon" :size="22" :stroke-width="1.75" class="icon" />
        <span class="mini-switch"><span class="lever"></span></span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.panel {
  padding: 16px 18px 18px;
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
.panel-title svg {
  color: var(--orange);
}

.board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px 6px;
}
.cell {
  --tone: var(--green);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  padding: 10px 0 6px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: var(--ink-3);
  cursor: pointer;
  transition: color 0.15s ease;
}
.cell.orange { --tone: var(--orange); }
.cell.saffron { --tone: var(--saffron); }
.cell:hover {
  color: var(--ink-2);
}
.cell:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--orange);
}
.cell.on {
  color: var(--ink);
}

/* The symbol itself is the light: dim when off, lit and glowing when on */
.icon {
  color: #c4c4bc;
  filter: drop-shadow(1px 1px 0 #fff);
  transition: color 0.18s ease, filter 0.18s ease;
}
.cell:hover .icon {
  color: #a9a9a1;
}
.cell.on .icon {
  color: var(--tone);
  filter: drop-shadow(0 0 3px var(--tone)) drop-shadow(0 0 8px color-mix(in srgb, var(--tone) 55%, transparent));
}

/* Tiny slide switch under each lamp */
.mini-switch {
  position: relative;
  width: 26px;
  height: 13px;
  border-radius: 999px;
  background: var(--body);
  box-shadow: inset 1px 1px 3px rgba(150, 150, 140, 0.7), inset -1px -1px 2px #fff;
}
.lever {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: linear-gradient(145deg, #ffffff, #dcdcd6);
  box-shadow: 1px 1px 2px rgba(120, 120, 110, 0.6);
  transition: transform 0.15s ease, background-color 0.15s ease;
}
.cell.on .lever {
  transform: translateX(13px);
  background: var(--ink);
}
</style>

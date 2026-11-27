<script setup>
import { computed, ref } from 'vue';
import { Timer, X } from 'lucide-vue-next';
import { TIME_STEPS, formatTime, nearestTimeStep, parseTimeInput } from '../lib/params.js';

const props = defineProps({
  value: { type: Number, default: null }, // minutes, or null when the node has no time
  label: { type: String, default: 'Timer' },
  removeLabel: { type: String, default: 'Remove' },
});
const emit = defineEmits(['change', 'clear']);

const LAST = TIME_STEPS.length - 1;
const SWEEP = 270; // degrees of travel, from 7:30 to 4:30 like a kitchen timer
const PX_PER_STEP = 6;
const SIZE = 112;
const RING_R = 50;

const index = computed(() => (props.value === null ? null : nearestTimeStep(props.value)));
const angle = computed(() => -SWEEP / 2 + ((index.value ?? nearestTimeStep(10)) / LAST) * SWEEP);

const dots = TIME_STEPS.map((min, i) => {
  const a = ((-SWEEP / 2 + (i / LAST) * SWEEP - 90) * Math.PI) / 180;
  const major = [5, 10, 15, 30, 60, 120, 240, 480].includes(min);
  return { x: SIZE / 2 + RING_R * Math.cos(a), y: SIZE / 2 + RING_R * Math.sin(a), major, i };
});

function setIndex(i) {
  const clamped = Math.min(LAST, Math.max(0, i));
  emit('change', TIME_STEPS[clamped]);
}

// Typed by hand: the exact value is kept (the knob just points at the nearest detent).
function onTyped(e) {
  const text = e.target.value;
  if (!text.trim()) return emit('clear');
  const min = parseTimeInput(text);
  if (min !== null && min > 0 && min <= 24 * 60 * 7) {
    emit('change', min);
    e.target.value = formatTime(min);
  } else {
    e.target.value = props.value === null ? '' : formatTime(props.value);
  }
}

// Drag up/down (or right/left) to turn, like a hardware encoder.
const drag = ref(null);
function onPointerDown(e) {
  if (e.button !== 0) return;
  e.currentTarget.setPointerCapture(e.pointerId);
  e.currentTarget.focus();
  drag.value = { x: e.clientX, y: e.clientY, start: index.value ?? nearestTimeStep(10), moved: false };
}
function onPointerMove(e) {
  if (!drag.value) return;
  const delta = Math.round((drag.value.y - e.clientY + (e.clientX - drag.value.x)) / PX_PER_STEP);
  if (delta !== 0 || drag.value.moved) {
    drag.value.moved = true;
    setIndex(drag.value.start + delta);
  }
}
function onPointerUp() {
  // A simple click on an unset knob switches it on at 10 minutes.
  if (drag.value && !drag.value.moved && props.value === null) setIndex(drag.value.start);
  drag.value = null;
}
function onWheel(e) {
  setIndex((index.value ?? nearestTimeStep(10) - 1) + (e.deltaY < 0 ? 1 : -1));
}
function onKey(e) {
  const step = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5 }[e.key];
  if (step) {
    e.preventDefault();
    setIndex((index.value ?? nearestTimeStep(10) - step) + step);
  } else if (e.key === 'Home' || e.key === 'End') {
    e.preventDefault();
    setIndex(e.key === 'Home' ? 0 : LAST);
  } else if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault();
    e.stopPropagation(); // don't delete the node
    emit('clear');
  }
}
</script>

<template>
  <div class="timer" :class="{ off: value === null }">
    <div
      class="dial"
      role="slider"
      tabindex="0"
      :aria-label="label"
      :aria-valuemin="TIME_STEPS[0]"
      :aria-valuemax="TIME_STEPS[LAST]"
      :aria-valuenow="value ?? undefined"
      :aria-valuetext="value === null ? '—' : formatTime(value)"
      :style="{ width: SIZE + 'px', height: SIZE + 'px' }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @wheel.prevent="onWheel"
      @keydown="onKey"
    >
      <i
        v-for="d in dots"
        :key="d.i"
        class="dot"
        :class="{ major: d.major, lit: index !== null && d.i <= index }"
        :style="{ left: d.x + 'px', top: d.y + 'px' }"
      ></i>
      <div class="cap" :style="{ transform: `rotate(${angle}deg)` }">
        <span class="pointer"></span>
      </div>
    </div>

    <div class="side">
      <Timer :size="16" class="icon" />
      <input
        class="lcd readout"
        type="text"
        :value="value === null ? '' : formatTime(value)"
        placeholder="—"
        :aria-label="label"
        title="90 · 1h30 · 1:30 · 12 min · 4h"
        @keydown.enter="$event.target.blur()"
        @change="onTyped"
      />
      <button
        v-if="value !== null"
        type="button"
        class="knob knob-sm"
        :title="removeLabel"
        :aria-label="removeLabel"
        @click="emit('clear')"
      >
        <X :size="12" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.timer {
  display: flex;
  align-items: center;
  gap: 14px;
}

.dial {
  position: relative;
  flex-shrink: 0;
  border-radius: 999px;
  box-shadow: var(--inset-sm);
  cursor: ns-resize;
  touch-action: none;
  user-select: none;
  outline: none;
}
.dial:focus-visible {
  box-shadow: var(--inset-sm), 0 0 0 2px var(--body), 0 0 0 4px var(--orange);
}

/* LED ring */
.dot {
  position: absolute;
  width: 3px;
  height: 3px;
  margin: -1.5px 0 0 -1.5px;
  border-radius: 999px;
  background: #cfcfc8;
  transition: background-color 0.1s ease, box-shadow 0.1s ease;
}
.dot.major {
  width: 5px;
  height: 5px;
  margin: -2.5px 0 0 -2.5px;
}
.dot.lit {
  background: var(--orange);
  box-shadow: 0 0 5px var(--orange);
}

/* Knob cap */
.cap {
  position: absolute;
  inset: 22px;
  border-radius: 999px;
  background:
    repeating-conic-gradient(from 0deg, rgba(0, 0, 0, 0.035) 0deg 4deg, transparent 4deg 8deg),
    radial-gradient(circle at 35% 30%, #ffffff, #ecece7 55%, #d9d9d2);
  box-shadow: 5px 6px 12px rgba(130, 130, 120, 0.55), -4px -4px 9px #fff, inset 0 1px 1px #fff;
  transition: transform 0.08s ease-out;
}
.pointer {
  position: absolute;
  left: 50%;
  top: 7px;
  width: 4px;
  height: 16px;
  margin-left: -2px;
  border-radius: 2px;
  background: var(--orange);
  box-shadow: 0 0 4px rgba(255, 91, 31, 0.6);
}
.off .pointer {
  background: var(--ink-3);
  box-shadow: none;
}
.dial:active .cap {
  box-shadow: 3px 4px 8px rgba(130, 130, 120, 0.55), -3px -3px 7px #fff, inset 0 1px 1px #fff;
}

.side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
}
.icon {
  color: var(--orange);
}
.off .icon {
  color: var(--ink-3);
}
.readout {
  width: 104px;
  border: none;
  outline: none;
  text-align: left;
  font-size: 12px;
  cursor: text;
}
.readout::placeholder {
  color: var(--ink-3);
}
.readout:focus {
  box-shadow: var(--inset-sm), 0 0 0 2px var(--orange);
}
</style>

<script setup>
import { computed } from 'vue';
import { Thermometer, X } from 'lucide-vue-next';
import { TEMP_MIN, TEMP_MAX, TEMP_STEP, tempColor } from '../lib/params.js';

const props = defineProps({
  value: { type: Number, default: null }, // °C, or null when the node has no temperature
  label: { type: String, default: 'Temperature' },
  removeLabel: { type: String, default: 'Remove' },
});
const emit = defineEmits(['change', 'clear']);

const SEGMENTS = 24;
const DEFAULT = 180;

const leds = computed(() =>
  Array.from({ length: SEGMENTS }, (_, i) => {
    const at = TEMP_MIN + ((i + 0.5) / SEGMENTS) * (TEMP_MAX - TEMP_MIN);
    const color = tempColor(at);
    const lit = props.value !== null && at <= props.value + (TEMP_MAX - TEMP_MIN) / SEGMENTS / 2;
    return { color, lit };
  })
);
// Typed by hand: any whole number of degrees (the fader itself covers 0–300 °C).
function onTyped(e) {
  const raw = e.target.value.trim().replace(/°?\s*c$/i, '');
  if (!raw) return emit('clear');
  const n = Math.round(Number(raw.replace(',', '.')));
  if (Number.isFinite(n) && n >= -50 && n <= 600) emit('change', n);
  else e.target.value = props.value ?? '';
}

const accent = computed(() => (props.value === null ? 'var(--ink-3)' : tempColor(props.value)));
</script>

<template>
  <div class="fader" :class="{ off: value === null }">
    <div class="fader-head">
      <Thermometer :size="16" :style="{ color: accent }" :title="label" />
      <label class="lcd readout" :style="value !== null ? { color: accent } : null">
        <input
          class="lcd-input"
          type="text"
          inputmode="numeric"
          :value="value ?? ''"
          placeholder="—"
          :aria-label="label"
          @keydown.enter="$event.target.blur()"
          @change="onTyped"
        /><small>°C</small>
      </label>
      <button
        v-if="value !== null"
        type="button"
        class="knob knob-sm clear"
        :title="removeLabel"
        :aria-label="removeLabel"
        @click="emit('clear')"
      >
        <X :size="12" />
      </button>
    </div>

    <div class="leds" aria-hidden="true">
      <i
        v-for="(led, i) in leds"
        :key="i"
        :class="{ lit: led.lit }"
        :style="led.lit ? { background: led.color, boxShadow: `0 0 6px ${led.color}` } : { '--tint': led.color }"
      ></i>
    </div>

    <input
      type="range"
      class="slot"
      :min="TEMP_MIN"
      :max="TEMP_MAX"
      :step="TEMP_STEP"
      :value="value ?? DEFAULT"
      :aria-label="label"
      :aria-valuetext="value === null ? '—' : `${value} °C`"
      @input="emit('change', Number($event.target.value))"
      @pointerup="value === null && emit('change', Number($event.target.value))"
    />

    <div class="scale" aria-hidden="true">
      <span>0</span><span>100</span><span>200</span><span>300</span>
    </div>
  </div>
</template>

<style scoped>
.fader {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px 10px;
  border-radius: var(--r);
  box-shadow: var(--inset-sm);
}
.fader-head {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 26px;
}
.readout {
  min-width: 64px;
  justify-content: flex-end;
  gap: 2px;
  font-size: 13px;
  transition: color 0.15s ease;
}
.readout {
  cursor: text;
}
.readout:focus-within {
  box-shadow: var(--inset-sm), 0 0 0 2px var(--orange);
}
.lcd-input {
  width: 40px;
  padding: 0;
  border: none;
  background: transparent;
  outline: none;
  font: inherit;
  color: inherit;
  text-align: right;
}
.lcd-input::placeholder {
  color: var(--ink-3);
}
.readout small {
  font-size: 9px;
  font-weight: 500;
  color: var(--ink-3);
}
.clear {
  margin-left: auto;
}

/* LED bar: dim coloured cells, lit up to the current temperature */
.leds {
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  gap: 3px;
  padding: 0 9px;
}
.leds i {
  height: 8px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--tint) 14%, #dcdcd6);
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.12);
  transition: background-color 0.12s ease, box-shadow 0.12s ease;
}

/* The slot and the fader cap */
.slot {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 40px;
  margin: 0;
  background: transparent;
  cursor: pointer;
}
.slot:focus {
  outline: none;
}
.slot::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 999px;
  background: #d9d9d3;
  box-shadow: inset 2px 2px 4px rgba(120, 120, 110, 0.55), inset -1px -1px 2px #fff;
}
.slot::-moz-range-track {
  height: 8px;
  border-radius: 999px;
  background: #d9d9d3;
  box-shadow: inset 2px 2px 4px rgba(120, 120, 110, 0.55), inset -1px -1px 2px #fff;
}
.slot::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 36px;
  margin-top: -14px;
  border: none;
  border-radius: 6px;
  /* centre line + grip ridges on a raised plastic cap */
  background:
    linear-gradient(90deg, transparent 10px, var(--orange) 10px, var(--orange) 12px, transparent 12px),
    repeating-linear-gradient(180deg, rgba(0, 0, 0, 0.09) 0 1px, transparent 1px 4px),
    linear-gradient(180deg, #ffffff, #e2e2dc);
  box-shadow: 3px 4px 8px rgba(120, 120, 110, 0.55), -2px -2px 5px #fff, inset 0 1px 0 #fff;
  transition: transform 0.1s ease;
}
.slot::-moz-range-thumb {
  width: 22px;
  height: 36px;
  border: none;
  border-radius: 6px;
  background:
    linear-gradient(90deg, transparent 10px, var(--orange) 10px, var(--orange) 12px, transparent 12px),
    repeating-linear-gradient(180deg, rgba(0, 0, 0, 0.09) 0 1px, transparent 1px 4px),
    linear-gradient(180deg, #ffffff, #e2e2dc);
  box-shadow: 3px 4px 8px rgba(120, 120, 110, 0.55), -2px -2px 5px #fff, inset 0 1px 0 #fff;
}
.slot:active::-webkit-slider-thumb {
  transform: scale(0.97);
}
.slot:focus-visible::-webkit-slider-thumb {
  box-shadow: 3px 4px 8px rgba(120, 120, 110, 0.55), 0 0 0 2px var(--body), 0 0 0 4px var(--orange);
}
.off .slot::-webkit-slider-thumb {
  background:
    repeating-linear-gradient(180deg, rgba(0, 0, 0, 0.07) 0 1px, transparent 1px 4px),
    linear-gradient(180deg, #f7f7f4, #e4e4df);
}
.off .slot::-moz-range-thumb {
  background:
    repeating-linear-gradient(180deg, rgba(0, 0, 0, 0.07) 0 1px, transparent 1px 4px),
    linear-gradient(180deg, #f7f7f4, #e4e4df);
}

.scale {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
  margin-top: -6px;
  font-family: var(--font-mono);
  font-size: 8.5px;
  color: var(--ink-3);
}
</style>

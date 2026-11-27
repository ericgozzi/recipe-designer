<script setup>
import { toasts } from '../store.js';
</script>

<template>
  <TransitionGroup tag="div" name="toast" class="toast-stack no-print" aria-live="polite">
    <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.tone">
      <span class="dot"></span>
      {{ toast.message }}
    </div>
  </TransitionGroup>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 90;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: 9px;
  max-width: 380px;
  padding: 10px 14px;
  border-radius: 14px;
  background: var(--body);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.03em;
  box-shadow: 8px 8px 20px rgba(150, 150, 140, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.9);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex-shrink: 0;
  background: var(--saffron);
  box-shadow: 0 0 8px var(--saffron);
}
.toast.success .dot { background: var(--green); box-shadow: 0 0 8px var(--green); }
.toast.error .dot { background: var(--orange); box-shadow: 0 0 8px var(--orange); }

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

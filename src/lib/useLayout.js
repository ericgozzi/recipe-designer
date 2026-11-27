import { onBeforeUnmount, onMounted, ref } from 'vue';

// 'desktop' ≥ 1180px · 'tablet' 900–1179px · 'phone' < 900px (phones and portrait tablets)
function current() {
  const w = window.innerWidth;
  return w >= 1180 ? 'desktop' : w >= 900 ? 'tablet' : 'phone';
}

export function useLayout() {
  const layout = ref(current());
  const update = () => (layout.value = current());
  onMounted(() => window.addEventListener('resize', update));
  onBeforeUnmount(() => window.removeEventListener('resize', update));
  return layout;
}

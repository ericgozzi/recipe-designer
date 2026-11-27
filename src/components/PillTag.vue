<script setup>
import { computed } from 'vue';
import { isTimeOrOvenTag } from '../lib/tags.js';

const props = defineProps({ tag: { type: String, required: true } });
const kind = computed(() => (isTimeOrOvenTag(props.tag) ? 'pill-param' : 'pill-tech'));
</script>

<template>
  <span class="pill" :class="kind">{{ tag }}</span>
</template>

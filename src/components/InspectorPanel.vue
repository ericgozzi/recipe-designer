<script setup>
import { computed, ref } from 'vue';
import { ArrowRight, Trash2, X, Unlink, Plus, Tag, Flame } from 'lucide-vue-next';
import { TYPE_ICON } from '../lib/typeIcons.js';
import { isTempTag, parseTemp, formatTemp, isTimeTag, parseTime, formatTime } from '../lib/params.js';
import TempFader from './TempFader.vue';
import TimerKnob from './TimerKnob.vue';
import {
  state,
  t,
  nodeLabel,
  updateNodeField,
  toggleNodeTag,
  removeNodeTag,
  addCustomTag,
  setParamTag,
  deleteNode,
  deleteEdge,
} from '../store.js';
import { UNIT_OPTIONS } from '../data/units.js';
import { isTimeOrOvenTag } from '../lib/tags.js';

const node = computed(() => state.nodes.find((n) => n.id === state.selectedNodeId) || null);
const edge = computed(() => state.edges.find((e) => e.id === state.selectedEdgeId) || null);
const edgeFrom = computed(() => edge.value && state.nodes.find((n) => n.id === edge.value.from));
const edgeTo = computed(() => edge.value && state.nodes.find((n) => n.id === edge.value.to));

const typeLabel = computed(() => {
  if (edge.value) return t('typeConnection');
  if (!node.value) return t('typeNone');
  return { ingredient: t('typeIngredient'), lavoration: t('typeLavoration'), output: t('typeOutput') }[node.value.type];
});
const badgeKind = computed(() => (edge.value ? 'connection' : node.value?.type || 'none'));

// Keep imported units that aren't in the default list selectable.
const unitOptions = computed(() => {
  const u = node.value?.unit;
  return u && !UNIT_OPTIONS.includes(u) ? [...UNIT_OPTIONS, u] : UNIT_OPTIONS;
});

function bind(field) {
  return computed({
    get: () => node.value?.[field] ?? '',
    set: (v) => node.value && updateNodeField(node.value, field, v),
  });
}
const name = bind('name');
const qty = bind('qty');
const unit = bind('unit');
const note = bind('note');
const title = bind('title');

function normalizeQty() {
  if (node.value && (node.value.qty === '' || !Number.isFinite(Number(node.value.qty)))) updateNodeField(node.value, 'qty', 0);
}

// Temperature and time get dedicated controls; remaining quick tags (heat level…) stay as keys.
const tempValue = computed(() => {
  const tag = node.value?.tags?.find(isTempTag);
  return tag ? parseTemp(tag) : null;
});
const timeValue = computed(() => {
  const tag = node.value?.tags?.find(isTimeTag);
  return tag ? parseTime(tag) : null;
});
const heatTags = computed(() => t('quickParamTags').filter((tag) => !isTempTag(tag) && !isTimeTag(tag)));

const customTag = ref('');
function submitTag() {
  addCustomTag(node.value, customTag.value);
  customTag.value = '';
}
</script>

<template>
  <aside class="panel">
    <header class="panel-head">
      <span class="type-badge" :class="badgeKind" :title="typeLabel">
        <span class="led" :class="node ? node.type : 'off'"></span>
        <component :is="TYPE_ICON[node.type]" v-if="node" :size="14" />
        <span class="badge-text">{{ node || edge ? typeLabel : t('inspectorTitle') }}</span>
      </span>
      <button v-if="edge" type="button" class="knob danger-knob" data-tip-pos="bottom" :data-tip="t('deleteEdge')" :aria-label="t('deleteEdge')" @click="deleteEdge(edge.id)">
        <Unlink :size="15" />
      </button>
      <button v-else-if="node" type="button" class="knob danger-knob" data-tip-pos="bottom" :data-tip="t('deleteNode')" :aria-label="t('deleteNode')" @click="deleteNode(node.id)">
        <Trash2 :size="15" />
      </button>
    </header>

    <div class="panel-body">
      <!-- Connection -->
      <template v-if="edge">
        <div class="connection">
          <div class="conn-end" :title="t('fromLabel')">
            <span class="conn-name"><span class="led" :class="edgeFrom?.type"></span>{{ nodeLabel(edgeFrom) || edge.from }}</span>
          </div>
          <ArrowRight :size="16" class="conn-arrow" />
          <div class="conn-end" :title="t('toLabel')">
            <span class="conn-name"><span class="led" :class="edgeTo?.type"></span>{{ nodeLabel(edgeTo) || edge.to }}</span>
          </div>
        </div>
      </template>

      <!-- Nothing selected -->
      <div v-else-if="!node" class="empty-box">{{ t('inspectorNone') }}</div>

      <!-- Ingredient -->
      <template v-else-if="node.type === 'ingredient'">
        <label class="field">
          <span class="label">{{ t('fieldIngName') }}</span>
          <input v-model="name" type="text" class="input strong" />
        </label>
        <div class="two-col">
          <label class="field">
            <span class="label">{{ t('fieldQty') }}</span>
            <input
              v-if="node.unit !== 'qb'"
              v-model.number="qty"
              type="number"
              step="any"
              min="0"
              class="input strong tabular-nums"
              @blur="normalizeQty"
            />
            <span v-else class="input qb-placeholder">—</span>
          </label>
          <label class="field">
            <span class="label">{{ t('fieldUnit') }}</span>
            <select v-model="unit" class="select">
              <option v-for="u in unitOptions" :key="u" :value="u">{{ u === 'qb' ? t('unitQb') : u }}</option>
            </select>
          </label>
        </div>
        <label class="field">
          <span class="label">{{ t('fieldNote') }}</span>
          <input v-model="note" type="text" class="input" :placeholder="t('fieldNotePh')" />
        </label>
      </template>

      <!-- Step / final dish -->
      <template v-else>
        <label class="field">
          <span class="label">{{ node.type === 'lavoration' ? t('fieldLavAction') : t('fieldOutAction') }}</span>
          <textarea v-model="title" rows="3" class="textarea strong"></textarea>
        </label>

        <div class="tag-well" :title="t('fieldActiveTags')">
            <button
              v-for="(tag, idx) in node.tags"
              :key="tag + idx"
              type="button"
              class="pill"
              :class="isTimeOrOvenTag(tag) ? 'pill-param' : 'pill-tech'"
              @click="removeNodeTag(node, idx)"
            >
              {{ tag }}<X :size="11" :stroke-width="3" />
            </button>
            <span v-if="!node.tags?.length" class="no-tags">{{ t('fieldNoTags') }}</span>
        </div>

        <form class="add-row" @submit.prevent="submitTag">
          <input v-model="customTag" type="text" class="input" :placeholder="t('fieldCustomTagPh')" />
          <button type="submit" class="knob add-knob" :title="t('addBtn')" :aria-label="t('addBtn')"><Plus :size="16" /></button>
        </form>

        <div class="tag-group">
          <span class="group-icon tech" :data-tip="t('fieldQuickTech')"><Tag :size="14" /></span>
          <div class="tag-cloud">
            <button
              v-for="tag in t('quickTechTags')"
              :key="tag"
              type="button"
              class="tag-key tech"
              :class="{ on: node.tags?.includes(tag) }"
              @click="toggleNodeTag(node, tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <TempFader
          :value="tempValue"
          :label="t('tempLabel')"
          :remove-label="t('removeLabel')"
          @change="setParamTag(node, isTempTag, formatTemp($event))"
          @clear="setParamTag(node, isTempTag, null)"
        />

        <TimerKnob
          :value="timeValue"
          :label="t('timerLabel')"
          :remove-label="t('removeLabel')"
          @change="setParamTag(node, isTimeTag, formatTime($event))"
          @clear="setParamTag(node, isTimeTag, null)"
        />

        <div v-if="heatTags.length" class="tag-group">
          <span class="group-icon param" :data-tip="t('fieldQuickParam')"><Flame :size="14" /></span>
          <div class="tag-cloud">
            <button
              v-for="tag in heatTags"
              :key="tag"
              type="button"
              class="tag-key param"
              :class="{ on: node.tags?.includes(tag) }"
              @click="toggleNodeTag(node, tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </template>

    </div>
  </aside>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
}
.panel-head {
  display: flex;
  align-items: center;
  min-height: 70px;
  justify-content: space-between;
  gap: 8px;
  padding: 18px 18px 14px;
}
.type-badge {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 26px;
  padding: 0 11px;
  border-radius: 999px;
  box-shadow: var(--inset-sm);
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-2);
}
.type-badge .led {
  width: 7px;
  height: 7px;
}
.type-badge.connection .led {
  background: var(--ink-2);
}

.panel-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.strong {
  font-weight: 600;
}
.qb-placeholder {
  display: flex;
  align-items: center;
  color: var(--ink-3);
  cursor: default;
}
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.label.tech { color: var(--green-ink); }
.label.param { color: var(--orange-ink); }

.tag-well {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  min-height: 44px;
  padding: 9px;
  border-radius: var(--r);
  box-shadow: var(--inset-sm);
}
.no-tags {
  font-size: 12px;
  color: var(--ink-3);
}
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.add-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.connection {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border-radius: var(--r);
  box-shadow: var(--inset-sm);
}
.conn-end {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.conn-name {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.35;
}
.conn-name .led {
  margin-top: 4px;
  width: 7px;
  height: 7px;
}
.conn-arrow {
  color: var(--orange);
}

.danger-knob {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}
.danger-knob:hover {
  color: var(--orange-deep);
}
.add-knob {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
}
.badge-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag-group {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.group-icon {
  display: inline-flex;
  gap: 2px;
  flex-shrink: 0;
  width: 34px;
  padding-top: 6px;
}
.tag-group .tag-cloud {
  flex: 1;
}
.group-icon.tech { color: var(--green); }
.group-icon.param { color: var(--orange); }
</style>

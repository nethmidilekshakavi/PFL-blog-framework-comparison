<script setup>
import { tagColor } from "../lib/format";

defineProps({ tag: String, active: Boolean, clickable: Boolean });
defineEmits(["click"]);

const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition";
const activeCls =
    "bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-900 dark:ring-white";
const idleCls =
    "bg-white/70 text-slate-600 ring-slate-200 hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800";
</script>

<template>
  <button
      v-if="clickable"
      type="button"
      :class="[base, active ? activeCls : idleCls]"
      @click="$emit('click')"
  >
    {{ tag }}
  </button>
  <span v-else :class="[base, tagColor(tag)]">#{{ tag }}</span>
</template>
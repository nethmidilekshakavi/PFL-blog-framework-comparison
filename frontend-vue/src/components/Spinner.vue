<script setup>
defineProps({ label: { type: String, default: "Loading..." } });
</script>

<template>
  <div class="flex items-center justify-center gap-3 py-24 text-slate-500">
    <span class="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
    {{ label }}
  </div>
</template>
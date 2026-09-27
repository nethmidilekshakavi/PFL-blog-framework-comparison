<script setup>
import { toasts } from "../composables/useToast";
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    <div
        v-for="t in toasts"
        :key="t.id"
        class="animate-fade-up rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg"
        :class="t.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'"
    >
      {{ t.message }}
    </div>
  </div>
</template>
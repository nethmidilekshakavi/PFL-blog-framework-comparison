<script setup>
import { AlertTriangle } from "lucide-vue-next";

defineProps({ error: Object, retryable: Boolean });
defineEmits(["retry"]);
</script>

<template>
  <div class="mx-auto max-w-lg rounded-3xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-500/20 dark:bg-red-500/10">
    <AlertTriangle class="mx-auto h-10 w-10 text-red-500" />
    <p class="mt-3 font-semibold text-red-700 dark:text-red-300">
      {{ error?.message ?? "Something went wrong" }}
    </p>
    <p class="mt-1 text-sm text-red-600/80 dark:text-red-300/70">
      Backend eka port 3001 eke run wenawada balanna.
    </p>
    <button
        v-if="retryable"
        class="mt-5 rounded-xl bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
        @click="$emit('retry')"
    >
      Try again
    </button>
  </div>
</template>
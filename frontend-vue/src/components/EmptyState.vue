<script setup>
import { RouterLink } from "vue-router";
import { FileSearch } from "lucide-vue-next";

defineProps({ title: { type: String, default: "No posts found" } });
</script>

<template>
  <div class="mt-16 flex flex-col items-center text-center">
    <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
      <FileSearch class="h-8 w-8" />
    </span>
    <h3 class="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{{ title }}</h3>
    <p class="mt-1 text-sm text-slate-500">Search eka hari filter eka hari wenas karala balanna.</p>
    <RouterLink to="/posts/new" class="mt-5 text-sm font-medium text-indigo-500 hover:underline">
      Write a new post →
    </RouterLink>
  </div>
</template>
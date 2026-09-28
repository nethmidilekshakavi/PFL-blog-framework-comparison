<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="py-20 text-center">
    <h1 class="text-5xl font-bold text-slate-900 dark:text-white">404</h1>
    <p class="mt-2 text-slate-500">This page doesn't exist.</p>
    <RouterLink to="/" class="mt-6 inline-block text-indigo-600 hover:underline">
      ← Back to posts
    </RouterLink>
  </div>
</template>
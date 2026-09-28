<script setup>
import { RouterLink } from "vue-router";
import { ArrowRight, Clock, Sparkles } from "lucide-vue-next";
import { formatDate, readingTime } from "../lib/format";

defineProps({ post: { type: Object, required: true } });
</script>

<template>
  <RouterLink
      :to="`/posts/${post.id}`"
      class="group relative mb-8 block overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white shadow-xl shadow-indigo-500/20 transition hover:shadow-2xl hover:shadow-indigo-500/30 sm:p-10"
  >
    <div class="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
    <div class="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-fuchsia-300/20 blur-2xl" />

    <span class="relative inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
      <Sparkles class="h-3.5 w-3.5" /> Featured
    </span>
    <h2 class="relative mt-4 max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
      {{ post.title }}
    </h2>
    <p class="relative mt-3 line-clamp-3 max-w-2xl text-white/80">{{ post.content }}</p>

    <div class="relative mt-6 flex flex-wrap items-center gap-4 text-sm text-white/80">
      <time>{{ formatDate(post.createdAt) }}</time>
      <span class="flex items-center gap-1">
        <Clock class="h-4 w-4" /> {{ readingTime(post.content) }} min read
      </span>
      <span class="ml-auto flex items-center gap-1 font-semibold text-white">
        Read article
        <ArrowRight class="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </div>
  </RouterLink>
</template>
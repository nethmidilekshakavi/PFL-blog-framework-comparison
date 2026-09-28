<script setup>
import { RouterLink } from "vue-router";
import { ArrowUpRight, Clock } from "lucide-vue-next";
import TagBadge from "./TagBadge.vue";
import { formatDate, readingTime } from "../lib/format";

defineProps({ post: { type: Object, required: true }, index: { type: Number, default: 0 } });
</script>

<template>
  <article
      :style="{ animationDelay: index * 70 + 'ms' }"
      class="group relative flex animate-fade-up flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
  >
    <div class="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-transform duration-300 group-hover:scale-x-100" />

    <div class="flex items-center gap-3 text-xs text-slate-500">
      <time>{{ formatDate(post.createdAt) }}</time>
      <span class="flex items-center gap-1">
        <Clock class="h-3.5 w-3.5" /> {{ readingTime(post.content) }} min read
      </span>
    </div>

    <h2 class="mt-3 text-xl font-bold leading-snug text-slate-900 dark:text-white">
      <RouterLink :to="`/posts/${post.id}`" class="after:absolute after:inset-0">
        {{ post.title }}
      </RouterLink>
    </h2>

    <p class="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
      {{ post.content }}
    </p>

    <div class="mt-5 flex items-end justify-between gap-3">
      <div class="flex flex-wrap gap-1.5">
        <TagBadge v-for="t in (post.tags ?? []).slice(0, 3)" :key="t" :tag="t" />
      </div>
      <ArrowUpRight class="h-5 w-5 shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-500" />
    </div>
  </article>
</template>
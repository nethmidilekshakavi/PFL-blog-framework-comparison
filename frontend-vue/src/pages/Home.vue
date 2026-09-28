<script setup>
import { computed, ref } from "vue";
import { ArrowDownWideNarrow, Search, Sparkles, X } from "lucide-vue-next";
import { usePosts } from "../composables/usePosts";
import PostCard from "../components/PostCard.vue";
import FeaturedPost from "../components/FeaturedPost.vue";
import TagBadge from "../components/TagBadge.vue";
import EmptyState from "../components/EmptyState.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import PostCardSkeleton from "../components/PostCardSkeleton.vue";

const { data: posts, isLoading, isError, error, refetch } = usePosts();
const query = ref("");
const activeTag = ref(null);
const newestFirst = ref(true);

const allTags = computed(() =>
    [...new Set((posts.value ?? []).flatMap((p) => p.tags ?? []))].sort()
);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  const list = (posts.value ?? []).filter((p) => {
    const matchesText =
        !q || p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q);
    const matchesTag = !activeTag.value || p.tags?.includes(activeTag.value);
    return matchesText && matchesTag;
  });
  return newestFirst.value ? list : [...list].reverse();
});

const isFiltering = computed(() => Boolean(query.value.trim() || activeTag.value));
const showFeatured = computed(
    () => !isFiltering.value && newestFirst.value && filtered.value.length > 1
);
const featured = computed(() => (showFeatured.value ? filtered.value[0] : null));
const rest = computed(() => (showFeatured.value ? filtered.value.slice(1) : filtered.value));

const toggleTag = (tag) => {
  activeTag.value = activeTag.value === tag ? null : tag;
};
</script>

<template>
  <div>
    <section class="mb-10 text-center">
      <span class="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
        <Sparkles class="h-3.5 w-3.5" /> Web development articles
      </span>
      <h1 class="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
        Learn. Build.
        <span class="bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
          Share.
        </span>
      </h1>
      <p class="mx-auto mt-4 max-w-xl text-slate-500 dark:text-slate-400">
        {{ posts ? `${posts.length} article${posts.length !== 1 ? "s" : ""}` : "Articles" }}
        about Vue, backend, and modern web development.
      </p>
    </section>

    <div class="mx-auto max-w-2xl">
      <div class="relative">
        <Search class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
            v-model="query"
            type="text"
            placeholder="Search posts..."
            class="w-full rounded-2xl border border-slate-200 bg-white/80 py-3.5 pl-12 pr-12 shadow-sm outline-none backdrop-blur transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white"
        />
        <button
            v-if="query"
            aria-label="Clear search"
            class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            @click="query = ''"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
      <TagBadge tag="all" clickable :active="!activeTag" @click="activeTag = null" />
      <TagBadge
          v-for="tag in allTags"
          :key="tag"
          :tag="tag"
          clickable
          :active="activeTag === tag"
          @click="toggleTag(tag)"
      />
    </div>

    <div class="mb-6 mt-10 flex items-center justify-between">
      <p class="text-sm text-slate-500">
        {{ filtered.length }} result{{ filtered.length !== 1 ? "s" : "" }}
      </p>
      <button
          class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-200/70 dark:text-slate-400 dark:hover:bg-slate-800"
          @click="newestFirst = !newestFirst"
      >
        <ArrowDownWideNarrow class="h-4 w-4" />
        {{ newestFirst ? "Newest first" : "Oldest first" }}
      </button>
    </div>

    <div v-if="isLoading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <PostCardSkeleton v-for="i in 6" :key="i" />
    </div>

    <ErrorMessage v-else-if="isError" :error="error" retryable @retry="refetch" />

    <template v-else>
      <FeaturedPost v-if="featured" :post="featured" />
      <EmptyState v-if="rest.length === 0 && !featured" />
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <PostCard v-for="(post, i) in rest" :key="post.id" :post="post" :index="i" />
      </div>
    </template>
  </div>
</template>
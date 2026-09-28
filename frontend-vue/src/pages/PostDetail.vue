<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { ArrowLeft, Clock, Pencil, Trash2 } from "lucide-vue-next";
import { toast } from "../composables/useToast";
import { useDeletePost, usePost, usePosts } from "../composables/usePosts";
import TagBadge from "../components/TagBadge.vue";
import PostCard from "../components/PostCard.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import Spinner from "../components/Spinner.vue";
import { formatDate, readingTime } from "../lib/format";

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);

const { data: post, isLoading, isError, error } = usePost(id);
const { data: allPosts } = usePosts();
const { mutate: deleteMutate, isPending: deleting } = useDeletePost();

const confirmOpen = ref(false);
const progress = ref(0);

const onScroll = () => {
  const el = document.documentElement;
  const max = el.scrollHeight - el.clientHeight;
  progress.value = max > 0 ? (el.scrollTop / max) * 100 : 0;
};
onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));

const paragraphs = computed(() => post.value?.content.split(/\n+/).filter(Boolean) ?? []);

const related = computed(() => {
  if (!post.value || !allPosts.value) return [];
  return allPosts.value
      .filter((p) => p.id !== post.value.id && p.tags?.some((t) => post.value.tags?.includes(t)))
      .slice(0, 2);
});

const handleDelete = () => {
  deleteMutate(id.value, {
    onSuccess: () => {
      toast.success("Post deleted");
      router.push("/");
    },
    onError: (e) => toast.error(e.message),
  });
};

const dropCap =
    "first-letter:float-left first-letter:mr-1 first-letter:text-5xl first-letter:font-bold first-letter:text-indigo-500";
</script>

<template>
  <Spinner v-if="isLoading" />
  <ErrorMessage v-else-if="isError" :error="error" />

  <template v-else-if="post">
    <div
        class="fixed left-0 top-0 z-30 h-1 bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
        :style="{ width: progress + '%' }"
    />

    <article class="mx-auto max-w-3xl animate-fade-up">
      <RouterLink
          to="/"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-indigo-500"
      >
        <ArrowLeft class="h-4 w-4" /> All posts
      </RouterLink>

      <div class="mt-6 flex flex-wrap gap-1.5">
        <TagBadge v-for="t in post.tags ?? []" :key="t" :tag="t" />
      </div>

      <h1 class="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
        {{ post.title }}
      </h1>

      <div class="mt-5 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-6 text-sm text-slate-500 dark:border-slate-800">
        <time>{{ formatDate(post.createdAt) }}</time>
        <span class="flex items-center gap-1">
          <Clock class="h-4 w-4" /> {{ readingTime(post.content) }} min read
        </span>
        <div class="ml-auto flex gap-2">
          <RouterLink
              :to="`/posts/${post.id}/edit`"
              class="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900"
          >
            <Pencil class="h-4 w-4" /> Edit
          </RouterLink>
          <button
              class="flex items-center gap-1.5 rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
              @click="confirmOpen = true"
          >
            <Trash2 class="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      <div class="mt-8 space-y-5 text-lg leading-8 text-slate-700 dark:text-slate-300">
        <p v-for="(p, i) in paragraphs" :key="i" :class="i === 0 ? dropCap : ''">{{ p }}</p>
      </div>
    </article>

    <section v-if="related.length" class="mx-auto mt-16 max-w-3xl">
      <h2 class="mb-5 text-xl font-bold text-slate-900 dark:text-white">Related posts</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <PostCard v-for="(p, i) in related" :key="p.id" :post="p" :index="i" />
      </div>
    </section>

    <div
        v-if="confirmOpen"
        class="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
    >
      <div class="w-full max-w-sm animate-fade-up rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/10">
          <Trash2 class="h-6 w-6" />
        </span>
        <h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">Delete this post?</h3>
        <p class="mt-1 text-sm text-slate-500">Are you sure ?? this will be delete permanently.</p>
        <div class="mt-6 flex justify-end gap-3">
          <button
              class="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="confirmOpen = false"
          >
            Cancel
          </button>
          <button
              :disabled="deleting"
              class="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              @click="handleDelete"
          >
            {{ deleting ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </template>
</template>
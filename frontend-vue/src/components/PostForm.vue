<script setup>
import { computed, ref } from "vue";
import { Eye, Loader2 } from "lucide-vue-next";
import TagBadge from "./TagBadge.vue";

const props = defineProps({
  initial: Object,
  submitting: Boolean,
  submitLabel: String,
});
const emit = defineEmits(["submit"]);

const TITLE_MAX = 100;
const title = ref(props.initial?.title ?? "");
const content = ref(props.initial?.content ?? "");
const tags = ref(props.initial?.tags?.join(", ") ?? "");
const errors = ref({});

const tagList = computed(() => [
  ...new Set(tags.value.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)),
]);

const validate = () => {
  const e = {};
  if (title.value.trim().length < 3) e.title = "Title must be at least 3 characters";
  if (content.value.trim().length < 20) e.content = "Content must be at least 20 characters";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const handleSubmit = () => {
  if (!validate()) return;
  emit("submit", {
    title: title.value.trim(),
    content: content.value.trim(),
    tags: tagList.value,
  });
};

const field =
    "mt-1.5 w-full rounded-2xl border bg-white/80 px-4 py-3 outline-none backdrop-blur transition focus:ring-4 dark:bg-slate-900/70 dark:text-white";
const ok = "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/15 dark:border-slate-800";
const bad = "border-red-400 focus:border-red-500 focus:ring-red-500/15";
const label = "text-sm font-semibold text-slate-700 dark:text-slate-300";
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <form class="space-y-6" novalidate @submit.prevent="handleSubmit">
      <div>
        <div class="flex justify-between">
          <label :class="label">Title</label>
          <span class="text-xs text-slate-400">{{ title.length }}/{{ TITLE_MAX }}</span>
        </div>
        <input
            v-model="title"
            :maxlength="TITLE_MAX"
            :class="[field, errors.title ? bad : ok]"
            placeholder="Post title"
        />
        <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
      </div>

      <div>
        <div class="flex justify-between">
          <label :class="label">Content</label>
          <span class="text-xs text-slate-400">{{ content.length }} chars</span>
        </div>
        <textarea
            v-model="content"
            rows="12"
            :class="[field, 'resize-y', errors.content ? bad : ok]"
            placeholder="Write your post..."
        />
        <p v-if="errors.content" class="mt-1 text-sm text-red-500">{{ errors.content }}</p>
      </div>

      <div>
        <label :class="label">
          Tags <span class="font-normal text-slate-400">(comma separated)</span>
        </label>
        <input v-model="tags" :class="[field, ok]" placeholder="vue, javascript, tutorial" />
      </div>

      <button
          type="submit"
          :disabled="submitting"
          class="flex items-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-fuchsia-600 px-7 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-xl hover:brightness-110 disabled:opacity-60"
      >
        <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
        {{ submitting ? "Saving..." : submitLabel }}
      </button>
    </form>

    <aside class="lg:sticky lg:top-24 lg:self-start">
      <div class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
        <Eye class="h-4 w-4" /> Live preview
      </div>
      <div class="rounded-3xl border border-slate-200 bg-white/80 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
        <div class="flex flex-wrap gap-1.5">
          <TagBadge v-for="t in tagList" :key="t" :tag="t" />
        </div>
        <h2 class="mt-3 break-words text-2xl font-extrabold text-slate-900 dark:text-white">
          {{ title || "Your title appears here" }}
        </h2>
        <p class="mt-3 whitespace-pre-line break-words leading-relaxed text-slate-600 dark:text-slate-400">
          {{ content || "Start typing to see your post come to life..." }}
        </p>
      </div>
    </aside>
  </div>
</template>
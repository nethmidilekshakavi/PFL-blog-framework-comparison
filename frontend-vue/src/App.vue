<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { Moon, PenLine, Plus, Sun } from "lucide-vue-next";
import { useTheme } from "./composables/useTheme";
import Toaster from "./components/Toaster.vue";

const route = useRoute();
const { theme, toggle } = useTheme();
</script>

<template>
  <div class="relative isolate flex min-h-screen flex-col">
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10" />
      <div class="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-500/10" />
      <div class="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/10" />
    </div>

    <header class="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/60">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <RouterLink to="/" class="flex items-center gap-2.5">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
            <PenLine class="h-5 w-5" />
          </span>
          <span class="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dev<span class="text-indigo-500">Blog</span>
          </span>
        </RouterLink>

        <nav class="flex items-center gap-2 text-sm font-medium">
          <RouterLink
              to="/"
              class="hidden rounded-lg px-3 py-2 transition sm:block"
              :class="
              route.path === '/'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            "
          >
            Posts
          </RouterLink>

          <button
              aria-label="Toggle theme"
              class="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="toggle"
          >
            <Sun v-if="theme === 'dark'" class="h-5 w-5" />
            <Moon v-else class="h-5 w-5" />
          </button>

          <RouterLink
              to="/posts/new"
              class="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <Plus class="h-4 w-4" /> New Post
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <RouterView :key="$route.fullPath" />
    </main>

    <footer class="border-t border-slate-200/70 py-8 text-center text-sm text-slate-500 dark:border-slate-800/70">
      © {{ new Date().getFullYear() }} DevBlog · Built with Vue, Vite &amp; Tailwind
    </footer>

    <Toaster />
  </div>
</template>
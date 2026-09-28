<script setup>
import { computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import { toast } from "../composables/useToast";
import { useCreatePost, usePost, useUpdatePost } from "../composables/usePosts";
import PostForm from "../components/PostForm.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import Spinner from "../components/Spinner.vue";

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);
const isEdit = computed(() => Boolean(id.value));

const { data: post, isLoading, isError, error } = usePost(id);
const {
  mutate: createMutate,
  isPending: creating,
  isError: createFailed,
  error: createError,
} = useCreatePost();
const {
  mutate: updateMutate,
  isPending: updating,
  isError: updateFailed,
  error: updateError,
} = useUpdatePost();

const saving = computed(() => (isEdit.value ? updating.value : creating.value));
const saveFailed = computed(() => (isEdit.value ? updateFailed.value : createFailed.value));
const saveError = computed(() => (isEdit.value ? updateError.value : createError.value));

const handleSubmit = (data) => {
  if (isEdit.value) {
    updateMutate(
        { id: id.value, data },
        {
          onSuccess: () => {
            toast.success("Post updated");
            router.push(`/posts/${id.value}`);
          },
          onError: (e) => toast.error(e.message),
        }
    );
  } else {
    createMutate(data, {
      onSuccess: (created) => {
        toast.success("Post published");
        router.push(`/posts/${created.id}`);
      },
      onError: (e) => toast.error(e.message),
    });
  }
};
</script>

<template>
  <Spinner v-if="isEdit && isLoading" />
  <ErrorMessage v-else-if="isEdit && isError" :error="error" />

  <div v-else class="animate-fade-up">
    <RouterLink
        :to="isEdit ? `/posts/${id}` : '/'"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-indigo-500"
    >
      <ArrowLeft class="h-4 w-4" /> Cancel
    </RouterLink>
    <h1 class="mb-8 mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
      {{ isEdit ? "Edit post" : "Write a new post" }}
    </h1>

    <div v-if="saveFailed" class="mb-6">
      <ErrorMessage :error="saveError" />
    </div>

    <PostForm
        :initial="post"
        :submitting="saving"
        :submit-label="isEdit ? 'Save changes' : 'Publish post'"
        @submit="handleSubmit"
    />
  </div>
</template>
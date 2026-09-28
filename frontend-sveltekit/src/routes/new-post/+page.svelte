<script>
	import { goto } from '$app/navigation';
	import { createPost } from '$lib/api/posts.js';
	import PostForm from '$lib/components/PostForm.svelte';

	async function handleCreate(data) {
		await createPost(data); // errors are shown inside PostForm
		goto('/');
	}
</script>

<div class="section-head">
	<h2>Write a new post</h2>
</div>

<PostForm onSubmit={handleCreate} submitLabel="Publish" />

<script>
	import { goto } from '$app/navigation';
	import { createPost } from '$lib/api/posts.js';
	import PostForm from '$lib/components/PostForm.svelte';

	async function handleCreate(data) {
		await createPost(data); // errors are shown inside PostForm
		goto('/');
	}
</script>

<header class="hero">
	<div class="hero-inner">
		<a href="/" class="back-link">&larr; Back to journey</a>
		<h1>Share an update</h1>
		<p class="hero-sub">
			What did you build, fix, or learn this time? Add it to your timeline.
		</p>
	</div>
</header>

<main class="wrap narrow">
	<PostForm onSubmit={handleCreate} submitLabel="Publish update" />
</main>

<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getPost, updatePost } from '$lib/api/posts.js';
	import PostForm from '$lib/components/PostForm.svelte';

	const postId = page.params.id;

	let post = $state(null);
	let loading = $state(true);
	let loadError = $state(null);

	onMount(async () => {
		try {
			post = await getPost(postId);
		} catch (err) {
			loadError = err.message || 'Could not load this post. It may have been deleted.';
		} finally {
			loading = false;
		}
	});

	async function handleUpdate(data) {
		await updatePost(postId, data); // errors are shown inside PostForm
		goto(`/posts/${postId}`);
	}
</script>

<header class="hero">
	<div class="hero-inner">
		<a href="/" class="back-link">&larr; Back to journey</a>
		<h1>Edit update</h1>
		<p class="hero-sub">Fix a detail, add what you learned, or tidy up the tags.</p>
	</div>
</header>

<main class="wrap narrow">
	{#if loading}
		<div class="state"><div class="spinner"></div>Loading your post…</div>
	{:else if loadError}
		<div class="state error" role="alert">
			<p>{loadError}</p>
			<a href="/" class="btn ghost">Back to journey</a>
		</div>
	{:else}
		<PostForm initial={post} onSubmit={handleUpdate} submitLabel="Save changes" />
	{/if}
</main>

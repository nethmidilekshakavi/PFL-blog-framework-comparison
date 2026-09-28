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

<div class="section-head">
	<h2>Edit post</h2>
</div>

{#if loading}
	<div class="state"><div class="spinner"></div>Loading…</div>
{:else if loadError}
	<div class="state error">
		<p>⚠ {loadError}</p>
		<a href="/" class="btn btn-ghost" style="margin-top: 14px">← Back home</a>
	</div>
{:else}
	<PostForm initial={post} onSubmit={handleUpdate} submitLabel="Save changes" />
{/if}

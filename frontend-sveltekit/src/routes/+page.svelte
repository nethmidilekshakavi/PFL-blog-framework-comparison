<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getPosts, deletePost } from '$lib/api/posts.js';
	import { formatDate, getAllTags, getLatest } from '$lib/utils/posts.js';
	import PostCard from '$lib/components/PostCard.svelte';
	import TagList from '$lib/components/TagList.svelte';

	let posts = $state([]);
	let loading = $state(true);
	let error = $state(null);

	let postToDelete = $state(null);
	let deleting = $state(false);

	const latest = $derived(getLatest(posts, 3)); // homepage = last three entries
	const topTags = $derived(getAllTags(posts).slice(0, 12));

	async function load() {
		loading = true;
		error = null;
		try {
			posts = await getPosts();
		} catch (err) {
			error = err.message || 'Could not connect to the backend. Check if the API is running.';
		} finally {
			loading = false;
		}
	}

	onMount(load);

	function askDelete(post) {
		postToDelete = post;
	}

	function cancelDelete() {
		postToDelete = null;
	}

	async function confirmDelete() {
		deleting = true;
		try {
			await deletePost(postToDelete.id);
			posts = posts.filter((p) => p.id !== postToDelete.id);
		} catch (err) {
			error = err.message || 'Failed to delete the post';
		} finally {
			deleting = false;
			postToDelete = null;
		}
	}

	function onKey(e) {
		if (e.key === 'Escape' && postToDelete) cancelDelete();
	}
</script>

<svelte:window onkeydown={onKey} />

<header class="hero hero-lg">
	<div class="hero-inner">
		<p class="hero-kicker">Final project</p>
		<h1>Share your final project journey</h1>
		<p class="hero-sub">
			From the first idea to the last commit. Post what you built, what broke, and what you
			learned along the way.
		</p>
		<div class="hero-actions">
			<a href="/new-post" class="cta">Share an update</a>
			{#if !loading && !error}
				<span class="count">
					{latest.length} recent {latest.length === 1 ? 'update' : 'updates'}
				</span>
			{/if}
		</div>
	</div>
</header>

<main class="wrap">
	{#if loading}
		<div class="state"><div class="spinner"></div>Loading your journey…</div>
	{:else if error}
		<div class="state error" role="alert">
			<p>{error}</p>
			<button type="button" class="btn ghost" onclick={load}>Retry</button>
		</div>
	{:else if latest.length === 0}
		<div class="empty">
			<h2>Your journey starts here</h2>
			<p>Write your first update to begin the timeline.</p>
			<a href="/new-post" class="cta">Share an update</a>
		</div>
	{:else}
		<ol class="timeline">
			{#each latest as post, i (post.id)}
				<li class="entry" class:latest={i === 0}>
					<span class="dot" aria-hidden="true"></span>
					<time class="when">{formatDate(post.createdAt)}</time>
					<PostCard {post} onDelete={askDelete} showDate={false} />
				</li>
			{/each}
		</ol>

		<section class="topics">
			<h2>Popular topics</h2>
			<TagList tags={topTags} onTagClick={(tag) => goto(`/posts?tag=${encodeURIComponent(tag)}`)} />
		</section>
	{/if}
</main>

{#if postToDelete}
	<div class="overlay" role="presentation" onclick={cancelDelete}>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="del-title"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<h3 id="del-title">Delete this post?</h3>
			<p>"{postToDelete.title}" will be permanently removed. This can't be undone.</p>
			<div class="modal-actions">
				<button type="button" class="btn ghost" onclick={cancelDelete}>Cancel</button>
				<button type="button" class="btn danger" onclick={confirmDelete} disabled={deleting}>
					{deleting ? 'Deleting…' : 'Delete post'}
				</button>
			</div>
		</div>
	</div>
{/if}

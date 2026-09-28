<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getPosts, deletePost } from '$lib/api/posts.js';
	import { getAllTags, getLatest } from '$lib/utils/posts.js';
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

<section class="hero">
	<h1>Share your <span>Final Year Project</span> journey</h1>
	<p>
		A blog for Software Engineering students to present ideas, document progress and discuss what
		they learned building their final projects.
	</p>
	<div class="hero-actions">
		<a href="/new-post" class="btn btn-primary">✍ Write a post</a>
		<a href="/posts" class="btn btn-ghost">Browse all posts</a>
	</div>
</section>

{#if loading}
	<div class="state"><div class="spinner"></div>Loading posts…</div>
{:else if error}
	<div class="state error">
		<p>⚠ {error}</p>
		<button type="button" class="btn btn-ghost" style="margin-top: 14px" onclick={load}>
			Retry
		</button>
	</div>
{:else}
	<div class="section-head">
		<h2>Latest posts</h2>
		<a href="/posts">View all →</a>
	</div>

	{#if latest.length === 0}
		<div class="state">No posts yet. Be the first to write one!</div>
	{:else}
		<div class="grid">
			{#each latest as post (post.id)}
				<PostCard {post} onDelete={askDelete} />
			{/each}
		</div>
	{/if}

	<div class="section-head">
		<h2>Popular topics</h2>
	</div>
	<TagList tags={topTags} onTagClick={(tag) => goto(`/posts?tag=${encodeURIComponent(tag)}`)} />
{/if}

{#if postToDelete}
	<div class="modal-backdrop" role="presentation" onclick={cancelDelete}>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<h3>Delete this post?</h3>
			<p>“{postToDelete.title}” will be removed permanently.</p>
			<div class="modal-actions">
				<button type="button" class="btn btn-ghost" onclick={cancelDelete}>Cancel</button>
				<button type="button" class="btn btn-danger" onclick={confirmDelete} disabled={deleting}>
					{deleting ? 'Deleting…' : 'Delete'}
				</button>
			</div>
		</div>
	</div>
{/if}

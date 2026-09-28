<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getPost, deletePost } from '$lib/api/posts.js';
	import TagList from '$lib/components/TagList.svelte';
	import { formatDate, readingTime } from '$lib/utils/posts.js';

	let post = $state(null);
	let error = $state(null);
	let deleting = $state(false);

	// Re-load whenever the :id in the URL changes
	$effect(() => {
		const id = page.params.id;
		post = null;
		error = null;
		getPost(id)
			.then((data) => (post = data))
			.catch((err) => (error = err.message || 'Could not load this post.'));
	});

	async function handleDelete() {
		if (!confirm('Delete this post permanently?')) return;
		deleting = true;
		try {
			await deletePost(post.id);
			goto('/posts');
		} catch (err) {
			error = err.message || 'Failed to delete the post';
			deleting = false;
		}
	}
</script>

{#if error}
	<header class="hero">
		<div class="hero-inner">
			<a href="/posts" class="back-link">&larr; Back to posts</a>
			<h1>Post unavailable</h1>
		</div>
	</header>
	<main class="wrap">
		<div class="state error" role="alert">
			<p>{error}</p>
			<a href="/posts" class="btn ghost">Back to posts</a>
		</div>
	</main>
{:else if !post}
	<header class="hero">
		<div class="hero-inner">
			<a href="/posts" class="back-link">&larr; Back to posts</a>
			<h1>Loading…</h1>
		</div>
	</header>
	<main class="wrap">
		<div class="state"><div class="spinner"></div>Loading…</div>
	</main>
{:else}
	<header class="hero">
		<div class="hero-inner">
			<a href="/posts" class="back-link">&larr; Back to posts</a>
			<h1>{post.title}</h1>
			<div class="meta">
				<span>{formatDate(post.createdAt)}</span>
				<span>{readingTime(post.content)} min read</span>
			</div>
		</div>
	</header>

	<main class="wrap">
		<article class="card">
			<div class="article-body">{post.content}</div>
			<TagList
				tags={post.tags}
				onTagClick={(t) => goto(`/posts?tag=${encodeURIComponent(t)}`)}
			/>
			<div class="actions">
				<a href="/edit/{post.id}" class="btn edit">Edit</a>
				<button type="button" class="btn delete" onclick={handleDelete} disabled={deleting}>
					{deleting ? 'Deleting…' : 'Delete'}
				</button>
			</div>
		</article>
	</main>
{/if}

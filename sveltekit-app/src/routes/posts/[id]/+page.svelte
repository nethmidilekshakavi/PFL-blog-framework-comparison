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
	<div class="state error">
		<p>⚠ {error}</p>
		<a href="/posts" class="btn btn-ghost" style="margin-top: 14px">← Back to posts</a>
	</div>
{:else if !post}
	<div class="state"><div class="spinner"></div>Loading…</div>
{:else}
	<article class="article">
		<a href="/posts" style="color: var(--muted)">← Back to posts</a>
		<h1>{post.title}</h1>
		<div class="meta">
			<span>📅 {formatDate(post.createdAt)}</span>
			<span>⏱ {readingTime(post.content)} min read</span>
		</div>
		<div style="margin-top: 16px">
			<TagList
				tags={post.tags}
				onTagClick={(t) => goto(`/posts?tag=${encodeURIComponent(t)}`)}
			/>
		</div>
		<div class="article-body">{post.content}</div>
		<div class="article-actions">
			<a href="/edit/{post.id}" class="btn btn-ghost">✏ Edit</a>
			<button type="button" class="btn btn-danger" onclick={handleDelete} disabled={deleting}>
				{deleting ? 'Deleting…' : '🗑 Delete'}
			</button>
		</div>
	</article>
{/if}

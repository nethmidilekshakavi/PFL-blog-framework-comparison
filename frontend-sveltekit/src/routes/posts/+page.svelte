<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getPosts } from '$lib/api/posts.js';
	import { filterPosts, getAllTags, sortNewest } from '$lib/utils/posts.js';
	import PostCard from '$lib/components/PostCard.svelte';
	import TagList from '$lib/components/TagList.svelte';

	let posts = $state([]);
	let loading = $state(true);
	let error = $state(null);

	// Search + tag filter live in the URL (?q=...&tag=...), same as the React version
	const query = $derived(page.url.searchParams.get('q') ?? '');
	const tag = $derived(page.url.searchParams.get('tag') ?? '');

	const results = $derived(sortNewest(filterPosts(posts, { query, tag })));
	const allTags = $derived(getAllTags(posts));

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

	function update(key, value) {
		const next = new URLSearchParams(page.url.searchParams);
		if (value) next.set(key, value);
		else next.delete(key);
		goto(`?${next}`, { replaceState: true, keepFocus: true, noScroll: true });
	}
</script>

<header class="hero">
	<div class="hero-inner">
		<a href="/" class="back-link">&larr; Back to journey</a>
		<h1>All updates</h1>
		<p class="hero-sub">Search by title or content, or filter by a tag.</p>
	</div>
</header>

<main class="wrap">
	{#if loading}
		<div class="state"><div class="spinner"></div>Loading posts…</div>
	{:else if error}
		<div class="state error" role="alert">
			<p>{error}</p>
			<button type="button" class="btn ghost" onclick={load}>Retry</button>
		</div>
	{:else}
		<section class="panel">
			<div class="toolbar">
				<input
					class="input"
					placeholder="Search title or content…"
					value={query}
					oninput={(e) => update('q', e.currentTarget.value)}
				/>
				{#if tag}
					<button type="button" class="btn ghost" onclick={() => update('tag', '')}>
						Clear tag #{tag} ✕
					</button>
				{/if}
			</div>
			<TagList
				tags={allTags}
				activeTag={tag}
				onTagClick={(t) => update('tag', t === tag ? '' : t)}
			/>
		</section>

		<h2 class="list-head">All posts ({results.length})</h2>

		{#if results.length === 0}
			<div class="state">No posts match your search.</div>
		{:else}
			<div class="stack">
				{#each results as post (post.id)}
					<PostCard {post} />
				{/each}
			</div>
		{/if}
	{/if}
</main>

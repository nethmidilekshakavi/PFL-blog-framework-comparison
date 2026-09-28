<script>
	import TagList from './TagList.svelte';
	import { excerpt, formatDate, readingTime } from '$lib/utils/posts.js';

	let { post, onDelete = null, showDate = true } = $props();
</script>

<article class="card">
	<div class="meta">
		{#if showDate}<span>{formatDate(post.createdAt)}</span>{/if}
		<span>{readingTime(post.content)} min read</span>
	</div>
	<h3><a href="/posts/{post.id}">{post.title}</a></h3>
	<p>{excerpt(post.content)}</p>
	<TagList tags={post.tags} />

	{#if onDelete}
		<div class="actions">
			<a class="btn edit" href="/edit/{post.id}">Edit</a>
			<button type="button" class="btn delete" onclick={() => onDelete(post)}>Delete</button>
		</div>
	{/if}
</article>

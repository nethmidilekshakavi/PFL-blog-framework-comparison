<script>
	let { tags = [], onTagClick = null, activeTag = '' } = $props();
</script>

<div class="tags">
	{#each tags as t (typeof t === 'string' ? t : t.tag)}
		{@const name = typeof t === 'string' ? t : t.tag}
		{@const count = typeof t === 'string' ? null : t.count}
		{#if onTagClick}
			<button
				type="button"
				class="tag"
				class:active={activeTag === name}
				onclick={() => onTagClick(name)}
			>
				#{name}{#if count != null}<small>{count}</small>{/if}
			</button>
		{:else}
			<span class="tag" class:active={activeTag === name}>
				#{name}{#if count != null}<small>{count}</small>{/if}
			</span>
		{/if}
	{/each}
</div>

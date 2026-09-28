<script>
	import TagList from './TagList.svelte';
	import { parseTags } from '$lib/utils/posts.js';

	let { initial = null, onSubmit, submitLabel = 'Publish' } = $props();

	// svelte-ignore state_referenced_locally
	let title = $state(initial?.title ?? '');
	// svelte-ignore state_referenced_locally
	let content = $state(initial?.content ?? '');
	// svelte-ignore state_referenced_locally
	let tagsInput = $state((initial?.tags ?? []).join(', '));

	let errors = $state({});
	let saving = $state(false);
	let submitError = $state('');

	function validate() {
		const e = {};
		if (title.trim().length < 3) e.title = 'Title must be at least 3 characters.';
		if (content.trim().length < 20) e.content = 'Content must be at least 20 characters.';
		return e;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		errors = validate();
		if (Object.keys(errors).length) return;

		saving = true;
		submitError = '';
		try {
			await onSubmit({
				title: title.trim(),
				content: content.trim(),
				tags: parseTags(tagsInput)
			});
		} catch (err) {
			submitError = err.message || 'Something went wrong. Is the backend running?';
			saving = false;
		}
	}
</script>

<form class="card form" onsubmit={handleSubmit} novalidate>
	{#if submitError}<p class="error-box" role="alert">{submitError}</p>{/if}

	<div class="field">
		<label for="title">Title</label>
		<input
			id="title"
			class="input"
			bind:value={title}
			placeholder="e.g. Connected the frontend to the API"
		/>
		{#if errors.title}<p class="error-text">{errors.title}</p>{/if}
	</div>

	<div class="field">
		<label for="content">What happened?</label>
		<textarea
			id="content"
			class="textarea"
			rows="7"
			bind:value={content}
			placeholder="Describe your progress, problems, or lessons..."
		></textarea>
		{#if errors.content}<p class="error-text">{errors.content}</p>{/if}
	</div>

	<div class="field">
		<label for="tags">Tags</label>
		<input
			id="tags"
			class="input"
			bind:value={tagsInput}
			placeholder="e.g. svelte, backend, testing"
		/>
		<p class="hint">Separate tags with commas</p>
		<div style="margin-top: 10px">
			<TagList tags={parseTags(tagsInput)} />
		</div>
	</div>

	<div class="form-actions">
		<a href="/" class="btn ghost">Cancel</a>
		<button class="btn primary" type="submit" disabled={saving}>
			{saving ? 'Saving…' : submitLabel}
		</button>
	</div>
</form>

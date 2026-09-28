<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    // Get the post id from the URL parameter
    const postId = $page.params.id;

    let title = $state('');
    let content = $state('');
    let tagsInput = $state('');
    let loading = $state(true);
    let submitting = $state(false);
    let error = $state(null);

    // Load the existing post data when the page mounts
    onMount(async () => {
        try {
            const res = await fetch(`http://localhost:3001/posts/${postId}`);
            if (!res.ok) throw new Error('Post not found');
            const post = await res.json();

            // Pre-fill the form fields with existing data
            title = post.title;
            content = post.content;
            tagsInput = (post.tags || []).join(', ');
        } catch (err) {
            error = 'Could not load this post. It may have been deleted.';
        } finally {
            loading = false;
        }
    });

    // Send the updated post data to the backend
    async function handleUpdate() {
        if (!title.trim() || !content.trim()) {
            error = 'Title and Content cannot be empty';
            return;
        }

        submitting = true;
        error = null;

        // Convert the comma-separated tags string back into an array
        const tags = tagsInput
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);

        try {
            const res = await fetch(`http://localhost:3001/posts/${postId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, tags })
            });

            if (!res.ok) throw new Error('Update failed');

            // Go back to homepage after a successful update
            goto('/');
        } catch (err) {
            error = 'Failed to update the post. Check if the backend is running.';
        } finally {
            submitting = false;
        }
    }
</script>

<main>
    <a href="/" class="back-link">&larr; Back to Home</a>
    <h1>Edit Post</h1>

    {#if loading}
        <p>Loading...</p>
    {:else}
        {#if error}
            <p class="error">{error}</p>
        {/if}

        <form onsubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <label>
                Title
                <input type="text" bind:value={title} placeholder="Post title..." />
            </label>

            <label>
                Content
                <textarea bind:value={content} rows="6" placeholder="Post content..."></textarea>
            </label>

            <label>
                Tags (comma separated)
                <input type="text" bind:value={tagsInput} placeholder="e.g. tech, react, tutorial" />
            </label>

            <button type="submit" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Post'}
            </button>
        </form>
    {/if}
</main>

<style>
    main {
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem;
        font-family: sans-serif;
    }
    .back-link {
        display: inline-block;
        margin-bottom: 1rem;
        color: #ff3e00;
        text-decoration: none;
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    label {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        font-weight: bold;
    }
    input, textarea {
        font-family: inherit;
        font-size: 1rem;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 6px;
    }
    button {
        background: #2e5c9e;
        color: white;
        border: none;
        padding: 0.7rem;
        border-radius: 6px;
        font-size: 1rem;
        cursor: pointer;
    }
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .error {
        color: red;
    }
</style>
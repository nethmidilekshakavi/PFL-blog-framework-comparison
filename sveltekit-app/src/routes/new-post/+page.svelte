<script>
    import { goto } from '$app/navigation';

    // Reactive state for the form fields and submission status
    let title = $state('');
    let content = $state('');
    let tagsInput = $state('');
    let submitting = $state(false);
    let error = $state(null);

    // Validate and submit the new post to the backend
    async function handleSubmit() {
        if (!title.trim() || !content.trim()) {
            error = 'Title and Content cannot be empty';
            return;
        }

        submitting = true;
        error = null;

        // Convert the comma-separated tags string into a clean array
        const tags = tagsInput
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);

        try {
            const res = await fetch('http://localhost:3001/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    tags,
                    createdAt: new Date().toISOString()
                })
            });

            if (!res.ok) throw new Error('Failed to add the post');

            // Redirect back to the homepage after a successful post
            goto('/');
        } catch (err) {
            error = 'Failed to add the post. Check if the backend is running.';
        } finally {
            submitting = false;
        }
    }
</script>

<main>
    <a href="/" class="back-link">&larr; Back to Home</a>
    <h1>New Post</h1>

    {#if error}
        <p class="error">{error}</p>
    {/if}

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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
            {submitting ? 'Adding...' : 'Add Post'}
        </button>
    </form>
</main>

<style>
    :global(body) {
        background: #f4f6fb;
        margin: 0;
    }
    main {
        max-width: 600px;
        margin: 0 auto;
        padding: 2.5rem 1.5rem;
        font-family: 'Segoe UI', sans-serif;
    }
    .back-link {
        display: inline-block;
        margin-bottom: 1rem;
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
    }
    h1 {
        color: #1a1a2e;
        margin-bottom: 1.5rem;
    }
    form {
        background: white;
        border-radius: 16px;
        padding: 1.8rem;
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }
    label {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        font-weight: 600;
        color: #333;
        font-size: 0.9rem;
    }
    input, textarea {
        font-family: inherit;
        font-size: 1rem;
        padding: 0.6rem 0.8rem;
        border: 1.5px solid #e0e0e0;
        border-radius: 8px;
        transition: border-color 0.15s ease;
    }
    input:focus, textarea:focus {
        outline: none;
        border-color: #667eea;
    }
    button {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 0.8rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
    }
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .error {
        color: #d9480f;
        background: #fdeeee;
        padding: 0.6rem 1rem;
        border-radius: 8px;
    }
</style>
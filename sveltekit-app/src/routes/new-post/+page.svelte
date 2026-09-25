<script>
    import { goto } from '$app/navigation';

    let title = $state('');
    let content = $state('');
    let tagsInput = $state('');
    let submitting = $state(false);
    let error = $state(null);

    async function handleSubmit() {
        if (!title.trim() || !content.trim()) {
            error = 'Title සහ Content දෙකම ලියන්න ඕන';
            return;
        }

        submitting = true;
        error = null;

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

            if (!res.ok) throw new Error('Post add කරන්න බැරි උනා');

            goto('/');
        } catch (err) {
            error = 'Post add කරන්න බැරි උනා. Backend run වෙනවද check කරන්න.';
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
        background: #ff3e00;
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
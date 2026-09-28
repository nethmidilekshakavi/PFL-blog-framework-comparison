<script>
    import { goto } from '$app/navigation';

    let title = $state('');
    let content = $state('');
    let tagsInput = $state('');
    let submitting = $state(false);
    let error = $state(null);

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
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

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

            goto('/');
        } catch (err) {
            error = 'Failed to add the post. Check if the backend is running.';
        } finally {
            submitting = false;
        }
    }
</script>

<div class="page">
    <header class="hero">
        <div class="hero-inner">
            <a href="/" class="back-link">&larr; Back to journey</a>
            <h1>Share an update</h1>
            <p class="hero-sub">
                What did you build, fix, or learn this time? Add it to your timeline.
            </p>
        </div>
    </header>

    <main class="wrap">
        <form
                class="card"
                onsubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
        >
            {#if error}
                <p class="error" role="alert">{error}</p>
            {/if}

            <label>
                Title
                <input type="text" bind:value={title} placeholder="e.g. Connected the frontend to the API" />
            </label>

            <label>
                What happened?
                <textarea bind:value={content} rows="7" placeholder="Describe your progress, problems, or lessons..."></textarea>
            </label>

            <label>
                Tags
                <input type="text" bind:value={tagsInput} placeholder="e.g. svelte, backend, testing" />
                <span class="hint">Separate tags with commas</span>
            </label>

            <div class="form-actions">
                <a href="/" class="btn ghost">Cancel</a>
                <button type="submit" class="btn primary" disabled={submitting}>
                    {submitting ? 'Publishing…' : 'Publish update'}
                </button>
            </div>
        </form>
    </main>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap');

    :global(:root) {
        --mist: #eef2ee;
        --paper: #fbfcfa;
        --forest: #12312a;
        --forest-soft: #1d4a40;
        --moss: #3e8f6a;
        --sun: #f2b233;
        --ink: #17231f;
        --muted: #5b6b64;
        --line: #cfdad3;
        --danger: #c2413b;
    }

    :global(body) {
        margin: 0;
        background: var(--mist);
        color: var(--ink);
        font-family: 'Instrument Sans', system-ui, sans-serif;
        line-height: 1.6;
    }

    a:focus-visible,
    button:focus-visible,
    input:focus-visible,
    textarea:focus-visible {
        outline: 3px solid var(--sun);
        outline-offset: 2px;
    }

    /* ---------- Hero ---------- */
    .hero {
        background: var(--forest);
        color: #fff;
        padding: 3.5rem 1.5rem 6rem;
        position: relative;
        overflow: hidden;
    }
    .hero::before {
        content: '';
        position: absolute;
        width: 420px;
        height: 420px;
        right: -120px;
        top: -160px;
        border: 1.5px solid rgba(255, 255, 255, 0.08);
        border-radius: 50%;
        box-shadow: 0 0 0 40px rgba(255, 255, 255, 0.03), 0 0 0 80px rgba(255, 255, 255, 0.02);
    }
    .hero-inner {
        max-width: 640px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
    }
    .back-link {
        display: inline-block;
        color: var(--sun);
        text-decoration: none;
        font-weight: 600;
        margin-bottom: 1.4rem;
    }
    .back-link:hover {
        text-decoration: underline;
    }
    h1 {
        font-family: 'Bricolage Grotesque', sans-serif;
        font-weight: 800;
        font-size: clamp(2rem, 5vw, 3rem);
        line-height: 1.05;
        letter-spacing: -0.02em;
        margin: 0 0 0.8rem;
    }
    .hero-sub {
        color: #c9dcd3;
        font-size: 1.05rem;
        max-width: 48ch;
        margin: 0;
    }

    /* ---------- Form ---------- */
    .wrap {
        max-width: 640px;
        margin: -3rem auto 0;
        padding: 0 1.5rem 4rem;
        position: relative;
        z-index: 2;
    }
    .card {
        background: var(--paper);
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 1.8rem;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        box-shadow: 0 10px 30px -18px rgba(18, 49, 42, 0.35);
    }
    label {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        font-weight: 600;
        color: var(--forest);
        font-size: 0.92rem;
    }
    input,
    textarea {
        font-family: inherit;
        font-size: 1rem;
        color: var(--ink);
        padding: 0.7rem 0.9rem;
        background: #fff;
        border: 1.5px solid var(--line);
        border-radius: 10px;
        transition: border-color 0.15s ease;
        resize: vertical;
    }
    input:focus,
    textarea:focus {
        border-color: var(--moss);
    }
    input::placeholder,
    textarea::placeholder {
        color: #94a39b;
    }
    .hint {
        font-weight: 400;
        font-size: 0.8rem;
        color: var(--muted);
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 0.7rem;
        padding-top: 1.1rem;
        border-top: 1px solid var(--line);
    }
    .btn {
        font: inherit;
        font-size: 0.95rem;
        font-weight: 600;
        padding: 0.65rem 1.4rem;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        text-decoration: none;
        transition: background 0.15s ease, transform 0.15s ease;
    }
    .btn.primary {
        background: var(--sun);
        color: var(--forest);
    }
    .btn.primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(242, 178, 51, 0.35);
    }
    .btn.primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .btn.ghost {
        background: #e6ece8;
        color: var(--ink);
    }
    .btn.ghost:hover {
        background: #dae3dd;
    }

    .error {
        margin: 0;
        color: var(--danger);
        background: #fbeceb;
        border: 1px solid #e4b9b6;
        padding: 0.7rem 1rem;
        border-radius: 10px;
        font-size: 0.92rem;
    }

    @media (max-width: 520px) {
        .hero {
            padding: 2.5rem 1.2rem 5.5rem;
        }
        .card {
            padding: 1.3rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .btn {
            transition: none;
        }
    }
</style>
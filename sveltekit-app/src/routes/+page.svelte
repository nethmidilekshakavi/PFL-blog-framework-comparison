<script>
  import { onMount } from 'svelte';

  let posts = $state([]);
  let loading = $state(true);
  let error = $state(null);

  let showConfirm = $state(false);
  let postToDelete = $state(null);

  onMount(async () => {
    try {
      const res = await fetch('http://localhost:3001/posts');
      const data = await res.json();

      // Newest first, keep only the latest 3
      posts = data
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3);
    } catch (err) {
      error = 'Could not connect to the backend. Check if json-server is running.';
    } finally {
      loading = false;
    }
  });

  function formatDate(value) {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function askDelete(post) {
    postToDelete = post;
    showConfirm = true;
  }

  function cancelDelete() {
    showConfirm = false;
    postToDelete = null;
  }

  async function confirmDelete() {
    try {
      await fetch(`http://localhost:3001/posts/${postToDelete.id}`, { method: 'DELETE' });
      posts = posts.filter((p) => p.id !== postToDelete.id);
    } catch (err) {
      alert('Failed to delete the post');
    } finally {
      showConfirm = false;
      postToDelete = null;
    }
  }

  function onKey(e) {
    if (e.key === 'Escape' && showConfirm) cancelDelete();
  }
</script>

<svelte:window onkeydown={onKey} />

<div class="page">
  <!-- Hero -->
  <header class="hero">
    <div class="hero-inner">
      <p class="hero-kicker">Final project</p>
      <h1>Share your final project journey</h1>
      <p class="hero-sub">
        From the first idea to the last commit. Post what you built, what broke,
        and what you learned along the way.
      </p>
      <div class="hero-actions">
        <a href="/new-post" class="cta">Share an update</a>
        {#if !loading && !error}
          <span class="count">{posts.length} recent {posts.length === 1 ? 'update' : 'updates'}</span>
        {/if}
      </div>
    </div>
  </header>

  <!-- Journey -->
  <main class="journey">
    {#if loading}
      <p class="state">Loading your journey…</p>
    {:else if error}
      <p class="state error">{error}</p>
    {:else if posts.length === 0}
      <div class="empty">
        <h2>Your journey starts here</h2>
        <p>Write your first update to begin the timeline.</p>
        <a href="/new-post" class="cta">Share an update</a>
      </div>
    {:else}
      <ol class="timeline">
        {#each posts as post, i}
          <li class="entry" class:latest={i === 0}>
            <span class="dot" aria-hidden="true"></span>
            <time class="when">{formatDate(post.createdAt)}</time>

            <article class="card">
              <h2>{post.title}</h2>
              <p>{post.content}</p>

              {#if post.tags && post.tags.length > 0}
                <div class="tags">
                  {#each post.tags as tag}
                    <span class="tag">#{tag}</span>
                  {/each}
                </div>
              {/if}

              <div class="actions">
                <a href="/edit/{post.id}" class="btn edit">Edit</a>
                <button onclick={() => askDelete(post)} class="btn delete">Delete</button>
              </div>
            </article>
          </li>
        {/each}
      </ol>
    {/if}
  </main>
</div>

<!-- Delete confirmation -->
{#if showConfirm}
  <div class="overlay" role="presentation" onclick={cancelDelete}>
    <div
            class="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="del-title"
            tabindex="-1"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
    >
      <h3 id="del-title">Delete this post?</h3>
      <p>"{postToDelete?.title}" will be permanently removed. This can't be undone.</p>
      <div class="modal-actions">
        <button class="btn ghost" onclick={cancelDelete}>Cancel</button>
        <button class="btn danger" onclick={confirmDelete}>Delete post</button>
      </div>
    </div>
  </div>
{/if}

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
  button:focus-visible {
    outline: 3px solid var(--sun);
    outline-offset: 2px;
  }

  /* ---------- Hero ---------- */
  .hero {
    background: var(--forest);
    color: #fff;
    padding: 5rem 1.5rem 7rem;
    position: relative;
    overflow: hidden;
  }
  /* soft contour rings, echoing a trail map */
  .hero::before,
  .hero::after {
    content: '';
    position: absolute;
    border: 1.5px solid rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }
  .hero::before {
    width: 520px;
    height: 520px;
    right: -140px;
    top: -180px;
    box-shadow: 0 0 0 46px rgba(255, 255, 255, 0.03), 0 0 0 92px rgba(255, 255, 255, 0.02);
  }
  .hero::after {
    width: 260px;
    height: 260px;
    left: -90px;
    bottom: -120px;
  }

  .hero-inner {
    max-width: 760px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .hero-kicker {
    margin: 0 0 1rem;
    color: var(--sun);
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  h1 {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-weight: 800;
    font-size: clamp(2.4rem, 6vw, 4rem);
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 0 0 1.2rem;
    max-width: 14ch;
  }
  .hero-sub {
    font-size: 1.1rem;
    color: #c9dcd3;
    max-width: 52ch;
    margin: 0 0 2rem;
  }
  .hero-actions {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    flex-wrap: wrap;
  }
  .cta {
    background: var(--sun);
    color: var(--forest);
    padding: 0.85rem 1.6rem;
    border-radius: 999px;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(242, 178, 51, 0.35);
  }
  .count {
    color: #a9c4b8;
    font-size: 0.95rem;
  }

  /* ---------- Journey / timeline ---------- */
  .journey {
    max-width: 760px;
    margin: -3.5rem auto 0;
    padding: 0 1.5rem 5rem;
    position: relative;
    z-index: 2;
  }

  .timeline {
    list-style: none;
    margin: 0;
    padding: 0 0 0 2.2rem;
    position: relative;
  }
  .timeline::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 1.5rem;
    bottom: 1rem;
    width: 2px;
    background: repeating-linear-gradient(
            to bottom,
            var(--moss) 0 8px,
            transparent 8px 16px
    );
  }

  .entry {
    position: relative;
    margin-bottom: 2rem;
  }
  .dot {
    position: absolute;
    left: -2.2rem;
    top: 1.55rem;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--paper);
    border: 3px solid var(--moss);
  }
  .entry.latest .dot {
    background: var(--sun);
    border-color: var(--forest);
    box-shadow: 0 0 0 5px rgba(242, 178, 51, 0.3);
  }

  .when {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--forest-soft);
    margin: 0 0 0.5rem 0.2rem;
  }
  .entry:first-child .when {
    color: #dfeae4;
  }

  .card {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 18px;
    padding: 1.5rem 1.7rem;
    box-shadow: 0 10px 30px -18px rgba(18, 49, 42, 0.35);
  }
  .card h2 {
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 1.45rem;
    line-height: 1.2;
    letter-spacing: -0.01em;
    margin: 0 0 0.6rem;
    color: var(--forest);
  }
  .card p {
    margin: 0 0 1rem;
    color: #34443d;
    max-width: 62ch;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 1.1rem;
  }
  .tag {
    background: #e2efe8;
    color: var(--forest-soft);
    padding: 3px 11px;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .actions {
    display: flex;
    gap: 0.6rem;
    padding-top: 1rem;
    border-top: 1px solid var(--line);
  }

  .btn {
    font: inherit;
    font-size: 0.88rem;
    font-weight: 600;
    padding: 0.5rem 1.1rem;
    border-radius: 999px;
    border: 1.5px solid transparent;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s ease, color 0.15s ease;
  }
  .btn.edit {
    background: var(--forest);
    color: #fff;
  }
  .btn.edit:hover {
    background: var(--forest-soft);
  }
  .btn.delete {
    background: transparent;
    color: var(--danger);
    border-color: #e4b9b6;
  }
  .btn.delete:hover {
    background: var(--danger);
    color: #fff;
    border-color: var(--danger);
  }

  /* ---------- States ---------- */
  .state {
    background: var(--paper);
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 1.2rem 1.4rem;
    color: var(--muted);
  }
  .state.error {
    color: var(--danger);
    border-color: #e4b9b6;
  }
  .empty {
    background: var(--paper);
    border: 1px dashed var(--moss);
    border-radius: 18px;
    padding: 2.5rem 1.5rem;
    text-align: center;
  }
  .empty h2 {
    font-family: 'Bricolage Grotesque', sans-serif;
    color: var(--forest);
    margin: 0 0 0.4rem;
  }
  .empty p {
    color: var(--muted);
    margin: 0 0 1.4rem;
  }

  /* ---------- Modal ---------- */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(18, 49, 42, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 100;
  }
  .modal {
    background: var(--paper);
    border-radius: 18px;
    padding: 1.8rem;
    max-width: 380px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  }
  .modal h3 {
    font-family: 'Bricolage Grotesque', sans-serif;
    margin: 0 0 0.5rem;
    color: var(--forest);
    font-size: 1.3rem;
  }
  .modal p {
    margin: 0 0 1.5rem;
    color: var(--muted);
    font-size: 0.95rem;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.6rem;
  }
  .btn.ghost {
    background: #e6ece8;
    color: var(--ink);
  }
  .btn.danger {
    background: var(--danger);
    color: #fff;
  }

  @media (max-width: 520px) {
    .hero {
      padding: 3.5rem 1.2rem 6rem;
    }
    .card {
      padding: 1.2rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cta {
      transition: none;
    }
  }
</style>
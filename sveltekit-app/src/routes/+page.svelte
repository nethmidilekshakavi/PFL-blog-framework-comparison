<script>
  import { onMount } from 'svelte';

  // Reactive state for the posts list, loading state, and error message
  let posts = $state([]);
  let loading = $state(true);
  let error = $state(null);

  // State for the custom delete confirmation popup
  let showConfirm = $state(false);
  let postToDelete = $state(null);

  // Fetch posts from the backend when the component mounts
  onMount(async () => {
    try {
      const res = await fetch('http://localhost:3001/posts');
      const data = await res.json();

      // Sort posts by newest first, then keep only the latest 3
      posts = data
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3);
    } catch (err) {
      error = 'Could not connect to the backend. Check if json-server is running.';
    } finally {
      loading = false;
    }
  });

  // Open the confirmation popup for a specific post
  function askDelete(post) {
    postToDelete = post;
    showConfirm = true;
  }

  // Cancel the delete action and close the popup
  function cancelDelete() {
    showConfirm = false;
    postToDelete = null;
  }

  // Actually delete the post after confirmation
  async function confirmDelete() {
    try {
      await fetch(`http://localhost:3001/posts/${postToDelete.id}`, { method: 'DELETE' });
      posts = posts.filter(p => p.id !== postToDelete.id);
    } catch (err) {
      alert('Failed to delete the post');
    } finally {
      showConfirm = false;
      postToDelete = null;
    }
  }
</script>

<div class="app-layout">
  <!-- Sidebar navigation -->
  <aside class="sidebar">
    <div class="logo">📝 MyBlog</div>
    <nav>
      <a href="/" class="nav-link active">🏠 Home</a>
      <a href="/new-post" class="nav-link">➕ New Post</a>
    </nav>
  </aside>

  <!-- Main content area -->
  <main>
    <div class="welcome-banner">
      <div class="welcome-text">
        <h1>👋 Hey there!</h1>
        <p>Welcome back to your blog space</p>
      </div>
      <div class="welcome-emoji">📝✨</div>
    </div>

    <h2>Latest Posts</h2>

    {#if loading}
      <p>Loading...</p>
    {:else if error}
      <p style="color:red">{error}</p>
    {:else if posts.length === 0}
      <p>No posts yet. Add your first post!</p>
    {:else}
      <div class="bento-grid">
        {#each posts as post}
          <div class="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            {#if post.tags && post.tags.length > 0}
              <div class="tags">
                {#each post.tags as tag}
                  <span class="tag">#{tag}</span>
                {/each}
              </div>
            {/if}

            <div class="actions">
              <a href="/edit/{post.id}" class="edit-btn">✏️ Edit</a>
              <button onclick={() => askDelete(post)} class="delete-btn">🗑️ Delete</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </main>
</div>

<!-- Custom delete confirmation popup -->
{#if showConfirm}
  <div class="modal-overlay" onclick={cancelDelete}>
    <div class="modal-box" onclick={(e) => e.stopPropagation()}>
      <div class="modal-icon">🗑️</div>
      <h3>Delete this post?</h3>
      <p>"{postToDelete?.title}" will be permanently removed. This can't be undone.</p>
      <div class="modal-actions">
        <button class="cancel-btn" onclick={cancelDelete}>Cancel</button>
        <button class="confirm-delete-btn" onclick={confirmDelete}>Yes, Delete</button>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(body) {
    background: #f4f6fb;
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
  }

  .app-layout {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 220px;
    background: linear-gradient(180deg, #667eea, #764ba2);
    color: white;
    padding: 1.5rem 1rem;
    flex-shrink: 0;
  }
  .logo {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 2rem;
  }
  nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .nav-link {
    color: white;
    text-decoration: none;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    font-weight: 500;
    opacity: 0.85;
  }
  .nav-link:hover, .nav-link.active {
    background: rgba(255, 255, 255, 0.15);
    opacity: 1;
  }

  main {
    flex: 1;
    padding: 2.5rem 2rem;
  }

  .welcome-banner {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
  .welcome-text h1 {
    color: white;
    margin: 0 0 0.3rem 0;
    font-size: 1.8rem;
  }
  .welcome-text p {
    margin: 0;
    opacity: 0.9;
  }
  .welcome-emoji {
    font-size: 3rem;
  }

  h2 {
    font-size: 1.3rem;
    color: #444;
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.5rem;
  }

  .bento-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }

  .post-card {
    background: white;
    border: 1px solid #eaeaea;
    border-radius: 12px;
    padding: 1.3rem 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: box-shadow 0.2s ease;
  }
  .post-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
  .post-card h3 {
    margin: 0 0 0.5rem 0;
    color: #1a1a2e;
    font-size: 1.2rem;
  }
  .post-card p {
    color: #555;
    line-height: 1.5;
    margin-bottom: 0.8rem;
  }

  .tags {
    margin-bottom: 0.8rem;
  }
  .tag {
    display: inline-block;
    background: #eef2ff;
    color: #3b4ba8;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.78rem;
    margin-right: 6px;
    font-weight: 500;
  }

  /* Friendlier, more prominent action buttons */
  .actions {
    display: flex;
    gap: 0.6rem;
    margin-top: 0.8rem;
  }
  .edit-btn, .delete-btn {
    padding: 7px 16px;
    border-radius: 20px;
    font-size: 0.85rem;
    text-decoration: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .edit-btn:hover, .delete-btn:hover {
    transform: translateY(-2px);
  }
  .edit-btn {
    background: #667eea;
    color: white;
    box-shadow: 0 3px 8px rgba(102, 126, 234, 0.3);
  }
  .delete-btn {
    background: #ff6b6b;
    color: white;
    box-shadow: 0 3px 8px rgba(255, 107, 107, 0.3);
  }

  /* Confirmation popup overlay and box */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26, 26, 46, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }
  .modal-box {
    background: white;
    border-radius: 18px;
    padding: 2rem;
    max-width: 360px;
    text-align: center;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  }
  .modal-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  .modal-box h3 {
    margin: 0 0 0.6rem 0;
    color: #1a1a2e;
  }
  .modal-box p {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    line-height: 1.4;
  }
  .modal-actions {
    display: flex;
    gap: 0.7rem;
    justify-content: center;
  }
  .cancel-btn, .confirm-delete-btn {
    padding: 0.6rem 1.3rem;
    border-radius: 10px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9rem;
  }
  .cancel-btn {
    background: #eee;
    color: #444;
  }
  .confirm-delete-btn {
    background: #ff6b6b;
    color: white;
  }
</style>
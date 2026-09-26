<script>
  import { onMount } from 'svelte';

  // Reactive state for the posts list, loading state, and error message
  let posts = $state([]);
  let loading = $state(true);
  let error = $state(null);

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

  // Delete a post by ID and remove it from the local list without refetching
  async function deletePost(id) {
    if (!confirm('Delete this post?')) return;
    try {
      await fetch(`http://localhost:3001/posts/${id}`, { method: 'DELETE' });
      posts = posts.filter(p => p.id !== id);
    } catch (err) {
      alert('Failed to delete the post');
    }
  }
</script>

<main>
  <h1>📝 SvelteKit Blog</h1>
  <a href="/new-post" class="new-post-btn">+ New Post</a>

  <h2>Latest Posts</h2>

  {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p style="color:red">{error}</p>
  {:else if posts.length === 0}
    <!-- Empty state when there are no posts yet -->
    <p>No posts yet. Add your first post!</p>
  {:else}
    {#each posts as post}
      <div class="post-card">
        <h3>{post.title}</h3>
        <p>{post.content}</p>

        {#if post.tags && post.tags.length > 0}
          <!-- Render tags only if the post has any -->
          <div class="tags">
            {#each post.tags as tag}
              <span class="tag">#{tag}</span>
            {/each}
          </div>
        {/if}

        <!-- Edit navigates to the dynamic edit page; Delete removes the post -->
        <div class="actions">
          <a href="/edit/{post.id}" class="edit-btn">Edit</a>
          <button onclick={() => deletePost(post.id)} class="delete-btn">Delete</button>
        </div>
      </div>
    {/each}
  {/if}
</main>

<style>
  main {
    max-width: 700px;
    margin: 0 auto;
    padding: 2rem;
    font-family: sans-serif;
  }

  /* "New Post" call-to-action button */
  .new-post-btn {
    display: inline-block;
    background: #ff3e00;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    text-decoration: none;
    margin-bottom: 1.5rem;
  }

  /* Card wrapper for each post */
  .post-card {
    border: 1px solid #444;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  /* Tag pill styling */
  .tag {
    background: #eee;
    color: #333;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.8rem;
    margin-right: 4px;
  }

  /* Container for the Edit/Delete action buttons */
  .actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .edit-btn, .delete-btn {
    padding: 4px 12px;
    border-radius: 5px;
    font-size: 0.85rem;
    text-decoration: none;
    border: none;
    cursor: pointer;
  }
  .edit-btn {
    background: #2e5c9e;
    color: white;
  }
  .delete-btn {
    background: #d9480f;
    color: white;
  }
</style>
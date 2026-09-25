<script>
  import { onMount } from 'svelte';

  let posts = $state([]);
  let loading = $state(true);
  let error = $state(null);

  onMount(async () => {
    try {
      const res = await fetch('http://localhost:3001/posts');
      const data = await res.json();
      posts = data
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3);
    } catch (err) {
      error = 'Backend එකට connect වෙන්න බෑ. json-server run වෙනවද check කරන්න.';
    } finally {
      loading = false;
    }
  });
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
    <p>Posts නෑ තාම. පලවෙනි post එක add කරන්න!</p>
  {:else}
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
  .new-post-btn {
    display: inline-block;
    background: #ff3e00;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    text-decoration: none;
    margin-bottom: 1.5rem;
  }
  .post-card {
    border: 1px solid #444;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  .tag {
    background: #eee;
    color: #333;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.8rem;
    margin-right: 4px;
  }
</style>
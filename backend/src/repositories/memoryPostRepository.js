/** In-memory repository with the same interface as the SQLite one. Used for fast unit tests. */
export function createMemoryPostRepository(initial = []) {
  const posts = initial.map((p) => ({ ...p, tags: [...(p.tags ?? [])] }));

  const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

  return {
    list({ query = "", tag = "", limit } = {}) {
      const q = query.toLowerCase();
      let result = posts
        .filter((p) => !tag || p.tags.includes(tag))
        .filter((p) => !q || p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q))
        .sort(newestFirst);
      if (limit) result = result.slice(0, limit);
      return result.map((p) => ({ ...p }));
    },
    get(id) {
      const p = posts.find((x) => x.id === id);
      return p ? { ...p } : null;
    },
    create(post) {
      posts.push({ ...post });
      return { ...post };
    },
    update(id, changes) {
      const i = posts.findIndex((p) => p.id === id);
      if (i === -1) return null;
      posts[i] = { ...posts[i], ...changes };
      return { ...posts[i] };
    },
    remove(id) {
      const i = posts.findIndex((p) => p.id === id);
      if (i === -1) return null;
      const [removed] = posts.splice(i, 1);
      return removed;
    },
    count() {
      return posts.length;
    },
  };
}

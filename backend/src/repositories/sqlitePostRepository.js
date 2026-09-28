/**
 * Data-access layer. Only this file knows SQL.
 * The service depends on the *shape* of this object (list/get/create/update/remove),
 * so it can be swapped for the in-memory repository in unit tests.
 */
export function createSqlitePostRepository(db) {
  const insertPost = db.prepare(
    "INSERT INTO posts (id, title, content, created_at, updated_at) VALUES (@id, @title, @content, @createdAt, @updatedAt)"
  );
  const updatePost = db.prepare(
    "UPDATE posts SET title = @title, content = @content, updated_at = @updatedAt WHERE id = @id"
  );
  const deletePost = db.prepare("DELETE FROM posts WHERE id = ?");
  const selectPost = db.prepare("SELECT * FROM posts WHERE id = ?");
  const insertTag = db.prepare("INSERT OR IGNORE INTO post_tags (post_id, tag) VALUES (?, ?)");
  const deleteTags = db.prepare("DELETE FROM post_tags WHERE post_id = ?");
  const selectTags = db.prepare("SELECT tag FROM post_tags WHERE post_id = ? ORDER BY rowid");

  const toPost = (row) =>
    row && {
      id: row.id,
      title: row.title,
      content: row.content,
      tags: selectTags.all(row.id).map((t) => t.tag),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

  const saveTags = (id, tags) => {
    deleteTags.run(id);
    for (const tag of tags) insertTag.run(id, tag);
  };

  return {
    list({ query = "", tag = "", limit } = {}) {
      const where = [];
      const params = {};
      if (query) {
        where.push("(LOWER(title) LIKE @q ESCAPE '\\' OR LOWER(content) LIKE @q ESCAPE '\\')");
        params.q = `%${query.toLowerCase().replace(/[\\%_]/g, "\\$&")}%`;
      }
      if (tag) {
        where.push("EXISTS (SELECT 1 FROM post_tags pt WHERE pt.post_id = posts.id AND pt.tag = @tag)");
        params.tag = tag;
      }
      let sql = "SELECT * FROM posts";
      if (where.length) sql += ` WHERE ${where.join(" AND ")}`;
      sql += " ORDER BY created_at DESC, rowid DESC";
      if (limit) {
        sql += " LIMIT @limit";
        params.limit = limit;
      }
      return db.prepare(sql).all(params).map(toPost);
    },

    get(id) {
      return toPost(selectPost.get(id)) ?? null;
    },

    create(post) {
      db.transaction(() => {
        insertPost.run(post);
        saveTags(post.id, post.tags);
      })();
      return this.get(post.id);
    },

    update(id, changes) {
      const existing = this.get(id);
      if (!existing) return null;
      const next = { ...existing, ...changes };
      db.transaction(() => {
        updatePost.run({ id, title: next.title, content: next.content, updatedAt: next.updatedAt });
        if (changes.tags) saveTags(id, changes.tags);
      })();
      return this.get(id);
    },

    remove(id) {
      const existing = this.get(id);
      if (!existing) return null;
      deletePost.run(id);
      return existing;
    },

    count() {
      return db.prepare("SELECT COUNT(*) AS n FROM posts").get().n;
    },
  };
}

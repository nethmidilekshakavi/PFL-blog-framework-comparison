import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { normalizeTags } from "../services/postService.js";

const SEED_FILE = fileURLToPath(new URL("../../seed-data.json", import.meta.url));

/** Imports the posts from the old json-server db.json (keeps ids and createdAt). Only runs on an empty DB. */
export function seedIfEmpty(repository, file = SEED_FILE) {
  if (repository.count() > 0 || !fs.existsSync(file)) return 0;
  const { posts = [] } = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const p of posts) {
    repository.create({
      id: p.id,
      title: p.title,
      content: p.content.trim(),
      tags: normalizeTags(p.tags),
      createdAt: p.createdAt,
      updatedAt: p.createdAt,
    });
  }
  return posts.length;
}

// `npm run seed` -> seeds the configured DB directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { config } = await import("../config.js");
  const { openDatabase } = await import("./database.js");
  const { createSqlitePostRepository } = await import("../repositories/sqlitePostRepository.js");
  const db = openDatabase(config.dbFile);
  const n = seedIfEmpty(createSqlitePostRepository(db));
  console.log(n ? `Seeded ${n} posts` : "Database already has posts, nothing to seed");
  db.close();
}

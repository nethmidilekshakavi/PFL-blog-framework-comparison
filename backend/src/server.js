import { config } from "./config.js";
import { openDatabase } from "./db/database.js";
import { createSqlitePostRepository } from "./repositories/sqlitePostRepository.js";
import { createPostService } from "./services/postService.js";
import { seedIfEmpty } from "./db/seed.js";
import { createApp } from "./app.js";

const db = openDatabase(config.dbFile);
const repository = createSqlitePostRepository(db);
const postService = createPostService({ repository });

const seeded = seedIfEmpty(repository);
if (seeded) console.log(`Seeded ${seeded} posts from seed-data.json`);

const app = createApp({ postService, corsOrigins: config.corsOrigins });
const server = app.listen(config.port, () => {
  console.log(`Blog API running on http://localhost:${config.port}  (db: ${config.dbFile})`);
});

const shutdown = () => {
  server.close(() => {
    db.close();
    process.exit(0);
  });
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

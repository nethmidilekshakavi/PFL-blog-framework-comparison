# Blog Backend (Express + SQLite)

REST API for the PFL blog framework comparison. It keeps the **same contract as the old json-server backend**
(`http://localhost:3001/posts`, string ids, `tags` array, `createdAt`), so the React and Vue frontends work
without changes. Extra query params (`q`, `tag`, `limit`) are optional.

## Run
```bash
npm install
npm start          # http://localhost:3001  (creates data/blog.db and seeds it from seed-data.json on first run)
npm run dev        # auto-restart on change
npm test           # 28 tests (unit + API integration)
npm run test:coverage
```
Config via environment variables (see `.env.example`): `PORT`, `DB_FILE`, `CORS_ORIGINS`.

## Endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/posts` | newest first. Optional `?q=text&tag=react&limit=3` |
| GET | `/posts/:id` | 404 `{ "error": "Post not found" }` |
| POST | `/posts` | body `{ title, content, tags[], createdAt? }` -> 201 |
| PATCH | `/posts/:id` | partial update (tags are replaced) |
| DELETE | `/posts/:id` | 200 + deleted post |
| GET | `/health` | `{ "status": "ok" }` |

Validation errors -> 400 `{ "error": "Validation failed", "details": { "title": "..." } }`.
Rules: title 3-100 chars, content 20-20000 chars, max 10 tags (max 30 chars each; trimmed, lowercased, de-duplicated).

## Architecture (layers)
```
routes -> controllers -> services -> repositories -> SQLite
                          |
                    validation + business rules
```
- `src/routes`, `src/controllers`: HTTP only
- `src/services/postService.js`: validation and rules; repository, clock and id generator are **injected**
- `src/repositories`: `sqlitePostRepository` (SQL lives only here) and `memoryPostRepository` (same interface, for unit tests)
- `src/db`: schema (`posts`, `post_tags` with FK cascade), seeding from the old `db.json`
- `src/app.js`: `createApp({ postService })` factory, used by both the server and the tests

## Testing approach
- **Unit tests** (`tests/postService.test.js`): service + in-memory repository + fixed clock -> fast, deterministic.
- **Integration tests** (`tests/posts.api.test.js`): supertest against the real Express app and an in-memory SQLite DB.
- Not covered: `server.js` start-up, CORS configuration, concurrency and load.

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { openDatabase } from "../src/db/database.js";
import { createSqlitePostRepository } from "../src/repositories/sqlitePostRepository.js";
import { createPostService } from "../src/services/postService.js";
import { seedIfEmpty } from "../src/db/seed.js";

// Integration tests: real Express app + real SQLite (in memory), no mocks.
const body = { title: "Express API test", content: "This post is long enough to be valid.", tags: ["Node", "api"] };

let db, app, repository;

beforeEach(() => {
  db = openDatabase(":memory:");
  repository = createSqlitePostRepository(db);
  app = createApp({ postService: createPostService({ repository }) });
});
afterEach(() => db.close());

describe("POST /posts", () => {
  it("creates a post (201) with normalised tags", async () => {
    const res = await request(app).post("/posts").send(body);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: body.title, tags: ["node", "api"] });
    expect(res.body.id).toBeTruthy();
  });
  it("returns 400 with field details for invalid data", async () => {
    const res = await request(app).post("/posts").send({ title: "a" });
    expect(res.status).toBe(400);
    expect(res.body.details).toHaveProperty("title");
    expect(res.body.details).toHaveProperty("content");
  });
  it("returns 400 for malformed JSON", async () => {
    const res = await request(app).post("/posts").set("Content-Type", "application/json").send("{bad");
    expect(res.status).toBe(400);
  });
});

describe("GET /posts", () => {
  beforeEach(async () => {
    await request(app).post("/posts").send({ ...body, title: "First", createdAt: "2026-09-01T00:00:00Z" });
    await request(app).post("/posts").send({ ...body, title: "Second", tags: ["svelte"], createdAt: "2026-09-02T00:00:00Z" });
    await request(app).post("/posts").send({ ...body, title: "Third", createdAt: "2026-09-03T00:00:00Z" });
    await request(app).post("/posts").send({ ...body, title: "Fourth 100%_odd", createdAt: "2026-09-04T00:00:00Z" });
  });
  it("lists newest first", async () => {
    const res = await request(app).get("/posts");
    expect(res.body.map((p) => p.title)).toEqual(["Fourth 100%_odd", "Third", "Second", "First"]);
  });
  it("limit=3 returns the last three entries (homepage)", async () => {
    const res = await request(app).get("/posts?limit=3");
    expect(res.body.map((p) => p.title)).toEqual(["Fourth 100%_odd", "Third", "Second"]);
  });
  it("filters by tag and by search text", async () => {
    expect((await request(app).get("/posts?tag=svelte")).body).toHaveLength(1);
    expect((await request(app).get("/posts?q=second")).body).toHaveLength(1);
  });
  it("treats % and _ in the search as normal characters", async () => {
    expect((await request(app).get("/posts?q=100%25_odd")).body).toHaveLength(1);
    expect((await request(app).get("/posts?q=%25")).body).toHaveLength(1);
  });
  it("returns 400 for a bad limit", async () => {
    expect((await request(app).get("/posts?limit=-1")).status).toBe(400);
  });
});

describe("GET/PATCH/DELETE /posts/:id", () => {
  it("returns 404 with an error message for unknown ids", async () => {
    const res = await request(app).get("/posts/missing");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Post not found");
  });
  it("gets, updates (tags replaced) and deletes a post", async () => {
    const { body: created } = await request(app).post("/posts").send(body);

    expect((await request(app).get(`/posts/${created.id}`)).body.title).toBe(body.title);

    const patched = await request(app).patch(`/posts/${created.id}`).send({ title: "Updated title", tags: ["only"] });
    expect(patched.status).toBe(200);
    expect(patched.body).toMatchObject({ title: "Updated title", tags: ["only"], content: body.content });

    const deleted = await request(app).delete(`/posts/${created.id}`);
    expect(deleted.status).toBe(200);
    expect(deleted.body.id).toBe(created.id);
    expect((await request(app).get(`/posts/${created.id}`)).status).toBe(404);
  });
  it("deleting a post also removes its tags (cascade)", async () => {
    const { body: created } = await request(app).post("/posts").send(body);
    await request(app).delete(`/posts/${created.id}`);
    expect(db.prepare("SELECT COUNT(*) AS n FROM post_tags").get().n).toBe(0);
  });
});

describe("misc", () => {
  it("health check and unknown route", async () => {
    expect((await request(app).get("/health")).body).toEqual({ status: "ok" });
    expect((await request(app).get("/nope")).status).toBe(404);
  });
  it("seeds the old db.json only into an empty database", () => {
    expect(seedIfEmpty(repository)).toBe(4);
    expect(seedIfEmpty(repository)).toBe(0);
    expect(repository.count()).toBe(4);
  });
});

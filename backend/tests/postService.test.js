import { beforeEach, describe, expect, it } from "vitest";
import { createPostService, normalizeTags } from "../src/services/postService.js";
import { createMemoryPostRepository } from "../src/repositories/memoryPostRepository.js";
import { NotFoundError, ValidationError } from "../src/utils/errors.js";

// Unit tests: the service is built with an in-memory repository, a fixed clock and predictable ids.
const validPost = { title: "My FYP journey", content: "Building a blog in three frameworks is fun.", tags: ["React", "js"] };

let service;
let counter;

beforeEach(() => {
  counter = 0;
  service = createPostService({
    repository: createMemoryPostRepository(),
    now: () => new Date("2026-09-28T10:00:00Z"),
    generateId: () => `id-${++counter}`,
  });
});

describe("normalizeTags", () => {
  it("trims, lowercases, removes blanks and duplicates", () => {
    expect(normalizeTags([" React", "api", "", "API "])).toEqual(["react", "api"]);
  });
  it("accepts a comma separated string", () => {
    expect(normalizeTags("a, b,,B")).toEqual(["a", "b"]);
  });
});

describe("create", () => {
  it("creates a post with generated id, normalised tags and timestamps", () => {
    const post = service.create(validPost);
    expect(post).toMatchObject({ id: "id-1", title: "My FYP journey", tags: ["react", "js"] });
    expect(post.createdAt).toBe("2026-09-28T10:00:00.000Z");
  });
  it("keeps a valid createdAt sent by the client and ignores an invalid one", () => {
    expect(service.create({ ...validPost, createdAt: "2026-01-01T00:00:00Z" }).createdAt).toBe("2026-01-01T00:00:00.000Z");
    expect(service.create({ ...validPost, createdAt: "nonsense" }).createdAt).toBe("2026-09-28T10:00:00.000Z");
  });
  it("rejects short title and content with field errors", () => {
    try {
      service.create({ title: "Hi", content: "short" });
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(Object.keys(e.details)).toEqual(["title", "content"]);
    }
  });
  it("rejects tags that are not an array", () => {
    expect(() => service.create({ ...validPost, tags: "react" })).toThrow(ValidationError);
  });
  it("rejects too many tags", () => {
    const tags = Array.from({ length: 11 }, (_, i) => `t${i}`);
    expect(() => service.create({ ...validPost, tags })).toThrow(ValidationError);
  });
});

describe("list", () => {
  beforeEach(() => {
    service.create({ ...validPost, title: "Old post", createdAt: "2026-09-01T00:00:00Z" });
    service.create({ ...validPost, title: "Svelte notes", content: "SvelteKit routing and SSR notes here.", tags: ["svelte"], createdAt: "2026-09-03T00:00:00Z" });
    service.create({ ...validPost, title: "Newest post", createdAt: "2026-09-05T00:00:00Z" });
  });
  it("returns newest first", () => {
    expect(service.list().map((p) => p.title)).toEqual(["Newest post", "Svelte notes", "Old post"]);
  });
  it("supports limit (homepage = last three)", () => {
    expect(service.list({ limit: "2" })).toHaveLength(2);
  });
  it("rejects an invalid limit", () => {
    expect(() => service.list({ limit: "abc" })).toThrow(ValidationError);
    expect(() => service.list({ limit: "0" })).toThrow(ValidationError);
  });
  it("filters by tag and search, case-insensitively", () => {
    expect(service.list({ tag: "SVELTE" })).toHaveLength(1);
    expect(service.list({ q: "sveltekit" })).toHaveLength(1);
    expect(service.list({ tag: "react", q: "old" })).toHaveLength(1);
  });
});

describe("get / update / remove", () => {
  it("throws NotFoundError for unknown ids", () => {
    expect(() => service.get("nope")).toThrow(NotFoundError);
    expect(() => service.update("nope", { title: "abc" })).toThrow(NotFoundError);
    expect(() => service.remove("nope")).toThrow(NotFoundError);
  });
  it("updates only the given fields", () => {
    const { id } = service.create(validPost);
    const updated = service.update(id, { title: "New title" });
    expect(updated.title).toBe("New title");
    expect(updated.content).toBe(validPost.content);
  });
  it("validates partial updates", () => {
    const { id } = service.create(validPost);
    expect(() => service.update(id, { title: "x" })).toThrow(ValidationError);
  });
  it("removes and returns the deleted post", () => {
    const { id } = service.create(validPost);
    expect(service.remove(id).id).toBe(id);
    expect(() => service.get(id)).toThrow(NotFoundError);
  });
});

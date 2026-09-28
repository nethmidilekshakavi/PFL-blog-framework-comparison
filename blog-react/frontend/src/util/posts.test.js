import { describe, expect, it } from "vitest";
import {
    excerpt, filterPosts, getAllTags, getLatest, parseTags, readingTime, sortNewest,
} from "./posts";

const posts = [
    { id: "1", title: "React basics", content: "components and hooks", tags: ["react", "js"], createdAt: "2026-09-01T10:00:00Z" },
    { id: "2", title: "Backend intro", content: "apis and databases", tags: ["backend", "js"], createdAt: "2026-09-03T10:00:00Z" },
    { id: "3", title: "SvelteKit", content: "routing and ssr", tags: ["svelte"], createdAt: "2026-09-02T10:00:00Z" },
    { id: "4", title: "Testing", content: "unit tests with vitest", tags: ["testing"], createdAt: "2026-09-04T10:00:00Z" },
];

describe("sortNewest / getLatest", () => {
    it("sorts newest first without mutating the input", () => {
        const copy = [...posts];
        expect(sortNewest(posts).map((p) => p.id)).toEqual(["4", "2", "3", "1"]);
        expect(posts).toEqual(copy);
    });
    it("returns only the last three posts", () => {
        expect(getLatest(posts).map((p) => p.id)).toEqual(["4", "2", "3"]);
    });
    it("handles fewer posts than requested", () => {
        expect(getLatest(posts.slice(0, 1))).toHaveLength(1);
    });
});

describe("parseTags", () => {
    it("trims, lowercases, removes blanks and duplicates", () => {
        expect(parseTags(" React, api,, API ,Testing ")).toEqual(["react", "api", "testing"]);
    });
    it("returns an empty array for empty input", () => {
        expect(parseTags("")).toEqual([]);
    });
});

describe("getAllTags", () => {
    it("counts tags and sorts by popularity", () => {
        expect(getAllTags(posts)[0]).toEqual({ tag: "js", count: 2 });
    });
});

describe("filterPosts", () => {
    it("filters by tag", () => {
        expect(filterPosts(posts, { tag: "js" })).toHaveLength(2);
    });
    it("searches title and content, case-insensitively", () => {
        expect(filterPosts(posts, { query: "VITEST" })[0].id).toBe("4");
    });
    it("combines tag and query", () => {
        expect(filterPosts(posts, { tag: "js", query: "react" })).toHaveLength(1);
    });
    it("returns everything with no filters", () => {
        expect(filterPosts(posts)).toHaveLength(4);
    });
});

describe("excerpt / readingTime", () => {
    it("truncates long text with an ellipsis", () => {
        expect(excerpt("a".repeat(200), 50)).toHaveLength(51);
    });
    it("leaves short text unchanged", () => {
        expect(excerpt("short text")).toBe("short text");
    });
    it("is at least 1 minute", () => {
        expect(readingTime("hello")).toBe(1);
    });
});

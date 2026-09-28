import { randomUUID } from "node:crypto";
import { NotFoundError, ValidationError } from "../utils/errors.js";

export const LIMITS = { titleMin: 3, titleMax: 100, contentMin: 20, contentMax: 20000, maxTags: 10, tagMax: 30 };

/** trim + lowercase + drop blanks + de-duplicate (same rule the frontends use) */
export function normalizeTags(input) {
  const raw = Array.isArray(input) ? input : String(input ?? "").split(",");
  return [...new Set(raw.map((t) => String(t).trim().toLowerCase()).filter(Boolean))];
}

function validate(data, { partial }) {
  const errors = {};
  const has = (k) => data[k] !== undefined;

  if (!partial || has("title")) {
    const title = typeof data.title === "string" ? data.title.trim() : "";
    if (title.length < LIMITS.titleMin) errors.title = `Title must be at least ${LIMITS.titleMin} characters`;
    else if (title.length > LIMITS.titleMax) errors.title = `Title must be at most ${LIMITS.titleMax} characters`;
  }
  if (!partial || has("content")) {
    const content = typeof data.content === "string" ? data.content.trim() : "";
    if (content.length < LIMITS.contentMin) errors.content = `Content must be at least ${LIMITS.contentMin} characters`;
    else if (content.length > LIMITS.contentMax) errors.content = `Content must be at most ${LIMITS.contentMax} characters`;
  }
  if (has("tags")) {
    if (!Array.isArray(data.tags)) errors.tags = "Tags must be an array of strings";
    else {
      const tags = normalizeTags(data.tags);
      if (tags.length > LIMITS.maxTags) errors.tags = `At most ${LIMITS.maxTags} tags allowed`;
      else if (tags.some((t) => t.length > LIMITS.tagMax)) errors.tags = `Each tag must be at most ${LIMITS.tagMax} characters`;
    }
  }
  if (Object.keys(errors).length) throw new ValidationError(errors);
}

/**
 * Business logic. Dependencies (repository, clock, id generator) are injected,
 * which is what makes this layer easy to unit test.
 */
export function createPostService({ repository, now = () => new Date(), generateId = randomUUID }) {
  const service = {
    list({ q = "", tag = "", limit } = {}) {
      const parsedLimit = limit === undefined || limit === "" ? undefined : Number(limit);
      if (parsedLimit !== undefined && (!Number.isInteger(parsedLimit) || parsedLimit < 1)) {
        throw new ValidationError({ limit: "limit must be a positive integer" });
      }
      return repository.list({
        query: String(q).trim(),
        tag: String(tag).trim().toLowerCase(),
        limit: parsedLimit,
      });
    },

    get(id) {
      const post = repository.get(id);
      if (!post) throw new NotFoundError();
      return post;
    },

    create(data = {}) {
      validate(data, { partial: false });
      const timestamp = now().toISOString();
      return repository.create({
        id: generateId(),
        title: data.title.trim(),
        content: data.content.trim(),
        tags: normalizeTags(data.tags),
        // the frontends send their own createdAt; accept it if valid, otherwise use server time
        createdAt:
          data.createdAt && !Number.isNaN(Date.parse(data.createdAt))
            ? new Date(data.createdAt).toISOString()
            : timestamp,
        updatedAt: timestamp,
      });
    },

    update(id, data = {}) {
      service.get(id); // 404 if missing
      validate(data, { partial: true });
      const changes = { updatedAt: now().toISOString() };
      if (data.title !== undefined) changes.title = data.title.trim();
      if (data.content !== undefined) changes.content = data.content.trim();
      if (data.tags !== undefined) changes.tags = normalizeTags(data.tags);
      return repository.update(id, changes);
    },

    remove(id) {
      const removed = repository.remove(id);
      if (!removed) throw new NotFoundError();
      return removed;
    },
  };
  return service;
}

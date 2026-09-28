export function sortNewest(posts) {
    return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getLatest(posts, count = 3) {
    return sortNewest(posts).slice(0, count);
}

export function parseTags(input) {
    const tags = input
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    return [...new Set(tags)];
}

export function getAllTags(posts) {
    const counts = {};
    posts.forEach((p) => (p.tags ?? []).forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return Object.entries(counts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function filterPosts(posts, { query = "", tag = "" } = {}) {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
        const matchesTag = !tag || (p.tags ?? []).includes(tag);
        const matchesQuery =
            !q || p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q);
        return matchesTag && matchesQuery;
    });
}

export function excerpt(text, max = 140) {
    const clean = text.replace(/\s+/g, " ").trim();
    return clean.length <= max ? clean : clean.slice(0, max).trimEnd() + "…";
}

export function readingTime(text) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

export function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
    });
}

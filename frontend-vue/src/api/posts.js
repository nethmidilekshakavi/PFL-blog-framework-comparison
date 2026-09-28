const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        throw new Error(
            res.status === 404 ? "Post not found" : `Request failed (${res.status})`
        );
    }
    return res.json();
}

export const api = {
    list: async () => {
        const posts = await request("/posts");
        return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    get: (id) => request(`/posts/${id}`),
    create: (data) =>
        request("/posts", {
            method: "POST",
            body: JSON.stringify({ ...data, createdAt: new Date().toISOString() }),
        }),
    update: (id, data) =>
        request(`/posts/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id) => request(`/posts/${id}`, { method: "DELETE" }),
};
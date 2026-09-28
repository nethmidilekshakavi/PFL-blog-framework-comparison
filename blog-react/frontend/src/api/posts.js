const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.status === 204 ? null : res.json();
}

export const getPosts = () => request("/posts");
export const getPost = (id) => request(`/posts/${id}`);

export const createPost = ({ title, content, tags }) =>
    request("/posts", {
        method: "POST",
        body: JSON.stringify({ title, content, tags, createdAt: new Date().toISOString() }),
    });

export const updatePost = (id, { title, content, tags }) =>
    request(`/posts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ title, content, tags }),
    });

export const deletePost = (id) => request(`/posts/${id}`, { method: "DELETE" });

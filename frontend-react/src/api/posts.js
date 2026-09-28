import axios from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

// Backend eke error message eka `e.message` widiyata pennanna (existing code wenas karanna one naha)
http.interceptors.response.use(
    (res) => res,
    (err) => {
        const data = err.response?.data;
        let message = data?.error ?? (err.response ? `Request failed (${err.response.status})` : "Cannot reach the server");
        if (data?.details) message += `: ${Object.values(data.details).join(", ")}`;
        return Promise.reject(Object.assign(new Error(message), { status: err.response?.status }));
    }
);

export const getPosts = () => http.get("/posts").then((r) => r.data);
export const getPost = (id) => http.get(`/posts/${id}`).then((r) => r.data);

export const createPost = ({ title, content, tags }) =>
    http.post("/posts", { title, content, tags, createdAt: new Date().toISOString() }).then((r) => r.data);

export const updatePost = (id, { title, content, tags }) =>
    http.patch(`/posts/${id}`, { title, content, tags }).then((r) => r.data);

export const deletePost = (id) => http.delete(`/posts/${id}`).then((r) => r.data);
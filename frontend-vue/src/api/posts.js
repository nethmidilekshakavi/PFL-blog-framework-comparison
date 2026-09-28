import axios from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

http.interceptors.response.use(
    (res) => res,
    (err) => {
        const data = err.response?.data;
        let message = data?.error ?? (err.response ? `Request failed (${err.response.status})` : "Cannot reach the server");
        if (data?.details) message += `: ${Object.values(data.details).join(", ")}`;
        return Promise.reject(Object.assign(new Error(message), { status: err.response?.status }));
    }
);

export const api = {
    list: async () => {
        const { data } = await http.get("/posts");
        return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    get: (id) => http.get(`/posts/${id}`).then((r) => r.data),
    create: (data) =>
        http.post("/posts", { ...data, createdAt: new Date().toISOString() }).then((r) => r.data),
    update: (id, data) => http.patch(`/posts/${id}`, data).then((r) => r.data),
    remove: (id) => http.delete(`/posts/${id}`).then((r) => r.data),
};
import { reactive } from "vue";

export const toasts = reactive([]);
let nextId = 0;

function push(message, type) {
    const t = { id: ++nextId, message, type };
    toasts.push(t);
    setTimeout(() => {
        const i = toasts.findIndex((x) => x.id === t.id);
        if (i > -1) toasts.splice(i, 1);
    }, 3500);
}

export const toast = {
    success: (message) => push(message, "success"),
    error: (message) => push(message, "error"),
};
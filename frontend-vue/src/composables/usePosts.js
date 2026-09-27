import { computed, unref } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { api } from "../api/posts";

export const usePosts = () =>
    useQuery({ queryKey: ["posts"], queryFn: api.list });

export const usePost = (id) =>
    useQuery({
        queryKey: ["posts", id],
        queryFn: () => api.get(unref(id)),
        enabled: computed(() => !!unref(id)),
    });

export function useCreatePost() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
    });
}

export function useUpdatePost() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => api.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
    });
}

export function useDeletePost() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: api.remove,
        onSuccess: (_, id) => {
            qc.removeQueries({ queryKey: ["posts", id] });
            qc.invalidateQueries({ queryKey: ["posts"] });
        },
    });
}
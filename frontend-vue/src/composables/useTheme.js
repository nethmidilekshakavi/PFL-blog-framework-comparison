import { ref, watchEffect } from "vue";

const theme = ref(
    localStorage.getItem("theme") ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
);

watchEffect(() => {
    document.documentElement.classList.toggle("dark", theme.value === "dark");
    localStorage.setItem("theme", theme.value);
});

export function useTheme() {
    const toggle = () => {
        theme.value = theme.value === "dark" ? "light" : "dark";
    };
    return { theme, toggle };
}
import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import PostDetail from "../pages/PostDetail.vue";
import PostEditor from "../pages/PostEditor.vue";
import NotFound from "../pages/NotFound.vue";

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "home", component: Home },
        { path: "/posts/new", name: "post-new", component: PostEditor },
        { path: "/posts/:id", name: "post-detail", component: PostDetail },
        { path: "/posts/:id/edit", name: "post-edit", component: PostEditor },
        { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
    ],
    scrollBehavior: () => ({ top: 0 }),
});
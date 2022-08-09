import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/single",
      component: () => import("@/views/PongSingle.vue"),
    },
    {
      path: "/multiple",
      component: () => import("@/views/PongMultiple.vue"),
    },
  ],
});

export default router;

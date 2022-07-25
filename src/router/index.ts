import { createRouter, createWebHistory } from "vue-router";
import PongSingle from "../views/PongSingle.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: PongSingle,
    },
  ],
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import EmployeesView from "@/views/EmployeesView.vue";
import LoginView from "@/views/LoginView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "employees",
      component: EmployeesView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

export default router;

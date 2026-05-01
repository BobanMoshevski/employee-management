import { createRouter, createWebHistory } from "vue-router";
import EmployeesView from "@/views/EmployeesView.vue";
import EmployeeView from "@/views/EmployeeView.vue";
import CreateEmployeeView from "@/views/CreateEmployeeView.vue";
import EditEmployeeView from "@/views/EditEmployeeView.vue";
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
      path: "/employee/:id",
      name: "employee",
      component: EmployeeView,
    },
    {
      path: "/employee/create",
      name: "create-employee",
      component: CreateEmployeeView,
    },
    {
      path: "/employee/edit/:id",
      name: "employee-edit",
      component: EditEmployeeView,
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

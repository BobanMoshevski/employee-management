import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  // Use HTML5 history mode (clean URLs without #)
  history: createWebHistory(import.meta.env.BASE_URL),
  // Application route definitions
  routes: [
    {
      // Home page - shows list of employees
      path: "/",
      name: "employees",
      component: () => import("@/views/EmployeesView.vue"),
    },
    {
      // Employee details page (dynamic route using ID)
      path: "/employee/:id",
      name: "employee",
      component: () => import("@/views/EmployeeView.vue"),
    },
    {
      // Create new employee page
      path: "/employee/create",
      name: "create-employee",
      component: () => import("@/views/CreateEmployeeView.vue"),
    },
    {
      // Edit existing employee page (uses ID to load data)
      path: "/employee/edit/:id",
      name: "employee-edit",
      component: () => import("@/views/EditEmployeeView.vue"),
    },
    {
      // Login page for authentication
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      // Catch-all route (404 page)
      // Matches any undefined route
      path: "/:catchAll(.*)",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
});

export default router;

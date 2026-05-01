<script setup>
import { RouterLink, useRoute } from "vue-router";

// Utility function to check if a route is currently active
// Used to dynamically apply active styles to navigation links
const isActiveLink = (routePath) => {
  const route = useRoute();

  // Compare current route path with the provided path
  return route.path === routePath;
};
</script>

<template>
  <nav class="bg-gray-900">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <!-- Main navbar container (centers or aligns content depending on screen size) -->
        <div
          class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <!-- Navigation links section -->
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <!-- Employees link -->
              <!-- Applies active styling when current route is "/" -->
              <RouterLink
                to="/"
                :class="[
                  isActiveLink('/')
                    ? 'bg-gray-600'
                    : 'hover:bg-gray-400 hover:text-white',
                  'text-white',
                  'px-3',
                  'py-2',
                  'rounded-md',
                ]"
              >
                Employees
              </RouterLink>

              <!-- Login link -->
              <!-- Applies active styling when current route is "/login" -->
              <RouterLink
                to="/login"
                :class="[
                  isActiveLink('/login')
                    ? 'bg-gray-600'
                    : 'hover:bg-gray-400 hover:text-white',
                  'text-white',
                  'px-3',
                  'py-2',
                  'rounded-md',
                ]"
                >Log in</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRoute } from "vue-router";

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};
</script>

<template>
  <nav class="bg-gray-900">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div
          class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <!-- Navbar Links -->
          <div class="md:ml-auto">
            <div class="flex space-x-2">
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
                >Employees</RouterLink
              >
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

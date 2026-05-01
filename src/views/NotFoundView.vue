<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <!-- 404 error page container -->
  <section
    class="text-center text-white flex flex-col justify-center items-center h-96"
  >
    <!-- Error title -->
    <h1 class="text-6xl font-bold mb-4">404 Not Found</h1>

    <!-- Error description -->
    <p class="text-xl mb-5">This page does not exist</p>

    <!-- Navigation back to homepage -->
    <RouterLink
      to="/"
      class="bg-gray-400 hover:bg-gray-900 rounded-md px-3 py-2 mt-4"
      >Go Back</RouterLink
    >
  </section>
</template>

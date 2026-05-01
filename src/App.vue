<script setup>
import Navbar from "@/components/Navbar.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <!-- Global navigation bar -->
  <Navbar />

  <!-- Renders the matched route component -->
  <RouterView />
</template>

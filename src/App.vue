<template>
  <div class="body-wrap">
    <div class="wrap">
      <Navbar />
      <router-view :key="$route.fullPath" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/layout/header/Navbar.vue';
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
onMounted(() => {
  console.log('APP.vue');
});
</script>

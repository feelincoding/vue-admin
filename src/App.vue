<template style="height: 100%">
  <div class="body-wrap" style="height: 100%">
    <div class="wrap" style="height: 100%">
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

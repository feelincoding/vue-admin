<template>
  <div class="tit-wrap">
    <h1 class="h1-tit">{{ title }}</h1>
  </div>
  <slot name="search-form"></slot>
  <slot name="list-form"></slot>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

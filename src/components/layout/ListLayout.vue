<template>
  <article class="body-cont">
    <div class="tit-wrap">
      <h1 class="h1-tit">{{ title }}</h1>
    </div>
    <slot name="search-form"></slot>
    <slot name="list-form"></slot>
    <footer class="footer-wrap">
      <p class="copy">Copyrightⓒ2022 Agile core team. All rights reserved.</p>
      <div class="footer-link">
        <a class="link" href="javascript:void(0)">service</a>
        <a class="link" href="javascript:void(0)">이용약관</a>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
<style scoped></style>

<template>
  <section class="contents-wrap">
    <div class="tb-tit">
      <h2 class="h2-tit">
        Total :<em>{{ props.total }}</em>
      </h2>
      <slot name="list-btn-area" />
    </div>
    <slot name="list-table" />

    <slot name="pagination" />
  </section>
</template>

<script setup lang="ts">
// const props = defineProps<{
//   title: string;
//   total: number;
//   isShowProgress?: boolean;
// }>();
const props = defineProps({
  title: { type: String || null, required: false, default: 'List' },
  total: { type: Number, required: false, default: 0 },
  // isShowProgress: { type: Boolean || undefined, required: true },
});
</script>

<style scoped></style>

<template>
  <section class="contents-wrap">
    <div class="tb-tit">
      <h2 class="h2-tit">
        Total :<em>{{ props.total }}</em>
      </h2>
      <div class="btn-wrap">
        <slot name="list-btn-area" />
      </div>
    </div>
    <div class="tb-wrap">
      <slot name="list-table" />
    </div>
    <div class="page-wrap">
      <slot name="pagination" />
    </div>
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

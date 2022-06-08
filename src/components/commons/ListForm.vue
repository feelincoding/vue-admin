<template>
  <div class="comp">
    <div class="tb-tit">
      <h2 class="h2-tit">
        {{ title }}
        <span
          >[Total :<em>{{ total }}</em
          >]
        </span>
      </h2>
      <div class="btn-wrap">
        <slot name="list-btn-area" />
      </div>
    </div>
    <slot name="list-table" />
    <div class="page-wrap">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string;
  total?: number;
  isShowProgress?: boolean;
}>();
// const props = defineProps({
//   title: { type: String, required: false, default: 'List' },
//   total: { type: Number, required: false, default: 0 },
//   isShowProgress: { type: Boolean, required: true },
// });
</script>

<style scoped></style>

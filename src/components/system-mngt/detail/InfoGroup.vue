<template>
  <li>
    <label class="label">{{ inputNm }} : </label>
    <div class="form-cont">
      <p class="black-txt">{{ value }}</p>
    </div>
  </li>
</template>
<script setup lang="ts">
const props = defineProps<{
  inputNm: string | null;
  value?: string | number | null;
}>();
</script>

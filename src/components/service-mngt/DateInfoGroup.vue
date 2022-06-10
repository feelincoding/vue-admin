<template lang="">
  <li>
    <label class="label">{{ inputNm }}</label>
    <div class="form-cont">
      <p>{{ startDt }} ~ {{ endDt }}</p>
    </div>
  </li>
</template>
<script setup lang="ts">
defineProps<{
  inputNm: string;
  startDt?: string | number | null;
  endDt?: string | number | null;
}>();
</script>

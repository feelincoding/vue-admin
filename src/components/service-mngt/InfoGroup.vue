<template>
  <li>
    <label class="label">{{ inputNm }} :</label>
    <div class="form-cont">
      <p class="black-txt">{{ value }}</p>
    </div>
  </li>
</template>
<script setup lang="ts">
defineProps<{
  inputNm: string;
  value?: string | number | null;
}>();
</script>

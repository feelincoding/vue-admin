<template>
  <li>
    <label class="label">{{ props.inputNm }}</label>
    <div class="form-cont">
      <p>{{ props.value }}</p>
    </div>
  </li>
</template>
<script setup lang="ts">
const props = defineProps<{
  inputNm: string;
  value?: string | number | null;
}>();
</script>

<template>
  <li>
    <label for="" class="label">{{ inputNm }}</label>
    <div class="form-cont">
      <textarea class="textarea" :value="value" @input="$emit('input', $event.target.value)"></textarea>
    </div>
  </li>
</template>
<script setup lang="ts">
defineProps({
  inputNm: { type: String, require: false, default: '' },
  value: { type: String, require: false, default: '' },
});

defineEmits<{
  (e: 'input', value: string | null): void;
}>();
</script>

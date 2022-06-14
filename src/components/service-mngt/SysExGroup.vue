<template>
  <li>
    <label for="" class="label">{{ inputNm }} :</label>
    <div class="form-cont">
      <textarea class="textarea" v-model="text"></textarea>
    </div>
  </li>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  inputNm: string;
  value: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: any): void;
}>();

const text = computed({
  get: () => props.value,
  set: (val) => {
    emit('update:value', val);
  },
});
</script>

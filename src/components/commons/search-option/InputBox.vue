<template>
  <div>
    <label class="label" for="sysName">{{ props.label }}</label>
    <input
      type="text"
      id="sysName"
      class="input-box"
      :placeholder="props.placeholder"
      :value="props.value"
      @input="inputTxt($event)"
      @keyup="handleKeyup"
    />
  </div>
</template>

<script setup lang="ts">
// const props = defineProps(['label', 'placeholder', 'value']);
const props = defineProps<{
  label?: string;
  placeholder?: string;
  value?: string;
}>();
const emit = defineEmits<{
  (e: 'input', value: any): void;
  (e: 'submit'): void;
}>();
// const emit = defineEmits(['subscribe:user', 'subscribe']);

const inputTxt = (e: any) => {
  const value = e.target.value;
  emit('input', value);
};

const handleKeyup = (e: any) => {
  const value = e.target.value;
  emit('submit');
};
// inputTxt(event: any) {
//   this.$emit('input', event.target.value);
// }
// handleKeyup(event: any) {
//   if (event.keyCode === 13) {
//     this.$emit('submit');
//   }
// }
</script>

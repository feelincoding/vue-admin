<template>
  <li>
    <label for="" class="label point">{{ groupNm }}</label>
    <div class="form-cont">
      <select class="select-box lg" :placeholder="$t('api.choice_please')" @change="handleOnChange" defalut="">
        <option value="" :disabled="clickSelectbox">{{ $t('api.choice_please') }}</option>
        <option v-for="(option, index) in optionList" :key="index">{{ option }}</option>
      </select>
    </div>
  </li>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';

defineProps<{
  groupNm: string;
  optionList: string[];
  input: string;
}>();

const emit = defineEmits<{
  (e: 'update:input', value: string): void;
}>();

const clickSelectbox = ref(false);

onMounted(() => {
  clickSelectbox.value = true;
});

const handleOnChange = (event: any) => {
  console.log(event.target.value);
  emit('update:input', event.target.value);
};
</script>

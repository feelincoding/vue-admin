<template>
  <li>
    <label for="" class="label" :class="{ point: required }">{{ groupNm }}</label>
    <div class="form-cont">
      <textarea class="textarea" @input="handleOnChange" :value="longText" :placeholder="placeholder"></textarea>

      <p v-if="notiMessage.isCheck === false" class="red-txt noti">{{ notiMessage.message }}</p>
    </div>
  </li>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { checkLength } from '@/utils/validation';
import type { ValidationCheckType } from './Types';
import { useI18n } from 'vue-i18n';
const { t } = useI18n({});

const props = defineProps({
  groupNm: { type: String, required: true },
  required: { type: Boolean, required: false, default: false },
  disabled: { type: Boolean, required: false, default: false },
  value: { type: String, required: true },
  placeholder: { type: String, required: false, default: '' },
  isvalid: { type: Boolean, required: false, default: false },
});

const validationCheck: ValidationCheckType = {
  isCheck: null,
  message: '',
};

const notiMessage = ref(validationCheck);
const longText = ref('');
const show = ref(false);

onMounted(() => {
  longText.value = props.value;
});

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
  (e: 'update:isvalid', value: boolean): void;
}>();
watch(
  () => props.value,
  (val: string) => {
    longText.value = val;
  }
);
watch(longText, (val: string) => {
  if (val.length > 1000) {
    notiMessage.value.isCheck = false;
    notiMessage.value.message = t('api.valid_check_desc');
  } else {
    notiMessage.value.isCheck = true;
    notiMessage.value.message = '';
  }
  emit('update:isvalid', notiMessage.value.isCheck);
});

const handleOnChange = (event: any) => {
  emit('update:value', event.target.value);
};

const notice = () => {
  show.value = true;
};
</script>

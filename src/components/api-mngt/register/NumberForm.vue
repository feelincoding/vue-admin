<template>
  <li>
    <label for="" class="label" :class="{ point: required }">{{ groupNm }}</label>
    <div class="form-cont">
      <input
        v-if="disabled"
        type="number"
        :value="value"
        class="input-box lg disabled"
        disabled
        :placeholder="placeholder"
      />
      <input
        v-if="!disabled"
        type="number"
        class="input-box lg"
        :class="{ 'check-ok': notiMessage.isCheck, 'check-false': !notiMessage.isCheck && show }"
        v-model="num"
        :placeholder="placeholder"
      />
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
  value: { type: Number, required: true },
  placeholder: { type: String, required: false, default: '' },
  isvalid: { type: Boolean, required: false, default: false },
});

const validationCheck: ValidationCheckType = {
  isCheck: null,
  message: '',
};

const notiMessage = ref(validationCheck);
const num = ref(0);
const show = ref(false);

onMounted(() => {
  num.value = props.value;
});

const emit = defineEmits<{
  (e: 'update:value', value: number): void;
  (e: 'update:isvalid', value: boolean): void;
}>();
watch(
  () => props.value,
  (val: number) => {
    num.value = val;
  }
);
watch(num, (val: number) => {
  if (val >= 1000 && val <= 30000) {
    notiMessage.value.isCheck = true;
    notiMessage.value.message = '';
    emit('update:value', val);
  } else {
    notiMessage.value.isCheck = false;
    notiMessage.value.message = t('api.valid_check_thimeout');
  }

  emit('update:isvalid', notiMessage.value.isCheck);
});
</script>

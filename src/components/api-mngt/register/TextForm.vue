<template>
  <li>
    <label for="" class="label" :class="{ point: required }">{{ groupNm }}</label>
    <div class="form-cont">
      <input v-if="disabled" type="text" :value="value" class="input-box lg" disabled :placeholder="placeholder" />
      <input
        v-if="!disabled"
        type="text"
        class="input-box lg"
        :class="{ 'check-ok': notiMessage.isCheck, 'check-false': !notiMessage.isCheck && show }"
        v-model="text"
        :placeholder="placeholder"
        @focus="notice()"
      />
      <p v-if="show && notiMessage.isCheck === null" class="red-txt noti">해당 목록은 필수 입력값입니다.</p>
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
const text = ref('');
const show = ref(false);

onMounted(() => {
  text.value = props.value;
});

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
  (e: 'update:isvalid', value: boolean): void;
}>();

watch(text, (val: string) => {
  if (checkLength(val, 1, 20)) {
    notiMessage.value.isCheck = true;
    notiMessage.value.message = '';

    emit('update:value', val);
  } else if (val == '') {
    notiMessage.value.isCheck = false;
    notiMessage.value.message = '';
  } else {
    notiMessage.value.isCheck = false;
    notiMessage.value.message = t('api.valid_check_nm');
  }

  emit('update:isvalid', notiMessage.value.isCheck);
});

const notice = () => {
  show.value = true;
};
</script>

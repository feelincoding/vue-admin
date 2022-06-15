<template>
  <li>
    <label
      for=""
      :class="{
        'label point': required === true,
        label: required === false,
      }"
      >{{ inputNm }} : </label
    >
    <div class="form-cont">
      <input
        :type="type"
        :class="{
          'check-ok': notiMessage.isValid === true,
          'check-false': notiMessage.isValid === false,
        }"
        class="input-box lg"
        :placeholder="place"
        :disabled="disabled"
        v-model="v"
        @focus="emptyChkFunc"
      />
      <p v-if="notiMessage.isValid == false" class="red-txt noti">{{ notiMessage.message }}</p>
    </div>
  </li>
</template>

<script setup lang="ts">
import { checkEmail, checkLength, checkEnglishNumber, checkEnglishKorean, checkEmpty } from '@/utils/validation';
import { ref, computed, watch, onMounted } from 'vue';
import type { Ref } from 'vue';
import type { ValidationCheckType } from '@/components/system-mngt/SystemMngtType';
import { useI18n } from 'vue-i18n';
const { t } = useI18n({});

const props = defineProps({
  inputNm: { type: String, required: false, default: '' },
  type: { type: String, required: false, default: '' },
  place: { type: String, required: false, default: '' },
  disabled: { type: Boolean, required: false, default: false },
  value: { type: String, required: false, default: '' },
  isValid: { type: Boolean, required: false, default: false },
  required: { type: Boolean, required: false, default: false },
});

const emit = defineEmits<{
  (e: 'update:isValid', value: boolean | null): void;
  (e: 'update:value', value: string): void;
}>();

const notiMessage: Ref<ValidationCheckType> = ref({
  isValid: null,
  message: '',
});

watch(
  () => notiMessage.value.isValid,
  () => {
    emit('update:isValid', notiMessage.value.isValid);
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  if (props.required === false) {
    emit('update:isValid', true);
  }
});

const v = computed({
  get: () => {
    console.log('v:', v.value);

    return props.value;
  },
  set: (val: string) => {
    console.log('val:', val);
    switch (props.inputNm) {
      case t('system.id'):
        if (checkLength(val, 1, 20) && checkEnglishNumber(val)) {
          notiMessage.value = { isValid: true, message: '' };
        } else if (val == '') {
          notiMessage.value = { isValid: false, message: t('system.empty_check') as string };
        } else {
          notiMessage.value = { isValid: false, message: t('system.valid_check_id') as string };
          console.log(notiMessage);
        }
        break;
      case t('system.tkcgrNm'):
        if (checkLength(val, 1, 20) && checkEnglishKorean(val)) {
          notiMessage.value = { isValid: true, message: '' };
        } else if (val == '') {
          notiMessage.value = { isValid: null, message: '' };
        } else {
          notiMessage.value = { isValid: false, message: t('system.valid_check_tkcgrNm') as string };
        }
        break;
      case t('system.tkcgrPos'):
        if (checkLength(val, 1, 50)) {
          notiMessage.value = { isValid: true, message: '' };
        } else if (val == '') {
          notiMessage.value = { isValid: null, message: '' };
        } else {
          notiMessage.value = { isValid: false, message: t('system.valid_check_tkcgrPos') as string };
        }
        break;
      case t('system.tkcgrEml'):
        if (checkLength(val, 1, 20) && checkEmail(val)) {
          notiMessage.value = { isValid: true, message: '' };
        } else if (val == '') {
          notiMessage.value = { isValid: null, message: '' };
        } else {
          notiMessage.value = { isValid: false, message: t('system.valid_check_tkcgrEml') as string };
        }
        break;
      default:
        notiMessage.value = { isValid: null, message: '' };
    }

    emit('update:value', val);
  },
});
const emptyChkFunc = () => {
  if (props.required === true && !checkEmpty(v.value)) {
    notiMessage.value = { isValid: false, message: t('system.empty_check') as string };
  }
};
</script>

<style scoped></style>

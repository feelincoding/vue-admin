<template>
  <li>
    <label
      for=""
      :class="{
        'label point': required === true,
        label: required === false,
      }"
      >{{ inputNm }}</label
    >
    <div class="form-cont">
      <input
        :type="type"
        :class="{
          'check-ok': notiMessage[0] === true,
          'check-false': notiMessage[0] === false,
        }"
        class="input-box lg"
        :placeholder="place"
        :disabled="disabled"
        v-model="v"
        @focus="emptyChkFunc"
      />
      <p v-if="notiMessage[0] == false" class="red-txt noti">{{ notiMessage[1] }}</p>
    </div>
  </li>
</template>

<script setup lang="ts">
import {
  checkEmail,
  checkLength,
  checkEnglishNumber,
  checkEnglishKorean,
  checkEmpty,
  checkEnglishNumberKorean,
} from '@/utils/validation';
import { ref, reactive, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import type { Ref } from 'vue';

import { BSpinner } from 'bootstrap-vue-3';

import { useRoute } from 'vue-router';
import router from '@/router';

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
  (e: 'update:isValid', value: boolean | null | string): void;
  (e: 'update:value', value: string): void;
}>();

const notiMessage: Ref<(boolean | null | string)[]> = ref([null, '']);
watch(notiMessage, () => {
  emit('update:isValid', notiMessage.value[0] as boolean | null | string);
});

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
          notiMessage.value = [true, ''];
        } else if (val == '') {
          notiMessage.value = [false, t('system.empty_check') as string];
        } else {
          notiMessage.value = [false, t('system.valid_check_id') as string];
          console.log(notiMessage);
        }
        break;
      case t('system.tkcgrNm'):
        if (checkLength(val, 1, 20) && checkEnglishKorean(val)) {
          notiMessage.value = [true, ''];
        } else if (val == '') {
          notiMessage.value = [true, ''];
        } else {
          notiMessage.value = [false, t('system.valid_check_tkcgrNm') as string];
        }
        break;
      case t('system.tkcgrPos'):
        if (checkLength(val, 1, 50)) {
          notiMessage.value = [true, ''];
        } else if (val == '') {
          notiMessage.value = [true, ''];
        } else {
          notiMessage.value = [false, t('system.valid_check_tkcgrPos') as string];
        }
        break;
      case t('system.tkcgrEml'):
        if (checkLength(val, 1, 20) && checkEmail(val)) {
          notiMessage.value = [true, ''];
        } else if (val == '') {
          notiMessage.value = [true, ''];
        } else {
          notiMessage.value = [false, t('system.valid_check_tkcgrEml') as string];
        }
        break;
      default:
        notiMessage.value = [null, ''];
    }

    emit('update:value', val);
  },
});
const emptyChkFunc = () => {
  if (props.required === true && !checkEmpty(v.value)) {
    notiMessage.value = [false, t('system.empty_check') as string];
  }
};
// const v = computed(():string => {
//   return props.value;
// });
</script>

<style scoped></style>

<template>
  <li>
    <label for="" class="label point">{{ inputNm }}</label>
    <div class="form-cont">
      <input
        :type="type"
        :placeholder="placeholder"
        v-model="text"
        :class="{
          'check-ok': notiMessage.isCheck === true && check === true,
          'check-false': notiMessage.isCheck === false || check === false,
        }"
        class="input-box lg"
        @focus="notice()"
      />
      <!-- <p v-if="show && text.length === 0" class="red-txt noti">해당 목록은 필수 입력값입니다.</p> -->
      <p v-if="notiMessage.isCheck == false" class="red-txt noti">{{ notiMessage.message }}</p>
      <p v-if="check === false" class="red-txt noti">중복된 ID입니다.</p>
    </div>
  </li>
</template>
<script setup lang="ts">
import { checkLength, checkEnglishNumber } from '@/utils/validation';
import type { ValidationCheckType } from './Types';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n({});

const props = defineProps<{
  check: boolean | null;
  type: string;
  inputNm: string;
  placeholder: string;
  value: string;
  isvalid: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
  (e: 'update:isvalid', value: boolean): void;
}>();

const validationCheck: ValidationCheckType = {
  isCheck: true,
  message: '',
};

const notiMessage = ref(validationCheck);
const text = ref('');
const show = ref(false);

watch(notiMessage, () => {
  emit('update:isvalid', notiMessage.value.isCheck);
});

watch(text, (val: string) => {
  if (checkLength(val, 1, 20) && checkEnglishNumber(val)) {
    notiMessage.value.isCheck = true;
    notiMessage.value.message = '';
  } else if (val == '') {
    notiMessage.value.isCheck = false;
    notiMessage.value.message = t('api.valid_check_empty');
  } else {
    notiMessage.value.isCheck = false;
    notiMessage.value.message = t('api.valid_check_id');
  }
  emit('update:value', val);
});

watch(
  () => props.value,
  (val: string) => {
    text.value = val;
  }
);

const notice = () => {
  show.value = true;
};
</script>
<style lang=""></style>

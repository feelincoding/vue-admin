<template>
  <li>
    <label for="" class="label">{{ inputNm }}</label>
    <div class="form-cont">
      <input
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        v-model="text"
        :class="{
          'check-ok': notiMessage.valid === true,
          'check-false': notiMessage.valid === false,
        }"
        class="input-box lg"
        @focus="notice()"
      />
      <p v-if="notiMessage.valid == false && notiMessage.msg != ''" class="red-txt noti">{{ notiMessage.msg }}</p>
    </div>
  </li>
</template>

<script setup lang="ts">
import { checkEmail, checkLength, checkEnglishNumberKorean, checkEnglishKorean } from '@/utils/validation';
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Ref } from 'vue';
const { t } = useI18n();
const props = defineProps<{
  inputNm: string;
  type: string;
  placeholder: string;
  value: string | null;
  disabled?: Boolean;
  isValid: Boolean | null;
}>();
// const props = defineProps({
//   inputNm: { type: String, require: false, default: '' },
//   type: { type: String, require: false, default: '' },
//   placeholder: { type: String, require: false, default: '' },
//   disabled: { type: Boolean, require: false, default: false },
//   value: { type: String, require: false, default: '' },
//   isValid: { type: Boolean, require: false, default: false },
// });
const emit = defineEmits<{
  (e: 'update:isValid', value: boolean | null): void;
  (e: 'update:value', value: string | null): void;
}>();

const emptyChk = ref(false);

const notiMessage: Ref<{ valid: boolean | null; msg: string }> = ref({ valid: null, msg: '' });

watch(notiMessage, (res) => {
  emit('update:isValid', res.valid);
});

const text = computed({
  get: () => props.value,
  set: (val) => {
    if (val !== null) {
      switch (props.inputNm) {
        case '담당자 이름':
          if (checkLength(val, 1, 20) && checkEnglishKorean(val)) {
            notiMessage.value = { valid: true, msg: '' };
          } else if (val == '') {
            notiMessage.value = { valid: null, msg: '' };
          } else {
            notiMessage.value = { valid: false, msg: 'test' };
          }
          break;
        case '소속':
          if (checkLength(val, 1, 20) && checkEnglishNumberKorean(val)) {
            notiMessage.value = { valid: true, msg: '' };
          } else if (val == '') {
            notiMessage.value = { valid: null, msg: '' };
          } else {
            notiMessage.value = { valid: false, msg: 'test' };
          }
          break;
        case 'E-mail':
          if (checkLength(val, 1, 20) && checkEmail(val)) {
            notiMessage.value = { valid: true, msg: '' };
          } else if (val == '') {
            notiMessage.value = { valid: null, msg: '' };
          } else {
            notiMessage.value = { valid: false, msg: 'test' };
          }
          break;
      }
    }
    emit('update:value', val);
  },
});

const notice = () => {
  emptyChk.value = true;
};
</script>

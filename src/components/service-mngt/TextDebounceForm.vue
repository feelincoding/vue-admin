<template>
  <li>
    <label for="" class="label point">{{ inputNm }}</label>
    <div class="form-cont">
      <input
        :type="type"
        :placeholder="placeholder"
        v-model="text"
        :class="{
          'check-ok': notiMessage.valid === true && check === true,
          'check-false': notiMessage.valid === false || check === false,
        }"
        class="input-box lg"
        @focus="notice()"
      />
      <p v-if="emptyChk && text == ''" class="red-txt noti">해당 항목은 필수 입력값입니다.</p>
      <p v-if="check == false" class="red-txt noti">중복된 입력값입니다.</p>
      <p v-if="notiMessage.valid == false && notiMessage.msg != ''" class="red-txt noti">{{ notiMessage.msg }}</p>
    </div>
  </li>
</template>
<script setup lang="ts">
import { checkEnglishNumber, checkLength } from '@/utils/validation';
import { ref, watch, type Ref } from 'vue';

const props = defineProps({
  inputNm: { type: String, require: false, default: '' },
  type: { type: String, require: false, default: '' },
  placeholder: { type: String, require: false, default: '' },
  check: { type: Boolean || null, require: false, default: null },
  value: { type: String, require: false, default: '' },
  active: { type: String, require: false, default: '' },
  isValid: { type: Boolean || null, require: false, default: null },
});
const emit = defineEmits<{
  (e: 'isValid', value: boolean | null): void;
  (e: 'value', value: string | null): void;
  (e: 'input', value: string | null): void;
}>();

const text = ref('');
const emptyChk = ref(false);
const notiMessage: Ref<{ valid: boolean | null; msg: string }> = ref({ valid: null, msg: '' });

watch(notiMessage, (val) => {
  emit('isValid', val.valid);
});

watch(text, (val) => {
  if (checkLength(val, 1, 20) && checkEnglishNumber(val)) {
    notiMessage.value = { valid: true, msg: '' };
  } else if (val == '') {
    notiMessage.value = { valid: false, msg: '' };
  } else {
    // notiMessage.value = { valid: false, msg: $t('service.valid_check_id') as string };
  }
  emit('input', val);
});

const notice = () => {
  emptyChk.value = true;
};
</script>

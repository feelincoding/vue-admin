<template>
  <li>
    <label for="" class="label point">{{ inputNm }}</label>
    <div class="form-cont">
      <input
        :type="type"
        :placeholder="placeholder"
        v-model="text"
        :class="{
          'check-ok': notiMessage[0] === true && check === true,
          'check-false': notiMessage[0] === false || check === false,
        }"
        class="input-box lg"
        @focus="notice()"
      />
      <p v-if="show && notiMessage[0] == null" class="red-txt noti">해당 목록은 필수 입력값입니다.</p>
      <p v-if="check == false" class="red-txt noti">중복된 ID입니다.</p>
      <p v-if="notiMessage[0] == false" class="red-txt noti">{{ notiMessage[1] }}</p>
    </div>
  </li>
</template>
<script setup lang="ts">
import { checkLength, checkEnglishNumber } from '@/utils/validation';
import ModalLayoutVue from '../commons/modal/ModalLayout.vue';

import { ref, reactive, computed, watch, onMounted, toRefs } from 'vue';
import type { Ref } from 'vue';

import { useRoute } from 'vue-router';
import router from '@/router';

import { useI18n } from 'vue-i18n';
const { t } = useI18n({});

const props = defineProps<{
  check: boolean | null;
  type: string;
  inputNm: string;
  placeholder: string;
  modelValue: string;
  // active: string;
  isValid: boolean | null;
}>();

const emit = defineEmits<{
  (e: 'update:isValid', value: string | null | boolean): void;
  (e: 'input', value: string): void;
}>();

const notiMessage: Ref<(string | null | boolean)[]> = ref([null, '']);
watch(notiMessage, () => {
  emit('update:isValid', notiMessage.value[0]);
});

const text = ref('');
// text = computed(() => {
//   return props.modelValue;
// });

watch(text, (val: string) => {
  console.log('val:', val);
  if (checkLength(val, 1, 20) && checkEnglishNumber(val)) {
    notiMessage.value = [true, ''];
  } else if (val == '') {
    notiMessage.value = [false, t('system.empty_check') as string];
  } else {
    notiMessage.value = [false, t('system.valid_check_id') as string];
  }
  emit('input', val);
});

const show = ref(false);

const modelValue = toRefs(props).modelValue;
watch(modelValue, (val: string) => {
  text.value = val;
});
// watch(modelValue, (val: string) => {
//   text.value = val;
// });

// @Watch('value')
//   onValueChange(val: string) {
//     this.text = val;
//   }

const notice = () => {
  show.value = true;
};
</script>
<style lang=""></style>

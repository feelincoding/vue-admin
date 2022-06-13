<template>
  <li>
    <label for="" class="label">{{ inputNm }}</label>
    <div class="form-cont">
      <textarea class="textarea" v-model="v"></textarea>
      <p v-if="notiMessage[0] == false" class="red-txt noti">{{ notiMessage[1] }}</p>
    </div>
  </li>
</template>

<script setup lang="ts">
import { checkLength } from '@/utils/validation';
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
  value: { type: String, required: false, default: '' },
  isValid: { type: Boolean || null, required: false, default: true },
});

const emit = defineEmits<{
  (e: 'update:value', val: string): void;
  (e: 'update:isValid', valIsValid: boolean | null | string): void;
}>();

const notiMessage: Ref<(string | boolean | null)[]> = ref([null, '']);

// const v = ref('');
const v = computed({
  get: () => {
    return props.value;
  },
  set: (val: string) => {
    let valid = true;
    if (checkLength(val, 0, 1000)) {
      notiMessage.value = [true, ''];
      valid = true;
    } else {
      notiMessage.value = [false, t('system.desc_length_check') as string];
      valid = false;
    }
    emit('update:value', val);
    emit('update:isValid', valid);
  },
});
</script>

<style scoped></style>

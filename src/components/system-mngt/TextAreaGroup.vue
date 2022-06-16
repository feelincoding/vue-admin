<template>
  <li>
    <label for="" class="label">{{ inputNm }} :</label>
    <div class="form-cont">
      <textarea class="textarea" v-model="v"></textarea>
      <p v-if="notiMessage.isValid == false" class="red-txt noti">{{ notiMessage.message }}</p>
    </div>
  </li>
</template>

<script setup lang="ts">
import { checkLength } from '@/utils/validation';
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

import { useI18n } from 'vue-i18n';
import type { ValidationCheckType } from './SystemMngtType';
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

const notiMessage: Ref<ValidationCheckType> = ref({ isValid: null, message: '' });

// const v = ref('');
const v = computed({
  get: () => {
    return props.value;
  },
  set: (val: string) => {
    let valid = true;
    if (checkLength(val, 0, 1000)) {
      notiMessage.value = { isValid: true, message: '' };
      valid = true;
    } else {
      notiMessage.value = { isValid: false, message: t('system.desc_length_check') as string };
      valid = false;
    }
    emit('update:value', val);
    emit('update:isValid', valid);
  },
});
</script>

<template>
  <li>
    <label for="" class="label point">{{ inputNm }} :</label>
    <div class="form-cont">
      <input
        :type="type"
        :placeholder="placeholder"
        :disabled="props.disabled"
        v-model="text"
        :class="{
          'check-ok': notiMessage.valid === true && check === true,
          'check-false': notiMessage.valid === false || check === false,
        }"
        class="input-box lg"
        @focus="notice()"
      />
      <p v-if="emptyChk && text == ''" class="red-txt noti">{{ $t('service.empty_check') }}</p>
      <p v-if="check == false" class="red-txt noti">{{ $t('service.duplicate_check_id') }}</p>
    </div>
  </li>
</template>
<script setup lang="ts">
import { checkEnglishNumber, checkLength } from '@/utils/validation';
import { computed, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps<{
  inputNm: string;
  type: string;
  value: string;
  placeholder: string;
  check: boolean | null;
  isValid?: Boolean | null;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:isValid', value: boolean | null): void;
  (e: 'update:value', value: string | null): void;
}>();

const emptyChk = ref(false);
const notiMessage: Ref<{ valid: boolean | null; msg: string }> = ref({ valid: null, msg: '' });

watch(notiMessage, (val) => {
  emit('update:isValid', val.valid);
});

const text = computed({
  get: () => props.value,
  set: (val) => {
    if (checkLength(val, 1, 20) && checkEnglishNumber(val)) {
      notiMessage.value = { valid: true, msg: '' };
    } else if (val == '') {
      notiMessage.value = { valid: false, msg: '' };
    } else {
      notiMessage.value = { valid: false, msg: t('service.valid_check_id') as string };
    }
    emit('update:value', val);
  },
});

const notice = () => {
  emptyChk.value = true;
};
</script>

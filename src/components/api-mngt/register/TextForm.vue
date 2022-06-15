<template>
  <li>
    <label for="" class="label" :class="{ point: required }">{{ groupNm }}</label>
    <div v-if="type === 'text'" class="form-cont">
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

    <div v-if="type === 'number'" class="form-cont">
      <input
        v-if="disabled"
        type="number"
        :value="value"
        class="input-box lg disabled"
        disabled
        :placeholder="placeholder"
      />
      <input
        v-if="!disabled"
        type="number"
        id=""
        class="input-box lg"
        :class="{ 'check-ok': notiMessage.isCheck, 'check-false': !notiMessage.isCheck && show }"
        v-model="num"
        :placeholder="placeholder"
      />
      <p v-if="notiMessage.isCheck === false" class="red-txt noti">{{ notiMessage.message }}</p>
    </div>

    <div v-if="type === 'textarea'" class="form-cont">
      <textarea class="textarea" @input="handleOnChange" v-model="longText" :placeholder="placeholder"></textarea>
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
  type: { type: String, required: true },
  groupNm: { type: String, required: true },
  required: { type: Boolean, required: false, default: false },
  disabled: { type: Boolean, required: false, default: false },
  value: { type: [String, Number], required: true },
  placeholder: { type: String, required: false, default: '' },
  isvalid: { type: Boolean, required: false, default: false },
});

const validationCheck: ValidationCheckType = {
  isCheck: null,
  message: '',
};

const notiMessage = ref(validationCheck);
const longText = ref('');
const text = ref('');
const num = ref(15000);
const show = ref(false);

onMounted(() => {
  if (props.type === 'textarea' && typeof props.value === 'string') {
    longText.value = props.value;
  } else if (typeof props.value === 'number') {
    num.value = props.value;
  } else if (typeof props.value === 'string') {
    text.value = props.value;
  }
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

watch(num, (val: number) => {
  if (val >= 1000 && val <= 30000) {
    notiMessage.value.isCheck = true;
    notiMessage.value.message = '';
    emit('update:value', val.toString());
  } else {
    notiMessage.value.isCheck = false;
    notiMessage.value.message = t('api.valid_check_thimeout');
  }

  emit('update:isvalid', notiMessage.value.isCheck);
});

watch(longText, (val: string) => {
  if (val.length > 1000) {
    notiMessage.value.isCheck = false;
    notiMessage.value.message = t('api.valid_check_desc');
  } else {
    notiMessage.value.isCheck = true;
    notiMessage.value.message = '';
  }
  emit('update:isvalid', notiMessage.value.isCheck);
});

const handleOnChange = (event: any) => {
  emit('update:value', event.target.value);
};

const notice = () => {
  show.value = true;
};
</script>

<template>
  <li>
    <label for="" class="label point">{{ groupNm }}</label>
    <div class="form-cont">
      <div class="check-group">
        <div class="check-box">
          <div class="check">
            <input
              type="checkbox"
              id="checkGet"
              value="GET"
              @input="handleOnClickMeth"
              :checked="methList.includes('GET')"
            /><span class="checkmark"></span>
          </div>
          <label for="checkGet">GET</label>
        </div>

        <div class="check-box">
          <div class="check">
            <input
              type="checkbox"
              id="checkPost"
              value="POST"
              @input="handleOnClickMeth"
              :checked="methList.includes('POST')"
            /><span class="checkmark"></span>
          </div>
          <label for="checkPost">POST</label>
        </div>

        <div class="check-box">
          <div class="check">
            <input
              type="checkbox"
              id="checkPut"
              value="PUT"
              @input="handleOnClickMeth"
              :checked="methList.includes('PUT')"
            /><span class="checkmark"></span>
          </div>
          <label for="checkPut">PUT</label>
        </div>

        <div class="check-box">
          <div class="check">
            <input
              type="checkbox"
              id="checkDelete"
              value="DELETE"
              @input="handleOnClickMeth"
              :checked="methList.includes('DELETE')"
            /><span class="checkmark"></span>
          </div>
          <label for="checkDelete">DELETE</label>
        </div>
      </div>
      <p v-if="notiMessage.isCheck == false" class="red-txt noti">{{ notiMessage.message }}</p>
    </div>
  </li>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { ValidationCheckType } from './Types';
import { useI18n } from 'vue-i18n';
const { t } = useI18n({});

const props = defineProps<{
  groupNm: string;
  value: string[];
  isvalid: boolean;
}>();

const emit = defineEmits<{
  (e: 'input', value: string[]): void;
  (e: 'update:isvalid', value: boolean): void;
}>();

const validationCheck: ValidationCheckType = {
  isCheck: null,
  message: '',
};

const notiMessage = ref(validationCheck);
const methList = ref([] as string[]);

watch(
  () => props.value,
  (val: string[]) => {
    methList.value = val;
    emit('update:isvalid', Boolean(methList.value.length));
  }
);

onMounted(() => {
  methList.value = props.value;
  emit('update:isvalid', Boolean(methList.value.length));
});

const handleOnClickMeth = (event: any) => {
  const value = event.target.value;

  if (methList.value.includes(value)) {
    methList.value = methList.value.filter((item: string) => item !== value);
  } else {
    methList.value.push(value);
  }

  if (methList.value.length) {
    setNotiMessage(true, '');
  } else {
    setNotiMessage(false, t('api.valid_check_method'));
  }

  emit('input', methList.value);
  emit('update:isvalid', Boolean(methList.value.length));
};

const setNotiMessage = (isCheck: boolean, message: string) => {
  notiMessage.value.isCheck = isCheck;
  notiMessage.value.message = message;
  return notiMessage;
};
</script>

<template>
  <li>
    <label for="" class="label point">{{ inputNm }}</label>
    <div class="form-cont">
      <div class="date-wrap">
        <div class="date-cont">
          <Datepicker
            multiCalendars
            locale="ko-KR"
            :disabled="disabled"
            v-model="startDate"
            :minDate="new Date()"
            @focus="notice()"
          />
        </div>
        <span class="text">~</span>
        <div class="date-cont">
          <Datepicker multiCalendars locale="ko-KR" v-model="endDate" :minDate="startDt" @focus="notice()" />
        </div>
      </div>
      <p v-if="(validation && startDt == null) || (validation && endDt == null)" class="red-txt noti">
        해당 헝목은 필수 입력값입니다.
      </p>
    </div>
  </li>
</template>
<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { computed, ref, watch } from 'vue';
import type { Ref } from 'vue';
const props = defineProps<{
  inputNm: string;
  placeholderStart: string;
  startDt: string;
  endDt: string;
  isValid: boolean | null;
  disabled?: boolean;
}>();
const emit = defineEmits<{
  (e: 'update:isValid', value: boolean): void;
  (e: 'update:startDt', value: string | null): void;
  (e: 'update:endDt', value: string | null): void;
}>();

const format = (dates: Date) => {
  return `${dates.toISOString().slice(0, 10)} `;
};

const validation = ref(false);
const startDate: Ref<Date | null> = computed({
  get: () => {
    if (props.startDt) {
      return new Date(props.startDt);
    } else {
      return null;
    }
  },
  set: (val) => {
    if (val !== null) {
      emit('update:startDt', val.toISOString().slice(0, 10) + ' 00:00:00');
    }
    console.log(val);
  },
});
const endDate: Ref<Date | null> = computed({
  get: () => {
    if (props.endDt) {
      return new Date(props.endDt);
    } else {
      return null;
    }
  },
  set: (val) => {
    if (val !== null) {
      emit('update:endDt', val.toISOString().slice(0, 10) + ' 23:59:59');
    }
    console.log(val);
  },
});

watch(startDate, () => {
  if (startDate.value == null) {
    emit('update:isValid', false);
  } else {
    emit('update:isValid', true);
  }
});
watch(endDate, () => {
  if (endDate.value == null) {
    emit('update:isValid', false);
  } else {
    emit('update:isValid', true);
  }
});

const notice = () => {
  validation.value = true;
};
</script>

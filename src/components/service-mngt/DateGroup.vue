<template>
  <li>
    <label for="" class="label point">{{ inputNm }} :</label>
    <div class="form-cont">
      <div class="date-wrap">
        <div class="date-cont">
          <Datepicker
            locale="ko-KR"
            :format="startDateFormat"
            :disabled="disabled"
            v-model="startDate"
            :minDate="new Date()"
            :enableTimePicker="false"
            @focus="notice()"
          />
        </div>
        <span class="text">~</span>
        <div class="date-cont">
          <Datepicker
            locale="ko-KR"
            :format="endDateFormat"
            v-model="endDate"
            :minDate="startDt"
            :enableTimePicker="false"
            @focus="notice()"
          />
        </div>
      </div>
      <p v-if="(validation && startDate == null) || (validation && endDate == null)" class="red-txt noti">
        {{ $t('service.empty_check') }}
      </p>
    </div>
  </li>
</template>
<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import { format } from 'date-fns';
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

const startDateFormat = () => {
  if (!startDate.value) {
    return '';
  }
  return format(startDate.value, 'yyyy-MM-dd HH:mm:ss');
};

const endDateFormat = () => {
  if (!endDate.value) {
    return '';
  }
  return format(endDate.value, 'yyyy-MM-dd HH:mm:ss');
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

<template>
  <li>
    <label for="" class="label point">{{ inputNm }}</label>
    <div class="form-cont">
      <div class="date-wrap">
        <div class="date-cont">
          <Datepicker
            :get-classes="getRangeClasses"
            v-model="start"
            value-type="format"
            format="YYYY-MM-DD"
            :defalut-value="new Date()"
            :disabled-date="disabledBeforeTodayAndAfterEndDay"
            placeholder="YYYY-MM-DD"
            @focus="noticeStart()"
          ></Datepicker>

          <!-- <i class="icon"><img src="@/assets/picker.svg" alt="달력아이콘" /></i> -->
        </div>
        <span class="text">~</span>
        <div class="date-cont">
          <Datepicker
            :get-classes="getRangeClasses"
            v-model="end"
            value-type="format"
            format="YYYY-MM-DD"
            :defalut-value="new Date()"
            :disabled-date="disabledBeforeTodayAndBeforeStartDay"
            placeholder="YYYY-MM-DD"
            @focus="noticeEnd()"
          ></Datepicker>

          <!-- <i class="icon"><img src="@/assets/picker.svg" alt="달력아이콘" /></i> -->
        </div>
      </div>
      <p
        v-if="(showStart && !start) || (showStart && !end) || (showEnd && !start) || (showEnd && !end)"
        class="red-txt noti"
      >
        해당 헝목은 필수 입력값입니다.
      </p>
    </div>
  </li>
</template>
<script setup lang="ts">
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { computed, ref, watch, type Ref } from 'vue';
const props = defineProps({
  inputNm: { type: String, require: false, default: '' },
  placeholderStart: { type: String, require: false, default: '' },
  placeholderEnd: { type: String, require: false, default: '' },
  startDt: { type: String || null, require: false, default: null },
  endDt: { type: String || null, require: false, default: null },
  isValid: { type: Boolean, require: false, default: true },
});

const showStart = ref(false);
const showEnd = ref(false);
const showCount = ref(false);

const emit = defineEmits<{
  (e: 'isValid', value: boolean): void;
  (e: 'startDt', value: string | null): void;
  (e: 'endDt', value: string | null): void;
}>();

const start: Ref<string | null> = computed({
  get: () => props.startDt,
  set: (val: string | null) => {
    if (val == null || val == '') {
      emit('startDt', val);
    } else {
      emit('startDt', val + ' 00:00:00');
    }
  },
});
const end: Ref<string | null> = computed({
  get: () => props.endDt,
  set: (val: string | null) => {
    if (val == null || val == '') {
      emit('endDt', val);
    } else {
      emit('endDt', val + ' 00:00:00');
    }
  },
});

watch(start, () => {
  if (start.value == null || end.value == null || start.value == '' || end.value == '') {
    emit('isValid', false);
  } else {
    emit('isValid', true);
  }
});

watch(end, () => {
  if (start.value == null || end.value == null || start.value == '' || end.value == '') {
    emit('isValid', false);
  } else {
    emit('isValid', true);
  }
});

const noticeStart = () => {
  showStart.value = true;
};

const noticeEnd = () => {
  showEnd.value = true;
};

const disabledBeforeTodayAndAfterEndDay = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today || date > new Date(end.value as string);
};

const disabledBeforeTodayAndBeforeStartDay = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today || date < new Date(start.value as string);
};

const getRangeClasses = (cellDate: Date, classnames: string) => {
  const classes = [];
  const startDate = start && new Date(start.value as string).setHours(0, 0, 0, 0);
  const endDate = end && new Date(end.value as string).setHours(0, 0, 0, 0);
  if (
    !/disabled|active|not-current-month/.test(classnames) &&
    start &&
    end &&
    cellDate.getTime() >= startDate &&
    cellDate.getTime() <= endDate
  ) {
    classes.push('in-range');
  }
  return classes;
};
</script>

<template>
  <div class="search-wrap monitor-search">
    <div class="search-cont">
      <h4 class="label-tit">{{ $t('control.select_time_period') }}</h4>

      <div class="radio-group" @change="handleChangeTime">
        <label class="radio-check" :for="minute.text" v-for="(minute, index) in minutes" :key="index">
          {{ minute.text }}
          <input
            type="radio"
            name="timeGroup"
            v-model="selectVal"
            :value="minute.value"
            :id="minute.text"
            :checked="minute.value == 1440"
          />
          <span class="radiomark"></span>
        </label>
      </div>
    </div>

    <div class="time-wrap">
      <span>{{ selectDate }} ~ {{ nowDate }}</span>
      <div id="timer" class="cicle-timer"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

import type { Ref } from 'vue';

import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';

const emit = defineEmits<{
  (e: 'changeTime', value: number): void;
}>();

const INTERVAL_VALUE = 60;

const selectVal = ref(0);
const timer = ref(0);
const chartCountPercentData = ref(0);
const chartCountTotalData = ref(100);
const callbackId = ref(0);

const myChart = ref({} as EChartsType);
const nowDate = ref('');
const selectDate = ref('');

watch(
  () => chartCountTotalData.value,
  () => {
    myChart.value.setOption(getTimerOption());
  }
);

onMounted(() => {
  selectVal.value = 1440;

  nowDate.value = getPauseTime('nowDate', 1440);
  selectDate.value = getPauseTime('selectDate', 1440);

  const dom = document.getElementById('timer') as HTMLDivElement;
  myChart.value = echarts.init(dom);

  myChart.value.setOption(getTimerOption());
  window.addEventListener('resize', () => {
    myChart.value.resize();
  });

  emit('changeTime', 1440);
  countTimer();
});

onUnmounted(() => {
  clearInterval(callbackId.value);
});

const countTimer = () => {
  callbackId.value = setInterval(() => {
    setTimer();
  }, 1000);
};

const setTimer = () => {
  timer.value = timer.value + 1;
  if (timer.value > INTERVAL_VALUE) {
    timer.value = 0;
    nowDate.value = getPauseTime('nowDate', selectVal.value);
    selectDate.value = getPauseTime('selectDate', selectVal.value);
    emit('changeTime', selectVal.value);
  }
  chartCountPercentData.value = (timer.value / INTERVAL_VALUE) * 100;
  chartCountTotalData.value = ((INTERVAL_VALUE - timer.value) / INTERVAL_VALUE) * 100;
};

const handleChangeTime = (event: any) => {
  timer.value = 0;
  nowDate.value = getPauseTime('nowDate', selectVal.value);
  selectDate.value = getPauseTime('selectDate', selectVal.value);
  emit('changeTime', Number(event.target.value));
};

const getPauseTime = (d: string, selectTm: number): string => {
  let today = new Date();

  if (d != 'nowDate') today = new Date(today.getTime() - selectTm * (60 * 1000));
  else today.setMinutes(today.getMinutes() - 1);

  let year = today.getFullYear();
  let month = String(today.getMonth() + 1).padStart(2, '0');
  let date = today.getDate();
  let hours = String(today.getHours()).padStart(2, '0');
  let minutes = String(today.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${date} ${hours}:${minutes}`;
};

const getTimerOption = () => {
  const timerOption: echarts.EChartsOption = {
    title: {
      show: false,
    },

    backgroundColor: '#F3F7F9',
    series: [
      {
        center: ['40%', '58%'],
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: [{ value: chartCountPercentData.value }, { value: chartCountTotalData.value }],
        emphasis: {
          disabled: true,
        },
      },
    ],
    color: ['#000000', '#D5D5D5'],
  };

  return timerOption;
};

const minutes = [
  {
    value: 1440,
    text: '24Hour',
  },
  {
    value: 720,
    text: '12Hour',
  },
  {
    value: 360,
    text: '6Hour',
  },
  {
    value: 60,
    text: '1Hour',
  },
  {
    value: 30,
    text: '30Min',
  },
  {
    value: 10,
    text: '10Min',
  },
  {
    value: 5,
    text: '5Min',
  },
];
</script>

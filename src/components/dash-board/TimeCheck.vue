<template>
  <section class="time-wrap" style="height: 28px">
    <span v-show="!isPlay && !isLoadData">{{ $t('dash_board.pause_time') + ':' + getPause() }} </span>
    <button>
      <i><img src="@/assets/pause_ico.svg" v-show="isPlay && !isLoadData" @click="onCountPause()" alt="pause" /></i>
      <i><img src="@/assets/play_arrow.svg" v-show="!isPlay && !isLoadData" @click="onCountStart()" alt="play" /></i>
    </button>
    <div v-show="!isLoadData" id="timer" class="cicle-timer" />
    <div v-show="isLoadData" ref="progressChartRef" id="progressChart" style="height: 100%; width: 10%"></div>
  </section>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { getPauseTime } from '@/utils/converter';
import * as echarts from 'echarts';

const INTERVAL_VALUE = 60;

const timer = ref(0);
const chartCountPercentData = ref(0);
const chartCountTotalData = ref(100);
const countChart = ref({} as echarts.EChartsType);
const loadingChart = {} as echarts.EChartsType;

const intervalId = ref(0);
const isPlay = ref(true);
const isProgressDomInit = ref(false);

const props = defineProps({
  isLoadData: {
    type: Boolean,
    required: true,
    default: false,
  },
});

onMounted(() => {
  setCountChart();
});

const setCountChart = () => {
  const dom = document.getElementById('timer') as HTMLDivElement;
  // countChart.value = echarts.init(dom);
  // countChart.value.setOption(getTimerOption());
};

const getTimerOption = () => {
  const timerOption: echarts.EChartsOption = {
    title: {
      show: false,
    },

    backgroundColor: '#FFFFFF',
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

const getPause = () => {
  return getPauseTime();
};

const onCountPause = () => {
  isPlay.value = false;
  clearInterval(intervalId.value);
};

const onCountStart = () => {
  isPlay.value = true;
  countTimer();
};

const countTimer = () => {};
</script>
<style>
.cicle-timer {
  margin-bottom: 4px;
  background-color: #f3f3f3;
  width: 24px;
  height: 24px;
}
</style>

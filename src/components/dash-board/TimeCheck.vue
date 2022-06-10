<template>
  <section class="time-wrap" style="height: 28px">
    <span v-show="!isPlay && !isLoadData">{{ $t('dash_board.pause_time') + ':' + getPause() }} </span>
    <button>
      <i><img src="@/assets/pause_ico.svg" v-show="isPlay && !isLoadData" @click="onCountPause()" alt="pause" /></i>
      <i><img src="@/assets/play_arrow.svg" v-show="!isPlay && !isLoadData" @click="onCountStart()" alt="play" /></i>
    </button>
    <div v-show="!isLoadData" id="timer" class="cicle-timer"></div>
    <div v-show="isLoadData" ref="progressChartRef" id="progressChart" style="height: 100%; width: 10%"></div>
  </section>
</template>
<script setup lang="ts">
import { onMounted, onUpdated, ref, watch } from 'vue';
import { getPauseTime } from '@/utils/converter';
import * as echarts from 'echarts';
import { timerOption, getTimerOption } from '@/components/dash-board/chart-options';

const INTERVAL_VALUE = 60;

const timer = ref(0);
const chartCountPercentData = ref(0);
const chartCountTotalData = ref(100);
const countChart = ref({} as echarts.EChartsType);
const loadingChart = ref({} as echarts.EChartsType);

const intervalId = ref(0);
const isPlay = ref(true);
const isProgressDomInit = ref(false);

const props = defineProps({
  isLoadData: {
    type: Boolean,
    required: true,
    default: false,
  },
  callBack: {
    type: Function,
    required: true,
  },
});

onMounted(() => {
  setCountChart();
});

onUpdated(() => {
  if (!isProgressDomInit.value) {
    initChartAndDomProgress();
  }
  observeSize();
});

const initChartAndDomProgress = () => {
  isProgressDomInit.value = true;
  setProgressChart();
};

const width1 = ref(0);
const height1 = ref(0);
const progressChartRef = ref<HTMLDivElement | null>(null);
const observeSize = () => {
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      width1.value = width;
      height1.value = height;
    });
  });
  ro.observe(progressChartRef.value as HTMLDivElement);
};

watch(width1, () => {
  loadingChart.value.resize();
  countChart.value.resize();
});

watch(
  () => props.isLoadData,
  () => {
    console.log('changed LoadData!!', props.isLoadData);
    if (props.isLoadData) {
      clearInterval(intervalId.value);
    } else {
      onCountStart();
    }
  }
);

const setCountChart = () => {
  const dom = document.getElementById('timer') as HTMLDivElement;
  countChart.value = echarts.init(dom);
  countChart.value.setOption(getTimerOption(chartCountPercentData.value, chartCountTotalData.value));
};
const setProgressChart = () => {
  var chartDom = document.getElementById('progressChart') as HTMLDivElement;
  loadingChart.value = echarts.init(chartDom);
  loadingChart.value.setOption(timerOption);
};

const setTimer = async () => {
  if (timer.value >= INTERVAL_VALUE) {
    timer.value = 0;
    chartCountPercentData.value = 0;
    chartCountTotalData.value = 100;
    props.callBack();
    return;
  }

  timer.value++;
  chartCountPercentData.value = (timer.value / INTERVAL_VALUE) * 100;
  chartCountTotalData.value = ((INTERVAL_VALUE - timer.value) / INTERVAL_VALUE) * 100;
};
const countTimer = () => {
  intervalId.value = setInterval(setTimer, 1000);
};

const getPause = () => {
  return getPauseTime();
};

const onCountPause = () => {
  isPlay.value = false;
  clearInterval(intervalId.value);
};

const onCountStart = () => {
  console.log('onCountStart');
  isPlay.value = true;
  countTimer();
};
</script>

<style>
.cicle-timer {
  margin-bottom: 4px;
  background-color: #f3f3f3;
  width: 24px;
  height: 24px;
}
</style>

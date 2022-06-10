<template>
  <section class="time-wrap" style="height: 28px">
    <span v-show="!isPlay && !isLoadData">{{ $t('dash_board.pause_time') + ':' + getPauseTime() }} </span>
    <button>
      <i><img src="@/assets/pause_ico.svg" v-show="isPlay && !isLoadData" @click="onCountPause()" alt="pause" /></i>
      <i><img src="@/assets/play_arrow.svg" v-show="!isPlay && !isLoadData" @click="onCountStart()" alt="play" /></i>
    </button>
    <div v-show="!isLoadData" id="timer" class="cicle-timer"></div>
    <div v-show="isLoadData" ref="progressChartRef" id="progressChart" style="height: 100%; width: 10%"></div>
  </section>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, onUpdated, ref, watch } from 'vue';
import { getPauseTime } from '@/utils/converter';
import { timerOption, getTimerOption } from '@/components/dash-board/chart-options';
import { drawTotalApiTrafficChart } from '@/utils/chart';

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
  // 60초 카운트 차트(Pie) Init & Draw
  countChart.value = drawTotalApiTrafficChart(
    'timer',
    getTimerOption(chartCountPercentData.value, chartCountTotalData.value)
  );
  window.addEventListener('resize', observeSize);
});

onUpdated(() => {
  // Dom이 Init되지 않았을 때만 Init
  if (!isProgressDomInit.value) {
    isProgressDomInit.value = true;
    loadingChart.value = drawTotalApiTrafficChart('progressChart', timerOption);
  }
  observeSize();
});

onUnmounted(() => {
  window.removeEventListener('resize', observeSize);
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

const onCountPause = () => {
  isPlay.value = false;
  clearInterval(intervalId.value);
};

const onCountStart = () => {
  console.log('onCountStart');
  isPlay.value = true;
  intervalId.value = setInterval(setTimer, 1000);
};

watch(chartCountTotalData, () => {
  countChart.value.setOption(getTimerOption(chartCountPercentData.value, chartCountTotalData.value));
});

// resize 관련 함수들
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
</script>

<style>
.cicle-timer {
  margin-bottom: 4px;
  background-color: #f3f3f3;
  width: 24px;
  height: 24px;
}
</style>

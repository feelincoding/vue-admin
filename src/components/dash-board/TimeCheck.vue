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
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { timerOption } from '@/components/dash-board/chartDummy';
import { getPauseTime } from '@/utils/converter';
import * as echarts from 'echarts';

const INTERVAL_VALUE = 60;

@Component
export default class TimeCheck extends Vue {
  @Prop() callBack!: () => void;
  @Prop({ default: false }) isLoadData!: boolean;

  timer = 0;
  chartCountPercentData = 0;
  chartCountTotalData = 100;
  countChart = {} as echarts.EChartsType;
  loadingChart = {} as echarts.EChartsType;

  intervalId = 0;
  isPlay = true;

  isProgressDomInit = false;

  initChartAndDom() {
    this.setCountChart();
  }
  initChartAndDomProgress() {
    this.isProgressDomInit = true;
    this.setProgressChart();
  }

  mounted() {
    this.initChartAndDom();
  }

  updated() {
    if (!this.isProgressDomInit) {
      this.initChartAndDomProgress();
    }
    this.observeSize();
  }

  @Watch('isLoadData')
  onLoad() {
    if (this.isLoadData) {
      clearInterval(this.intervalId);
    } else {
      this.onCountStart();
    }
  }

  countTimer() {
    this.intervalId = setInterval(this.setTimer, 1000);
  }

  async setTimer() {
    if (this.timer >= INTERVAL_VALUE) {
      this.timer = 0;
      this.chartCountPercentData = 0;
      this.chartCountTotalData = 100;
      this.callBack();
      return;
    }

    this.timer = this.timer + 1;
    this.chartCountPercentData = (this.timer / INTERVAL_VALUE) * 100;
    this.chartCountTotalData = ((INTERVAL_VALUE - this.timer) / INTERVAL_VALUE) * 100;
  }

  destroyed() {
    clearInterval(this.intervalId);
  }

  onCountPause() {
    this.isPlay = false;
    clearInterval(this.intervalId);
  }

  onCountStart() {
    this.isPlay = true;
    this.countTimer();
  }

  setProgressChart() {
    var chartDom = document.getElementById('progressChart') as HTMLDivElement;
    this.loadingChart = echarts.init(chartDom);
    this.loadingChart.setOption(timerOption);
  }

  width = 0;
  height = 0;
  observeSize() {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        this.width = width;
        this.height = height;
      });
    });
    ro.observe(this.$refs.progressChartRef as HTMLDivElement);
  }

  @Watch('width')
  onWidthChange() {
    this.loadingChart.resize();
    this.countChart.resize();
  }

  setCountChart() {
    const dom = document.getElementById('timer') as HTMLDivElement;
    this.countChart = echarts.init(dom);

    this.countChart.setOption(this.getTimerOption());
  }

  getPause = () => {
    return getPauseTime();
  };

  @Watch('chartCountTotalData')
  onCountChange() {
    this.countChart.setOption(this.getTimerOption());
  }

  getTimerOption() {
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
          data: [{ value: this.chartCountPercentData }, { value: this.chartCountTotalData }],
          emphasis: {
            disabled: true,
          },
        },
      ],
      color: ['#000000', '#D5D5D5'],
    };

    return timerOption;
  }
}
</script>
<style>
.cicle-timer {
  margin-bottom: 4px;
  background-color: #f3f3f3;
  width: 24px;
  height: 24px;
}
</style>

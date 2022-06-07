<template>
  <div class="chart-wrap">
    <h3 class="h3-tit">전일대비/전주대비 응답시간 추이 (00:00 ~ 24:00)</h3>
    <ErrorWrapper v-show="isCommError" />
    <div class="chart-group" id="lastResponse" ref="lastResponseRef"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, PropSync } from 'vue-property-decorator';
import * as echarts from 'echarts';
import { LastResponseType } from '@/types/DashBoardType';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';

@Component({
  components: { ErrorWrapper },
})
export default class LastResponse extends Vue {
  @Prop() lastResponseList!: LastResponseType[];
  @PropSync('isCommError', { type: Boolean, default: false }) syncedIsCommError!: boolean;
  lastResponseChart = {} as echarts.EChartsType;

  setChartData() {
    this.lastResponseChart.setOption(this.getLastResponseChartOption());
  }

  mounted() {
    const dom = document.getElementById('lastResponse') as HTMLDivElement;
    this.lastResponseChart = echarts.init(dom);
    window.addEventListener('resize', this.observeSize);
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.observeSize);
  }

  resizeChart() {
    this.lastResponseChart.resize();
  }

  @Watch('width')
  onWidthChange() {
    this.resizeChart();
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
    ro.observe(this.$refs.lastResponseRef as HTMLDivElement);
  }

  getLastResponseChartOption() {
    const option: echarts.EChartsOption = {
      // legend: {
      //   data: ['today, lastDay, lastWeek'],
      // },
      legend: {
        show: true,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        trigger: 'axis',
      },
      toolbox: {
        left: 'right',
        itemSize: 20,
        top: -5,
        feature: {
          dataZoom: {
            show: false,
            yAxisIndex: 'none',
          },
          restore: {},
        },
      },
      backgroundColor: '#fff',
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: this.lastResponseList.map((item) => item.statBaseTm.slice(11, 16)),
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          interval: 179,
          showMaxLabel: true,
        },
      },
      yAxis: {
        type: 'value',
      },
      grid: {
        top: 40,
        left: 5,
        right: 20,
        bottom: 20,
        containLabel: true,
      },
      dataZoom: [
        {
          id: 'dataZoomX',
          type: 'inside',
          xAxisIndex: [0],
        },
      ],
      series: [
        {
          name: '금일',
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          tooltip: {
            valueFormatter: function (value) {
              return value + ' ms';
            },
          },
          data: this.lastResponseList.map((item) => {
            return item.todayAvgResTm as number;
          }),
          smooth: true,
        },
        {
          name: '전일',
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          tooltip: {
            valueFormatter: function (value) {
              return value + ' ms';
            },
          },
          data: this.lastResponseList.map((item) => {
            return item.ystdayAvgResTm;
          }),
          smooth: true,
        },
        {
          name: '전주',
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          tooltip: {
            valueFormatter: function (value) {
              return value + ' ms';
            },
          },
          data: this.lastResponseList.map((item) => {
            return item.lstWkAvgResTm;
          }),
          smooth: true,
        },
      ],
    };

    return option;
  }

  @Watch('lastResponseList')
  changedLastResponseList() {
    this.setChartData();
  }
}
</script>

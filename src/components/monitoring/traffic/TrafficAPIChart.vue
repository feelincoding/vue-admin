<template>
  <h3 class="h3-tit">{{ $t('traffic.api_traffic') }}</h3>
  <div class="chart-group chart-group-height" id="trafficAPI" ref="trafficAPI"></div>
</template>
<!-- <script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as echarts from 'echarts';
import { TrafficApi } from '@/types/MonitoringTrafficType';

@Component
export default class TrafficAPIChart extends Vue {
  @Prop() apiList!: TrafficApi[];
  @Prop() timeUnit!: string;
  trafficAPIChart = {} as echarts.EChartsType;

  mounted() {
    console.log(this.apiList);
    const dom = document.getElementById('trafficAPI') as HTMLDivElement;
    this.trafficAPIChart = echarts.init(dom);
    window.addEventListener('resize', this.observeSize);
    this.trafficAPIChart.setOption(this.getTrafficAPIChartOption(this.apiList));
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.observeSize);
  }

  resizeChart() {
    this.trafficAPIChart.resize();
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
    ro.observe(this.$refs.trafficAPI as HTMLDivElement);
  }

  getTrafficAPIChartOption(apiList: TrafficApi[]) {
    const trafficAPIOption: echarts.EChartsOption = {
      legend: {
        show: true,
      },

      tooltip: {
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
        boundaryGap: false,
        data: apiList[0].apiTrafc.map((item) =>
          this.timeUnit === 'MM'
            ? item.statBaseTm.slice(5, 7) + '월'
            : this.timeUnit === 'DD'
            ? item.statBaseTm.slice(5, 7) + '월 ' + item.statBaseTm.slice(8, 10) + '일'
            : this.timeUnit === 'HH'
            ? item.statBaseTm.slice(5, 7) +
              '월 ' +
              item.statBaseTm.slice(8, 10) +
              '일 ' +
              item.statBaseTm.slice(11, 13) +
              '시 '
            : item.statBaseTm.slice(5, 7) +
              '월 ' +
              item.statBaseTm.slice(8, 10) +
              '일 ' +
              item.statBaseTm.slice(11, 13) +
              '시 ' +
              item.statBaseTm.slice(14, 16) +
              '분'
        ),

        axisPointer: {
          type: 'line',
          label: {
            backgroundColor: '#777',
          },
        },
        // axisLabel: {
        //   inside: true,
        //   formatter: '{value}\n',
        // },
      },
      axisPointer: {
        label: {
          backgroundColor: '#777',
        },
      },

      yAxis: {
        type: 'value',
        axisTick: {
          inside: false,
        },
        splitLine: {
          show: true,
        },
        axisLabel: {
          inside: false,
          formatter: '{value}\n',
        },
        z: 10,
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
          type: 'inside',
          throttle: 50,
        },
      ],
      series: apiList.map((api) => {
        return {
          name: api.apiId,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          data: api.apiTrafc.map((item) => item.totCnt),
        };
      }),
    };

    return trafficAPIOption;
  }

  @Watch('apiList')
  changedApiList() {
    this.trafficAPIChart.clear();
    this.trafficAPIChart.setOption(this.getTrafficAPIChartOption(this.apiList));
    this.trafficAPIChart.resize();
  }
}
</script> -->

<style scoped>
.chart-group-height {
  height: 340px;
}
</style>

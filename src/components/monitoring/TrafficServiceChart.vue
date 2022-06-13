<template>
  <!-- <h3 class="h3-tit">서비스 트래픽</h3> -->
  <div class="chart-group chart-group-height" id="trafficService" ref="trafficServiceRef"></div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as echarts from 'echarts';
import { TrafficService } from '@/types/MonitoringTrafficType';

@Component
export default class TrafficServiceChart extends Vue {
  @Prop() serviceList!: TrafficService[];
  @Prop() timeUnit!: string;
  trafficServiceChart = {} as echarts.EChartsType;

  mounted() {
    console.log(this.serviceList);
    const dom = document.getElementById('trafficService') as HTMLDivElement;
    this.trafficServiceChart = echarts.init(dom);
    window.addEventListener('resize', this.observeSize);
    this.trafficServiceChart.setOption(this.getTrafficServiceChartOption(this.serviceList));
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.observeSize);
  }

  resizeChart() {
    this.trafficServiceChart.resize();
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
    ro.observe(this.$refs.trafficServiceRef as HTMLDivElement);
  }

  getTrafficServiceChartOption(trafficService: TrafficService[]) {
    const trafficServiceOption: echarts.EChartsOption = {
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
        data: trafficService[0].svcTrafc.map((item) =>
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
      series: trafficService.map((service) => {
        return {
          name: service.svcId,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 5,
          data: service.svcTrafc.map((item) => item.totCnt),
        };
      }),
    };
    console.log(trafficServiceOption);
    return trafficServiceOption;
  }

  @Watch('serviceList')
  changedServiceList() {
    console.log('list is changed');
    this.trafficServiceChart.clear();
    this.trafficServiceChart.setOption(this.getTrafficServiceChartOption(this.serviceList));

    this.trafficServiceChart.resize();
    console.log(this.serviceList);
    console.log(this.trafficServiceChart);
  }
}
</script>
<style scoped>
.chart-group-height {
  height: 340px;
}
</style>

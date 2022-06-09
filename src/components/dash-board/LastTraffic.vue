<!-- <template>
  <div class="chart-wrap">
    <h3 class="h3-tit">전일대비/전주대비 Traffic 추이 (00:00 ~ 24:00)</h3>
    <ErrorWrapper v-show="isCommError" />
    <div class="chart-group" id="lastTraffic" ref="lastTrafficRef"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, PropSync } from 'vue-property-decorator';
import * as echarts from 'echarts';
import { LastTrafficType } from '@/types/DashBoardType';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';

@Component({
  components: { ErrorWrapper },
})
export default class LastTraffic extends Vue {
  @Prop() lastTrafficList!: LastTrafficType[];
  @PropSync('isCommError', { type: Boolean, default: false }) syncedIsCommError!: boolean;
  lastTrafficChart = {} as echarts.EChartsType;

  setChartData() {
    this.lastTrafficChart.setOption(this.getLastTrafficChartOption());
  }

  mounted() {
    const dom = document.getElementById('lastTraffic') as HTMLDivElement;
    this.lastTrafficChart = echarts.init(dom);
    window.addEventListener('resize', this.observeSize);
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.observeSize);
  }

  resizeChart() {
    this.lastTrafficChart.resize();
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
    ro.observe(this.$refs.lastTrafficRef as HTMLDivElement);
  }

  getLastTrafficChartOption() {
    const lastTrafficOption: echarts.EChartsOption = {
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
        boundaryGap: false,
        data: this.lastTrafficList.map((item) => item.statBaseTm.slice(11, 16)),
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          interval: 179,
          showMaxLabel: true,
        },
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
      series: [
        {
          name: '금일',
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          tooltip: {
            valueFormatter: function (value) {
              return value + ' 건';
            },
          },
          data: this.lastTrafficList.map((item) => item.todayCnt),
          smooth: true,
        },
        {
          name: '전일',
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          tooltip: {
            valueFormatter: function (value) {
              return value + ' 건';
            },
          },
          data: this.lastTrafficList.map((item) => item.ystdayCnt),
          smooth: true,
        },
        {
          name: '전주',
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          tooltip: {
            valueFormatter: function (value) {
              return value + ' 건';
            },
          },
          data: this.lastTrafficList.map((item) => {
            return item.lstWkCnt;
          }),
          smooth: true,
        },
      ],
    };

    return lastTrafficOption;
  }

  @Watch('lastTrafficList')
  changedLastResponseList() {
    this.setChartData();
  }
}
</script> -->

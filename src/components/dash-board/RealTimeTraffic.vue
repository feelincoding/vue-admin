<template>
  <div class="chart-wrap">
    <h3 class="h3-tit">실시간 Traffic</h3>
    <div ref="RealTimeTraffic" class="chart-group" id="real-time-traffic"></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import * as echarts from 'echarts';
@Component({
  components: {
    ModalLayout,
  },
})
export default class RealTimeTraffic extends Vue {
  @PropSync('modal', { type: Boolean, default: false }) syncedModal!: boolean;
  @PropSync('setParamData', { type: Object, default: {} }) clickedParamData!: any;
  setClickedParam(paramData: object) {
    this.clickedParamData = paramData;
  }

  showModal() {
    this.syncedModal = true;
  }
  width = 0;
  height = 0;
  myChart = {} as echarts.EChartsType;
  dom = {} as HTMLDivElement;

  base = +new Date(2022, 2, 30);
  oneDay = 24 * 3600 * 1000;
  date = [] as any;
  data1 = [Math.random() * 50];
  data2 = [Math.random() * 40];
  data3 = [Math.random() * 30];
  data4 = [Math.random() * 30];
  data5 = [Math.random() * 30];
  data6 = [Math.random() * 20];
  data7 = [Math.random() * 10];
  now: any = new Date(this.base);

  mounted() {
    this.dom = document.getElementById('real-time-traffic') as HTMLDivElement;
    this.myChart = echarts.init(this.dom);
    for (var i = 1; i < 30; i++) {
      this.addData();
    }
    this.myChart.setOption(this.option);
    setInterval(() => {
      this.addData();
      this.myChart.setOption({
        xAxis: {
          data: this.date,
        },
        series: [
          {
            name: 'KTDS',
            data: this.data1,
          },
          {
            name: 'KAKAO',
            data: this.data2,
          },
          {
            name: 'NAVER',
            data: this.data3,
          },
          {
            name: 'CUPANG',
            data: this.data4,
          },
          {
            name: 'GOOGLE',
            data: this.data5,
          },
          {
            name: 'FACEBOOK',
            data: this.data6,
          },
          {
            name: 'INSTAGRAM',
            data: this.data7,
          },
        ],
      });
    }, 300);

    this.myChart.on('click', (params) => {
      this.showModal();
      this.setClickedParam(params as object);
    });
    window.addEventListener('resize', () => {
      this.myChart.resize();
    });
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        this.width = width;
        this.height = height;
      });
      this.myChart.resize();
    });
    ro.observe(this.$refs.RealTimeTraffic as HTMLDivElement);
  }

  addData() {
    this.now = [this.now.getFullYear(), this.now.getMonth() + 1, this.now.getDate()].join('/');
    this.date.push(this.now);
    this.data1.push(Math.random() * (150 - 1) + this.data1[this.data1.length - 1]);
    this.data2.push(Math.random() * (100 - 20) + this.data2[this.data2.length - 1]);
    this.data3.push(Math.random() * (120 - 10) + this.data3[this.data3.length - 1]);
    this.data4.push(Math.random() * (80 - 30) + this.data4[this.data4.length - 1]);
    this.data5.push(Math.random() * (20 - 10) + this.data5[this.data5.length - 1]);
    this.data6.push(Math.random() * (70 - 30) + this.data6[this.data6.length - 1]);
    this.data7.push(Math.random() * (30 - 20) + this.data7[this.data7.length - 1]);

    this.now = new Date(+new Date(this.now) + this.oneDay);
  }

  option = {
    animationDuration: 10000,
    legend: {
      data: ['KTDS', 'KAKAO', 'NAVER', 'CUPANG', 'GOOGLE', 'FACEBOOK', 'INSTAGRAM'],
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',

      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      nameLocation: 'middle',
      data: this.date,
    },
    yAxis: {
      boundaryGap: [0, '50%'],
      type: 'value',
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '10%',
      top: '10%',
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
        name: 'KTDS',
        type: 'line',
        showSymbol: false,
        data: this.data1,
        color: 'red',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'KTDS : ' + params.value.toFixed(0);
          },
        },
      },
      {
        name: 'KAKAO',
        type: 'line',
        showSymbol: false,
        data: this.data2,
        color: 'yellow',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'KAKAO : ' + params.value.toFixed(0);
          },
        },
      },
      {
        name: 'NAVER',
        type: 'line',
        showSymbol: false,
        data: this.data3,
        color: 'green',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'NAVER : ' + params.value.toFixed(0);
          },
        },
      },
      {
        name: 'CUPANG',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: this.data4,
        color: 'blue',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'CUPANG : ' + params.value.toFixed(0);
          },
        },
      },
      {
        name: 'GOOGLE',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: this.data5,
        color: 'black',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'GOOGLE : ' + params.value.toFixed(0);
          },
        },
      },
      {
        name: 'FACEBOOK',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: this.data6,
        color: 'orange',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'FACEBOOK : ' + params.value.toFixed(0);
          },
        },
      },
      {
        name: 'INSTAGRAM',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: this.data7,
        color: 'purple',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'INSTAGRAM : ' + params.value.toFixed(0);
          },
        },
      },
    ],
  };
}
</script>
<style scoped>
.realtime-modal {
  width: 100%;
  height: 100%;
}
</style>

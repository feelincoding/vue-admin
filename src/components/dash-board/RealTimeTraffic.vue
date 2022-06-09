<template>
  <div class="chart-wrap">
    <h3 class="h3-tit">실시간 Traffic</h3>
    <div ref="RealTimeTrafficRef" class="chart-group" id="real-time-traffic"></div>
  </div>
</template>
<script setup lang="ts">
// import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import { onMounted, onUnmounted, onUpdated, ref, watch, type Ref } from 'vue';

import * as echarts from 'echarts';

const props = defineProps({
  syncedModal: {
    type: Boolean,
    default: false,
  },
  clickedParamData: {
    type: Object,
    default: () => ({}),
  },
});

const setClickedParam = (paramData: object) => {
  props.clickedParamData.value = paramData;
};

const showModal = () => {
  // emit써야댐
  // props.syncedModal = true;
};

const myChart = ref({} as echarts.EChartsType);
const dom = ref({} as HTMLDivElement);

const base = +ref(new Date(2022, 2, 30));
const oneDay = ref(24 * 3600 * 1000);
const date = ref([] as any);
const data1 = ref([Math.random() * 50]);
const data2 = ref([Math.random() * 40]);
const data3 = ref([Math.random() * 30]);
const data4 = ref([Math.random() * 30]);
const data5 = ref([Math.random() * 30]);
const data6 = ref([Math.random() * 20]);
const data7 = ref([Math.random() * 10]);

let now = new Date(base);
const width1 = ref(0);
const height1 = ref(0);
const RealTimeTrafficRef = ref<HTMLDivElement | null>(null);
const observeSize = () => {
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      width1.value = width;
      height1.value = height;
    });
  });
  ro.observe(RealTimeTrafficRef.value as HTMLDivElement);
};

watch(width1, () => {
  resizeChart();
});
onMounted(() => {
  dom.value = document.getElementById('real-time-traffic') as HTMLDivElement;
  myChart.value = echarts.init(dom.value);
  for (var i = 1; i < 30; i++) {
    addData();
  }
  myChart.value.setOption(option);
  setInterval(() => {
    addData();
    myChart.value.setOption({
      xAxis: {
        data: date.value,
      },
      series: [
        {
          name: 'KTDS',
          data: data1.value,
        },
        {
          name: 'KAKAO',
          data: data2.value,
        },
        {
          name: 'NAVER',
          data: data3.value,
        },
        {
          name: 'CUPANG',
          data: data4.value,
        },
        {
          name: 'GOOGLE',
          data: data5.value,
        },
        {
          name: 'FACEBOOK',
          data: data6.value,
        },
        {
          name: 'INSTAGRAM',
          data: data7.value,
        },
      ],
    });
  }, 300);

  myChart.value.on('click', (params) => {
    showModal();
    setClickedParam(params as object);
  });
  window.addEventListener('resize', observeSize);
});

const resizeChart = () => {
  myChart.value.resize();
};

const addData = () => {
  now = new Date([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
  date.value.push(now);
  data1.value.push(Math.random() * (150 - 1) + data1.value[data1.value.length - 1]);
  data2.value.push(Math.random() * (100 - 20) + data2.value[data2.value.length - 1]);
  data3.value.push(Math.random() * (120 - 10) + data3.value[data3.value.length - 1]);
  data4.value.push(Math.random() * (80 - 30) + data4.value[data4.value.length - 1]);
  data5.value.push(Math.random() * (20 - 10) + data5.value[data5.value.length - 1]);
  data6.value.push(Math.random() * (70 - 30) + data6.value[data6.value.length - 1]);
  data7.value.push(Math.random() * (30 - 20) + data7.value[data7.value.length - 1]);

  now = new Date(+new Date(now) + oneDay.value);
};

const option = {
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
    data: date.value,
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
      data: data1.value,
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
      data: data2.value,
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
      data: data3.value,
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
      data: data4.value,
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
      data: data5.value,
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
      data: data6.value,
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
      data: data7.value,
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
</script>
<style scoped>
.realtime-modal {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="chart-wrap" style="height: 100%" id="chart-container">
    <h3 class="h3-tit">실시간 Traffic</h3>
    <div class="chart-group" id="real-time-traffic" :style="{ height: `${containerHeight}px` }" ref="realTimeRef"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import * as echarts from 'echarts';
import { addDate } from '@/utils/converter';
import { getRealTimeChartOption } from '@/components/dash-board/chartOptions';

const myChart = shallowRef({} as echarts.EChartsType);
const dom = shallowRef({} as HTMLDivElement);
const dom2 = shallowRef({} as HTMLDivElement);
const base = ref(new Date(2022, 2, 30));
const date = ref([] as any);
const data1 = ref([Math.random() * 50]);
const data2 = ref([Math.random() * 40]);
const data3 = ref([Math.random() * 30]);
const data4 = ref([Math.random() * 30]);
const data5 = ref([Math.random() * 30]);
const data6 = ref([Math.random() * 20]);
const data7 = ref([Math.random() * 10]);
const containerHeight = ref(0);
const chartResize = () => {
  myChart.value.resize();
};
const calcedWidth = ref(0);
const calcedheight = ref(0);
const realTimeRef = ref<HTMLDivElement | null>(null);
const observeSize = () => {
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      calcedWidth.value = width;
      calcedheight.value = height;
    });
  });
  ro.observe(realTimeRef.value as HTMLDivElement);
};
watch(calcedheight, () => {
  chartResize();
});

onMounted(() => {
  window.addEventListener('resize', () => chartResize(), { passive: true });
  dom.value = document.getElementById('real-time-traffic') as HTMLDivElement;
  dom2.value = document.getElementById('chart-container') as HTMLDivElement;
  containerHeight.value = dom2.value.clientHeight - 24;
  myChart.value = echarts.init(dom.value);
  for (var i = 1; i < 30; i++) {
    addData();
  }

  myChart.value.setOption(
    getRealTimeChartOption(
      date.value,
      data1.value,
      data2.value,
      data3.value,
      data4.value,
      data5.value,
      data6.value,
      data7.value
    )
  );
  observeSize();
  setInterval(() => {
    addData();
    myChart.value.setOption(
      getRealTimeChartOption(
        date.value,
        data1.value,
        data2.value,
        data3.value,
        data4.value,
        data5.value,
        data6.value,
        data7.value
      )
    );
  }, 300);
});

onUnmounted(() => {
  window.removeEventListener('resize', () => chartResize());
});

const addData = () => {
  base.value = addDate(base.value, 1);
  date.value.push([base.value.getFullYear(), base.value.getMonth() + 1, base.value.getDate()].join('/'));
  data1.value.push(Math.random() * (150 - 1) + data1.value[data1.value.length - 1]);
  data2.value.push(Math.random() * (100 - 20) + data2.value[data2.value.length - 1]);
  data3.value.push(Math.random() * (120 - 10) + data3.value[data3.value.length - 1]);
  data4.value.push(Math.random() * (80 - 30) + data4.value[data4.value.length - 1]);
  data5.value.push(Math.random() * (20 - 10) + data5.value[data5.value.length - 1]);
  data6.value.push(Math.random() * (70 - 30) + data6.value[data6.value.length - 1]);
  data7.value.push(Math.random() * (30 - 20) + data7.value[data7.value.length - 1]);
};
</script>

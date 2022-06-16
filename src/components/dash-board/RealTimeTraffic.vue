<template>
  <div class="chart-wrap" style="height: 100%">
    <h3 class="h3-tit">실시간 Traffic</h3>
    <div ref="RealTimeTrafficRef" class="chart-group" id="real-time-traffic" style="height: 100%"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import * as echarts from 'echarts';
import { addDate } from '@/utils/converter';
import { getRealTimeChartOption } from '@/components/dash-board/chartOptions';

const myChart = shallowRef({} as echarts.EChartsType);
const dom = shallowRef({} as HTMLDivElement);

const base = ref(new Date(2022, 2, 30));
const date = ref([] as any);
const data1 = ref([Math.random() * 50]);
const data2 = ref([Math.random() * 40]);
const data3 = ref([Math.random() * 30]);
const data4 = ref([Math.random() * 30]);
const data5 = ref([Math.random() * 30]);
const data6 = ref([Math.random() * 20]);
const data7 = ref([Math.random() * 10]);

const chartResize = () => {
  myChart.value.resize();
};

onMounted(() => {
  window.addEventListener('resize', () => chartResize(), { passive: true });

  dom.value = document.getElementById('real-time-traffic') as HTMLDivElement;
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

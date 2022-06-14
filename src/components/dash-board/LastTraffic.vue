<template>
  <div class="chart-wrap">
    <h3 class="h3-tit">전일대비/전주대비 Traffic 추이 (00:00 ~ 24:00)</h3>
    <ErrorWrapper v-show="syncedIsCommError" />
    <div class="chart-group" id="lastTraffic" ref="lastTrafficRef"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import * as echarts from 'echarts';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';
import { getLastTrafficChartOption } from '@/components/dash-board/chart-options';
const props = defineProps({
  lastTrafficList: {
    type: Object,
    default: () => [],
  },
  syncedIsCommError: {
    type: Boolean,
    default: false,
  },
});

const lastTrafficChart = ref({} as echarts.EChartsType);

const setChartData = () => {
  lastTrafficChart.value.setOption(getLastTrafficChartOption(props.lastTrafficList));
};

onMounted(() => {
  const dom = document.getElementById('lastTraffic') as HTMLDivElement;
  lastTrafficChart.value = echarts.init(dom);
});

onUnmounted(() => {});

watch(
  () => props.lastTrafficList,
  () => {
    setChartData();
  }
);
</script>

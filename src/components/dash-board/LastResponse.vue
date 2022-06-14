<template>
  <div class="chart-wrap">
    <h3 class="h3-tit">전일대비/전주대비 응답시간 추이 (00:00 ~ 24:00)</h3>
    <ErrorWrapper v-show="syncedIsCommError" />
    <div class="chart-group" id="lastResponse" ref="lastResponseRef"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';

import * as echarts from 'echarts';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';
import { getLastResponseChartOption } from '@/components/dash-board/chart-options';

const props = defineProps({
  lastResponseList: {
    type: Object,
    default: () => {
      [];
    },
  },
  syncedIsCommError: {
    type: Boolean,
    default: false,
  },
});

const lastResponseChart = ref({} as echarts.EChartsType);

const setChartData = () => {
  lastResponseChart.value.setOption(getLastResponseChartOption(props.lastResponseList));
};

onMounted(() => {
  const dom = document.getElementById('lastResponse') as HTMLDivElement;
  lastResponseChart.value = echarts.init(dom);
});

watch(
  () => props.lastResponseList,
  () => {
    setChartData();
  }
);
</script>

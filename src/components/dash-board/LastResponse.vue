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
import type { LastResponseType } from '@/types/DashBoardType';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';

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
  lastResponseChart.value.setOption(getLastResponseChartOption());
};

onMounted(() => {
  const dom = document.getElementById('lastResponse') as HTMLDivElement;

  lastResponseChart.value = echarts.init(dom);
  window.addEventListener('resize', observeSize);
});
onUnmounted(() => {
  window.removeEventListener('resize', observeSize);
});

const resizeChart = () => {
  lastResponseChart.value.resize();
};

const width1 = ref(0);
const height1 = ref(0);
const lastResponseRef = ref<HTMLDivElement | null>(null);
const observeSize = () => {
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      width1.value = width;
      height1.value = height;
    });
  });
  ro.observe(lastResponseRef.value as HTMLDivElement);
};

watch(width1, () => {
  resizeChart();
});

const getLastResponseChartOption = () => {
  const option: echarts.EChartsOption = {
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
      data: props.lastResponseList.map((item: { statBaseTm: string | any[] }) => item.statBaseTm.slice(11, 16)),
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
        data: props.lastResponseList.map((item: { todayAvgResTm: number }) => {
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
        data: props.lastResponseList.map((item: { ystdayAvgResTm: any }) => {
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
        data: props.lastResponseList.map((item: { lstWkAvgResTm: any }) => {
          return item.lstWkAvgResTm;
        }),
        smooth: true,
      },
    ],
  };

  return option;
};

watch(
  () => props.lastResponseList,
  () => {
    setChartData();
  }
);
</script>

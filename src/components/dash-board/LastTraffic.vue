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
  lastTrafficChart.value.setOption(getLastTrafficChartOption());
};
onMounted(() => {
  const dom = document.getElementById('lastTraffic') as HTMLDivElement;

  lastTrafficChart.value = echarts.init(dom);
  window.addEventListener('resize', observeSize);
});
onUnmounted(() => {
  window.removeEventListener('resize', observeSize);
});

const resizeChart = () => {
  lastTrafficChart.value.resize();
};

const width1 = ref(0);
const height1 = ref(0);
const lastTrafficRef = ref<HTMLDivElement | null>(null);
const observeSize = () => {
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      width1.value = width;
      height1.value = height;
    });
  });
  ro.observe(lastTrafficRef.value as HTMLDivElement);
};
watch(width1, () => {
  resizeChart();
});

const getLastTrafficChartOption = () => {
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
      data: props.lastTrafficList.map((item: { statBaseTm: string | any[] }) => item.statBaseTm.slice(11, 16)),
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
        data: props.lastTrafficList.map((item: { todayCnt: any }) => item.todayCnt),
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
        data: props.lastTrafficList.map((item: { ystdayCnt: any }) => item.ystdayCnt),
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
        data: props.lastTrafficList.map((item: { lstWkCnt: any }) => {
          return item.lstWkCnt;
        }),
        smooth: true,
      },
    ],
  };

  return lastTrafficOption;
};

watch(
  () => props.lastTrafficList,
  () => {
    setChartData();
  }
);
</script>

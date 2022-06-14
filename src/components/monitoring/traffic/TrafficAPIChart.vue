<template>
  <!-- <h3 class="h3-tit">{{ $t('traffic.api_traffic') }}</h3> -->
  <div class="chart-group chart-group-height" id="trafficAPI" ref="trafficAPI"></div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import * as echarts from 'echarts';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';
import type { TrafficApi } from '@/types/MonitoringTrafficType';

const props = defineProps<{ apiList: TrafficApi[]; timeUnit: string }>();

const trafficAPIChart = ref({} as echarts.EChartsType);

onMounted(() => {
  const dom = document.getElementById('trafficAPI') as HTMLDivElement;
  trafficAPIChart.value = echarts.init(dom);
  window.addEventListener('resize', observeSize);
  trafficAPIChart.value.setOption(getTrafficAPIChartOption(props.apiList));
});

onUnmounted(() => {
  window.removeEventListener('resize', observeSize);
});

const resizeChart = () => {
  trafficAPIChart.value.resize();
};

const width1 = ref(0);
const height1 = ref(0);
const trafficAPIRef = ref<HTMLDivElement | null>(null);

const observeSize = () => {
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      width1.value = width;
      height1.value = height;
    });
  });
  ro.observe(trafficAPIRef.value as HTMLDivElement);
};
watch(width1, () => {
  resizeChart();
});

const getTrafficAPIChartOption = (trafficAPI: TrafficApi[]) => {
  const trafficAPIOption: echarts.EChartsOption = {
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
      data: trafficAPI[0].apiTrafc.map((item) =>
        props.timeUnit === 'MM'
          ? item.statBaseTm.slice(5, 7) + '월'
          : props.timeUnit === 'DD'
          ? item.statBaseTm.slice(5, 7) + '월 ' + item.statBaseTm.slice(8, 10) + '일'
          : props.timeUnit === 'HH'
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
    series: trafficAPI.map((api) => {
      return {
        name: api.apiId,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: api.apiTrafc.map((item) => item.totCnt),
      };
    }),
  };
  return trafficAPIOption;
};

watch(props.apiList, () => {
  console.log(props.apiList);
  trafficAPIChart.value.clear();
  trafficAPIChart.value.setOption(getTrafficAPIChartOption(props.apiList));
  trafficAPIChart.value.resize();
});
</script>
<style scoped>
.chart-group-height {
  height: 340px;
}
</style>

<template>
  <!-- <h3 class="h3-tit">서비스 트래픽</h3> -->
  <div class="chart-group chart-group-height" id="trafficService" ref="trafficServiceRef"></div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import * as echarts from 'echarts';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';
import type { TrafficService } from '@/types/MonitoringTrafficType';

const props = defineProps<{ serviceList: TrafficService[]; timeUnit: string }>();

const trafficServiceChart = ref({} as echarts.EChartsType);

onMounted(() => {
  const dom = document.getElementById('trafficService') as HTMLDivElement;
  trafficServiceChart.value = echarts.init(dom);
  window.addEventListener('resize', observeSize);
  trafficServiceChart.value.setOption(getTrafficServiceChartOption(props.serviceList));
});

onUnmounted(() => {
  window.removeEventListener('resize', observeSize);
});

const resizeChart = () => {
  trafficServiceChart.value.resize();
};

const width1 = ref(0);
const height1 = ref(0);
const trafficServiceRef = ref<HTMLDivElement | null>(null);

const observeSize = () => {
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      width1.value = width;
      height1.value = height;
    });
  });
  ro.observe(trafficServiceRef.value as HTMLDivElement);
};
watch(width1, () => {
  resizeChart();
});

const getTrafficServiceChartOption = (trafficService: TrafficService[]) => {
  const trafficServiceOption: echarts.EChartsOption = {
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
      data: trafficService[0].svcTrafc.map((item) =>
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
    series: trafficService.map((service) => {
      return {
        name: service.svcId,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: service.svcTrafc.map((item) => item.totCnt),
      };
    }),
  };
  return trafficServiceOption;
};

watch(
  () => props.serviceList,
  () => {
    console.log(props.serviceList);
    trafficServiceChart.value.clear();
    trafficServiceChart.value.setOption(getTrafficServiceChartOption(props.serviceList));
    trafficServiceChart.value.resize();
  }
);
</script>
<style scoped>
.chart-group-height {
  height: 340px;
}
</style>

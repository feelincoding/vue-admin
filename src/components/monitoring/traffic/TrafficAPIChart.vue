<template>
  <!-- <h3 class="h3-tit">{{ $t('traffic.api_traffic') }}</h3> -->
  <div class="chart-group chart-group-height" id="trafficAPI" ref="trafficAPI"></div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, watch, type Ref } from 'vue';
import * as echarts from 'echarts';
import type { TrafficApi } from '@/types/MonitoringTrafficType';

const props = defineProps<{ apiList: TrafficApi[]; timeUnit: string }>();

// 트래픽 API탭 차트
const trafficAPIChart = shallowRef({} as echarts.EChartsType);

onMounted(() => {
  // 차트 초기화
  const dom = document.getElementById('trafficAPI') as HTMLDivElement;
  trafficAPIChart.value = echarts.init(dom);
  trafficAPIChart.value.clear;
  window.addEventListener('resize', observeSize);

  // 차트 옵션 설정
  trafficAPIChart.value.setOption(getTrafficAPIChartOption(props.apiList));
});

onUnmounted(() => {
  window.removeEventListener('resize', observeSize);
});

// 차트 크기 재조정 함수
const resizeChart = () => {
  trafficAPIChart.value.resize();
};

// 차트 크기 재조정 이벤트 추적용 변수
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

// 차트 옵션 생성 함수
const getTrafficAPIChartOption = (trafficAPI: TrafficApi[]) => {
  const data = trafficAPI[0].apiTrafc.map((item) =>
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
  );
  const series: echarts.SeriesOption[] = trafficAPI.map((api) => {
    return {
      name: api.apiId,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      data: api.apiTrafc.map((item) => item.totCnt),
    };
  });
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
      },
    },
    backgroundColor: '#fff',
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data,

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
    series: series,
  };
  return trafficAPIOption;
};

watch(
  () => props.apiList,
  () => {
    trafficAPIChart.value.clear();
    trafficAPIChart.value.setOption(getTrafficAPIChartOption(props.apiList));
    trafficAPIChart.value.resize();
  }
);
</script>

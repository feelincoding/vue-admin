<template>
  <div class="chart-wrap">
    <h3 class="h3-tit">Error stats (24Hour)</h3>
    <div class="dash-modal-background" v-if="syncedModal === true" @click="syncedModal = false"></div>
    <div
      class="chart-group error-stats"
      :class="{
        'error-collapse-modal': syncedModal == false,
        'error-expand-modal': syncedModal == true,
      }"
      ref="totalErrorStatsRef"
    >
      <ErrorWrapper v-show="syncedIsCommError" />
      <div
        v-show="syncedModal == false"
        id="errorStatsPie"
        :class="{
          'dash-modal-detail-collapse': syncedModal == true,
          'dash-modal-detail-expand': syncedModal == false,
        }"
        class="error-pie"
      >
        실패율
      </div>
      <div
        v-show="syncedModal == false"
        id="errorStateBar"
        :class="{
          'dash-modal-detail-collapse': syncedModal == true,
          'dash-modal-detail-expand': syncedModal == false,
        }"
        class="error-chart"
      >
        Critical/Major/Minor
      </div>

      <div
        v-show="syncedModal == true"
        :class="{
          'dash-modal-detail-collapse': syncedModal == false,
          'dash-modal-detail-expand': syncedModal == true,
        }"
        onclick="event.stopPropagation()"
        style="width: 100%; height: 100%"
      >
        <h5 class="h5-tit">Error State Detail</h5>
        <!-- <button @click="toggleModal()" style="position: absolute; right: 1%; top: 3%">
          <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
        </button> -->
        <div id="errorStateDetail" style="width: 100%; height: 100%"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, onUpdated, ref, watch, type Ref } from 'vue';
import * as echarts from 'echarts';

import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';
import type { ErrorStatsType } from '@/types/DashBoardType';
import { getFailRateOption, getErrorDetailChartOption } from '@/components/dash-board/chart-options';

const props = defineProps({
  isLoadData: {
    type: Boolean,
    default: false,
  },
  syncedModal: {
    type: Boolean,
    default: false,
  },
  syncedIsDraged: {
    type: Number,
  },
  errorStats: {
    type: Object,
    default: () => ({}),
  },
  errorStatsDetail: {
    type: Array,
    default: () => [{}],
  },
  syncedIsCommError: {
    type: Boolean,
    default: false,
  },
});
const dom1 = ref({} as HTMLDivElement);
const myChart1 = ref({} as echarts.EChartsType);
const dom2 = ref({} as HTMLDivElement);
const myChart2 = ref({} as echarts.EChartsType);
const dom3 = ref({} as HTMLDivElement);
const myChart3 = ref({} as echarts.EChartsType);

const isModalDomInit = ref(false);

onMounted(() => {
  initChartAndDom();
  window.addEventListener('resize', observeSize);
});

onUpdated(() => {
  if (!isModalDomInit.value && props.syncedIsDraged === 1) {
    initChartAndDomModal();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', observeSize);
});

const initChartAndDomModal = () => {
  isModalDomInit.value = true;
  dom3.value = document.getElementById('errorStateDetail') as HTMLDivElement;
  myChart3.value = echarts.init(dom3.value);
  // myChart3.value.setOption(getErrorDetailChartOption(props.errorStatsDetail));
};

const initChartAndDom = () => {
  dom1.value = document.getElementById('errorStatsPie') as HTMLDivElement;
  myChart1.value = echarts.init(dom1.value);
  myChart1.value.setOption(getFailRateOption(props.errorStats.failRate));
  dom2.value = document.getElementById('errorStateBar') as HTMLDivElement;
  myChart2.value = echarts.init(dom2.value);
  myChart2.value.setOption(
    getFailProgressChartOption(props.errorStats.miCnt, props.errorStats.maCnt, props.errorStats.crCnt)
  );
};

const getFailProgressChartOption = (miCnt: number, maCnt: number, crCnt: number) => {
  const errorStatsBarOption: echarts.EChartsOption = {
    // tooltip: {
    //   trigger: 'item',
    // },
    backgroundColor: '#FFFFFF',
    xAxis: {
      type: 'value',
      max: miCnt + maCnt + crCnt,
      axisLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
    },
    yAxis: [
      {
        data: ['Minor', 'Major', 'Critical'],
        type: 'category',
        axisLine: { show: false },
        axisLabel: { show: true, fontSize: '13', fontWeight: 550, color: '#000' },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      {
        type: 'category',
        data: [
          `${miCnt !== undefined ? miCnt.toLocaleString() : 0}`,
          `${maCnt !== undefined ? maCnt.toLocaleString() : 0}`,
          `${crCnt !== undefined ? crCnt.toLocaleString() : 0}`,
        ],
        axisLine: { show: false },
        axisLabel: { show: true, fontSize: '13', fontWeight: 550, color: '#000' },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    grid: {
      top: 30,
      left: 50,
      bottom: 30,
      right: 50,
    },
    series: [
      {
        data: [
          {
            value: miCnt,
            itemStyle: {
              color: '#FFE03D',
            },
          },
          {
            value: maCnt,
            itemStyle: {
              color: '#FF994F',
            },
          },
          {
            value: crCnt,
            itemStyle: {
              color: '#FF4E63',
            },
          },
        ],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.5)',
          borderRadius: [100, 100, 100, 100],
        },
        barWidth: '40%',
        itemStyle: {
          borderRadius: [100, 100, 100, 100],
        },
      },
    ],
  };

  return errorStatsBarOption;
};

const resizeChart = () => {
  myChart1.value.resize();
  myChart2.value.resize();
  if (isModalDomInit.value == true) {
    myChart3.value.resize();
  }
};

const width1 = ref(0);
const height1 = ref(0);
const totalErrorStatsRef = ref<HTMLDivElement | null>(null);
const observeSize = () => {
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      width1.value = width;
      height1.value = height;
    });
  });
  ro.observe(totalErrorStatsRef.value as HTMLDivElement);
};

watch(width1, () => {
  resizeChart();
});
watch(
  () => props.errorStats,
  () => {
    myChart1.value.clear();
    myChart2.value.clear();

    myChart1.value.setOption(getFailRateOption(props.errorStats.failRate));
    myChart2.value.setOption(
      getFailProgressChartOption(props.errorStats.miCnt, props.errorStats.maCnt, props.errorStats.crCnt)
    );
  }
);
// watch(
//   () => props.errorStatsDetail,
//   () => {
//     console.log('^&&', props.errorStats);

//     myChart3.value.setOption(getErrorDetailChartOption(props.errorStatsDetail));
//   }
// );

// showModal() {
//   if (props.isLoadData) {
//     return;
//   }
//   if (props.syncedIsDraged === 2) {
//     //emit 써야함
//     // props.syncedIsDraged = 1;
//     return;
//   }
//   //emit 써야함
//   // props.syncedModal = true;
// }

// closeModal() {
//   //emit 써야함
//   // props.syncedModal = false;
// }

// toggleModal() {
//   this.syncedModal ? this.closeModal() : this.showModal();
//   this.observeSize();
// }
// @Watch('syncedModal')
// onModalChange() {
//   if (this.isModalDomInit) {
//     this.myChart3.clear();
//   }

//   // if (!this.syncedModal) {
//   //   console.log('ErrorClearded!!');
//   //   this.myChart3.clear();
//   // }
// }
</script>
<style scoped>
.error-stats {
  background-color: #fff;
}

.error-collapse-modal {
  width: 31.2%;
  position: absolute;
  z-index: 1;
  transition: all 0.3s;
}

.error-expand-modal {
  margin-left: -34.4%;
  width: 100%;
  height: 200%;
  position: absolute;
  z-index: 5;
  transition: all 0.3s;
}

.error-expand-modal:hover,
.error-collapse-modal:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.3);
}
</style>

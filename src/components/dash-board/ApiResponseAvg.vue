<template>
  <div class="chart-wrap">
    <div class="dash-modal-background" v-if="syncedModal === true"></div>

    <h3 class="h3-tit">API 평균 응답시간 및 TPS (종전 1분)</h3>
    <div
      class="chart-group tps-group"
      :class="{
        'avg-collapse-modal': syncedModal == false,
        'avg-expand-modal': syncedModal == true,
      }"
      ref="tpsGroupRef"
    >
      <ErrorWrapper v-show="syncedIsCommError" />
      <div class="tps-chart-modal" v-show="syncedModal === true && modalType === 1" style="width: 100%; height: 100%">
        <h5 class="h5-tit" style="color: #fff6e5">평균 응답시간 Detail</h5>
        <div
          :class="{
            'dash-modal-detail-collapse': syncedModal == false,
            'dash-modal-detail-expand': syncedModal == true,
          }"
          id="avgDetail"
          style="width: 100%; height: 90%"
          onclick="event.stopPropagation()"
        />
      </div>
      <div
        class="tps-chart"
        :class="{
          'dash-modal-detail-collapse': syncedModal == true,
          'dash-modal-detail-expand': syncedModal == false,
        }"
        v-show="syncedModal === false"
      >
        <i><img src="@/assets/req_ico.svg" alt="평균 응답시간" /></i>
        <p class="text">평균 응답시간</p>
        <p class="text fz38">
          <strong>{{ apiResponseStatus.avgResTm }}</strong
          >ms
        </p>
      </div>

      <div
        class="tps-chart-modal"
        v-show="syncedModal === true && modalType === 2"
        style="width: 100%; height: 100%"
        :class="{
          'dash-modal-detail-collapse': syncedModal == false,
          'dash-modal-detail-expand': syncedModal == true,
        }"
      >
        <h5 class="h5-tit" style="color: #fff6e5">TPS Detail</h5>
        <div id="tpsDetail" style="width: 100%; height: 100%" onclick="event.stopPropagation()" />
      </div>
      <div
        class="tps-chart"
        :class="{
          'dash-modal-detail-collapse': syncedModal == true,
          'dash-modal-detail-expand': syncedModal == false,
        }"
        v-show="syncedModal === false"
      >
        <i><img src="@/assets/tps_ico.svg" alt="TPS" /></i>
        <p class="text">TPS</p>
        <p class="text fz38">
          <strong>{{ apiResponseStatus.tps }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, onUpdated, ref, watch, type Ref } from 'vue';

import * as echarts from 'echarts';
import { getTpsDetailOption, getAvgDetailOption } from '@/components/dash-board/chartDummy';
import type { ApiResponseStatus } from '@/types/DashBoardType';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';

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
  apiResponseStatus: {
    type: Object,
    default: () => ({}),
  },
  apiResponseStatusDetail: {
    type: Array,
    default: () => [{}],
  },
  syncedIsCommError: {
    type: Boolean,
    default: false,
  },
});

const detailAvgDom = ref({} as HTMLDivElement);
const detailAvgChart = ref({} as echarts.EChartsType);
const detailTpsDom = ref({} as HTMLDivElement);
const detailTpsChart = ref({} as echarts.EChartsType);
// 0 = 모달 안보일 때
// 1 = avg모달일 때
// 2 = tps모달일 때
const modalType = ref(0);

// @Watch('apiResponseStatusDetail')
// onApiResponseStatusDetailChange(val: ApiResponseStatus[]) {
//   if (this.modalType == 1) {
//     this.detailAvgChart.setOption(getAvgDetailOption(this.apiResponseStatusDetail));
//   } else if (this.modalType == 2) {
//     this.detailTpsChart.setOption(getTpsDetailOption(this.apiResponseStatusDetail));
//   }
// }

const isModalDomInitAvg = ref(false);
const isModalDomInitTps = ref(false);

const setDetailChart = () => {
  if (modalType.value == 1 && isModalDomInitAvg.value === false && props.syncedIsDraged === 1) {
    initChartAndDomModalAvg();
  }
  if (modalType.value == 2 && isModalDomInitTps.value === false && props.syncedIsDraged === 1) {
    initChartAndDomModalTps();
  }
};

const initChartAndDomModalAvg = () => {
  isModalDomInitAvg.value = true;
  detailAvgDom.value = document.getElementById('avgDetail') as HTMLDivElement;
  detailAvgChart.value = echarts.init(detailAvgDom.value);
  detailAvgChart.value.setOption(getAvgDetailOption(props.apiResponseStatusDetail as ApiResponseStatus[]));
};
const initChartAndDomModalTps = () => {
  isModalDomInitTps.value = true;
  detailTpsDom.value = document.getElementById('tpsDetail') as HTMLDivElement;
  detailTpsChart.value = echarts.init(detailTpsDom.value);
  detailTpsChart.value.setOption(getTpsDetailOption(props.apiResponseStatusDetail as ApiResponseStatus[]));
};

onMounted(() => {
  window.addEventListener('resize', observeSize);
});
onUpdated(() => {
  setDetailChart();
});

onUnmounted(() => {
  window.removeEventListener('resize', observeSize);
});

const width1 = ref(0);
const height1 = ref(0);
const tpsGroupRef = ref<HTMLDivElement | null>(null);
const observeSize = () => {
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      width1.value = width;
      height1.value = height;
    });
  });
  ro.observe(tpsGroupRef.value as HTMLDivElement);
};

watch(width1, () => {
  resizeChart();
});

const resizeChart = () => {
  isModalDomInitAvg.value && detailAvgChart.value.resize();
  isModalDomInitTps.value && detailTpsChart.value.resize();
};

// showModal() {
//   if (this.isLoadData) {
//     return;
//   }
//   if (this.syncedIsDraged === 2) {
//     this.syncedIsDraged = 1;
//     return;
//   }
//   this.syncedModal = true;
// }

// closeModal() {
//   this.clearModal();
//   this.syncedModal = false;
// }

// toggleModal(type: number) {
//   this.syncedModal ? this.closeModal() : this.showModal();
//   this.modalType = type;
//   this.observeSize();
// }

// @Watch('syncedModal')
// onModalChange() {
//   this.clearModal();
//   // if (this.modalType !== 0 && !this.syncedModal) {
//   //   this.clearModal();
//   //   this.modalType = 0;
//   // }
// }

// clearModal() {
//   if (this.modalType == 1) {
//     if (this.isModalDomInitAvg) {
//       this.detailAvgChart.clear();
//     }
//   } else if (this.modalType == 2) {
//     if (this.isModalDomInitTps) {
//       this.detailTpsChart.clear();
//     }
//   }
// }
</script>
<style scoped>
.avg-collapse-modal {
  width: 31.2%;
  position: absolute;
  right: 0px;
  z-index: 1;
  transition: all 0.3s;
}

.avg-expand-modal {
  width: 100%;
  height: 200%;
  position: absolute;
  right: 0px;
  z-index: 5;
  transition: all 0.3s;
}

.avg-expand-modal:hover,
.avg-collapse-modal:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.3);
}

.tps-group .tps-chart-modal {
  padding: 20px 30px;
  align-items: center;
}
</style>

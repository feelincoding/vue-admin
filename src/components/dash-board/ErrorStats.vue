<template>
  <div class="chart-wrap">
    <h3 class="h3-tit">Error stats (24Hour)</h3>
    <div
      class="chart-group error-stats"
      :class="{
        'error-collapse-modal': modal == false,
        'error-expand-modal': modal == true,
      }"
      @click="toggleModal()"
      ref="totalErrorStatsRef"
    >
      <ErrorWrapper v-show="syncedIsCommError" />
      <div
        v-show="modal == false"
        id="errorStatsPie"
        :class="{
          'dash-modal-detail-collapse': modal == true,
          'dash-modal-detail-expand': modal == false,
        }"
        class="error-pie"
      >
        실패율
      </div>
      <div
        v-show="modal == false"
        id="errorStateBar"
        :class="{
          'dash-modal-detail-collapse': modal == true,
          'dash-modal-detail-expand': modal == false,
        }"
        class="error-chart"
      >
        Critical/Major/Minor
      </div>

      <div
        v-show="modal == true"
        :class="{
          'dash-modal-detail-collapse': modal == false,
          'dash-modal-detail-expand': modal == true,
        }"
        onclick="event.stopPropagation()"
        style="width: 100%; height: 100%"
      >
        <h5 class="h5-tit">Error State Detail</h5>
        <button @click="toggleModal()" style="position: absolute; right: 1%; top: 3%">
          <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
        </button>
        <div id="errorStateDetail" style="width: 100%; height: 100%"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, onUpdated, ref, watch, type Ref } from 'vue';

import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';
import type { ErrorStatsType } from '@/types/DashBoardType';
import {
  getFailRateOption,
  getFailProgressChartOption,
  getErrorDetailChartOption,
} from '@/components/dash-board/chart-options';

import { drawTotalApiTrafficChart } from '@/utils/chart';

const props = defineProps({
  isLoadData: {
    type: Boolean,
    default: false,
  },
  modal: {
    type: Boolean,
    default: false,
  },
  syncedIsDraged: {
    type: Number,
  },
  errorStats: {
    type: Object,
    default: {} as ErrorStatsType,
  },
  errorStatsDetail: {
    type: Object,
    default: [] as ErrorStatsType[],
  },
  syncedIsCommError: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'modalChange', show: boolean): void;
}>();

const errorRateChart = ref({} as echarts.EChartsType);
const errorStateBarChart = ref({} as echarts.EChartsType);
const modalChart = ref({} as echarts.EChartsType);
onMounted(() => {
  errorRateChart.value = drawTotalApiTrafficChart('errorStatsPie', getFailRateOption(props.errorStats.failRate));

  errorStateBarChart.value = drawTotalApiTrafficChart(
    'errorStateBar',
    getFailProgressChartOption(props.errorStats.miCnt, props.errorStats.maCnt, props.errorStats.crCnt)
  );

  window.addEventListener('resize', observeSize);
});

const isModalDomInit = ref(false);
onUpdated(() => {
  if (!isModalDomInit.value && props.syncedIsDraged === 1) {
    isModalDomInit.value = true;

    modalChart.value = drawTotalApiTrafficChart(
      'errorStateDetail',
      getErrorDetailChartOption(props.errorStatsDetail as ErrorStatsType[])
    );
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', observeSize);
});

watch(
  () => props.errorStats,
  () => {
    errorRateChart.value.clear();
    errorStateBarChart.value.clear();

    errorRateChart.value.setOption(getFailRateOption(props.errorStats.failRate));
    errorStateBarChart.value.setOption(
      getFailProgressChartOption(props.errorStats.miCnt, props.errorStats.maCnt, props.errorStats.crCnt)
    );
  }
);

// Modal 동작 관련 메서드
const showModal = () => {
  if (props.isLoadData) {
    return;
  }
  if (props.syncedIsDraged === 2) {
    emit('modalChange', false);
    return;
  }
  emit('modalChange', true);
};
const closeModal = () => {
  emit('modalChange', false);
};

const toggleModal = () => {
  props.modal ? closeModal() : showModal();
  observeSize();
};

//resize 관련 메서드
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
  errorRateChart.value.resize();
  errorStateBarChart.value.resize();
  if (isModalDomInit.value == true) {
    modalChart.value.resize();
  }
});
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

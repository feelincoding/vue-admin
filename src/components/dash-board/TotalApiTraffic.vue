<template>
  <div class="chart-wrap">
    <h3 class="h3-tit">Total API Traffic (24Hour)</h3>

    <div
      class="chart-group api-traffic"
      :class="{
        'total-collapse-modal': syncedModal == false,
        'total-expand-modal': syncedModal == true,
      }"
      @click="toggleModal()"
      ref="totalApiTrafficRef"
      id="totalApiTraffic"
    >
      <ErrorWrapper v-show="syncedIsCommError" />
      <div
        id="totalApiTrafficTotal"
        v-show="syncedModal == false"
        :class="{
          'dash-modal-detail-collapse': syncedModal == true,
          'dash-modal-detail-expand': syncedModal == false,
        }"
        class="api-pie"
      >
        전체
      </div>
      <div
        v-show="syncedModal == false"
        id="totalApiTrafficSuccess"
        :class="{
          'dash-modal-detail-collapse': syncedModal == true,
          'dash-modal-detail-expand': syncedModal == false,
        }"
        class="api-pie"
      >
        성공
      </div>
      <div
        v-show="syncedModal == false"
        id="totalApiTrafficFail"
        :class="{
          'dash-modal-detail-collapse': syncedModal == true,
          'dash-modal-detail-expand': syncedModal == false,
        }"
        class="api-pie"
      >
        실패
      </div>

      <div
        v-show="syncedModal == true"
        onclick="event.stopPropagation()"
        :class="{
          'dash-modal-detail-collapse': syncedModal == false,
          'dash-modal-detail-expand': syncedModal == true,
        }"
        style="width: 100%; height: 100%"
      >
        <h5 class="h5-tit" style="color: #fff6e5">Total API Traffic Detail</h5>
        <button @click="toggleModal()" style="position: absolute; right: 1%; top: 3%">
          <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
        </button>
        <div id="totalApiTrafficDetail" style="width: 100%; height: 90%"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, onUpdated, ref, watch, type Ref } from 'vue';
import { drawTotalApiTrafficChart } from '@/utils/chart';

import * as echarts from 'echarts';
import {
  getTotalApiTrafficOption,
  getSuccessApiTrafficOption,
  getFailApiTrafficOption,
  getDetailApiTrafficOption,
} from '@/components/dash-board/chartDummy';
import type { TotalTrafficStat } from '@/types/DashBoardType';
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
  totalApiTraffic: {
    type: Object,
    default: () => ({}),
  },
  totalApiTrafficDetail: {
    type: Object,
    default: () => [{}],
  },
  syncedIsCommError: {
    type: Boolean,
    default: false,
  },
});

const myChart1 = ref({} as echarts.EChartsType);
const myChart2 = ref({} as echarts.EChartsType);
const myChart3 = ref({} as echarts.EChartsType);
const dom4 = ref({} as HTMLDivElement);
const myChart4 = ref({} as echarts.EChartsType);

const isModalDomInit = ref(false);

onMounted(() => {
  setChartData();
  window.addEventListener('resize', observeSize);
});

watch(
  () => props.totalApiTraffic,
  () => {
    console.log('^&&', props.totalApiTraffic);

    myChart1.value.clear();
    myChart2.value.clear();
    myChart3.value.clear();

    myChart1.value.setOption(getTotalApiTrafficOption(props.totalApiTraffic.totCnt));
    myChart2.value.setOption(getSuccessApiTrafficOption(props.totalApiTraffic.sucesCnt, props.totalApiTraffic.failCnt));
    myChart3.value.setOption(getFailApiTrafficOption(props.totalApiTraffic.sucesCnt, props.totalApiTraffic.failCnt));
  }
);

watch(props.totalApiTrafficDetail, () => {
  setTimeout(() => {
    myChart4.value.setOption(getDetailApiTrafficOption(props.totalApiTrafficDetail as TotalTrafficStat[]));
  }, 400);
});

const setChartData = () => {
  myChart1.value = drawTotalApiTrafficChart(
    'totalApiTrafficTotal',
    getTotalApiTrafficOption(props.totalApiTraffic.totCnt)
  );
  myChart2.value = drawTotalApiTrafficChart(
    'totalApiTrafficSuccess',
    getSuccessApiTrafficOption(props.totalApiTraffic.sucesCnt, props.totalApiTraffic.failCnt)
  );
  myChart3.value = drawTotalApiTrafficChart(
    'totalApiTrafficFail',
    getFailApiTrafficOption(props.totalApiTraffic.sucesCnt, props.totalApiTraffic.failCnt)
  );
};

const setDetailChart = () => {
  isModalDomInit.value = true;
  dom4.value = document.getElementById('totalApiTrafficDetail') as HTMLDivElement;
  myChart4.value = echarts.init(dom4.value);
  myChart4.value.setOption(getDetailApiTrafficOption(props.totalApiTrafficDetail as TotalTrafficStat[]));
};

const width1 = ref(0);
const height1 = ref(0);
const totalApiTrafficRef = ref<HTMLDivElement | null>(null);
const observeSize = () => {
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      width1.value = width;
      height1.value = height;
    });
  });
  ro.observe(totalApiTrafficRef.value as HTMLDivElement);
};
watch(width1, () => {
  resizeChart();
});

onMounted(() => {
  setChartData();
  window.addEventListener('resize', observeSize);
});

onUpdated(() => {
  if (!isModalDomInit && props.syncedIsDraged === 1) {
    setDetailChart();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', observeSize);
});

const resizeChart = () => {
  myChart1.value.resize();
  myChart2.value.resize();
  myChart3.value.resize();
  if (isModalDomInit.value == true) {
    myChart4.value.resize();
  }
};

const showModal = () => {
  if (props.isLoadData) {
    return;
  }
  if (props.syncedIsDraged === 2) {
    // 이렇게 쓰면 안됨. Emit같은걸 쓰거나..
    //props.syncedIsDraged = 1;

    return;
  }
  // 이렇게 쓰면 안됨. Emit같은걸 쓰거나..
  // props.syncedModal = true;
};
const closeModal = () => {
  // 이렇게 쓰면 안됨. Emit같은걸 쓰거나..
  // props.syncedModal = false;
};

const toggleModal = () => {
  props.syncedModal ? closeModal() : showModal();
  observeSize();
};

// watch(props.syncedModal, () => {
//   if (props.syncedModal) {
//     showModal();
//   } else {
//     closeModal();
//   }
// });
</script>
<style scoped>
.total-collapse-modal {
  width: 31.2%;
  position: absolute;
  z-index: 1;
  transition: all 0.3s;
}

.total-expand-modal {
  width: 100%;
  height: 200%;
  position: absolute;
  z-index: 5;
  transition: all 0.3s;
}

.total-expand-modal:hover,
.total-collapse-modal:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.3);
}
</style>

<template>
  <ModalLayout size="lg">
    <div class="text-center" v-if="isShowProgress">
      <b-spinner label="Large Spinner"></b-spinner>
    </div>
    <template v-slot:modalHeader>
      <h1 class="h2-tit">{{ msgId }}</h1>
      <button @click="emit('close')">
        <i><img src="@/assets/close.svg" :alt="$t('common.close')" :title="$t('common.close')" /></i>
      </button>
    </template>
    <template v-slot:modalContainer>
      <div class="col-2 pop-chart" style="width: 100%">
        <div class="chart-div" id="stacked-area-chart-servicetop5"></div>
        <div class="chart-div" id="stacked-horizontal-bar-servicetop5"></div>
      </div>
      <div class="stati-wrap" v-if="isShow && !isShowProgress">
        <div class="tit-wrap" v-if="msgType == 'svc' && serviceList.svcStat">
          <h3 class="h3-tit">{{ $t('control.api_list') }}</h3>
          <p class="total">{{ $t('common.total') }} : {{ serviceList.svcStat[0].apiStat.length }}</p>
        </div>
        <div class="stati-list">
          <ul v-if="msgType == 'svc' && serviceList.svcStat !== undefined">
            <ApiServiceDetailModalList
              v-for="(item, index) in serviceList.svcStat[0].apiStat"
              :key="index"
              :kind="'svc'"
              :item="item"
            />
          </ul>
          <ul v-else-if="msgType == 'api' && apiList.apiStat !== undefined">
            <ApiServiceDetailModalList :kind="'api'" :item="apiList.apiStat[0]" />
          </ul>
        </div>
      </div>
    </template>
    <template v-slot:modalFooter>
      <button class="lg-btn purple-btn" @click="$emit('close')">{{ $t('common.ok') }}</button>
    </template>
  </ModalLayout>
</template>
<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, shallowRef, type Ref } from 'vue';
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';
import type { StatResponse } from '@/types/MonitoringStatisticType';
import type {
  RealtimeServiceStatDetail,
  RealtimeApiStatDetail,
  TrafficService,
  TrafficApi,
} from '@/types/MonitoringControlType';

import { disableScrolling, enableScrolling } from '@/utils/screen';

import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import ApiServiceDetailModalList from '@/components/commons/modal/ApiServiceDetailModalList.vue';

import MonitoringControlRepository from '@/repository/monitoring-control-repository';
import MonitoringStatisticReoisitory from '@/repository/monitoring-statistic-repository';

import { modalInjectionKey } from '@/plugins/modal/ModalPlugin';
import { useI18n } from 'vue-i18n';
import ErrorCode from '@/error/ErrorCodes';
import { get24TrafficChartOption, getBarOption } from '@/components/dash-board/chartOptions';
import { getTimeArr } from '@/utils/converter';

const { t } = useI18n({});
const modal = inject(modalInjectionKey)!!;

const controlRepository = new MonitoringControlRepository();
const statisticRepository = new MonitoringStatisticReoisitory();

const props = defineProps<{
  msgId: string;
  msgType: string;
  msgEndTime: string;
  msgTimeInterval: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const isShow = ref(false);
const isShowProgress = ref(false);
const realtimeServiceStatDetailList: Ref<RealtimeServiceStatDetail[]> = ref([]);
const realtimeApiStatDetailList: Ref<RealtimeApiStatDetail[]> = ref([]);
const trafficService: Ref<TrafficService[]> = ref([]);
const trafficApi: Ref<TrafficApi[]> = ref([]);
const serviceList: Ref<StatResponse> = ref({} as StatResponse);
const apiList: Ref<StatResponse> = ref({} as StatResponse);

const my24TrafficChart = shallowRef({} as EChartsType);
const myBarChart = shallowRef({} as EChartsType);

const resizeChart = () => {
  myBarChart.value.resize();
  my24TrafficChart.value.resize();
};
const initChart = () => {
  my24TrafficChart.value = echarts.init(document.getElementById('stacked-area-chart-servicetop5') as HTMLDivElement);
  my24TrafficChart.value.setOption(get24TrafficChartOption(props.msgType, trafficService.value, trafficApi.value));
  myBarChart.value = echarts.init(document.getElementById('stacked-horizontal-bar-servicetop5') as HTMLDivElement);
  myBarChart.value.setOption(
    getBarOption(props.msgType, realtimeServiceStatDetailList.value, realtimeApiStatDetailList.value)
  );
};

onMounted(() => {
  // API 호출
  requestAllApi();

  // resize 이벤트 등록
  window.addEventListener(
    'resize',
    () => {
      resizeChart();
    },
    { passive: true }
  );
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    resizeChart();
  });
  enableScrolling();
});

const requestAllApi = () => {
  disableScrolling();
  isShowProgress.value = true;
  const timeArr = getTimeArr(props.msgEndTime, props.msgTimeInterval);
  // service 조회
  if (props.msgType === 'svc') {
    Promise.all([
      // 1. 오른쪽 그래프
      controlRepository.getRealtimeServiceStatDetailList({
        svcId: props.msgId,
        statBaseTm: timeArr[0],
        statPerd: props.msgTimeInterval,
        dayTrafcComprCnt: 7,
      }),
      // 2. 왼쪽 그래프
      controlRepository.getTrafficService({
        svcId: props.msgId,
        statBaseUnit: 'MI',
        statStTm: timeArr[1],
        statEndTm: timeArr[0],
      }),
      // 3. 리스트(api별)
      statisticRepository.getServiceList({
        svcId: props.msgId,
        statStTm: timeArr[1],
        statEndTm: timeArr[0],
      }),
    ])
      .then((res) => {
        realtimeServiceStatDetailList.value = res[0];
        trafficService.value = res[1];
        serviceList.value = res[2];

        isShowProgress.value = false;
        isShow.value = true;
        initChart();
      })
      .catch((error) => {
        if (error == ErrorCode.CANCEL_ERROR) {
          console.log('API,Service Modal API Cancel');
          isShowProgress.value = false;
        } else {
          isShowProgress.value = false;
          modal().show(t('error.server_error'));
        }
      });

    //api 조회
  } else if (props.msgType === 'api') {
    Promise.all([
      // 1. 오른쪽 그래프
      controlRepository.getRealtimeApiStatDetailList({
        sysId: props.msgId.split('.')[0],
        apiId: props.msgId.split('.')[1],
        statBaseTm: timeArr[0],
        statPerd: props.msgTimeInterval,
        dayTrafcComprCnt: 7,
      }),
      // 2. 왼쪽 그래프
      controlRepository.getTrafficApi({
        apiId: props.msgId,
        statBaseUnit: 'MI',
        statStTm: timeArr[1],
        statEndTm: timeArr[0],
      }),
      // 3. 리스트(api 한 개)
      statisticRepository.getApiList({
        apiId: props.msgId,
        statStTm: timeArr[1],
        statEndTm: timeArr[0],
      }),
    ])
      .then((res) => {
        realtimeApiStatDetailList.value = res[0];
        trafficApi.value = res[1];
        apiList.value = res[2];

        isShowProgress.value = false;
        isShow.value = true;
        initChart();
      })
      .catch((error) => {
        if (error == ErrorCode.CANCEL_ERROR) {
          console.log('API, API Modal API Cancel');
          isShowProgress.value = false;
        } else {
          modal().show(t('error.server_error'));
          isShowProgress.value = false;
        }
      });
  }
};
</script>
<style>
/***   popup   ***/

.modal-enter,
.modal-leave-to,
.alertLayout-enter,
.alertLayout-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.modal-enter-active,
.modal-leave-active,
.alertLayout-enter-active,
.alertLayout-leave-active {
  transition: opacity 0.3s;
}

.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
</style>

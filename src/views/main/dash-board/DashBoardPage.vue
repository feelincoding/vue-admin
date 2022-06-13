<template>
  <article class="dashboard">
    <!--- refresh play/pause area --->
    <TimeCheck v-model:isLoadData="isLoadData" :callBack="requestAllApi" />

    <section class="group col-3" style="height: 219px">
      <!--- Total API Traffic (24Hour) area --->
      <TotalApiTraffic
        v-model:totalApiTraffic="totalTraffic"
        v-model:isLoadData="isLoadData"
        v-model:modal="trafficModal"
        @modalChange="changeTrafficModal"
        v-model:isDraged="isDraged"
        v-model:isCommError="isTotalAPITrafficCommError"
      />
      <!--- Error stats (24Hour) area --->
      <ErrorStats
        v-model:errorStats="errorStats"
        v-model:isLoadData="isLoadData"
        v-model:modal="errorModal"
        @modalChange="changeErrorModal"
        :isDraged.sync="isDraged"
        :isCommError.sync="isErrorStatCommError"
      />
      <!--- API 평균 응답시간 / TPS area !! --->
      <ApiResponseAvg
        v-model:apiResponseStatus="apiResponseStatus"
        :modal.sync="avgModal"
        :isDraged.sync="isDraged"
        :isLoadData="isLoadData"
        :isCommError.sync="isApiResponseStusCommError"
      />
    </section>
    <section class="group">
      <!--- 실시간 Traffic area --->
      <RealTimeTraffic :isDraged.sync="isDraged" :setParamData.sync="clickedParamData" :modal.sync="realTimeModal" />
    </section>
    <section class="group col-2">
      <!--- API Top 5 area --->
      <ApiTop5
        v-model:realTimeStat="realTimeApiStat"
        :isCommError.sync="isServiceTop5CommError"
        @clickModalBtn="
          (msg) => {
            showModal(msg);
          }
        "
      />
      <!--- Service Top 5 area --->
      <ServiceTop5 v-model:realTimeStat="realTimeServiceStat" :isCommError.sync="isServiceTop5CommError" />
    </section>
    <section class="group col-2 bg-pastel">
      <!--- Last Traffic --->
      <LastTraffic :lastTrafficList="lastTrafficList" :isCommError="isLastTrafficCommError" />
      <!--- Last Response --->
      <LastResponse :lastResponseList="lastResponseList" :isCommError="isLastResponseCommError" />
    </section>
    <ApiDetailModal
      v-if="isShowModal"
      @close="isShowModal = false"
      :msgId="msgId"
      :msgType="msgType"
      :msgEndTime="msgEndTime"
      :msgTimeInterval="gseTimeInterval"
    ></ApiDetailModal>
  </article>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import TimeCheck from '@/components/dash-board/TimeCheck.vue';
import TotalApiTraffic from '@/components/dash-board/TotalApiTraffic.vue';
import ErrorStats from '@/components/dash-board/ErrorStats.vue';
import ApiResponseAvg from '@/components/dash-board/ApiResponseAvg.vue';
import RealTimeTraffic from '@/components/dash-board/RealTimeTraffic.vue';
import ApiTop5 from '@/components/dash-board/ApiTop5.vue';
import ServiceTop5 from '@/components/dash-board/ServiceTop5.vue';
import LastTraffic from '@/components/dash-board/LastTraffic.vue';
import LastResponse from '@/components/dash-board/LastResponse.vue';
import ApiDetailModal from '@/components/monitoring/control/ApiDetailModal.vue';

import DashBoardRepository from '@/repository/dash-board-repository';
import { convertBaseTime } from '@/utils/converter';

import type {
  RealTimeServiceStat,
  TotalTrafficStat,
  ApiResponseStatus,
  RealTimeApiStat,
  LastTrafficType,
  LastResponseType,
  ErrorStatsType,
  TrafficRequestType,
  ErrorStatsDetailRequest,
  ApiResponseRequest,
  ErrorStatsRequest,
  ServiceStat,
  RealTimeRequest,
  TotalApiDetailRequest,
} from '@/types/DashBoardType';

const DEFAULT_STAT_PERD = 1440;
const DEFAULT_STAT_BASE_TM = '2022-05-27 20:30';
const DEFAULT_STAT_BASE_UNIT = 'MI';
const DEFAULT_SORT_BASE = 'totCnt';
const DEFAULT_SCV_ID = 'KTSVC';
const DEFAULT_DAY_TRAFC_COMPR_CNT = 7;

const TOTAL_TRAFFIC_PARAM: TrafficRequestType = {
  statPerd: DEFAULT_STAT_PERD,
  statBaseUnit: DEFAULT_STAT_BASE_UNIT,
};

const ERROR_STATS_PARAM: ErrorStatsRequest = {
  statPerd: DEFAULT_STAT_PERD,
  statBaseUnit: DEFAULT_STAT_BASE_UNIT,
};

const API_RESPONSE_PARAM: ApiResponseRequest = {
  statPerd: DEFAULT_STAT_PERD,
};

let TOTAL_DETAIL_TRAFFIC_PARAM: TotalApiDetailRequest = {
  statBaseTm: '',
  statPerd: DEFAULT_STAT_PERD,
  statBaseUnit: DEFAULT_STAT_BASE_UNIT,
};

let ERROR_STATS_DETAIL_PARAM: ErrorStatsDetailRequest = {
  statBaseTm: '',
  statPerd: DEFAULT_STAT_PERD,
  statBaseUnit: DEFAULT_STAT_BASE_UNIT,
};

let API_RESPONSE_DETAIL_PARAM = {
  statBaseTm: '',
  statPerd: DEFAULT_STAT_PERD,
  statBaseUnit: DEFAULT_STAT_BASE_UNIT,
};

const REAL_TIME_PARAM: RealTimeRequest = {
  statPerd: DEFAULT_STAT_PERD,
  sortBase: DEFAULT_SORT_BASE,
};

const totalTraffic: Ref<TotalTrafficStat> = ref({} as TotalTrafficStat);
const apiResponseStatus: Ref<ApiResponseStatus> = ref({} as ApiResponseStatus);
const errorStats: Ref<ErrorStatsType> = ref({} as ErrorStatsType);
const realTimeApiStat: Ref<RealTimeApiStat> = ref({} as RealTimeApiStat);
const realTimeServiceStat: Ref<RealTimeServiceStat> = ref({} as RealTimeServiceStat);
const lastTrafficList: Ref<LastTrafficType[]> = ref({} as LastTrafficType[]);
const lastResponseList: Ref<LastResponseType[]> = ref({} as LastResponseType[]);

const isLoadData = ref(false);
const trafficModal = ref(false);
const changeTrafficModal = (show: boolean) => {
  trafficModal.value = show;
};
const errorModal = ref(false);
const changeErrorModal = (show: boolean) => {
  errorModal.value = show;
};
const avgModal = ref(false);
const realTimeModal = ref(false);
const clickedParamData = {};

const isErrorStatCommError = ref(false);
const isTotalAPITrafficCommError = ref(false);
const isApiResponseStusCommError = ref(false);
const isApiTop5CommError = ref(false);
const isServiceTop5CommError = ref(false);
const isLastTrafficCommError = ref(false);
const isLastResponseCommError = ref(false);

const layout = [
  { x: 0, y: 0, w: 6, h: 22, i: '0' },
  { x: 0, y: 1, w: 6, h: 22, i: '1' },
  { x: 0, y: 2, w: 6, h: 34, i: '2' },
  { x: 0, y: 3, w: 6, h: 25, i: '3' },
];

const isDraged = ref(0);
const layoutUpdatedEvent = () => {
  // 최초 1회는 막아야한다.
  // isDraged == 0 : 최초 로딩시
  // isDraged == 1 : 드래그를 안한 상태
  // isDraged == 2 : 드래그를 한 상태
  if (isDraged.value === 0) {
    isDraged.value = 1;
    return;
  } else if (isDraged.value === 1) {
    isDraged.value = 2;
    return;
  }
};

const box1 = ref(false);
const box2 = ref(false);
const box3 = ref(false);
const box4 = ref(false);

const dragEvent = (i: string) => {
  if (i == '0') {
    box1.value = true;
  } else if (i == '1') {
    box2.value = true;
  } else if (i == '2') {
    box3.value = true;
  } else if (i == '3') {
    box4.value = true;
  }
  window.addEventListener('mouseup', (e) => {
    box1.value = false;
    box2.value = false;
    box3.value = false;
    box4.value = false;
  });
};

const dashBoardRepo = new DashBoardRepository();
onMounted(() => {
  requestAllApi();
});

const requestAllApi = () => {
  const request = [
    dashBoardRepo.getTotalAPITraffic(TOTAL_TRAFFIC_PARAM),
    dashBoardRepo.getErrorStats(ERROR_STATS_PARAM),
    dashBoardRepo.getApiResponseStatus(API_RESPONSE_PARAM),
    dashBoardRepo.getRealTimeApiStat(REAL_TIME_PARAM),
    dashBoardRepo.getRealTimeServiceStat(REAL_TIME_PARAM),
    dashBoardRepo.getLastTrafficCount(),
    dashBoardRepo.getLastResponseList(),
  ];

  isLoadData.value = true;

  Promise.allSettled(request).then((results) => {
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (index == 0) {
          totalTraffic.value = result.value as TotalTrafficStat;
          isTotalAPITrafficCommError.value = false;
          TOTAL_DETAIL_TRAFFIC_PARAM.statBaseTm = convertBaseTime(totalTraffic.value.statBaseTm);
        } else if (index == 1) {
          errorStats.value = result.value as ErrorStatsType;
          isErrorStatCommError.value = false;
          ERROR_STATS_DETAIL_PARAM.statBaseTm = convertBaseTime(errorStats.value.statBaseTm);
        } else if (index == 2) {
          apiResponseStatus.value = result.value as ApiResponseStatus;
          isApiResponseStusCommError.value = false;
          API_RESPONSE_DETAIL_PARAM.statBaseTm = convertBaseTime(apiResponseStatus.value.statBaseTm);
        } else if (index == 3) {
          realTimeApiStat.value = result.value as RealTimeApiStat;
          isApiTop5CommError.value = false;
        } else if (index == 4) {
          realTimeServiceStat.value = result.value as RealTimeServiceStat;
          isServiceTop5CommError.value = false;
        } else if (index == 5) {
          lastTrafficList.value = result.value as LastTrafficType[];
          isLastTrafficCommError.value = false;
        } else if (index == 6) {
          lastResponseList.value = result.value as LastResponseType[];
          isLastResponseCommError.value = false;
        }
      } else {
        if (index == 0) {
          isTotalAPITrafficCommError.value = true;
        } else if (index == 1) {
          isErrorStatCommError.value = true;
        } else if (index == 2) {
          isApiResponseStusCommError.value = true;
        } else if (index == 3) {
          isApiTop5CommError.value = true;
        } else if (index == 4) {
          isServiceTop5CommError.value = true;
        } else if (index == 5) {
          isLastTrafficCommError.value = true;
        } else if (index == 6) {
          isLastResponseCommError.value = true;
        }
      }
    });

    isLoadData.value = false;
  });
};

const totaltrafficDetail: Ref<TotalTrafficStat[]> = ref([]);
const isShowModal = ref(false);
const msgId = ref('');
const msgType = ref('');
const msgEndTime = ref('');
const gseTimeInterval = ref(1440);

const showModal = (msg: any) => {
  isShowModal.value = true;
  if (typeof msg.svcId === 'undefined') {
    msgId.value = msg.sysId + '.' + msg.apiId;
    msgType.value = 'api';
    msgEndTime.value = realTimeApiStat.value.statBaseTm;
  } else {
    msgId.value = msg.svcId;
    msgType.value = 'svc';
    msgEndTime.value = realTimeServiceStat.value.statBaseTm;
  }
};
</script>
<style>
.total-modal-z-index {
  z-index: 1;
}

.vue-grid-item.vue-grid-placeholder {
  background: rgba(130, 130, 130, 0.5) !important;
}

.realtime-modal {
  width: 100%;
  height: 100%;
}

.chart-size {
  width: 100%;
  height: 100%;
}

.drag-box {
  border-radius: 10px;
  padding-left: 10px;
  padding-right: 10px;
}

.drag-box {
  box-shadow: 0 0 12px rgba(33, 33, 33, 0.4);
}
</style>

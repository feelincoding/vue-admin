<template>
  <article class="dashboard">
    <!--- refresh play/pause area --->
    <TimeCheck :isLoadData.sync="isLoadData" />
    <gridLayout
      :layout="layout"
      :col-num="1"
      :row-height="1"
      :is-resizable="false"
      :is-mirrored="false"
      :use-css-transforms="true"
      @layout-updated="layoutUpdatedEvent"
    >
      <gridItem
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        @move="dragEvent(item.i)"
        :class="{
          'total-modal-z-index': item.i == '0',
        }"
        dragIgnoreFrom="#real-time-traffic, #lastTraffic , #lastResponse"
        style="touch-action: none"
      >
        <div
          v-if="item.i == '0'"
          style="padding: 11px; width: 100%; background-color: #fff"
          :class="{ 'drag-box': box1 }"
        >
          <section class="group col-3" style="height: 219px">
            <!--- Total API Traffic (24Hour) area --->
            <TotalApiTraffic
              v-model:totalApiTraffic="totalTraffic"
              :modal.sync="trafficModal"
              :isDraged.sync="isDraged"
              :isLoadData="isLoadData"
              :isCommError.sync="isTotalAPITrafficCommError"
            />
            <!--- Error stats (24Hour) area --->
            <ErrorStats
              v-model:errorStats="errorStats"
              :modal.sync="errorModal"
              :isDraged.sync="isDraged"
              :isLoadData="isLoadData"
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
        </div>
        <div
          v-if="item.i == '1'"
          style="padding: 11px; width: 100%; background-color: #fff"
          :class="{ 'drag-box': box2 }"
        >
          <section class="group">
            <!--- 실시간 Traffic area --->
            <RealTimeTraffic
              :isDraged.sync="isDraged"
              :setParamData.sync="clickedParamData"
              :modal.sync="realTimeModal"
            />
          </section>
        </div>
        <div
          v-if="item.i == '2'"
          style="padding: 11px; width: 100%; background-color: #fff"
          :class="{ 'drag-box': box3 }"
        >
          <section class="group col-2">
            <!--- API Top 5 area --->
            <ApiTop5 v-model:realTimeStat="realTimeApiStat" :isCommError.sync="isServiceTop5CommError" />
            <!--- Service Top 5 area --->
            <ServiceTop5 v-model:realTimeStat="realTimeServiceStat" :isCommError.sync="isServiceTop5CommError" />
          </section>
        </div>
      </gridItem>
    </gridLayout>
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

import DashBoardRepository from '@/repository/dash-board-repository';
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
const lastTrafficList: Ref<LastTrafficType[]> = ref({} as LastTrafficType[]);
const realTimeApiStat: Ref<RealTimeApiStat> = ref({} as RealTimeApiStat);
const realTimeServiceStat: Ref<RealTimeServiceStat> = ref({} as RealTimeServiceStat);
const lastResponseList: Ref<LastResponseType[]> = ref({} as LastResponseType[]);

const isLoadData = ref(false);
const trafficModal = ref(false);
const errorModal = ref(false);
const avgModal = ref(false);
const realTimeModal = ref(false);
const draggable = ref(true);
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
// const getTotalTrafficDetail = (): TotalTrafficStat[] => {
//   // return {
//   //   svcId: null,
//   //   statBaseTm: '2022-06-09T15:05:09.381613',
//   //   totCnt: 24985,
//   //   sucesCnt: 20426,
//   //   failCnt: 4559,
//   // };
//   const temp = dashBoardRepo.getTrafficStatDetail();
//   return [];
// };

onMounted(() => {
  dashBoardRepo
    .getTotalAPITraffic(TOTAL_TRAFFIC_PARAM)
    .then((res) => {
      totalTraffic.value = res.value as TotalTrafficStat;
    })
    .catch(() => {});

  dashBoardRepo
    .getErrorStats(ERROR_STATS_PARAM)
    .then((res) => {
      errorStats.value = res.value as ErrorStatsType;
    })
    .catch(() => {});

  dashBoardRepo
    .getApiResponseStatus(API_RESPONSE_PARAM)
    .then((res) => {
      apiResponseStatus.value = res.value as ApiResponseStatus;
    })
    .catch(() => {});

  dashBoardRepo
    .getRealTimeApiStat(REAL_TIME_PARAM)
    .then((res) => {
      realTimeApiStat.value = res.value as RealTimeApiStat;
    })
    .catch(() => {});

  dashBoardRepo
    .getRealTimeServiceStat(REAL_TIME_PARAM)
    .then((res) => {
      realTimeServiceStat.value = res.value as RealTimeServiceStat;
    })
    .catch(() => {});
});

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

//   dashBoardModule = getModule(DashBoardModule, this.$store);

//   modalOpenCheck() {
//     if (this.trafficModal == false && this.errorModal == false && this.avgModal == false) {
//       return true;
//     } else {
//       return false;
//     }
//   }

//   isErrorStatCommError = false;
//   isTotalAPITrafficCommError = false;
//   isApiResponseStusCommError = false;
//   isApiTop5CommError = false;
//   isServiceTop5CommError = false;
//   isLastTrafficCommError = false;
//   isLastResponseCommError = false;

//   mounted() {
//     this.requestAllApi();
//   }

//   requestAllApi() {
//     const request = [
//       this.dashBoardModule.getTotalAPITraffic(TOTAL_TRAFFIC_PARAM),
//       this.dashBoardModule.getErrorStats(ERROR_STATS_PARAM),
//       this.dashBoardModule.getApiResponseStatus(API_RESPONSE_PARAM),
//       this.dashBoardModule.getRealTimeApiStat(REAL_TIME_PARAM),
//       this.dashBoardModule.getRealTimeServiceStat(REAL_TIME_PARAM),
//       this.dashBoardModule.getLastTrafficCount(),
//       this.dashBoardModule.getLastResponseList(),
//     ];

//     this.isLoadData = true;

//     Promise.allSettled(request).then((results) => {
//       results.forEach((result, index) => {
//         if (result.status === 'fulfilled') {
//           if (index == 0) {
//             this.totalTraffic = result.value as TotalTrafficStat;
//             this.isTotalAPITrafficCommError = false;
//             TOTAL_DETAIL_TRAFFIC_PARAM.statBaseTm = convertBaseTime(this.totalTraffic.statBaseTm);
//           } else if (index == 1) {
//             this.errorStats = result.value as ErrorStatsType;
//             this.isErrorStatCommError = false;
//             ERROR_STATS_DETAIL_PARAM.statBaseTm = convertBaseTime(this.errorStats.statBaseTm);
//           } else if (index == 2) {
//             this.apiResponseStatus = result.value as ApiResponseStatus;
//             this.isApiResponseStusCommError = false;
//             API_RESPONSE_DETAIL_PARAM.statBaseTm = convertBaseTime(this.apiResponseStatus.statBaseTm);
//           } else if (index == 3) {
//             this.realTimeApiStat = result.value as RealTimeApiStat;
//             this.isApiTop5CommError = false;
//           } else if (index == 4) {
//             this.realTimeServiceStat = result.value as RealTimeServiceStat;
//             this.isServiceTop5CommError = false;
//           } else if (index == 5) {
//             this.lastTrafficList = result.value as LastTrafficType[];
//             this.isLastTrafficCommError = false;
//           } else if (index == 6) {
//             this.lastResponseList = result.value as LastResponseType[];
//             this.isLastResponseCommError = false;
//           }
//         } else {
//           if (index == 0) {
//             this.isTotalAPITrafficCommError = true;
//           } else if (index == 1) {
//             this.isErrorStatCommError = true;
//           } else if (index == 2) {
//             this.isApiResponseStusCommError = true;
//           } else if (index == 3) {
//             this.isApiTop5CommError = true;
//           } else if (index == 4) {
//             this.isServiceTop5CommError = true;
//           } else if (index == 5) {
//             this.isLastTrafficCommError = true;
//           } else if (index == 6) {
//             this.isLastResponseCommError = true;
//           }
//         }
//       });

//       this.isLoadData = false;
//     });
//   }

//   delay(ms: number) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
//   }

//   @Watch('trafficModal')
//   async onTrafficModalChange(val: boolean) {
//     this.dashBoardModule.release();
//     if (val) {
//       await this.delay(300);
//       this.dashBoardModule.getTrafficStatDetail(TOTAL_DETAIL_TRAFFIC_PARAM).catch((error: GateWayError) => {
//         if (error.getErrorCode() == ErrorCode.CANCEL_ERROR) {
//           // console.log('CANCEL');
//         }
//       });
//     }
//   }

//   @Watch('errorModal')
//   async onErrorChange(isOpen: boolean) {
//     this.dashBoardModule.release();
//     if (isOpen) {
//       await this.delay(300);
//       this.dashBoardModule.getErrorStatsDetail(ERROR_STATS_DETAIL_PARAM).catch((error: GateWayError) => {
//         if (error.getErrorCode() == ErrorCode.CANCEL_ERROR) {
//           // console.log('CANCEL');
//         }
//       });
//     }
//   }

//   @Watch('avgModal')
//   async onAvgModalChange(val: boolean) {
//     this.dashBoardModule.release();
//     if (val) {
//       await this.delay(300);
//       this.dashBoardModule.getApiResponseStatusDetail(API_RESPONSE_DETAIL_PARAM).catch((error: GateWayError) => {
//         if (error.getErrorCode() == ErrorCode.CANCEL_ERROR) {
//           // console.log('CANCEL');
//         }
//       });
//     }
//   }

//   get totalTrafficDetail(): TotalTrafficStat[] {
//     return this.dashBoardModule.totaltrafficDetail;
//   }

//   get apiResponseStatusDetail(): ApiResponseStatus[] {
//     return this.dashBoardModule.apiResponseStatusDetail;
//   }

//   get errorStatsDetail(): ErrorStatsType[] {
//     return this.dashBoardModule.errorStatsDetail;
//   }

//   allModalClose() {
//     this.trafficModal = false;
//     this.errorModal = false;
//     this.avgModal = false;
//   }

//   isShowModal = false;
//   msgId = '';
//   msgType = '';
//   msgEndTime = '';
//   gseTimeInterval = 1440;
//   showModal(msg: any) {
//     this.isShowModal = true;
//     if (typeof msg.svcId === 'undefined') {
//       this.msgId = msg.sysId + '.' + msg.apiId;
//       this.msgType = 'api';
//       this.msgEndTime = this.realTimeApiStat.statBaseTm;
//     } else {
//       this.msgId = msg.svcId;
//       this.msgType = 'svc';
//       this.msgEndTime = this.realTimeServiceStat.statBaseTm;
//     }
//   }

//   isLoadData = false;
//   trafficModal = false;
//   errorModal = false;
//   avgModal = false;
//   realTimeModal = false;
//   draggable = true;

//   clickedParamData = {};

//   layout = [
//     { x: 0, y: 0, w: 6, h: 22, i: '0' },
//     { x: 0, y: 1, w: 6, h: 22, i: '1' },
//     { x: 0, y: 2, w: 6, h: 34, i: '2' },
//     { x: 0, y: 3, w: 6, h: 25, i: '3' },
//   ];

//   onCallBack() {
//     this.requestAllApi();
//   }

//   isDraged = 0;
//   layoutUpdatedEvent() {
//     // 최초 1회는 막아야한다.
//     // this.isDraged == 0 : 최초 로딩시
//     // this.isDraged == 1 : 드래그를 안한 상태
//     // this.isDraged == 2 : 드래그를 한 상태
//     if (this.isDraged === 0) {
//       this.isDraged = 1;
//       return;
//     } else if (this.isDraged === 1) {
//       this.isDraged = 2;
//       return;
//     }
//   }
//   box1 = false;
//   box2 = false;
//   box3 = false;
//   box4 = false;
//   dragEvent(i: string) {
//     if (i == '0') {
//       this.box1 = true;
//     } else if (i == '1') {
//       this.box2 = true;
//     } else if (i == '2') {
//       this.box3 = true;
//     } else if (i == '3') {
//       this.box4 = true;
//     }
//     window.addEventListener('mouseup', (e) => {
//       this.box1 = false;
//       this.box2 = false;
//       this.box3 = false;
//       this.box4 = false;
//     });
//   }

//   @Watch('realTimeApiStat')
//   test() {
//     this.setTop5Height();
//   }
//   top5Count = 0;
//   setTop5Height() {
//     if (this.realTimeApiStat.apiStat.length < 5 && this.realTimeServiceStat.svcStat.length < 5) {
//       if (this.realTimeApiStat.apiStat.length < this.realTimeServiceStat.svcStat.length) {
//         this.top5Count = 5 - this.realTimeServiceStat.svcStat.length;
//       } else {
//         this.top5Count = 5 - this.realTimeApiStat.apiStat.length;
//       }
//       this.layout[2].h = 33 - 3 * this.top5Count;
//     }
//   }
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

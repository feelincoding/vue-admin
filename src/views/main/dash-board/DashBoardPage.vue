<template>
  <article class="dashboard">
    <TimeCheck v-model:isLoadData="isLoadData" :callBack="requestAllApi" />
    <draggable @change="log" v-bind="dragOptions">
      <section class="group" id="section-draggable">
        <div class="total-group">
          <div class="d-total">
            <div class="ico-wrap">
              <i><img src="@/assets/d_total_ico.svg" alt="total" /></i>
              <p>Total</p>
            </div>
            <span class="num">{{ totalTraffic.totCnt }}</span>
          </div>
          <div class="d-total">
            <div class="ico-wrap">
              <i><img src="@/assets/d_success_ico.svg" alt="성공" /></i>
              <p>성공</p>
            </div>
            <span class="num">{{ totalTraffic.sucesCnt }}</span>
          </div>
          <div class="d-fail d-total">
            <div class="ico-wrap">
              <i><img src="@/assets/d_fail_ico.svg" alt="실패" /></i>
              <p>실패</p>
            </div>
            <span class="num flex">{{ totalTraffic.failCnt }}</span>
            <div class="fail-group">
              <div class="fail-list">
                <span class="label critical"></span><span>{{ errorStats.crCnt }}</span>
              </div>
              <div class="fail-list">
                <span class="label major"></span><span>{{ errorStats.maCnt }}</span>
              </div>
              <div class="fail-list">
                <span class="label minor"></span><span>{{ errorStats.miCnt }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="avg-group">
          <div class="tps-chart">
            <div class="ico-wrap">
              <i><img src="@/assets/req_ico.svg" alt="평균 응답시간" /></i>
              <p>AVG</p>
            </div>
            <span class="num">{{ apiResponseStatus.avgResTm }}<em>ms</em></span>
          </div>
          <div class="tps-chart tps-w">
            <div class="ico-wrap">
              <i><img src="@/assets/tps_ico.svg" alt="TPS" /></i>
              <p>TPS</p>
            </div>
            <span class="num">{{ apiResponseStatus.tps }}</span>
          </div>
        </div>
      </section>
      <section class="group" id="section-draggable">
        <!--- 실시간 Traffic area --->
        <RealTimeTraffic />
      </section>

      <section class="grid-group" id="section-draggable">
        <!--- API Top 5 area --->
        <div class="chart-wrap">
          <h3 class="h3-tit">{{ $t('dash-board.api_top5_title') }}</h3>
          <ul class="list-wrap">
            <ErrorWrapper v-show="isApiTop5CommError" />
            <li v-for="(item, index) in apiTop5List" :key="index">
              <p class="id-txt">{{ item.sysId }}.{{ item.apiId }}</p>
              <dl>
                <dt><em>Total :</em>{{ item.totCnt }}</dt>
                <dd>
                  <span class="syan">{{ item.sucesCnt }}</span
                  >/<span class="red">{{ item.failCnt }}</span>
                </dd>
              </dl>
              <div class="sm-bar">{{ $t('dash-board.success_rate') }}</div>
              <ProgressBar :listItem="item" />
              <button class="more-btn">
                <i><img src="@/assets/more_ico.svg" :alt="$t('common.more')" /></i>
              </button>
            </li>
          </ul>
        </div>

        <div class="chart-wrap">
          <h3 class="h3-tit">{{ $t('dash-board.service_top5_title') }}</h3>
          <ul class="list-wrap">
            <ErrorWrapper v-show="isServiceTop5CommError" />
            <li v-for="(item, index) in serviceTop5List" :key="index">
              <p class="id-txt">{{ item.svcId }}</p>
              <dl>
                <dt>
                  <em>{{ $t('common.total') }} :</em>{{ item.totCnt }}
                </dt>
                <dd>
                  <span class="syan">{{ item.sucesCnt }}</span
                  >/<span class="red">{{ item.failCnt }}</span>
                </dd>
              </dl>
              <div class="sm-bar">{{ $t('dash-board.success_rate') }}</div>
              <ProgressBar :listItem="item" />
              <button class="more-btn">
                <i><img src="@/assets/more_ico.svg" :alt="$t('common.more')" /></i>
              </button>
            </li>
          </ul>
        </div>
        <!--- Service Top 5 area --->
      </section>
      <section class="grid-group" id="section-draggable">
        <!--- Last Traffic --->
        <div class="chart-wrap">
          <h3 class="h3-tit">전일대비/전주대비 Traffic 추이 (00:00 ~ 24:00)</h3>
          <ErrorWrapper v-show="isLastTrafficCommError" />
          <div class="chart-group" id="lastTraffic" ref="lastTrafficRef"></div>
        </div>
        <!--- Last Response --->
        <div class="chart-wrap">
          <h3 class="h3-tit">전일대비/전주대비 응답시간 추이 (00:00 ~ 24:00)</h3>
          <ErrorWrapper v-show="isLastResponseCommError" />
          <div class="chart-group" id="lastResponse" ref="lastResponseRef"></div>
        </div>
      </section>
    </draggable>
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
import { onMounted, ref, watch } from 'vue';
import type { Ref } from 'vue';
import TimeCheck from '@/components/dash-board/TimeCheck.vue';
import RealTimeTraffic from '@/components/dash-board/RealTimeTraffic.vue';
import ApiDetailModal from '@/components/monitoring/control/ApiDetailModal.vue';
import { VueDraggableNext as draggable } from 'vue-draggable-next';

import DashBoardRepository from '@/repository/dash-board-repository';
import { convertBaseTime } from '@/utils/converter';
import ProgressBar from '@/components/commons/ProgressBar.vue';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';
import * as echarts from 'echarts';

import {
  TOTAL_TRAFFIC_PARAM,
  ERROR_STATS_PARAM,
  API_RESPONSE_PARAM,
  REAL_TIME_PARAM,
  getDetailParam,
} from '@/views/main/dash-board/dash-board-define';

import type {
  RealTimeServiceStat,
  TotalTrafficStat,
  ApiResponseStatus,
  RealTimeApiStat,
  LastTrafficType,
  LastResponseType,
  ErrorStatsType,
  ApiStat,
  ServiceStat,
} from '@/types/DashBoardType';

import { getLastTrafficChartOption, getLastResponseChartOption } from '@/components/dash-board/chart-options';

const isLoadData = ref(false);

const totalTraffic: Ref<TotalTrafficStat> = ref({} as TotalTrafficStat);
const apiResponseStatus: Ref<ApiResponseStatus> = ref({} as ApiResponseStatus);
const errorStats: Ref<ErrorStatsType> = ref({} as ErrorStatsType);
const realTimeApiStat: Ref<RealTimeApiStat> = ref({} as RealTimeApiStat);
const apiTop5List: Ref<ApiStat[]> = ref([]);
const realTimeServiceStat: Ref<RealTimeServiceStat> = ref({} as RealTimeServiceStat);
const serviceTop5List: Ref<ServiceStat[]> = ref([]);
const lastTrafficList: Ref<LastTrafficType[]> = ref({} as LastTrafficType[]);
const lastResponseList: Ref<LastResponseType[]> = ref({} as LastResponseType[]);

const isErrorStatCommError = ref(false);
const isTotalAPITrafficCommError = ref(false);
const isApiResponseStusCommError = ref(false);
const isApiTop5CommError = ref(false);
const isServiceTop5CommError = ref(false);
const isLastTrafficCommError = ref(false);
const isLastResponseCommError = ref(false);

const dashBoardRepo = new DashBoardRepository();

onMounted(() => {
  requestAllApi();
  initCharts();
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
          // TOTAL_DETAIL_TRAFFIC_PARAM.statBaseTm = convertBaseTime(totalTraffic.value.statBaseTm);
        } else if (index == 1) {
          errorStats.value = result.value as ErrorStatsType;
          isErrorStatCommError.value = false;
          // ERROR_STATS_DETAIL_PARAM.statBaseTm = convertBaseTime(errorStats.value.statBaseTm);
        } else if (index == 2) {
          apiResponseStatus.value = result.value as ApiResponseStatus;
          isApiResponseStusCommError.value = false;
          // API_RESPONSE_DETAIL_PARAM.statBaseTm = convertBaseTime(apiResponseStatus.value.statBaseTm);
        } else if (index == 3) {
          realTimeApiStat.value = result.value as RealTimeApiStat;
          apiTop5List.value = realTimeApiStat.value.apiStat
            .sort((a: { totCnt: number }, b: { totCnt: number }) => b.totCnt - a.totCnt)
            .slice(0, 5) as ApiStat[];
          isApiTop5CommError.value = false;
        } else if (index == 4) {
          realTimeServiceStat.value = result.value as RealTimeServiceStat;
          serviceTop5List.value = realTimeServiceStat.value.svcStat
            .sort((a: { totCnt: number }, b: { totCnt: number }) => b.totCnt - a.totCnt)
            .slice(0, 5) as ServiceStat[];
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

const lastTrafficChart = ref({} as echarts.EChartsType);
const lastResponseChart = ref({} as echarts.EChartsType);

const initCharts = () => {
  lastTrafficChart.value = echarts.init(document.getElementById('lastTraffic') as HTMLDivElement);
  lastResponseChart.value = echarts.init(document.getElementById('lastResponse') as HTMLDivElement);
};

watch(lastTrafficList, () => {
  lastTrafficChart.value.setOption(getLastTrafficChartOption(lastTrafficList.value));
});
watch(lastResponseList, () => {
  lastResponseChart.value.setOption(getLastResponseChartOption(lastResponseList.value));
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

const log = (event: any) => {
  console.log(event);
};
const dragOptions = ref({
  animation: 100,
  disabled: false,
  ghostClass: 'ghost',
});

let message1 = [0, 1, 2, 3];
const list1 = ref(
  message1.map((name, index) => {
    return { order: index + 1 };
  })
);
</script>
<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
#section-draggable {
  cursor: move;
}
</style>

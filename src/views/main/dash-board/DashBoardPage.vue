<template>
  <article class="dashboard" ref="dashboardRef">
    <TimeCheck v-model:isLoadData="isLoadData" :callBack="requestAllApi" />
    <draggable v-bind="dragOptions">
      <section class="group" id="section-draggable">
        <div class="total-group" @click="trafficModal = true">
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

        <div class="avg-group" @click="avgModal = true">
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

      <section
        class="group"
        id="section-draggable"
        :style="{
          height: `${getRealTimeSectionHeight()}px`,
        }"
      >
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
              <button class="more-btn" @click="showModal(item)">
                <i><img src="@/assets/more_ico.svg" :alt="$t('common.more')" /></i>
              </button>
            </li>
            <li v-for="n in 5 - apiTop5List.length">
              <div class="no-list"></div>
            </li>
          </ul>
        </div>
        <!--- Service Top 5 area --->

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
              <button class="more-btn" @click="showModal(item)">
                <i><img src="@/assets/more_ico.svg" :alt="$t('common.more')" /></i>
              </button>
            </li>
            <li v-for="n in 5 - serviceTop5List.length">
              <div class="no-list"></div>
            </li>
          </ul>
        </div>
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
    <ApiServiceDetailModal
      v-if="isShowModal"
      @close="isShowModal = false"
      :msgId="msgId"
      :msgType="msgType"
      :msgEndTime="msgEndTime"
      :msgTimeInterval="gseTimeInterval"
    ></ApiServiceDetailModal>
    <TrafficDetailModal v-if="trafficModal" @close="trafficModal = false"></TrafficDetailModal>
    <AvgDetailModal v-if="avgModal" @close="avgModal = false"></AvgDetailModal>

    <MainFooter></MainFooter>
  </article>
</template>
<script setup lang="ts">
import { onMounted, ref, shallowRef, watch } from 'vue';
import type { Ref } from 'vue';
import TimeCheck from '@/components/dash-board/TimeCheck.vue';
import RealTimeTraffic from '@/components/dash-board/RealTimeTraffic.vue';
import ApiServiceDetailModal from '@/components/commons/modal/ApiServiceDetailModal.vue';

import TrafficDetailModal from '@/components/dash-board/TrafficDetailModal.vue';
import AvgDetailModal from '@/components/dash-board/AvgDetailModal.vue';

import MainFooter from '@/components/layout/footer/MainFooter.vue';

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

import {
  getLastTrafficChartOption,
  getLastResponseChartOption,
  getRealTimeChartOption,
} from '@/components/dash-board/chartOptions';
import { addDate } from '@/utils/converter';

const isLoadData = ref(false);
const trafficModal = ref(false);
const avgModal = ref(false);

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
  window.addEventListener('resize', () => chartResize(), { passive: true });

  for (var i = 1; i < 30; i++) {
    addData();
  }

  // realTimeChart.value.setOption(
  //   getRealTimeChartOption(
  //     date.value,
  //     data1.value,
  //     data2.value,
  //     data3.value,
  //     data4.value,
  //     data5.value,
  //     data6.value,
  //     data7.value
  //   )
  // );

  // setInterval(() => {
  //   addData();
  //   realTimeChart.value.setOption(
  //     getRealTimeChartOption(
  //       date.value,
  //       data1.value,
  //       data2.value,
  //       data3.value,
  //       data4.value,
  //       data5.value,
  //       data6.value,
  //       data7.value
  //     )
  //   );
  // }, 300);
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

const lastTrafficChart = shallowRef({} as echarts.EChartsType);
const lastResponseChart = shallowRef({} as echarts.EChartsType);
const realTimeChart = shallowRef({} as echarts.EChartsType);

const initCharts = () => {
  lastTrafficChart.value = echarts.init(document.getElementById('lastTraffic') as HTMLDivElement);
  lastResponseChart.value = echarts.init(document.getElementById('lastResponse') as HTMLDivElement);
  // realTimeChart.value = echarts.init(document.getElementById('real-time-traffic') as HTMLDivElement);
};

const chartResize = () => {
  observeSize();
  lastTrafficChart.value.resize();
  lastResponseChart.value.resize();
  // realTimeChart.value.resize();
};

watch(lastTrafficList, () => {
  lastTrafficChart.value.setOption(getLastTrafficChartOption(lastTrafficList.value));
});
watch(lastResponseList, () => {
  lastResponseChart.value.setOption(getLastResponseChartOption(lastResponseList.value));
});

const getRealTimeSectionHeight = () => {
  return window.screen.availHeight - 770;
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

const dragOptions = ref({
  animation: 100,
  disabled: false,
  ghostClass: 'ghost',
});

//실시간차트.. 임시용

const base = ref(new Date(2022, 2, 30));
const date = ref([] as any);
const data1 = ref([Math.random() * 50]);
const data2 = ref([Math.random() * 40]);
const data3 = ref([Math.random() * 30]);
const data4 = ref([Math.random() * 30]);
const data5 = ref([Math.random() * 30]);
const data6 = ref([Math.random() * 20]);
const data7 = ref([Math.random() * 10]);

const addData = () => {
  base.value = addDate(base.value, 1);
  date.value.push([base.value.getFullYear(), base.value.getMonth() + 1, base.value.getDate()].join('/'));
  data1.value.push(Math.random() * (150 - 1) + data1.value[data1.value.length - 1]);
  data2.value.push(Math.random() * (100 - 20) + data2.value[data2.value.length - 1]);
  data3.value.push(Math.random() * (120 - 10) + data3.value[data3.value.length - 1]);
  data4.value.push(Math.random() * (80 - 30) + data4.value[data4.value.length - 1]);
  data5.value.push(Math.random() * (20 - 10) + data5.value[data5.value.length - 1]);
  data6.value.push(Math.random() * (70 - 30) + data6.value[data6.value.length - 1]);
  data7.value.push(Math.random() * (30 - 20) + data7.value[data7.value.length - 1]);
};

const calcedWidth = ref(0);
const calcedheight = ref(0);
const dashboardRef = ref<HTMLDivElement | null>(null);
const observeSize = () => {
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      calcedWidth.value = width;
      calcedheight.value = height;
    });
  });
  ro.observe(dashboardRef.value as HTMLDivElement);
};
watch(calcedWidth, () => {
  console.log('resize!!');
  lastTrafficChart.value.resize();
  lastResponseChart.value.resize();
  // realTimeChart.value.resize();
});
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

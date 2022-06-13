<template>
  <div>
    <transition name="modal" appear>
      <div class="modal-overlay">
        <div class="pop-wrap lg-pop">
          <div class="text-center" v-if="isShowProgress">
            <b-spinner label="Large Spinner"></b-spinner>
          </div>
          <div class="pop-header">
            <h1 class="h1-tit">{{ msgId }}</h1>
            <button @click="emit('close')">
              <i><img src="@/assets/close.svg" :alt="$t('common.close')" :title="$t('common.close')" /></i>
            </button>
          </div>
          <div class="pop-container">
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
                  <ApiDetailModalApiList
                    v-for="(item, index) in serviceList.svcStat[0].apiStat"
                    :key="index"
                    :kind="'svc'"
                    :item="item"
                  />
                </ul>
                <ul v-else-if="msgType == 'api' && apiList.apiStat !== undefined">
                  <ApiDetailModalApiList :kind="'api'" :item="apiList.apiStat[0]" />
                </ul>
              </div>
            </div>
          </div>
          <div class="pop-footer">
            <button class="lg-btn purple-btn" @click="$emit('close')">{{ $t('common.ok') }}</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, shallowRef, watch, type Ref } from 'vue';

import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';
import type { StatResponse } from '@/types/MonitoringStatisticType';
import type {
  RealtimeServiceStatDetail,
  RealtimeApiStatDetail,
  TrafficService,
  TrafficApi,
  ControlDetailRequest,
} from '@/types/MonitoringControlType';

import { disableScrolling, enableScrolling } from '@/utils/screen';

import ApiDetailModalApiList from '@/components/monitoring/control/ApiDetailModalApiList.vue';

import MonitoringControlRepository from '@/repository/monitoring-control-repository';
import MonitoringStatisticReoisitory from '@/repository/monitoring-statistic-repository';

import { modalInjectionKey } from '@/plugins/modal/ModalPlugin';
import { useI18n } from 'vue-i18n';
import ErrorCode from '@/error/ErrorCodes';

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

// 1. 7일 그래프(모달 오른쪽), 실시간 *** 통계 상세 - 일별 트래픽 비교
const realtimeServiceStatDetailList: Ref<RealtimeServiceStatDetail[]> = ref([]);
const realtimeApiStatDetailList: Ref<RealtimeApiStatDetail[]> = ref([]);

// 2. 기준시간별 추이(모달 왼쪽),*** 트래픽 추이
const trafficService: Ref<TrafficService[]> = ref([]);
const trafficApi: Ref<TrafficApi[]> = ref([]);

// 2-1. 차트 옵션
const myAreaChart = shallowRef({} as EChartsType);
const myAreaChartApiTop5AWeekTransitionSeries: Ref<echarts.LineSeriesOption[]> = ref([]);

const getAreaOption = () => {
  let totalData = [];
  let successData = [];
  let failData = [];
  let xAxisData = [];
  if (props.msgType == 'svc') {
    for (let index = 0; index < trafficService.value[0].svcTrafc.length; index++) {
      totalData.push(trafficService.value[0].svcTrafc[index].totCnt);
      successData.push(trafficService.value[0].svcTrafc[index].sucesCnt);
      failData.push(trafficService.value[0].svcTrafc[index].failCnt);
      xAxisData.push(trafficService.value[0].svcTrafc[index].statBaseTm.slice(11, 16));
    }
  } else if (props.msgType == 'api') {
    for (let index = 0; index < trafficApi.value[0].apiTrafc.length; index++) {
      totalData.push(trafficApi.value[0].apiTrafc[index].totCnt);
      successData.push(trafficApi.value[0].apiTrafc[index].sucesCnt);
      failData.push(trafficApi.value[0].apiTrafc[index].failCnt);
      xAxisData.push(trafficApi.value[0].apiTrafc[index].statBaseTm.slice(11, 16));
    }
  }

  myAreaChartApiTop5AWeekTransitionSeries.value = [
    {
      name: '실패',
      data: failData,
    },
    {
      name: '성공',
      data: successData,
    },
    {
      name: '전체',
      data: totalData,
    },
  ];

  const option = {
    tooltip: {
      appendToBody: true,
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    grid: {
      top: '10%',
      bottom: '3%',
      left: '3%',
      right: '4%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: myAreaChartApiTop5AWeekTransitionSeries.value.map((item) =>
      Object.assign(item, {
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
      })
    ),
  };
  return option;
};

const setAreaChart = () => {
  const areaDom = document.getElementById('stacked-area-chart-servicetop5') as HTMLDivElement;
  myAreaChart.value = echarts.init(areaDom);
  myAreaChart.value.setOption(getAreaOption());
};

// 3. 리스트, *** 통계
const serviceList: Ref<StatResponse> = ref({} as StatResponse);
const apiList: Ref<StatResponse> = ref({} as StatResponse);

// 3-1. 차트 옵션
const myBarChart = shallowRef({} as EChartsType);
const myBarChartApiTop5AWeekTransitionSeries: Ref<echarts.LineSeriesOption[]> = ref([]);

const getBarOption = () => {
  let successData = [];
  let failData = [];
  let yAxisData = [];

  if (props.msgType == 'svc') {
    for (let index = 0; index < realtimeServiceStatDetailList.value.length; index++) {
      successData.unshift(realtimeServiceStatDetailList.value[index].sucesCnt);
      failData.unshift(realtimeServiceStatDetailList.value[index].failCnt);
      if (index == 0) {
        yAxisData.unshift('Today');
      } else {
        yAxisData.unshift(realtimeServiceStatDetailList.value[index].statBaseDt.slice(5, 10));
      }
    }
  } else if (props.msgType == 'api') {
    for (let index = 0; index < realtimeApiStatDetailList.value.length; index++) {
      successData.unshift(realtimeApiStatDetailList.value[index].sucesCnt);
      failData.unshift(realtimeApiStatDetailList.value[index].failCnt);
      if (index == 0) {
        yAxisData.unshift('Today');
      } else {
        yAxisData.unshift(realtimeApiStatDetailList.value[index].statBaseDt.slice(5, 10));
      }
    }
  }

  myBarChartApiTop5AWeekTransitionSeries.value = [
    {
      name: '성공',
      data: successData,
    },
    {
      name: '실패',
      data: failData,
    },
  ];

  const option = {
    tooltip: {
      appendToBody: true,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      top: '5%',
      left: '3%',
      right: '6%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
    },
    series: myBarChartApiTop5AWeekTransitionSeries.value.map((item) =>
      Object.assign(item, {
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          fontSize: 9,
        },
        emphasis: {
          focus: 'series',
        },
      })
    ),
  };
  return option;
};

const setBarChart = () => {
  const barDom = document.getElementById('stacked-horizontal-bar-servicetop5') as HTMLDivElement;
  myBarChart.value = echarts.init(barDom);
  myBarChart.value.setOption(getBarOption());
};

// 차트 관련 함수
const domInitArea = () => {
  setAreaChart();

  window.addEventListener(
    'resize',
    () => {
      chartResizeArea();
    },
    { passive: true }
  );
};

const domInitBar = () => {
  setBarChart();

  window.addEventListener(
    'resize',
    () => {
      chartResizeBar();
    },
    { passive: true }
  );
};

const chartResizeBar = () => {
  myBarChart.value.resize();
};

const chartResizeArea = () => {
  myAreaChart.value.resize();
};

const getTimeArr = (endTime: string, timeInterval: number): string[] => {
  let tempEndTime = new Date(endTime);
  let tempStartTime = new Date(endTime);
  tempEndTime.setMinutes(tempEndTime.getMinutes() - 1);
  tempStartTime.setMinutes(tempStartTime.getMinutes() - timeInterval);

  let yearEnd = tempEndTime.getFullYear();
  let monthEnd = String(tempEndTime.getMonth() + 1).padStart(2, '0');
  let dateEnd = String(tempEndTime.getDate()).padStart(2, '0');
  let hoursEnd = String(tempEndTime.getHours()).padStart(2, '0');
  let minutesEnd = String(tempEndTime.getMinutes()).padStart(2, '0');

  let yearStart = tempStartTime.getFullYear();
  let monthStart = String(tempStartTime.getMonth() + 1).padStart(2, '0');
  let dateStart = String(tempStartTime.getDate()).padStart(2, '0');
  let hoursStart = String(tempStartTime.getHours()).padStart(2, '0');
  let minutesStart = String(tempStartTime.getMinutes()).padStart(2, '0');

  return [
    `${yearEnd}-${monthEnd}-${dateEnd} ${hoursEnd}:${minutesEnd}`,
    `${yearStart}-${monthStart}-${dateStart} ${hoursStart}:${minutesStart}`,
  ];
};

// cycle hook
onMounted(() => {
  disableScrolling();
  isShowProgress.value = true;
  const timeArr = getTimeArr(props.msgEndTime, props.msgTimeInterval);

  // service 조회
  if (props.msgType === 'svc') {
    // 1. 오른쪽 그래프
    const barGraphParam: ControlDetailRequest = {
      svcId: props.msgId,
      statBaseTm: timeArr[0],
      statPerd: props.msgTimeInterval,
      dayTrafcComprCnt: 7,
    };
    // 2. 왼쪽 그래프
    const areaGraphParam: ControlDetailRequest = {
      svcId: props.msgId,
      statBaseUnit: 'MI',
      statStTm: timeArr[1],
      statEndTm: timeArr[0],
    };

    // 3. 리스트(api별)
    const listParam: ControlDetailRequest = {
      svcId: props.msgId,
      statStTm: timeArr[1],
      statEndTm: timeArr[0],
    };

    const promise1 = controlRepository.getRealtimeServiceStatDetailList(barGraphParam);
    const promise2 = controlRepository.getTrafficService(areaGraphParam);
    const promise3 = statisticRepository.getServiceList(listParam);
    Promise.all([promise1, promise2, promise3])
      .then((res) => {
        realtimeServiceStatDetailList.value = res[0];
        trafficService.value = res[1];
        serviceList.value = res[2];

        isShowProgress.value = false;
        isShow.value = true;
        domInitBar();
        domInitArea();
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
    // 1. 오른쪽 그래프
    const barGraphParam: ControlDetailRequest = {
      sysId: props.msgId.split('.')[0],
      apiId: props.msgId.split('.')[1],
      statBaseTm: timeArr[0],
      statPerd: props.msgTimeInterval,
      dayTrafcComprCnt: 7,
    };
    // 2. 왼쪽 그래프
    const areaGraphParam = {
      apiId: props.msgId,
      // svcId: msgId.split('.'),
      statBaseUnit: 'MI',
      statStTm: timeArr[1],
      statEndTm: timeArr[0],
    };
    // 3. 리스트(api 한 개)
    const listParam = {
      apiId: props.msgId,
      statStTm: timeArr[1],
      statEndTm: timeArr[0],
    };

    const promise1 = controlRepository.getRealtimeApiStatDetailList(barGraphParam);
    const promise2 = controlRepository.getTrafficApi(areaGraphParam);
    const promise3 = statisticRepository.getApiList(listParam);

    Promise.all([promise1, promise2, promise3])
      .then((res) => {
        realtimeApiStatDetailList.value = res[0];
        trafficApi.value = res[1];
        apiList.value = res[2];

        isShowProgress.value = false;
        isShow.value = true;

        domInitBar();
        domInitArea();
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
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    chartResizeArea();
    chartResizeBar();
  });
  enableScrolling();
});

// watch(realtimeServiceStatDetailList.value, () => {
//   myBarChart.value.setOption(getBarOption());
// });

// watch(serviceList.value, () => {
//   isShow.value = true;
// });

// watch(realtimeApiStatDetailList.value, () => {
//   myBarChart.value.setOption(getBarOption());
// });

// watch(apiList.value, () => {
//   isShow.value = true;
// });
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

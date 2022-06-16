<template>
  <div>
    <ModalLayout size="xl"
      ><template v-slot:modalHeader
        ><h2 class="h2-tit">Total Traffic Detail</h2>
        <button @click="$emit('close')">
          <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
        </button>
      </template>
      <template v-slot:modalContainer>
        <div style="display: flex; width: 100%; height: 100%; overflow: hidden">
          <!------- Detail Chart -------->
          <div
            style="height: 100%"
            :class="{ 'before-chart-width': !apiDetailModal, 'after-chart-width': apiDetailModal }"
            ref="trafficDetailRef"
          >
            <div class="error-stat-detail-chart" id="errorStatDetail"></div>
            <div class="total-traffic-detail-chart" id="totalTrafficDetail"></div>
          </div>
          <!------- request API List -------->
          <div v-if="apiDetailModal" class="request-api-list-pop">
            <div class="pop-header">
              <h2 class="h2-tit">Request API List</h2>
              <button @click="hideModal">
                <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
              </button>
            </div>
            <div class="pop-container">
              <p class="total">
                요청된 API 수 : <span>{{ apiList.apiStat?.length }}</span>
              </p>
              <div class="request-api-detail-list" v-if="!isShowProgress">
                <div class="service-list">
                  <ul>
                    <ApiRow v-for="(item, index) in apiList.apiStat" :key="index" :apiList="item" />
                  </ul>
                </div>
              </div>
              <div class="service-list">
                <div style="position: relative; text-align: center" v-if="isShowProgress">
                  <b-spinner label="Large Spinner"></b-spinner>
                </div>
              </div>
            </div>
          </div>
          <!------- handler pop -------->
        </div>
      </template>
      <template v-slot:modalFooter
        ><button class="lg-btn purple-btn" @click="$emit('close')">
          {{ $t('common.ok') }}
        </button>
      </template>
    </ModalLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef, watch, type Ref } from 'vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import { getTotalTrafficDetailChartOption, getErrorStatChartOption } from '@/components/dash-board/chartOptions';
import * as echarts from 'echarts';
import DashBoardRepository from '@/repository/DashBoardRepository';
import ApiRow from '@/components/monitoring/ApiRow.vue';
import MonitoringStatisticRepository from '@/repository/MonitoringStatisticRepository';
import { disableScrolling } from '@/utils/screen';
import type { StatResponse } from '@/types/MonitoringStatisticType';
import ErrorCode from '@/error/ErrorCodes';
const props = defineProps({
  baseTime: { type: String, required: true, default: '' },
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();
const statRepository = new MonitoringStatisticRepository();
const dashBoardRepository = new DashBoardRepository();
const totalTrafficDetailChart = shallowRef({} as echarts.EChartsType);
const errorStatDetailChart = shallowRef({} as echarts.EChartsType);
const apiDetailModal = ref(false);
const apiList: Ref<StatResponse> = ref({
  totCnt: 0,
  sucesCnt: 0,
  failCnt: 0,
  sucesRate: 0,
  trafcStTm: '',
  trafcEndTm: '',
  svcStat: [],
  apiStat: [],
});
const isShowProgress = ref(false);

onMounted(() => {
  Promise.all([
    dashBoardRepository.getTotalAPITrafficDetail({
      statBaseTm: '2022-06-15 13:38',
      statBaseUnit: 'MI',
      statPerd: 1440,
    }),
    dashBoardRepository.getErrorStatsDetail({
      statBaseTm: '2022-06-15 13:38',
      statBaseUnit: 'MI',
      statPerd: 1440,
    }),
    dashBoardRepository.getErrorStats({
      statBaseUnit: 'MI',
      statPerd: 1440,
    }),
  ]).then((res) => {
    totalTrafficDetailChart.value = echarts.init(document.getElementById('totalTrafficDetail') as HTMLDivElement);
    errorStatDetailChart.value = echarts.init(document.getElementById('errorStatDetail') as HTMLDivElement);
    totalTrafficDetailChart.value.setOption(getTotalTrafficDetailChartOption(res[0]));
    errorStatDetailChart.value.setOption(getErrorStatChartOption(res[2].miCnt, res[2].maCnt, res[2].crCnt));
    totalTrafficDetailChart.value.on('updateAxisPointer', function (event: any) {
      const xAxisInfo = event.axesInfo[0];
      if (xAxisInfo) {
        if (timerId) {
          clearTimeout(timerId);
        }
        timerId = setTimeout(async () => {
          const dimension: number = xAxisInfo.value;
          errorStatDetailChart.value.setOption(
            getErrorStatChartOption(res[1][dimension].miCnt, res[1][dimension].maCnt, res[1][dimension].crCnt)
          );
        }, 100);
      }
    });
    totalTrafficDetailChart.value.on('globalout', function (event: any) {
      errorStatDetailChart.value.setOption(getErrorStatChartOption(res[2].miCnt, res[2].maCnt, res[2].crCnt));
      clearTimeout(timerId);
    });
    totalTrafficDetailChart.value.on('click', function (params) {
      const tm = res[0][params.dataIndex].statBaseTm;
      const searchForm = {
        statEndTm: tm.substring(0, 10) + ' ' + tm.substring(11, 16),
        statStTm: tm.substring(0, 10) + ' ' + tm.substring(11, 16),
      };
      statRepository
        .getApiList(searchForm)
        .then((res) => {
          observeSize();
          apiList.value = res;
          isShowProgress.value = false;
          apiDetailModal.value = true;
        })
        .catch((err) => {
          if (err.getErrorCode() == ErrorCode.CANCEL_ERROR) {
          } else {
            isShowProgress.value = false;
            // this.$modal.show(`${this.$t('error.server_error')}`);
          }
        });
    });
  });
});

let timerId = 0;

const hideModal = () => {
  apiDetailModal.value = false;
};

const chartBoxWidth = ref(0);
const chartBoxHeight = ref(0);
const trafficDetailRef = ref<HTMLDivElement | null>(null);
const observeSize = () => {
  const ro = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      chartBoxWidth.value = width;
      chartBoxHeight.value = height;
    });
  });
  ro.observe(trafficDetailRef.value as HTMLDivElement);
};

watch(chartBoxWidth, () => {
  console.log('resize');
  totalTrafficDetailChart.value.resize();
  errorStatDetailChart.value.resize();
});
</script>

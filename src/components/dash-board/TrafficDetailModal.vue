<template>
  <ModalLayout v-if="true" :alert="!true" errorTitle="정보" size="l"
    ><template v-slot:modalHeader
      ><h2 class="h2-tit">Total Traffic Detail</h2>
      <button @close="modalHide()">
        <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
      </button>
    </template>
    <template v-slot:modalContainer
      ><div class="total-traffic-detail-chart" id="errorStatDetail"></div>
      <div class="total-traffic-detail-chart" id="totalTrafficDetail"></div>
    </template>
    <template v-slot:modalFooter
      ><button class="lg-btn purple-btn" @click="modalHide()">
        {{ $t('common.ok') }}
      </button>
    </template>
  </ModalLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import { getTotalTrafficDetailOption, getFailProgressChartOption } from '@/components/dash-board/chart-options';
import * as echarts from 'echarts';
import DashBoardRepository from '@/repository/dash-board-repository';
const dashBoardRepository = new DashBoardRepository();
const showModal = ref(false);

const modalHide = () => {
  showModal.value = false;
};
const totalTrafficDetailChart = ref({} as echarts.EChartsType);
const errorStatDetailChart = ref({} as echarts.EChartsType);

onMounted(() => {
  Promise.all([
    dashBoardRepository.getTotalAPITrafficDetail({
      statBaseTm: '2022-06-14 16:59',
      statBaseUnit: 'MI',
      statPerd: 1440,
    }),
    dashBoardRepository.getErrorStatsDetail({
      statBaseTm: '2022-06-14 16:59',
      statBaseUnit: 'MI',
      statPerd: 1440,
    }),
    dashBoardRepository.getErrorStats({
      statBaseUnit: 'MI',
      statPerd: 1440,
    }),
  ]).then((res) => {
    const trafficOption = getTotalTrafficDetailOption(res[0]);
    const errorOption = getFailProgressChartOption(res[2].miCnt, res[2].maCnt, res[2].crCnt);
    totalTrafficDetailChart.value = echarts.init(document.getElementById('totalTrafficDetail') as HTMLDivElement);
    errorStatDetailChart.value = echarts.init(document.getElementById('errorStatDetail') as HTMLDivElement);
    totalTrafficDetailChart.value.setOption(trafficOption);
    errorStatDetailChart.value.setOption(errorOption);
    totalTrafficDetailChart.value.on('updateAxisPointer', function (event: any) {
      const xAxisInfo = event.axesInfo[0];
      if (xAxisInfo) {
        if (timerId) {
          clearTimeout(timerId);
        }
        timerId = setTimeout(async () => {
          const dimension = xAxisInfo.value + 1;
          totalTrafficDetailChart.value.setOption({
            series: {
              id: 'bar',
              label: {
                formatter: '{b}: {d}건',
              },
              encode: {
                value: dimension,
                tooltip: dimension,
              },
            },
          });
        }, 200);
      }
    });
  });
});

let timerId = 0;
</script>

<style scoped>
.total-traffic-detail-chart {
  width: 800px;
  height: 300px;
}
</style>

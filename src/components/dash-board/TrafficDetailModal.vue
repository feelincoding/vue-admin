<template>
  <ModalLayout size="lg"
    ><template v-slot:modalHeader
      ><h2 class="h2-tit">Total Traffic Detail</h2>
      <button @click="$emit('close')">
        <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
      </button>
    </template>
    <template v-slot:modalContainer
      ><div class="total-traffic-detail-chart" id="errorStatDetail"></div>
      <div class="total-traffic-detail-chart" id="totalTrafficDetail"></div>
    </template>
    <template v-slot:modalFooter
      ><button class="lg-btn purple-btn" @click="$emit('close')">
        {{ $t('common.ok') }}
      </button>
    </template>
  </ModalLayout>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef, watch, type Ref } from 'vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import { getTotalTrafficDetailOption, getFailProgressChartOption } from '@/components/dash-board/chart-options';
import * as echarts from 'echarts';
import DashBoardRepository from '@/repository/dash-board-repository';
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const dashBoardRepository = new DashBoardRepository();
const totalTrafficDetailChart = shallowRef({} as echarts.EChartsType);
const errorStatDetailChart = shallowRef({} as echarts.EChartsType);

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
    totalTrafficDetailChart.value.setOption(getTotalTrafficDetailOption(res[0]));
    errorStatDetailChart.value.setOption(getFailProgressChartOption(res[2].miCnt, res[2].maCnt, res[2].crCnt));
    totalTrafficDetailChart.value.on('updateAxisPointer', function (event: any) {
      const xAxisInfo = event.axesInfo[0];
      if (xAxisInfo) {
        if (timerId) {
          clearTimeout(timerId);
        }
        timerId = setTimeout(async () => {
          const dimension: number = xAxisInfo.value;
          console.log(dimension - 1);
          errorStatDetailChart.value.setOption(
            getFailProgressChartOption(res[1][dimension].miCnt, res[1][dimension].maCnt, res[1][dimension].crCnt)
          );
        }, 200);
      }
    });
  });
});

let timerId = 0;
</script>

<style scoped>
.total-traffic-detail-chart {
  width: 100%;
  height: 50%;
}
</style>

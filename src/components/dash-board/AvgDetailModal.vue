<template>
  <ModalLayout size="xl"
    ><template v-slot:modalHeader
      ><h2 class="h2-tit">Avg / Tps Detail</h2>
      <button @click="$emit('close')">
        <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
      </button>
    </template>
    <template v-slot:modalContainer
      ><div class="avg-detail-chart" id="avgDetail"></div>
      <div class="tps-detail-chart" id="tpsDetail"></div>
    </template>
    <template v-slot:modalFooter
      ><button class="lg-btn purple-btn" @click="$emit('close')">
        {{ $t('common.ok') }}
      </button>
    </template>
  </ModalLayout>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import ModalLayout from '@/components/commons/modal/ModalLayout.vue';
import { getAvgDetailOption, getTpsDetailOption } from '@/components/dash-board/chartOptions';
import * as echarts from 'echarts';
import DashBoardRepository from '@/repository/dash-board-repository';
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const dashBoardRepository = new DashBoardRepository();
const avgDetailChart = shallowRef({} as echarts.EChartsType);
const tpsDetailChart = shallowRef({} as echarts.EChartsType);

onMounted(() => {
  Promise.all([
    dashBoardRepository.getApiResponseStatusDetail({
      statBaseTm: '2022-06-15 13:38',
      statBaseUnit: 'MI',
      statPerd: 1440,
    }),
  ]).then((res) => {
    avgDetailChart.value = echarts.init(document.getElementById('avgDetail') as HTMLDivElement);
    tpsDetailChart.value = echarts.init(document.getElementById('tpsDetail') as HTMLDivElement);
    avgDetailChart.value.setOption(getAvgDetailOption(res[0]));
    tpsDetailChart.value.setOption(getTpsDetailOption(res[0]));
  });
});
</script>

<style scoped>
.avg-detail-chart {
  width: 100%;
  height: 50%;
}
.tps-detail-chart {
  width: 100%;
  height: 50%;
}
</style>

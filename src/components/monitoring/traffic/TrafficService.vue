<template>
  <TrafficSelectSearch
    :isFocus="isSearchFocus"
    :placeholder="'서비스'"
    tab="service"
    :propServiceList="searchServiceList"
    :propApiList="null"
    @search="getSearchOption"
  />

  <div class="chart-wrap traffic-chart">
    <TrafficServiceChart :serviceList="serviceList" :timeUnit="timeUnit" v-if="serviceList.length > 0" />
    <div class="no-data" style="text-align: center" v-else>
      <p>{{ emptyMsg }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, type Ref } from 'vue';
import TrafficSelectSearch from '@/components/monitoring/traffic/TrafficSelectSearch.vue';
import TrafficServiceChart from '@/components/monitoring/traffic/TrafficServiceChart.vue';
import MonitoringTrafficRepository from '@/repository/MonitoringTrafficRepository';
import MonitoringStatisticRepository from '@/repository/MonitoringStatisticRepository';
import type { RequestTrafficServiceParams, TrafficService } from '@/types/MonitoringTrafficType';
import { useI18n } from 'vue-i18n';
const { t } = useI18n({});
const props = defineProps<{
  isSearchFocus: boolean;
}>();
const trafficRepository = new MonitoringTrafficRepository();
const statisticRepository = new MonitoringStatisticRepository();
const timeUnit = ref('MM');
const serviceList: Ref<TrafficService[]> = ref([]);
const searchServiceList: Ref<string[]> = ref([]);
onMounted(() => {
  statisticRepository.getSearchSvcList().then((res) => {
    searchServiceList.value = res;
  });
});
const emptyMsg = ref(t('traffic.need_search'));
watch(serviceList, () => {
  if (serviceList.value.length === 0) {
    emptyMsg.value = '조회 가능한 데이터가 없습니다.';
  } else if (serviceList.value === undefined) {
    emptyMsg.value = '데이터를 조회해주세요.';
  }
});
function getSearchOption(event: RequestTrafficServiceParams) {
  timeUnit.value = event.statBaseUnit;
  trafficRepository.getServiceList(event).then((res) => {
    console.log(event);
    console.log(res);
    serviceList.value = res;
  });
}
</script>

<template>
  <div>
    <TrafficSelectSearch
      :isFocus="isSearchFocus"
      :placeholder="'API'"
      tab="api"
      :propApiList="searchApiList"
      :propServiceList="null"
      @search="getSearchOption"
    />

    <div class="chart-wrap traffic-chart">
      <div class="chart-div">
        <TrafficAPIChart :apiList="apiList" v-if="apiList.length > 0" :timeUnit="timeUnit" />
        <div class="no-data" style="text-align: center" v-else>
          <p>{{ emptyMsg }}</p>
        </div>
      </div>
    </div>
  </div>
  <!--- // comp --->
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, type Ref } from 'vue';
import TrafficSelectSearch from '@/components/monitoring/TrafficSelectSearch.vue';
import MonitoringTrafficRepository from '@/repository/monitoring-traffic-repository';
import MonitoringStatisticRepository from '@/repository/monitoring-statistic-repository';
import type { TrafficApi } from '@/types/MonitoringTrafficType';
import type { ApiSearch } from '@/types/MonitoringStatisticType';
// import TrafficAPIChart from '@/components/monitoring/TrafficAPIChart.vue';
const props = defineProps<{
  isSearchFocus: boolean;
}>();
const trafficRepository = new MonitoringTrafficRepository();
const statisticRepository = new MonitoringStatisticRepository();
const timeUnit = ref('MM');
const apiList: Ref<TrafficApi[]> = ref([]);
const searchApiList: Ref<ApiSearch[]> = ref([]);
const emptyMsg = ref('데이터를 조회해주세요.');
onMounted(() => {
  statisticRepository.getSearchApiList().then((res) => {
    searchApiList.value = res;
  });
});
watch(apiList, () => {
  if (apiList.value.length === 0) {
    emptyMsg.value = '조회 가능한 데이터가 없습니다.';
  } else if (apiList.value === undefined) {
    emptyMsg.value = '데이터를 조회해주세요.';
  }
});

function getSearchOption(event: any) {
  console.log(event);
  timeUnit.value = event.statBaseUnit as string;
  trafficRepository.getApiList(event).then((res) => {
    apiList.value = res;
  });
}
</script>

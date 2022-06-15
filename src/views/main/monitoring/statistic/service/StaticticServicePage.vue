<template>
  <div>
    <StatisticSelectSearch
      :isFocus="isSearchFocus"
      :propServiceList="searchSvcList"
      :propApiList="null"
      tab="service"
      @search="getSearchOption"
    />
    <div class="monitor-comp">
      <div class="tb-tit">
        <h3 class="h3-tit">Service List</h3>
        <p class="total">
          total : <span>{{ (serviceList !== null) ? numberWithCommas(serviceList.totCnt as number) : 0 }}</span>
        </p>
      </div>
      <div
        class="service-list"
        v-if="serviceList != undefined && serviceList.svcStat != undefined && serviceList.svcStat.length > 0"
      >
        <ul>
          <ServiceRow v-for="(item, index) in serviceList.svcStat" :key="index" :svcList="item" />
        </ul>
      </div>
      <div class="service-list" v-else>
        <div style="position: relative; text-align: center" v-if="isShowProgress">
          <b-spinner label="Large Spinner"></b-spinner>
        </div>
        <div style="text-align: center" v-if="!isShowProgress">
          <p>{{ emptyMsg }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ErrorCode from '@/error/ErrorCodes';
import MonitoringStatisticRepository from '@/repository/monitoring-statistic-repository';
import { numberWithCommas } from '@/utils/validation';
import type { StatResponse } from '@/types/MonitoringStatisticType';
import { ref, watch, onMounted, type Ref } from 'vue';
import StatisticSelectSearch from '@/components/monitoring/StatisticSelectSearch.vue';
import ServiceRow from '@/components/monitoring/ServiceRow.vue';
const props = defineProps<{
  isSearchFocus: boolean;
}>();

const statRepository = new MonitoringStatisticRepository();
let emptyMsg = ref('데이터를 조회해주세요.');

let isShowProgress = ref(false);

let serviceList: Ref<StatResponse | null> = ref(null);
let searchSvcList: Ref<string[]> = ref([]);

onMounted(() => {
  statRepository.getSearchSvcList('').then((res) => {
    searchSvcList.value = res;
  });
});

watch(serviceList, () => {
  if (
    serviceList.value === null ||
    (serviceList.value != null && (serviceList.value.svcStat === undefined || serviceList.value.svcStat.length === 0))
  ) {
    emptyMsg.value = '조회 가능한 데이터가 없습니다.';
  } else if (serviceList.value === undefined) {
    emptyMsg.value = '데이터를 조회해주세요.';
  } else {
    emptyMsg.value = '';
  }
});

function getSearchOption(event: any) {
  isShowProgress.value = true;
  statRepository
    .getServiceList(event)
    .then((res) => {
      serviceList.value = res;
      isShowProgress.value = false;
    })
    .catch((err) => {
      if (err.getErrorCode() == ErrorCode.CANCEL_ERROR) {
        console.log('SYSTEM API Cancel');
      } else {
        isShowProgress.value = false;
        // this.$modal.show(`${this.$t('error.server_error')}`);
      }
    });
}
</script>

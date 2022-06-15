<template>
  <div>
    <StatisticSelectSearch
      :isFocus="isSearchFocus"
      :propServiceList="null"
      :propApiList="searchApiList"
      tab="api"
      @search="getSearchOption"
    />
    <div class="monitor-comp">
      <div class="tb-tit">
        <h3 class="h3-tit">API List</h3>
        <p class="total">
          total : <span>{{ apiList !== null ? numberWithCommas(apiList.totCnt) : 0 }}</span>
        </p>
      </div>

      <div class="stati-list" v-if="apiList != undefined && apiList.apiStat != undefined && apiList.apiStat.length > 0">
        <ul>
          <ApiRow v-for="(item, index) in apiList.apiStat" :key="index" :apiList="item" />
        </ul>
      </div>
      <div class="stati-list" v-else>
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
import MonitoringStatisticRepository from '@/repository/MonitoringStatisticRepository';
import type { ApiSearch, StatResponse } from '@/types/MonitoringStatisticType';
import { numberWithCommas } from '@/utils/validation';
import { ref, watch, onMounted, type Ref } from 'vue';
import StatisticSelectSearch from '@/components/monitoring/StatisticSelectSearch.vue';
import ApiRow from '@/components/monitoring/ApiRow.vue';
const props = defineProps<{
  isSearchFocus: boolean;
}>();
const statRepository = new MonitoringStatisticRepository();
const emptyMsg = ref('데이터를 조회해주세요.');
const isShowProgress = ref(false);
const apiList: Ref<StatResponse | null> = ref(null);
const searchApiList: Ref<ApiSearch[]> = ref([]);

onMounted(() => {
  statRepository.getSearchApiList('').then((res) => {
    console.log(res);
    searchApiList.value = res;
  });
});
watch(apiList, () => {
  if (
    apiList.value === null ||
    (apiList.value != null && (apiList.value.apiStat === undefined || apiList.value.apiStat.length === 0))
  ) {
    emptyMsg.value = '조회 가능한 데이터가 없습니다.';
  } else if (apiList.value === undefined) {
    emptyMsg.value = '데이터를 조회해주세요.';
  } else {
    emptyMsg.value = '데이터를 조회해주세요.';
  }
});

function getSearchOption(event: object) {
  isShowProgress.value = true;
  statRepository
    .getApiList(event)
    .then((res) => {
      apiList.value = res;
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

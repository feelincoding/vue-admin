<template>
  <div>
    <TimeGroup @changeTime="handleTime" />
    <div class="monitor-comp">
      <CardSort
        :cnt="apiList === undefined || apiList.apiStat === undefined ? 0 : apiList.apiStat.length"
        @changeSort="handleSort"
      />
      <div class="card-wrap">
        <div class="text-center" v-if="isShowProgress">
          <b-spinner label="Large Spinner"></b-spinner>
        </div>
        <div
          v-if="!isShowProgress && (apiList.apiStat === undefined || apiList.apiStat.length == 0)"
          style="text-align: center"
        >
          {{ $t('common.no_data') }}
        </div>
        <ul v-else-if="!isShowProgress && apiList.apiStat !== undefined && apiList.apiStat.length > 0">
          <ControlCard
            v-for="(item, index) in apiList.apiStat"
            :key="index"
            :item="item"
            :isSort.sync="isSort"
            @val="(msg: any) => handleVal(msg)"
          ></ControlCard>
        </ul>
      </div>
    </div>
    <ApiServiceDetailModal
      v-if="showApiDetailModal"
      @close="closeModal"
      :apiDetailData="apiDetailData"
      :msgId="apiDetailProps.msgId"
      :msgType="apiDetailProps.msgType"
      :msgEndTime="apiDetailProps.msgEndTime"
      :msgTimeInterval="apiDetailProps.msgTimeInterval"
    ></ApiServiceDetailModal>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue';

import type { Ref } from 'vue';
import type { ControlRequest, RealTimeStat, ApiStat, apiStatDetailProps } from '@/types/MonitoringControlType';
import type { GateWayError } from '@/error/GateWayError';

import TimeGroup from '@/components/monitoring/control/TimeGroup.vue';
import CardSort from '@/components/monitoring/control/CardSort.vue';
import ControlCard from '@/components/monitoring/control/ControlCard.vue';
import ApiServiceDetailModal from '@/components/commons/modal/ApiServiceDetailModal.vue';

import MonitoringControlRepository from '@/repository/monitoring-control-repository';
import ControlSort from '@/components/monitoring/control/controlSort';

import { modalInjectionKey } from '@/plugins/modal/ModalPlugin';
import { useI18n } from 'vue-i18n';
import ErrorCode from '@/error/ErrorCodes';

const { t } = useI18n({});
const modal = inject(modalInjectionKey)!!;

const controlSort = new ControlSort();
const controlRepository = new MonitoringControlRepository();

const searchData: Ref<ControlRequest> = ref({
  sortBase: '',
  statPerd: 0,
});

const apiDetailProps: Ref<apiStatDetailProps> = ref({
  msgId: '',
  msgType: '',
  msgEndTime: '',
  msgTimeInterval: 0,
});
const apiList: Ref<RealTimeStat> = ref({
  statBaseTm: '',
  statPerd: 0,
  apiStat: [] as ApiStat[],
});
const apiDetailData: Ref<ApiStat> = ref({
  sysId: '',
  apiId: '',
  apiDesc: '',
  totCnt: 0,
  sucesCnt: 0,
  failCnt: 0,
  sucesRate: 0,
  failRate: 0,
  crCnt: 0,
  maCnt: 0,
  miCnt: 0,
  tps: 0,
  avgResTm: 0,
});

const isSort = ref(false);
const isShowProgress = ref(false);
const showApiDetailModal = ref(false);

watch(
  () => searchData.value.sortBase,
  (val: string) => {
    isSort.value = !isSort.value;
    if (val !== '') apiList.value = getApiList(val, apiList.value);
  },
  { immediate: true, deep: true }
);

const getApiList = (orderBy: string, list: RealTimeStat) => {
  return orderBy === 'totCnt'
    ? controlSort.sortApiListByCnt(list)
    : orderBy === 'failRate'
    ? controlSort.sortApiListByFailRate(list)
    : orderBy === 'tps'
    ? controlSort.sortApiListByTps(list)
    : controlSort.sortApiListByResTm(list);
};

const handleTime = (event: number) => {
  isShowProgress.value = true;
  searchData.value.statPerd = event;
  if (searchData.value.sortBase === '') searchData.value.sortBase = 'totCnt';
  controlRepository
    .getApiList(searchData.value)
    .then((res) => {
      apiList.value = getApiList(searchData.value.sortBase, res);
      isShowProgress.value = false;
    })
    .catch((err: GateWayError) => {
      if (err.getErrorCode() == ErrorCode.CANCEL_ERROR) {
        console.log('CONTROL SERVICE API Cancel');
      } else {
        modal().show(t('error.server_error'));
        isShowProgress.value = false;
      }
    });
};

const handleSort = (event: string) => {
  searchData.value.sortBase = event;
};

const handleVal = (msg: any) => {
  apiDetailData.value = msg;

  apiDetailProps.value.msgId = msg.sysId + '.' + msg.apiId;
  apiDetailProps.value.msgType = 'api';
  apiDetailProps.value.msgEndTime = apiList.value.statBaseTm;
  apiDetailProps.value.msgTimeInterval = searchData.value.statPerd;

  showApiDetailModal.value = true;
};

const closeModal = () => {
  showApiDetailModal.value = false;
};
</script>

<style scoped></style>

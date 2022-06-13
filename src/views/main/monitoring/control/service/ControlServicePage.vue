<template>
  <div>
    <TimeGroup @changeTime="handleTime" />
    <div class="monitor-comp">
      <CardSort
        :cnt="serviceList === undefined || serviceList.svcStat === undefined ? 0 : serviceList.svcStat.length"
        @changeSort="handleSort"
      />
      <div class="card-wrap">
        <div class="text-center" v-if="isShowProgress">
          <b-spinner label="Large Spinner"></b-spinner>
        </div>
        <div
          v-if="!isShowProgress && (serviceList.svcStat === undefined || serviceList.svcStat.length == 0)"
          style="text-align: center"
        >
          {{ $t('common.no_data') }}
        </div>
        <ul v-else-if="!isShowProgress && serviceList.svcStat !== undefined && serviceList.svcStat.length > 0">
          <ControlCard
            v-for="(item, index) in serviceList.svcStat"
            :key="index"
            :item="item"
            :isSort.sync="isSort"
            @val="(msg: any) => handleVal(msg)"
          ></ControlCard>
        </ul>
      </div>
    </div>
    <ApiDetailModal
      v-if="showApiDetailModal"
      @close="closeModal"
      :apiDetailData="apiDetailData"
      :msgId="apiDetailProps.msgId"
      :msgType="apiDetailProps.msgType"
      :msgEndTime="apiDetailProps.msgEndTime"
      :msgTimeInterval="apiDetailProps.msgTimeInterval"
    ></ApiDetailModal>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue';

import type { Ref } from 'vue';
import type {
  ControlRequest,
  RealTimeStat,
  ServiceStat,
  ApiStat,
  apiStatDetailProps,
} from '@/types/MonitoringControlType';
import type { GateWayError } from '@/error/GateWayError';

import TimeGroup from '@/components/monitoring/control/TimeGroup.vue';
import CardSort from '@/components/monitoring/control/CardSort.vue';
import ControlCard from '@/components/monitoring/control/ControlCard.vue';
import ApiDetailModal from '@/components/monitoring/control/ApiDetailModal.vue';

import ControlSort from '@/components/monitoring/control/controlSort';
import MonitoringControlRepository from '@/repository/monitoring-control-repository';

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
const serviceList: Ref<RealTimeStat> = ref({
  statBaseTm: '',
  statPerd: 0,
  svcStat: [] as ServiceStat[],
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
    if (val !== '') serviceList.value = getServiceList(val, serviceList.value);
  },
  { immediate: true, deep: true }
);

const getServiceList = (orderBy: string, list: RealTimeStat) => {
  return orderBy === 'totCnt'
    ? controlSort.sortServiceListByCnt(list)
    : orderBy === 'failRate'
    ? controlSort.sortServiceListByFailRate(list)
    : orderBy === 'tps'
    ? controlSort.sortServiceListByTps(list)
    : controlSort.sortServiceListByResTm(list);
};

const handleTime = (event: number) => {
  isShowProgress.value = true;
  searchData.value.statPerd = event;
  if (searchData.value.sortBase === '') searchData.value.sortBase = 'totCnt';
  controlRepository
    .getServiceList(searchData.value)
    .then((res) => {
      serviceList.value = getServiceList(searchData.value.sortBase, res);
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

  apiDetailProps.value.msgId = msg.svcId;
  apiDetailProps.value.msgType = 'svc';
  apiDetailProps.value.msgEndTime = serviceList.value.statBaseTm;
  apiDetailProps.value.msgTimeInterval = searchData.value.statPerd;

  showApiDetailModal.value = true;
};

const closeModal = () => {
  showApiDetailModal.value = false;
};
</script>

<style scoped></style>

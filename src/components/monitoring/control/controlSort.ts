import { ref } from 'vue';

import type { Ref } from 'vue';
import type { RealTimeStat } from '@/types/MonitoringControlType';

export default class ControlSort {
  sortServiceListByCnt(serviceList: RealTimeStat): RealTimeStat {
    const list: RealTimeStat = {
      statBaseTm: serviceList.statBaseTm,
      statPerd: serviceList.statPerd,
      svcStat: serviceList.svcStat?.sort((a, b) => b.totCnt - a.totCnt),
    };
    return list;
  }

  sortServiceListByFailRate(serviceList: RealTimeStat): RealTimeStat {
    const list: RealTimeStat = {
      statBaseTm: serviceList.statBaseTm,
      statPerd: serviceList.statPerd,
      svcStat: serviceList.svcStat?.sort((a, b) => b.failRate - a.failRate),
    };
    return list;
  }

  sortServiceListByTps(serviceList: RealTimeStat): RealTimeStat {
    const list: RealTimeStat = {
      statBaseTm: serviceList.statBaseTm,
      statPerd: serviceList.statPerd,
      svcStat: serviceList.svcStat?.sort((a, b) => b.tps - a.tps),
    };
    return list;
  }

  sortServiceListByResTm(serviceList: RealTimeStat): RealTimeStat {
    const list: RealTimeStat = {
      statBaseTm: serviceList.statBaseTm,
      statPerd: serviceList.statPerd,
      svcStat: serviceList.svcStat?.sort((a, b) => b.avgResTm - a.avgResTm),
    };
    return list;
  }

  sortApiListByCnt(apiList: RealTimeStat) {
    const list: Ref<RealTimeStat> = ref({
      statBaseTm: apiList.statBaseTm,
      statPerd: apiList.statPerd,
      apiStat: apiList.apiStat?.sort((a, b) => b.totCnt - a.totCnt),
    });
    return list;
  }

  sortApiListByFailRate(apiList: RealTimeStat) {
    const list: Ref<RealTimeStat> = ref({
      statBaseTm: apiList.statBaseTm,
      statPerd: apiList.statPerd,
      apiStat: apiList.apiStat?.sort((a, b) => b.failRate - a.failRate),
    });
    return list;
  }

  sortApiListByTps(apiList: RealTimeStat) {
    const list: Ref<RealTimeStat> = ref({
      statBaseTm: apiList.statBaseTm,
      statPerd: apiList.statPerd,
      apiStat: apiList.apiStat?.sort((a, b) => b.tps - a.tps),
    });
    return list;
  }

  sortApiListByResTm(apiList: RealTimeStat) {
    const list: Ref<RealTimeStat> = ref({
      statBaseTm: apiList.statBaseTm,
      statPerd: apiList.statPerd,
      apiStat: apiList.apiStat?.sort((a, b) => b.avgResTm - a.avgResTm),
    });
    return list;
  }
}

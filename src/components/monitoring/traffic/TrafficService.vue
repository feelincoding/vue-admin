<template>
  <!-- <div>
    <TrafficSelectSearch
      :isFocus="isSearchFocus"
      :placeholder="'서비스'"
      tab="service"
      :propServiceList="searchServiceList"
      @search="getSearchOption"
    />

    <div class="chart-wrap traffic-chart">
      <div class="chart-div">
        <TrafficServiceChart :serviceList="serviceList" :timeUnit="timeUnit" v-if="serviceList.length > 0" />
        <div class="no-data" style="text-align: center" v-else>
          <p>{{ emptyMsg }}</p>
        </div>
      </div>
    </div>
  </div> -->
</template>
<!-- <script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import TrafficSelectSearch from '@/components/monitoring/TrafficSelectSearch.vue';
import { getModule } from 'vuex-module-decorators';
import MonitoringTrafficModule from '@/store/modules/MonitoringTrafficModule';
import MonitoringStatisticModule from '@/store/modules/MonitoringStatisticModule';
import TrafficServiceChart from '@/components/monitoring/TrafficServiceChart.vue';
@Component({ components: { TrafficSelectSearch, TrafficServiceChart } })
export default class TrafficService extends Vue {
  @Prop({ default: false }) isSearchFocus!: boolean;
  trafficModule = getModule(MonitoringTrafficModule, this.$store);
  statModule = getModule(MonitoringStatisticModule, this.$store);
  timeUnit = 'MM';
  get serviceList() {
    return this.trafficModule.serviceList;
  }

  get searchServiceList() {
    return this.statModule.searchSvcList;
  }
  mounted() {
    this.trafficModule.trafficReset();
    this.statModule.getSearchSvcList();
  }
  @Watch('serviceList')
  handleChangeServiceList() {
    console.log('getservice');
    if (this.serviceList.length === 0) {
      this.emptyMsg = this.$t('traffic.no_data') as string;
    } else {
      this.emptyMsg = '';
    }
  }
  getSearchOption(event: any) {
    this.timeUnit = event.statBaseUnit as string;
    this.trafficModule.getServiceList(event);
  }
  emptyMsg = this.$t('traffic.need_search') as string;
}
</script> -->

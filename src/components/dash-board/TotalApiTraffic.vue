<template>
  <div class="chart-wrap">
    <h3 class="h3-tit">Total API Traffic (24Hour)</h3>

    <div
      class="chart-group api-traffic"
      :class="{
        'total-collapse-modal': modal == false,
        'total-expand-modal': modal == true,
      }"
      @click="toggleModal()"
      ref="totalApiTraffic"
      id="totalApiTraffic"
    >
      <ErrorWrapper v-show="isCommError" />
      <div
        id="totalApiTrafficTotal"
        v-show="modal == false"
        :class="{
          'dash-modal-detail-collapse': modal == true,
          'dash-modal-detail-expand': modal == false,
        }"
        class="api-pie"
      >
        전체
      </div>
      <div
        v-show="modal == false"
        id="totalApiTrafficSuccess"
        :class="{
          'dash-modal-detail-collapse': modal == true,
          'dash-modal-detail-expand': modal == false,
        }"
        class="api-pie"
      >
        성공
      </div>
      <div
        v-show="modal == false"
        id="totalApiTrafficFail"
        :class="{
          'dash-modal-detail-collapse': modal == true,
          'dash-modal-detail-expand': modal == false,
        }"
        class="api-pie"
      >
        실패
      </div>

      <div
        v-show="modal == true"
        onclick="event.stopPropagation()"
        :class="{
          'dash-modal-detail-collapse': modal == false,
          'dash-modal-detail-expand': modal == true,
        }"
        style="width: 100%; height: 100%"
      >
        <h5 class="h5-tit" style="color: #fff6e5">Total API Traffic Detail</h5>
        <button @click="toggleModal()" style="position: absolute; right: 1%; top: 3%">
          <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
        </button>
        <div id="totalApiTrafficDetail" style="width: 100%; height: 90%"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, PropSync, Prop } from 'vue-property-decorator';
import { drawTotalApiTrafficChart } from '@/utils/chart';

import * as echarts from 'echarts';
import {
  getTotalApiTrafficOption,
  getSuccessApiTrafficOption,
  getFailApiTrafficOption,
  getDetailApiTrafficOption,
} from '@/components/dash-board/chartDummy';
import { TotalTrafficStat } from '@/types/DashBoardType';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';

@Component({
  components: { ErrorWrapper },
})
export default class TotalApiTraffic extends Vue {
  @Prop({ type: Boolean, default: false }) isLoadData!: boolean;
  @PropSync('modal', { type: Boolean, default: false }) syncedModal!: boolean;
  @PropSync('isDraged', { type: Number }) syncedIsDraged!: number;
  @Prop() totalApiTraffic!: TotalTrafficStat;
  @Prop() totalApiTrafficDetail!: TotalTrafficStat[];
  @PropSync('isCommError', { type: Boolean, default: false }) syncedIsCommError!: boolean;

  myChart1 = {} as echarts.EChartsType;
  myChart2 = {} as echarts.EChartsType;
  myChart3 = {} as echarts.EChartsType;
  dom4 = {} as HTMLDivElement;
  myChart4 = {} as echarts.EChartsType;

  isModalDomInit = false;

  @Watch('totalApiTraffic')
  onCountChange() {
    this.myChart1.clear();
    this.myChart2.clear();
    this.myChart3.clear();

    this.myChart1.setOption(getTotalApiTrafficOption(this.totalApiTraffic.totCnt));
    this.myChart2.setOption(getSuccessApiTrafficOption(this.totalApiTraffic.sucesCnt, this.totalApiTraffic.failCnt));
    this.myChart3.setOption(getFailApiTrafficOption(this.totalApiTraffic.sucesCnt, this.totalApiTraffic.failCnt));
  }

  setChartData() {
    this.myChart1 = drawTotalApiTrafficChart(
      'totalApiTrafficTotal',
      getTotalApiTrafficOption(this.totalApiTraffic.totCnt)
    );
    this.myChart2 = drawTotalApiTrafficChart(
      'totalApiTrafficSuccess',
      getSuccessApiTrafficOption(this.totalApiTraffic.sucesCnt, this.totalApiTraffic.failCnt)
    );
    this.myChart3 = drawTotalApiTrafficChart(
      'totalApiTrafficFail',
      getFailApiTrafficOption(this.totalApiTraffic.sucesCnt, this.totalApiTraffic.failCnt)
    );
  }

  @Watch('totalApiTrafficDetail')
  onCountDtailChange() {
    setTimeout(() => {
      this.myChart4.setOption(getDetailApiTrafficOption(this.totalApiTrafficDetail));
    }, 400);

    // this.myChart4.setOption(getDetailApiTrafficOption(this.totalApiTrafficDetail));
  }

  setDetailChart() {
    this.isModalDomInit = true;
    this.dom4 = document.getElementById('totalApiTrafficDetail') as HTMLDivElement;
    this.myChart4 = echarts.init(this.dom4);
    this.myChart4.setOption(getDetailApiTrafficOption(this.totalApiTrafficDetail));
  }

  mounted() {
    this.setChartData();
    window.addEventListener('resize', this.observeSize);
  }

  updated() {
    if (!this.isModalDomInit && this.syncedIsDraged === 1) {
      this.setDetailChart();
    }
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.observeSize);
  }

  resizeChart() {
    this.myChart1.resize();
    this.myChart2.resize();
    this.myChart3.resize();
    if (this.isModalDomInit == true) {
      this.myChart4.resize();
    }
  }

  width = 0;
  height = 0;
  observeSize() {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        this.width = width;
        this.height = height;
      });
    });
    ro.observe(this.$refs.totalApiTraffic as HTMLDivElement);
  }

  @Watch('width')
  onWidthChange() {
    this.resizeChart();
  }

  showModal() {
    if (this.isLoadData) {
      return;
    }
    if (this.syncedIsDraged === 2) {
      this.syncedIsDraged = 1;
      return;
    }
    this.syncedModal = true;
  }
  closeModal() {
    this.syncedModal = false;
  }

  toggleModal() {
    this.syncedModal ? this.closeModal() : this.showModal();
    this.observeSize();
  }

  @Watch('syncedModal')
  onModalChange() {
    console.log(this.isModalDomInit);
    if (this.isModalDomInit) {
      this.myChart4.clear();
    }

    // if (!this.syncedModal) {
    //   console.log('TotalCleared!!');
    //   this.myChart4.clear();
    // }
  }
}
</script>
<style scoped>
.total-collapse-modal {
  width: 31.2%;
  position: absolute;
  z-index: 1;
  transition: all 0.3s;
}

.total-expand-modal {
  width: 100%;
  height: 200%;
  position: absolute;
  z-index: 5;
  transition: all 0.3s;
}

.total-expand-modal:hover,
.total-collapse-modal:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.3);
}
</style>

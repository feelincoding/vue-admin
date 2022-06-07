<template>
  <div class="chart-wrap">
    <div class="dash-modal-background" v-if="modal === true" @click="modal = false"></div>

    <h3 class="h3-tit">API 평균 응답시간 및 TPS (종전 1분)</h3>
    <div
      class="chart-group tps-group"
      :class="{
        'avg-collapse-modal': modal == false,
        'avg-expand-modal': modal == true,
      }"
      ref="tpsGroup"
    >
      <ErrorWrapper v-show="isCommError" />
      <div
        class="tps-chart-modal"
        @click="toggleModal(0)"
        v-show="modal === true && modalType === 1"
        style="width: 100%; height: 100%"
      >
        <h5 class="h5-tit" style="color: #fff6e5">평균 응답시간 Detail</h5>
        <div
          :class="{
            'dash-modal-detail-collapse': modal == false,
            'dash-modal-detail-expand': modal == true,
          }"
          id="avgDetail"
          style="width: 100%; height: 90%"
          onclick="event.stopPropagation()"
        />
      </div>
      <div
        class="tps-chart"
        :class="{
          'dash-modal-detail-collapse': modal == true,
          'dash-modal-detail-expand': modal == false,
        }"
        @click="toggleModal(1)"
        v-show="modal === false"
      >
        <i><img src="@/assets/req_ico.svg" alt="평균 응답시간" /></i>
        <p class="text">평균 응답시간</p>
        <p class="text fz38">
          <strong>{{ apiResponseStatus.avgResTm }}</strong
          >ms
        </p>
      </div>

      <div
        class="tps-chart-modal"
        @click="toggleModal(0)"
        v-show="modal === true && modalType === 2"
        style="width: 100%; height: 100%"
        :class="{
          'dash-modal-detail-collapse': modal == false,
          'dash-modal-detail-expand': modal == true,
        }"
      >
        <h5 class="h5-tit" style="color: #fff6e5">TPS Detail</h5>
        <div id="tpsDetail" style="width: 100%; height: 100%" onclick="event.stopPropagation()" />
      </div>
      <div
        class="tps-chart"
        :class="{
          'dash-modal-detail-collapse': modal == true,
          'dash-modal-detail-expand': modal == false,
        }"
        @click="toggleModal(2)"
        v-show="modal === false"
      >
        <i><img src="@/assets/tps_ico.svg" alt="TPS" /></i>
        <p class="text">TPS</p>
        <p class="text fz38">
          <strong>{{ apiResponseStatus.tps }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop, PropSync } from 'vue-property-decorator';
import * as echarts from 'echarts';
import { getTpsDetailOption, getAvgDetailOption } from '@/components/dash-board/chartDummy';
import { ApiResponseStatus } from '@/types/DashBoardType';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';

@Component({
  components: { ErrorWrapper },
})
export default class ApiResponseAvg extends Vue {
  @PropSync('modal', { type: Boolean, default: false }) syncedModal!: boolean;
  @PropSync('isDraged', { type: Number }) syncedIsDraged!: number;
  @Prop() apiResponseStatus!: ApiResponseStatus;
  @Prop() apiResponseStatusDetail!: ApiResponseStatus[];
  @PropSync('isCommError', { type: Boolean, default: false }) syncedIsCommError!: boolean;
  @Prop({ type: Boolean, default: false }) isLoadData!: boolean;

  @Watch('apiResponseStatusDetail')
  onApiResponseStatusDetailChange(val: ApiResponseStatus[]) {
    if (this.modalType == 1) {
      this.detailAvgChart.setOption(getAvgDetailOption(this.apiResponseStatusDetail));
    } else if (this.modalType == 2) {
      this.detailTpsChart.setOption(getTpsDetailOption(this.apiResponseStatusDetail));
    }
  }

  detailAvgDom = {} as HTMLDivElement;
  detailAvgChart = {} as echarts.EChartsType;
  detailTpsDom = {} as HTMLDivElement;
  detailTpsChart = {} as echarts.EChartsType;
  // 0 = 모달 안보일 때
  // 1 = avg모달일 때
  // 2 = tps모달일 때
  modalType = 0;

  isModalDomInitAvg = false;
  isModalDomInitTps = false;
  setDetailChart() {
    if (this.modalType == 1 && this.isModalDomInitAvg === false && this.syncedIsDraged === 1) {
      this.initChartAndDomModalAvg();
    }
    if (this.modalType == 2 && this.isModalDomInitTps === false && this.syncedIsDraged === 1) {
      this.initChartAndDomModalTps();
    }
  }

  initChartAndDomModalAvg() {
    this.isModalDomInitAvg = true;
    this.detailAvgDom = document.getElementById('avgDetail') as HTMLDivElement;
    this.detailAvgChart = echarts.init(this.detailAvgDom);
    this.detailAvgChart.setOption(getAvgDetailOption(this.apiResponseStatusDetail));
  }
  initChartAndDomModalTps() {
    this.isModalDomInitTps = true;
    this.detailTpsDom = document.getElementById('tpsDetail') as HTMLDivElement;
    this.detailTpsChart = echarts.init(this.detailTpsDom);
    this.detailTpsChart.setOption(getTpsDetailOption(this.apiResponseStatusDetail));
  }

  mounted() {
    window.addEventListener('resize', this.observeSize);
  }

  updated() {
    this.setDetailChart();
  }
  beforeDestroy() {
    window.removeEventListener('resize', this.observeSize);
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
    ro.observe(this.$refs.tpsGroup as HTMLDivElement);
  }
  resizeChart() {
    this.isModalDomInitAvg && this.detailAvgChart.resize();
    this.isModalDomInitTps && this.detailTpsChart.resize();
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
    this.clearModal();
    this.syncedModal = false;
  }

  toggleModal(type: number) {
    this.syncedModal ? this.closeModal() : this.showModal();
    this.modalType = type;
    this.observeSize();
  }

  @Watch('syncedModal')
  onModalChange() {
    this.clearModal();
    // if (this.modalType !== 0 && !this.syncedModal) {
    //   this.clearModal();
    //   this.modalType = 0;
    // }
  }

  clearModal() {
    if (this.modalType == 1) {
      if (this.isModalDomInitAvg) {
        this.detailAvgChart.clear();
      }
    } else if (this.modalType == 2) {
      if (this.isModalDomInitTps) {
        this.detailTpsChart.clear();
      }
    }
  }
}
</script>
<style scoped>
.avg-collapse-modal {
  width: 31.2%;
  position: absolute;
  right: 0px;
  z-index: 1;
  transition: all 0.3s;
}

.avg-expand-modal {
  width: 100%;
  height: 200%;
  position: absolute;
  right: 0px;
  z-index: 5;
  transition: all 0.3s;
}

.avg-expand-modal:hover,
.avg-collapse-modal:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.3);
}

.tps-group .tps-chart-modal {
  padding: 20px 30px;
  align-items: center;
}
</style>

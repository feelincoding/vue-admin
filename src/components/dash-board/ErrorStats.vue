<template>
  <div class="chart-wrap">
    <h3 class="h3-tit">Error stats (24Hour)</h3>
    <div class="dash-modal-background" v-if="modal === true" @click="modal = false"></div>
    <div
      class="chart-group error-stats"
      :class="{
        'error-collapse-modal': modal == false,
        'error-expand-modal': modal == true,
      }"
      @click="toggleModal()"
      ref="totalErrorStats"
    >
      <ErrorWrapper v-show="isCommError" />
      <div
        v-show="modal == false"
        id="errorStatsPie"
        :class="{
          'dash-modal-detail-collapse': modal == true,
          'dash-modal-detail-expand': modal == false,
        }"
        class="error-pie"
      >
        실패율
      </div>
      <div
        v-show="modal == false"
        id="errorStateBar"
        :class="{
          'dash-modal-detail-collapse': modal == true,
          'dash-modal-detail-expand': modal == false,
        }"
        class="error-chart"
      >
        Critical/Major/Minor
      </div>

      <div
        v-show="modal == true"
        :class="{
          'dash-modal-detail-collapse': modal == false,
          'dash-modal-detail-expand': modal == true,
        }"
        onclick="event.stopPropagation()"
        style="width: 100%; height: 100%"
      >
        <h5 class="h5-tit">Error State Detail</h5>
        <button @click="toggleModal()" style="position: absolute; right: 1%; top: 3%">
          <i><img src="@/assets/close.svg" alt="닫기" title="닫기" /></i>
        </button>
        <div id="errorStateDetail" style="width: 100%; height: 100%"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop, PropSync } from 'vue-property-decorator';
import * as echarts from 'echarts';
import ErrorWrapper from '@/components/dash-board/ErrorWrapper.vue';
import { ErrorStatsType } from '@/types/DashBoardType';
import { getFailRateOption, getErrorDetailChartOption } from '@/components/dash-board/chartDummy';

@Component({
  components: { ErrorWrapper },
})
export default class ErrorStats extends Vue {
  // @Prop({ default: false }) errorModal!: boolean;
  @Prop({ type: Boolean, default: false }) isLoadData!: boolean;
  @PropSync('modal', { type: Boolean, default: false }) syncedModal!: boolean;
  @PropSync('isDraged', { type: Number }) syncedIsDraged!: number;
  @PropSync('isCommError', { type: Boolean, default: false }) syncedIsCommError!: boolean;
  @Prop() errorStats!: ErrorStatsType;
  @Prop() errorStatsDetail!: ErrorStatsType[];
  // modal = false;
  // @Watch('modal')
  // onModalChange(val: boolean) {
  //   if (val === true) {
  //     this.$emit('update:errorModal', val);
  //   } else {
  //     setTimeout(() => {
  //       this.$emit('update:errorModal', val);
  //     }, 300);
  //   }
  // }
  dom1 = {} as HTMLDivElement;
  myChart1 = {} as echarts.EChartsType;
  dom2 = {} as HTMLDivElement;
  myChart2 = {} as echarts.EChartsType;
  dom3 = {} as HTMLDivElement;
  myChart3 = {} as echarts.EChartsType;

  isModalDomInit = false;

  initChartAndDomModal() {
    this.isModalDomInit = true;
    this.dom3 = document.getElementById('errorStateDetail') as HTMLDivElement;
    this.myChart3 = echarts.init(this.dom3);
    this.myChart3.setOption(getErrorDetailChartOption(this.errorStatsDetail));
  }

  initChartAndDom() {
    this.dom1 = document.getElementById('errorStatsPie') as HTMLDivElement;
    this.myChart1 = echarts.init(this.dom1);
    this.myChart1.setOption(getFailRateOption(this.errorStats.failRate));
    this.dom2 = document.getElementById('errorStateBar') as HTMLDivElement;
    this.myChart2 = echarts.init(this.dom2);
    this.myChart2.setOption(
      this.getFailProgressChartOption(this.errorStats.miCnt, this.errorStats.maCnt, this.errorStats.crCnt)
    );
  }

  mounted() {
    this.initChartAndDom();
    window.addEventListener('resize', this.observeSize);
  }

  updated() {
    if (!this.isModalDomInit && this.syncedIsDraged === 1) {
      this.initChartAndDomModal();
    }
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.observeSize);
  }

  resizeChart() {
    this.myChart1.resize();
    this.myChart2.resize();
    if (this.isModalDomInit == true) {
      this.myChart3.resize();
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
    ro.observe(this.$refs.totalErrorStats as HTMLDivElement);
  }

  @Watch('width')
  onWidthChang() {
    this.resizeChart();
  }

  @Watch('errorStats')
  onErrorStatsUpdate() {
    this.myChart1.clear();
    this.myChart2.clear();

    this.myChart1.setOption(getFailRateOption(this.errorStats.failRate));
    this.myChart2.setOption(
      this.getFailProgressChartOption(this.errorStats.miCnt, this.errorStats.maCnt, this.errorStats.crCnt)
    );
  }

  @Watch('errorStatsDetail')
  onErrorStatsDetailUpdate() {
    this.myChart3.setOption(getErrorDetailChartOption(this.errorStatsDetail));
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
    if (this.isModalDomInit) {
      this.myChart3.clear();
    }

    // if (!this.syncedModal) {
    //   console.log('ErrorClearded!!');
    //   this.myChart3.clear();
    // }
  }

  getFailProgressChartOption(miCnt: number, maCnt: number, crCnt: number) {
    const errorStatsBarOption: echarts.EChartsOption = {
      // tooltip: {
      //   trigger: 'item',
      // },
      backgroundColor: '#FFFFFF',
      xAxis: {
        type: 'value',
        max: miCnt + maCnt + crCnt,
        axisLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      yAxis: [
        {
          data: ['Minor', 'Major', 'Critical'],
          type: 'category',
          axisLine: { show: false },
          axisLabel: { show: true, fontSize: '13', fontWeight: 550, color: '#000' },
          axisTick: { show: false },
          splitLine: { show: false },
        },
        {
          type: 'category',
          data: [`${miCnt.toLocaleString()}`, `${maCnt.toLocaleString()}`, `${crCnt.toLocaleString()}`],
          axisLine: { show: false },
          axisLabel: { show: true, fontSize: '13', fontWeight: 550, color: '#000' },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      grid: {
        top: 30,
        left: 50,
        bottom: 30,
        right: 50,
      },
      series: [
        {
          data: [
            {
              value: miCnt,
              itemStyle: {
                color: '#FFE03D',
              },
            },
            {
              value: maCnt,
              itemStyle: {
                color: '#FF994F',
              },
            },
            {
              value: crCnt,
              itemStyle: {
                color: '#FF4E63',
              },
            },
          ],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.5)',
            borderRadius: [100, 100, 100, 100],
          },
          // label: {
          //   show: true,
          //   position: 'right',
          //   valueAnimation: true,
          //   formatter: '{c}' + '건',
          // },
          barWidth: '40%',
          itemStyle: {
            borderRadius: [100, 100, 100, 100],
          },
        },
      ],
    };

    return errorStatsBarOption;
  }
}
</script>
<style scoped>
.error-stats {
  background-color: #fff;
}

.error-collapse-modal {
  width: 31.2%;
  position: absolute;
  z-index: 1;
  transition: all 0.3s;
}

.error-expand-modal {
  margin-left: -34.4%;
  width: 100%;
  height: 200%;
  position: absolute;
  z-index: 5;
  transition: all 0.3s;
}

.error-expand-modal:hover,
.error-collapse-modal:hover {
  box-shadow: 0 0 11px rgba(33, 33, 33, 0.3);
}
</style>

<template>
  <li @click="cardDetail">
    <div class="card-tit">
      <h2 class="h2-tit">{{ isSvcStatItem(item) ? item.svcId : item.sysId + '.' + item.apiId }}</h2>

      <div
        class="tip"
        v-if="(isSvcStatItem(item) && item.svcDesc !== null) || (!isSvcStatItem(item) && item.apiDesc !== null)"
      >
        <button class="tip-btn" v-on:mouseout="tipBox = false" v-on:mouseover="tipBox = true">
          <i><img src="@/assets/tip_ico.svg" alt="tip" /></i>
        </button>
        <span v-if="tipBox" class="tip-area">{{ isSvcStatItem(item) ? item.svcDesc : item.apiDesc }}</span>
      </div>
    </div>

    <div class="script-wrap">
      <div class="script-cont">
        <i><img src="@/assets/req_sm.svg" :alt="$t('control.avg_res_time')" /></i>
        <p class="text">
          {{ $t('control.avg_res_time') }} : <span>{{ item.avgResTm }}</span
          >ms
        </p>
      </div>
      <div class="script-cont">
        <i><img src="@/assets/tps_sm.svg" :alt="$t('control.tps')" /></i>
        <p class="text">
          {{ $t('control.tps') }} : <span>{{ item.tps }}</span>
        </p>
      </div>
    </div>

    <div class="card-chart col-2" style="width: 100%">
      <div
        :id="'statsPie_' + (isSvcStatItem(item) ? item.svcId : item.sysId + '.' + item.apiId)"
        class="chart-div"
        autoresize
      ></div>
      <dl>
        <dt>
          {{ $t('control.success_rate') }} : <span class="syan">{{ item.sucesRate }}%</span>
        </dt>
        <dd>
          {{ $t('common.total') }} : <span class="purple">{{ item.totCnt }}</span>
        </dd>
        <dd>
          {{ $t('common.success_eng') }} : <span class="syan">{{ item.sucesCnt }}</span>
        </dd>
        <dd>
          {{ $t('common.fail_eng') }} : <span class="red">{{ item.failCnt }}</span>
        </dd>
      </dl>
    </div>

    <div class="card-chart">
      <h4 class="h4-tit">{{ $t('control.failure_classification') }}</h4>
      <div
        :id="'errorStateBar_' + (isSvcStatItem(item) ? item.svcId : item.sysId + '.' + item.apiId)"
        class="chart-div"
        autoresize
      ></div>
    </div>
  </li>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from 'echarts';

import type { EChartsType } from 'echarts';
import type { ApiStat, ServiceStat, RealTimeStat } from '@/types/MonitoringControlType';

// import ApiDetailModal from '@/components/monitoring/control/ApiDetailModal.vue';
// import ModalLayout from '@/components/commons/modal/ModalLayout.vue';

const props = defineProps<{
  item: ServiceStat | ApiStat;
  isSort: boolean;
}>();

const emit = defineEmits<{
  (e: 'val', value: ServiceStat | ApiStat): void;
}>();

const tipBox = ref(false);
const showApiDetailModal = ref(false);

//   const statsPieOption: Ref<echarts.EChartsOption> = ref({} as echarts.EChartsOption);
//   const errorStatsBarOption: Ref<echarts.EChartsOption> = ref({} as echarts.EChartsOption);

const myChart = ref({} as EChartsType);
const myChart2 = ref({} as EChartsType);

watch(
  () => props.isSort,
  () => {
    setTimeout(() => {
      domDispose();
      domInit();
    }, 0);
  }
);

onMounted(() => {
  setTimeout(() => {
    domInit();
  }, 0);
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    chartResize();
  });
});

const isSvcStatItem = (target: ServiceStat | ApiStat): target is ServiceStat => {
  return (target as ServiceStat).svcId !== undefined;
};

const domInit = () => {
  setPieChart();
  setBarChart();

  window.addEventListener(
    'resize',
    () => {
      chartResize();
    },
    { passive: true }
  );
};

const domDispose = () => {
  if (myChart != null && myChart != undefined) {
    myChart.value.dispose();
  }

  if (myChart2 != null && myChart2 != undefined) {
    myChart2.value.dispose();
  }
};

const chartResize = () => {
  myChart.value.resize();
  myChart2.value.resize();
};

const setPieChart = () => {
  const pieDom = document.getElementById(
    'statsPie_' + (isSvcStatItem(props.item) ? props.item.svcId : props.item.sysId + '.' + props.item.apiId)
  ) as HTMLDivElement;

  console.log('pieDom : ', pieDom);

  myChart.value = echarts.init(pieDom);
  console.log('myChart : ', myChart);

  myChart.value.setOption(getPieOption());
};

const setBarChart = () => {
  const barDom = document.getElementById(
    'errorStateBar_' + (isSvcStatItem(props.item) ? props.item.svcId : props.item.sysId + '.' + props.item.apiId)
  ) as HTMLDivElement;

  myChart2.value = echarts.init(barDom);
  myChart2.value.setOption(getBarOption());
};

const getPieOption = () => {
  const option = {
    backgroundColor: '#FFFFFF',
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['50%', '90%'],
        avoidLabelOverlap: false,
        labelLine: {
          show: false,
        },
        data: [{ value: props.item.failRate }, { value: props.item.sucesRate }],
        emphasis: {
          disabled: true,
        },
      },
    ],
    color: ['#FF4E63', '#6998FF'],
  };

  return option;
};

const getBarOption = () => {
  const option = {
    backgroundColor: '#FFFFFF',
    xAxis: {
      type: 'value',
      max: props.item.failCnt,
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
        axisLabel: { show: true, fontSize: '13', fontWeight: 600, color: '#000' },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      {
        type: 'category',
        data: [props.item.miCnt + '건', props.item.maCnt + '건', props.item.crCnt + '건'],
        axisLine: { show: false },
        axisLabel: { show: true, fontSize: '13', fontWeight: 600, color: '#000' },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    grid: {
      top: 10,
      left: '21%',
      bottom: 10,
      right: '20%',
    },
    series: [
      {
        data: [
          {
            value: props.item.miCnt,
            itemStyle: {
              color: '#FFE03D',
            },
          },
          {
            value: props.item.maCnt,
            itemStyle: {
              color: '#FF994F',
            },
          },
          {
            value: props.item.crCnt,
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
        barWidth: '40%',
        itemStyle: {
          borderRadius: [100, 100, 100, 100],
        },
      },
    ],
  };

  return option;
};

const cardDetail = () => {
  emit('val', props.item);
};
</script>

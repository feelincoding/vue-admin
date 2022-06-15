<template>
  <li @click="cardDetail">
    <div class="card-tit">
      <h3 class="h3-tit">{{ isSvcStatItem(item) ? item.svcId : item.sysId + '.' + item.apiId }}</h3>

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
        <p class="text">
          {{ $t('control.avg_res_time') }} : <span>{{ numberWithCommas(item.avgResTm) }}</span
          >ms
        </p>
      </div>
      <div class="script-cont">
        <p class="text">
          {{ $t('control.tps') }} : <span>{{ numberWithCommas(item.tps) }}</span>
        </p>
      </div>
    </div>

    <div class="card-chart">
      <!--  style="width: 100%" -->
      <div
        :id="'statsPie_' + (isSvcStatItem(item) ? item.svcId : item.sysId + '.' + item.apiId)"
        class="chart-div flex"
      ></div>
      <dl>
        <dt class="syan">
          {{ $t('control.success_rate') }} : <em>{{ item.sucesRate }}%</em>
        </dt>
        <dd>
          {{ $t('common.total') }} : <em>{{ numberWithCommas(item.totCnt) }}</em>
        </dd>
        <dd>
          {{ $t('common.success_eng') }} : <em class="syan">{{ numberWithCommas(item.sucesCnt) }}</em>
        </dd>
        <dd>
          {{ $t('common.fail_eng') }} : <em class="red">{{ numberWithCommas(item.failCnt) }}</em>
        </dd>
      </dl>
    </div>

    <!-- <div class="card-chart">
      <h4 class="h4-tit">{{ $t('control.failure_classification') }}</h4>
      <div
        :id="'errorStateBar_' + (isSvcStatItem(item) ? item.svcId : item.sysId + '.' + item.apiId)"
        class="chart-div"
      ></div>
    </div> -->
    <div class="fail-group card-fail">
      <div class="fail-list">
        <span class="label critical">Cr</span>
        <span class="txt">{{ numberWithCommas(props.item.crCnt) }}</span>
      </div>
      <div class="fail-list">
        <span class="label major">Ma</span>
        <span class="txt">{{ numberWithCommas(props.item.maCnt) }}</span>
      </div>
      <div class="fail-list">
        <span class="label minor">Mi</span>
        <span class="txt">{{ numberWithCommas(props.item.miCnt) }}</span>
      </div>
    </div>
  </li>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import * as echarts from 'echarts';

import type { EChartsType } from 'echarts';
import type { ApiStat, ServiceStat } from '@/types/MonitoringControlType';

import { numberWithCommas } from '@/utils/validation';

const props = defineProps<{
  item: ServiceStat | ApiStat;
  isSort: boolean;
}>();

const emit = defineEmits<{
  (e: 'val', value: ServiceStat | ApiStat): void;
}>();

const tipBox = ref(false);

const myChart = shallowRef({} as EChartsType);
const myChart2 = shallowRef({} as EChartsType);

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
  window.removeEventListener('resize', () => chartResize());
});

const domInit = () => {
  setPieChart();
  // setBarChart();

  window.addEventListener('resize', () => chartResize(), { passive: true });
};

const chartResize = () => {
  myChart.value.resize();
  // myChart2.value.resize();
};

const domDispose = () => {
  if (myChart != null && myChart != undefined) {
    myChart.value.dispose();
  }

  // if (myChart2 != null && myChart2 != undefined) {
  //   myChart2.value.dispose();
  // }
};

const setPieChart = () => {
  const pieDom = document.getElementById(
    'statsPie_' + (isSvcStatItem(props.item) ? props.item.svcId : props.item.sysId + '.' + props.item.apiId)
  ) as HTMLDivElement;

  myChart.value = echarts.init(pieDom);
  myChart.value.setOption(getPieOption());
};

// const setBarChart = () => {
//   const barDom = document.getElementById(
//     'errorStateBar_' + (isSvcStatItem(props.item) ? props.item.svcId : props.item.sysId + '.' + props.item.apiId)
//   ) as HTMLDivElement;

//   myChart2.value = echarts.init(barDom);
//   myChart2.value.setOption(getBarOption());
// };

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

// const getBarOption = () => {
//   const option = {
//     backgroundColor: '#FFFFFF',
//     xAxis: {
//       type: 'value',
//       max: props.item.failCnt,
//       axisLine: { show: false },
//       axisLabel: { show: false },
//       axisTick: { show: false },
//       splitLine: { show: false },
//     },
//     yAxis: [
//       {
//         data: ['Minor', 'Major', 'Critical'],
//         type: 'category',
//         axisLine: { show: false },
//         axisLabel: { show: true, fontSize: '13', fontWeight: 600, color: '#000' },
//         axisTick: { show: false },
//         splitLine: { show: false },
//       },
//       {
//         type: 'category',
//         data: [props.item.miCnt + '건', props.item.maCnt + '건', props.item.crCnt + '건'],
//         axisLine: { show: false },
//         axisLabel: { show: true, fontSize: '13', fontWeight: 600, color: '#000' },
//         axisTick: { show: false },
//         splitLine: { show: false },
//       },
//     ],
//     grid: {
//       top: 10,
//       left: '21%',
//       bottom: 10,
//       right: '23%',
//     },
//     series: [
//       {
//         type: 'bar',
//         data: [
//           {
//             value: props.item.miCnt,
//             itemStyle: {
//               color: '#FFE03D',
//             },
//           },
//           {
//             value: props.item.maCnt,
//             itemStyle: {
//               color: '#FF994F',
//             },
//           },
//           {
//             value: props.item.crCnt,
//             itemStyle: {
//               color: '#FF4E63',
//             },
//           },
//         ],
//         showBackground: true,
//         backgroundStyle: {
//           color: 'rgba(180, 180, 180, 0.5)',
//           borderRadius: [100, 100, 100, 100],
//         },
//         barWidth: '40%',
//         itemStyle: {
//           borderRadius: [100, 100, 100, 100],
//         },
//       },
//     ],
//   };

//   return option;
// };

// item 타입 체크(serviceStat이면 true, apiStat이면 false)
const isSvcStatItem = (target: ServiceStat | ApiStat): target is ServiceStat => {
  return (target as ServiceStat).svcId !== undefined;
};

const cardDetail = () => {
  emit('val', props.item);
};
</script>

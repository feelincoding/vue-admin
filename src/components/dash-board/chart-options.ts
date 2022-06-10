import * as echarts from 'echarts';
import type { TotalTrafficStat, ApiResponseStatus, ErrorStatsType } from '@/types/DashBoardType';

export function getAvgDetailOption(detail: ApiResponseStatus[]) {
  detail.forEach((item) => {
    // console.log(item.statBaseTm.substr(11, 10));
    console.log();
  });

  const avgDetailOption: echarts.EChartsOption = {
    color: '#FFBF00',
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    dataZoom: [
      {
        type: 'inside',
        throttle: 50,
      },
    ],
    grid: {
      top: '5%',
      left: '2%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: detail.map((item) => item.statBaseTm.substr(11, 5)),
        axisLine: { show: true, lineStyle: { color: '#FFF6E5' } },
        axisLabel: { show: true, fontSize: '13', fontWeight: 550, color: '#FFF6E5' },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: { show: true, fontSize: '13', fontWeight: 550, color: '#FFF6E5' },
      },
    ],
    series: [
      {
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        label: {
          show: true,
          position: 'top',
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#FFFFFF',
            },
            {
              offset: 1,
              color: '#DDDDDD',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ms';
          },
        },
        data: detail.map((item) => {
          return item.avgResTm as number;
        }),
        zlevel: 5,
        z: 5,
      },
    ],
  };
  return avgDetailOption;
}

export function getTpsDetailOption(detail: ApiResponseStatus[]) {
  const tpsDetailOption: echarts.EChartsOption = {
    color: '#FFBF00',
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    grid: {
      top: '5%',
      left: '2%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    dataZoom: [
      {
        type: 'inside',
        throttle: 50,
      },
    ],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: detail.map((item) => item.statBaseTm.substr(11, 5)),
        axisLine: { show: true, lineStyle: { color: '#FFF6E5' } },
        axisLabel: { show: true, fontSize: '13', fontWeight: 550, color: '#FFF6E5' },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: { show: true, fontSize: '13', fontWeight: 550, color: '#FFF6E5' },
      },
    ],
    series: [
      {
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        label: {
          show: true,
          position: 'top',
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#FFFFFF',
            },
            {
              offset: 1,
              color: '#DDDDDD',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 건';
          },
        },
        data: detail.map((item) => {
          return item.tps as number;
        }),
        zlevel: 5,
        z: 5,
      },
    ],
  };
  return tpsDetailOption;
}

export const tpsDetailOption: echarts.EChartsOption = {
  color: '#FFBF00',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  // 차트 이미지 저장
  // toolbox: {
  //   feature: {
  //     saveAsImage: {},
  //   },
  // },
  grid: {
    top: '5%',
    left: '2%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { show: true, lineStyle: { color: '#FFF6E5' } },
      axisLabel: { show: true, fontSize: '13', fontWeight: 550, color: '#FFF6E5' },
    },
  ],
  yAxis: [
    {
      type: 'value',
      // splitLine: { show: true, lineStyle: { color: '#000' } },
      axisLabel: { show: true, fontSize: '13', fontWeight: 550, color: '#FFF6E5' },
    },
  ],
  series: [
    {
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      label: {
        show: true,
        position: 'top',
      },
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#FFFBD9',
          },
          {
            offset: 1,
            color: '#FFED48',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 302, 181, 234, 210, 290, 150],
      zlevel: 5,
      z: 5,
    },
  ],
};

export const progressOption = {
  graphic: {
    elements: [
      {
        type: 'group',
        left: 'center',
        top: 'center',
        children: new Array(7).fill(0).map((val, i) => ({
          type: 'rect',
          x: i * 20,
          shape: {
            x: 0,
            y: -40,
            width: 10,
            height: 80,
          },
          style: {
            fill: '#5470c6',
          },
          keyframeAnimation: {
            duration: 1000,
            delay: i * 200,
            loop: true,
            keyframes: [
              {
                percent: 0.5,
                scaleY: 0.3,
                easing: 'cubicIn',
              },
              {
                percent: 1,
                scaleY: 1,
                easing: 'cubicOut',
              },
            ],
          },
        })),
      },
    ],
  },
};

export function getTotalApiTrafficOption(total: number) {
  const totalApiTrafficOption: echarts.EChartsOption = {
    title: {
      text: '전체',
      left: 'center',
      top: 'bottom',
      textStyle: {
        color: '#FFF6E5',
        fontSize: '17',
      },
    },

    // tooltip: {
    //   trigger: 'item',
    // },
    backgroundColor: '#FFA800',
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['57%', '80%'],
        avoidLabelOverlap: false,

        label: {
          show: true,
          position: 'center',
          formatter: [`{data|${total !== undefined ? total.toLocaleString() : 0}}`, ''].join(''),
          rich: {
            data: {
              fontSize: '14',
              color: '#FFF6E5',
              fontWeight: 'bold',
            },
            qt: {
              fontSize: '14',
              color: '#FFF6E5',
            },
          },
        },

        labelLine: {
          show: false,
        },
        data: [{ value: total, name: 'total' }],
        center: ['50%', '35%'],
        emphasis: {
          disabled: true,
        },
      },
    ],
    color: '#FFF6E5',
  };

  return totalApiTrafficOption;
}

export function getSuccessApiTrafficOption(sucesCnt: number, failCnt: number) {
  const successApiTrafficOption: echarts.EChartsOption = {
    title: {
      text: '성공',
      left: 'center',
      top: 'bottom',
      textStyle: {
        color: '#FFF6E5',
        fontSize: '17',
      },
    },
    // tooltip: {
    //   trigger: 'item',
    // },
    backgroundColor: '#FFA800',
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['57%', '80%'],
        avoidLabelOverlap: false,

        label: {
          show: true,
          position: 'center',
          formatter: [`{data|${sucesCnt !== undefined ? sucesCnt.toLocaleString() : 0}}`, ''].join(''),
          rich: {
            data: {
              fontSize: '14',
              color: '#FFF6E5',
              fontWeight: 'bold',
            },
            qt: {
              fontSize: '14',
              color: '#FFF6E5',
            },
          },
        },
        data: [
          { value: sucesCnt, name: '성공' },
          { value: failCnt, name: '실패' },
        ],
        center: ['50%', '35%'],
        emphasis: {
          disabled: true,
        },
      },
    ],
    color: ['#FFF6E5', 'rgba(255, 255, 255, 0)'],
  };

  return successApiTrafficOption;
}

export function getFailApiTrafficOption(sucesCnt: number, failCnt: number) {
  const successApiTrafficOption: echarts.EChartsOption = {
    title: {
      text: '실패',
      left: 'center',
      top: 'bottom',
      textStyle: {
        color: '#FFF6E5',
        fontSize: '17',
      },
    },
    // tooltip: {
    //   trigger: 'item',
    // },
    backgroundColor: '#FFA800',
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['57%', '80%'],
        avoidLabelOverlap: false,

        label: {
          show: true,
          position: 'center',
          formatter: [`{data|${failCnt !== undefined ? failCnt.toLocaleString() : 0}}`, ''].join(''),
          rich: {
            data: {
              fontSize: '14',
              color: '#FFF6E5',
              fontWeight: 'bold',
            },
            qt: {
              fontSize: '14',
              color: '#FFF6E5',
            },
          },
        },
        data: [
          { value: failCnt, name: '실패' },
          { value: sucesCnt, name: '성공' },
        ],
        center: ['50%', '35%'],
        emphasis: {
          disabled: true,
        },
      },
    ],
    color: ['#FFF6E5', 'rgba(255, 255, 255, 0)'],
  };

  return successApiTrafficOption;
}

export function getDetailApiTrafficOption(detail: TotalTrafficStat[]) {
  const totalApiTrafficDetailOption: echarts.EChartsOption = {
    color: '#FFBF00',
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',

      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['전체', '성공', '실패'],
      textStyle: {
        color: '#FFF6E5',
        fontSize: '14',
      },
    },
    dataZoom: [
      {
        type: 'inside',
        throttle: 50,
      },
    ],
    grid: {
      top: '10%',
      left: '2%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: detail.map((item) => item.statBaseTm.substr(11, 5)),
        axisLine: { show: true, lineStyle: { color: '#FFF6E5' } },
        axisLabel: { show: true, fontSize: '13', fontWeight: 550, color: '#FFF6E5' },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: { show: true, fontSize: '13', fontWeight: 550, color: '#FFF6E5' },
      },
    ],

    series: [
      {
        name: '전체',
        type: 'line',
        color: '#8041F7',
        stack: '전체',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        label: {
          show: true,
          position: 'top',
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#8041F7',
            },
            {
              offset: 1,
              color: '#d4bdff',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 건';
          },
        },
        data: detail.map((item) => {
          return item.totCnt as number;
        }),
        zlevel: 5,
        z: 5,
      },
      {
        name: '성공',
        type: 'line',
        color: '#6998FF',
        stack: 'Success',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        label: {
          show: true,
          position: 'top',
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#6998FF',
            },
            {
              offset: 1,
              color: '#b7ccf9',
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 건';
          },
        },
        data: detail.map((item) => {
          return item.sucesCnt as number;
        }),
        zlevel: 5,
        z: 5,
      },
      {
        name: '실패',
        type: 'line',
        color: '#FF4E63',
        stack: 'Fail',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        label: {
          show: true,
          position: 'top',
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#FF4E63',
            },
            {
              offset: 1,
              color: '#ffaab4',
            },
          ]),
        },

        emphasis: {
          focus: 'series',
        },
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 건';
          },
        },
        data: detail.map((item) => {
          return item.failCnt as number;
        }),
        zlevel: 5,
        z: 5,
      },
    ],
  };
  return totalApiTrafficDetailOption;
}

export const realTimeTrafficModalOption = {
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  title: {
    text: 'Gradient Stacked Area Chart',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  legend: {
    data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5'],
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      name: 'Line 1',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(128, 255, 165)',
          },
          {
            offset: 1,
            color: 'rgb(1, 191, 236)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [140, 232, 101, 264, 90, 340, 250],
    },
    {
      name: 'Line 2',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(0, 221, 255)',
          },
          {
            offset: 1,
            color: 'rgb(77, 119, 255)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [120, 282, 111, 234, 220, 340, 310],
    },
    {
      name: 'Line 3',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(55, 162, 255)',
          },
          {
            offset: 1,
            color: 'rgb(116, 21, 219)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [320, 132, 201, 334, 190, 130, 220],
    },
    {
      name: 'Line 4',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 0, 135)',
          },
          {
            offset: 1,
            color: 'rgb(135, 0, 157)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 402, 231, 134, 190, 230, 120],
    },
    {
      name: 'Line 5',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      label: {
        show: true,
        position: 'top',
      },
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 191, 0)',
          },
          {
            offset: 1,
            color: 'rgb(224, 62, 76)',
          },
        ]),
      },
      emphasis: {
        focus: 'series',
      },
      data: [220, 302, 181, 234, 210, 290, 150],
    },
  ],
};

export function getFailRateOption(failRate: number) {
  const errorStatsPieOption: echarts.EChartsOption = {
    title: {
      text: '실패율',
      left: 'center',
      top: '75%',
      textStyle: {
        color: 'black',
        fontSize: '13',
        fontWeight: 550,
      },
    },
    // tooltip: {
    //   trigger: 'item',
    // },
    backgroundColor: '#FFFFFF',
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,

        label: {
          show: true,
          position: 'center',
          formatter: `${failRate}` + '%',
          color: '#FF4E63',
          fontSize: '16',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: failRate, name: '실패율' },
          { value: 100, name: '성공률' },
        ],
        center: ['50%', '35%'],
        emphasis: {
          disabled: true,
        },
      },
    ],
    color: ['#FF4E63', '#F8B7B0'],
  };

  return errorStatsPieOption;
}

export function getErrorDetailChartOption(detail: ErrorStatsType[]) {
  const errorStatsDetailOption: echarts.EChartsOption = {
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    grid: {
      top: '10%',
      left: '3%',
      right: '3%',
      containLabel: true,
    },
    legend: {
      data: ['Critical', 'Major', 'Minor'],
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: detail.map((item) => item.statBaseTm.substr(11, 5)),
        axisLine: { show: true },
        axisLabel: { show: true, fontSize: '13', fontWeight: 550 },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        axisLabel: { formatter: '{value} 건' },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        throttle: 50,
      },
    ],
    series: [
      {
        name: 'Critical',
        type: 'bar',
        color: '#FF4E63',
        stack: 'Ad',
        emphasis: {
          focus: 'series',
        },
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 건';
          },
        },
        data: detail.map((item) => {
          return item.crCnt as number;
        }),
      },
      {
        name: 'Major',
        type: 'bar',
        color: '#FF994F',
        stack: 'Ad',
        emphasis: {
          focus: 'series',
        },
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 건';
          },
        },
        data: detail.map((item) => {
          return item.maCnt as number;
        }),
      },
      {
        name: 'Minor',
        type: 'bar',
        color: '#FFE03D',
        stack: 'Ad',
        emphasis: {
          focus: 'series',
        },
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 건';
          },
        },
        data: detail.map((item) => {
          return item.miCnt as number;
        }),
      },
    ],
  };

  return errorStatsDetailOption;
}

export const timerOption = {
  graphic: {
    elements: [
      {
        type: 'group',
        left: 'center',
        top: 'center',
        children: new Array(7).fill(0).map((val, i) => ({
          type: 'rect',
          x: i * 12,
          shape: {
            x: 0,
            y: -10,
            width: 4,
            height: 20,
          },
          style: {
            fill: '#8041F7',
          },
          keyframeAnimation: {
            duration: 800,
            delay: i * 200,
            loop: true,
            keyframes: [
              {
                percent: 0.5,
                scaleY: 0.3,
                easing: 'cubicIn',
              },
              {
                percent: 1,
                scaleY: 1,
                easing: 'cubicOut',
              },
            ],
          },
        })),
      },
    ],
  },
};

export function getTimerOption(chartCountPercentData: number, chartCountTotalData: number) {
  const timerOption: echarts.EChartsOption = {
    title: {
      show: false,
    },

    backgroundColor: '#FFFFFF',
    series: [
      {
        center: ['40%', '58%'],
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,

        label: {
          show: false,
        },

        labelLine: {
          show: false,
        },
        data: [{ value: chartCountPercentData }, { value: chartCountTotalData }],
        emphasis: {
          disabled: true,
        },
      },
    ],
    color: ['#000000', '#D5D5D5'],
  };

  return timerOption;
}

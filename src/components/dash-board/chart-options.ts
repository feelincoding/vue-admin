import * as echarts from 'echarts';
import type { TotalTrafficStat, ApiResponseStatus, ErrorStatsType, LastTrafficType } from '@/types/DashBoardType';

export function getDetailApiTrafficOption(detail: TotalTrafficStat[]) {
  const o: echarts.EChartsOption = {
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
  return o;
}

export function getProgressOption() {
  const o: echarts.EChartsOption = {
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
  return o;
}

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

export function getFailProgressChartOption(miCnt: number, maCnt: number, crCnt: number) {
  const errorStatsBarOption: echarts.EChartsOption = {
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
        data: [
          `${miCnt !== undefined ? miCnt.toLocaleString() : 0}`,
          `${maCnt !== undefined ? maCnt.toLocaleString() : 0}`,
          `${crCnt !== undefined ? crCnt.toLocaleString() : 0}`,
        ],
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
        barWidth: '40%',
        itemStyle: {
          borderRadius: [100, 100, 100, 100],
        },
      },
    ],
  };

  return errorStatsBarOption;
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

export const getLastTrafficChartOption = (lastTrafficList: any) => {
  const lastTrafficOption: echarts.EChartsOption = {
    legend: {
      show: true,
    },

    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      trigger: 'axis',
    },
    toolbox: {
      left: 'right',
      itemSize: 20,
      top: -5,
      feature: {
        dataZoom: {
          show: false,
          yAxisIndex: 'none',
        },
        restore: {},
      },
    },
    backgroundColor: '#fff',
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: lastTrafficList.map((item: { statBaseTm: string | any[] }) => item.statBaseTm.slice(11, 16)),
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        interval: 179,
        showMaxLabel: true,
      },
    },
    axisPointer: {
      label: {
        backgroundColor: '#777',
      },
    },

    yAxis: {
      type: 'value',
      axisTick: {
        inside: false,
      },
      splitLine: {
        show: true,
      },
      axisLabel: {
        inside: false,
        formatter: '{value}\n',
      },
      z: 10,
    },
    grid: {
      top: 40,
      left: 5,
      right: 20,
      bottom: 20,
      containLabel: true,
    },
    dataZoom: [
      {
        type: 'inside',
        throttle: 50,
      },
    ],
    series: [
      {
        name: '금일',
        type: 'line',
        symbol: 'circle',
        symbolSize: 5,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 건';
          },
        },
        data: lastTrafficList.map((item: { todayCnt: any }) => item.todayCnt),
        smooth: true,
      },
      {
        name: '전일',
        type: 'line',
        symbol: 'circle',
        symbolSize: 5,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 건';
          },
        },
        data: lastTrafficList.map((item: { ystdayCnt: any }) => item.ystdayCnt),
        smooth: true,
      },
      {
        name: '전주',
        type: 'line',
        symbol: 'circle',
        symbolSize: 5,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 건';
          },
        },
        data: lastTrafficList.map((item: { lstWkCnt: any }) => {
          return item.lstWkCnt;
        }),
        smooth: true,
      },
    ],
  };

  return lastTrafficOption;
};

export const getLastResponseChartOption = (lastResponseList: any) => {
  const option: echarts.EChartsOption = {
    legend: {
      show: true,
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      trigger: 'axis',
    },
    toolbox: {
      left: 'right',
      itemSize: 20,
      top: -5,
      feature: {
        dataZoom: {
          show: false,
          yAxisIndex: 'none',
        },
        restore: {},
      },
    },
    backgroundColor: '#fff',
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: lastResponseList.map((item: { statBaseTm: string | any[] }) => item.statBaseTm.slice(11, 16)),
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        interval: 179,
        showMaxLabel: true,
      },
    },
    yAxis: {
      type: 'value',
    },
    grid: {
      top: 40,
      left: 5,
      right: 20,
      bottom: 20,
      containLabel: true,
    },
    dataZoom: [
      {
        id: 'dataZoomX',
        type: 'inside',
        xAxisIndex: [0],
      },
    ],
    series: [
      {
        name: '금일',
        type: 'line',
        symbol: 'circle',
        symbolSize: 5,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ms';
          },
        },
        data: lastResponseList.map((item: { todayAvgResTm: number }) => {
          return item.todayAvgResTm as number;
        }),
        smooth: true,
      },
      {
        name: '전일',
        type: 'line',
        symbol: 'circle',
        symbolSize: 5,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ms';
          },
        },
        data: lastResponseList.map((item: { ystdayAvgResTm: any }) => {
          return item.ystdayAvgResTm;
        }),
        smooth: true,
      },
      {
        name: '전주',
        type: 'line',
        symbol: 'circle',
        symbolSize: 5,
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ms';
          },
        },
        data: lastResponseList.map((item: { lstWkAvgResTm: any }) => {
          return item.lstWkAvgResTm;
        }),
        smooth: true,
      },
    ],
  };

  return option;
};

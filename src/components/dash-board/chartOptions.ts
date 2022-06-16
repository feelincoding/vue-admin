import * as echarts from 'echarts';
import type { TotalTrafficStat, ApiResponseStatus, ErrorStatsType } from '@/types/DashBoardType';
import type {
  TrafficService,
  TrafficApi,
  RealtimeServiceStatDetail,
  RealtimeApiStatDetail,
} from '@/types/MonitoringControlType';

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
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: detail.map((item) => item.statBaseTm.substr(11, 5)),
      axisLine: { show: true },
      axisLabel: {
        show: true,
        interval: 89,
        showMaxLabel: true,
      },
    },

    yAxis: {
      type: 'value',
    },
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
              color: '#6998FF',
            },
            {
              offset: 1,
              color: '#FF4E63',
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
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: detail.map((item) => item.statBaseTm.substr(11, 5)),
      axisLine: { show: true },
      axisLabel: {
        show: true,
        interval: 89,
        showMaxLabel: true,
      },
    },

    yAxis: {
      type: 'value',
    },
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
              color: '#6998FF',
            },
            {
              offset: 1,
              color: '#FF4E63',
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

export const getTotalTrafficDetailChartOption = (traffic: TotalTrafficStat[]) => {
  const totalTrafficDetailOption: echarts.EChartsOption = {
    legend: {
      data: ['성공', '실패'],
      textStyle: {
        fontSize: '14',
      },
    },
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
    xAxis: {
      type: 'category',
      data: traffic.map((item) => item.statBaseTm.substr(11, 5)),
    },

    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '성공',
        type: 'bar',
        stack: 'stack',
        data: traffic.map((item) => {
          return item.sucesCnt as number;
        }),
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' },
        color: '#6998FF',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 건';
          },
        },
        zlevel: 5,
        z: 5,
      },
      {
        name: '실패',
        type: 'bar',
        stack: 'stack',
        data: traffic.map((item) => {
          return item.failCnt as number;
        }),
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' },
        color: '#FF4E63',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' 건';
          },
        },
        zlevel: 5,
        z: 5,
      },
    ],
  };
  return totalTrafficDetailOption;
};

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
  const o: echarts.EChartsOption = {
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

  return o;
}

export function getErrorStatChartOption(miCnt: number, maCnt: number, crCnt: number) {
  const errorStatDetail: echarts.EChartsOption = {
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
        axisLabel: { show: true, fontSize: '16', fontWeight: 550, color: '#000' },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      {
        type: 'category',
        data: [
          `${miCnt !== undefined ? miCnt.toLocaleString() : 0} 건`,
          `${maCnt !== undefined ? maCnt.toLocaleString() : 0} 건`,
          `${crCnt !== undefined ? crCnt.toLocaleString() : 0} 건`,
        ],
        axisLine: { show: false },
        axisLabel: { show: true, fontSize: '16', fontWeight: 550, color: '#000' },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    grid: {
      top: '5%',
      bottom: '5%',
      left: '10%',
      right: '10%',
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

  return errorStatDetail;
}

export const getLastTrafficChartOption = (lastTrafficList: any) => {
  const o: echarts.EChartsOption = {
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
      data: lastTrafficList.map((item: any) => item.statBaseTm.slice(11, 16)),
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
        data: lastTrafficList
          .filter((item: any) => new Date(item.statBaseTm) <= new Date())
          .map((item: any) => item.todayCnt),
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
        data: lastTrafficList.map((item: any) => item.ystdayCnt),
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
        data: lastTrafficList.map((item: any) => {
          return item.lstWkCnt;
        }),
        smooth: true,
      },
    ],
  };

  return o;
};

export const getLastResponseChartOption = (lastResponseList: any) => {
  const o: echarts.EChartsOption = {
    // legend: {
    //   data: ['today, lastDay, lastWeek'],
    // },
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
      data: lastResponseList.map((item: any) => item.statBaseTm.slice(11, 16)),
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
        data: lastResponseList
          .filter((item: any) => new Date(item.statBaseTm) <= new Date())
          .map((item: any) => item.todayAvgResTm),

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
        data: lastResponseList.map((item: any) => {
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
        data: lastResponseList.map((item: any) => {
          return item.lstWkAvgResTm;
        }),
        smooth: true,
      },
    ],
  };

  return o;
};

export const getRealTimeChartOption = (
  date: any[],
  data1: number[],
  data2: number[],
  data3: number[],
  data4: number[],
  data5: number[],
  data6: number[],
  data7: number[]
) => {
  const o: echarts.EChartsOption = {
    animationDuration: 10000,
    legend: {
      data: ['KTDS', 'KAKAO', 'NAVER', 'CUPANG', 'GOOGLE', 'FACEBOOK', 'INSTAGRAM'],
    },
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
    xAxis: {
      type: 'category',
      boundaryGap: false,
      nameLocation: 'middle',
      data: date,
    },
    yAxis: {
      boundaryGap: [0, '50%'],
      type: 'value',
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '10%',
      top: '10%',
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
        name: 'KTDS',
        type: 'line',
        showSymbol: false,
        data: data1,
        color: 'red',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'KTDS : ' + params.value.toFixed(0);
          },
        },
        zlevel: 5,
        z: 5,
      },
      {
        name: 'KAKAO',
        type: 'line',
        showSymbol: false,
        data: data2,
        color: 'yellow',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'KAKAO : ' + params.value.toFixed(0);
          },
        },
        zlevel: 5,
        z: 5,
      },
      {
        name: 'NAVER',
        type: 'line',
        showSymbol: false,
        data: data3,
        color: 'green',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'NAVER : ' + params.value.toFixed(0);
          },
        },
        zlevel: 5,
        z: 5,
      },
      {
        name: 'CUPANG',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: data4,
        color: 'blue',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'CUPANG : ' + params.value.toFixed(0);
          },
        },
        zlevel: 5,
        z: 5,
      },
      {
        name: 'GOOGLE',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: data5,
        color: 'black',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'GOOGLE : ' + params.value.toFixed(0);
          },
        },
        zlevel: 5,
        z: 5,
      },
      {
        name: 'FACEBOOK',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: data6,
        color: 'orange',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'FACEBOOK : ' + params.value.toFixed(0);
          },
        },
        zlevel: 5,
        z: 5,
      },
      {
        name: 'INSTAGRAM',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: data7,
        color: 'purple',
        endLabel: {
          show: true,
          formatter: function (params: any) {
            return 'INSTAGRAM : ' + params.value.toFixed(0);
          },
        },
        zlevel: 5,
        z: 5,
      },
    ],
  };
  return o;
};

export const get24TrafficChartOption = (type: string, trafficService: TrafficService[], trafficApi: TrafficApi[]) => {
  let totalData = [];
  let successData = [];
  let failData = [];
  let xAxisData = [];
  if (type == 'svc') {
    for (let index = 0; index < trafficService[0].svcTrafc.length; index++) {
      totalData.push(trafficService[0].svcTrafc[index].totCnt);
      successData.push(trafficService[0].svcTrafc[index].sucesCnt);
      failData.push(trafficService[0].svcTrafc[index].failCnt);
      xAxisData.push(trafficService[0].svcTrafc[index].statBaseTm.slice(11, 16));
    }
  } else if (type == 'api') {
    for (let index = 0; index < trafficApi[0].apiTrafc.length; index++) {
      totalData.push(trafficApi[0].apiTrafc[index].totCnt);
      successData.push(trafficApi[0].apiTrafc[index].sucesCnt);
      failData.push(trafficApi[0].apiTrafc[index].failCnt);
      xAxisData.push(trafficApi[0].apiTrafc[index].statBaseTm.slice(11, 16));
    }
  }

  let myAreaChartApiTop5AWeekTransitionSeries = [
    {
      name: '실패',
      data: failData,
    },
    {
      name: '성공',
      data: successData,
    },
    {
      name: '전체',
      data: totalData,
    },
  ];

  const o = {
    tooltip: {
      appendToBody: true,
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
      bottom: '3%',
      left: '3%',
      right: '4%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: myAreaChartApiTop5AWeekTransitionSeries.map((item) =>
      Object.assign(item, {
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        zlevel: 5,
        z: 5,
      })
    ),
  };
  return o;
};

export const getBarOption = (
  type: string,
  realtimeServiceStatDetailList: RealtimeServiceStatDetail[],
  realtimeApiStatDetailList: RealtimeApiStatDetail[]
) => {
  let successData = [];
  let failData = [];
  let yAxisData = [];

  if (type == 'svc') {
    for (let index = 0; index < realtimeServiceStatDetailList.length; index++) {
      successData.unshift(realtimeServiceStatDetailList[index].sucesCnt);
      failData.unshift(realtimeServiceStatDetailList[index].failCnt);
      if (index == 0) {
        yAxisData.unshift('Today');
      } else {
        yAxisData.unshift(realtimeServiceStatDetailList[index].statBaseDt.slice(5, 10));
      }
    }
  } else if (type == 'api') {
    for (let index = 0; index < realtimeApiStatDetailList.length; index++) {
      successData.unshift(realtimeApiStatDetailList[index].sucesCnt);
      failData.unshift(realtimeApiStatDetailList[index].failCnt);
      if (index == 0) {
        yAxisData.unshift('Today');
      } else {
        yAxisData.unshift(realtimeApiStatDetailList[index].statBaseDt.slice(5, 10));
      }
    }
  }

  let myBarChartApiTop5AWeekTransitionSeries = [
    {
      name: '성공',
      data: successData,
    },
    {
      name: '실패',
      data: failData,
    },
  ];

  const option = {
    tooltip: {
      appendToBody: true,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      top: '5%',
      left: '3%',
      right: '6%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
    },
    series: myBarChartApiTop5AWeekTransitionSeries.map((item) =>
      Object.assign(item, {
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          fontSize: 9,
        },
        emphasis: {
          focus: 'series',
        },
        zlevel: 5,
        z: 5,
      })
    ),
  };
  return option;
};

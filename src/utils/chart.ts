import * as echarts from 'echarts';

export const drawTotalApiTrafficChart = (id: string, option: echarts.EChartsOption) => {
  const dom = document.getElementById(id) as HTMLDivElement;
  const myChart = echarts.init(dom);
  myChart.setOption(option);
  return myChart;
};

export const drawDynamicChart = (id: string, _rawData: any) => {
  const countries = ['Finland', 'France', 'Germany', 'Iceland', 'Norway', 'Poland', 'Russia', 'United Kingdom'];
  const datasetWithFilters: echarts.DatasetComponentOption[] = [];
  const seriesList: echarts.SeriesOption[] = [];
  const dom = document.getElementById(id) as HTMLDivElement;
  const myChart = echarts.init(dom);

  echarts.util.each(countries, function (country) {
    const datasetId = 'dataset_' + country;
    datasetWithFilters.push({
      id: datasetId,
      fromDatasetId: 'dataset_raw',
      transform: {
        type: 'filter',
        config: {
          and: [
            { dimension: 'Year', gte: 1950 },
            { dimension: 'Country', '=': country },
          ],
        },
      },
    });

    seriesList.push({
      type: 'line',
      datasetId: datasetId,
      showSymbol: false,
      name: country,
      endLabel: {
        show: true,
        formatter: function (params: any) {
          return params.value[3] + ': ' + params.value[0];
        },
      },
      labelLayout: {
        moveOverlap: 'shiftY',
      },
      emphasis: {
        focus: 'series',
      },
      encode: {
        x: 'Year',
        y: 'Income',
        label: ['Country', 'Income'],
        itemName: 'Year',
        tooltip: ['Income'],
      },
    });
  });
  console.log(datasetWithFilters);
  console.log(seriesList);
  console.log(_rawData);

  const option = {
    animationDuration: 10000,
    dataset: [
      {
        id: 'dataset_raw',
        source: _rawData,
      },
      ...datasetWithFilters,
    ],
    tooltip: {
      order: 'valueDesc',
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      nameLocation: 'middle',
    },
    yAxis: {
      name: 'Income',
    },
    grid: {
      right: 140,
    },
    series: seriesList,
  };

  myChart.setOption(option);
};

<template>
  <div>
<!--    <ApexChartLine class="lc_seismic_chart" :chartOptions="chartOptions" :series="chartSeries"/>-->
    <VJsoneditor v-model="json" :options="options" :plus="false" height="400px" @error="onError"/>
  </div>
</template>

<script>
  import ApexChartLine from "../components/ApexChartLine";
  import VJsoneditor from 'v-jsoneditor'
  export default {
    name: "testApexChart",

    components: {
      ApexChartLine,
      VJsoneditor
    },
    methods: {
      onError() {
        console.log('error')
      }
    },
    data() {
      return {
        options: {
          "mode": "code",
          "search": false,
        },
        json: {
          "hello": "vue"
        },
        chartOptions: {
          chart: {
            type: 'bar',
            height: 380
          },
          plotOptions: {
            bar: {
              barHeight: '100%',
              distributed: false,
              // horizontal: false,
              dataLabels: {
                position: 'bottom'
              },
            }
          },
          colors: ['#313695', '#35449C', '#3A53A3', '#3F64AC', '#4473B3', '#5083BB', '#5C90C2', '#679DC9', '#74ADD1', '#80B7D6', '#90C3DD', '#9CCDE2', '#A9D8E8', '#B8DFEC', '#C4E5F0', '#D1EBF3', '#E0F3F7', '#E7F5EA', '#EFF9DA', '#F7FBCD', '#FEFEBE', '#FEF7B3', '#FEEFA7', '#FEE79B', '#FEE090', '#FDD484', '#FDC678', '#FDBA6C', '#FCAC60', '#FA9D59', '#F88B51', '#F67C4A', '#F46D43', '#EC5C3B', '#E54D34', '#DD3D2D', '#D62F26', '#CA2326', '#BC1626', '#B00B26', '#A50026'],
          dataLabels: {
            enabled: false,
            textAnchor: 'start',
            style: {
              colors: ['#fff']
            },
            formatter: function (val, opt) {
              return val.toFixed(3)
            },
            offsetX: 0,
            dropShadow: {
              enabled: true
            }
          },
          stroke: {
            width: 1,
            colors: ['#fff']
          },
          xaxis: {
            // categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
            //   'United States', 'China', 'India'
            // ],
            categories: [
              '0.14164229', '0.15955805', '0.17747381', '0.19538957', '0.21330533', '0.23122109',
              '0.24913685', '0.26705261', '0.28496837', '0.30288413', '0.32079989', '0.33871565',
              '0.35663141', '0.37454717', '0.39246293', '0.41037868', '0.42829444', '0.4462102',
              '0.46412596', '0.48204172', '0.49995748', '0.51787324', '0.535789',   '0.55370476',
              '0.57162052', '0.58953628', '0.60745204', '0.6253678', '0.64328356', '0.66119932',
              '0.67911508', '0.69703084', '0.7149466',  '0.73286236', '0.75077812', '0.76869388',
              '0.78660964', '0.8045254',  '0.82244116', '0.84035692', '0.85827268'],
          },
          yaxis: {
            labels: {
              show: true,
              formatter: function (val, opt) {
                return val.toFixed(3)
              },
            }
          },
          title: {
            text: 'Custom DataLabels',
            align: 'center',
            floating: true
          },
          subtitle: {
            text: 'Category Names as DataLabels inside bars',
            align: 'center',
          },
          tooltip: {
            theme: 'dark',
            x: {
              show: false
            },
            y: {
              title: {
                formatter: function () {
                  return ''
                }
              }
            }
          },
          legend: {
            show: false
          }
        },
        chartSeries: [{
        data: [0.5969709,  0.74621363, 0.44772818, 1.04469908, 1.7909127,  1.49242725,
          1.34318453, 1.94015543, 0.44772818, 1.49242725, 0.29848545, 0.44772818,
          2.68636905, 1.64166998, 1.34318453, 1.64166998, 1.1939418,  1.04469908,
          1.04469908, 2.23864088, 1.7909127,  2.23864088, 1.7909127,  1.1939418,
          1.04469908, 0.5969709,  1.1939418,  1.04469908, 0.74621363, 0.44772818,
          1.34318453, 1.04469908, 0.74621363, 1.1939418,  1.94015543, 1.94015543,
          0.44772818, 3.73106813, 4.47728175, 1.94015543,
        ]
      }],
      }
    }
  }
</script>

<style scoped>

  .lc_seismic_chart {
    width: 100%;
    height: 67vh;
  }

</style>

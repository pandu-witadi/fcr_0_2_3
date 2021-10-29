<template>
  <div>
    <view-process-wizard-button :icon="tabicon" :title="tabtitle" :index="4" :textsize="190" class="mb-3"/>

    <apexcharts
      class="style_chart_proc"
      height="100%"
      width="100%"
      :options="chartOptions"
      :series="series"
    ></apexcharts>

    <view-bottom-wizard-button class="mt-2" index="4" :left_clicked="wizardButtonClicked('processwizard4')" :right_clicked="wizardButtonClicked('processwizard6')"/>
  </div>
</template>

<script>
  import VueApexCharts from "vue-apexcharts";
  import ViewProcessWizardButton from "../components/viewProcessWizardButton";
  import ViewBottomWizardButton from "../components/viewBottomWizardButton";
  import {mapState} from "vuex";

  export default {
    name: "ProcessWizardStep5",
    components: {
      apexcharts: VueApexCharts,
      ViewBottomWizardButton,
      ViewProcessWizardButton
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data: function ()
    {
      return {
        tabicon: ["fa fa-wpforms", "fa fa-map", "fa fa-window-restore", "fa fa-map-marker", "fa fa-line-chart", "fa fa-pie-chart"],
        tabtitle: ["Input Parameter", "Map Window", "Section", "Map Propagation", "Data Trend", "Recomendation"],

        series: [{
          name: "Data 1",
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
        },
          {
            name: "Data 2",
            data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
          },
          {
            name: 'Data 3',
            data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
          }
        ],
        chartOptions :{
          chart: {
            height: 500,
            type: 'line',
            zoom: {
              enabled: false
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: [5, 7, 5],
            curve: 'straight',
            dashArray: [0, 8, 5]
          },
          title: {
            text: 'AVA TREND PLOT VS PROVEN WELL',
            align: 'center'
          },
          legend: {
            tooltipHoverFormatter: function(val, opts) {
              return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
            }
          },
          markers: {
            size: 0,
            hover: {
              sizeOffset: 6
            }
          },
          xaxis: {
            categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
              '10 Jan', '11 Jan', '12 Jan'
            ],
          },
          tooltip: {
            y: [
              {
                title: {
                  formatter: function (val) {
                    return val + " (mins)"
                  }
                }
              },
              {
                title: {
                  formatter: function (val) {
                    return val + " per session"
                  }
                }
              },
              {
                title: {
                  formatter: function (val) {
                    return val;
                  }
                }
              }
            ]
          },
          grid: {
            borderColor: '#f1f1f1',
          }
        }
      };
    },

    methods: {
      wizardButtonClicked(str_router) {
        return(this.varRouter.getRoute(str_router, 1))
      }
    }
  }
</script>

<style scoped>
  .style_chart_proc {
    height: 56vh;
    background: #FAFAFA
  }
</style>

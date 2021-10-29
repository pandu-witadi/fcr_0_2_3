<template>
  <div>
    <view-process-wizard-button :icon="tabicon" :title="tabtitle" :index="5" :textsize="190" class="mb-3"/>

    <apexcharts
      class="style_chart_proc"
      height="100%"
      width="100%"
      :options="chartOptions"
      :series="series"
    ></apexcharts>

    <view-bottom-wizard-button class="mt-2" index="5" :left_clicked="wizardButtonClicked('processwizard5')"
                               :right_clicked="wizardButtonClicked('processwizard1')" textright="Finish"/>
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

        series: [44, 55, 10],
        chartOptions:
          {

            chart: {
              width: 380,
              type: 'donut',
            }
            ,
            dataLabels: {
              enabled: true
            },
            fill: {
              type: 'gradient',
            },
            labels: ["Gas", "Coal", "Water"],
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          }
      }
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

<template>
  <div>
    <apexcharts
      style="background: #FAFAFA"
      height="100%"
      width="100%"
      :options="chartOptions"
      :series="series"
    ></apexcharts>
  </div>
</template>

<script>
  import VueApexCharts from "vue-apexcharts";

  export default {
    name: "ApexChartLineWithPointId",
    props: ['chartOptions', 'series'],
    components: {
      apexcharts: VueApexCharts
    },
    data: function ()
    {
      return {
      };
    },

    created()
    {
      console.log("created");
      this.chartOptions["tooltip"] = {
        // custom: function({series, seriesIndex, dataPointIndex, w})
        // {
        //   return '<div class="arrow_box">' +
        //     '<span>' + w.globals["chart"] + '</span>' +
        //     '</div>'
        // }
        // enabled: true,
        // x: {
        //   show: true,
        // },
        // y: {
        //   formatter: function (value, {series, seriesIndex, dataPointIndex, w})
        //   {
        //     seriesIndex = seriesIndex*1;
        //     dataPointIndex = dataPointIndex*1;
        //     console.log(seriesIndex)
        //     console.log(dataPointIndex)
        //     console.log(JSON.stringify(w[0]))
        //     let sstr = this.series[seriesIndex][dataPointIndex]["x"] + " " + this.series[seriesIndex][dataPointIndex]["y"];
        //     return(sstr);
        //     // return value.toFixed(4)
        //   },
        // },
        // marker: {
        //   show: true,
        // },
      }
    },
    methods: {
    },
  }
</script>

<style scoped>

</style>

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
    name: "ApexChartLine",
    props: ['chartOptions', 'series'],
    components: {
      apexcharts: VueApexCharts
    },
    methods: {
    },
    data: function ()
    {
      return {
      };
    },
  }
</script>

<style scoped>

</style>

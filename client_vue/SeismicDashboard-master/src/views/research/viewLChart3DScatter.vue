<template>
  <div :id="chartId" class="fill"></div>
</template>

<script>
  import {ColorRGBA, lightningChart, SolidFill} from '@arction/lcjs'

  export default {
    name: "viewLChart3DScatter",
    props: ['points', 'bupdateChart'],
    data() {
      return {
        chart: null,
        chartId: null,
      }
    },
    methods: {
      createChart()
      {
        if (this.chart !== null)
        {
          this.chart.dispose();
        }

        // Create chartXY
        this.chart = lightningChart().Chart3D({container: `${this.chartId}`})
        // Set chart title
        this.chart.setTitle('Getting Started');

        this.chart.getDefaultAxisX().setTitle('Axis X');
        this.chart.getDefaultAxisY().setTitle('Axis Y');
        this.chart.getDefaultAxisZ().setTitle('Axis Z');

        const red = new SolidFill({color: ColorRGBA(255, 200, 100)});
        const redSeries = this.chart.addPointSeries({pointShape: 'sphere'})
          .setPointStyle((pointStyle) => pointStyle
            .setFillStyle(red)
            .setSize(30));

        redSeries.add(this.points);

        // // Add line series to the chart
        // const lineSeries = this.chart.addLineSeries();
        // // Set stroke style of the line
        // lineSeries.setStrokeStyle((style) => style.setThickness(5));
        // // Add data points to the line series
        // lineSeries.add(this.points);
      }
    },

    mounted()
    {
      // Chart can only be created when the component has mounted the DOM because
      // the chart needs the element with specified containerId to exist in the DOM
      this.createChart()
    },

    beforeMount()
    {
      // Generate random ID to us as the containerId for the chart and the target div id
      this.chartId = Math.trunc(Math.random() * 1000000)
    },

    beforeDestroy()
    {
      // "dispose" should be called when the component is unmounted to free all the resources used by the chart
      this.chart.dispose()
    },

    watch :
      {
        bupdateChart: function (val)
        {
          this.bupdateChart = val;
          this.createChart();
        },
      }
  }
</script>

<style scoped>
  .fill {
    height: 100%;
  }
</style>

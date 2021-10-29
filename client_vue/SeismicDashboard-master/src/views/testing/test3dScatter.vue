<template>
  <div>
    <div :id="chartId"></div>
  </div>
</template>

<script>
  import {
    ColorRGBA,
    lightningChart,
    SolidFill,
  } from '@arction/lcjs'

  export default {
    name: "test3dScatter",
    data()
    {
      return {
        chartId: null,
      }
    },

    methods: {
      createChart()
      {
        // Define colors
        const red = new SolidFill({color: ColorRGBA(255, 200, 100)});

        // Initiate chart
        const chart3D = lightningChart().Chart3D({
        })
          .setTitle('3D Scatter Chart');

        // Set Axis titles
        chart3D.getDefaultAxisX().setTitle('Axis X');
        chart3D.getDefaultAxisY().setTitle('Axis Y');
        chart3D.getDefaultAxisZ().setTitle('Axis Z');

        const redSeries = chart3D.addPointSeries({pointShape: 'sphere'})
          .setPointStyle((pointStyle) => pointStyle
            .setFillStyle(red)
            .setSize(30));

        const points = [];
        let xmin = 556669.18089384;
        let xmax = 557669.18089384;
        let ymin = 9899202.54338531;
        let ymax = 9899877.54338531;
        let zmin = 485.46374512;
        let zmax = 498.89390945;
        points.push({x:xmin, y:ymin, z:zmin});
        points.push({x:xmax, y:ymin, z:zmin});
        points.push({x:xmax, y:ymax, z:zmin});
        points.push({x:xmin, y:ymax, z:zmin});
        points.push({x:xmin, y:ymin, z:zmax});
        points.push({x:xmax, y:ymin, z:zmax});
        points.push({x:xmax, y:ymax, z:zmax});
        points.push({x:xmin, y:ymax, z:zmax});
        redSeries.add(points);
      }
    },
    mounted()
    {
      // Chart can only be created when the component has mounted the DOM because
      // the chart needs the element with specified containerId to exist in the DOM
      this.createChart();
    },

    beforeMount()
    {
      this.chartId = Math.trunc(Math.random() * 1000000)
    },

    beforeDestroy()
    {
      this.chart.dispose()
    },
  }
</script>

<style scoped>

</style>

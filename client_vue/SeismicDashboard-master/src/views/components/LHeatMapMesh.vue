<template>
  <div class="image">
  </div>
</template>

<script>
  import {createColorObject} from "../../libs/libLC";
  import {ColorHSV, ColorRGBA, IndividualPointFill, IntensitySeriesTypes, lightningChart} from "@arction/lcjs";

  export default {
    name: "LHeatMapMesh",
    props: ['title', 'points', 'xaxis', 'yaxis', 'perc', 'colormap', 'resizeevent', 'cmin', 'cmax'],
    data()
    {
      return {
        chart: null,
        chartId: null,
        defForeColor: "#000000",
        defColor: {
          background: ColorRGBA(250, 250, 250),
          linecolor: ColorRGBA(65, 105, 225),
          default: ColorRGBA(0, 0, 0),
        },
        grColor: null,
      }
    },

    methods: {
      degToRad(angle)
      {
        return angle * Math.PI / 180
      },
      createChart()
      {
        if (this.chart !== null)
        {
          this.chart.dispose();
        }

        this.grColor = createColorObject(this.defColor);

        // Create chartXY
        this.chart = lightningChart().ChartXY()
          .setTitleFillStyle(this.grColor.default)
          .setBackgroundFillStyle(this.grColor.background)
          .setChartBackgroundFillStyle(this.grColor.background)
        .disableAnimations();
        this.chart.setTitle(this.title);

        let x1 = 10;
        let x2 = 100;
        let y1 = 10;
        let y2 = 100;
        let datas = [];
        for(let i=x1; i<x2; i++)
        {
          for(let j=y1; j<y2; j++)
          {
            let tmp_col = [];
            tmp_col.push(Math.sin(this.degToRad(i + 1)));
            tmp_col.push(Math.sin(this.degToRad(j + 1)));
            tmp_col.push(Math.sin(this.degToRad((i+j) + 1)));
            datas.push(tmp_col);
          }
        }

        // Resolution of each row/column, specifying how many cells
        // are in the heatmap.
        const resolution = 20;

        // Add a heatmap to the chart, as a IntensityMesh
        const heatmap = this.chart
          .addHeatmapSeries({
            rows: resolution,
            columns: resolution,
            start: {x: x1, y: y1},
            end: {x: x2, y: y2},
            pixelate: false,
            type: IntensitySeriesTypes.Mesh,
          })
          // Add colors and invalidate the Series based on the colors assigned.
          // .invalidateColorsOnly((row, column) => ColorHSV(Math.random() * 70, 0.8))
          // .invalidateColorsOnly((row, column) => ColorHSV(Math.random() * 70, 0.8))
          .invalidateColorsOnly((row, column) => ColorHSV(datas[row*column][2]*70,0.8))
          // Use IndividualPointFill to apply individual color per cell.
          .setFillStyle(new IndividualPointFill())
          // Edit the geometry and invalidate the Series based on the new geometry.
          .invalidateGeometryOnly((row, column, prev) => ({
            // Compute the geometry for each cell in the heatmap.
            x: datas[row*column][0],
            y: datas[row*column][1],
          }));
      },
    },
    mounted()
    {
      // Chart can only be created when the component has mounted the DOM because
      // the chart needs the element with specified containerId to exist in the DOM
      this.createChart();
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

      }
  }
</script>

<style scoped>
  .image {
    height: 100%;
    position: relative;
    z-index: 1;
  }
</style>

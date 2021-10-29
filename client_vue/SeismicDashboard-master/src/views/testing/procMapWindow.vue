<template>
  <div class="image">
    <div :id="chartId" class="image"></div>
  </div>
</template>

<script>
  import TestHeatMap from "./testHeatMap";
  import {createColorObject} from "../../libs/libLC";
  import {ColorHEX, ColorRGBA, lightningChart, PalettedFill, SolidFill, translatePoint} from "@arction/lcjs";
  import {get2dColSize, get2dMaxData, get2dMinData, get2dRowSize, getLcColormap} from "../../libs/colormap";
  import {setPositionFromIndex} from "../../libs/simpleLib";

  export default {
    name: "procMapWindow",
    props: ['title', 'points', 'xaxis', 'yaxis', 'perc', 'colormap'],
    components: {TestHeatMap},
    data()
    {
      return {
        chart: null,
        chartId: null,

        dx:1,
        dy:1,
        ns: 0,
        ntrc: 0,
        ystart : 0,
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
      createChart()
      {
        if (this.chart !== null)
        {
          this.chart.dispose();
        }

        this.grColor = createColorObject(this.defColor);

        // Create chartXY
        this.chart = lightningChart().ChartXY({containerId: `${this.chartId}`})
          .setTitleFillStyle(this.grColor.default)
          .setBackgroundFillStyle(this.grColor.background)
          .setChartBackgroundFillStyle(this.grColor.background);
        this.chart.setTitle(this.title);

        // Create LUT and FillStyle
        this.minData = get2dMinData(this.points);
        this.maxData = get2dMaxData(this.points);

        // let dmin_ = Math.abs(this.minData * this.cmin / 100.0);
        // let dmax_ = Math.abs(this.maxData * this.cmax / 100.0);
        // this.minData = this.minData + dmin_;
        // this.maxData = this.maxData - dmax_;

        let mm_data = 0;
        if(Math.abs(this.minData) > Math.abs(this.maxData))
          mm_data = Math.abs(this.minData) * this.perc / 100.0;
        else
          mm_data = Math.abs(this.maxData) * this.perc / 100.0;
        this.minData = this.minData + mm_data;
        this.maxData = this.maxData - mm_data;
        console.log(this.minData)
        console.log(this.maxData)

        this.palette = getLcColormap(this.colormap, this.minData, this.maxData);

        this.ntrc = get2dColSize(this.points);
        this.ns = get2dRowSize(this.points);
        this.dy = this.yaxis["sampling"]*1.0;
        this.dx = this.xaxis["data"][1] - this.xaxis["data"][0];
        this.ystart = this.yaxis["start"];
        let start_time = Math.round(setPositionFromIndex(0, this.dy, this.ystart));
        let end_time = Math.round(setPositionFromIndex(this.ns-1, this.dy, this.ystart));

        let resolutionX = this.ns;
        let resolutionY = this.ntrc;
        let customX = this.chart.addAxisX(true)
          .setTitleFillStyle(this.grColor.default)
          .setTickStyle((visibleTicks) => visibleTicks.setLabelFillStyle(new SolidFill({color: ColorHEX(this.defForeColor)})))
          .disableAnimations()
          .setInterval(0, this.ntrc)
          .setTitle(this.xaxis["label"]);
        let customY = this.chart.addAxisY(false)
          .setTitleFillStyle(this.grColor.default)
          .setTickStyle((visibleTicks) => visibleTicks.setLabelFillStyle(new SolidFill({color: ColorHEX(this.defForeColor)})))
          .disableAnimations()
          .setInterval(start_time, end_time)
          .setTitle(this.yaxis["label"]);
        this.chart.addHeatmapSeries({
          rows: resolutionX,
          columns: resolutionY,
          start: {x: this.xaxis["data"][0], y: end_time},
          end: {x: this.xaxis["data"][this.ntrc - 1], y: start_time},
          pixelate: false,
          xAxis: customX,
          yAxis: customY
        })
          .setMouseInteractions(true)
          // Add data and invalidate the Series based on added data.
          .invalidateValuesOnly(this.points)
          .setFillStyle(new PalettedFill({lut: this.palette}));
        this.chart.getDefaultAxisX().dispose();
        this.chart.getDefaultAxisY().dispose();
      },
    },
    mounted: function () {
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

  .overlay {
    position: relative;
    z-index: 2;
  }
</style>

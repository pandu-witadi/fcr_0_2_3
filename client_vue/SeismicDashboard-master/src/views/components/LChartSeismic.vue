<template>
  <div class="image">
    <div @click="myevent()" :id="chartId" class="image"></div>
  </div>
</template>

<script>
  import {
    ColorHEX,
    ColorPalettes,
    ColorRGBA,
    lightningChart,
    PalettedFill,
    SolidFill,
    SolidLine,
    translatePoint
  } from '@arction/lcjs'
  import {get2dColSize, get2dMaxData, get2dMinData, get2dRowSize, getLcColormap} from "../../libs/colormap";
  import {createColorObject} from "../../libs/libLC";
  import {getIndexFromArray, getIndexFromArray3, setPositionFromIndex} from "../../libs/simpleLib";

  export default {
    name: "LChartSeismic",
    props: ['title', 'points', 'xaxis', 'yaxis', 'perc', 'colormap', 'resizeevent', 'cmin', 'cmax'],
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

        // x_cursor_info : '',
        // y_cursor_info : '',
        tmpEvent: null,
        defForeColor: "#000000",
        defColor: {
          background: ColorRGBA(250, 250, 250),
          linecolor: ColorRGBA(65, 105, 225),
          default: ColorRGBA(0, 0, 0),
          bandcolor: ColorRGBA(255,255,224),
        },
        grColor: null,
        pointInLcAxis: {},
        cursorInfo: {x:0, y:0}
      }
    },
    methods: {

      isValidTrace(tmp_point)
      {
        // if(tmp_point.x < 0 || tmp_point.x >= this.ntrc)
        //   return(false);

        if(tmp_point.x < this.xaxis["data"][0] || tmp_point >= this.xaxis["data"][this.ntrc - 1])
        {
          // console.log("x " + tmp_point)
          return (false)
        }

        if(tmp_point.y < this.ystart)// || tmp_point.y > (this.yaxis["start"] + (this.ns * this.yaxis["sampling"])))
        {
          return (false)
        }

        return (true);
      },
      createChart()
      {
        if (this.chart !== null)
        {
          this.chart.dispose();
        }

        this.grColor = createColorObject(this.defColor);

        // Create chartXY
        this.chart = lightningChart().ChartXY({container: `${this.chartId}`})
          .setTitleFillStyle(this.grColor.default)
          .setBackgroundFillStyle(this.grColor.background)
          // .setChartBackgroundFillStyle(this.grColor.background);
        this.chart.setTitle(this.title);

        // Create LUT and FillStyle
        this.minData = get2dMinData(this.points);
        this.maxData = get2dMaxData(this.points);

        let dmin_ = Math.abs(this.minData * this.cmin / 100.0);
        let dmax_ = Math.abs(this.maxData * this.cmax / 100.0);
        this.minData = this.minData + dmin_;
        this.maxData = this.maxData - dmax_;

        // console.log(this.minData + " " + this.maxData)

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
          // .setTickStyle((visibleTicks) => visibleTicks.setLabelFillStyle(new SolidFill({color: ColorHEX(this.defForeColor)})))
          .disableAnimations()
          .setInterval(0, this.ntrc)
          .setTitle(this.xaxis["label"]);
        let customY = this.chart.addAxisY(false)
          .setTitleFillStyle(this.grColor.default)
          // .setTickStyle((visibleTicks) => visibleTicks.setLabelFillStyle(new SolidFill({color: ColorHEX(this.defForeColor)})))
          .disableAnimations()
          .setInterval(end_time, start_time)
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



        const palette = ColorPalettes.arction(10)
        const colors = [6, 9, 0].map(palette)
        const axisYColors = [colors[0], colors[5]]
        const axisYStyles = axisYColors.map((color) => new SolidFill({ color }))
        const axisYStrokeStyles = axisYStyles.map((fillStyle) => new SolidLine({ fillStyle, thickness: 2 }))
        // Add a Band to the X/Y Axis
        // Add a Constantline to the X Axis
        const xAxisConstantline = customX.addConstantLine()
        xAxisConstantline
          .setValue(3250)
          .setStrokeStyle(axisYStrokeStyles[0]);
        const xAxisBand = customX.addBand();
        xAxisBand
          .setValueStart(3250)
          .setValueEnd(3300)
          // .setFillStyle(axisYStrokeStyles)
          .setName('X Axis Band');
        const yAxisBand = customY.addBand();
        yAxisBand
          .setValueStart(50)
          .setValueEnd(200)
          .setName('Y Axis Band');

        // document.addEventListener('mousemove', (event) =>
        // {
          // this.tmpEvent = event;
          // let tmp_point = translatePoint(
          //   this.chart.engine.clientLocation2Engine(this.tmpEvent.clientX, this.tmpEvent.clientY),
          //   this.chart.engine.scale,
          //   {
          //     x: this.chart.getDefaultAxisX().scale,
          //     y: this.chart.getDefaultAxisY().scale
          //   }
          // )
          // this.cursor_move_event(tmp_point);
        // })
      },

      cursor_move_event(tmp_point)
      {
        if(this.isValidTrace(tmp_point))
        {
          //console.log("0 : " + tmp_point.y)
          let x1 = getIndexFromArray(tmp_point.x, this.dx);
          let y1 = getIndexFromArray3(tmp_point.y, this.dy, this.ystart);
          let y2 = setPositionFromIndex(y1, this.dy, this.ystart);

          // this.x_cursor_info = this.xaxis["label"] + " : " + Math.round(tmp_point.x) + " [" + x1 + "]";
          // let y_cursor_info = this.yaxis["label"] + " : " + y2.toFixed(3) + " [" + y1 + "]";
          let x_cursor_info = "x : " + Math.round(tmp_point.x) + " [" + x1 + "]";
          let y_cursor_info = "y : " + y2 + " [" + y1 + "]";
          this.cursorInfo = {
            x : x_cursor_info,
            y : y_cursor_info,
          }
        }
      },
      myevent()
      {
        // let tmp_point = translatePoint(
        //   this.chart.engine.clientLocation2Engine(this.tmpEvent.clientX, this.tmpEvent.clientY),
        //   this.chart.engine.scale,
        //   {
        //     x: this.chart.getDefaultAxisX().scale,
        //     y: this.chart.getDefaultAxisY().scale
        //   }
        // )
        //
        // if(this.isValidTrace(tmp_point))
        //   this.pointInLcAxis = tmp_point;
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
        cursorInfo(val)
        {
          this.$emit('cursorInfo', val);
        },

        pointInLcAxis(val)
        {
          if (val)
          {
            val["isValid"] = this.isValidTrace(val);
            this.$emit('pointInLcAxis', val);
          }
        },
        colormap: function (val)
        {
          this.colormap = val;
          this.createChart();
        },
        cmin: function (val)
        {
          this.cmin = val;
          this.createChart();
        },
        cmax: function (val)
        {
          this.cmax = val;
          this.createChart();
        },
        resizeevent: function (val)
        {
          this.resizeevent = val;
          this.createChart();
        },
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

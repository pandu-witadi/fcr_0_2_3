<template>
  <div class="image">
    <div @click="myevent()" :id="chartId" class="image"></div>
  </div>
</template>

<script>
  import {
    AxisTickStrategies,
    ColorHEX,
    ColorPalettes,
    ColorRGBA, emptyLine,
    lightningChart, NumericTickStrategy,
    PalettedFill,
    SolidFill,
    SolidLine,
    translatePoint
  } from '@arction/lcjs'
  import {get2dColSize, get2dMaxData, get2dMinData, get2dRowSize, getLcColormap} from "../../libs/colormap";
  import {createColorObject} from "../../libs/libLC";
  import {getIndexFromArray, getIndexFromArray3, setPositionFromIndex} from "../../libs/simpleLib";
  import {getDefaultDarkColorAtIdx} from "../../libs/defApexChartLine";

  export default {
    name: "LChartSeismicAreaSelected",
    props: ['id', 'title', 'points', 'xaxis', 'yaxis', 'perc', 'colormap', 'resizeevent', 'cmin', 'cmax',
      "boundaryX", "boundaryY", "target", "refreshChart"],
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
        updateBoundaryX: {},
        updateBoundaryY: {},
        // refreshChart: false,
        xAxisBand: null,
        yxAxisBand: null,

        // x_cursor_info : '',
        // y_cursor_info : '',
        tmpEvent: null,
        defForeColor: "#000000",
        defColor: {
          // background: ColorRGBA(250, 250, 250),
          background: ColorRGBA(0, 0, 0),
          foreground: ColorRGBA(255, 255, 255),
          linecolor: ColorRGBA(65, 105, 225),
          default: ColorRGBA(0, 0, 0),
          bandcolor: ColorRGBA(255,255,224),
        },
        grColor: null,
        pointInLcAxis: {},
        cursorInfo: {x:0, y:0},
        // bupdate: true
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
          .setTitleFillStyle(this.grColor.foreground)
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
        let customX = this.chart.addAxisX({opposite: false})
          .setTitleFillStyle(this.grColor.foreground)
          // .setTickStyle((visibleTicks) => visibleTicks.setLabelFillStyle(new SolidFill({color: ColorHEX(this.defForeColor)})))
          .disableAnimations()
          .setInterval(0, this.ntrc)
          .setTitle(this.xaxis["label"])
          // .setTickStrategy(
          //   // Use Numeric TickStrategy as base.
          //   AxisTickStrategies.Numeric,
          //   // Use mutator to modify the TickStrategy.
          //   tickStrategy => tickStrategy
          //     // Modify Major Tick Style by using a mutator.
          //     .setMajorTickStyle(
          //       tickStyle => tickStyle
          //         .setGridStrokeStyle(emptyLine)
          //     )
          //     // Modify Minor Tick Style by using a mutator.
          //     .setMinorTickStyle(
          //       tickStyle => tickStyle
          //         .setGridStrokeStyle(emptyLine)
          //     )
          // )
        ;

        let customY = this.chart.addAxisY({opposite: false})
          .setTitleFillStyle(this.grColor.foreground)
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
        // // Add LegendBox.
        // const legend = this.chart.addLegendBox()
        //   // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
        //   .setAutoDispose({
        //     type: 'max-width',
        //     maxWidth: 0.30,
        //   })
        //   .add(this.chart)


        let x_stroke_style = new SolidLine()
          .setFillStyle(new SolidFill().setColor(ColorHEX(getDefaultDarkColorAtIdx(0))))
          .setThickness(2.0);
        let y_stroke_style = new SolidLine()
          .setFillStyle(new SolidFill().setColor(ColorHEX(getDefaultDarkColorAtIdx(1))))
          .setThickness(2.0);

        // Add a Constantline to the X Axis
        let x_stroke_band_style = new SolidLine()
          .setFillStyle(new SolidFill().setColor(ColorHEX(getDefaultDarkColorAtIdx(3))))
          .setThickness(2.0);
        const xAxisConstantline1 = customX.addConstantLine();
        xAxisConstantline1
          .setValue(this.target)
          .setMouseInteractions(false)
        .setStrokeStyle(x_stroke_band_style);
        // console.log(JSON)
        // const xAxisConstantline2 = customX.addConstantLine();
        // xAxisConstantline2
        //   .setValue(3500)
        //   .setStrokeStyle(x_stroke_style);

        // // Add a Constantline to the Y Axis
        // const yAxisConstantline1 = customY.addConstantLine();
        // yAxisConstantline1
        //   .setValue(200)
        //   .setStrokeStyle(y_stroke_style);
        // const yAxisConstantline2 = customY.addConstantLine();
        // yAxisConstantline2
        //   .setValue(300)
        //   .setStrokeStyle(y_stroke_style);


        this.xAxisBand = customX.addBand();
        this.xAxisBand
          .setValueStart(this.boundaryX["p1"])
          .setValueEnd(this.boundaryX["p2"])
          .setStrokeStyle(x_stroke_style)
          .setName('X Axis Band');

        this.yAxisBand = customY.addBand();
        this.yAxisBand
          .setValueStart(this.boundaryY["p1"])
          .setValueEnd(this.boundaryY["p2"])
          .setStrokeStyle(y_stroke_style)
          .setName('Y Axis Band');

        // Handler of dragging band axis.
        const xAxisDragHandler = (figure, event, button, startLocation) => {
          this.updateBoundaryX = {
            p1: this.xAxisBand.getValueStart(),
            p2: this.xAxisBand.getValueEnd()
          }
        };
        this.xAxisBand.onMouseDragStop(xAxisDragHandler);
        // Handler of dragging bubbles.
        const yAxisDragHandler = (figure, event, button, startLocation) => {
          this.updateBoundaryY = {
            p1: this.yAxisBand.getValueStart(),
            p2: this.yAxisBand.getValueEnd()
          }
        };
        this.yAxisBand.onMouseDragStop(yAxisDragHandler);

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
      updateChartYAxisBoundary()
      {
        this.yAxisBand.setValueStart(this.boundaryY["p1"])
        this.yAxisBand.setValueEnd(this.boundaryY["p2"])
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
        updateBoundaryX(val)
        {
          this.$emit('updateBoundaryX', this.id, val);
        },
        boundaryY: function (val)
        {
          this.boundaryY = val;
          this.updateChartYAxisBoundary();
        },
        cursorInfo(val)
        {
          this.$emit('cursorInfo', val);
        },
        updateBoundaryY(val)
        {
          this.$emit('updateBoundaryY', this.id, val);
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
        refreshChart: function (val)
        {
          this.refreshChart = val;
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

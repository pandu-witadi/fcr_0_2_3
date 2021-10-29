<template>
  <div class="image">
    <div @click="myevent()" :id="chartId" class="image"></div>
  </div>
</template>

<script>
  import {ColorHEX, ColorPalettes, ColorRGBA, lightningChart, PalettedFill, SolidFill, SolidLine, translatePoint, PointShape} from '@arction/lcjs'
  import {get2dColSize, get2dMaxData, get2dMinData, get2dRowSize, getLcColormap} from "../../libs/colormap";
  import {createColorObject} from "../../libs/libLC";
  import {getIndexFromArray, getIndexFromArray3, setPositionFromIndex} from "../../libs/simpleLib";
  import {getDefaultDarkColorAtIdx} from "../../libs/defApexChartLine";

  export default {
    name: "LChartSeismicWithPoint",
    props: ['chartKey', 'title', 'points', 'xaxis', 'yaxis', 'colormap', 'resizeevent', 'cmin', 'cmax', 'chart_info_data'],
    data()
    {
      return {
        chart: null,
        chartId: null,
        chart_info: null,
        dx: 1,
        dy: 1,
        ns: 0,
        ntrc: 0,
        ystart: 0,
        yend: 0,

        // x_cursor_info : '',
        // y_cursor_info : '',
        tmpEvent: null,
        defForeColor: "#000000",
        defColor: {
          background: ColorRGBA(250, 250, 250),
          linecolor: ColorRGBA(65, 105, 225),
          default: ColorRGBA(0, 0, 0),
        },
        grColor: null,
        pointInLcAxis: {},
        cursorInfo: {x: 0, y: 0},

        customXAxis: null,
        customYAxis: null,
      }
    },
    methods: {

      isValidTrace(tmp_point)
      {
        // if(tmp_point.x < 0 || tmp_point.x >= this.ntrc)
        //   return(false);

        if (tmp_point.x < this.xaxis["data"][0] || tmp_point >= this.xaxis["data"][this.ntrc - 1])
        {
          // console.log("x " + tmp_point)
          return (false)
        }

        if (tmp_point.y < this.ystart)// || tmp_point.y > (this.yaxis["start"] + (this.ns * this.yaxis["sampling"])))
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
        this.chart = lightningChart().ChartXY({containerId: `${this.chartId}`})
          .setTitleFillStyle(this.grColor.default)
          .setBackgroundFillStyle(this.grColor.background)
          .setChartBackgroundFillStyle(this.grColor.background);
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
        this.dy = this.yaxis["sampling"] * 1.0;
        this.dx = this.xaxis["data"][1] - this.xaxis["data"][0];
        // this.ystart = this.yaxis["start"];
        this.ystart = Math.round(setPositionFromIndex(0, this.dy, this.ystart));
        this.yend = Math.round(setPositionFromIndex(this.ns - 1, this.dy, this.ystart));

        let resolutionX = this.ns;
        let resolutionY = this.ntrc;
        this.customXAxis = this.chart.addAxisX(true)
          .setTitleFillStyle(this.grColor.default)
          .setTickStyle((visibleTicks) => visibleTicks.setLabelFillStyle(new SolidFill({color: ColorHEX(this.defForeColor)})))
          .disableAnimations()
          .setInterval(0, this.ntrc)
          .setTitle(this.xaxis["label"]);
        this.customYAxis = this.chart.addAxisY(false)
          .setTitleFillStyle(this.grColor.default)
          .setTickStyle((visibleTicks) => visibleTicks.setLabelFillStyle(new SolidFill({color: ColorHEX(this.defForeColor)})))
          .disableAnimations()
          .setInterval(this.ystart, this.yend)
          .setTitle(this.yaxis["label"]);

        this.chart.addHeatmapSeries({
          rows: resolutionX,
          columns: resolutionY,
          start: {x: this.xaxis["data"][0], y: this.yend},
          end: {x: this.xaxis["data"][this.ntrc - 1], y: this.ystart},
          pixelate: false,
          xAxis: this.customXAxis,
          yAxis: this.customYAxis
        })
          .setMouseInteractions(true)
          // Add data and invalidate the Series based on added data.
          .invalidateValuesOnly(this.points)
          .setFillStyle(new PalettedFill({lut: this.palette}));

        this.chart.getDefaultAxisX().dispose();
        this.chart.getDefaultAxisY().dispose();

        document.addEventListener('mousemove', (event) =>
        {
          this.tmpEvent = event;
          let tmp_point = translatePoint(
            this.chart.engine.clientLocation2Engine(this.tmpEvent.clientX, this.tmpEvent.clientY),
            this.chart.engine.scale,
            {
              x: this.chart.getDefaultAxisX().scale,
              y: this.chart.getDefaultAxisY().scale,
            }
          )
          this.cursor_move_event(tmp_point);
        });
      },

      createLineChart()
      {
        if (this.chart_info_data === null)
          return;

        if (this.chart_info !== null)
          this.chart_info.dispose();

        let fill_style = new SolidFill().setColor(ColorHEX(getDefaultDarkColorAtIdx(1)));
        this.chart_info = this.chart.addPointSeries(
          {
            pointShape: PointShape.Circle,
            xAxis: this.customXAxis,
            yAxis: this.customYAxis,
          }
        )
          .setPointFillStyle(fill_style)
          .setPointSize(20);

        // Add data points to the line series
        this.chart_info.add(this.chart_info_data);
      },

      cursor_move_event(tmp_point)
      {
        if (this.isValidTrace(tmp_point))
        {
          let x1 = getIndexFromArray(tmp_point.x, this.dx);
          let y1 = getIndexFromArray3(tmp_point.y, this.dy, this.ystart);
          let y2 = setPositionFromIndex(y1, this.dy, this.ystart);

          let x_cursor_info = "x : " + Math.round(tmp_point.x) + " [" + x1 + "]";
          let y_cursor_info = "y : " + y2 + " [" + y1 + "]";
          this.cursorInfo = {
            x: x_cursor_info,
            y: y_cursor_info,
          }
        }
      },
      myevent()
      {
        let tmp_point = translatePoint(
          this.chart.engine.clientLocation2Engine(this.tmpEvent.clientX, this.tmpEvent.clientY),
          this.chart.engine.scale,
          {
            x: this.chart.getDefaultAxisX().scale,
            y: this.chart.getDefaultAxisY().scale
          }
        )

        if (this.isValidTrace(tmp_point))
        {
          this.pointInLcAxis = tmp_point;
        }
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
    watch:
      {
        chart_info_data()
        {
          this.createLineChart();
        },
        cursorInfo(val)
        {
          this.$emit('cursorInfo', val);
        },

        pointInLcAxis(val)
        {
          if (val)
          {
            val["isValid"] = this.isValidTrace(val);
            val['id'] = this.chartKey*1;
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

<template>
  <div :id="chartId" class="fill"></div>
</template>

<script>
  import {ColorHEX, ColorRGBA, lightningChart, PointShape, SolidFill, SolidLine, UIOrigins} from '@arction/lcjs'
  import {getDefaultDarkColorAtIdx} from "../../libs/defApexChartLine";
  import {createColorObject} from "../../libs/libLC";

  export default {
    name: "LChartSeries",
    props: ['prop', 'points', 'axis_bound', 'resizeevent'],
    data() {
      return {
        chart: null,
        chartId: null,

        defForeColor: "#000000",
        defColor: {
          background: ColorRGBA(250, 250, 250),
          linecolor: ColorRGBA(65, 105, 225),
          graycolor: ColorRGBA(150, 150, 150),
          default: ColorRGBA(0, 0, 0),
        },
        grColor: null,
      }
    },
    methods: {
      createChart()
      {
        if (this.chart !== null)
          this.chart.dispose();
        this.grColor = createColorObject(this.defColor);

        // Create chartXY
        this.chart = lightningChart()
          .ChartXY({containerId: `${this.chartId}`})
          .setTitleFillStyle(this.grColor.default)
          .setBackgroundFillStyle(this.grColor.background)
          .setChartBackgroundFillStyle(this.grColor.background)
          .disableAnimations();

        // .setTitle(this.yaxis["label"]);

        // Set chart title
        this.chart.setTitle(this.prop["title"]);
        let npoint_size_add = 5;
        for (let i = 0; i < this.points.length; i++)
        {
          let data = this.points[i];

          // Set desired fill style of the stroke.
          // SolidLine can have only SolidFill fill-style.
          let stroke_style = new SolidLine()
            .setFillStyle(new SolidFill().setColor(ColorHEX(data["color"])))
            .setThickness(data["point_size"]); // Set thickness of the stroke.

          if (data["type"] === "line")
          {
            this.chart.addLineSeries() // Add line series to the chart
              .setName(data["name"])
              .setStrokeStyle(stroke_style)
              .add(data["data"]); // Add data points to the line series
          }
          else if (data["type"] === "scatter")
          {
            this.chart.addPointSeries({pointShape: PointShape.Circle}) // Add line series to the chart
              .setName(data["name"])
              .setPointSize(data["point_size"] + npoint_size_add)
              .setPointFillStyle(new SolidFill().setColor(ColorHEX(data["color"])))
              .setResultTableFormatter()
              .add(data["data"]); // Add data points to the line series
          }
          else
          {
            this.chart.addPointLineSeries({pointShape: PointShape.Circle}) // Add line series to the chart
              .setName(data["name"])
              .setStrokeStyle(stroke_style)
              .setPointSize(data["point_size"] + npoint_size_add)
              .setPointFillStyle(new SolidFill().setColor(ColorHEX(data["color"])))
              .add(data["data"]); // Add data points to the line series
          }
        }

        // ------------------ set axis -----------------------
        this.chart.getDefaultAxisX()
          .setTitleFillStyle(this.grColor.default)
          .setTickStyle((visibleTicks) => visibleTicks.setLabelFillStyle(new SolidFill({color: ColorHEX(this.defForeColor)})))
          .disableAnimations()
          .setInterval(this.axis_bound[0], this.axis_bound[1], false, true)
          .setTitle(this.prop["xlabel"]);
        this.chart.getDefaultAxisY()
          .setTitleFillStyle(this.grColor.default)
          .setTickStyle((visibleTicks) => visibleTicks.setLabelFillStyle(new SolidFill({color: ColorHEX(this.defForeColor)})))
          .disableAnimations()
          .setInterval(this.axis_bound[2], this.axis_bound[3], false, true)
          .setTitle(this.prop["ylabel"]);

        let legend = this.chart.addLegendBox()
          .setOrigin(UIOrigins.LeftTop)
          .setPosition({x: 0, y: 98})
          .setBackground((bgtype) => bgtype
            .setFillStyle(new SolidFill().setColor(this.defColor["graycolor"]))
            .setStrokeStyle(new SolidLine()
              .setFillStyle(new SolidFill().setColor(this.defColor["default"]))));
        legend.add(this.chart)
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
        resizeevent: function (val)
        {
          this.resizeevent = val;
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

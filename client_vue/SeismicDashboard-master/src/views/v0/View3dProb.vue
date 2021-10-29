<template>
  <div>
    <div :id="chartId"></div>
  </div>
</template>

<script>
  import {
    ColorHSV,
    // ColorRGBA,
    lightningChart,
    SolidFill,
  } from '@arction/lcjs'
  import {mapState} from "vuex";
  import {colormapYellowRedHsv} from "../../libs/var_colormaps";

  export default {
    name: "View3dProb",
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data()
    {
      return {
        // chart: null,
        chartId: null,
      }
    },

    methods: {
      createChart()
      {
        const chart = lightningChart().Chart3D({});

        let plot_type = this.$route.query.type;
        if(plot_type === "prob1")
          chart.setTitle('Prob1 3D Scatter Chart');
        else if(plot_type === "prob2")
          chart.setTitle('Prob2 3D Scatter Chart');
        else
          chart.setTitle('Calc Prob 3D Scatter Chart');

        // Set Axis titles
        chart.getDefaultAxisX().setTitle('CDP X');
        chart.getDefaultAxisY().setTitle('CDP Z');
        chart.getDefaultAxisZ().setTitle('CDP Y');

        // let ava_list = this.$store.getters.readProbList;
        let ava_list = this.$store.getters.readProbList;
        let cur_colormap = colormapYellowRedHsv();
        let idx_cm = 0;

        for(let i=0; i<ava_list.length; i++) {
          let m = ava_list[i];

          // get data value
          if(plot_type === "prob1")
            idx_cm = Math.round(m["prob1"] * 255.0);
          else if(plot_type === "prob2")
            idx_cm = Math.round(m["prob2"] * 255.0);
          else
            idx_cm = Math.round(m["prob"] * 255.0);

          // convert value to colormap
          let cur_m = cur_colormap[idx_cm];
          let red = new SolidFill({color: ColorHSV(cur_m[0], cur_m[1], cur_m[2])});

          // create series and plot
          const series_0 = chart.addPointSeries({pointShape: 'sphere'})
            .setPointStyle((pointStyle) => pointStyle
              .setFillStyle(red)
              .setSize(30));

          let points = [];
          points.push({x: m["cdp_x"], y: m["cdp_z"], z: m["cdp_y"]});
          series_0.add(points);
          // console.log(JSON.stringify(m))
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
      this.chartId = Math.trunc(Math.random() * 1000000)
    },

    beforeDestroy()
    {
      // this.chart.dispose()
    },
  }
</script>

<style scoped>

</style>

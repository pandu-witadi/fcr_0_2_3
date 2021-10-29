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

  export default {
    name: "View3dAva",
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
        chartId: null,
      }
    },

    methods: {
      createChart()
      {
        // Initiate chart
        const chart3D = lightningChart().Chart3D({
        })
          .setTitle('AVA 3D Scatter Chart');

        // Set Axis titles
        chart3D.getDefaultAxisX().setTitle('CDP X');
        chart3D.getDefaultAxisY().setTitle('CDP Z');
        chart3D.getDefaultAxisZ().setTitle('CDP Y');

        let ava_list = this.$store.getters.readAvaList;


        let red = new SolidFill({color: ColorHSV(200)});
        const redSeries = chart3D.addPointSeries({pointShape: 'sphere'})
          .setPointStyle((pointStyle) => pointStyle
            .setFillStyle(red)
            .setSize(30));

        const points = [];
        for(let i=0; i<ava_list.length; i++) {
          let m = ava_list[i];
          points.push({x: m["cdp_x"], y: m["cdp_z"], z: m["cdp_y"]});
          redSeries.add(points);
        }
        // console.log(JSON.stringify(points))
        // chart3D.setAutoCursor((cursor) => cursor
        //           .setResultTableAutoTextStyle(true)
        //           .disposeTickMarkerX()
        //           .setTickMarkerXAutoTextStyle(false)
        //           .setTickMarkerYAutoTextStyle(false)
        // )
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

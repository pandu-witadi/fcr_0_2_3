<template>
  <div>
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <div :id="chartId"></div>
  </div>
</template>

<script>
  import {
    ColorRGBA,
    lightningChart,
    SolidFill,
  } from '@arction/lcjs'
  import {mapState} from "vuex";
  import {EventBus} from 'MyLibVue/src/libs/eventbus';

  export default {
    name: "Test3DScatterView",

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
        showLoader : false,
        retStatus: {status: 0, title: "", message: "", data: []},
        points: [],

        event_http_list :{success:"successList", fail:"failList"},
      }
    },

    methods: {
      getGeobodyInfoData()
      {
        this.showLoader = true;
        let file_id = this.$route.query.file_id;
        let geobody_id = this.$route.query.geobody_id;

        let param = {
          file_id: file_id,
          geobody_id: geobody_id
        };
        // let param = {
        //   file_id: "5f70dacf6180bd82dd6637a3",
        //   geobody_id: "220852"
        // };
        this.$store.dispatch('http_post', ["/api/geobody/point-list", param, this.event_http_list]).then();
      },

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
        redSeries.add(this.points);
      }
    },
    mounted()
    {
      EventBus.$on(this.event_http_list.success, (msg) => {
        this.points = [];
        let z0 = msg[0]["z"];
        console.log(z0)
        for(let i=0; i<msg.length; i++)
        {

          // if(i<msg.length-1)
          //   this.points.push({x: msg[i]["x"], y: msg[i]["y"], z: z0});
          // else
          //   this.points.push({x: msg[i]["x"], y: msg[i]["y"], z: z0+0.01});
            this.points.push({x: msg[i]["x"], y: msg[i]["y"], z: msg[i]["z"]});
        }
        // console.log(JSON.stringify(this.points))
        this.createChart();
        this.showLoader = false;

      });
      EventBus.$on(this.event_http_list.fail, (msg) => {
        this.showLoader = false;
        // this.table_datas = [];
        this.retStatus = msg;
        // this.$refs.dialogMessage.showModal();
      });
    },

    beforeMount()
    {
      this.chartId = Math.trunc(Math.random() * 1000000);
      this.getGeobodyInfoData();
    },

    beforeDestroy()
    {
      this.chart.dispose()
      EventBus.$off(this.event_http_list.success);
      EventBus.$off(this.event_http_list.fail);
    },
  }
</script>

<style scoped>

</style>

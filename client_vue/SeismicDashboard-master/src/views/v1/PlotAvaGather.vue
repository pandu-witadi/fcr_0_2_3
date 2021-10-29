<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>
    <ApexChartLine class="lc_seismic_chart" :chart-options="avaPlotOptions" :series="avaPlotSeries"/>

    <b-card no-body class="mt-2 mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        Compare Gather
      </b-card-header>
      <InputGatherByILXLZ/>
      <InputGatherByILXLZ/>
      <InputGatherByILXLZ/>
    </b-card>

    <!-- show error dialog -->
    <vue-simple-dialog
      ref="dialogMessage"
      type="danger"
      :header="retStatus.title" body="Body"
      btn1_text="Close"
      btn1_style="success"
      @btn1Click="dialogMessageBtn1Click()">
              <span slot="slot-body">
                <h5>{{retStatus.mesg}}</h5>
              </span>
    </vue-simple-dialog>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {mapState} from "vuex";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import ApexChartLine from "../components/ApexChartLine";
  import {apexChartSimpleProperties} from "../../libs/defApexChartLine";
  import InputGatherByILXLZ from "../myview/InputGatherByILXLZ";
  export default {
    name: "PlotAvaGather",
    components: {
      InputGatherByILXLZ,
      VueSimpleDialog,
      ApexChartLine},
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
      user: state => state.user,
    }),
    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data() {
      return {
        proc_completed: false,
        showLoader: false,
        retStatus: {status: 0, title: "Info", mesg: "", data: []},

        pageParam: {
          id_area: -1,
          filename: ""
        },
        proc_plot_ava: false,
        avaPlotSeries: [],
        avaPlotOptions: apexChartSimpleProperties(),

        event_http_ava_plot: {success: "successListAvaPlot", fail: "failListAvaPlot"},
      }
    },
    beforeMount: function () {
      this.pageParam["id_area"] = this.$route.query.id_area*1;
      this.pageParam["filename"] = this.$route.query.filename;
      this.plotAvaChart();
    },
    methods: {
      dialogMessageBtn1Click() {
        this.$refs.dialogMessage.hideModal();
      },
      plotAvaChart()
      {
        this.proc_plot_ava = false;

        let param = {
          // user: this.user["user"],
          data: this.pageParam
        };
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("ava-segy-view-gather"), param, this.event_http_ava_plot]).then();
      },
    },
    mounted() {
      //-------------- LIST AVA PLOT -------------------
      EventBus.$on(this.event_http_ava_plot.success, (msg) => {
        let ndata = msg["data"].length;
        if (ndata <= 0) {
          this.retStatus["mesg"] = msg["mesg"];
          this.$refs.dialogMessage.showModal();
          this.showLoader = false;
          return;
        }

        this.avaPlotSeries = [];
        for (let i = 0; i < msg["data"].length; i++) {
          let m = msg["data"][i];
          let line_title = "IL-" + m["iline"] + "/XL-" + m["xline"] + "(Z=" + m["z"].toFixed(2) + ")";
          this.avaPlotSeries.push({
            type: 'line',
            name: line_title,
            data: m["ava"]
          });
        }
        this.avaPlotOptions = apexChartSimpleProperties();
        this.avaPlotOptions["xaxis"]["categories"] = msg["data"][0]["header"];
        this.avaPlotOptions["legend"]["position"] = "bottom";
        this.avaPlotOptions["markers"] = 4;

        this.proc_plot_ava = true;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_ava_plot.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.proc_plot_ava = false;
        this.$refs.dialogMessage.showModal();
      });
    },
    beforeDestroy() {
      EventBus.$off(this.event_http_ava_plot.success);
      EventBus.$off(this.event_http_ava_plot.fail);
    }
  }
</script>

<style scoped>
  .lc_seismic_chart {
    width: 99%;
    height: 60vh;
  }
</style>

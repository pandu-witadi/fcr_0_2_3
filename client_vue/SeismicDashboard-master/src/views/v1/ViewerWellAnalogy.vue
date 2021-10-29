<template>
  <div class="panel-body">
  <vue-element-loading
    :spinner="spinLoader.spinner"
    :color="spinLoader.color"
    :background-color="spinLoader.background_color"
    :size="spinLoader.size"
    :active="showLoader"/>
  <ApexChartLine class="lc_seismic_chart" :chart-options="apexChartOptions"
                 :series="apexChartSeries"/>

  <!-- show error dialog -->
  <vue-simple-dialog
    ref="dialogMessage"
    type="warning"
    :header="retStatus.title" body="Body"
    btn1_text="Close"
    btn1_style="success"
    @btn1Click="dialogMessageBtn1Click()">
              <span slot="slot-body">
                <h5>{{retStatus.message}}</h5>
              </span>
  </vue-simple-dialog>
</div>
</template>

<script>
  import Vue from 'vue';
  import {mapState} from "vuex";
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {appDemoMode} from "../../_constant/http_api";
  import {readProspectData} from "../../_constant/active_user";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import ApexChartLine from "../components/ApexChartLine";
  import {apexChartSimpleProperties} from "../../libs/defApexChartLine";

  export default {
    name: "ViewerWellAnalogy",
    components: {
      VueSimpleDialog,
      ApexChartLine
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
      user: state => state.user,
    }),

    data: () => {
      return {
        bdemo: appDemoMode(),
        retStatus: {status: 0, title: "", message: "", data: []},
        showLoader: false,

        table_wa: [],
        pageParam: {
          id: "",
        },
        objParam: {},
        apexChartSeries: [],
        apexChartOptions: apexChartSimpleProperties(),
        event_http_wa_data: {success: "successWaData", fail: "failWaData"},
      }
    },

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },

    beforeMount: function () {
      this.pageParam["id"] = this.$route.query.id;
      this.objParam = readProspectData(this.pageParam["id"]);

      this.httpGetListWellAnalogyData();
    },

    methods: {
      dialogMessageBtn1Click() {
        this.$refs.dialogMessage.hideModal();
      },
      httpGetListWellAnalogyData() {
        let param = {
          // user: this.user["user"],
          data: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"]
          }
        };

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("wa-data"), param,
          this.event_http_wa_data]).then();
      },
    },
    mounted() {
      //-----------------------------------------------------------------
      // Well Analogy Data
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_wa_data.success, (msg) => {
        this.apexChartSeries = [];
        for (let i = 0; i < msg["data"].length; i++) {
          let m = msg["data"][i];
          let line_title = m["label"];//"IL-" + m["iline"] + "/XL-" + m["xline"] + "(Z=" + m["z"].toFixed(2) + ")";
          this.apexChartSeries.push({
            type: 'line',
            name: line_title,
            data: m["value"]
          });
        }
        this.apexChartOptions = apexChartSimpleProperties();
        this.apexChartOptions["xaxis"]["categories"] = msg["data"][0]["header"];
        this.apexChartOptions["legend"]["position"] = "bottom";
        this.apexChartOptions["markers"] = 4;
        this.apexChartOptions["title"] =
          {
            text: this.objParam["filename"] + " ( Area=" + this.objParam["id_area"] + " )"
          };

        this.showLoader = false;
      });
      EventBus.$on(this.event_http_wa_data.fail, (msg) => {
        this.showLoader = false;
        this.table_wa = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },
    beforeDestroy() {
      EventBus.$off(this.event_http_wa_data.success);
      EventBus.$off(this.event_http_wa_data.fail);
    }
  }
</script>

<style scoped>
  .lc_seismic_chart {
    width: 100%;
    height: 82vh;
  }
</style>

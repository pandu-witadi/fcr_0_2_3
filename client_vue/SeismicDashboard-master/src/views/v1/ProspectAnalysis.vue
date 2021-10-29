<template>
  <div>
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

      <div class="container-fluid pt-2 pb-2" style="background-color: white">
        <table>
          <tr>
            <td style="width: 100px">User</td>
            <td>:</td>
            <td><b>{{prospectAnalysis.userId}}</b></td>
          </tr>
          <tr>
            <td>Name</td>
            <td>:</td>
            <td><b>{{prospectAnalysis.name}}</b></td>
          </tr>
          <tr>
            <td>Layer</td>
            <td>:</td>
            <td><b>{{prospectAnalysis.layer}}</b></td>
          </tr>
          <tr>
            <td>Group</td>
            <td>:</td>
            <td><b>{{prospectAnalysis.group}}</b></td>
          </tr>
          <tr>
            <td>Filename</td>
            <td>:</td>
            <td><b>{{prospectAnalysis.filename}}</b></td>
          </tr>
          <tr>
            <td>Score</td>
            <td>:</td>
            <td><b>{{prospectAnalysis.score}}</b></td>
          </tr>
          <tr>
            <td>Area</td>
            <td>:</td>
            <td><b>{{prospectAnalysis.area}}</b></td>
          </tr>
        </table>
      </div>
      <b-tabs pills card vertical>
        <b-tab title="Probability" active><b-card-text>
          <ViewAnalysisInput :param="prospectAnalysis.dmp.analysis.probability" />
        </b-card-text></b-tab>
        <b-tab title="Substack"><b-card-text>
          <ViewAnalysisInput :param="prospectAnalysis.dmp.analysis.substack"/>
        </b-card-text></b-tab>
        <b-tab title="AVA"><b-card-text>
          <ViewAnalysisInput :param="prospectAnalysis.dmp.analysis.AVA"/>
        </b-card-text></b-tab>
        <b-tab title="Sweetness"><b-card-text>
          <ViewAnalysisInput :param="prospectAnalysis.dmp.analysis.sweetness"/>
        </b-card-text></b-tab>
        <b-tab title="Well Analogy"><b-card-text>
          <ViewAnalysisInput :param="prospectAnalysis.dmp.analysis.well_analogy"/>
        </b-card-text></b-tab>
      </b-tabs>
    <div class="container-fluid p-2 text-right" style="background-color: white;">
      <ejs-button cssClass='e-success' v-on:click.native='updateProspectAnalysisValue'>Update</ejs-button>
    </div>

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
  import {ButtonPlugin} from '@syncfusion/ej2-vue-buttons';
  Vue.use(ButtonPlugin);

  import {mapState} from "vuex";
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import StarRating from 'MyLibVue/src/views/star-rating/star-rating'
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {appDemoMode} from "../../_constant/http_api";
  import {readProspectData} from "../../_constant/active_user";
  import {createProspectAnalysisDemoData} from "../../libs/demo_data";
  import ViewAnalysisInput from "../myview/ViewAnalysisInput";

  export default {
    name: "ProspectAnalysis",
    components: {
      ViewAnalysisInput,
      VueSimpleDialog,
      StarRating,
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

        pageParam: {
          id: "",
        },
        objParam: {},
        prospectAnalysis: {
          dmp: {
            analysis: {
            }
          }
        },

        event_http_prospect_analysis: {success: "successProspectAnalysis", fail: "failProspectAnalysis"},
        event_http_prospect_update_star: {success: "successProspectUpdateStar", fail: "failProspectUpdateStar"},
      }
    },
    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    beforeMount: function () {
      this.pageParam["id"] = this.$route.query.id;
      this.objParam = readProspectData(this.pageParam["id"]);

      if(this.bdemo)
      {
        this.prospectAnalysis = createProspectAnalysisDemoData();
      }
      else
      {
        this.httpGetProspectAnalysisData();
      }
    },
    methods: {
      dialogMessageBtn1Click() {
        this.$refs.dialogMessage.hideModal();
      },
      httpGetProspectAnalysisData() {
        let param = {
          // user: this.user["user"],
          data: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"]
          }
        };

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("prospect-analysis"), param, this.event_http_prospect_analysis]).then();
      },
      updateProspectAnalysisValue()
      {
        let param = {
          user: this.user["user"],
          data: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"],
            analysis: this.prospectAnalysis["dmp"]["analysis"]
          }
        };

        // console.log(JSON.stringify(this.prospectAnalysis))
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("prospect-update-star"), param, this.event_http_prospect_update_star]).then();
      }
    },
    mounted() {
      EventBus.$on(this.event_http_prospect_analysis.success, (msg) => {
        this.prospectAnalysis = msg.data;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_prospect_analysis.fail, (msg) => {
        this.prospectAnalysis = {};
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http_prospect_update_star.success, (msg) => {
        this.prospectAnalysis = msg.data;
        this.showLoader = false;
        this.retStatus["title"] = "Information";
        this.retStatus["message"] = msg.mesg;
        this.$refs.dialogMessage.showModal();
      });
      EventBus.$on(this.event_http_prospect_update_star.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },
    beforeDestroy() {
      EventBus.$off(this.event_http_prospect_analysis.success);
      EventBus.$off(this.event_http_prospect_analysis.fail);
      EventBus.$off(this.event_http_prospect_update_star.success);
      EventBus.$off(this.event_http_prospect_update_star.fail);

    }
  }
</script>

<style scoped>

</style>

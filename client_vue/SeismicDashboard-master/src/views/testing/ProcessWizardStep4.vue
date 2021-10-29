<template>
<div>
  <vue-element-loading
    :spinner="spinLoader.spinner"
    :color="spinLoader.color"
    :background-color="spinLoader.background_color"
    :size="spinLoader.size"
    :active="showLoader"/>

  <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="3" :textsize="190" class="mb-3"/>

  <splitpanes class="default-theme" vertical style="height: 70vh" @resized="splitResizedEvent('resized', $event)">
    <pane class="p-2" min-size="20" max-size="80" style="background: ghostwhite">
      <b-row class="my-1">
        <b-col sm="5">
          <label>{{getTextLabel(0)}}</label>
        </b-col>
        <b-col sm="3">
          <b-form-input size="sm" v-model="cdpz1"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="5">
          <label>{{getTextLabel(1)}}</label>
        </b-col>
        <b-col sm="3">
          <b-form-input size="sm" v-model="cdpz2"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="5">
          <label>{{getTextLabel(2)}}</label>
        </b-col>
        <b-col sm="3">
          <b-form-input size="sm" v-model="cdpz3"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="5">
          <label>{{getTextLabel(3)}}</label>
        </b-col>
        <b-col sm="3">
          <b-form-input size="sm" v-model="cdpz4"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="5">
          <label>{{getTextLabel(4)}}</label>
        </b-col>
        <b-col sm="3">
          <b-form-input size="sm" v-model="cdpz5"></b-form-input>
        </b-col>
      </b-row>
      <b-btn class="btn btn-md mr-1" variant="success" @click="httpViewListAva()">View AVA List</b-btn>
    </pane>
    <pane class="pl-2 pt-2 pb-2 pr-0">
      <div class="col p-0" style="height: 100%; width: 100%">
        <template v-if="apexSeries.length>0">
          <ApexChartLine class="style_chart_proc" :chartOptions="apexChartOptions" :series="apexSeries" :resizeevent="resizeevent"/>
        </template>
      </div>
    </pane>
  </splitpanes>
  <view-bottom-wizard-button class="mt-2" index="3" :left_clicked="wizardButtonClicked('processwizard3')" :right_clicked="wizardButtonClicked('processwizard5')"/>

  <!-- show error dialog -->
  <vue-simple-dialog
    ref="dialogMessage"
    type="danger"
    :header="retStatus.title" body="Body"
    btn1_text="Tutup"
    btn1_style="success"
    @btn1Click="dialogMessageBtn1Click()">
              <span slot="slot-body">
                <h5>{{retStatus.message}}</h5>
              </span>
  </vue-simple-dialog>
</div>
</template>

<script>
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import ViewProcessWizardButton from "../components/viewProcessWizardButton";
  import ViewBottomWizardButton from "../components/viewBottomWizardButton";
  import {mapState} from "vuex";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {createTabProcessIcon, createTabProcessText} from "../../libs/libSeismicUi";
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import ApexChartLine from "../components/ApexChartLine";
  import {createDefaultColor, createDefaultMarker, createDefaultParam} from "../../libs/defApexChartLine";

  export default {
    name: "ProcessWizardStep4",

    components: {
      VueSimpleDialog,
      ViewProcessWizardButton,
      ViewBottomWizardButton,
      Splitpanes, Pane,
      ApexChartLine
    },
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
        showLoader: false,
        resizeevent: false,
        retStatus: {status: 0, title: "", message: "", data: []},

        apexChartOptions: {},
        apexSeries: [],
        demo_data: [
          {
            "segy_file_id": "5f72c6e01dc8fb197cdc5e19",
            "label": "gth",
            "iline": 8835,
            "xline": 2609,
            "cdp_z": 411.252
          },
          {
            "segy_file_id": "5f72c6e01dc8fb197cdc5e19",
            "label": "gth",
            "iline": 8847,
            "xline": 2613,
            "cdp_z": 411.252
          },
          {
            "segy_file_id": "5f72c6e01dc8fb197cdc5e19",
            "label": "gth",
            "iline": 8855,
            "xline": 2645,
            "cdp_z": 414.440
          },
          {
            "segy_file_id": "5f72c6e01dc8fb197cdc5e19",
            "label": "TN-Ix72",
            "iline": 6215,
            "xline": 2205,
            "cdp_z": 411.252
          },
          {
            "segy_file_id": "5f72c6e01dc8fb197cdc5e19",
            "label": "TN-Ix75",
            "iline": 6215,
            "xline": 2205,
            "cdp_z": 411.252
          }
        ],
        cdpz1: 0.0,
        cdpz2: 0.0,
        cdpz3: 0.0,
        cdpz4: 0.0,
        cdpz5: 0.0,

        event_http_view_list_ava: {success: "successViewListAva", fail: "failViewListAva"},
      }
    },

    beforeMount: function ()
    {
      this.cdpz1 = this.demo_data[0]["cdp_z"];
      this.cdpz2 = this.demo_data[1]["cdp_z"];
      this.cdpz3 = this.demo_data[2]["cdp_z"];
      this.cdpz4 = this.demo_data[3]["cdp_z"];
      this.cdpz5 = this.demo_data[4]["cdp_z"];
      // this.httpViewListAva();
    },

    methods: {
      getTextLabel(ii)
      {
        let m = this.demo_data[ii];
        return(m["label"] + " IL[" + m["iline"] + "]/XL[" + m["xline"] + "], CDP-Z :");
      },
      //MESSAGE HTTP I/O
      dialogMessageBtn1Click() {
        if (this.retStatus.status === -1) { //error http
          //this.$router.push({path: this.varRouter.getRoute("login", 0)}); //goto login page
          this.$refs.dialogMessage.hideModal();
        } else { //error token
          this.$refs.dialogMessage.hideModal();
        }
      },
      splitResizedEvent(strinfo, event)
      {
        this.resizeevent = !this.resizeevent;
        this.parseViewListAva();
      },
      getTabIcon()
      {
        return (createTabProcessIcon())
      },
      getTabText()
      {
        return (createTabProcessText())
      },
      wizardButtonClicked(str_router)
      {
        return (this.varRouter.getRoute(str_router, 1))
      },

      httpViewListAva()
      {
        this.showLoader = true;
        this.demo_data[0]["cdp_z"] = this.cdpz1 * 1.0;
        this.demo_data[1]["cdp_z"] = this.cdpz2 * 1.0;
        this.demo_data[2]["cdp_z"] = this.cdpz3 * 1.0;
        this.demo_data[3]["cdp_z"] = this.cdpz4 * 1.0;
        this.demo_data[4]["cdp_z"] = this.cdpz5 * 1.0;
        this.$store.dispatch('http_post', ["/api/segy/view-list-ava", this.demo_data, this.event_http_view_list_ava]).then();
      },

      parseViewListAva()
      {
        this.apexChartOptions = createDefaultParam();
      }
    },

    mounted()
    {
      EventBus.$on(this.event_http_view_list_ava.success, (msg) =>
      {
        this.apexSeries = [];
        for(let i=0; i<msg.length; i++)
        {
          this.apexSeries.push({
            type: 'line',
            name: msg[i]["label"] + "-" + msg[i]["iline"] + "/" + msg[i]["xline"] + " (" + msg[i]["cdp_z"] + ")",
            data: msg[i]["ava"]
          });
        }
        this.parseViewListAva();

        this.apexChartOptions["xaxis"]["categories"] = msg[0]["header"];
        this.apexChartOptions["markers"] = 0;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_view_list_ava.fail, (msg) => {
        this.apexSeries = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
        this.showLoader = false;
      });
    },
    beforeDestroy()
    {
      EventBus.$off(this.event_http_view_list_ava.success);
      EventBus.$off(this.event_http_view_list_ava.fail);
      this.showLoader = false;
    },
  }
</script>

<style scoped>
  .style_chart_proc {
    height: 68vh;
  }
</style>

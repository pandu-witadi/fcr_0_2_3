<template>
  <div>
    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="3" :textsize="190" class="mb-3"/>
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <div><span class="mr-2" style="color: #0d47a1"><strong>Probability <i
              class="fa fa-hand-o-right"></i></strong>
            </span> Area : <strong>{{cur_area.area}}</strong>, Geobody : <strong>{{cur_area.geobody_name}}
              ({{cur_area.geobody_id}})</strong> , Class
              : {{cur_area.cls}}
            </div>
          </div>

          <splitpanes class="default-theme" vertical style="height: 60vh" vertical>
            <pane class="p-2" min-size="20" max-size="80" style="background: ghostwhite">
              <div>
                <!--            <b-row>-->
                <!--              <b-col md="5">-->
                <!--                <b-form-group label-cols="5" label-size="md" label="SEGY File">-->
                <!--                  <b-form-select v-model="cur_segy" :options="list_segy"></b-form-select>-->
                <!--                </b-form-group>-->
                <!--              </b-col>-->
                <!--            </b-row>-->
                <b-row>
                  <!--                  <b-col md="5">-->
                  <!--                    <b-form-group label-cols="5" label-size="md" label="Radius">-->
                  <!--                      <b-form-input size="md" v-model="radius"></b-form-input>-->
                  <!--                    </b-form-group>-->
                  <!--                  </b-col>-->
                  <b-col md="6">
                    <b-btn class="btn btn-md mr-1" variant="success" @click="openAvaDialog()">AVA List</b-btn>
                    <b-btn class="btn btn-md mr-1" variant="warning" @click="httpPlotAva()">Plot AVA</b-btn>
                    <b-btn class="btn btn-md" variant="primary" @click="openProbabilityDialog()">Probability</b-btn>
                  </b-col>
                </b-row>
                <b-row class="text-right">
                  <b-col md="5">
                    <!--                    <b-btn class="btn btn-md" variant="success" @click="getListFindAVA()">Find AVA</b-btn>-->
                  </b-col>
                </b-row>
              </div>
              <!-- -------------------------------------------- -->
              <!-- TABLE -->
              <!-- -------------------------------------------- -->
              <!-- table header -->
              <div class="group-header">
                <b-row>
                  <b-col md="3" class="my-1">
                    <b-form-checkbox
                      id="checkbox-1"
                      v-model="bCheckAll"
                      name="checkbox-1"
                      @change="selectAllChecked()">
                      Check All
                    </b-form-checkbox>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <strong>Total : {{ndata}}</strong>
                  </b-col>
                  <b-col md="6" class="my-1">
                    <b-form-group label-cols-lg="4" label-cols-md="3" label-cols-sm="6" class="mb-0">
                      <b-input-group prepend="Filter : ">
                        <b-form-input v-model="filter" placeholder="Search"/>
                        <b-input-group-append>
                          <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
              </div>

              <!-- table contents -->
              <b-table
                show-empty
                sticky-header="53vh"
                :small="true"
                :striped="true"
                :bordered="true"
                :outlined="true"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                @filtered="onFiltered"
                :fields="table_headers"
                :items="table_datas">

                <template v-slot:cell(check)="row">
                    <input type="checkbox" v-model="row.item.check" @click="updateSelectedRow(row.item)"/>
                </template>

                <template v-slot:cell(cdp_x)="row">
                  {{row.item.cdp_x.toFixed(3)}}
                </template>
                <template v-slot:cell(cdp_y)="row">
                  {{row.item.cdp_y.toFixed(3)}}
                </template>
                <template v-slot:cell(cdp_z)="row">
                  {{row.item.cdp_z.toFixed(3)}}
                </template>
                <template v-slot:cell(prob)="row">
                  {{parseProbabilityNumber(row.item.prob)}}
                </template>

                <!-- action status -->
                <template v-slot:cell(action)="row">
                  <b-link :href="openDataUrl(row.item)" @click="openData(row.item)">Open</b-link>
                </template>
              </b-table>

              <!-- table footer -->
              <b-row>
                <b-col md="8" class="my-1">
                  <b-pagination :total-rows="computeTotalRow()" :per-page="perPage" v-model="currentPage" class="my-0"/>
                </b-col>
                <b-col md="4" class="my-1">
                  <b-input-group prepend="Per Page : ">
                    <b-form-select :options="pageOptions" v-model="perPageView" v-on:change="showPerPage"/>
                  </b-input-group>
                </b-col>
              </b-row>
            </pane>
            <pane class="pl-2 pt-2 pb-2 pr-0">
              <b-card no-body>
                <b-tabs card>
                  <b-tab title="Plot AVA" active>
                    <template v-slot:title>
                      <i class="fa fa-file-image-o"/> Plot AVA
                    </template>
                    <template v-if="proc_plot_ava">
                      <ApexChartLine class="lc_seismic_chart" :chart-options="avaPlotOptions" :series="avaPlotSeries"/>
                    </template>
                  </b-tab>

                  <b-tab title="Probability Map">
                    <template v-slot:title>
                      <i class="fa fa-image"/> Probability Map
                    </template>
                    <template v-if="proc_completed">
                      <ApexChartLine class="lc_seismic_chart" :chartOptions="probMapOptions" :series="probMapSeries"/>
                    </template>
                  </b-tab>
                  <b-tab title="Probability Distribution">
                    <template v-slot:title>
                      <i class="fa fa-bar-chart"/> Probability Distribution
                    </template>
                    <template v-if="proc_completed">
                      <ApexChartLine class="lc_seismic_chart" :chartOptions="avgProbOptions" :series="avgProbSeries"/>
                    </template>
                  </b-tab>
                  <b-tab title="Cumulative Distribution">
                    <template v-slot:title>
                      <i class="fa fa-line-chart"/> Cumulative Distribution
                    </template>
                    <template v-if="proc_completed">
                      <ApexChartLine class="lc_seismic_chart" :chartOptions="ecdfOptions" :series="ecdfSeries"/>
                    </template>
                  </b-tab>
                </b-tabs>
              </b-card>
            </pane>
          </splitpanes>
        </b-card>
      </b-col>
    </b-row>
    <view-bottom-wizard-button class="mt-0" index="2" :left_clicked="wizardButtonClicked('processwizard2-1')"
                               :right_clicked="wizardButtonClicked('processwizard4')"/>

    <vue-form-dialog
      ref="avaDialog"
      type="default"
      header="Parameters" body="Body"
      btn1_text="Close" btn2_text="Process"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="avaDialogBtn1Click()" @btn2Click="avaDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="schema_sgy_pick" :model="model_sgy_pick" :options="formOptions"
                                  @validated="onValidated"/>
            </span>
    </vue-form-dialog>

    <vue-form-dialog
      ref="probabilityDialog"
      type="default"
      header="Parameters" body="Body"
      btn1_text="Close" btn2_text="Process"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="probabilityDialogBtn1Click()" @btn2Click="probabilityDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="schema" :model="model" :options="formOptions" @validated="onValidated"/>
            </span>
    </vue-form-dialog>

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
  import {
    createTableProbabilityHeader,
  } from "../../libs/libVars";
  import {createTabProcessIcon, createTabProcessText} from "../../libs/libSeismicUi";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'

  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";
  import {
    apexChartSimpleProperties, createAvgProbChartOptions,
    createEcdfChartOptions, createProbMapParam
  } from "../../libs/defApexChartLine";
  import ApexChartLine from "../components/ApexChartLine";
  import {colormapDensity, colormapSpectral} from "../../libs/var_colormaps";
  import {getColormapColorv2} from "../../libs/simpleLib";

  export default {
    name: "ProcessWizardStep3_3",

    components: {
      ViewProcessWizardButton,
      ViewBottomWizardButton,
      VueSimpleDialog,
      Splitpanes, Pane,
      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,
      ApexChartLine
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data() {
      return {
        proc_completed: false,
        proc_plot_ava: false,
        showLoader: false,
        bCheckAll: false,
        retStatus: {status: 0, title: "", message: "", data: []},
        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,
        ndata: 0,

        table_headers: createTableProbabilityHeader(),
        table_datas: [],
        cur_segy_ml: {},
        list_segy_ml: [],
        cur_area: {},
        selected_check_ava: [],

        avgProbOptions: {},
        avgProbSeries: [],
        avg_prob: {
          "width": 0.00795710024670182,
          "x": [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.30, 0.35, 0.4, 0.45, 0.5, 0.55, 0.60, 0.65, 0.70, 0.75, 0.8, 0.85, 0.9, 0.95],
          "y": [0, 0,    0,   0,    0,   0,    0,    0,    0,   0,    1,   2,    1,    10,   5,    4,    2,   0,    0,   0]
        },
        ecdfOptions: {},
        ecdfSeries: [],
        ECDF: {
          "x": [0.51, 0.58, 0.59, 0.62, 0.65, 0.66, 0.66, 0.66, 0.67, 0.67, 0.67, 0.68, 0.69, 0.69, 0.71, 0.71, 0.71, 0.73, 0.74, 0.76, 0.78, 0.79, 0.79, 0.81, 0.83],
          "y": [0.04, 0.08, 0.12, 0.16, 0.2, 0.24, 0.28, 0.32, 0.36, 0.4, 0.44, 0.48, 0.52, 0.56, 0.6, 0.64, 0.68, 0.72, 0.76, 0.8, 0.84, 0.88, 0.92, 0.96, 1.0]
        },

        probMapOptions: {},
        probMapSeries: [],
        prob_map: {
          "x": [7527.0, 7527.0, 7531.0, 7531.0, 7531.0, 7531.0, 7531.0, 7531.0, 7535.0, 7535.0, 7535.0, 7535.0, 7535.0, 7539.0, 7539.0, 7539.0, 7539.0,
            7539.0, 7543.0, 7543.0, 7543.0, 7543.0, 7547.0, 7551.0, 7555.0, 7555.0, 7559.0, 7559.0, 7559.0, 7559.0, 7559.0, 7563.0, 7563.0, 7563.0,
            7563.0, 7563.0, 7563.0, 7567.0, 7567.0, 7567.0],
          "y": [2209.0, 2213.0, 2209.0, 2213.0, 2217.0, 2225.0, 2225.0, 2229.0, 2205.0, 2209.0, 2213.0, 2225.0, 2229.0, 2201.0, 2205.0, 2209.0,
            2213.0, 2217.0, 2201.0, 2205.0, 2209.0, 2213.0, 2209.0, 2285.0, 2285.0, 2289.0, 2249.0, 2253.0, 2285.0, 2289.0, 2293.0,2237.0,
            2241.0, 2249.0, 2285.0, 2285.0, 2289.0, 2237.0, 2241.0, 2285.0],
          "z": [0.7219, 0.7634, 0.7713, 0.5943, 0.5945, 0.6830, 0.6464, 0.6339, 0.7547, 0.7423, 0.7642, 0.6200, 0.6300, 0.6611, 0.7711, 0.7321,
            0.7553, 0.7229, 0.7933, 0.6864, 0.7319, 0.5947, 0.5930, 0.6356, 0.6772, 0.6532, 0.6635, 0.7063, 0.6297, 0.5633, 0.8233, 0.7047,
            0.7056, 0.6373, 0.7779, 0.7681, 0.6771, 0.6421, 0.7523, 0.7950]
        },

        avaPlotSeries: [],
        avaPlotOptions: {},

        model_sgy_pick: {
          segy_gather_file_id: "",
          segy_substack_file_id: "",
          radius: 25,
          vertical_window: 30.0
        },
        schema_sgy_pick: {
          fields: [
            {
              type: 'select',
              label: 'Select Gather File',
              model: 'segy_gather_file_id',
              selectOptions: {hideNoneSelectedText: true}
            },
            {
              type: 'select',
              label: 'Select SubStack File',
              model: 'segy_substack_file_id',
              selectOptions: {hideNoneSelectedText: true}
            },
            {
              type: 'input',
              inputType: 'number',
              label: 'Radius',
              model: 'radius',
              placeholder: 'Set Radius',
              featured: true,
              required: true
            },
            {
              type: 'input',
              inputType: 'number',
              label: 'Vertical Window',
              model: 'vertical_window',
              placeholder: 'Set Vertical Window',
              featured: true,
              required: true
            },
          ]
        },

        model: {
          file_id: "",
        },
        schema: {
          fields: [
            {
              type: 'select',
              label: 'Select File',
              model: 'file_id',
              selectOptions: {hideNoneSelectedText: true}
            },
          ]
        },
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_list_sgy: {success: "successListSgy", fail: "failListSgy"},
        event_http_list_mlpick: {success: "successListML", fail: "failListML"},
        event_http_list_ava: {success: "successListAva", fail: "failListAva"},
        event_http_list_prob: {success: "successListProb", fail: "failListProb"},
        event_http_ava_plot: {success: "successListAvaPlot", fail: "failListAvaPlot"},
      }
    },

    beforeMount: function () {
      this.getListSegy();
    },

    methods: {
      updateSelectedRow(m) {
      },

      parseProbabilityNumber(v) {
        if (v === undefined)
          return ("");
        else
          return (v.toFixed(6));
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

      selectAllChecked() {
        for (let i = 0; i < this.table_datas.length; i++)
          this.table_datas[i]["check"] = !this.bCheckAll;
      },
      httpPlotAva() {
        this.proc_plot_ava = false;

        let param = [
          {"segy_file_id": "5f9429011b384324bf882091", "label": "gth", "iline": 8835, "xline": 2609, "cdp_z": 411.252},
          {"segy_file_id": "5f9429011b384324bf882091", "label": "gth", "iline": 8847, "xline": 2613, "cdp_z": 411.252},
          {"segy_file_id": "5f9429011b384324bf882091", "label": "gth", "iline": 8855, "xline": 2645, "cdp_z": 414.440}
        ];
        param = [];
        for (let i = 0; i < this.table_datas.length; i++) {
          if (this.table_datas[i]["check"] === true)
            param.push(this.table_datas[i])
        }

        if (param.length === 0) {
          this.retStatus = {status: 0, title: "Information", message: "Please Select data from table ...", data: []};
          this.$refs.dialogMessage.showModal();
          return;
        }
        if (param.length > 10) {
          this.retStatus = {status: 0, title: "Information", message: "Maximum selected data 10", data: []};
          this.$refs.dialogMessage.showModal();
          return;
        }

        this.showLoader = true;
        this.selected_check_ava = param;
        this.$store.dispatch('http_post', ["/api/segy/view-list-ava", param, this.event_http_ava_plot]).then();
      },

      //------------------------- ava dialog ----------------------------
      openAvaDialog() {
        this.$refs.avaDialog.showModal();
      },
      avaDialogBtn1Click() {
        this.$refs.avaDialog.hideModal();
      },
      avaDialogBtn2Click() {
        if (!this.bvalidate) return;
        if (this.model_sgy_pick["segy_gather_file_id"] === "")
          return;
        if (this.model_sgy_pick["segy_substack_file_id"] === "")
          return;

        this.proc_completed = false;
        this.showLoader = true;
        let param = {
          geobody_file_id: this.cur_area["geobody_file_id"],
          geobody_id: this.cur_area["geobody_id"],
          segy_gather_file_id: this.model_sgy_pick["segy_gather_file_id"],
          segy_substack_file_id: this.model_sgy_pick["segy_substack_file_id"],
          radius: this.model_sgy_pick["radius"],
          vertical_window: this.model_sgy_pick["vertical_window"]
        };
        this.$store.dispatch('http_post', ["/api/geobody/find-ava-data", param, this.event_http_list_ava]).then();

        this.$refs.avaDialog.hideModal();
      },

      //------------------------- probability dialog ----------------------------
      openProbabilityDialog() {

        // // create colormap
        // let density_colormap = colormapSpectral();
        //
        // this.avgProbSeries = [];
        // this.avgProbOptions = createAvgProbChartOptions();
        // this.avgProbOptions["title"]["text"] = "Probability Distributions";
        // this.avgProbOptions["xaxis"]["categories"] = this.avg_prob["x"].map(function(e){return e.toFixed(2).toString()});
        // this.avgProbSeries.push({data: this.avg_prob["y"]});
        // let prob_map_color = [];
        // for(let i=0; i<this.avg_prob["x"].length; i++) {
        //   prob_map_color.push(getColormapColorv2(density_colormap, this.avg_prob["x"][i], false));
        // }
        // this.avgProbOptions["colors"] = prob_map_color;
        //
        // this.ecdfSeries = [];
        // this.ecdfOptions = createEcdfChartOptions();
        // this.ecdfOptions["title"]["text"] = "Cumulative Distributions";
        // this.ecdfOptions["xaxis"]["title"]["text"] = "Probability";
        // this.ecdfOptions["yaxis"]["title"]["text"] = "ECDF";
        // let tmp = [];
        // let tmp_line = [];
        // let nx = this.ECDF["x"].length;
        //
        // tmp_line.push([this.ECDF["x"][0], 0.0]); //add first point
        // for(let i=0; i<nx; i++) {
        //   tmp.push([this.ECDF["x"][i], this.ECDF["y"][i]]);
        //
        //   if( (i>0) )
        //     tmp_line.push([this.ECDF["x"][i], this.ECDF["y"][i-1]]);
        //   tmp_line.push([this.ECDF["x"][i], this.ECDF["y"][i]]);
        // }
        // tmp_line.push([this.ECDF["x"][nx-1]+0.02, this.ECDF["y"][nx-1]]); //add last point
        //
        // this.ecdfSeries.push({type: 'scatter', name:'chart1', data: tmp});
        // this.ecdfSeries.push({type: 'line', name:'chart2', data: tmp_line});
        //
        // // probability map
        // this.probMapSeries = [];
        // let prob_map = this.prob_map;
        // this.probMapOptions = createProbMapParam();
        // this.probMapOptions["title"]["text"] = "Gas Probability Map";
        // this.probMapOptions["xaxis"]["title"]["text"] = "iline";
        // this.probMapOptions["yaxis"]["title"]["text"] = "xline";
        // let n_prob_map = prob_map["x"].length;
        // let probability_map_color = [];
        // for(let i=0; i<n_prob_map; i++) {
        //   probability_map_color.push(getColormapColorv2(density_colormap, prob_map["z"][i], false));
        //   this.probMapSeries.push({
        //     type: 'scatter', name: prob_map["z"][i].toFixed(2).toString(), data: [[prob_map["x"][i], prob_map["y"][i]]]
        //   });
        // }
        // this.probMapOptions["colors"] = probability_map_color;
        // this.proc_completed = true;

        this.$refs.probabilityDialog.showModal();
      },
      probabilityDialogBtn1Click() {
        this.$refs.probabilityDialog.hideModal();
      },
      probabilityDialogBtn2Click() {
        if (!this.bvalidate) return;
        if (this.model["file_id"] === "")
          return;

        this.proc_completed = false;
        this.showLoader = true;

        let tmp_table_datas = [];
        for(let i=0; i<this.table_datas.length; i++)
        {
          let m = this.table_datas[i];
          delete m["check"];
          tmp_table_datas.push(m);
        }
        let param = {
          geobody_file_id: this.cur_area["geobody_file_id"],
          geobody_id: this.cur_area["geobody_id"],
          segy_file_id: this.model["file_id"],
          // radius: this.radius,
          data: tmp_table_datas
        };

        // console.log(JSON.stringify(param))
        this.$store.dispatch('http_post', ["/api/geobody/calc-prob", param, this.event_http_list_prob]).then();

        this.$refs.probabilityDialog.hideModal();
      },
      //------------------------- end of probability dialog ----------------------------

      openData(item) {
        // this.$router.push({
        //   path: "process-wizard3",
        //   query: {geobody_file_id:item["file_id"]["$oid"], geobody_id: item["geobody_id"]}
        // });
      },
      openDataUrl(item) {
        return ("");
        // return("#/process-wizard3?geobody_file_id=" + item["file_id"]["$oid"] + "&geobody_id=" + item["geobody_id"]);
      },

      getListSegy() {
        this.cur_area = this.$store.getters.readSelectedArea;
        this.cur_area["geobody_file_id"] = this.$route.query.geobody_file_id;
        this.cur_area["geobody_id"] = this.$route.query.geobody_id;
        this.cur_area["cls"] = this.$route.query.cls;
        this.showLoader = true;
        this.$store.dispatch('http_get', ["/api/segy/file-list", {}, this.event_http_list_sgy]).then();
        // this.getMLPickFile();
      },
      getMLPickFile() {
        this.showLoader = true;
        this.$store.dispatch('http_get', ["/api/mlpick/file-list", {}, this.event_http_list_mlpick]).then();
      },

      getTabIcon() {
        return (createTabProcessIcon())
      },
      getTabText() {
        let tab_text = createTabProcessText();
        tab_text[2] = "Probability List";
        return (tab_text)
      },

      //-----------------------------------------------------
      //TABLE VIEWER
      //-----------------------------------------------------
      showPerPage(selected_per_page) {
        if (selected_per_page === "All" || selected_per_page === "Semua")
          this.perPage = this.table_datas.length;
        else
          this.perPage = selected_per_page;
        this.perPageView = selected_per_page;
      },
      computeTotalRow() {
        try {
          return (this.table_datas.length);
        } catch (e) {
          return (0);
        }
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },

      onValidated(isValid, errors) {
        this.bvalidate = isValid;
      },

      wizardButtonClicked(str_router) {
        return (this.varRouter.getRoute(str_router, 1))
      }
    },
    mounted() {
      //-------------- LIST SGY -------------------
      EventBus.$on(this.event_http_list_sgy.success, (msg) => {
        this.list_segy_pick = [];
        for (let i = 0; i < msg.length; i++)
          this.list_segy_pick.push({id: msg[i]["_id"]["$oid"], name: msg[i]["label_name"]});
        // console.log(JSON.stringify(this.list_segy_pick))

        this.schema_sgy_pick.fields[0].values = this.list_segy_pick;
        this.schema_sgy_pick.fields[1].values = this.list_segy_pick;
        this.getMLPickFile();
      });
      EventBus.$on(this.event_http_list_sgy.fail, (msg) => {
        this.showLoader = false;
        this.table_datas = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-------------- LIST ML Pick -------------------
      EventBus.$on(this.event_http_list_mlpick.success, (msg) => {
        this.list_segy_ml = [];
        for (let i = 0; i < msg.length; i++)
          this.list_segy_ml.push({id: msg[i]["_id"]["$oid"], name: msg[i]["file_name"]});
        this.schema.fields[0].values = this.list_segy_ml;
        this.showLoader = false;
      });

      EventBus.$on(this.event_http_list_mlpick.fail, (msg) => {
        this.list_segy_ml = [];
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-------------- LIST AVA -------------------
      EventBus.$on(this.event_http_list_ava.success, (msg) => {
        this.table_datas = msg["gather"];
        this.ndata = this.table_datas.length;

        let segy_file_id = this.model_sgy_pick["segy_gather_file_id"];
        for (let i = 0; i < this.table_datas.length; i++) {
          this.table_datas[i]["segy_file_id"] = segy_file_id;
          this.table_datas[i]["label"] = "gth";
        }

        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list_ava.fail, (msg) => {
        this.showLoader = false;
        this.table_datas = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-------------- LIST AVA PLOT -------------------
      EventBus.$on(this.event_http_ava_plot.success, (msg) => {
        // this.table_datas = msg;
        // this.ndata = this.table_datas.length;
        this.avaPlotSeries = [];
        for (let i = 0; i < msg.length; i++) {
          let m = msg[i];
          let line_title = m["label"] + "-" + m["iline"] + "/" + m["xline"] + "(" + m["cdp_z"] + ")";
          this.avaPlotSeries.push({
            type: 'line',
            name: line_title,
            data: m["ava"]
          });
        }
        // this.avaPlotOptions = createDefaultParam();
        this.avaPlotOptions = apexChartSimpleProperties();
        // this.avaPlotOptions["title"]["text"] = this.lineChartTitle;
        this.avaPlotOptions["xaxis"]["categories"] = msg[0]["header"];
        // this.avaPlotOptions["xaxis"]["title"]["text"] = this.XAxis["label"];
        // this.avaPlotOptions["yaxis"]["title"]["text"] = "Amplitude";
        // this.avaPlotOptions["colors"] = createDefaultColor(t1, t2 + 1, [pp, t2 + 1]);
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

      //-------------- LIST PROB -------------------
      EventBus.$on(this.event_http_list_prob.success, (msg) => {
        this.table_datas = msg["data"];

        for (let i=0; i<this.selected_check_ava.length; i++)
        {
          let iline_ = this.selected_check_ava[i]["iline"];
          let xline_ = this.selected_check_ava[i]["xline"];
          for(let j=0; j<this.table_datas.length; j++)
          {
            let iline1_ = this.table_datas[j]["iline"];
            let xline1_ = this.table_datas[j]["xline"];

            if( (iline_ === iline1_) && (xline_ === xline1_))
            {
              this.table_datas[j]["check"] = true;
              break;
            }
          }
        }

        // create colormap
        let density_colormap = colormapSpectral();

        //average probability
        let avg_prob = msg["avg_prob"];
        this.avgProbSeries = [];
        this.avgProbOptions = createAvgProbChartOptions();
        this.avgProbOptions["title"]["text"] = "Probability Distributions";
        this.avgProbOptions["xaxis"]["categories"] = avg_prob["x"].map(function (e) {
          return e.toFixed(2).toString()
        });
        this.avgProbSeries.push({data: avg_prob["y"]});
        let prob_map_color = [];
        for(let i=0; i<this.avg_prob["x"].length; i++) {
          prob_map_color.push(getColormapColorv2(density_colormap, this.avg_prob["x"][i], false));
        }
        this.avgProbOptions["colors"] = prob_map_color;

        //ecdf
        let ecdf_ = msg["ECDF"];
        this.ecdfSeries = [];
        this.ecdfOptions = createEcdfChartOptions();
        this.ecdfOptions["title"]["text"] = "Cumulative Distributions";
        this.ecdfOptions["xaxis"]["title"]["text"] = "Probability";
        this.ecdfOptions["yaxis"]["title"]["text"] = "ECDF";
        let tmp = [];
        let tmp_line = [];
        let nx = ecdf_["x"].length;

        tmp_line.push([ecdf_["x"][0], 0.0]); //add first point
        for(let i=0; i<nx; i++) {
          tmp.push([ecdf_["x"][i], ecdf_["y"][i]]);

          if( (i>0) )
            tmp_line.push([ecdf_["x"][i], ecdf_["y"][i-1]]);
          tmp_line.push([ecdf_["x"][i], ecdf_["y"][i]]);
        }
        tmp_line.push([ecdf_["x"][nx-1]+0.02, ecdf_["y"][nx-1]]); //add last point

        this.ecdfSeries.push({type: 'scatter', name:'chart1', data: tmp});
        this.ecdfSeries.push({type: 'line', name:'chart2', data: tmp_line});

        // prob map series
        this.probMapSeries = [];
        let prob_map = msg["prob_map"];
        this.probMapOptions = createProbMapParam();
        this.probMapOptions["title"]["text"] = "Gas Probability Map";
        this.probMapOptions["xaxis"]["title"]["text"] = "iline";
        this.probMapOptions["yaxis"]["title"]["text"] = "xline";
        let n_prob_map = prob_map["x"].length;
        let probability_map_color = [];
        for(let i=0; i<n_prob_map; i++) {
          probability_map_color.push(getColormapColorv2(density_colormap, prob_map["z"][i], false));
          this.probMapSeries.push({
            type: 'scatter', name: prob_map["z"][i].toFixed(2).toString(), data: [[prob_map["x"][i], prob_map["y"][i]]]
          });
        }
        this.probMapOptions["colors"] = probability_map_color;

        this.ndata = this.table_datas.length;
        this.proc_completed = true;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list_prob.fail, (msg) => {
        this.showLoader = false;
        this.proc_completed = false;
        this.avgProbSeries = [];
        this.ecdfSeries = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_list_sgy.success);
      EventBus.$off(this.event_http_list_sgy.fail);
      EventBus.$off(this.event_http_list_mlpick.success);
      EventBus.$off(this.event_http_list_mlpick.fail);
      EventBus.$off(this.event_http_list_ava.success);
      EventBus.$off(this.event_http_list_ava.fail);
      EventBus.$off(this.event_http_list_prob.success);
      EventBus.$off(this.event_http_list_prob.fail);
      EventBus.$off(this.event_http_ava_plot.success);
      EventBus.$off(this.event_http_ava_plot.fail);
      this.showLoader = false;
    },
  }
</script>

<style scoped>
  .lc_seismic_chart {
    width: 100%;
    height: 50vh;
  }
</style>

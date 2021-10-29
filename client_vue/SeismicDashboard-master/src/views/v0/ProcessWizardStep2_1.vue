<template>
  <div>
    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="tabIndex" :textsize="190"
                                class="mb-3"/>

    <Overlay :opened="opened" :visible="visible" @closed="overlayClosed()">
      <div>
        <b-button-toolbar aria-label="Toolbar with button groups and input groups" class="mb-1">
          <b-btn class="mr-2" variant="primary" @click="refreshMultiSeismicChart()"><i class="fa fa-refresh"></i>
            Refresh
          </b-btn>
          <b-dropdown size="sm" class="mr-0">
            <template slot="button-content" class="pr-1" size="sm">
              <img class="colormapImageDropdown" :src="fgetColormapAsset(colormap.id)" size="sm"/><span
              class="pl-1">{{fgetColormapName(colormap.id)}}</span>
            </template>

            <b-dropdown-item @click="setColormap(0)" size="sm">
              <img class="colormapImageDropdown" :src="fgetColormapAsset(0)"/> {{fgetColormapName(0)}}
            </b-dropdown-item>
            <b-dropdown-item @click="setColormap(1)" size="sm">
              <img class="colormapImageDropdown" :src="fgetColormapAsset(1)"/> {{fgetColormapName(1)}}
            </b-dropdown-item>
            <b-dropdown-item @click="setColormap(2)" size="sm">
              <img class="colormapImageDropdown" :src="fgetColormapAsset(2)"/> {{fgetColormapName(2)}}
            </b-dropdown-item>
            <b-dropdown-item @click="setColormap(3)" size="sm">
              <img class="colormapImageDropdown" :src="fgetColormapAsset(3)"/> {{fgetColormapName(3)}}
            </b-dropdown-item>
            <b-dropdown-item @click="setColormap(4)" size="sm">
              <img class="colormapImageDropdown" :src="fgetColormapAsset(4)"/> {{fgetColormapName(4)}}
            </b-dropdown-item>
            <b-dropdown-item @click="setColormap(5)" size="sm">
              <img class="colormapImageDropdown" :src="fgetColormapAsset(5)"/> {{fgetColormapName(5)}}
            </b-dropdown-item>
          </b-dropdown>
          <!--        <b-form-checkbox v-model="reverseColormap" class="mr-1">Rev</b-form-checkbox>-->
          <!--          <enhanced-check label="Rev" style="height: 20px;" v-model="reverseColormap" class="mr-2"></enhanced-check>-->

          <b-input-group size="sm" style="background: #343a40" class="pl-1 pr-2">
            <b-input-group-prepend class="mr-1">
              <span style="color: white">Min ({{cmin}})</span>
            </b-input-group-prepend>
            <b-form-slider style="height:20px;" v-model="tmp_cmin" @slide-stop="slideStopMin" :min="0"
                           :max="99"></b-form-slider>
          </b-input-group>
          <b-input-group size="sm" style="background: #343a40" class="pl-1 pr-2">
            <b-input-group-prepend class="mr-1">
              <span style="color: white">Max ({{cmax}})</span>
            </b-input-group-prepend>
            <b-form-slider style="height:20px;" v-model="tmp_cmax" @slide-stop="slideStopMax" :min="0"
                           :max="99"></b-form-slider>
          </b-input-group>
        </b-button-toolbar>
      </div>

      <template v-if="bdraw===true">
        <b-container fluid>
          <b-row>
            <template v-for="i in parseInt(npic)">
              <b-col>
                <LChartSeismic class="lc_seismic_view" :colormap="colormap" :points="getSeismicDataPoints(i-1)"
                               :xaxis="getSeismicDataX(i-1)" :yaxis="getSeismicDataY(i-1)" :cmin="cmin" :cmax="cmax"
                               :title="getSeismicTitle(i-1)"></LChartSeismic>
              </b-col>
            </template>
          </b-row>
        </b-container>
      </template>
    </Overlay>

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
            </span>
              Area : <strong>{{cur_area.name}}</strong>
              <template v-if="pageMode===0">
                &nbsp;&nbsp;&rarr;&nbsp;&nbsp;Geobody ID : <strong>{{cur_geobody.geobody_id}}</strong>
              </template>
            </div>
          </div>
          <div>
            <b-row>
              <b-col md="12">
                <template v-if="pageMode===0">
                  <b-btn class="btn btn-md mr-1" variant="success" @click="openAvaDialog()">1. AVA Geobody</b-btn>
                </template>
                <template v-else>
                  <b-btn class="btn btn-md mr-1" variant="success" @click="openAvaDialog()">1. AVA xyz</b-btn>
                </template>

                <b-dropdown right variant="warning" text="2. AVA" :disabled="ndata===0">
                  <b-dropdown-item @click="openAvaPlotDialog()">2. Plot AVA</b-dropdown-item>
                  <b-dropdown-item @click="openAva3dChart()">AVA 3D Chart</b-dropdown-item>
                  <b-dropdown-item @click="openGatherPlotDialog()">Gather View</b-dropdown-item>
                </b-dropdown>

                <!--                <b-btn class="btn btn-md mr-1" variant="warning" @click="openAvaPlotDialog()">Plot AVA</b-btn>-->
                <!--                <b-btn class="btn btn-md mr-1" variant="warning" @click="openAva3dChart()">AVA 3D Chart</b-btn>-->
                <b-btn class="btn btn-md ml-5 mr-1" variant="primary" @click="openProbDialog()" :disabled="proc_plot_ava!==true">3. Calculate Prob
                </b-btn>
<!--                <template v-if="ndata_prob>0">-->
                <b-btn class="btn btn-md" variant="warning" @click="openAva3dProbChart('prob')" :disabled="ndata_prob===0">4. Prob 3D Chart
                </b-btn>
<!--                </template>-->
                <!--                <b-dropdown right variant="warning" text="Prob 3D Chart">-->
                <!--                  <b-dropdown-item @click="openAva3dProbChart('prob1')">Prob 1</b-dropdown-item>-->
                <!--                  <b-dropdown-item @click="openAva3dProbChart('prob2')">Prob 2</b-dropdown-item>-->
                <!--                  <b-dropdown-item @click="openAva3dProbChart('cal_prob')">Calc. Prob</b-dropdown-item>-->
                <!--                </b-dropdown>-->
              </b-col>
            </b-row>
            <b-row class="text-right">
              <b-col md="5">
                <!--                    <b-btn class="btn btn-md" variant="success" @click="getListFindAVA()">Find AVA</b-btn>-->
              </b-col>
            </b-row>
          </div>
          <b-tabs class="mt-1">
            <b-tab title="AVA" pills card>
              <!-- -------------------------------------------- -->
              <!-- TABLE AVA -->
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
                :items="table_ava">

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
                <template v-slot:cell(prob1)="row">
                  {{parseProbabilityNumber(row.item.prob1)}}
                </template>
                <template v-slot:cell(prob2)="row">
                  {{parseProbabilityNumber(row.item.prob2)}}
                </template>
                <template v-slot:cell(cal_prob)="row">
                  {{parseProbabilityNumber(row.item.cal_prob)}}
                </template>

                <!-- action status -->
                <template v-slot:cell(action)="row">
                  <b-link @click="openGatherData(row.item)">Gather</b-link>
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
            </b-tab>

            <template v-if="proc_plot_ava===true">
              <b-tab title="Plot AVA">
                <template v-slot:title>
                  <i class="fa fa-file-image-o"/> Plot AVA
                </template>
                <template v-if="proc_plot_ava">
                  <ApexChartLine class="lc_seismic_chart" :chart-options="avaPlotOptions" :series="avaPlotSeries"/>
                </template>
              </b-tab>
            </template>

            <template v-if="ndata_prob>0">
              <b-tab title="Probability" pills card>
                <!-- -------------------------------------------- -->
                <!-- TABLE PROBABILITY -->
                <!-- -------------------------------------------- -->
                <!-- table header -->
                <div class="group-header">
                  <b-row>
                    <b-col md="3" class="my-1">
                      <b-form-checkbox
                        id="checkbox-2"
                        v-model="bCheckAllProb"
                        name="checkbox-2"
                        @change="selectAllCheckedProb()">
                        Check All
                      </b-form-checkbox>
                    </b-col>
                    <b-col md="3" class="my-1">
                      <strong>Total : {{ndata_prob}}</strong>
                    </b-col>
                    <b-col md="6" class="my-1">
                      <b-form-group label-cols-lg="4" label-cols-md="3" label-cols-sm="6" class="mb-0">
                        <b-input-group prepend="Filter : ">
                          <b-form-input v-model="filterProb" placeholder="Search"/>
                          <b-input-group-append>
                            <b-btn :disabled="!filterProb" @click="filterProb = ''">Clear</b-btn>
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
                  :current-page="currentPageProb"
                  :per-page="perPageProb"
                  :filter="filterProb"
                  @filtered="onFilteredProb"
                  :fields="table_headers_prob"
                  :items="table_prob">

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
                  <template v-slot:cell(prob1)="row">
                    {{parseProbabilityNumber(row.item.prob1)}}
                  </template>
                  <template v-slot:cell(prob2)="row">
                    {{parseProbabilityNumber(row.item.prob2)}}
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
                    <b-pagination :total-rows="computeTotalRowProb()" :per-page="perPageProb" v-model="currentPageProb"
                                  class="my-0"/>
                  </b-col>
                  <b-col md="4" class="my-1">
                    <b-input-group prepend="Per Page : ">
                      <b-form-select :options="pageOptions" v-model="perPageViewProb" v-on:change="showPerPageProb"/>
                    </b-input-group>
                  </b-col>
                </b-row>
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
            </template>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>

    <template v-if="pageMode===0">
      <view-bottom-wizard-button class="mt-0" index="1" :left_clicked="wizardButtonClicked('processwizard2-0')"
                                 :right_clicked="wizardButtonClicked('processwizard3')"/>
    </template>
    <template v-else>
      <view-bottom-wizard-button class="mt-0" index="1" :left_clicked="wizardButtonClicked('processwizard1')"
                                 :right_clicked="wizardButtonClicked('processwizard3')"/>
    </template>

    <vue-form-dialog
      ref="avaDialog"
      type="default"
      header="Parameters" body="Body"
      btn1_text="Close" btn2_text="Process"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="avaDialogBtn1Click()" @btn2Click="avaDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="schema_ava" :model="model_ava" :options="formOptions"
                                  @validated="onValidated"/>
        <template v-if="pageMode === 1">
          <template v-if="model_ava.type!=='ilxl'">
          <vue-leaflet-single-marker-map :map_var="map_var" :marker="marker"
                                         @updateMarkerPosition="updateMarkerPosition" style="height: 300px"/>
                        </template>
        </template>
      </span>
    </vue-form-dialog>

    <vue-form-dialog
      ref="probDialog"
      type="default"
      header="Parameters" body="Body"
      btn1_text="Close" btn2_text="Process"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="probDialogBtn1Click()" @btn2Click="probDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="prob_schema" :model="prob_model" :options="formOptions"
                                  @validated="onValidated"/>
            </span>
    </vue-form-dialog>

    <vue-form-dialog
      ref="avaPlotDialog"
      type="default"
      header="Parameters" body="Body"
      btn1_text="Close" btn2_text="Process"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="avaPlotDialogBtn1Click()" @btn2Click="avaPlotDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="ava_plot_schema" :model="ava_plot_model" :options="formOptions"
                                  @validated="onValidated"/>
            </span>
    </vue-form-dialog>

    <vue-form-dialog
      ref="gatherPlotDialog"
      type="default"
      header="Parameters" body="Body"
      btn1_text="Close" btn2_text="Process"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="gatherPlotDialogBtn1Click()" @btn2Click="gatherPlotDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="ava_plot_schema" :model="ava_plot_model" :options="formOptions"
                                  @validated="onValidated"/>
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
                <h5>{{retStatus.mesg}}</h5>
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
    createAvaPointModel, createAvaPointSchema,
    createAvaGeobodyModel, createAvaGeobodySchema,
    createTableAvaHeaderV0,
    createTableProbHeaderV0, createProbModel, createProbSchema, createAvaPlotSchema, createAvaPlotModel
  } from "../../libs/libVars";
  import {createTabProcessIconV0, createTabProcessTextV0} from "../../libs/libSeismicUi";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import VueLeafletSingleMarkerMap from '../components/vue-leaflet-single-marker-map'

  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";
  import {
    createAreaLeafletDemoData,
    createAvaDemoData,
    createDemoAvaGeobodyParam,
    createDemoAvaPointParam, createDemoProbParam,
    createProbDemoData
  } from "../../libs/demo_data";
  import {appDemoMode} from "../../_constant/http_api";
  import {fillLeafletAreaVariable, getColormapColorv2} from "../../libs/simpleLib";
  import ApexChartLine from "../components/ApexChartLine";
  import {colormapSpectral} from "../../libs/var_colormaps";
  import {
    apexChartSimpleProperties,
    createAvgProbChartOptions,
    createEcdfChartOptions,
    createProbMapParam
  } from "../../libs/defApexChartLine";
  import Overlay from "../components/Overlay";
  import {getColormapAsset, getColormapName} from "../../libs/colormap";
  import EnhancedCheck from 'MyLibVue/src/views/vue-enhancedCheck/EnhancedCheck'
  import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
  import 'bootstrap-slider/dist/css/bootstrap-slider.css';
  import LChartSeismic from "../components/LChartSeismic";
  import {createDemoGather} from "../../libs/data";

  export default {
    name: "ProcessWizardStep2_1",

    components: {
      ViewProcessWizardButton,
      ViewBottomWizardButton,
      VueSimpleDialog,
      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,
      VueLeafletSingleMarkerMap,
      ApexChartLine,
      Overlay,
      EnhancedCheck,
      bFormSlider,
      LChartSeismic
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
        showLoader: false,

        opened: false,
        visible: false,
        bdraw: false,

        npic: 2,
        points: [],
        colormap: {id: 3, reverse: false},
        reverseColormap: false,
        cmin: 20,
        cmax: 20,
        tmp_cmin: 20,
        tmp_cmax: 20,
        XAxis: {},
        YAxis: {},
        dataTitle: "",

        marker: {lat: 0, lng: 0},
        map_var: {},

        pageMode: 0,
        tabIndex: 1,
        cur_area: {},
        cur_geobody: {},
        retStatus: {status: 0, title: "Info", mesg: "", data: []},

        selected_check_ava: [],
        bCheckAll: false,
        perPageView: 10,
        perPage: 10,
        currentPage: 1,
        totalRows: 0,
        filter: null,
        ndata: 0,
        table_headers: createTableAvaHeaderV0(),
        table_ava: [],
        schema_ava: {},
        model_ava: {},

        bCheckAllProb: false,
        perPageViewProb: 10,
        perPageProb: 10,
        currentPageProb: 1,
        totalRowsProb: 0,
        filterProb: null,
        ndata_prob: 0,
        table_headers_prob: createTableProbHeaderV0(),
        table_prob: [],
        prob_model: createProbModel(),
        prob_schema: createProbSchema(),

        ava_plot_model: createAvaPlotModel(),
        ava_plot_schema: createAvaPlotSchema(),

        proc_plot_ava: false,
        avaPlotSeries: [],
        avaPlotOptions: {},

        avgProbOptions: {},
        avgProbSeries: [],

        ecdfOptions: {},
        ecdfSeries: [],

        probMapOptions: {},
        probMapSeries: [],

        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_list_sgy: {success: "successListSgy", fail: "failListSgy"},
        event_http_list_mlmodel: {success: "successListML", fail: "failListML"},
        event_http_list_ava: {success: "successListAva", fail: "failListAva"},
        event_http_list_prob: {success: "successListProb", fail: "failListProb"},
        event_http_ava_plot: {success: "successListAvaPlot", fail: "failListAvaPlot"},
        event_http_view_gather: {success: "successListGatherPlot", fail: "failListGatherPlot"},

      }
    },

    beforeMount: function () {
      this.cur_area = this.$store.getters.readSelectedArea;
      this.map_var = createAreaLeafletDemoData();
      this.map_var = fillLeafletAreaVariable(this.map_var, this.cur_area["coordinate"], 0);
      this.marker = this.map_var["center"];

      this.pageMode = this.$route.query.mode * 1;
      if (this.pageMode === 0) {
        this.tabIndex = 2;
        this.cur_geobody = this.$store.getters.readSelectedGeobody;
      } else this.tabIndex = 1;

      this.initSchemaAndModelData();

      if (appDemoMode() === true) {
        this.table_ava = createAvaDemoData();
        this.parseProbData(createProbDemoData());

        this.$store.dispatch('actionSaveAvaList', this.table_ava); //set selected project
        this.$store.dispatch('actionSaveProbList', this.table_prob); //set selected project

        this.points = createDemoGather();
        this.opened = true;
        this.visible = true;
        this.bdraw = true;
      }
      // else
      this.getListSegy();

    },

    methods: {
      fgetColormapName(ii) {
        return (getColormapName(ii))
      },
      setColormap(ii) {
        this.colormap = {id: ii, reverse: this.reverseColormap};
      },

      fgetColormapAsset(ii) {
        return (getColormapAsset(ii))
      },
      slideStopMin() {
        this.cmin = this.tmp_cmin;
      },
      slideStopMax() {
        this.cmax = this.tmp_cmax;
      },
      overlayClosed() {
        this.bdraw = false;
        this.opened = false;
        this.visible = false;
      },
      refreshMultiSeismicChart() {
        this.setColormap(3);
      },
      getSeismicDataPoints(ii) {
        let sgy_points = [];

        let tmp = this.points[ii]["cdp_data"];
        let ns = tmp[0].length;
        let ntrc = tmp.length;
        for (let i = ns - 1; i >= 0; i--) {
          let tmp0 = [];
          // for (let j = 0; j < ntrc; j++)
          for (let j = ntrc - 1; j >= 0; j--)
            tmp0.push(tmp[j][i]);
          sgy_points.push(tmp0);
        }
        return (sgy_points);
      },
      getSeismicDataX(ii) {
        let xx = this.points[ii]["x"];
        xx["data"] = this.points[ii]["cdp_header"];
        // let xxx = [];
        // for(let i=0; i<this.points[ii]["cdp_header"].length; i++)
        //   xxx.push(i);
        // xx["data"] = xxx;
        return (xx);
      },
      getSeismicDataY(ii) {
        return (this.points[ii]["y"]);
      },
      getSeismicTitle(ii) {
        return (this.points[ii]["title"] + this.points[ii]["cdp_no"]);
      },
      openGatherData() {
        let selected_data = [];
        for (let i = 0; i < this.table_ava.length; i++) {
          if (this.table_ava[i]["check"] === true)
            selected_data.push(this.table_ava[i])
        }

        if (selected_data.length === 0) {
          this.retStatus = {status: 0, title: "Information", mesg: "Please Select data from table ...", data: []};
          this.$refs.dialogMessage.showModal();
          return;
        }

        let param = {
          "data": {
            "id_area": this.cur_area["id_area"],
            "gather_label_name": this.ava_plot_model["label_name"],
            "data": selected_data
          }
        };
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("segy-view-gather"), param, this.event_http_view_gather]).then();
      },
      openGatherPlotDialog() {
        this.$refs.gatherPlotDialog.showModal();
      },
      gatherPlotDialogBtn1Click() {
        this.$refs.gatherPlotDialog.hideModal();
      },
      gatherPlotDialogBtn2Click() {
        this.openGatherData();
        this.$refs.gatherPlotDialog.hideModal();
      },


      updateMarkerPosition(v) {
        this.marker = v;
        this.model_ava["xline"] = this.marker["lng"];
        this.model_ava["iline"] = this.marker["lat"];
      },
      updateSelectedRow(m) {
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
        for (let i = 0; i < this.table_ava.length; i++)
          this.table_ava[i]["check"] = !this.bCheckAll;
      },
      selectAllCheckedProb() {
        for (let i = 0; i < this.table_prob.length; i++)
          this.table_prob[i]["check"] = !this.bCheckAllProb;
      },
      parseProbabilityNumber(v) {
        if (v === undefined)
          return ("");
        else
          return (v.toFixed(6));
      },

      plotAvaChart() {
        this.proc_plot_ava = false;
        let selected_data = [];
        for (let i = 0; i < this.table_ava.length; i++) {
          if (this.table_ava[i]["check"] === true)
            selected_data.push(this.table_ava[i])
        }

        if (selected_data.length === 0) {
          this.retStatus = {status: 0, title: "Information", mesg: "Please Select data from table ...", data: []};
          this.$refs.dialogMessage.showModal();
          return;
        }

        let param = {
          "data": {
            "id_area": this.cur_area["id_area"],
            "gather_label_name": this.ava_plot_model["label_name"],
            "data": selected_data
          }
        };
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("segy-view-list-ava"), param, this.event_http_ava_plot]).then();
      },
      openAva3dChart() {
        window.open('#/ava3dview', '_blank');
      },
      openAva3dProbChart(str_type) {
        window.open('#/prob3dview?type=' + str_type, '_blank');
      },

      initSchemaAndModelData() {
        if (this.pageMode === 0) {
          this.schema_ava = createAvaGeobodySchema();
          this.model_ava = createAvaGeobodyModel();
        } else {
          this.schema_ava = createAvaPointSchema();
          this.model_ava = createAvaPointModel();
          this.model_ava["xline"] = this.marker["lng"];
          this.model_ava["iline"] = this.marker["lat"];
        }
      },
      parseProbData(msg) {
        this.table_prob = msg["data"];

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
        for (let i = 0; i < avg_prob["x"].length; i++) {
          prob_map_color.push(getColormapColorv2(density_colormap, avg_prob["x"][i], false));
        }
        this.avgProbOptions["colors"] = prob_map_color;

        //ecdf
        let ecdf_ = msg["ecdf"];
        this.ecdfSeries = [];
        this.ecdfOptions = createEcdfChartOptions();
        this.ecdfOptions["title"]["text"] = "Cumulative Distributions";
        this.ecdfOptions["xaxis"]["title"]["text"] = "Probability";
        this.ecdfOptions["yaxis"]["title"]["text"] = "ECDF";
        let tmp = [];
        let tmp_line = [];
        let nx = ecdf_["x"].length;

        tmp_line.push([ecdf_["x"][0], 0.0]); //add first point
        for (let i = 0; i < nx; i++) {
          tmp.push([ecdf_["x"][i], ecdf_["y"][i]]);

          if ((i > 0))
            tmp_line.push([ecdf_["x"][i], ecdf_["y"][i - 1]]);
          tmp_line.push([ecdf_["x"][i], ecdf_["y"][i]]);
        }
        tmp_line.push([ecdf_["x"][nx - 1] + 0.02, ecdf_["y"][nx - 1]]); //add last point
        this.ecdfSeries.push({type: 'scatter', name: 'chart1', data: tmp});
        this.ecdfSeries.push({type: 'line', name: 'chart2', data: tmp_line});

        // prob map series
        this.probMapSeries = [];
        let prob_map = msg["prob_map"];
        this.probMapOptions = createProbMapParam();
        this.probMapOptions["title"]["text"] = "Gas Probability Map";
        this.probMapOptions["xaxis"]["title"]["text"] = "iline";
        this.probMapOptions["yaxis"]["title"]["text"] = "xline";
        let n_prob_map = prob_map["x"].length;
        let probability_map_color = [];
        for (let i = 0; i < n_prob_map; i++) {
          probability_map_color.push(getColormapColorv2(density_colormap, prob_map["z"][i], false));
          this.probMapSeries.push({
            type: 'scatter', name: prob_map["z"][i].toFixed(2).toString(), data: [[prob_map["x"][i], prob_map["y"][i]]]
          });
        }
        this.probMapOptions["colors"] = probability_map_color;

        this.proc_completed = true;
      },

      //------------------------- ava dialog ----------------------------
      openAvaDialog() {
        this.$refs.avaDialog.showModal();
      },
      avaDialogBtn1Click() {
        this.$refs.avaDialog.hideModal();
      },
      avaDialogBtn2Click() {
        let param = {};
        if (appDemoMode() === true) {
          if (this.pageMode === 0)
            param = createDemoAvaGeobodyParam();
          else
            param = createDemoAvaPointParam();
        } else {
          if (!this.bvalidate) return;
          if (this.model_ava["gather_file_name"] === "")
            return;
          if (this.model_ava["substack_file_name"] === "")
            return;

          if (this.pageMode === 0)
            param = {
              data: {
                id_area: this.cur_area["id_area"],
                gather_label_name: this.model_ava["gather_file_name"],
                stack_label_name: this.model_ava["substack_file_name"],
                geobody_id: this.cur_geobody["geobody_id"],
                rad_x: this.model_ava["rad_x"],
                rad_y: this.model_ava["rad_y"],
                rad_z: this.model_ava["rad_z"],
              }
            };
          else
            param = {
              data: {
                id_area: this.cur_area["id_area"],
                gather_label_name: this.model_ava["gather_file_name"],
                stack_label_name: this.model_ava["substack_file_name"],
                radius: this.model_ava["radius"],
                type: this.model_ava["type"],
                xline: this.model_ava["xline"],
                iline: this.model_ava["iline"],
                cdp_z: this.model_ava["cdp_z"],
                rad_x: this.model_ava["rad_x"],
                rad_y: this.model_ava["rad_y"],
                rad_z: this.model_ava["rad_z"],
              }
            };
        }
        this.showLoader = true;
        if (this.pageMode === 0)
          this.$store.dispatch('http_post', [this.varRouter.getHttpType("geobody-ava-list"), param, this.event_http_list_ava]).then();
        else
          this.$store.dispatch('http_post', [this.varRouter.getHttpType("point-ava-list"), param, this.event_http_list_ava]).then();

        this.$refs.avaDialog.hideModal();
      },

      openProbDialog() {
        this.$refs.probDialog.showModal();
      },
      probDialogBtn1Click() {
        this.$refs.probDialog.hideModal();
      },
      probDialogBtn2Click() {
        let param = {};
        if (appDemoMode() === true) {
          createDemoProbParam();
        } else {
          if (!this.bvalidate) return;
          if (this.prob_model["label_name"] === "")
            return;

          let tmp_table_datas = [];
          for (let i = 0; i < this.table_ava.length; i++) {
            let m = this.table_ava[i];
            if (("check" in m)) {
              if (m["check"] === true) {
                // delete m["check"];
                tmp_table_datas.push(m);
              }
            }
          }
          param = {
            data: {
              id_area: this.cur_area["id_area"],
              mlmodel_label_name: this.prob_model["label_name"],
              data: tmp_table_datas
            }
          }
        }

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("point-calc-prob"), param, this.event_http_list_prob]).then();

        this.$refs.probDialog.hideModal();
      },

      openAvaPlotDialog() {
        this.$refs.avaPlotDialog.showModal();
      },
      avaPlotDialogBtn1Click() {
        this.$refs.avaPlotDialog.hideModal();
      },
      avaPlotDialogBtn2Click() {
        this.plotAvaChart();
        this.$refs.avaPlotDialog.hideModal();
      },
      openDataUrl(item) {
        return ("");
        // return("#/process-wizard3?geobody_file_id=" + item["file_id"]["$oid"] + "&geobody_id=" + item["geobody_id"]);
      },

      getListSegy() {
        this.showLoader = true;
        let param = {
          data: this.cur_area
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("segy-list"), param, this.event_http_list_sgy]).then();
      },
      getMlModelFile() {
        this.showLoader = true;
        let param = {
          "data": this.cur_area
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("mlmodel-list"), param, this.event_http_list_mlmodel]).then();
      },

      getTabIcon() {
        return (createTabProcessIconV0(this.pageMode))
      },
      getTabText() {
        let tab_text = createTabProcessTextV0(this.pageMode);
        return (tab_text)
      },

      //-----------------------------------------------------
      //TABLE VIEWER
      //-----------------------------------------------------
      showPerPage(selected_per_page) {
        if (selected_per_page === "All" || selected_per_page === "Semua")
          this.perPage = this.table_ava.length;
        else
          this.perPage = selected_per_page;
        this.perPageView = selected_per_page;
      },
      computeTotalRow() {
        try {
          return (this.table_ava.length);
        } catch (e) {
          return (0);
        }
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },

      // --------------------------------
      showPerPageProb(selected_per_page) {
        if (selected_per_page === "All" || selected_per_page === "Semua")
          this.perPageProb = this.table_prob.length;
        else
          this.perPageProb = selected_per_page;
        this.perPageViewProb = selected_per_page;
      },
      computeTotalRowProb() {
        try {
          return (this.table_prob.length);
        } catch (e) {
          return (0);
        }
      },
      onFilteredProb(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRowsProb = filteredItems.length;
        this.currentPageProb = 1;
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
        let list_segy = [];
        for (let i = 0; i < msg["data"].length; i++) {
          list_segy.push({
            value: msg["data"][i]["label_name"],
            text: msg["data"][i]["label_name"],
            id: msg["data"][i]["label_name"],
            name: msg["data"][i]["label_name"]
          });
        }
        this.schema_ava.fields[0].values = list_segy;
        this.schema_ava.fields[1].values = list_segy;
        this.ava_plot_schema.fields[0].values = list_segy;

        let tmp_data_type = [
          {
            id: "ilxl",
            name: "Inline/Xline"
          },
          {
            id: "xyz",
            name: "XYZ"
          },
        ];
        this.schema_ava.fields[2].values = tmp_data_type;
        this.getMlModelFile();
      });
      EventBus.$on(this.event_http_list_sgy.fail, (msg) => {
        this.showLoader = false;
        this.table_ava = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-------------- LIST ML Pick -------------------
      EventBus.$on(this.event_http_list_mlmodel.success, (msg) => {
        let list_mlmodel = [];
        for (let i = 0; i < msg["data"].length; i++) {
          list_mlmodel.push({
            value: msg["data"][i]["label_name"],
            text: msg["data"][i]["label_name"],
            id: msg["data"][i]["label_name"],
            name: msg["data"][i]["label_name"]
          });
        }
        this.prob_schema.fields[0].values = list_mlmodel;
        this.showLoader = false;
      });

      EventBus.$on(this.event_http_list_mlmodel.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-------------- LIST AVA -------------------
      EventBus.$on(this.event_http_list_ava.success, (msg) => {
        this.table_ava = msg["data"];
        this.ndata = this.table_ava.length;
        if (this.ndata <= 0) {
          this.retStatus["mesg"] = msg["mesg"];
          this.$refs.dialogMessage.showModal();
          this.showLoader = false;
          return;
        }

        let segy_file_id = this.model_ava["gather_file_name"];
        for (let i = 0; i < this.table_ava.length; i++) {
          this.table_ava[i]["gather_file_name"] = segy_file_id;
        }

        this.$store.dispatch('actionSaveAvaList', this.table_ava); //set selected project
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list_ava.fail, (msg) => {
        this.showLoader = false;
        this.table_ava = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-------------- LIST PROB -------------------
      EventBus.$on(this.event_http_list_prob.success, (msg) => {
        this.parseProbData(msg["data"]);
        // this.table_prob = msg["data"];
        for (let i = 0; i < this.table_prob.length; i++)
          this.table_prob[i]["check"] = false;

        this.ndata_prob = this.table_prob.length;
        this.$store.dispatch('actionSaveProbList', this.table_prob); //set selected project
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list_prob.fail, (msg) => {
        this.showLoader = false;
        this.table_prob = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

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
          let line_title = m["iline"] + "/" + m["xline"] + "(" + m["cdp_z"].toFixed(2) + ")";
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

      EventBus.$on(this.event_http_view_gather.success, (msg) => {
        this.points = msg["data"];
        this.npic = this.points.length;

        this.showLoader = false;
        this.opened = true;
        this.visible = true;
        this.bdraw = true;
      });
      EventBus.$on(this.event_http_view_gather.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.points = [];
        this.npic = 0;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_list_sgy.success);
      EventBus.$off(this.event_http_list_sgy.fail);
      EventBus.$off(this.event_http_list_mlmodel.success);
      EventBus.$off(this.event_http_list_mlmodel.fail);
      EventBus.$off(this.event_http_list_ava.success);
      EventBus.$off(this.event_http_list_ava.fail);
      EventBus.$off(this.event_http_list_prob.success);
      EventBus.$off(this.event_http_list_prob.fail);
      EventBus.$off(this.event_http_ava_plot.success);
      EventBus.$off(this.event_http_ava_plot.fail);
      EventBus.$off(this.event_http_view_gather.success);
      EventBus.$off(this.event_http_view_gather.fail);

      this.showLoader = false;
    },
  }
</script>

<style scoped>
  .lc_seismic_chart {
    width: 100%;
    height: 50vh;
  }

  .lc_seismic_view {
    height: 80vh;
  }
</style>

<template>
  <div>
<!--    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="tabIndex" :textsize="190"-->
<!--                                class="mb-3"/>-->

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
                &nbsp;&nbsp;&rarr;&nbsp;&nbsp;Geobody ID : <strong>{{cur_geobody.geobody_id}}</strong>
            </div>
          </div>
              <!-- -------------------------------------------- -->
              <!-- TABLE Section -->
              <!-- -------------------------------------------- -->
              <!-- table header -->
              <div class="group-header">
                <b-row>
                  <b-col md="3" class="my-1">
                    <b-btn class="btn btn-md mr-1" variant="success" @click="openGatherData()">Section View</b-btn>
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
                :items="table_data">

                <template v-slot:cell(check)="row">
                  <input type="checkbox" v-model="row.item.check" @click="updateSelectedRow(row.item)"/>
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
        </b-card>
      </b-col>
    </b-row>

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
  import {mapState} from "vuex";
  import {
    createTableGeobodySectionHeaders
  } from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {appDemoMode} from "../../_constant/http_api";
  import {colormapSpectral} from "../../libs/var_colormaps";
  import Overlay from "../components/Overlay";
  import {getColormapAsset, getColormapName} from "../../libs/colormap";
  import EnhancedCheck from 'MyLibVue/src/views/vue-enhancedCheck/EnhancedCheck'
  import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
  import 'bootstrap-slider/dist/css/bootstrap-slider.css';
  import LChartSeismic from "../components/LChartSeismic";
  import {createDemoGather} from "../../libs/data";
  import {createAvaDemoData, createDemoGeobodySectionList} from "../../libs/demo_data";

  export default {
    name: "ProcessWizardStep2_2",

    components: {
      VueSimpleDialog,
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

        cur_area: {},
        cur_geobody: {},
        stack_label_name: "",
        retStatus: {status: 0, title: "Info", mesg: "", data: []},

        perPageView: 10,
        perPage: 10,
        currentPage: 1,
        totalRows: 0,
        filter: null,
        ndata: 0,
        table_headers: createTableGeobodySectionHeaders(),
        table_data: [],

        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_list_sgy: {success: "successListSgy", fail: "failListSgy"},
        event_http_view_gather: {success: "successListGatherPlot", fail: "failListGatherPlot"},

      }
    },

    beforeMount: function () {
      this.cur_area = this.$store.getters.readSelectedArea;
      this.cur_geobody = this.$store.getters.readSelectedGeobody;
      this.stack_label_name = this.$route.query.stack_label_name;
      this.radius = this.$route.query.rad*1;

      if (appDemoMode() === true)
        this.table_data = createDemoGeobodySectionList();
      else {
        let param = {
          data: {
            id_area: this.cur_area["id_area"],
            geobody_id: this.cur_geobody["geobody_id"],
            stack_label_name: this.stack_label_name,
            rad: this.radius
          }
        };

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("geobody-find-section"), param, this.event_http_list_sgy]).then();
      }
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
        for (let i = 0; i < this.table_data.length; i++) {
          let cur_item = this.table_data[i];
          if (cur_item["check"] === true) {
            let tmp;
            if ("iline" in cur_item)
            {
              tmp = {
                iline: cur_item["iline"],
                "type": "iline"
              };
            }
            else
            {
              tmp = {
                xline: cur_item["xline"],
                "type": "xline"
              };
            }
            selected_data.push(tmp);
          }
        }

        if (selected_data.length === 0) {
          this.retStatus = {status: 0, title: "Information", mesg: "Please Select data from table ...", data: []};
          this.$refs.dialogMessage.showModal();
          return;
        }

        let param = {
          "data": {
            "id_area": this.cur_area["id_area"],
            "stack_label_name": this.stack_label_name,
            "data": selected_data
          }
        };
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("segy-view-section"), param, this.event_http_view_gather]).then();
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


      //-----------------------------------------------------
      //TABLE VIEWER
      //-----------------------------------------------------
      showPerPage(selected_per_page) {
        if (selected_per_page === "All" || selected_per_page === "Semua")
          this.perPage = this.table_data.length;
        else
          this.perPage = selected_per_page;
        this.perPageView = selected_per_page;
      },
      computeTotalRow() {
        try {
          return (this.table_data.length);
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
        this.table_data = msg["data"];
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list_sgy.fail, (msg) => {
        this.showLoader = false;
        this.table_data = [];
        this.retStatus = msg;
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

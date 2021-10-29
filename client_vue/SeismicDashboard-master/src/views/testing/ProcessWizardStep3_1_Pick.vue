<template>
  <div>
    <Overlay :opened="opened" :visible="visible" @closed="overlayClosed()">
      <div>
        <b-button-toolbar aria-label="Toolbar with button groups and input groups" class="mb-1">
          <b-btn class="mr-2" variant="primary" @click="refreshMultiSeismicChart()"><i class="fa fa-refresh"></i> Refresh</b-btn>
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
            <b-form-slider style="height:20px;" v-model="tmp_cmin" @slide-stop="slideStopMin" :min="0" :max="99"></b-form-slider>
          </b-input-group>
          <b-input-group size="sm" style="background: #343a40" class="pl-1 pr-2">
            <b-input-group-prepend class="mr-1">
              <span style="color: white">Max ({{cmax}})</span>
            </b-input-group-prepend>
            <b-form-slider style="height:20px;" v-model="tmp_cmax" @slide-stop="slideStopMax" :min="0" :max="99"></b-form-slider>
          </b-input-group>
        </b-button-toolbar>
      </div>

      <template v-if="bdraw===true">
        <b-container fluid>
          <b-row>
            <template v-for="i in parseInt(npic)">
              <b-col>
                <LChartSeismicWithPoint class="lc_seismic_chart"
                                        :chart-key="i-1"
                                        :colormap="colormap" :points="getSeismicDataPoints(i-1)"
                                        :xaxis="getSeismicDataX(i-1)" :yaxis="getSeismicDataY(i-1)" :cmin="cmin" :cmax="cmax"
                                        :title="getSeismicTitle(i-1)" @pointInLcAxis="updateLcPoint($event)"
                                        :chart_info_data="seriesSeismicInfo"/>
              </b-col>
            </template>
          </b-row>
        </b-container>
      </template>
    </Overlay>

    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="3" :textsize="190" class="mb-3"/>
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <!--    <b-alert variant="success" class="p-1" show>Area : <strong>{{cur_area.area}}</strong>, Geobody : <strong>{{cur_area.geobody_name}}</strong></b-alert>-->
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <div><span class="mr-2" style="color: #0d47a1"><strong>SEGY GATHER <i class="fa fa-hand-o-right"></i></strong>
            </span> Area : <strong>{{cur_area.area}}</strong>, Geobody : <strong>{{cur_area.geobody_name}} ({{cur_area.geobody_id}})</strong></div>
          </div>

          <div>
            <b-row>
              <b-col md="5">
                <b-form-group label-cols="5" label-size="md" label="SEGY File">
                  <b-form-select v-model="cur_segy" :options="list_segy"></b-form-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="5">
                <b-form-group label-cols="5" label-size="md" label="Radius">
                  <b-form-input size="md" v-model="radius"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row class="text-right">
              <b-col md="5">
                <b-btn class="btn btn-md" variant="success" @click="getListGather()">Show Gather</b-btn>
              </b-col>
            </b-row>
          </div>
          <!-- -------------------------------------------- -->
          <!-- TABLE -->
          <!-- -------------------------------------------- -->
          <!-- table header -->
          <div class="group-header">
            <b-row>
              <b-col md="2">
                <b-btn variant="primary" @click="eventPlotSeismic()">Plot Seismic</b-btn>
              </b-col>
              <b-col md="4" class="my-1">
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
              <b-form-group>
                <input type="checkbox" v-model="row.item.check" @click="updateSelectedRow(row.item)"/>
              </b-form-group>
            </template>

            <!--            <template v-slot:cell(eucd)="row">-->
            <!--              {{row.item.eucd.toFixed(5)}}-->
            <!--            </template>-->

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

        </b-card>
      </b-col>
    </b-row>
    <view-bottom-wizard-button class="mt-2" index="2" :left_clicked="wizardButtonClicked('processwizard2-1')"
                               :right_clicked="wizardButtonClicked('processwizard4')"/>

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
  import {getData} from "../../libs/data";
  import LChartSeismic from "../components/LChartSeismic";
  import ViewProcessWizardButton from "../components/viewProcessWizardButton";
  import ViewBottomWizardButton from "../components/viewBottomWizardButton";
  import {mapState} from "vuex";
  import {createTableGatherHeader, createTableWellHeader, createTableWellHeaderBySelectedGeobody} from "../../libs/libVars";
  import {createTabProcessIcon, createTabProcessText} from "../../libs/libSeismicUi";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import Overlay from "../components/Overlay";
  import {getColormapAsset, getColormapName} from "../../libs/colormap";
  import EnhancedCheck from 'MyLibVue/src/views/vue-enhancedCheck/EnhancedCheck'
  import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
  import 'bootstrap-slider/dist/css/bootstrap-slider.css'
  import LChartSeismicWithPoint from "../components/LChartSeismicWithPoint";

  export default {
    name: "ProcessWizardStep3_1_Pick",

    components: {
      LChartSeismicWithPoint,
      ViewProcessWizardButton,
      ViewBottomWizardButton,
      LChartSeismic,
      VueSimpleDialog,
      Overlay,
      EnhancedCheck,
      bFormSlider,
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    created()
    {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data()
    {
      return {
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
        seriesSeismicInfo: [],

        ndata: 0,
        cur_area: {},
        showLoader: false,
        retStatus: {status: 0, title: "", message: "", data: []},
        perPageView: 15,
        perPage: 15,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        listSelectedRow: [],
        table_headers: createTableGatherHeader(),
        table_datas: [],
        radius: 0,
        cur_segy: {},
        list_segy: [],

        event_http_list: {success: "successList", fail: "failList"},
        event_http: {success: "success", fail: "fail"},
        event_http_sgy_data: {success: "successSgyData", fail: "failSgyData"},
      }
    },

    beforeMount: function ()
    {
      this.listSelectedRow = [];
      // this.getListSegy();
    },

    methods: {
      updateLcPoint(e)
      {
        if (e.isValid)
        {
          this.seriesSeismicInfo = [{x:e.x, y:e.y}];
        }
      },
      fgetColormapName(ii)
      {
        return (getColormapName(ii))
      },
      setColormap(ii)
      {
        this.colormap = {id: ii, reverse: this.reverseColormap};
      },

      fgetColormapAsset(ii)
      {
        return (getColormapAsset(ii))
      },
      slideStopMin()
      {
        this.cmin = this.tmp_cmin;
      },
      slideStopMax()
      {
        this.cmax = this.tmp_cmax;
      },

      getDemoData()
      {
        let XAxis = {
          "label": "Offset (m)",
          "sampling": 1,
          "start": 0,
        };
        let YAxis = {
          "label": "Depth (m)",
          "sampling": 2,
          "start": 50
        };
        // this.points = [];
        this.npic = 1;
        this.colormap = 1;
        this.points.push({
          x: XAxis,
          y: YAxis,
          title: "tes",
          cdp_no: "-1",
          cdp_header: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
          cdp_data: getData()
        });

        // console.log(this.points.length)
        // let data = [];
        // for (let i = 0; i < this.points[0][0].length; i++)
        //   data.push(i);
        // this.XAxis["data"] = data;
        // this.ns = this.points[0].length;
        // this.dt = this.YAxis["sampling"];
        //
        // this.dataTitle = "CDP NO : 1";
        // this.showLoader = false;
      },

      refreshMultiSeismicChart()
      {
        this.setColormap(3);
      },
      overlayClosed()
      {
        this.bdraw = false;
        this.opened = false;
        this.visible = false;
      },
      eventPlotSeismic()
      {
        this.showLoader = true;
        this.overlayClosed();

        this.getDemoData();
        this.opened = true;
        this.visible = true;
        this.bdraw = true;
        this.showLoader = false;


        // let param = this.listSelectedRow;
        // if(this.listSelectedRow.length===0)
        // {
        //   this.retStatus = {status: 0, title: "Information", message: "Please Select files from table ...", data: []};
        //   this.$refs.dialogMessage.showModal();
        //   return
        // }
        // this.$store.dispatch('http_post', ["/api/segy/view-list-gather", param, this.event_http_sgy_data]).then();
      },
      updateSelectedRow(m)
      {
        if (m.check)
        {
          for (let i = 0; i < this.listSelectedRow.length; i++)
          {
            if ((m["iline"] === this.listSelectedRow[i]["iline"]) & (m["xline"] === this.listSelectedRow[i]["xline"]))
            {
              this.listSelectedRow.splice(i, 1);
              break
            }
          }
        }
        else
          this.listSelectedRow.push(m);
      },
      //MESSAGE HTTP I/O
      dialogMessageBtn1Click()
      {
        if (this.retStatus.status === -1)
        { //error http
          //this.$router.push({path: this.varRouter.getRoute("login", 0)}); //goto login page
          this.$refs.dialogMessage.hideModal();
        }
        else
        { //error token
          this.$refs.dialogMessage.hideModal();
        }
      },
      openData(item)
      {
        // this.$router.push({
        //   path: "process-wizard3",
        //   query: {geobody_file_id:item["file_id"]["$oid"], geobody_id: item["geobody_id"]}
        // });
      },
      openDataUrl(item)
      {
        return ("");
        // return("#/process-wizard3?geobody_file_id=" + item["file_id"]["$oid"] + "&geobody_id=" + item["geobody_id"]);
      },

      getListSegy()
      {
        this.cur_area = this.$store.getters.readSelectedArea;
        this.cur_area["geobody_file_id"] = this.$route.query.geobody_file_id;
        this.cur_area["geobody_id"] = this.$route.query.geobody_id;
        this.showLoader = true;
        this.$store.dispatch('http_get', ["/api/segy/file-list", {}, this.event_http]).then();
      },
      getListGather()
      {
        this.showLoader = true;
        this.listSelectedRow = [];
        let param = {
          geobody_file_id: this.cur_area["geobody_file_id"],
          geobody_id: this.cur_area["geobody_id"],
          segy_file_id: this.cur_segy,
          radius: this.radius
        };
        this.$store.dispatch('http_post', ["/api/geobody/find-gather", param, this.event_http_list]).then();
      },
      getSeismicDataPoints(ii)
      {
        // let sgy_points = [];
        //
        // let tmp = this.points[ii]["cdp_data"];
        // let ns = tmp[0].length;
        // let ntrc = tmp.length;
        // for (let i = ns - 1; i >= 0; i--)
        // {
        //   let tmp0 = [];
        //   for (let j = 0; j < ntrc; j++)
        //     tmp0.push(tmp[j][i]);
        //   sgy_points.push(tmp0);
        // }
        // return(sgy_points);

        return (this.points[ii]["cdp_data"]);
      },
      getSeismicDataX(ii)
      {
        let xx = this.points[ii]["x"];
        xx["data"] = this.points[ii]["cdp_header"];
        return (xx);
      },
      getSeismicDataY(ii)
      {
        return (this.points[ii]["y"]);
      },
      getSeismicTitle(ii)
      {
        return (this.points[ii]["title"] + this.points[ii]["cdp_no"]);
      },

      getTabIcon()
      {
        return (createTabProcessIcon())
      },
      getTabText()
      {
        let tab_text = createTabProcessText();
        tab_text[2] = "Gather List";
        return (tab_text)
      },

      //-----------------------------------------------------
      //TABLE VIEWER
      //-----------------------------------------------------
      showPerPage(selected_per_page)
      {
        if (selected_per_page === "All" || selected_per_page === "Semua")
          this.perPage = this.table_datas.length;
        else
          this.perPage = selected_per_page;
        this.perPageView = selected_per_page;
      },
      computeTotalRow()
      {
        try
        {
          return (this.table_datas.length);
        }
        catch (e)
        {
          return (0);
        }
      },
      onFiltered(filteredItems)
      {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },

      onValidated(isValid, errors)
      {
        this.bvalidate = isValid;
      },

      wizardButtonClicked(str_router)
      {
        return (this.varRouter.getRoute(str_router, 1))
      }
    },
    mounted()
    {
      //-------------- LIST Well -------------------
      EventBus.$on(this.event_http_list.success, (msg) =>
      {
        // console.log(JSON.stringify(msg))
        //fill table contents
        this.table_datas = msg;
        this.ndata = this.table_datas.length;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list.fail, (msg) =>
      {
        this.showLoader = false;
        this.table_datas = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http.success, (msg) =>
      {
        this.list_segy = [];
        for (let i = 0; i < msg.length; i++)
          this.list_segy.push({
            value: msg[i]["_id"]["$oid"],
            text: msg[i]["file_name"]
          });
        this.showLoader = false;
      });

      EventBus.$on(this.event_http.fail, (msg) =>
      {
        this.list_segy = [];
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      // ----------------------- GET LIST OF SEGY DATA FOR PLOTTING----------------------
      EventBus.$on(this.event_http_sgy_data.success, (msg) =>
      {
        this.points = msg;
        this.npic = msg.length;
        this.showLoader = false;
        this.opened = true;
        this.visible = true;
        this.bdraw = true;
      });

      EventBus.$on(this.event_http_sgy_data.fail, (msg) =>
      {
        // this.list_segy = [];
        this.points = [];
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy()
    {
      EventBus.$off(this.event_http_list.success);
      EventBus.$off(this.event_http_list.fail);
      EventBus.$off(this.event_http.success);
      EventBus.$off(this.event_http.fail);
      EventBus.$off(this.event_http_sgy_data.success);
      EventBus.$off(this.event_http_sgy_data.fail);
      this.showLoader = false;
    },

    watch:
      {
        bdraw: function (val)
        {
          // console.log(this.bdraw)
          // this.bdraw = val;
          // this.setColormap(2)
          // console.log(this.bdraw)
        },
        reverseColormap: function (val)
        {
          this.reverseColormap = val;
          this.setColormap(this.colormap["id"]);
        },
      }
  }
</script>

<style scoped>
  .style_chart_proc {
    height: 65vh;
  }

  .lc_seismic_chart {
    height: 80vh;
  }
</style>

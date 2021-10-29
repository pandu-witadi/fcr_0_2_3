<template>
  <div>
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="2" :textsize="190" class="mb-3"/>

    <splitpanes class="default-theme" vertical style="height: 70vh" @resized="splitResizedEvent('resized', $event)">
      <pane class="p-2" min-size="20" max-size="80" style="background: ghostwhite">
        <b-alert variant="success" class="p-1" show>Area : <strong>{{cur_area.area}}</strong>, Geobody : <strong>{{cur_area.geobody_name}}</strong></b-alert>
        <b-row>
          <b-col md="3">
            <b-input-group prepend="x : ">
              <b-form-input v-model="inp_x" placeholder="x coord"/>
            </b-input-group>
          </b-col>
          <b-col md="3">
            <b-input-group prepend="y : ">
              <b-form-input v-model="inp_y" placeholder="y coord"/>
            </b-input-group>
          </b-col>
          <b-col md="3">
            <b-input-group prepend="z : ">
              <b-form-input v-model="inp_z" placeholder="z coord"/>
            </b-input-group>
          </b-col>
          <b-dropdown right text="Select Action">
            <b-dropdown-item>Well</b-dropdown-item>
            <b-dropdown-item>Gather</b-dropdown-item>
            <b-dropdown-item>Section</b-dropdown-item>
            <b-dropdown-item>Probability</b-dropdown-item>
          </b-dropdown>
        </b-row>

        <!-- -------------------------------------------- -->
        <!-- TABLE -->
        <!-- -------------------------------------------- -->
        <!-- table header -->
        <div class="group-header">
          <b-row>
            <b-col md="2" class="my-1">
            </b-col>
            <b-col md="10" class="my-1">
              <b-form-group  label-cols-lg="4" label-cols-md="3" label-cols-sm="6"  class="mb-0">
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
              <input type="checkbox" v-model="row.item.check" @click="plotSelectedRow(row.item)"/>
          </template>

          <template v-slot:cell(action)="row">
              <b-link :href="openDataUrl3(row.item)" @click="openData3(row.item)" class="mr-2">Well</b-link>
              <b-link :href="openDataUrl3_1(row.item)" @click="openData3_1(row.item)" class="mr-2">Gather</b-link>
            <b-link :href="openDataUrl3_2(row.item)" @click="openData3_2(row.item)" class="mr-2">Section</b-link>
            <b-link :href="openDataUrl3_3(row.item)" @click="openData3_3(row.item)">Prob</b-link>
          </template>

          <!-- X -->
          <template v-slot:cell(xcoord)="row">
            <strong>Min : </strong> {{row.item.x_min.toFixed(4)}}<br><strong>Max : </strong> {{row.item.x_max.toFixed(4)}}
          </template>
          <!-- Y -->
          <template v-slot:cell(ycoord)="row">
            <strong>Min : </strong> {{row.item.y_min.toFixed(4)}}<br><strong>Max : </strong> {{row.item.y_max.toFixed(4)}}
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
        <div class="col p-0" style="height: 100%; width: 100%">
          <template v-if="showLoader===false">
            <template v-if="cur_area['view_mode']===0">
              <ApexChartLine class="lc_seismic_chart" :chartOptions="chartWellOptions" :series="chartWellSeries" :resizeevent="resizeevent"/>
            </template>
            <template v-else>
              <ApexChartLine class="lc_seismic_chart" :chartOptions="chartGeobodyOptions" :series="chartGeobodySeries" :resizeevent="resizeevent"/>
            </template>
          </template>
        </div>
      </pane>
    </splitpanes>

    <view-bottom-wizard-button class="mt-2" index="1" :left_clicked="wizardButtonClicked('processwizard2-2')" :right_clicked="wizardButtonClicked('processwizard3')"/>

    <vue-form-dialog
      ref="radiusDialog"
      type="default"
      header="Parameters" body="Body"
      btn1_text="Close" btn2_text="Process"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="radiusDialogBtn1Click()" @btn2Click="radiusDialogBtn2Click()">

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
  import {createTabProcessIcon, createTabProcessText} from '../../libs/libSeismicUi';
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import VueLeafletMap from "../components/vue-leaflet-map"
  import {createTableGeobodyListHeader} from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";
  import {getBoundaryData, getJsonPythonId} from "../../libs/simpleLib";
  import {apexChartSimpleProperties} from "../../libs/defApexChartLine";
  import ApexChartLineWithPointId from "../components/ApexChartLineWithPointId";
  import ApexChartLine from "../components/ApexChartLine";
  import LChartSeries from "../components/LChartSeries"

  export default {
    name: "ProcessWizardStep2",

    components: {
      // VueLeafletHeatmap,
      ViewBottomWizardButton,
      ViewProcessWizardButton,
      Splitpanes, Pane,
      VueSimpleDialog,
      VueLeafletMap,
      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,
      ApexChartLineWithPointId,
      LChartSeries,
      ApexChartLine
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
        showLoader: false,
        retStatus: {status: 0, title: "", message: "", data: []},

        inp_x: 0.0,
        inp_y: 0.0,
        inp_z: 0.0,

        cur_area: {},
        cur_tab: 0,
        center: L.latLng(-6.90389, 107.61861),
        markers: [],
        perPageView: 4,
        perPage: 4,
        pageOptions: [4, 5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        chartWellOptions: {},
        chartWellSeries: [],
        chartGeobodyOptions: {},
        chartGeobodySeries: [],
        chartGeobodyPointSeries: [],
        axis_bound: [],

        table_headers: createTableGeobodyListHeader(),
        table_datas: [],
        table_well: [],

        resizeevent: false,
        model: {
          radius: 0,
        },
        schema: {
          fields: [
            {
              type: 'input',
              inputType: 'text',
              label: 'Radius',
              model: 'radius',
              placeholder: 'Set Radius',
              featured: true,
              required: true
            },
          ]
        },
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_list: {success: "successList", fail: "failList"},
        event_http_list_well: {success: "successListWell", fail: "failListWell"},
        event_http: {success: "success", fail: "fail"},
      }
    },

    beforeMount: function ()
    {
      this.chartGeobodySeries = [];
      this.cur_area = this.$store.getters.readSelectedArea;
      if(this.cur_area["view_mode"] === 0)
        this.getListWell();
      else
      {
        this.table_headers.splice(0, 0, {
          key: 'check',
          label: 'Plot',
          sortable: false,
          thStyle: { width: '50px'}
        });
        this.getListGeobodyData();
      }
    },

    methods: {
      splitResizedEvent(strinfo, event)
      {
        this.resizeevent = !this.resizeevent;
      },

      onValidated(isValid, errors) {
        this.bvalidate = isValid;
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
      //-----------------------------------------------------

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

      plotSelectedRow(m)
      {
        if (m.check)
        {
          for (let i = 1; i < this.chartGeobodySeries.length; i++)
          {
            if (m["geobody_id"] === this.chartGeobodySeries[i]["name"])
            {
              this.chartGeobodySeries.splice(i, 1);
              break
            }
          }
        }
        else
        {
          if(this.cur_area["view_mode"] === 0)
          {}
          else
          {
            this.chartGeobodySeries.push({
              name: m["geobody_id"],
              type: "scatter",
              point_size: 4,
              data: [{x: m["x_min"], y: m["y_min"]}]
            });
          }
        }
      },
      getListGeobodyData()
      {
        this.center = L.latLng(this.cur_area.lat, this.cur_area.lon);

        this.showLoader = true;
        this.$store.dispatch('http_post', ["/api/geobody/info-list", this.cur_area, this.event_http_list]).then();
      },
      getListWell() {
        this.showLoader = true;
        this.$store.dispatch('actionSaveSelectedWell', {}); //set selected project
        // this.$store.dispatch('http_get', ["/api/well/list", {}, this.event_http_list_well]).then();
        let param = {
          "area": getJsonPythonId(this.cur_area)
        };
        // console.log(JSON.stringify(this.cur_area))
        this.$store.dispatch('http_post', ["/api/well/list-in-area", param, this.event_http_list_well]).then();
      },

      createDemoCss(cc)
      {
        return ('<span class="map-marker3" style="background-color:' + cc + '"/>');
      },
      createCustomMarkerPopup(item)
      {
        let sstr = 'Area : <b>' + item.area + '</b><br>';
        sstr = sstr + 'Lat : <b>' + item.lat + '</b><br>';
        sstr = sstr + 'Lon : <b>' + item.lon + '</b>';
        return (sstr);
      },

      openData3(item)
      {
        this.$router.push({
          path: "process-wizard3",
          query: {geobody_file_id:item["geobody_file_id"], geobody_id: item["geobody_id"], cls: item['cls']}
        });
      },
      openDataUrl3(item)
      {
        return("#/process-wizard3?geobody_file_id=" + item["geobody_file_id"] + "&geobody_id=" + item["geobody_id"] + "&cls=" + item["cls"]);
      },

      openData3_1(item)
      {
        this.$router.push({
          path: "process-wizard3-1",
          // path: "process-wizard3-1-pick",
          query: {geobody_file_id:item["geobody_file_id"], geobody_id: item["geobody_id"]}
        });
      },
      openDataUrl3_1(item)
      {
        // return("#/process-wizard3-1-pick?geobody_file_id=" + item["file_id"]["$oid"] + "&geobody_id=" + item["geobody_id"]);
        return("#/process-wizard3-1?geobody_file_id=" + item["geobody_file_id"] + "&geobody_id=" + item["geobody_id"]);
      },
      openData3_2(item)
      {
        this.$router.push({
          path: "process-wizard3-2",
          query: {geobody_file_id:item["geobody_file_id"], geobody_id: item["geobody_id"] , cls: item['cls']}
        });
      },
      openDataUrl3_2(item)
      {
        return("#/process-wizard3-2?geobody_file_id=" + item["geobody_file_id"] + "&geobody_id=" + item["geobody_id"] + "&cls=" + item["cls"]);
      },
      openData3_3(item)
      {
        this.$router.push({
          path: "process-wizard3-3",
          query: {geobody_file_id:item["geobody_file_id"], geobody_id: item["geobody_id"], cls: item['cls']}
        });
      },
      openDataUrl3_3(item)
      {
        return("#/process-wizard3-3?geobody_file_id=" + item["geobody_file_id"] + "&geobody_id=" + item["geobody_id"] + "&cls=" + item["cls"]);
      },

      radiusDialogBtn1Click() {
        this.$refs.radiusDialog.hideModal();
      },
      radiusDialogBtn2Click() {
        if (!this.bvalidate) return;
        // this.selected_data["radius"] = this.model["radius"];
        // this.selected_data["file_id"] = this.model["file_id"];
        //console.log(JSON.stringify(this.selected_data))
        // this.wizardButtonClicked('processwizard3');
        // this.$store.dispatch('actionSaveSelectedWell', this.selected_data); //set selected project
        this.$router.push({
          path: this.varRouter.getRoute("processwizard3", 1),
        });

        this.$refs.radiusDialog.hideModal();
      },
    },
    mounted()
    {
      //-------------- LIST Well -------------------
      EventBus.$on(this.event_http_list_well.success, (msg) => {
        let tmp_point = [];
        this.chartWellSeries = [];
        for(let i=0; i< msg.data.length; i++)
        {
          let item = msg.data[i];
          let xx = (item["x_max"] - item["x_min"]) / 2.0;
          let yy = (item["y_max"] - item["y_min"]) / 2.0;
          tmp_point.push({x:item["x_min"] + xx,  y:item["y_min"] + yy});
        }
        let tmp_series_point = {
          name: "Well",
          type: "scatter",
          point_size: 2,
          color: "#FF3333",
          data: tmp_point,
        };
        this.chartWellSeries.push(tmp_series_point);

        this.getListGeobodyData();
      });
      EventBus.$on(this.event_http_list_well.fail, (msg) => {
        this.table_well = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
        this.showLoader = false;
      });

      //-------------- LIST Geobody -------------------
      EventBus.$on(this.event_http_list.success, (msg) =>
      {
        // console.log(JSON.stringify(msg))
        this.chartGeobodySeries = [];
        this.table_datas = msg; //fill table contents

        let series_item = {
          name: this.cur_area["area"],
          type: "line",
          point_size: 2,
          color: "#0000CD",
          data: [
            {x: this.cur_area["p1x"], y: this.cur_area["p1y"]},
            {x: this.cur_area["p2x"], y: this.cur_area["p2y"]},
            {x: this.cur_area["p3x"], y: this.cur_area["p3y"]},
            {x: this.cur_area["p4x"], y: this.cur_area["p4y"]},
            {x: this.cur_area["p1x"], y: this.cur_area["p1y"]},
          ]
        };

        if(this.cur_area["view_mode"] === 0)
        {
          this.chartWellSeries.push(series_item);
          this.chartWellOptions = apexChartSimpleProperties();
          this.chartWellOptions["legend"]["position"] = "bottom";
        }
        else
        {
          this.chartGeobodySeries.push(series_item);
          this.chartGeobodyOptions = apexChartSimpleProperties();
          this.chartGeobodyOptions["legend"]["position"] = "bottom";
        }
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

      });

      EventBus.$on(this.event_http.fail, (msg) =>
      {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy()
    {
      EventBus.$off(this.event_http_list.success);
      EventBus.$off(this.event_http_list.fail);
      EventBus.$off(this.event_http_list_well.success);
      EventBus.$off(this.event_http_list_well.fail);
      EventBus.$off(this.event_http.success);
      EventBus.$off(this.event_http.fail);
      this.showLoader = false;
    },
  }
</script>

<style scoped>
  .table > tbody > tr > td {
    vertical-align: middle;
  }
  .lc_seismic_chart {
    width: 100%;
    height: 67vh;
  }
</style>

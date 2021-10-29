<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <splitpanes class="default-theme" style="height: 80vh" vertical>
      <pane class="scrollable p-2" min-size="20" max-size="70" style="background: white">
        <div class="group-header">
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="showOrHideTableCheckbox"><i
            class="fa fa-check-square" v-b-tooltip.hover title="Hide checkbox table column"/></ejs-button>
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="hideShowMarkerAll"><i
            class="fa fa-map-marker" v-b-tooltip.hover title="Hide all marker"/></ejs-button>
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="getHttpRefreshProspectProject" v-b-tooltip.hover title="Refresh data"><i
            class="fa fa-refresh"/></ejs-button>
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="gotoNewProspectPage"><i class="fa fa-plus" v-b-tooltip.hover
                                                                 title="New prospect data"/></ejs-button>
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="openEditGroupDialog"><i class="fa fa-edit" v-b-tooltip.hover
                                                                 title="Edit group"/></ejs-button>
        </div>
        <vue-good-table
          max-height="67vh"
          ref="table-prospect"
          compactMode
          :columns="table_prospect_headers"
          :rows="table_prospect"
          styleClass="vgt-table bordered striped condensed"
          :line-numbers="true"
          :pagination-options="paginationOptions"
          :select-options="tableSelectAllOptions">
          <template slot="table-column" slot-scope="props">
           <span v-if="props.column.label =='Marker'">
              <i class="fa fa-map-marker"/>
           </span>
          </template>

          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field === 'score'">
              {{props.row.score.toFixed(3)}}
            </span>
            <span v-else-if="props.column.field === 'action'">
<!--              <ejs-button cssClass='e-success'-->
<!--                          v-on:click.native="eventEditProspectProjectClicked(props.row)">Edit</ejs-button>-->
<!--              <ejs-button cssClass='e-success mt-1'-->
<!--                          v-on:click.native="eventProspectAnalysisClicked(props.row)">Analysis</ejs-button>-->
              <ejs-button cssClass='e-success mt-1'
                          v-on:click.native="eventEditProspectAnalysisClicked(props.row)">Analysis</ejs-button>
            </span>
            <span v-else-if="props.column.field === 'star'">
              {{props.row.dmp.score.star}}
            </span>
            <span v-else-if="props.column.field === 'marker'">
              <span @click="eventSwitchLayerClicked(props.row.originalIndex, props.row)"
                    :style="eventSelectedLayerCssStyle(props.row)">
                <template v-if="props.row.dmp.marker.show">
                  <i class="btn_toolbar fa fa-toggle-on"/>
                </template>
                <template v-else>
                  <i class="btn_toolbar fa fa-toggle-off"/>
                </template>
              </span>
            </span>
          </template>
        </vue-good-table>
      </pane>
      <pane class="p-2" min-size="30" max-size="80" style="background: white">
        <template v-if="showLoader===false">
          <!-- layer map -->
          <l-map ref="map" style="width: 100%; height:100%;" :zoom="map_var.zoom" :center="map_var.center"
                 :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom"
                 @ready="onMapReady">

            <l-control-scale position="bottomleft" :imperial="false" :metric="true"></l-control-scale>

            <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"/>

            <template v-for="item in tmp_array_autoupdate">
            </template>

            <template v-for="prospect in table_prospect">
              <template v-if="'marker' in prospect.dmp">
                <template v-if="prospect.dmp.marker.show">
                  <l-marker :lat-lng="{lat: prospect.dmp.marker.lng, lng: prospect.dmp.marker.lat}" :draggable="false"
                            :icon="markerDragIcon">
                    <l-popup>
                      <div style="width: 100%;">
                        Lat (x) : <b>{{prospect.dmp.marker.lat.toFixed(2)}}</b><br>
                        Lon (y) : <b>{{prospect.dmp.marker.lng.toFixed(2)}}</b><br>
                        Area : <b>{{prospect.dmp.marker.area}}</b><br>
                        Layer : <b>{{prospect.dmp.marker.layer}}</b><br>
                        <b>{{prospect.dmp.marker.label}}</b>
                      </div>
                    </l-popup>
                  </l-marker>
                </template>
              </template>
            </template>
          </l-map>
        </template>
      </pane>
    </splitpanes>

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

    <!-- save prospect dialog -->
    <vue-form-dialog
      ref="updateGroupDialog"
      type="default"
      header="Update Group" body="Body"
      btn1_text="Close" btn2_text="Save"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="updateGroupDialogBtn1Click()" @btn2Click="updateGroupDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="update_group_schema" :model="update_group_model" :options="formOptions" @validated="onValidated"/>
            </span>
    </vue-form-dialog>
  </div>
</template>

<script>
  import Vue from 'vue';

  import 'vue-good-table/dist/vue-good-table.css'
  import {VueGoodTable} from 'vue-good-table';

  import {ButtonPlugin} from '@syncfusion/ej2-vue-buttons';
  Vue.use(ButtonPlugin);

  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";

  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {mapState} from "vuex";
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import VueLeafletMap from "../components/vue-leaflet-map"
  import {
    createTableProspectProjectHeader_V1, createUpdateProspectGroupModel, createUpdateProspectGroupSchema
  } from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {
    addShowKeyToLayer,
    createAreaDemoData,
    createAreaLeafletDemoData, createDemoProspectProjectList,
    createHeatmapDemoData
  } from "../../libs/demo_data";

  import * as L from "leaflet";
  import {LMap, LTileLayer, LMarker, LPolygon, LPopup, LTooltip, LControlScale} from 'vue2-leaflet'
  import {CRS} from "leaflet";
  import 'leaflet/dist/leaflet.css'
  import {
    addPlotDataToTableArea,
    createTableFromHeatmapFullData,
    getAreaFirstCoordinate, getMaxHeatmapData, setDmpMarkerStatus
  } from "../../libs/libUpdateData";
  import {appDemoMode, getMapPinMarker} from "../../_constant/http_api";

  import {saveProspectData} from "../../_constant/active_user";

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
  export default {
    name: "ProjectManagement",
    components: {
      Splitpanes, Pane,
      VueLeafletMap,
      VueSimpleDialog,

      LMap,
      LTileLayer,
      LMarker,
      LPolygon,
      LPopup,
      LTooltip,
      LControlScale,

      VueGoodTable,
      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,
    },
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
        bvalidate: false,

        bdemo: appDemoMode(),
        showLoader: true,
        retStatus: {status: 0, title: "", message: "", data: []},

        paginationOptions: {
          enabled: true,
          mode: 'record',
          perPage: 10,
          perPageDropdown: [5, 10, 25, 50, 100],
          perPageDropdownEnabled: true,
          // infoFn: (params) => `my own page ${params.firstRecordOnPage}`,
        },
        tableSelectAllOptions: {
          enabled: false,
          selectOnCheckboxOnly: true,
          disableSelectInfo: false
        },

        // map variable
        map_var: {},

        // marker drag
        markerDragIcon: L.icon({
          iconUrl: getMapPinMarker(),
          iconSize: [32, 36],
          iconAnchor: [16, 36]
        }),

        tmp_array_autoupdate: [],
        table_area: [],

        table_prospect_headers: createTableProspectProjectHeader_V1(),
        table_prospect: [],

        heatmap_summary: {min: 0, max: 0},

        selected_data: {},
        tmp_datas: [],

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        update_group_model: createUpdateProspectGroupModel(),
        update_group_schema: createUpdateProspectGroupSchema(),

        event_http_area_list: {success: "successAreaList", fail: "failAreaList"},
        event_http_prospect_list: {success: "successProspectList", fail: "failProspectList"},
        event_http_prospect_update_group: {success: "successProspectUpdateGroup", fail: "failProspectUpdateGroup"},
      }
    },

    beforeMount: function () {
      this.map_var = createAreaLeafletDemoData();
      if (this.bdemo) {
        this.table_area = createAreaDemoData();
        this.table_area = addPlotDataToTableArea(this.map_var, this.table_area);
        this.table_area[0].heatmap_data = addShowKeyToLayer(createHeatmapDemoData());
        this.table_area[0].heatmap_available = true;
        this.table_prospect = createDemoProspectProjectList();
        setDmpMarkerStatus(this.table_prospect, "marker", "show", false);

        this.showLoader = false;
      } else
        this.httpListArea();
    },

    watch:
      {},

    methods: {
      openEditGroupDialog()
      {
        let selected_rows = this.$refs['table-prospect'].selectedRows;
        let nd = selected_rows.length;
        if(nd === 0)
        {
          this.retStatus["title"] = "Information";
          this.retStatus["message"] = "No selected data";
          this.$refs.dialogMessage.showModal();
          return;
        }

        this.update_group_model["group"] = selected_rows[0]["group"];
        this.updateGroupDialogShow();
      },
      updateGroupDialogShow()
      {
        this.$refs.updateGroupDialog.showModal();
      },

      updateGroupDialogBtn1Click() {
        this.$refs.updateGroupDialog.hideModal();
      },
      updateGroupDialogBtn2Click() {
        if (!this.bvalidate) return;

        if(this.update_group_model["group"].trim().length === 0)
          return;

        this.onClickUpdateProspectGroup();
        this.$refs.updateGroupDialog.hideModal();
      },
      onClickUpdateProspectGroup()
      {
        let selected_rows = this.$refs['table-prospect'].selectedRows;
        let nd = selected_rows.length;
        if(nd === 0)
          return;

        let filename = [];
        for(let i=0; i<nd; i++)
        {
          filename.push({
            id_area: selected_rows[i]["id_area"],
            filename: selected_rows[i]["filename"]
          });
        }
        let param = {
          user: this.user["user"],
          data: {
            group: this.update_group_model["group"],
            list: filename
          }
        };
        // console.log(JSON.stringify(param))
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("prospect-update-group"), param,
          this.event_http_prospect_update_group]).then();
      },

      showOrHideTableCheckbox()
      {
        this.tableSelectAllOptions["enabled"] = !this.tableSelectAllOptions["enabled"];
      },
      hideShowMarkerAll() {
        for (let i = 0; i < this.table_prospect.length; i++) {
          this.table_prospect[i].dmp.marker.show = false;
        }
        this.tmp_array_autoupdate = [];
      },
      eventSelectedLayerCssStyle(item) {
        let fg_color = "#808080";
        if (item.dmp.marker.show)
          fg_color = "#4169E1";
        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:100%;";
        return (strstyle);
      },
      eventSwitchLayerClicked(index, item) {
        let status = !item.dmp.marker.show;
        item.dmp.marker.show = status;
        this.tmp_array_autoupdate = [];

        this.table_prospect[index].dmp.marker.show = status;
      },
      mapUpdated(event) {
      },
      onMapReady() {
        this.map = this.$refs.map.mapObject;
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

      onValidated(isValid, errors) {
        this.bvalidate = isValid;
      },

      //-----------------------------------------------------
      //TABLE VIEWER
      //-----------------------------------------------------
      httpListArea() {
        this.showLoader = true;
        let param = {
          // user: this.user["user"],
          data: {}
        };
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("area-list"), param, this.event_http_area_list]).then();
      },

      eventEditProspectProjectClicked(item) {
        saveProspectData(item);

        let routeData = this.$router.resolve({
          path: this.varRouter.getRoute("prospect-edit", 1),
          query: {
            id: item["id"],
          }
        });
        window.open(routeData.href, '_blank');
      },
      eventProspectAnalysisClicked(item) {
        saveProspectData(item);

        let routeData = this.$router.resolve({
          path: this.varRouter.getRoute("prospect-analysis", 1),
          query: {
            id: item["id"],
          }
        });
        window.open(routeData.href, '_blank');
      },
      eventEditProspectAnalysisClicked(item) {
        saveProspectData(item);

        let routeData = this.$router.resolve({
          path: this.varRouter.getRoute("edit-prospect-analysis", 1),
          query: {
            id: item["id"],
          }
        });
        window.open(routeData.href, '_blank');
      },

      getHttpRefreshProspectProject() {
        let param = {
          // user: this.user["user"],
          data: {}
        };
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("prospect-list"), param, this.event_http_prospect_list]).then();
      },
      gotoNewProspectPage() {
        let routeData = this.$router.resolve({
          path: this.varRouter.getRoute("new-prospect-wizard", 1),
        });
        window.open(routeData.href, '_blank');
      },
    },
    mounted() {
      setTimeout(function () {
        window.dispatchEvent(new Event('resize'))
      }, 250);

      // DO
      this.$nextTick(() => {
        //   this.map = this.$refs.map.mapObject; // work as expected
      });

      //-----------------------------------------------------------------
      // LIST AREA
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_area_list.success, (msg) => {
        this.map_var = createAreaLeafletDemoData();
        this.table_area = msg.data; //fill table contents
        this.table_area = addPlotDataToTableArea(this.map_var, this.table_area);

        this.getHttpRefreshProspectProject();
      });
      EventBus.$on(this.event_http_area_list.fail, (msg) => {
        this.showLoader = false;
        this.table_area = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROSPECT LIST
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_prospect_list.success, (msg) => {
        this.table_prospect = msg.data;
        setDmpMarkerStatus(this.table_prospect, "marker", "show", false);
        this.showLoader = false;
        this.tmp_array_autoupdate = [];
      });
      EventBus.$on(this.event_http_prospect_list.fail, (msg) => {
        this.table_prospect = [];
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROSPECT UPDATE GROUP
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_prospect_update_group.success, (msg) => {
        this.getHttpRefreshProspectProject();
      });
      EventBus.$on(this.event_http_prospect_update_group.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_area_list.success);
      EventBus.$off(this.event_http_area_list.fail);
      EventBus.$off(this.event_http_prospect_list.success);
      EventBus.$off(this.event_http_prospect_list.fail);
      EventBus.$off(this.event_http_prospect_update_group.success);
      EventBus.$off(this.event_http_prospect_update_group.fail);

      this.showLoader = false;
    },
  }
</script>

<style>

</style>

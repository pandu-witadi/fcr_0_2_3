<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <b-tabs v-model="tabIndex">
      <b-tab title="Data by FIELD" :title-link-class="linkClass(0)">

        <splitpanes class="default-theme" style="height: 76vh" vertical>
          <pane class="p-2" min-size="20" max-size="30" style="background: white">
            <!--          <b-tab title="Data by WELL" :title-link-class="linkClass(1)">Tab contents 2</b-tab>-->
            <!--          <b-tab title="Well Files" :title-link-class="linkClass(2)">Tab contents 3</b-tab>-->
            <!--          <b-tab no-body title="Seismic Files" :title-link-class="linkClass(3)">-->

            <b-row>
              <b-col md="12">
                <b-table responsive style="height: 90vh"
                         show-empty
                         sticky-header="90vh"
                         :small="true"
                         :striped="false"
                         :bordered="true"
                         :outlined="true"
                         :current-page="currentPage"
                         :per-page="perPage"
                         :filter="filter"
                         @filtered="onFiltered"
                         :fields="table_area_headers"
                         :items="table_area">

                  <template v-slot:cell(area_show)="row">
                <span :style="eventSelectedAreaCssStyle(row.item)"
                      @click="eventSelectedAreaClicked(row.item)">
                      <i class="fa fa-map"/>
                </span>
                  </template>
                  <template v-slot:cell(heatmap_available)="row">
                <span :style="eventDownloadHeatmapCssStyle(row.item)"
                      @click="eventDownloadHeatmapClicked(row.index)">
                      <i class="fa fa-download"/>
                </span>
                  </template>
                  <template v-slot:cell(heatmap_show)="row">
                    <template v-for="item in row.item.heatmap_data">
                  <span :style="eventHeatmapShowLayerCssStyle(item)"
                        @click="eventHeatmapShowLayerClicked(row.item.id_area, row.item.name, item)">
                    {{item.label}}
                  </span><br>
                    </template>
                    <!--                <span :style="eventHeatmapShowLayerCssStyle(row.item)"-->
                    <!--                      @click="eventHeatmapShowLayerClicked(row.item)">-->
                    <!--                      <i class="fa fa-clone"/>-->
                    <!--                </span>-->
                    <!--                <multiselect style="width: 200px; height: 20px"-->
                    <!--                             v-model="selected"-->
                    <!--                             :options="options"-->
                    <!--                             :showNoOptions="true"-->
                    <!--                             :showLabels="false"-->
                    <!--                             selectLabel=""-->
                    <!--                             :custom-label="createDropdownLayerListLabel">-->
                    <!--                </multiselect>-->

                  </template>
                </b-table>
              </b-col>
            </b-row>
          </pane>
          <pane class="p-2" min-size="70" max-size="80" style="background: white">
            <template v-if="showLoader===false">
              <div class="mb-1">
                <!-- map button -->
                <ejs-button :cssClass='markerLocationCssStyle()' class="mr-1"
                            v-on:click.native="markerLocationEventClick()"><i
                  class="fa fa-map-marker"/></ejs-button>
                <!--            <ejs-button cssClass='e-outline' class="mr-1" v-on:click.native="httpHeatmapData()"><i-->
                <!--              class="fa fa-download"/></ejs-button>-->
                <template v-if="show_marker_drag">
                  <span class="ml-5"><b>x</b> : {{marker_drag_coord.lng.toFixed(2)}}   ,    <b>y</b> : {{marker_drag_coord.lat.toFixed(2)}}</span>
                </template>
              </div>

              <!-- layer map -->
              <l-map ref="map" style="width: 100%; height:96%;" :zoom="map_var.zoom" :center="map_var.center"
                     :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom"
                     @ready="onMapReady" @click="onMapClickEvent">
                <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"/>

                <template v-for="item in tmp_array_autoupdate">
                </template>

                <template v-for="item in table_area">
                  <template v-if="item.area_show===true">
                    <l-polygon :lat-lngs="item.poly.polygon" :color="item.poly.color">
                    </l-polygon>
                  </template>
                </template>

                <template v-for="area in table_area">
                  <template v-for="layer in area.heatmap_data">
                    <template v-if="layer.show">
                      <LHeatmap
                        :latLngs="layer.probmap"
                        :radius="20"
                        :blur="20"
                        :minOpacity="0.1"
                        :max="layer.sum.max">
                      </LHeatmap>
                    </template>
                  </template>
                </template>

                <template v-if="show_marker_drag">
                  <l-marker :lat-lng="marker_drag_coord" :draggable="false" :icon="markerDragIcon">
                    <l-popup>
                      <div style="width: 100%">
                        Lat (x) : <b>{{marker_drag_coord.lng.toFixed(2)}}</b><br>
                        Lon (y) : <b>{{marker_drag_coord.lat.toFixed(2)}}</b><br>
                        Area : <b>{{selectedLayer.area_name}}</b><br>
                        Layer : <b>{{selectedLayer.layer_name}}</b>
                        <!--                    <b-form-select v-model="selected" :options="options" size="sm" class="mt-3"></b-form-select>-->
                      </div>
                      <b-button class="btn btn-sm mt-1" variant="primary" @click="openSectionByCoord()">Section
                      </b-button>
                    </l-popup>
                  </l-marker>
                </template>

              </l-map>
            </template>
          </pane>
        </splitpanes>
      </b-tab>

      <b-tab title="Prospect Project" :title-link-class="linkClass(1)">
        <div class="mb-1">
          <!-- map button -->
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="getHttpRefreshProspectProject"><i
            class="fa fa-refresh"/></ejs-button>
        </div>

        <b-table style="height: 74vh"
                 responsive
                 show-empty
                 sticky-header="70vh"
                 :small="true"
                 :striped="false"
                 :bordered="true"
                 :outlined="true"
                 :current-page="currentPage"
                 :per-page="perPage"
                 :filter="filter"
                 @filtered="onFiltered"
                 :fields="table_prospect_headers"
                 :items="table_prospect">
          <!-- A virtual column -->
          <template #cell(index)="data">
            {{ data.index + 1 }}
          </template>
          <template v-slot:cell(star)="row">
            {{row.item.dmp.score.star}}
          </template>
          <template v-slot:cell(title)="row">
            {{row.item.dmp.title}}
          </template>
          <template v-slot:cell(score)="row">
            {{row.item.score.toFixed(3)}}
          </template>
          <template v-slot:cell(ctime)="row">
            {{createFormattedTime(row.item.ctime)}}
          </template>
          <template v-slot:cell(action)="row">
            <ejs-button cssClass='e-success'
                        v-on:click.native="eventEditProspectProjectClicked(row.item)">Edit</ejs-button>
          </template>
        </b-table>
      </b-tab>
    </b-tabs>
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

  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import ViewProcessWizardButton from "../components/viewProcessWizardButton";
  import ViewBottomWizardButton from "../components/viewBottomWizardButton";
  import {mapState} from "vuex";
  import {createTabProcessIconV0, createTabProcessTextV0} from '../../libs/libSeismicUi';
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import VueLeafletMap from "../components/vue-leaflet-map"
  import LHeatmap from "../components/Vue2LeafletHeatmap";
  import {
    createTableAreaListHeader,
    createTableAreaListHeader2_V1,
    createTableAreaListHeader3_V1,
    createTableAreaListHeader_V1,
    createTableAreaListHeaderV0,
    createTableAvaHeaderV0,
    createTableHeatmapLayerHeader,
    createTableProspectProjectHeader_V1
  } from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {
    fillLeafletAreaVariable,
    getBoundaryData,
    createLeafletColormap,
    createLeafletAreaPolygon
  } from "../../libs/simpleLib";
  import {
    addShowKeyToLayer,
    createAreaDemoData,
    createAreaLeafletDemoData, createDemoProspectProjectList,
    createHeatmapDemoData
  } from "../../libs/demo_data";
  import Multiselect from 'MyLibVue/src/views/vue-multiselect'


  import * as L from "leaflet";
  import {LMap, LTileLayer, LMarker, LPolygon, LPopup, LTooltip} from 'vue2-leaflet'
  import {CRS} from "leaflet";
  import 'leaflet/dist/leaflet.css'
  import {
    addPlotDataToTableArea,
    createTableFromHeatmapFullData,
    getAreaFirstCoordinate, getMaxHeatmapData
  } from "../../libs/libUpdateData";
  import {appDemoMode, getMapPinMarker} from "../../_constant/http_api";

  import '@geoman-io/leaflet-geoman-free'
  import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
  import "../../libs/leaflet-measure";
  import "../../_assets/leaflet-measure.css";
  import {v4 as uuidv4} from 'uuid';
  import {saveProspectData} from "../../_constant/active_user";
  import {stringToFormattedDate} from "../../_constant/mylib";

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
  export default {
    name: "ProcessWizardStep1",
    components: {
      ViewBottomWizardButton,
      ViewProcessWizardButton,
      Splitpanes, Pane,
      VueLeafletMap,
      VueSimpleDialog,
      Multiselect,

      LMap,
      LTileLayer,
      LMarker,
      LPolygon,
      LPopup,
      LTooltip,
      LHeatmap
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
        bdemo: appDemoMode(),
        showLoader: true,
        retStatus: {status: 0, title: "", message: "", data: []},

        selectedLayer: {
          area: -1,
          area_name: "",
          layer: -1,
          layer_name: ""
        },

        // map variable
        map_var: {},

        // marker drag
        show_marker_drag: false,
        marker_drag_coord: {lat: 0, lng: 0},
        markerDragIcon: L.icon({
          iconUrl: getMapPinMarker(),
          iconSize: [32, 36],
          iconAnchor: [16, 36]
        }),

        tmp_array_autoupdate: [],
        selected_area: -1,
        table_area_headers: createTableAreaListHeader_V1(),
        table_area: [],

        table_prospect_headers: createTableProspectProjectHeader_V1(),
        table_prospect: [],

        heatmap_summary: {min: 0, max: 0},

        tabIndex: 0,
        cur_tab: 0,

        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        table_headers3: createTableAreaListHeader3_V1(),
        table_headers4: createTableAvaHeaderV0(),
        selected_data: {},
        tmp_datas: [],

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_area_list: {success: "successAreaList", fail: "failAreaList"},
        event_http_heatmap_data: {success: "successHeatmapData", fail: "failHeatmapData"},
        event_http_prospect_list: {success: "successProspectList", fail: "failProspectList"},
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

        this.marker_drag_coord = getAreaFirstCoordinate(this.table_area);
        this.showLoader = false;
      } else
        this.httpListArea();
    },

    watch:
      {},

    methods: {
      createFormattedTime(sstr)
      {
        return(stringToFormattedDate(sstr));
      },
      mapUpdated(event) {
        // // add listeners on creation and delete on removal
        // if (event.type === 'pm:create') {
        //   event.layer.on('pm:edit', this.mapUpdated);
        //
        //   // add data
        //   event.layer.properties = {
        //     shape: event.shape
        //   };
        //
        //   // radius for circles
        //   if (event.shape === 'Circle') {
        //     event.layer.properties.radius = event.layer.getRadius();
        //   }
        //
        //   event.layer.internalId = uuidv4();
        // }
        // if (event.type === 'pm:remove') {
        //   event.layer.off(); // remove all event listeners
        // }
        //
        // // emit event
        // this.$emit('change', this.getDataAsGeoJSON());
      },
      // export data as GeoJSON object
      getDataAsGeoJSON() {
        // // create FeatureCollection
        // const geoJSON = {
        //   type: 'FeatureCollection',
        //   features: []
        // };
        //
        // // export each layer
        // this.map.eachLayer(function (layer) {
        //   if (layer.internalId && (layer instanceof L.Path || layer instanceof L.Marker)) {
        //     const geoJSONShape = layer.toGeoJSON(16); // to precise geo shape!
        //     geoJSONShape.properties = layer.properties;
        //     geoJSONShape.id = layer.internalId;
        //     geoJSON.features.push(geoJSONShape);
        //
        //     // normalize coordinates (> 180/>90)
        //     // TODO
        //   }
        // });
        //
        // this.geoJsonCoord = geoJSON;
        // return geoJSON;
      },

      // onFinishCreateArea(evt)
      // {
      //   this.area_info = {
      //     area: evt.area,
      //     areaDisplay: evt.areaDisplay,
      //     lastCoord: evt.lastCoord,
      //     length: evt.length,
      //     lengthDisplay: evt.lengthDisplay,
      //     pointCount: evt.pointCount,
      //     points: evt.points
      //   };
      // },
      onMapReady() {
        this.map = this.$refs.map.mapObject;

        // const measureControl = new window.L.Control.Measure({
        //   position: "topleft",
        //   activeColor: '#FF0000',
        //   completedColor: '#FF0000',
        //   primaryLengthUnit: "meters",
        //   secondaryLengthUnit: "kilometers",
        //   primaryAreaUnit: "sqmeters",
        //   secondaryAreaUnit: "hectares"
        // });
        // this.map.addControl(measureControl);
        //
        // this.map.pm.addControls({
        //   position: 'topleft',
        //   drawMarker: false,
        //   drawCircleMarker: false,
        //   drawPolyline: false,
        //   drawRectangle: false,
        //   drawCircle: false
        // });
        // this.map.pm.setPathOptions({
        //   color: 'orange',
        //   fillColor: 'orange',
        //   fillOpacity: 0.4,
        // });
        //
        // // listen to events
        // this.map.on('pm:create', this.mapUpdated);
        // this.map.on('pm:remove', this.mapUpdated);
        // this.map.on('pm:cut', this.mapUpdated);

      },

      linkClass(idx) {
        if (this.tabIndex === idx) {
          return ['bg-primary', 'text-light']
        } else {
          return ['bg-light', 'text-info']
        }
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

      // ------------------------------------------------
      // marker drag
      // ------------------------------------------------
      onMapClickEvent(event) {
        if (this.show_marker_drag)
          this.marker_drag_coord = event.latlng;
      },

      markerLocationCssStyle() {
        if (this.show_marker_drag)
          return ("e-warning");
        else
          return ("e-outline");
      },
      markerLocationEventClick() {
        this.show_marker_drag = !this.show_marker_drag;
      },

      // ------------------------------------------------
      //
      // ------------------------------------------------
      eventSelectedAreaCssStyle(item) {
        let fg_color = "#808080";
        if (item.area_show)
          fg_color = item["poly"]["color"];

        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:100%;";
        return (strstyle);
      },
      eventSelectedAreaClicked(item) {
        this.tmp_array_autoupdate = [];
        item.area_show = !item.area_show; // select/unselect
      },
      eventDownloadHeatmapCssStyle(item) {
        let fg_color = "#808080";
        if (item.heatmap_available)
          fg_color = "#4169E1";
        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:100%;";
        return (strstyle);
      },
      eventDownloadHeatmapClicked(idx) {
        this.selected_area = idx;
        if (this.bdemo === true) {
          this.table_area[this.selected_area].heatmap_data = createHeatmapDemoData();
          this.table_area[this.selected_area].heatmap_available = true;
        } else
          this.httpHeatmapDataByIdx();
      },
      eventHeatmapShowLayerCssStyle(item) {
        let fg_color = "#808080";
        if (item.show)
          fg_color = "#4169E1";
        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:100%;";
        return (strstyle);
      },
      eventHeatmapShowLayerClicked(id_area_, area_name_, item) {
        // if(item.heatmap_available === false)
        // {
        //   this.retStatus.title = "Informasi";
        //   this.retStatus.status = 0;
        //   this.retStatus.message = "Silahkan melakukan download data sebelum menampilkan di peta !";
        //   this.$refs.dialogMessage.showModal();
        //   return;
        // }
        this.tmp_array_autoupdate = [];
        item.show = !item.show;
        if (item.show === false) {
          // this.selectedLayer["area"] = -1;
          // this.selectedLayer["area_name"] = "";
          // this.selectedLayer["layer"] = -1;
          // this.selectedLayer["layer_name"] = "";
        } else {
          this.selectedLayer["area"] = id_area_;
          this.selectedLayer["area_name"] = area_name_;
          this.selectedLayer["layer"] = item["layer"];
          this.selectedLayer["layer_name"] = item["label"];
        }
      },

      openSectionByCoord() {
        let routeData = this.$router.resolve({
          path: "seismic-viewer-by-xy",
          query: {
            area: this.selectedLayer["area"],
            layer: this.selectedLayer["layer"],
            lat: this.marker_drag_coord["lat"],
            lng: this.marker_drag_coord["lng"]
          }
        });
        window.open(routeData.href, '_blank');
      },

      //-----------------------------------------------------
      //TABLE VIEWER
      //-----------------------------------------------------
      showPerPage(selected_per_page) {
        if (selected_per_page === "All" || selected_per_page === "Semua")
          this.perPage = this.table_area.length;
        else
          this.perPage = selected_per_page;
        this.perPageView = selected_per_page;
      },
      computeTotalRow() {
        try {
          return (this.table_area.length);
        } catch (e) {
          return (0);
        }
      },
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },
      //-----------------------------------------------------
      openGeobodyPage(item) {
        this.selected_data = item;
        this.selected_data["view_mode"] = 0;
        this.$store.dispatch('actionSaveSelectedArea', this.selected_data); //set selected project
        this.$router.push({
          path: "process-wizard2-0",
          // query: {mode:0}
        });
      },
      openXYZPage(item) {
        this.selected_data = item;
        this.selected_data["view_mode"] = 0;
        this.$store.dispatch('actionSaveSelectedArea', this.selected_data); //set selected project
        this.$router.push({
          path: "process-wizard2-1",
          query: {mode: 1}
        });
      },

      getTabIcon() {
        return (createTabProcessIconV0(0))
      },
      getTabText() {
        return (createTabProcessTextV0(0))
      },
      wizardButtonClicked(str_router) {
        return (this.varRouter.getRoute(str_router, 1))
      },

      httpListArea() {
        this.showLoader = true;
        let param = {
          // user: this.user["user"],
          data: {
          }
        }
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("area-list"), param, this.event_http_area_list]).then();
      },
      httpHeatmapDataByIdx() {
        if (this.selected_area < 0)
          return;

        this.showLoader = true;
        // let list_file = [
        //   "heatmap_TUNU95_v30_cal_prob_0500_0600.csv",
        //   "heatmap_TUNU95_v30_cal_prob_0600_0700.csv",
        //   "heatmap_TUNU95_v30_cal_prob_0700_0800.csv",
        //   "heatmap_TUNU95_v30_cal_prob_0800_0900.csv",
        //   "heatmap_TUNU95_v30_cal_prob_0900_1000.csv"
        // ];

        let param = {
          "state": 0,
          "type": "/api/probmap/multi",
          "mesg": "",
          // "user": this.user["user"],
          "data": {
            "id_area": this.table_area[this.selected_area]["id_area"],
            "feature": "sum",
          }
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("probmap_multi"), param, this.event_http_heatmap_data]).then();
      },

      httpHeatmapData() {
        this.showLoader = true;
        // let param = {
        //   "state": 0,
        //   "type": "/api/heatmap/get",
        //   "mesg": "",
        //   "data": {
        //     "id_area": 2,
        //     "file_loc": "TUNU95/08_heatmap",
        //     "feature": "sum",
        //     "heatmap_TUNU95_v30_cal_prob_0500_0600.csv",
        //     "heatmap_TUNU95_v30_cal_prob_0600_0700.csv"
        //   }
        // };
        let param = {
          "state": 0,
          "type": "/api/heatmap/multi",
          "mesg": "",
          // "user": this.user["user"],
          "data": {
            "id_area": 2,
            "file_loc": "TUNU95/08_heatmap",
            "feature": "sum",
            "file_name": [
              "heatmap_TUNU95_v30_cal_prob_0500_0600.csv",
              "heatmap_TUNU95_v30_cal_prob_0600_0700.csv",
              "heatmap_TUNU95_v30_cal_prob_0700_0800.csv",
              "heatmap_TUNU95_v30_cal_prob_0800_0900.csv",
              "heatmap_TUNU95_v30_cal_prob_0900_1000.csv"
            ]
          }
        };
        // this.$store.dispatch('http_post', [this.varRouter.getHttpType("demo-heatmap"), param, this.event_http_heatmap_data]).then();
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("demo-heatmap-multi"), param, this.event_http_heatmap_data]).then();
      },

      createDemoCss(cc) {
        return ('<span class="map-marker3" style="background-color:' + cc + '"/>');
      },
      createCustomMarkerPopup(item) {
        let sstr = 'Area : <b>' + item.area + '</b><br>';
        sstr = sstr + 'Lat : <b>' + item.lat + '</b><br>';
        sstr = sstr + 'Lon : <b>' + item.lon + '</b>';
        return (sstr);
      },

      eventEditProspectProjectClicked(item)
      {
        saveProspectData(item);

        let routeData = this.$router.resolve({
          path: "prospect-edit",
          query: {
            id: item["id"],
          }
        });
        window.open(routeData.href, '_blank');
      },
      getHttpRefreshProspectProject()
      {
        let param = {
          // user: this.user["user"],
          data: {
          }
        }
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("prospect-list"), param, this.event_http_prospect_list]).then();
      }
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

        this.marker_drag_coord = getAreaFirstCoordinate(this.table_area);
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_area_list.fail, (msg) => {
        this.showLoader = false;
        this.table_area = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // HEATMAP DATA
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_heatmap_data.success, (msg) => {
        this.table_area[this.selected_area].heatmap_data = addShowKeyToLayer(msg.data);
        this.table_area[this.selected_area].heatmap_available = true;
        this.showLoader = false;
        this.tmp_array_autoupdate = [];
      });
      EventBus.$on(this.event_http_heatmap_data.fail, (msg) => {
        this.table_area[this.selected_area].heatmap_data = [];
        this.table_area[this.selected_area].heatmap_available = false;
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROSPECT LIST
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_prospect_list.success, (msg) => {
        this.table_prospect = msg.data;
        this.showLoader = false;
        this.tmp_array_autoupdate = [];
      });
      EventBus.$on(this.event_http_prospect_list.fail, (msg) => {
        this.table_prospect = [];
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_area_list.success);
      EventBus.$off(this.event_http_area_list.fail);
      EventBus.$off(this.event_http_heatmap_data.success);
      EventBus.$off(this.event_http_heatmap_data.fail);
      EventBus.$off(this.event_http_prospect_list.success);
      EventBus.$off(this.event_http_prospect_list.fail);

      this.showLoader = false;
    },
  }
</script>

<style>
  .e-grid .e-headercell.area_table_header {
    background-color: #6495ED;
    color: white;
  }
</style>

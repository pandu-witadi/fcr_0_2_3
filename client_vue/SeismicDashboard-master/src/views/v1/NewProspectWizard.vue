<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <splitpanes class="default-theme" style="height: 82vh" vertical>
      <pane class="p-2" min-size="20" max-size="30" style="background: white">
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

          <template v-slot:cell(layer_show)="row">
                <span :style="eventSelectedAreaCssStyle(row.item)"
                      @click="eventSelectedAreaClicked(row.item)">
                      <i class="fa fa-map"/>
                </span>
          </template>

          <template v-slot:cell(layer_available)="row">
            <span v-b-tooltip.hover title="Download layer list"
                  :style="eventDownloadDataCssStyle(row.item)"
                  @click="eventDownloadDataClicked(row.item)">
                      <i class="fa fa-cloud-download"/>
            </span>
            <template v-if="row.item.layer_available">
              <span v-b-tooltip.hover title="Show or hide layers list" @click="row.toggleDetails">
                <template v-if="row.detailsShowing">
                  <i class="ml-3 fa fa-chevron-circle-up"/>
                </template>
                <template v-else>
                  <i class="ml-3 fa fa-chevron-circle-down"/>
                </template>
              </span>
            </template>
          </template>

          <template #row-details="row">
            <div>
              <div class="mb-1">
                <ejs-button cssClass='e-outline' class="mr-1"
                            v-on:click.native="setCheckedLayerStatus(row.item, false)">
                  <i class="fa fa-square-o" v-b-tooltip.hover title="Unselect all"/>
                </ejs-button>
                <ejs-button cssClass='e-outline' class="mr-1" v-on:click.native="setCheckedLayerStatus(row.item, true)">
                  <i class="fa fa-check-square" v-b-tooltip.hover title="Select all"/>
                </ejs-button>
                <ejs-button cssClass='e-outline' class="ml-3 mr-1" v-on:click.native="downloadSelectedLayers(row.item)">
                  <i class="fa fa-download" v-b-tooltip.hover title="Download selected data"/>
                </ejs-button>
                <ejs-button cssClass='e-outline' class="mr-1" v-on:click.native="downloadSelectedWell(row.item)">
                  <i class="fa fa-podcast" v-b-tooltip.hover title="Download well"/>
                </ejs-button>
              </div>
              <b-table responsive
                       show-empty
                       :small="true"
                       :striped="true"
                       :bordered="true"
                       :outlined="true"
                       :current-page="currentPage"
                       :per-page="perPage"
                       :fields="table_layer_headers"
                       :items="row.item.layers">

                <template v-slot:cell(check)="rowc">
                  <input type="checkbox" size="sm" v-model="rowc.item.check"/>
                </template>
                <template #cell(index)="rowc">
                  {{ rowc.index + 1 }}
                </template>
                <template #cell(label)="rowc">
                  {{rowc.item.label}}
                  <template v-if="rowc.item.isDefault">
                    (Default)
                  </template>
                </template>
                <template v-slot:cell(show)="rowc">
                  <template v-if="rowc.item.isAvailable">
                    <span :style="eventHeatmapShowLayerCssStyle(rowc.item)"
                          @click="eventLayerShowHeatmapClicked(row.item, rowc.item)">
                      <template v-if="rowc.item.show">
                        <i class="btn_toolbar fa fa-toggle-on"/>
                      </template>
                      <template v-else>
                        <i class="btn_toolbar fa fa-toggle-off"/>
                      </template>
                    </span>
                  </template>
                </template>
              </b-table>
            </div>
          </template>

        </b-table>
      </pane>
      <pane class="p-2" min-size="70" max-size="80" style="background: white">
        <template v-if="showLoader===false">
          <div class="mb-1">
            <!-- map button -->
            <ejs-button :cssClass='markerLocationCssStyle()' class="mr-1"
                        v-on:click.native="markerLocationEventClick()"><i
              class="fa fa-map-marker" v-b-tooltip.hover title="Show or hide marker"/></ejs-button>
            <ejs-button :cssClass='markerWellCssStyle()' class="mr-1"
                        v-on:click.native="markerWellEventClick()"><i
              class="fa fa-deviantart" v-b-tooltip.hover title="Show or hide well"/></ejs-button>

            <ejs-button cssClass='e-outline' class="ml-3 mr-1" v-on:click.native="downloadWellPoly()">
              <i class="fa fa-cloud-download" v-b-tooltip.hover title="Download well poly"/>
            </ejs-button>
            <ejs-button :cssClass='markerWellPolyCssStyle()' class="mr-1"
                        v-on:click.native="markerWellPolyEventClick()"><i
              class="fa fa-ils" v-b-tooltip.hover title="Show or hide well polyline"/></ejs-button>
            <ejs-button :cssClass='markerWellPolyMarkerCssStyle()' class="mr-1"
                        v-on:click.native="markerWellPolyMarkerEventClick()"><i
              class="fa fa-map-signs" v-b-tooltip.hover title="Show or hide well marker"/></ejs-button>

            <template v-if="show_marker_drag">
              <span class="ml-5"><b>x</b> : {{marker_drag_coord.lat.toFixed(2)}}   ,    <b>y</b> : {{marker_drag_coord.lng.toFixed(2)}}</span>
            </template>
          </div>

          <!-- layer map -->
          <l-map ref="map" style="width: 100%; height:96%;" :zoom="map_var.zoom" :center="map_var.center"
                 :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom"
                 @ready="onMapReady" @click="onMapClickEvent">

            <l-control-scale position="bottomleft" :imperial="false" :metric="true"></l-control-scale>
<!--            <l-control position="topright" style="margin-top: 30px">-->
<!--              <div class="options">-->
<!--                <label>Radius ({{heatmapScale.radius.value}})</label><br/>-->
<!--                <b-form-input style="width: 150px" v-model="heatmapScale.radius.value" type="range"-->
<!--                              :min="heatmapScale.radius.min" :max="heatmapScale.radius.max"></b-form-input>-->
<!--                <label>Blur ({{heatmapScale.blur.value}})</label><br/>-->
<!--                <b-form-input style="width: 150px" v-model="heatmapScale.blur.value" type="range"-->
<!--                              :min="heatmapScale.blur.min" :max="heatmapScale.blur.max"></b-form-input>-->
<!--              </div>-->
<!--            </l-control>-->

            <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"/>

            <template v-for="item in tmp_array_autoupdate">
            </template>

            <template v-for="item in table_area">
              <template v-if="item.layer_show===true">
                <l-polygon :lat-lngs="item.poly.polygon" :color="item.poly.color">
                </l-polygon>
              </template>
            </template>

            <template v-for="area in table_area">
              <template v-for="(layer, ii) in area.layers">
                <template v-if="layer.show">
                  <LHeatmap
                    :latLngs="area.layers[ii].heatmap.probmap"
                    :radius="heatmapScale.radius.value"
                    :blur="heatmapScale.blur.value"
                    :minOpacity="0.1"
                    :max="area.layers[ii].heatmap.sum.max">
                  </LHeatmap>
                </template>
              </template>
            </template>

            <template v-if="show_marker_drag">
              <l-marker :lat-lng="{lat: marker_drag_coord.lng, lng: marker_drag_coord.lat}" :draggable="false"
                        :icon="markerDragIcon">
                <l-popup>
                  <div style="width: 100%">
                    Lat (x) : <b>{{marker_drag_coord.lat.toFixed(2)}}</b><br>
                    Lon (y) : <b>{{marker_drag_coord.lng.toFixed(2)}}</b><br>
                    Area : <b>{{selectedLayer.area_name}}</b><br>
                    Layer : <b>{{selectedLayer.layer_name}}</b>
                    <!--                    <b-form-select v-model="selected" :options="options" size="sm" class="mt-3"></b-form-select>-->
                  </div>
                  <b-button class="btn btn-sm mt-1" variant="primary" @click="openSectionByCoord()">Prospect
                  </b-button>
                </l-popup>
              </l-marker>
            </template>

            <template v-if="show_well_marker">
              <template v-for="wellmarker in well_marker">
                <l-polyline :lat-lngs="wellmarker.data" color="red" :weight="2">
                  <l-tooltip :options="{permanent: 'true', opacity: 0.6, className: 'my-labels'}">{{wellmarker.name}}
                  </l-tooltip>
                </l-polyline>
              </template>
            </template>

            <template v-if="show_well_poly_marker">
              <template v-for="wellmarker in well_poly_marker">
                <l-polyline :lat-lngs="wellmarker.data" color="orange" :weight="2">
                  <l-tooltip :options="{permanent: 'true', opacity: 0.6, className: 'my-labels'}">{{wellmarker.name}}
                  </l-tooltip>
                </l-polyline>
              </template>
            </template>

            <template v-if="show_well_poly_marker_point">
              <template v-for="wellmarker in well_poly_marker">
                <template v-for="marker in wellmarker.marker">
                  <l-marker :lat-lng="{lat: marker.y, lng: marker.x}" :draggable="false"
                            :icon="markerWellIcon">
                    <l-popup>
                      <div style="width: 100%">
                        Name : <b>{{marker.PD_Reservoir}}</b><br>
                        Z : <b>{{marker.z.toFixed(2)}}</b><br>
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
  </div>
</template>

<script>
  import Vue from 'vue';

  import {ButtonPlugin} from '@syncfusion/ej2-vue-buttons';

  Vue.use(ButtonPlugin);

  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {mapState} from "vuex";
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import VueLeafletMap from "../components/vue-leaflet-map"
  import LHeatmap from "../components/Vue2LeafletHeatmap";
  import {
    createTableAreaListHeader_V1, createTableLayerListHeader_V1,
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


  import * as L from "leaflet";
  import {LMap, LTileLayer, LMarker, LPolygon, LPopup, LTooltip, LControlScale, LControl, LPolyline} from 'vue2-leaflet'
  import {CRS} from "leaflet";
  import 'leaflet/dist/leaflet.css'
  import {
    addPlotDataToTableArea,
    createTableFromHeatmapFullData, fillAreaLayerList, fillAreaLayerListWithHeatmapData,
    getAreaFirstCoordinate, getMaxHeatmapData
  } from "../../libs/libUpdateData";
  import {appDemoMode, getMapPinMarker} from "../../_constant/http_api";

  import '../components/LeafletAwesomeMarker/leaflet.awesome-markers.css'
  import '../components/LeafletAwesomeMarker/leaflet.awesome-markers'

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
  export default {
    name: "NewProspectWizard",
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
      LHeatmap,
      LControlScale,
      LControl,
      LPolyline
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

        polyline: {
          latlngs: [[9907792.13, 549186.55], [9908547.4, 548998.18]],
          color: 'red'
        },

        heatmapScale: {
          radius: {
            min: 5,
            max: 50,
            value: 15
          },
          blur: {
            min: 5,
            max: 50,
            value: 15
          }
        },

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
        markerWellIcon: L.icon({
          iconUrl: require('../../_assets/images/marker_btomato.png'),
          iconSize: [24, 27],
          iconAnchor: [12, 27]
        }),
        markerDragIcon: L.AwesomeMarkers.icon({
          icon: 'map-marker',
          prefix: 'fa',
          markerColor: 'orange'
        }),

        tmp_array_autoupdate: [],
        selected_area: -1,
        selected_id_area: -1,
        table_area_headers: createTableAreaListHeader_V1(),
        table_layer_headers: createTableLayerListHeader_V1(),
        table_area: [],

        heatmap_summary: {min: 0, max: 0},

        tabIndex: 0,
        cur_tab: 0,

        perPageView: 100,
        perPage: 100,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        selected_data: {},
        tmp_datas: [],
        list_selected_layer: [],

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        show_well_marker: false,
        well_marker: [],

        show_well_poly_marker: false,
        show_well_poly_marker_point: false,
        well_poly_marker: [],

        event_http_area_list: {success: "successAreaList", fail: "failAreaList"},
        event_http_probmap_get_list: {success: "successProbmapGetList", fail: "failProbmapGetList"},
        event_http_layer_download: {success: "successLayerDownload", fail: "failLayerDownload"},
        event_http_well_download: {success: "successWellDownload", fail: "failWellDownload"},
        event_http_well_poly_download: {success: "successWellPolyDownload", fail: "failWellPolyDownload"},
      }
    },

    beforeMount: function () {
      this.map_var = createAreaLeafletDemoData();
      if (this.bdemo) {
        this.table_area = createAreaDemoData();
        this.table_area = addPlotDataToTableArea(this.map_var, this.table_area);
        // this.table_area[0].heatmap_data = addShowKeyToLayer(createHeatmapDemoData());
        // this.table_area[0].layer_available = false;
        this.marker_drag_coord = getAreaFirstCoordinate(this.table_area);
        this.showLoader = false;
      } else
        this.httpListArea();
    },

    watch:
      {},

    methods: {
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

      // ------------------------------------------------
      // marker drag
      // ------------------------------------------------
      onMapClickEvent(event) {
        if (this.show_marker_drag) {
          this.marker_drag_coord = {lat: event.latlng.lng, lng: event.latlng.lat};
        }
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

      markerWellCssStyle() {
        if (this.show_well_marker)
          return ("e-warning");
        else
          return ("e-outline");
      },
      markerWellEventClick() {
        this.show_well_marker = !this.show_well_marker;
      },

      markerWellPolyCssStyle() {
        if (this.show_well_poly_marker)
          return ("e-warning");
        else
          return ("e-outline");
      },
      markerWellPolyEventClick() {
        this.show_well_poly_marker = !this.show_well_poly_marker;
      },
      markerWellPolyMarkerCssStyle() {
        if (this.show_well_poly_marker_point)
          return ("e-warning");
        else
          return ("e-outline");
      },
      markerWellPolyMarkerEventClick() {
        this.show_well_poly_marker_point = !this.show_well_poly_marker_point;
      },

      // ------------------------------------------------
      // checked/unchecked layer area
      // ------------------------------------------------
      setCheckedLayerStatus(item_area, status) {
        let nl = item_area["layers"].length;
        for (let i = 0; i < nl; i++) {
          item_area["layers"][i]["check"] = status;
        }
      },
      downloadSelectedLayers(item_area) {
        let layers = item_area["layers"];
        let nl = layers.length;
        this.selected_id_area = item_area.id_area;
        this.list_selected_layer = [];
        for (let i = 0; i < nl; i++) {
          let item = layers[i];
          if (!item.check)
            continue;

          this.list_selected_layer.push({
            idx: i,
            id_area: item.id_area,
            layer: item.layer,
            filename: item.filename,
            label: item.label,
          })
        }
        if (this.list_selected_layer.length === 0) {
          this.retStatus["title"] = "Information";
          this.retStatus["message"] = "No data selected";
          this.$refs.dialogMessage.showModal();
          return;
        }
        // console.log(JSON.stringify(this.list_selected_layer))
        this.httpDownloadLayerData();
      },
      downloadSelectedWell(item_area) {
        this.showLoader = true;
        let str_url = this.varRouter.getHttpType("well-list-info") + item_area["id_area"];
        this.$store.dispatch('http_get', [str_url, {}, this.event_http_well_download]).then();
      },
      downloadWellPoly() {
        this.showLoader = true;
        let str_url = this.varRouter.getHttpType("well-poly-download");
        this.$store.dispatch('http_get', [str_url, {}, this.event_http_well_poly_download]).then();
      },

      httpDownloadLayerData() {
        this.showLoader = true;
        let param = {
          // user: this.user["user"],
          data: this.list_selected_layer
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("probmap_multi"), param, this.event_http_layer_download]).then();
      },

      eventSelectedAreaCssStyle(item) {
        let fg_color = "#808080";
        if (item.layer_show)
          fg_color = item["poly"]["color"];

        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:100%;";
        return (strstyle);
      },
      eventSelectedAreaClicked(item) {
        let status = !item.layer_show; // select/unselect
        item.layer_show = status;
        this.tmp_array_autoupdate = [];
      },
      eventDownloadDataCssStyle(item) {
        let fg_color = "#808080";
        if (item.layer_available)
          fg_color = "#4169E1";
        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:100%;";
        return (strstyle);
      },
      eventDownloadDataClicked(item) {
        this.showLoader = true;
        this.selected_id_area = item["id_area"];
        let url_area_layer_list = this.varRouter.getHttpType("probmap-get-list") + this.selected_id_area;
        this.$store.dispatch('http_get', [url_area_layer_list, {}, this.event_http_probmap_get_list]).then();
      },
      eventDownloadHeatmapCssStyle(item) {
        let fg_color = "#808080";
        if (item.layer_available)
          fg_color = "#4169E1";
        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:100%;";
        return (strstyle);
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
      eventLayerShowHeatmapClicked(item_area, item) {
        item.show = !item.show;
        if (item.show) {
          this.selectedLayer["area"] = item_area.id_area;
          this.selectedLayer["area_name"] = item_area.name;
          this.selectedLayer["layer"] = item["layer"];
          this.selectedLayer["layer_name"] = item["label"];
        }
        this.tmp_array_autoupdate = [];
      },

      openSectionByCoord() {
        let routeData = this.$router.resolve({
          path: this.varRouter.getRoute("seismic-viewer-by-xy", 1),
          query: {
            area: this.selectedLayer["area"],
            layer: this.selectedLayer["layer"],
            label: this.selectedLayer["layer_name"],
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
      httpListArea() {
        this.showLoader = true;
        let param = {
          // user: this.user["user"],
          data: {}
        };
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("area-list"), param, this.event_http_area_list]).then();
        // this.$store.dispatch('http_get', ["/api/test/auth", param, this.event_http_area_list]).then();
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

        this.marker_drag_coord = getAreaFirstCoordinate(this.table_area);
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_area_list.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // LAYER HEATMAP DATA DOWNLOAD
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_layer_download.success, (msg) => {
        fillAreaLayerListWithHeatmapData(this.table_area, this.selected_id_area, this.list_selected_layer, msg.data)
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_layer_download.fail, (msg) => {
        this.showLoader = false;
        this.table_area = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROBMAP GET LIST
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_probmap_get_list.success, (msg) => {
        fillAreaLayerList(this.table_area, this.selected_id_area, msg.data);
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_probmap_get_list.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // WELL GET LIST
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_well_download.success, (msg) => {
        let n = msg.data.length;
        this.well_marker = [];
        for (let i = 0; i < n; i++) {
          let item = msg.data[i];
          this.well_marker.push({
            data: [[item.yst, item.xst], [item.yen, item.xen]],
            name: item["well_id"]
          })
        }
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_well_download.fail, (msg) => {
        this.well_marker = [];
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // WELL POLY GET LIST
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_well_poly_download.success, (msg) => {
        let n = msg.data.length;
        this.well_poly_marker = [];
        for (let i = 0; i < n; i++) {
          let item = msg.data[i];
          let tmp = [];
          let dmp_polyline = item["dmp"]["polyline"];
          for (let j = 0; j < dmp_polyline.length; j++)
            tmp.push([dmp_polyline[j][1], dmp_polyline[j][0]]);

          this.well_poly_marker.push({
            data: tmp,
            marker: item["dmp"]["marker"],
            name: item["label"]
          })
        }
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_well_poly_download.fail, (msg) => {
        this.well_poly_marker = [];
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_area_list.success);
      EventBus.$off(this.event_http_area_list.fail);
      EventBus.$off(this.event_http_probmap_get_list.success);
      EventBus.$off(this.event_http_probmap_get_list.fail);
      EventBus.$off(this.event_http_layer_download.success);
      EventBus.$off(this.event_http_layer_download.fail);
      EventBus.$off(this.event_http_well_download.success);
      EventBus.$off(this.event_http_well_download.fail);
      EventBus.$off(this.event_http_well_poly_download.success);
      EventBus.$off(this.event_http_well_poly_download.fail);

      this.showLoader = false;
    },
  }
</script>

<style>
  /*@import '../components/LeafletAwesomeMarker/leaflet.awesome-markers.css';*/
</style>

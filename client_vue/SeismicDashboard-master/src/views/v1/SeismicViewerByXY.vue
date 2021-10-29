<template>

  <div>
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :size="spinLoader.size"
      :active="showLoader"
      :background-color="spinLoader.background_color"/>

    <b-tabs v-model="tabIndex">
      <b-tab title="Propose Prospect" :title-link-class="linkClass(0)">
        <splitpanes class="default-theme" vertical style="height: 74vh" vertical>
          <pane class="scrollable p-2" min-size="20" max-size="40" style="background: white">
            <DynamicInputForMap :param="paramInput"
                                @onClickResetSection="dynamicInputOnClickResetSection"
                                @onClickSetParameter="dynamicInputOnClickSetParameter"
                                @onClickViewPropose="dynamicInputOnClickViewPropose"/>

            <template v-if="showLoader===false">
              <ProposeProspectInfo :param="proposeProspect" @onClickViewProspect="proposeProspectOnClickViewProspect"/>
            </template>
          </pane>
          <pane class="p-2" min-size="40" max-size="80" style="background: white">
            <div>
              <b-button-toolbar aria-label="Toolbar with button groups and input groups" class="mb-1">
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
                <enhanced-check label="Rev" style="height: 20px;" v-model="reverseColormap"
                                class="mr-2"></enhanced-check>

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

            <b-container fluid>
              <b-row>
                <template v-for="(seismic,index) in seismics">
                  <b-col>
                    <LChartSeismicAreaSelectedV31
                      class="lc_seismic_chart"
                      :id="index"
                      :colormap="colormap"
                      :title="getSeismicTitle(seismic)"
                      :points="seismic.cdp_data"
                      :xaxis="seismic.x"
                      :yaxis="seismic.y"
                      :boundaryX="boundaryX[index]"
                      :boundaryY="boundaryY"
                      :cmin="cmin"
                      :cmax="cmax"
                      :target="getSeismicTargetPos(index)"
                      @updateBoundaryX="updateBoundaryX"
                      @updateBoundaryY="updateBoundaryY"
                      :refreshChart="refreshChart"
                    />
                  </b-col>
                </template>
              </b-row>
            </b-container>
          </pane>
        </splitpanes>
      </b-tab>
      <b-tab title="View Prospect" :title-link-class="linkClass(1)">
        <splitpanes class="default-theme" vertical style="height: 76vh" vertical>
          <pane class="p-2" min-size="20" max-size="40" style="background: white">
            <!--            <b-card-header header-tag="header" class="p-0" role="tab">Layer List</b-card-header>-->
            <!--            <b-card-body>-->

            <div>
              <ejs-button cssClass='e-light' class="mr-2 mb-2" v-on:click.native='onUncheckAll'><i class="fa fa-square-o"/> Uncheck All
              </ejs-button>
            </div>

            <b-table
              sticky-header="50vh"
              show-empty
              :small="true"
              :striped="false"
              :bordered="true"
              :outlined="true"
              :fields="table_prospect_map_heder"
              :items="table_prospect_map">
              <template v-slot:cell(show)="row">
                  <span @click="eventSwitchLayerClicked(row.index, row.item)"
                        :style="eventSelectedLayerCssStyle(row.item)">
                    <template v-if="row.item.show">
                      <i class="btn_toolbar fa fa-toggle-on"/>
                    </template>
                    <template v-else>
                      <i class="btn_toolbar fa fa-toggle-off"/>
                    </template>
                  </span>
                <!--                  <b-form-checkbox switch @change="eventSwitchLayerClicked(row.item)">-->
                <!--                  </b-form-checkbox>-->
              </template>
            </b-table>

<!--            <div>-->
<!--              <div class="mb-2">CONFIDENCE RATING</div>-->
<!--              <StarRating v-model="confidence_score" :rating="confidence_score" :star-size="30" :show-rating="false" :maxRating="10" activeColor="#FF8C00"/>-->
<!--            </div>-->
<!--            <div>-->
<!--              <div class="mb-2 mt-3">NOTE</div>-->
<!--              <b-form-textarea-->
<!--                v-model="text_note"-->
<!--                placeholder="Enter something..."-->
<!--                rows="3"-->
<!--                max-rows="6"/>-->
<!--            </div>-->

            <div>
              <span class="mr-5">NPoint : <b>{{prospectScore.score.np}}</b></span>
              <span class="mr-5">Score : <b>{{prospectScore.score.score.toFixed(3)}}</b></span>
              <span>Area : <b>{{prospectScore.score.area.toFixed(3)}}</b></span>
            </div>
            <div class="mt-2">
              <ejs-button cssClass='e-danger' class="mr-2 mb-2" v-on:click.native='onClickComputeScore'>Compute Score
              </ejs-button>
              <ejs-button cssClass='e-success' class="mr-2 mb-2" v-on:click.native='saveProspectDialogShow'>Save</ejs-button>
            </div>
            <!--            </b-card-body>-->
          </pane>
          <pane class="p-2" min-size="40" max-size="80" style="background: white">

            <template v-if="showMapProspect">
              <div class="mb-1">
                <!-- map button -->
                <ejs-button :cssClass='markerLocationCssStyle()' class="mr-1"
                            v-on:click.native="markerLocationEventClick()"><i
                  class="fa fa-map-marker"/></ejs-button>
                <!--            <ejs-button cssClass='e-outline' class="mr-1" v-on:click.native="httpHeatmapData()"><i-->
                <!--              class="fa fa-download"/></ejs-button>-->
                <!--          <template v-if="show_marker_drag">-->
                <!--              <span class="ml-5"><b>x</b> : {{pageParam.lng.toFixed(2)}}   ,    <b>y</b> : {{pageParam.lat.toFixed(2)}}</span>-->
                <!--          </template>-->
              </div>

              <!--            <template v-for="(layer, index) in prospectMap.prob_list">-->
              <!--              {{prospectMap.layers[index]}}-{{index}}-->
              <!--            </template>-->
              <!-- layer map -->
              <l-map ref="map" style="width: 100%; height:72vh;" :zoom="map_var.zoom" :center="map_var.center"
                     :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom"
                     @ready="onMapReady" @click="onMapClickEvent">
                <l-control-scale position="bottomleft" :imperial="false" :metric="true"></l-control-scale>
<!--                <l-control position="topright" style="margin-top: 30px">-->
<!--                  <div class="options">-->
<!--                    <label>Radius ({{heatmapScale.radius.value}})</label><br/>-->
<!--                    <b-form-input style="width: 150px" v-model="heatmapScale.radius.value" type="range" :min="heatmapScale.radius.min" :max="heatmapScale.radius.max"></b-form-input>-->
<!--                    <label>Blur ({{heatmapScale.blur.value}})</label><br/>-->
<!--                    <b-form-input style="width: 150px" v-model="heatmapScale.blur.value" type="range" :min="heatmapScale.blur.min" :max="heatmapScale.blur.max"></b-form-input>-->
<!--                  </div>-->
<!--                </l-control>-->

                <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"/>
                <template v-if="show_marker_drag">
                  <l-marker :lat-lng="{lat: pageParam.lng, lng: pageParam.lat}" :draggable="false" :icon="markerDragIcon">
                    <l-popup>
                      <div style="width: 100%">
                        Lat (x) : <b>{{pageParam.lat.toFixed(2)}}</b><br>
                        Lon (y) : <b>{{pageParam.lng.toFixed(2)}}</b><br>
                      </div>
                    </l-popup>
                  </l-marker>
                </template>

                <!--              <template v-for="item in tmp_array_autoupdate">-->
                <!--              </template>-->

                <template v-for="layer in table_prospect_map">
                  <template v-if="layer.show===true">
                    <LHeatmap
                      :latLngs="layer.heatmap"
                      :radius="heatmapScale.radius.value"
                      :blur="heatmapScale.blur.value"
                      :minOpacity="0.1"
                      :max="1.0">
                    </LHeatmap>
                  </template>
                </template>
              </l-map>
            </template>
          </pane>
        </splitpanes>
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

    <!-- save prospect dialog -->
    <vue-form-dialog
      ref="saveProspectDialog"
      type="default"
      header="Save Prospect" body="Body"
      btn1_text="Close" btn2_text="Save"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="saveProspectDialogBtn1Click()" @btn2Click="saveProspectDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="save_prospect_schema" :model="save_prospect_model" :options="formOptions" @validated="onValidated"/>
            </span>
    </vue-form-dialog>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ButtonPlugin} from '@syncfusion/ej2-vue-buttons';
  Vue.use(ButtonPlugin);
  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";

  import {mapState} from "vuex";
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {createProspectMapData, getSectionData} from "../../libs/data";
  import EnhancedCheck from 'MyLibVue/src/views/vue-enhancedCheck/EnhancedCheck'
  import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
  import 'bootstrap-slider/dist/css/bootstrap-slider.css'
  import StarRating from 'MyLibVue/src/views/star-rating/star-rating'

  import {getColormapAsset, getColormapName} from "../../libs/colormap";

  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import DynamicInputForMap from "../myview/DynamicInputForMap";
  import {appDemoMode, getMapPinMarker} from "../../_constant/http_api";
  import {rotate} from "../../libs/2d-array-rotation";
  import {addPlotDataToProspectMap, createDefaultSectionAreaParameter, uncheckAllData} from "../../libs/libUpdateData";
  import {
    addShowKeyToLayer,
    createAreaLeafletDemoData,
    createDemoProposeProspect,
    createHeatmapDemoData
  } from "../../libs/demo_data";
  import ProposeProspectInfo from "../myview/ProposeProspectInfo";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'

  import VueLeafletMap from "../components/vue-leaflet-map"
  import LHeatmap from "../components/Vue2LeafletHeatmap";
  import * as L from "leaflet";
  import {LMap, LTileLayer, LMarker, LPolygon, LPopup, LTooltip, LControlScale, LControl} from 'vue2-leaflet'
  import {CRS} from "leaflet";
  import 'leaflet/dist/leaflet.css'
  import '@geoman-io/leaflet-geoman-free'
  import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
  import "../../libs/leaflet-measure";
  import "../../_assets/leaflet-measure.css";
  import {v4 as uuidv4} from 'uuid';
  import * as turf from "@turf/turf";
  import {createSaveProspectModel, createSaveProspectSchema, createTableProspectMapHeader} from "../../libs/libVars";
  import LChartSeismicAreaSelectedV31 from "../components/LChartSeismicAreaSelectedV3-1";

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  export default {
    name: "SeismicViewerByXY",

    components: {
      LChartSeismicAreaSelectedV31,
      ProposeProspectInfo,
      DynamicInputForMap,
      EnhancedCheck,
      bFormSlider,
      VueSimpleDialog,

      StarRating,
      Splitpanes, Pane,

      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,

      LMap,
      LTileLayer,
      LMarker,
      LPolygon,
      LPopup,
      LTooltip,
      LHeatmap,
      LControlScale,
      LControl
    },

    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
      user: state => state.user,
    }),

    data: () => {
      return {
        bvalidate: false,
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },
        heatmapScale :{
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

        save_prospect_model: createSaveProspectModel(),
        save_prospect_schema: createSaveProspectSchema(),

        bdemo: appDemoMode(),
        retStatus: {status: 0, title: "", message: "", data: []},
        showLoader: false,
        showMapProspect: false,

        // map variable
        map_var: {},
        prospectScore: {score: {np: 0, score: 0, area: 0}},
        geo_json: {},

        tabIndex: 0,
        pageParam: {
          area: -1,
          layer: -1,
          lat: 0,
          lng: 0,
        },
        markerDragIcon: L.icon({
          iconUrl: getMapPinMarker(),
          iconSize: [32, 36],
          iconAnchor: [16, 36]
        }),
        show_marker_drag: true,
        refreshChart: false,
        proposeProspect: {},
        prospectMap: {ndata: 0, layers: []},

        paramInput: createDefaultSectionAreaParameter(),
        datas: [],
        seismics: [],
        boundaryX: [
          {
            p1: 0,
            p2: 0,
          },
          {
            p1: 0,
            p2: 0,
          }
        ],
        boundaryY: {
          p1: 0,
          p2: 0,
        },
        colormap: {id: 3, reverse: false},
        perc: 0,
        reverseColormap: false,
        cmin: 20,
        cmax: 20,
        tmp_cmin: 20,
        tmp_cmax: 20,
        tmp_array_autoupdate: [],

        table_prospect_map_heder: createTableProspectMapHeader(),
        table_prospect_map: [],
        event_http_get_section: {success: "successGetSection", fail: "failGetSection"},
        event_http_propose_prospect: {success: "successProposeProspect", fail: "failProposeProspect"},
        event_http_prospect_map: {success: "successProspectMap", fail: "failProspectMap"},
        event_http_prospect_score: {success: "successProspectScore", fail: "failProspectScore"},
        event_http_save_prospect: {success: "successSaveProspect", fail: "failSaveProspect"},
      }
    },
    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },

    beforeMount: function () {
      this.map_var = createAreaLeafletDemoData();
      this.pageParam["area"] = this.$route.query.area * 1;
      this.pageParam["layer"] = this.$route.query.layer * 1;
      this.pageParam["label"] = this.$route.query.label;
      this.pageParam["lat"] = this.$route.query.lat * 1.0;
      this.pageParam["lng"] = this.$route.query.lng * 1.0;
      if (this.bdemo) {
        this.fillDataVariable(getSectionData());
        this.proposeProspect = createDemoProposeProspect();
        this.prospectMap = createProspectMapData();
        this.table_prospect_map = addPlotDataToProspectMap(this.map_var, this.prospectMap);
        // this.prospectMap["prob_list"] = addShowKeyToLayer(this.prospectMap["prob_list"]);

        this.tabIndex = 1;
        this.showLoader = false;
        this.showMapProspect = true;
      } else
        this.httpGetSection();
    },
    methods: {
      onValidated(isValid, errors) {
        this.bvalidate = isValid;
      },
      saveProspectDialogShow()
      {
        this.$refs.saveProspectDialog.showModal();
      },

      saveProspectDialogBtn1Click() {
        this.$refs.saveProspectDialog.hideModal();
      },
      saveProspectDialogBtn2Click() {
        if (!this.bvalidate) return;

        if(this.save_prospect_model["name"].trim().length === 0)
          return;

        this.onClickSaveProject();
        this.$refs.saveProspectDialog.hideModal();
      },
      onClickSaveProject()
      {
        let param = {
          user: this.user["user"],
          data: this.proposeProspect,
          score: this.prospectScore.score,
          marker: this.pageParam,
          name: this.save_prospect_model["name"],
          group: this.save_prospect_model["group"],
        };
        param["data"]["geojson"] = this.geo_json;
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("prospect-save"), param, this.event_http_save_prospect]).then();
      },

      convertLayerToLeafletPopup(layer) {
        let geo_json = layer.toGeoJSON(16);
        let geom_type = geo_json["geometry"]["type"];
        let geom_polygon = geo_json["geometry"]["coordinates"];
        let polygon = turf.polygon(geom_polygon);
        let area = turf.area(polygon);
        let line = turf.lineString(geom_polygon[0]);
        let length_meters = turf.length(line, {units: 'meters'});
        let length_miles = turf.length(line, {units: 'miles'});

        let html_string = `Type : <b>${geom_type}</b><br>`;
        html_string = html_string + `Point : <b>${geom_polygon[0].length}</b><br>`;
        html_string = html_string + `Area : <br>`;
        html_string = html_string + `<b>${(area).toLocaleString()}</b> m<sup>2</sup><br>`;
        html_string = html_string + `<b>${(area / (1e+4)).toLocaleString()}</b> ha<br>`;
        html_string = html_string + `Length : <br>`;
        html_string = html_string + `<b>${(length_meters).toLocaleString()}</b> meters<br>`;
        html_string = html_string + `<b>${(length_miles).toLocaleString()}</b> miles<br>`;
        return (html_string);
      },
      mapUpdated(event) {
        // add listeners on creation and delete on removal
        if (event.type === 'pm:create') {
          event.layer.on('pm:edit', this.mapUpdated);

          // add data
          event.layer.properties = {
            shape: event.shape
          };

          // radius for circles
          if (event.shape === 'Circle') {
            event.layer.properties.radius = event.layer.getRadius();
          }

          event.layer.internalId = uuidv4();
          this.geo_json = event.layer.toGeoJSON(16);
          // console.log(JSON.stringify(this.geo_json))

          event.layer.bindPopup(this.convertLayerToLeafletPopup(event.layer));
          // console.log("create")
        } else if (event.type === 'pm:edit') {
          // console.log("edit")
          event.layer.bindPopup(this.convertLayerToLeafletPopup(event.layer));
          this.geo_json = event.layer.toGeoJSON(16);
          // console.log(JSON.stringify(this.geo_json))
        } else if (event.type === 'pm:remove') {
          event.layer.off(); // remove all event listeners
        }

        let geo_json_data = this.getDataAsGeoJSON();
        // for (let i = 0; i < geo_json_data.features.length; i++) {
        //   let item = geo_json_data.features[i];
        //   let polygon = turf.polygon(item.geometry.coordinates);
        //   let area = turf.area(polygon);
        //   geo_json_data.features.area = area;
        // }
        // console.log(JSON.stringify(geo_json_data));

        // emit event
        this.$emit('change', geo_json_data);
      },
      // export data as GeoJSON object
      getDataAsGeoJSON() {
        // create FeatureCollection
        const geoJSON = {
          type: 'FeatureCollection',
          features: []
        };

        // export each layer
        this.map.eachLayer(function (layer) {
          if (layer.internalId && (layer instanceof L.Path || layer instanceof L.Marker)) {
            const geoJSONShape = layer.toGeoJSON(16); // to precise geo shape!
            geoJSONShape.properties = layer.properties;
            geoJSONShape.id = layer.internalId;
            geoJSON.features.push(geoJSONShape);

            // normalize coordinates (> 180/>90)
            // TODO
          }
        });

        this.geoJsonCoord = geoJSON;
        return geoJSON;
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

        this.map.pm.addControls({
          position: 'topleft',
          drawMarker: false,
          drawCircleMarker: false,
          drawPolyline: false,
          drawRectangle: true,
          drawCircle: false,
          cutPolygon: false
        });
        this.map.pm.setPathOptions({
          color: 'orange',
          fillColor: 'orange',
          fillOpacity: 0.4,
        });

        // listen to events
        this.map.on('pm:create', this.mapUpdated);
        this.map.on('pm:remove', this.mapUpdated);
        this.map.on('pm:cut', this.mapUpdated);

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
      onMapClickEvent(event) {
        // if (this.show_marker_drag)
        //   this.marker_drag_coord = event.latlng;
      },

      dialogMessageBtn1Click() {
        this.$refs.dialogMessage.hideModal();
      },

      linkClass(idx) {
        if (this.tabIndex === idx) {
          return ['bg-primary', 'text-light']
        } else {
          return ['bg-light', 'text-info']
        }
      },
      eventSelectedLayerCssStyle(item) {
        let fg_color = "#808080";
        if (item.show)
          fg_color = "#4169E1";
        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:100%;";
        return (strstyle);
      },
      eventSwitchLayerClicked(index, item) {
        let status = !item.show;
        item.show = status;
        // this.prospectMap.layers[index].show = status;

        // this.tmp_array_autoupdate = [];
        // console.log(JSON.stringify(this.prospectMap.layers[index]))
      },
      updateProspectMapLayerShow(item) {
        item.show = !item.show;
      },
      getSeismicTargetPos(idx) {
        if (idx === 0)
          return (this.seismics[1]["cdp_no"] * 1);
        else
          return (this.seismics[0]["cdp_no"] * 1);
      },
      getSeismicTitle(s) {
        return (s["title"] + " " + s["cdp_no"]);
      },
      updateBoundaryX(ii, val) {
        this.boundaryX[ii] = val;
        this.paramInput[ii]["vmin"] = val["p1"];
        this.paramInput[ii]["vmax"] = val["p2"];
      },
      updateBoundaryY(ii, val) {
        this.boundaryY = val;
        this.paramInput[2]["vmin"] = val["p1"];
        this.paramInput[2]["vmax"] = val["p2"];
      },
      updateRefreshChart(val) {
        this.refreshChart = val;
      },

      dynamicInputOnClickResetSection(val) {
        this.createDefaultBoundaryParameter();
        this.refreshChart = !this.refreshChart;
      },
      dynamicInputOnClickSetParameter(val) {
        console.log(JSON.stringify(val));
      },
      dynamicInputOnClickViewPropose(val) {
        if (this.bdemo) {
          this.proposeProspect = createDemoProposeProspect();
        } else {
          this.httpGetProposeProspect(val);
        }
      },
      proposeProspectOnClickViewProspect(val) {
        if (_.isEmpty(val)) {
          this.retStatus["title"] = "Information";
          this.retStatus["message"] = "Please create 'Propose Prospect' data";
          this.$refs.dialogMessage.showModal();
          return;
        }

        if (this.bdemo) {
          this.prospectMap = createProspectMapData();
          this.tabIndex = 1;
        } else
          this.httpGetProspectMap(val);
      },

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

      onClickComputeScore() {
        let param = {
          // user: this.user["user"],
          data: this.proposeProspect
        };
        param["data"]["geojson"] = this.geo_json;
        // param["data"]["polygon"] = this.geo_json["geometry"]["coordinates"][0];
        // console.log(JSON.stringify(param))
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("potprosp-score"), param, this.event_http_prospect_score]).then();
      },
      httpGetSection() {
        let param = {
          "state": 0,
          "type": "/api/probmap/find-sandbox",
          "mesg": "",
          // "user": this.user["user"],
          "data": {
            "id_area": this.pageParam["area"],
            "layer": this.pageParam["layer"],
            "x": this.pageParam["lat"],
            "y": this.pageParam["lng"],
            // "x": 550766.97,
            // "y": 9912090.44
          }
        };
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("probmap_sandbox"), param, this.event_http_get_section]).then();
      },
      httpGetProposeProspect(val) {
        let param = {
          // user: this.user["user"],
          data: {
            id_area: this.pageParam["area"],
            layer: this.pageParam["layer"],
            xline: {
              min: val[0]["vmin"],
              max: val[0]["vmax"],
            },
            iline: {
              min: val[1]["vmin"],
              max: val[1]["vmax"],
            },
            z: {
              min: val[2]["vmin"],
              max: val[2]["vmax"],
            },
          }
        };
        // console.log(JSON.stringify(param))
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("potprosp-propose"), param, this.event_http_propose_prospect]).then();
      },

      httpGetProspectMap(val) {
        let param = {
          // user: this.user["user"],
          data: this.proposeProspect
        }
        this.showLoader = true;
        this.showMapProspect = false
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("potprosp-data"), param, this.event_http_prospect_map]).then();
      },

      createDefaultBoundaryParameter() {
        let tstart = 0;
        let tend = 0;
        let ns, ntrc, dt;
        for (let i = 0; i < this.datas.length; i++) {
          ns = this.seismics[i]["ns"];
          ntrc = this.seismics[i]["ntrace"];
          dt = this.seismics[i]["y"]["sampling"];
          let tmpx1 = Math.floor(this.seismics[i]["idx_st"] + Math.round(ntrc / 2));
          let tmpx2 = Math.floor(this.seismics[i]["idx_en"] - Math.round(ntrc / 2));

          tstart = this.seismics[i]["y"]["start"] * dt;
          tend = (this.seismics[i]["ns"] - this.seismics[i]["y"]["start"]) * dt;
          this.paramInput[i]["min"] = this.seismics[i]["idx_st"];
          this.paramInput[i]["max"] = this.seismics[i]["idx_en"];
          this.paramInput[i]["vmin"] = tmpx1;
          this.paramInput[i]["vmax"] = tmpx2;


          this.boundaryX[i]["p1"] = tmpx1;
          this.boundaryX[i]["p2"] = tmpx2;
        }
        let tmpy1 = Math.floor(tstart + Math.round(ns * dt / 3));
        let tmpy2 = Math.floor(tend - Math.round(ns * dt / 3));
        this.paramInput[2]["min"] = tstart;
        this.paramInput[2]["max"] = tend;
        this.paramInput[2]["vmin"] = tmpy1;
        this.paramInput[2]["vmax"] = tmpy2;
        this.boundaryY["p1"] = tmpy1;
        this.boundaryY["p2"] = tmpy2;
      },
      fillDataVariable(tmp) {
        this.datas = tmp;
        this.seismics = this.datas;
        for (let i = 0; i < this.datas.length; i++) {
          this.seismics[i]["cdp_data"] = rotate(this.datas[i]["cdp_data"], -90);
          this.seismics[i]["x"]["data"] = this.seismics[i]["cdp_header"];
        }
        this.createDefaultBoundaryParameter();
      },

      onUncheckAll()
      {
        uncheckAllData(this.table_prospect_map);
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

      EventBus.$on(this.event_http_get_section.success, (msg) => {
        this.fillDataVariable(msg.data);
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_get_section.fail, (msg) => {
        this.datas = [];
        this.seismics = [];
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
      EventBus.$on(this.event_http_propose_prospect.success, (msg) => {
        // this.fillDataVariable(msg.data);
        this.proposeProspect = msg.data;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_propose_prospect.fail, (msg) => {
        this.showLoader = false;
        this.proposeProspect = {};
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
      EventBus.$on(this.event_http_prospect_map.success, (msg) => {
        this.prospectMap = msg.data;
        this.map_var = createAreaLeafletDemoData();
        this.table_prospect_map = addPlotDataToProspectMap(this.map_var, this.prospectMap);
        this.tabIndex = 1;
        this.showLoader = false;
        this.showMapProspect = true;
      });
      EventBus.$on(this.event_http_prospect_map.fail, (msg) => {
        this.showLoader = false;
        this.prospectMap = {};
        this.retStatus = msg;
        this.showMapProspect = false;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http_prospect_score.success, (msg) => {
        this.prospectScore = msg.data;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_prospect_score.fail, (msg) => {
        this.showLoader = false;
        this.prospectScore = {score: {np: 0, score: 0, area:0}};
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http_save_prospect.success, (msg) => {
        // this.prospectMap = msg.data;
        // this.table_prospect_map = addPlotDataToProspectEdit(this.prospectMap);

        this.showLoader = false;
        // this.showMapProspect = true;
      });
      EventBus.$on(this.event_http_save_prospect.fail, (msg) => {
        this.showLoader = false;
        // this.prospectMap = {};
        // this.table_prospect_map = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },
    beforeDestroy() {
      EventBus.$off(this.event_http_propose_prospect.success);
      EventBus.$off(this.event_http_propose_prospect.fail);
      EventBus.$off(this.event_http_prospect_map.success);
      EventBus.$off(this.event_http_prospect_map.fail);
      EventBus.$off(this.event_http_prospect_score.success);
      EventBus.$off(this.event_http_prospect_score.fail);
      EventBus.$off(this.event_http_save_prospect.success);
      EventBus.$off(this.event_http_save_prospect.fail);
    },
    watch:
      {
        reverseColormap: function (val) {
          this.reverseColormap = val;
          this.setColormap(this.colormap["id"]);
        },
      }
  }
</script>

<style lang="scss" scoped>
  .lc_seismic_chart {
    height: 71vh;
    width: 100%;
  }

  .btn_toolbar {
    font-size: 1.4em;
  }

  .scrollable {
    overflow-y: auto;
    max-height: 100%;
  }
</style>

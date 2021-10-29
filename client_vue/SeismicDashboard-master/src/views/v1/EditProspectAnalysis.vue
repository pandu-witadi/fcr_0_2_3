<template>
  <div>
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <splitpanes class="default-theme" vertical style="height: 82vh" vertical>
      <pane class="p-2" min-size="20" max-size="50" style="background: white">

        <b-tabs v-model="tabIndex" class="scrollable">
          <b-tab title="Edit" :title-link-class="linkClass(0)">
            <div>
              <div class="container-fluid pt-2 pb-2" style="background-color: white">
                <table>
                  <tr>
                    <td style="width: 100px">User</td>
                    <td>:</td>
                    <td><b>{{prospectAnalysis.userId}}</b></td>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td>:</td>
                    <td><b>{{prospectAnalysis.name}}</b></td>
                  </tr>
                  <tr>
                    <td>Layer</td>
                    <td>:</td>
                    <td><b>{{prospectAnalysis.layer}}</b></td>
                  </tr>
                  <tr>
                    <td>Group</td>
                    <td>:</td>
                    <td><b>{{prospectAnalysis.group}}</b></td>
                  </tr>
                  <tr>
                    <td>Filename</td>
                    <td>:</td>
                    <td><b>{{prospectAnalysis.filename}}</b></td>
                  </tr>
                  <tr>
                    <td>Score</td>
                    <td>:</td>
                    <td><b>{{prospectAnalysis.score}}</b></td>
                  </tr>
                  <tr>
                    <td>Area</td>
                    <td>:</td>
                    <td><b>{{prospectAnalysis.area}}</b></td>
                  </tr>
                </table>
              </div>
              <b-tabs pills card vertical>
                <b-tab title="Probability" active>
                  <b-card-text>
                    <ViewAnalysisInput :param="prospectAnalysis.dmp.analysis.probability"/>
                  </b-card-text>
                </b-tab>
                <b-tab title="Substack">
                  <b-card-text>
                    <ViewAnalysisInput :param="prospectAnalysis.dmp.analysis.substack"/>
                  </b-card-text>
                </b-tab>
                <b-tab title="AVA">
                  <b-card-text>
                    <ViewAnalysisInput :param="prospectAnalysis.dmp.analysis.AVA"/>
                  </b-card-text>
                </b-tab>
                <b-tab title="Sweetness">
                  <b-card-text>
                    <ViewAnalysisInput :param="prospectAnalysis.dmp.analysis.sweetness"/>
                  </b-card-text>
                </b-tab>
                <b-tab title="Well Analogy">
                  <b-card-text>
                    <ViewAnalysisInput :param="prospectAnalysis.dmp.analysis.well_analogy"/>
                  </b-card-text>
                </b-tab>
              </b-tabs>
              <div class="container-fluid p-2 text-right" style="background-color: white;">
                <ejs-button cssClass='e-success' v-on:click.native='updateProspectAnalysisValue'>Update</ejs-button>
              </div>
              <ProposeProspectInfo :param="proposeProspect" class="mt-2" :showButton="false"/>
            </div>
          </b-tab>
          <b-tab title="Data by FIELD" :title-link-class="linkClass(1)">
            <div class="scrollable">
              <div>
                <ejs-button cssClass='e-outline' class="mr-2 mb-2" v-b-tooltip.hover title="Remove all heatmap view"
                            v-on:click.native='onUncheckAll'><i class="fa fa-square-o"/>
                </ejs-button>
                <ejs-button cssClass='e-outline' class="mr-2 mb-2" v-b-tooltip.hover title="Update prospect data"
                            v-on:click.native='onClickSaveProject'><i class="fa fa-edit"/>
                </ejs-button>
                <ejs-button cssClass='e-outline' class="mr-2 mb-2" v-b-tooltip.hover title="Open gather in the new page"
                            v-on:click.native='onClickViewGather'><i class="fa fa-image"/>
                </ejs-button>
                <ejs-button cssClass='e-outline' class="mr-2 mb-2" v-b-tooltip.hover
                            title="Refresh probability data"
                            v-on:click.native='httpGetProspectData'><i class="fa fa-refresh"/>
                </ejs-button>
              </div>
              <div>
                <span class="mr-3">NPoint : <b>{{proposeProspect.score.np}}</b></span>
                <span class="mr-3">Score : <b>{{proposeProspect.score.score.toFixed(3)}}</b></span>
                <span>Area : <b>{{proposeProspect.score.area.toFixed(3)}}</b></span>
              </div>

              <b-table
                responsive
                sticky-header="30vh"
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
                </template>
              </b-table>

              <b-card no-body class="text-center">
                <b-card-header no-body><strong>Well Analogy</strong></b-card-header>
                <div class="p-1">
                  <div>
                    <ejs-button cssClass='e-outline' class="mr-2 mb-1" v-b-tooltip.hover title="Delete all well analogy"
                                v-on:click.native='dialogClearWellAnalogyShow'><i class="fa fa-trash"/>
                    </ejs-button>
                    <ejs-button cssClass='e-outline' class="mr-2 mb-1" v-b-tooltip.hover
                                title="Refresh well analogy data"
                                v-on:click.native='httpGetListWellAnalogyData'><i class="fa fa-refresh"/>
                    </ejs-button>

                    <ejs-button cssClass='e-outline' class="ml-2 mr-2 mb-1" v-b-tooltip.hover
                                title="Show well analogy chart"
                                v-on:click.native='viewWellAnalogy'><i class="fa fa-line-chart"/>
                    </ejs-button>
                  </div>
                  <b-table
                    responsive
                    sticky-header="28vh"
                    show-empty
                    :small="true"
                    :striped="false"
                    :bordered="true"
                    :outlined="true"
                    :fields="table_wa_header"
                    :items="table_wa">
                    <template #cell(index)="row">
                      {{ row.index + 1 }}
                    </template>
                  </b-table>
                </div>
              </b-card>
            </div>
          </b-tab>

          <b-tab title="Probability List" :title-link-class="linkClass(2)">
            <div>
              <div class="mb-1">
                <ejs-button cssClass='e-outline' class="mr-1"
                            v-on:click.native="setCheckedLayerStatus(obj_area[0],false)">
                  <i class="fa fa-square-o" v-b-tooltip.hover title="Unselect all"/>
                </ejs-button>
                <ejs-button cssClass='e-outline' class="mr-1"
                            v-on:click.native="setCheckedLayerStatus(obj_area[0],true)">
                  <i class="fa fa-check-square" v-b-tooltip.hover title="Select all"/>
                </ejs-button>
                <ejs-button cssClass='e-outline' class="mr-1" v-on:click.native="eventDownloadLayerListClicked()">
                  <i class="fa fa-cloud-download" v-b-tooltip.hover title="Download layer list"/>
                </ejs-button>

                <ejs-button cssClass='e-outline' class="ml-3 mr-1"
                            v-on:click.native="downloadSelectedLayers(obj_area[0])">
                  <i class="fa fa-download" v-b-tooltip.hover title="Download selected data"/>
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
                       :items="obj_area[0].layers">

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
                          @click="eventLayerShowHeatmapClicked(obj_area[0], rowc.item)">
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
          </b-tab>
        </b-tabs>
      </pane>
      <pane class="p-2" min-size="50" max-size="80" style="background: white">
        <template v-if="showMapProspect">
          <div class="mb-1">
            <ejs-button :cssClass='setToggleButtonStyle(show_marker_center)' class="mr-1"
                        v-on:click.native="markerCenterLocationEventClick()" v-b-tooltip.hover
                        title="Prospect center location"><i
              class="fa fa-street-view"/></ejs-button>
            <ejs-button :cssClass='setToggleButtonStyle(show_marker_drag)' class="mr-1"
                        v-on:click.native="markerLocationEventClick()" v-b-tooltip.hover title="Map marker position"><i
              class="fa fa-map-marker"/></ejs-button>

            <!--            <ejs-button cssClass='e-outline' class="ml-3 mr-1" v-on:click.native="downloadSelectedWell()">-->
            <!--              <i class="fa fa-podcast" v-b-tooltip.hover title="Download well"/>-->
            <!--            </ejs-button>-->
            <!--            <ejs-button :cssClass='markerWellCssStyle()' class="mr-1"-->
            <!--                        v-on:click.native="markerWellEventClick()"><i-->
            <!--              class="fa fa-deviantart" v-b-tooltip.hover title="Show or hide well"/></ejs-button>-->
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
          <l-map ref="map" style="width: 100%; height:82vh;" :zoom="map_var.zoom" :center="map_var.center"
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

            <template v-if="show_marker_center">
              <l-marker :lat-lng="{lat: proposeProspect.marker.lng, lng: proposeProspect.marker.lat}" :draggable="false"
                        :icon="markerCenterIcon">
                <l-popup>
                  <div style="width: 100%">
                    Lat (x) : <b>{{proposeProspect.marker.lat.toFixed(2)}}</b><br>
                    Lon (y) : <b>{{proposeProspect.marker.lng.toFixed(2)}}</b><br>
                    Area : <b>{{proposeProspect.marker.area}}</b><br>
                    Layer : <b>{{proposeProspect.marker.layer}}</b><br>
                    <b>{{proposeProspect.marker.label}}</b>
                  </div>
                </l-popup>
              </l-marker>
            </template>
            <template v-if="show_marker_drag">
              <l-marker :lat-lng="{lat: marker_drag_coord.lng, lng: marker_drag_coord.lat}" :draggable="false"
                        :icon="markerDragIcon">
                <l-popup :options="{className: 'customPopup'}">
                  <div style="width: 100%">
                    Lat (x) : <b>{{marker_drag_coord.lat.toFixed(2)}}</b><br>
                    Lon (y) : <b>{{marker_drag_coord.lng.toFixed(2)}}</b><br>

                    <template v-if="isValidGatherDataFromMarker()">
                      Iline : <b>{{marker_drag_coord.gather.iline}}</b><br>
                      Xline : <b>{{marker_drag_coord.gather.xline}}</b><br>
                      <b-input-group prepend="Z Min" size="sm">
                        <b-form-input v-model="marker_drag_coord.gather.z.min"/>
                      </b-input-group>
                      <b-input-group prepend="Z Max" size="sm">
                        <b-form-input v-model="marker_drag_coord.gather.z.max"/>
                      </b-input-group>
                      <b-input-group prepend="Label" size="sm">
                        <b-form-input v-model="marker_drag_coord.label"/>
                      </b-input-group>

                      <b-button class="btn btn-sm mt-2 mr-2" variant="success" @click="httpOpenGatherFromMapMarker()">
                        Open
                        Gather
                      </b-button>
                      <!--                    <b-button class="btn btn-sm mt-2" variant="warning" @click="editOpenGatherDialogShow()">Edit-->
                      <!--                    </b-button>-->
                    </template>
                    <template v-else>
                      <b-button class="btn btn-sm mt-2" variant="primary" @click="httpFindGatherFromMapMarker()">Find
                        Gather
                      </b-button>
                    </template>
                  </div>
                </l-popup>
              </l-marker>
            </template>

            <template v-for="layer in table_prospect_map">
              <template v-if="layer.show===true">
                <LHeatmap
                  :latLngs="layer.heatmap"
                  :radius="heatmapScale.radius.value*1"
                  :blur="heatmapScale.blur.value*1"
                  :minOpacity="0.1"
                  :max="heatmap_range[layer.cmap].max">
                </LHeatmap>
              </template>
            </template>

            <template v-if="show_well_marker">
              <template v-for="wellmarker in well_marker">
                <l-polyline :lat-lngs="wellmarker.data" color="red" :weight="2">
                  <l-tooltip :options="{permanent: 'true', opacity: 0.6, className: 'my-labels'}">{{wellmarker.name}}
                  </l-tooltip>
                </l-polyline>
              </template>
            </template>

            <template v-for="area in obj_area">
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
    <!-- show error dialog -->
    <vue-simple-dialog
      ref="dialogWellAnalogy"
      type="primary"
      header="Question" body="Body"
      btn1_text="No"
      btn1_style="danger"
      btn2_text="Yes"
      btn2_style="success"
      @btn1Click="dialogClearWellAnalogyBtn1Click()" @btn2Click="dialogClearWellAnalogyBtn2Click()">
              <span slot="slot-body">
                <h5>Do you want to delete all well analogy data ?</h5>
              </span>
    </vue-simple-dialog>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ButtonPlugin} from '@syncfusion/ej2-vue-buttons';

  Vue.use(ButtonPlugin);

  import {mapState} from "vuex";
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {createProspectEditDemoData, createProspectMapData, getSectionData} from "../../libs/data";
  import LChartSeismicAreaSelected from "../components/LChartSeismicAreaSelected";
  import EnhancedCheck from 'MyLibVue/src/views/vue-enhancedCheck/EnhancedCheck'
  import StarRating from 'MyLibVue/src/views/star-rating/star-rating'
  import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
  import 'bootstrap-slider/dist/css/bootstrap-slider.css'
  import {forEach} from 'lodash';
  import {getColormapAsset, getColormapName} from "../../libs/colormap";

  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import DynamicInputForMap from "../myview/DynamicInputForMap";
  import {appDemoMode, getMapPinMarker, getWellPinMarker} from "../../_constant/http_api";
  import {rotate} from "../../libs/2d-array-rotation";
  import {
    addPlotDataToProspectEdit,
    addPlotDataToProspectEditMultiData,
    addPlotDataToProspectMap,
    createDefaultSectionAreaParameter,
    fillAreaLayerList,
    fillAreaLayerListWithHeatmapData,
    fillLeafletProspectMapVariable,
    uncheckAllData
  } from "../../libs/libUpdateData";
  import {
    addShowKeyToLayer,
    createAreaLeafletDemoData,
    createDemoProposeProspect,
    createHeatmapDemoData, createProspectAnalysisDemoData, getSampleGeoJson
  } from "../../libs/demo_data";
  import ProposeProspectInfo from "../myview/ProposeProspectInfo";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'

  import VueLeafletMap from "../components/vue-leaflet-map"
  import LHeatmap from "../components/Vue2LeafletHeatmap";
  import * as L from "leaflet";
  import {LMap, LTileLayer, LMarker, LPolygon, LPopup, LTooltip, LControlScale, LControl, LPolyline} from 'vue2-leaflet'
  import {CRS} from "leaflet";
  import 'leaflet/dist/leaflet.css'
  import '@geoman-io/leaflet-geoman-free'
  import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
  import "../../libs/leaflet-measure";
  import "../../_assets/leaflet-measure.css";
  import {v4 as uuidv4} from 'uuid';
  import * as turf from "@turf/turf";
  import {
    createEditOpenGatherSchema,
    createTableLayerListHeader_V1,
    createTableProspectMapHeader, createTableWellAnalogyHeader
  } from "../../libs/libVars";
  import {readProspectData, saveProspectData} from "../../_constant/active_user";

  import '../components/LeafletAwesomeMarker/leaflet.awesome-markers.css'
  import '../components/LeafletAwesomeMarker/leaflet.awesome-markers'
  import ViewAnalysisInput from "../myview/ViewAnalysisInput";

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  export default {
    name: "EditProspectAnalysis",

    components: {
      ProposeProspectInfo,
      DynamicInputForMap,
      LChartSeismicAreaSelected,
      EnhancedCheck,
      bFormSlider,
      VueSimpleDialog,
      StarRating,

      Splitpanes, Pane,
      ProposeProspectInfo,
      ViewAnalysisInput,
      // VueFormDialog,
      // "vue-form-generator": VueFormGenerator.component,

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

    data: () => {
      return {
        bvalidate: false,
        bdemo: appDemoMode(),
        retStatus: {status: 0, title: "", message: "", data: []},
        showLoader: false,
        showMapProspect: false,

        table_layer_headers: createTableLayerListHeader_V1(),
        obj_area: [],
        selectedLayer: {
          area: -1,
          area_name: "",
          layer: -1,
          layer_name: ""
        },
        list_selected_layer: [],

        perPage: 500,
        currentPage: 1,
        show_well_marker: false,
        show_well_poly_marker: false,
        show_well_poly_marker_point: false,
        well_marker: [],
        well_poly_marker: [],
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
        // map variable
        map_var: {},
        prospectScore: {score: {np: 0, score: 0, area: 0}},
        geo_json: {},

        tabIndex: 0,
        pageParam: {
          id: "",
        },
        objParam: {},
        markerCenterIcon: L.AwesomeMarkers.icon({
          icon: 'street-view',
          prefix: 'fa',
          markerColor: 'orange'
        }),
        markerDragIcon: L.AwesomeMarkers.icon({
          icon: 'map-marker',
          prefix: 'fa',
          markerColor: 'purple'
        }),
        markerWellIcon: L.icon({
          iconUrl: require('../../_assets/images/marker_btomato.png'),
          iconSize: [24, 27],
          iconAnchor: [12, 27]
        }),
        show_geo_json: true,

        show_marker_center: true,
        show_marker_drag: false,
        marker_drag_coord: {lat: 0, lng: 0, label: "", gather: {z: {min: 0, max: 0}}},
        refreshChart: false,
        proposeProspect: {},
        prospectMap: {ndata: 0, layers: []},
        heatmap_range: [],

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

        table_wa_header: createTableWellAnalogyHeader(),
        table_wa: [],

        edit_open_gather_schema: createEditOpenGatherSchema(),
        edit_open_gather_model: {},
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },
        prospectAnalysis: {
          dmp: {
            analysis: {}
          }
        },

        event_http_get_section: {success: "successGetSection", fail: "failGetSection"},
        event_http_propose_prospect: {success: "successProposeProspect", fail: "failProposeProspect"},
        event_http_prospect_map: {success: "successProspectMap", fail: "failProspectMap"},
        event_http_prospect_score: {success: "successProspectScore", fail: "failProspectScore"},
        event_http_save_prospect: {success: "successSaveProspect", fail: "failSaveProspect"},
        event_http_find_gather_from_latlng: {success: "successFindGatherFromLatLng", fail: "failFindGatherFromLatLng"},
        event_http_well_download: {success: "successWellDownload", fail: "failWellDownload"},
        event_http_probmap_get_list: {success: "successProbmapGetList", fail: "failProbmapGetList"},
        event_http_layer_download: {success: "successLayerDownload", fail: "failLayerDownload"},
        event_http_wa_data: {success: "successWaData", fail: "failWaData"},
        event_http_wa_delete: {success: "successWaDelete", fail: "failWaDelete"},
        event_http_well_poly_download: {success: "successWellPolyDownload", fail: "failWellPolyDownload"},
        event_http_prospect_analysis: {success: "successProspectAnalysis", fail: "failProspectAnalysis"},
        event_http_prospect_update_star: {success: "successProspectUpdateStar", fail: "failProspectUpdateStar"},
      }
    },
    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },

    beforeMount: function () {
      this.map_var = createAreaLeafletDemoData();
      this.map_var.zoom = 14;

      this.pageParam["id"] = this.$route.query.id;
      this.objParam = readProspectData(this.pageParam["id"]);
      this.proposeProspect = this.objParam["dmp"];
      this.geo_json = this.proposeProspect["geojson"];
      this.marker_drag_coord = {
        lat: this.proposeProspect["marker"].lat,
        lng: this.proposeProspect["marker"].lng,
        label: "",
        gather: {z: {min: 0, max: 0}}
      };
      this.map_var = fillLeafletProspectMapVariable(this.map_var, this.proposeProspect, 0);

      this.obj_area = [];
      this.obj_area.push({
        id_area: this.objParam["id_area"],
        layers: []
      });
      if (this.bdemo) {
        this.prospectAnalysis = createProspectAnalysisDemoData();
        this.prospectMap = createProspectEditDemoData();
        this.table_prospect_map = addPlotDataToProspectEditMultiData(this.prospectMap);
        this.heatmap_range = this.prospectMap.v_min_max;

        this.tabIndex = 0;
        this.showLoader = false;
        this.showMapProspect = true;
      } else {
        // this.httpGetProspectData();
        this.httpGetProspectAnalysisData();
      }
    },

    methods: {
      updateProspectAnalysisValue()
      {
        let param = {
          user: this.user["user"],
          data: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"],
            analysis: this.prospectAnalysis["dmp"]["analysis"]
          }
        };

        // console.log(JSON.stringify(this.prospectAnalysis))
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("prospect-update-star"), param, this.event_http_prospect_update_star]).then();
      },
      httpGetProspectAnalysisData() {
        let param = {
          // user: this.user["user"],
          data: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"]
          }
        };

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("prospect-analysis"), param, this.event_http_prospect_analysis]).then();
      },

      linkClass(idx) {
        if (this.tabIndex === idx) {
          return ['bg-primary', 'text-light']
        } else {
          return ['bg-light', 'text-info']
        }
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
      eventDownloadLayerListClicked() {
        this.showLoader = true;
        let url_area_layer_list = this.varRouter.getHttpType("probmap-get-list") + this.objParam["id_area"];
        this.$store.dispatch('http_get', [url_area_layer_list, {}, this.event_http_probmap_get_list]).then();
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
      downloadSelectedLayers(item_area) {
        let layers = item_area["layers"];
        let nl = layers.length;
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
      httpDownloadLayerData() {
        this.showLoader = true;
        let param = {
          user: this.user["user"],
          data: this.list_selected_layer
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("probmap_multi"), param, this.event_http_layer_download]).then();
      },

      isValidGatherDataFromMarker() {
        if (!("gather" in this.marker_drag_coord))
          return (false);

        if (!("iline" in this.marker_drag_coord["gather"]))
          return (false);

        return (true);
      },
      dialogMessageBtn1Click() {
        this.$refs.dialogMessage.hideModal();
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

        // this.createLayersFromJson();
        // function to check if it is a Rectangle
        var onEachFeature = (feature, layer) => {
          if (feature.properties.shape === 'Rectangle') {
            // we need to create a new Rectangle Layer and add it to an array
            addList.push(L.rectangle(layer.getBounds()));
            // we add the current layer to the remove list
            removeList.push(layer)
          }
        };
        L.geoJSON(this.proposeProspect["geojson"], {
          onEachFeature,
          style: {
            color: '#FFA500',
            fillColor: 'orange',
            weight: 1,
            fillOpacity: 0.2,
          }
        }).addTo(this.map);
      },

      onMapClickEvent(event) {
        if (this.show_marker_drag) {
          this.marker_drag_coord = {lat: event.latlng.lng, lng: event.latlng.lat};
          //TODO CEK INI
          this.marker_drag_coord.gather = {};
        }
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

      setToggleButtonStyle(status) {
        if (status)
          return ("e-warning");
        else
          return ("e-outline");
      },
      markerCenterLocationEventClick() {
        this.show_marker_center = !this.show_marker_center;
      },
      // markerLocationCssStyle() {
      //   if (this.show_marker_drag)
      //     return ("e-warning");
      //   else
      //     return ("e-outline");
      // },
      // markerHideGeojsonEventClick() {
      //   this.show_geo_json = !this.show_geo_json;
      // },
      markerLocationEventClick() {
        this.show_marker_drag = !this.show_marker_drag;
      },
      markerWellEventClick() {
        this.show_well_marker = !this.show_well_marker;
      },
      markerWellCssStyle() {
        if (this.show_well_marker)
          return ("e-warning");
        else
          return ("e-outline");
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
      downloadWellPoly() {
        this.showLoader = true;
        let str_url = this.varRouter.getHttpType("well-poly-download");
        this.$store.dispatch('http_get', [str_url, {}, this.event_http_well_poly_download]).then();
      },

      downloadSelectedWell() {
        this.showLoader = true;
        let str_url = this.varRouter.getHttpType("well-list-info") + this.objParam["id_area"];
        this.$store.dispatch('http_get', [str_url, {}, this.event_http_well_download]).then();
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

      onClickComputeScore() {
        let param = {
          user: this.user["user"],
          data: this.proposeProspect
        };
        // console.log(JSON.stringify(param))
        // param["data"]["polygon"] = this.geo_json[0]["geometry"]["coordinates"][0];
        // console.log(JSON.stringify(param))
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("potprosp-score"), param, this.event_http_prospect_score]).then();
      },
      onClickSaveProject() {
        // this.prospectScore.score["confidence"] = this.confidence_score;
        // this.prospectScore.score["note"] = this.text_note;
        let param = {
          user: this.user["user"],
          data: this.proposeProspect,
          // score: this.prospectScore.score
        };
        // param["data"]["polygon"] = this.geo_json;
        // console.log(JSON.stringify(param));

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("prospect-update"), param, this.event_http_save_prospect]).then();
      },
      onClickViewGather() {
        // console.log(JSON.stringify(this.objParam))
        let routeData = this.$router.resolve({
          // path: "plot-ava-gather",
          path: "plot-ava-gather-section",
          query: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"],
          }
        });
        window.open(routeData.href, '_blank');
      },
      viewWellAnalogy() {
        let routeData = this.$router.resolve({
          path: this.varRouter.getRoute("view-well-analogy", 1),
          query: {
            id: this.pageParam["id"],
          }
        });
        window.open(routeData.href, '_blank');
      },
      onUncheckAll() {
        uncheckAllData(this.table_prospect_map);
      },
      httpGetProspectData() {
        let param = {
          data: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"]
          }
        };

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("prospect-data"), param,
          this.event_http_prospect_map]).then();
      },
      httpGetListWellAnalogyData() {
        let param = {
          data: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"]
          }
        };

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("wa-data"), param,
          this.event_http_wa_data]).then();
      },

      dialogClearWellAnalogyShow() {
        this.$refs.dialogWellAnalogy.showModal();
      },
      dialogClearWellAnalogyBtn1Click() {
        this.$refs.dialogWellAnalogy.hideModal();
      },
      dialogClearWellAnalogyBtn2Click() {
        this.httpClearListWellAnalogyData();
        this.$refs.dialogWellAnalogy.hideModal();
      },
      httpClearListWellAnalogyData() {
        let param = {
          user: this.user["user"],
          data: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"]
          }
        };

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("wa-delete"), param,
          this.event_http_wa_delete]).then();
      },

      httpFindGatherFromMapMarker() {
        let param = {
          user: this.user["user"],
          data: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"],
            x: this.marker_drag_coord.lat * 1.0,
            y: this.marker_drag_coord.lng * 1.0,
          }
        };

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("segy-find-gather-from-latlng"),
          param, this.event_http_find_gather_from_latlng]).then();
      },
      httpOpenGatherFromMapMarker() {
        this.marker_drag_coord["gather"]["z"]["min"] = this.marker_drag_coord["gather"]["z"]["min"] * 1.0;
        this.marker_drag_coord["gather"]["z"]["max"] = this.marker_drag_coord["gather"]["z"]["max"] * 1.0;
        let routeData = this.$router.resolve({
          path: "plot-ava-gather-section",
          query: {
            id_area: this.objParam["id_area"],
            filename: this.objParam["filename"],
            iline: this.marker_drag_coord["gather"]["iline"],
            xline: this.marker_drag_coord["gather"]["xline"],
            zmin: this.marker_drag_coord["gather"]["z"]["min"],
            zmax: this.marker_drag_coord["gather"]["z"]["max"],
            label: this.marker_drag_coord["label"]
          }
        });
        // console.log(JSON.stringify(this.marker_drag_coord))
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

      EventBus.$on(this.event_http_prospect_score.success, (msg) => {
        this.prospectScore = msg.data;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_prospect_score.fail, (msg) => {
        this.showLoader = false;
        this.prospectScore = {score: {np: 0, score: 0, area: 0}};
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http_prospect_map.success, (msg) => {
        this.prospectMap = msg.data;
        this.table_prospect_map = addPlotDataToProspectEditMultiData(this.prospectMap);
        this.heatmap_range = this.prospectMap.v_min_max;

        this.httpGetListWellAnalogyData();
        // this.showLoader = false;
        this.showMapProspect = true;
      });
      EventBus.$on(this.event_http_prospect_map.fail, (msg) => {
        this.showLoader = false;
        this.prospectMap = {};
        this.table_prospect_map = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http_save_prospect.success, (msg) => {
        saveProspectData(this.objParam);
        this.showLoader = false;

        this.retStatus.title = "Success";
        this.retStatus.message = "Update data completed";
        this.$refs.dialogMessage.showModal();
      });
      EventBus.$on(this.event_http_save_prospect.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http_find_gather_from_latlng.success, (msg) => {
        this.marker_drag_coord.gather = msg.data;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_find_gather_from_latlng.fail, (msg) => {
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
      // PROBMAP GET LIST
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_probmap_get_list.success, (msg) => {
        fillAreaLayerList(this.obj_area, this.objParam["id_area"], msg.data);
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_probmap_get_list.fail, (msg) => {
        this.obj_area = [];
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // LAYER HEATMAP DATA DOWNLOAD
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_layer_download.success, (msg) => {
        fillAreaLayerListWithHeatmapData(this.obj_area, this.objParam["id_area"], this.list_selected_layer, msg.data)
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_layer_download.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // Well Analogy Data
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_wa_data.success, (msg) => {
        this.table_wa = msg.data;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_wa_data.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // Clear Well Analogy Data
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_wa_delete.success, (msg) => {
        this.table_wa = [];
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_wa_delete.fail, (msg) => {
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

      //-----------------------------------------------------------------
      // PROSPECT ANALYSIS
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_prospect_analysis.success, (msg) => {
        this.prospectAnalysis = msg.data;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_prospect_analysis.fail, (msg) => {
        this.prospectAnalysis = {};
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // UPDATE STAR
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_prospect_update_star.success, (msg) => {
        this.prospectAnalysis = msg.data;
        this.showLoader = false;
        this.retStatus["title"] = "Information";
        this.retStatus["message"] = msg.mesg;
        this.$refs.dialogMessage.showModal();
      });
      EventBus.$on(this.event_http_prospect_update_star.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },
    beforeDestroy() {
      EventBus.$off(this.event_http_prospect_score.success);
      EventBus.$off(this.event_http_prospect_score.fail);
      EventBus.$off(this.event_http_prospect_map.success);
      EventBus.$off(this.event_http_prospect_map.fail);
      EventBus.$off(this.event_http_save_prospect.success);
      EventBus.$off(this.event_http_save_prospect.fail);
      EventBus.$off(this.event_http_find_gather_from_latlng.success);
      EventBus.$off(this.event_http_find_gather_from_latlng.fail);
      EventBus.$off(this.event_http_well_download.success);
      EventBus.$off(this.event_http_well_download.fail);
      EventBus.$off(this.event_http_probmap_get_list.success);
      EventBus.$off(this.event_http_probmap_get_list.fail);
      EventBus.$off(this.event_http_layer_download.success);
      EventBus.$off(this.event_http_layer_download.fail);
      EventBus.$off(this.event_http_wa_data.success);
      EventBus.$off(this.event_http_wa_data.fail);
      EventBus.$off(this.event_http_wa_delete.success);
      EventBus.$off(this.event_http_wa_delete.fail);
      EventBus.$off(this.event_http_well_poly_download.success);
      EventBus.$off(this.event_http_well_poly_download.fail);
      EventBus.$off(this.event_http_prospect_analysis.success);
      EventBus.$off(this.event_http_prospect_analysis.fail);
      EventBus.$off(this.event_http_prospect_update_star.success);
      EventBus.$off(this.event_http_prospect_update_star.fail);
    },
  }
</script>

<style scoped>
  .scrollable {
    overflow-y: auto;
    max-height: 100%;
  }
</style>

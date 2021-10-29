<template>
  <div>
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="1" :textsize="190" class="mb-3"/>

    <splitpanes class="default-theme" vertical style="height: 70vh" @resized="splitResizedEvent('resized', $event)">
      <pane class="p-2" min-size="20" max-size="80" style="background: ghostwhite">
        <b-alert variant="success" class="p-1" show>Area : <strong>{{cur_area.name}}</strong></b-alert>

        <!-- -------------------------------------------- -->
        <!-- TABLE -->
        <!-- -------------------------------------------- -->
        <!-- table header -->
        <div class="group-header">
          <b-row>
            <b-col md="5" class="my-1">
              <button type="button" class="btn-sm btn-warning" @click="removeAllMarker()"
                      style="margin: 3px"><i class="fa fa-map-o"></i> Clear
              </button>
              <button type="button" class="btn-sm btn-danger" @click="showMarkerDrag()"
                      style="margin: 3px">
                <template v-if="show_marker_drag"><i class="fa fa-map-marker"></i> </template> Marker
              </button>
              <button type="button" class="btn-sm btn-danger" @click="showMarkerWell()"
                      style="margin: 3px"><template v-if="show_marker_well"><i class="fa fa-map-marker"></i></template> Well
              </button>
            </b-col>
            <b-col md="7" class="my-1">
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

          <template v-slot:cell(action)="row">
<!--              <b-link :href="openDataUrl3(row.item)" @click="openData3(row.item)" class="mr-2">Well</b-link>-->
<!--              <b-link :href="openDataUrl3_1(row.item)" @click="openData3_1(row.item)" class="mr-2">Gather</b-link>-->
<!--            <b-link :href="openDataUrl3_2(row.item)" @click="openData3_2(row.item)" class="mr-2">Section</b-link>-->
            <b-link @click="showViewSectionDialog(row.item)" class="mr-3">Section</b-link>
            <b-link @click="showWellInRadius(row.item)" class="mr-3">Well</b-link>
            <b-link @click="openData2_1(row.item)">Prob</b-link>
          </template>

          <template v-slot:cell(show_marker)="row">
            <span class="-align-right"><i class="fa fa-map-marker" :style="createStyleFromIndex(row.item)" @click="eventUpdateMarkerInMap(row.item)"></i></span>
          </template>

          <!-- X -->
          <template v-slot:cell(xcoord)="row">
<!--            <strong>Min : </strong> {{row.item.x_min.toFixed(4)}}<br><strong>Max : </strong> {{row.item.x_max.toFixed(4)}}-->
          </template>
          <!-- Y -->
          <template v-slot:cell(ycoord)="row">
<!--            <strong>Min : </strong> {{row.item.y_min.toFixed(4)}}<br><strong>Max : </strong> {{row.item.y_max.toFixed(4)}}-->
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
          <template v-if="show_marker_drag===true">
            <span><b>x</b> : {{marker_drag.lng.toFixed(2)}}   ,    <b>y</b> : {{marker_drag.lat.toFixed(2)}}</span>
          </template>
          <template v-if="showLoader===false">
            <l-map ref="map" style="width: 100%; height:100%;" :zoom="map_var.zoom" :center="map_var.center"
                   :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom">
              <template v-if="show_marker_drag===true">
                <l-marker :lat-lng="marker_drag" :draggable="true" :icon="defaultIcon" @drag="dragMarkerCoordinates">
                  <l-popup>X : <b>{{marker_drag.lng.toFixed(2)}}</b><br>Y : <b>{{marker_drag.lat.toFixed(2)}}</b></l-popup>
                </l-marker>
              </template>

              <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"/>

              <template v-if="show_marker_well">
              <template v-for="item in data_wells">
                <l-marker :lat-lng="{lat: item.ymd, lng: item.xmd}" :icon="wellIcon">
                  <l-popup>Well ID : <b>{{item.well_id}}</b><br>X : <b>{{item.xmd.toFixed(2)}}</b><br>Y : <b>{{item.ymd.toFixed(2)}}</b></l-popup>
                </l-marker>
              </template>
              </template>

              <template v-for="item in markers">
                <l-polygon :lat-lngs="item.polygon" :color="item.color">
                  <l-popup>ID : <b>{{item.id}}</b><br>X : {{item.polygon[0][1].toFixed(2)}}, {{item.polygon[2][1].toFixed(2)}}<br>Y : {{item.polygon[0][0].toFixed(2)}}, {{item.polygon[2][0].toFixed(2)}}</l-popup>
                </l-polygon>
                <l-marker :lat-lng="item.pos">
                  <l-popup>ID : <b>{{item.id}}</b><br>X : <b>{{item.pos.lng.toFixed(2)}}</b><br>Y : <b>{{item.pos.lat.toFixed(2)}}</b></l-popup>
                </l-marker>
              </template>

              <template v-for="(item, idx_poly) in map_polygon">
                <l-polygon :lat-lngs="item.polygon" :color="item.color"/>
              </template>
            </l-map>
          </template>
        </div>
      </pane>
    </splitpanes>

    <view-bottom-wizard-button class="mt-2" index="1" :left_clicked="wizardButtonClicked('processwizard1')" :right_clicked="wizardButtonClicked('processwizard3')"/>

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

    <vue-form-dialog
      ref="viewSectionDialog"
      type="default"
      header="Parameters" body="Body"
      btn1_text="Close" btn2_text="Process"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="viewSectionDialogBtn1Click()" @btn2Click="viewSectionDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="section_schema" :model="section_model" :options="formOptions" @validated="onValidated"/>
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
  import {createTabProcessIconV0, createTabProcessTextV0} from '../../libs/libSeismicUi';
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import VueLeafletMap from "../components/vue-leaflet-map"
  import {
    createListSectionModel, createListSectionSchema,
    createTableGeobodyListHeader,
    createTableGeobodyListHeaderV0,
    createWellInGeobodyModel, createWellInGeobodySchema
  } from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";
  import {appDemoMode, getMapPinMarker, getWellPinMarker} from "../../_constant/http_api";
  import {createAreaLeafletDemoData, createDemoWellInRadius, createGeobodyDemoData} from "../../libs/demo_data";
  import {
    createLeafletAreaPolygon,
    fillLeafletAreaVariable
  } from "../../libs/simpleLib";

  import * as L from "leaflet";
  import {LMap, LTileLayer, LMarker, LPolygon, LPopup} from 'vue2-leaflet'
  import { CRS, icon } from "leaflet";
  import 'leaflet/dist/leaflet.css'
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  export default {
    name: "ProcessWizardStep2_0",
    components: {
      ViewBottomWizardButton,
      ViewProcessWizardButton,
      Splitpanes, Pane,
      VueSimpleDialog,
      VueLeafletMap,
      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,

      LMap,
      LTileLayer,
      LMarker,
      LPolygon,
      LPopup
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

        show_marker_well: true,
        show_marker_drag: false,
        marker_drag: {lat:0, lng:0},

        map_var: {},
        map_polygon: [],

        cur_area: {},
        cur_tab: 0,
        markers: [],
        defaultIcon: L.icon({
          iconUrl: getMapPinMarker(),
          iconSize: [32, 36],
          iconAnchor: [16, 36]
        }),
        wellIcon: L.icon({
          iconUrl: getWellPinMarker(),
          iconSize: [32, 36],
          iconAnchor: [16, 36]
        }),
        // icon: icon({
        //   iconUrl: //"https://storage.googleapis.com/public-datas/pin_location.png",
        //   iconSize: [32, 37],
        //   iconAnchor: [16, 37]
        // }),

        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        table_headers: createTableGeobodyListHeaderV0(),
        table_datas: [],
        data_wells: [],
        section_model: createListSectionModel(),
        section_schema: createListSectionSchema(),

        resizeevent: false,
        model: createWellInGeobodyModel(),
        schema: createWellInGeobodySchema(),
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_list_geobody: {success: "successListGeobody", fail: "failListGeobody"},
        event_http_find_rad: {success: "successListFindRad", fail: "failListFindRad"},
        event_http_list_sgy: {success: "successListSegy", fail: "failListSegy"},

      }
    },

    beforeMount: function ()
    {
      this.cur_area = this.$store.getters.readSelectedArea;
      this.map_var = createAreaLeafletDemoData();
      this.map_var = fillLeafletAreaVariable(this.map_var, this.cur_area["coordinate"], 0);

      this.map_polygon = [];
      let item = JSON.parse(JSON.stringify(this.cur_area));
      item.poly = createLeafletAreaPolygon(this.cur_area["name"], item["coordinate"], 0);
      this.map_polygon.push(item.poly);

      this.marker_drag = {lat: item["coordinate"]["p1"]["y"], lng: item["coordinate"]["p1"]["x"]};

      if (appDemoMode() === true) {
        this.table_datas = createGeobodyDemoData();
        this.table_datas = this.addMarkerVariable();
        this.data_wells = createDemoWellInRadius();
      }
      else
        this.getListGeobody();
    },

    methods: {
      splitResizedEvent(strinfo, event)
      {
        // this.resizeevent = !this.resizeevent;
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
        return (createTabProcessIconV0(0))
      },
      getTabText()
      {
        return (createTabProcessTextV0(0))
      },
      wizardButtonClicked(str_router)
      {
        return (this.varRouter.getRoute(str_router, 1))
      },

      createCustomMarkerPopup(title, yc, xc)
      {
        let sstr = 'Geobody ID : <b>' + title + '</b><br>';
        sstr = sstr + 'Lat : <b>' + yc + '</b><br>';
        sstr = sstr + 'Lon : <b>' + xc + '</b>';
        return (sstr);
      },

      addMarkerVariable()
      {
        for(let i=0; i<this.table_datas.length; i++)
        {
          let item = this.table_datas[i];
          let ymax = item["edge"]["y"]["max"];
          let ymin = item["edge"]["y"]["min"];
          let xmax = item["edge"]["x"]["max"];
          let xmin = item["edge"]["x"]["min"];
          let xc = (xmax + xmin)/2.0;
          let yc = (ymax + ymin)/2.0;
          let marker = {
            "plot": false,
            "polygon": [[ymin, xmin], [ymin, xmax], [ymax, xmax], [ymax, xmin]],
            "color": "#FF00FF",
            "pos": L.latLng(yc, xc),
            "id": item["geobody_id"],
          };
          this.table_datas[i]["marker"] = marker;
        }

        return(this.table_datas);
      },

      createStyleFromIndex(item) {
        let status = item["marker"]["plot"];
        let fg_color = "#2A81CB";
        if(status===false)
          fg_color = "#696969";

        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:150%;";
        return (strstyle);
      },
      showMarkerWell()
      {
        this.show_marker_well = !this.show_marker_well;
      },
      showMarkerDrag()
      {
        this.show_marker_drag = !this.show_marker_drag;
      },
      dragMarkerCoordinates(location)
      {
        this.marker_drag = location.latlng;
        // console.log(JSON.stringify(this.marker_drag));
      },

      removeAllMarker()
      {
        for(let i=this.markers.length-1; i>=0; i--)
        {
          let item = _.find(this.table_datas, {geobody_id: this.markers[i]["id"]});
          item["marker"]["plot"] = false;
          this.markers.splice(i, 1);
          //console.log(JSON.stringify(item));
        }
      },
      eventUpdateMarkerInMap(item)
      {
        let status = item["marker"]["plot"];
        item["marker"]["plot"] = !status;
        if(status === true) {
          this.markers.splice(_.findKey(this.markers, function(e) {
            return e.id === item["geobody_id"];
          }), 1);
        }
        else
          this.markers.push(item["marker"]);
      },

      getListSegy() {
        this.showLoader = true;
        let param = {
          data: this.cur_area
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("segy-list"), param, this.event_http_list_sgy]).then();
      },
      getListGeobody()
      {
        this.showLoader = true;
        let param = {
          data: this.cur_area
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("geobody-list"), param, this.event_http_list_geobody]).then();
      },

      createDemoCss(cc)
      {
        return ('<span class="map-marker3" style="background-color:' + cc + '"/>');
      },

      openData3(item)
      {
        this.$router.push({
          path: "process-wizard3",
          // query: {geobody_file_id:item["file_id"]["$oid"], geobody_id: item["geobody_id"], cls: item['cls']}
        });
      },
      openDataUrl3(item)
      {
        // return("#/process-wizard3?geobody_file_id=" + item["file_id"]["$oid"] + "&geobody_id=" + item["geobody_id"] + "&cls=" + item["cls"]);
      },

      openData3_1(item)
      {
        this.$router.push({
          path: "process-wizard3-1",
          // path: "process-wizard3-1-pick",
          // query: {geobody_file_id:item["file_id"]["$oid"], geobody_id: item["geobody_id"]}
        });
      },
      openDataUrl3_1(item)
      {
        // return("#/process-wizard3-1-pick?geobody_file_id=" + item["file_id"]["$oid"] + "&geobody_id=" + item["geobody_id"]);
        // return("#/process-wizard3-1?geobody_file_id=" + item["file_id"]["$oid"] + "&geobody_id=" + item["geobody_id"]);
      },
      openData3_2(item)
      {
        this.$router.push({
          path: "process-wizard3-2",
          // query: {geobody_file_id:item["file_id"]["$oid"], geobody_id: item["geobody_id"] , cls: item['cls']}
        });
      },
      openDataUrl3_2(item)
      {
        // return("#/process-wizard3-2?geobody_file_id=" + item["file_id"]["$oid"] + "&geobody_id=" + item["geobody_id"] + "&cls=" + item["cls"]);
      },
      openData2_1(item)
      {
        this.$store.dispatch('actionSaveSelectedGeobody', item); //set selected project
        // console.log(JSON.stringify(item))
        this.$router.push({
          path: "process-wizard2-1",
          query: { mode:0 }
        });
      },
      openDataUrl2_1(item)
      {
        this.$store.dispatch('actionSaveSelectedGeobody', item); //set selected project
        return("#/process-wizard2-1?mode=0");
      },

      showViewSectionDialog(item)
      {
        this.cur_geobody = item;
        this.$refs.viewSectionDialog.showModal();
      },

      viewSectionDialogBtn1Click() {
        this.$refs.viewSectionDialog.hideModal();
      },
      viewSectionDialogBtn2Click() {
        if (!this.bvalidate) return;

        this.$store.dispatch('actionSaveSelectedGeobody', this.cur_geobody); //set selected project
        this.$router.push({
          path: "process-wizard2-2",
          query: { area: this.cur_area["id_area"], geobody_id: this.cur_geobody["geobody_id"],
            stack_label_name: this.section_model["substack_file_name"], rad: this.section_model["rad"]}
        });
        this.$refs.viewSectionDialog.hideModal();
      },

      showWellInRadius(item)
      {
        this.model["id_area"] = this.cur_area["id_area"];
        this.model["x"] = item["marker"]["pos"]["lng"];
        this.model["y"] = item["marker"]["pos"]["lat"];
        this.$refs.radiusDialog.showModal();
      },

      radiusDialogBtn1Click() {
        this.$refs.radiusDialog.hideModal();
      },
      radiusDialogBtn2Click() {
        if (!this.bvalidate) return;

        this.showLoader = true;
        let param = {
          "data": this.model
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("well-find-rad"), param, this.event_http_find_rad]).then();
        this.$refs.radiusDialog.hideModal();
      },
    },
    mounted()
    {
      setTimeout(function () {
        window.dispatchEvent(new Event('resize'))
      }, 250);

      // DO
      this.$nextTick(() => {
        // this.map = this.$refs.map.mapObject; // work as expected
      });

      //-------------- LIST GEOBODY -------------------
      EventBus.$on(this.event_http_list_geobody.success, (msg) =>
      {
        this.table_datas = msg.data; //fill table contents
        this.table_datas = this.addMarkerVariable();
        this.showLoader = false;
        this.getListSegy();
      });
      EventBus.$on(this.event_http_list_geobody.fail, (msg) =>
      {
        this.showLoader = false;
        this.table_datas = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http_find_rad.success, (msg) =>
      {
        // console.log(JSON.stringify(msg.data));
        this.data_wells = msg.data; //fill table contents
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_find_rad.fail, (msg) =>
      {
        this.showLoader = false;
        this.data_wells = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

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
        this.section_schema.fields[0].values = list_segy;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list_sgy.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy()
    {
      EventBus.$off(this.event_http_list_geobody.success);
      EventBus.$off(this.event_http_list_geobody.fail);
      EventBus.$off(this.event_http_list_sgy.success);
      EventBus.$off(this.event_http_list_sgy.fail);
      EventBus.$off(this.event_http_find_rad.success);
      EventBus.$off(this.event_http_find_rad.fail);
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

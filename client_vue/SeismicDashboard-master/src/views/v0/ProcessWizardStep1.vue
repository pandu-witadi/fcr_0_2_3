<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="cur_tab" :textsize="190"
                                class="mb-3"/>

    <splitpanes class="default-theme" vertical style="height: 74vh" vertical>
      <pane class="p-2" min-size="20" max-size="80" style="background: ghostwhite">
        <!-- -------------------------------------------- -->
        <!-- TABLE -->
        <!-- -------------------------------------------- -->
        <!-- table header -->
        <div class="group-header">
          <b-row>
            <b-col md="2" class="my-1">
            </b-col>
            <b-col md="10" class="my-1">
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

          <template v-slot:cell(id_color)="row">
<!--            <template v-if="row.item.plot===true">-->
<!--              <span class="fa fa-circle" :style="createStyleFromIndex(row.item)" @click="eventSelectAreaClicked(row.index)"/>-->
<!--            </template>-->
<!--            <template v-else>-->
              <span class="fa fa-circle" :style="createStyleFromIndex(row.item)" @click="eventSelectAreaClicked(row.index)"/>
<!--            </template>-->
          </template>
          <template v-slot:cell(action)="row">
            <b-link class="mr-4" @click="openGeobodyPage(row.item)">Geobody Prob.</b-link>
            <b-link @click="openXYZPage(row.item)">XYZ Prob.</b-link>
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
            <l-map ref="map" style="width: 100%; height:100%;" :zoom="map_var.zoom" :center="map_var.center"
                   :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom">
              <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"></l-tile-layer>
              <template v-for="(item, idx_poly) in map_polygon">
                <l-polygon :lat-lngs="item.polygon" :color="item.color">
                <l-popup :content="item.name" />
                </l-polygon>
              </template>
            </l-map>
          </template>
        </div>
      </pane>
    </splitpanes>

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
  import {createTableAreaListHeader, createTableAreaListHeaderV0} from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {
    fillLeafletAreaVariable,
    getBoundaryData,
    createLeafletColormap,
    createLeafletAreaPolygon
  } from "../../libs/simpleLib";
  import {createAreaLeafletDemoData} from "../../libs/demo_data";

  import * as L from "leaflet";
  import {LMap, LTileLayer, LMarker, LPolygon, LPopup, LTooltip} from 'vue2-leaflet'
  import {CRS} from "leaflet";
  import 'leaflet/dist/leaflet.css'

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

      LMap,
      LTileLayer,
      LMarker,
      LPolygon,
      LPopup,
      LTooltip
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
        showLoader: false,
        retStatus: {status: 0, title: "", message: "", data: []},

        cur_tab: 0,

        map_var: {},
        map_polygon: [],

        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        table_headers: createTableAreaListHeader(),
        table_datas: [],
        selected_data: {},

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_list: {success: "successList", fail: "failList"},
      }
    },

    beforeMount: function () {
      this.getListArea();
    },

    methods: {
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

      createStyleFromIndex(item) {
        let fg_color = item["poly"]["color"];
        if(item.plot===false)
          fg_color = "#696969";

        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:150%;";
        return (strstyle);
      },
      eventSelectAreaClicked(idx) {
        let status = !this.table_datas[idx].plot;
        this.table_datas[idx].plot = status; // select/unselect

        this.map_polygon = [];
        for(let i=0; i<this.table_datas.length; i++)
        {
          let item = this.table_datas[i];
          if(item.plot === true)
            this.map_polygon.push(item.poly);
        }
      },
      //-----------------------------------------------------
      //TABLE VIEWER
      //-----------------------------------------------------
      showPerPage(selected_per_page) {
        if (selected_per_page === "All" || selected_per_page === "Semua")
          this.perPage = this.table_datas.length;
        else
          this.perPage = selected_per_page;
        this.perPageView = selected_per_page;
      },
      computeTotalRow() {
        try {
          return (this.table_datas.length);
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
          query: {mode:1}
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

      getListArea() {
        this.showLoader = true;
        this.$store.dispatch('actionSaveSelectedArea', {}); //set selected project
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("area-list"), {}, this.event_http_list]).then();
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
    },
    mounted() {
      setTimeout(function () {
        window.dispatchEvent(new Event('resize'))
      }, 250);

      // // DO
      // this.$nextTick(() => {
      //   this.map = this.$refs.map.mapObject; // work as expected
      // });

      //-------------- LIST LOKASI -------------------
      EventBus.$on(this.event_http_list.success, (msg) => {
        this.table_datas = msg.data; //fill table contents

        this.map_var = createAreaLeafletDemoData();
        for (let i = 0; i < this.table_datas.length; i++) {
          let item = this.table_datas[i];
          this.map_var = fillLeafletAreaVariable(this.map_var, item["coordinate"], i);
          item.poly = createLeafletAreaPolygon(item["name"], item["coordinate"], i);
          item.plot = true;

          this.map_polygon.push(item.poly);
        }
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list.fail, (msg) => {
        this.showLoader = false;
        this.table_datas = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_list.success);
      EventBus.$off(this.event_http_list.fail);
      this.showLoader = false;
    },
  }
</script>

<style scoped>
  .table > tbody > tr > td {
    vertical-align: middle;
  }
</style>

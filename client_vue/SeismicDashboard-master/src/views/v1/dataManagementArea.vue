<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <splitpanes class="default-theme" style="height: 82vh" vertical>
      <pane class="p-2" min-size="20" max-size="40" style="background: white">
        <div class="group-header ml-2">
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="openNewAreaDialog"><i class="fa fa-plus" v-b-tooltip.hover
                                                                  title="New area data"/></ejs-button>
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="httpAreaList" v-b-tooltip.hover title="Refresh data"><i
            class="fa fa-refresh"/></ejs-button>
        </div>
        <vue-good-table
          max-height="70vh"
          ref="table-prospect"
          compactMode
          :columns="table_area_headers"
          :rows="table_area"
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
            <span v-if="props.column.field === 'action'">
              <ejs-button cssClass='e-danger'
                          v-on:click.native="eventAreaDeleteDialog(props.row)"><i class="fa fa-trash"/></ejs-button>
            </span>
            <span v-else-if="props.column.field === 'layer_show'">
            <span :style="eventSelectedAreaCssStyle(props.row)"
                  @click="eventSelectedAreaClicked(props.row.originalIndex, props.row)">
                      <i class="fa fa-map"/>
                </span>
              </span>
          </template>
        </vue-good-table>
      </pane>
      <pane class="p-2" min-size="60" max-size="80" style="background: white">
        <template v-if="showLoader===false">
          <!-- layer map -->
          <l-map ref="map" style="width: 100%; height:100%;" :zoom="map_var.zoom" :center="map_var.center"
                 :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom"
                 @ready="onMapReady" @click="onMapClickEvent">
            <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"/>

            <template v-for="item in tmp_array_autoupdate">
            </template>

            <template v-for="item in table_area">
              <template v-if="item.layer_show===true">
                <l-polygon :lat-lngs="item.poly.polygon" :color="item.poly.color">
                </l-polygon>
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
      ref="newAreaDialog"
      type="default"
      header="New Area" body="Body"
      btn1_text="Close" btn2_text="Create"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="newAreaDialogBtn1Click()" @btn2Click="newAreaDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="new_area_schema" :model="new_area_model" :options="formOptions"
                                  @validated="onValidated"/>
            </span>
    </vue-form-dialog>

    <!-- delete dialog -->
    <vue-simple-dialog
      ref="dialogAreaDelete"
      type="default"
      header="Delete data" body="Body"
      btn1_text="Cancel" btn2_text="Delete"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="eventAreaDeleteBtn1Click()" @btn2Click="eventAreaDeleteBtn2Click()">
              <span slot="slot-body">
                <h5>Delete area <span
                  style="color: blue">'{{selected_area.name}}'</span> ?</h5>
              </span>
    </vue-simple-dialog>
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
  import {createNewAreaModel, createNewAreaSchema, createTableAreaListHeader_V2} from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {
    addShowKeyToLayer,
    createAreaDemoData,
    createAreaLeafletDemoData, createDemoProspectProjectList,
    createHeatmapDemoData
  } from "../../libs/demo_data";
  import {appDemoMode} from "../../_constant/http_api";

  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import VueLeafletMap from "../components/vue-leaflet-map"
  import * as L from "leaflet";
  import {LMap, LTileLayer, LPolygon} from 'vue2-leaflet'
  import {CRS} from "leaflet";
  import 'leaflet/dist/leaflet.css'
  import {addPlotDataToTableArea} from "../../libs/libUpdateData";

  export default {
    name: "dataManagementArea",
    components: {
      Splitpanes, Pane,
      VueSimpleDialog,

      VueGoodTable,
      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,

      LMap, LTileLayer, LPolygon
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

        selected_area: {},
        paginationOptions: {
          enabled: true,
          mode: 'record',
          perPage: 25,
          perPageDropdown: [5, 10, 25, 50, 100],
          perPageDropdownEnabled: true,
        },
        tableSelectAllOptions: {
          enabled: false,
          selectOnCheckboxOnly: true,
          disableSelectInfo: false
        },

        new_area_model: createNewAreaModel(),
        new_area_schema: createNewAreaSchema(),
        table_area_headers: createTableAreaListHeader_V2(),
        table_area: [],
        tmp_array_autoupdate:[],

        map_var: {},
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_area_list: {success: "successAreaList", fail: "failAreaList"},
        event_http_area_add: {success: "successAreaAdd", fail: "failAreaAdd"},
        event_http_area_del: {success: "successAreaDel", fail: "failAreaDel"},
      }
    },

    beforeMount: function () {
      if (this.bdemo) {
        this.showLoader = false;
      } else
        this.httpAreaList();
    },

    watch:
      {},

    methods: {
      mapUpdated(event) {
      },
      onMapReady() {
        this.map = this.$refs.map.mapObject;
      },
      onMapClickEvent(event) {},
      eventSelectedAreaCssStyle(item) {
        let fg_color = "#808080";
        if (item.layer_show)
          fg_color = item["poly"]["color"];

        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:100%;";
        return (strstyle);
      },
      eventSelectedAreaClicked(index, item) {
        let status = !item.layer_show; // select/unselect
        item.layer_show = status;
        this.tmp_array_autoupdate = [];
        this.table_area[index].layer_show = status;
      },

      openNewAreaDialog() {
        this.$refs.newAreaDialog.showModal();
      },
      newAreaDialogBtn1Click() {
        this.$refs.newAreaDialog.hideModal();
      },
      newAreaDialogBtn2Click() {
        if (!this.bvalidate) return;

        this.showLoader = true;
        let param = {
          data: {
            id_area: this.new_area_model["id_area"],
            name: this.new_area_model["name"],
            coordinate: {
              p1: {x:this.new_area_model.x1, y:this.new_area_model.y1},
              p2: {x:this.new_area_model.x2, y:this.new_area_model.y2},
              p3: {x:this.new_area_model.x3, y:this.new_area_model.y3},
              p4: {x:this.new_area_model.x4, y:this.new_area_model.y4},
            }
          }
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("area-register"), param, this.event_http_area_add]).then();
        this.$refs.newAreaDialog.hideModal();
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
      httpAreaList() {
        this.showLoader = true;
        let param = {
          data: {}
        };
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("area-list"), param, this.event_http_area_list]).then();
      },

      eventAreaDeleteDialog(item) {
        this.selected_area = item;
        this.$refs.dialogAreaDelete.showModal();
      },
      eventAreaDeleteBtn1Click() {
        this.$refs.dialogAreaDelete.hideModal();
      },
      eventAreaDeleteBtn2Click() {
        this.showLoader = true;
        let param = {
          data: this.selected_area
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("area-delete"), param, this.event_http_area_del]).then();
        this.$refs.dialogAreaDelete.hideModal();
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
      // LIST PROB MAP
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_area_list.success, (msg) => {
        this.map_var = createAreaLeafletDemoData();
        this.table_area = msg.data; //fill table contents
        this.table_area = addPlotDataToTableArea(this.map_var, this.table_area);
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_area_list.fail, (msg) => {
        this.showLoader = false;
        this.table_area = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROB MAP REGISTER
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_area_add.success, (msg) => {
        this.retStatus["title"] = "Information";
        this.retStatus["message"] = msg["mesg"];
        this.$refs.dialogMessage.showModal();

        this.httpAreaList();
      });
      EventBus.$on(this.event_http_area_add.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROB MAP DELETE
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_area_del.success, (msg) => {
        this.retStatus["title"] = "Information";
        this.retStatus["message"] = msg["mesg"];
        this.$refs.dialogMessage.showModal();

        this.httpAreaList();
      });
      EventBus.$on(this.event_http_area_del.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_area_list.success);
      EventBus.$off(this.event_http_area_list.fail);
      EventBus.$off(this.event_http_area_add.success);
      EventBus.$off(this.event_http_area_add.fail);
      EventBus.$off(this.event_http_area_del.success);
      EventBus.$off(this.event_http_area_del.fail);

      this.showLoader = false;
    },
  }
</script>

<style>

</style>

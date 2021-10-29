<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <!--    <view-process-wizard-button :icon="getTabIcon()" :title="getTabText()" :index="cur_tab" :textsize="190" class="mb-3"/>-->
    <b-row>
      <b-col md="12">
        <b-card>
          <!--          <div slot="header"></div>-->
          <splitpanes class="default-theme" vertical style="height: 74vh" vertical>
            <pane class="p-2" min-size="20" max-size="80" style="background: ghostwhite">
              <!-- -------------------------------------------- -->
              <!-- TABLE -->
              <!-- -------------------------------------------- -->
              <!-- table header -->
              <div class="group-header">
                <b-row>
                  <b-col md="4" class="my-1">
                    <button type="button" class="btn-sm btn-success" @click="eventAddArea()"
                            style="margin: 3px">Add Area
                    </button>
                  </b-col>
                  <b-col md="8" class="my-1">
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
                  <span class="fa fa-circle" :style="createStyleFromIndex(row.item)" @click="eventSelectAreaClicked(row.index)"/>
                </template>
                <template v-slot:cell(action)="row">
                  <button type="button" class="btn-sm btn-warning" @click="eventSegyList(row.item)"
                          style="margin: 3px">SEGY
                  </button>
                  <button type="button" class="btn-sm btn-primary" @click="eventEditArea(row.item)"
                          style="margin: 3px">Edit
                  </button>
                  <button type="button" class="btn-sm btn-danger" @click="eventDeleteArea(row.item)"
                          style="margin: 3px">Delete
                  </button>
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
              <span slot="slot-body" >
                <h5>{{retStatus.message}}</h5>
              </span>
          </vue-simple-dialog>

          <vue-simple-dialog
            ref="dialogAdd"
            :type="dialogModel.type"
            :header="dialogModel.title" body="Body"
            :btn1_text="dialogModel.text1" :btn2_text="dialogModel.text2"
            :btn1_style="dialogModel.variant1" :btn2_style="dialogModel.variant2"
            @btn1Click="EventAddBtn1Click()" @btn2Click="EventAddBtn2Click()">
              <span slot="slot-body" style="width: 500px; height: 400px">
                <v-jsoneditor v-model="json_model" :options="options" height="430px" @error="onError"/>
              </span>
          </vue-simple-dialog>

          <vue-simple-dialog
            ref="dialogEdit"
            :type="dialogModel.type"
            :header="dialogModel.title" body="Body"
            :btn1_text="dialogModel.text1" :btn2_text="dialogModel.text2"
            :btn1_style="dialogModel.variant1" :btn2_style="dialogModel.variant2"
            @btn1Click="EventEditBtn1Click()" @btn2Click="EventEditBtn2Click()">
              <span slot="slot-body" style="width: 500px; height: 400px">
                <v-jsoneditor v-model="json_model" :options="options" height="430px" @error="onError"/>
              </span>
          </vue-simple-dialog>

          <!-- delete dialog -->
          <vue-simple-dialog
            ref="dialogDelete"
            type="primary"
            :type="dialogModel.type"
            :header="dialogModel.title" body="Body"
            :btn1_text="dialogModel.text1" :btn2_text="dialogModel.text2"
            :btn1_style="dialogModel.variant1" :btn2_style="dialogModel.variant2"
            @btn1Click="EventDeleteBtn1Click()" @btn2Click="EventDeleteBtn2Click()">
              <span slot="slot-body">
                <h5>Delete area <span
                  style="color: blue">'{{selected_data.name}}'</span> ?</h5>
              </span>
          </vue-simple-dialog>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import ViewProcessWizardButton from "../components/viewProcessWizardButton";
  import ViewBottomWizardButton from "../components/viewBottomWizardButton";
  import {mapState} from "vuex";
  import {createTabProcessTextV0, createTabProcessIconV0} from '../../libs/libSeismicUi';
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import VueLeafletMap from "../components/vue-leaflet-map"
  import {createTableAreaListHeader, createTableAreaListHeaderV0} from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {createLeafletAreaPolygon, fillLeafletAreaVariable, getBoundaryData} from "../../libs/simpleLib";
  import VJsoneditor from 'v-jsoneditor'

  import * as L from "leaflet";
  import {LMap, LTileLayer, LMarker, LPolygon, LPopup, LTooltip} from 'vue2-leaflet'
  import {CRS} from "leaflet";
  import 'leaflet/dist/leaflet.css'
  import {createAreaLeafletDemoData} from "../../libs/demo_data";

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
  export default {
    name: "admin-area",

    components: {
      ViewBottomWizardButton,
      ViewProcessWizardButton,
      Splitpanes, Pane,
      VueLeafletMap,
      VueSimpleDialog,
      VJsoneditor,

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

        options: {
          "mode": "text",
          "search": false,
          "mainMenuBar": false,
        },
        json_model: {
        },

        dialogModel : {
          type: "primary",
          title: "New Area",
          text1: "Close",
          text2: "Submit",
          variant1: "danger",
          variant2: "success"
        },

        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        map_var: {},
        map_polygon: [],

        table_headers: createTableAreaListHeader(),
        table_datas: [],
        selected_data: {},

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_list: {success: "successList", fail: "failList"},
        event_http_add: {success: "successAdd", fail: "failAdd"},
        event_http_del: {success: "successDel", fail: "failDel"},
        event_http_edit: {success: "successEdit", fail: "failEdit"},
      }
    },

    beforeMount: function () {
      this.getListArea();
    },

    methods: {
      onError() {
        console.log('error')
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
      createStyleFromIndex(item) {
        let fg_color = item["poly"]["color"];
        if(item.poly["plot"]===false)
          fg_color = "#696969";

        let strstyle =
          "color:" + fg_color + "; " +
          "font-size:150%;";
        return (strstyle);
      },
      eventSelectAreaClicked(idx) {
        let status = !this.table_datas[idx].poly["plot"];
        this.table_datas[idx].poly["plot"] = status; // select/unselect

        this.map_polygon = [];
        for(let i=0; i<this.table_datas.length; i++)
        {
          let item = this.table_datas[i];
          if(item.poly["plot"] === true)
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

      getTabIcon() {
        return (createTabProcessIconV0(0))
      },
      getTabText() {
        return (createTabProcessTextV0(0))
      },
      wizardButtonClicked(str_router) {
        return (this.varRouter.getRoute(str_router, 1))
      },

      cloneObjectArea(obj)
      {
        let new_obj = JSON.parse(JSON.stringify(obj));
        delete new_obj["poly"];
        let dd = {
          "data" : new_obj
        };
        return(dd) ;
      },
      getListArea() {
        this.showLoader = true;
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("area-list"), {}, this.event_http_list]).then();
      },

      eventSegyList(item)
      {
        this.$router.push({
          path: "admin-segy-list",
          query: {id_area: item["id_area"]}
        });
      },
      // ---------------- ADD ---------------------
      eventAddArea() {
        this.dialogModel = {
          type: "primary",
          title: "New Area",
          text1: "Close",
          text2: "Submit",
          variant1: "danger",
          variant2: "success"
        };
        this.$refs.dialogAdd.showModal();
      },
      EventAddBtn1Click()
      {
        this.$refs.dialogAdd.hideModal();
      },
      EventAddBtn2Click()
      {
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("area-register"), this.json_model, this.event_http_add]).then();
        this.$refs.dialogAdd.hideModal();
      },

      // ---------------- EDIT ---------------------
      eventEditArea(item) {
        this.json_model = this.cloneObjectArea(item);

        this.dialogModel = {
          type: "primary",
          title: "Edit Area",
          text1: "Close",
          text2: "Submit",
          variant1: "danger",
          variant2: "success"
        };
        this.$refs.dialogEdit.showModal();
      },
      EventEditBtn1Click()
      {
        this.$refs.dialogEdit.hideModal();
      },
      EventEditBtn2Click()
      {
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("area-update"), this.json_model, this.event_http_edit]).then();
        this.$refs.dialogEdit.hideModal();
      },

      // ---------------- DELETE ---------------------
      eventDeleteArea(item) {
        this.selected_data = item;
        this.dialogModel = {
          type: "primary",
          title: "Delete Area",
          text1: "Close",
          text2: "Submit",
          variant1: "danger",
          variant2: "success"
        };
        this.$refs.dialogDelete.showModal();
      },
      EventDeleteBtn1Click()
      {
        this.$refs.dialogDelete.hideModal();
      },
      EventDeleteBtn2Click()
      {
        let param =
        {
          "data": this.selected_data
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("area-delete"), param, this.event_http_del]).then();
        this.$refs.dialogDelete.hideModal();
      },
    },
    mounted() {
      //-------------- LIST LOKASI -------------------
      EventBus.$on(this.event_http_list.success, (msg) => {
        this.table_datas = msg.data; //fill table contents

        this.map_polygon = [];
        this.map_var = createAreaLeafletDemoData();
        for (let i = 0; i < this.table_datas.length; i++) {
          let item = this.table_datas[i];
          this.map_var = fillLeafletAreaVariable(this.map_var, item["coordinate"], i);
          item.poly = createLeafletAreaPolygon(item["name"], item["coordinate"], i);
          item.poly["plot"] = true;

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

      // ---------------- ADD ---------------------
      EventBus.$on(this.event_http_add.success, (msg) => {
        this.showLoader = false;
        let ret_mesg = msg["mesg"];
        if(ret_mesg !== "success")
        {
          this.retStatus["title"] = "Error";
          this.retStatus["message"] = ret_mesg;
          this.$refs.dialogMessage.showModal();
        }
        else
          this.getListArea();
      });

      EventBus.$on(this.event_http_add.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      // ---------------- EDIT ---------------------
      EventBus.$on(this.event_http_edit.success, (msg) => {
        this.showLoader = false;
        this.getListArea();
      });

      EventBus.$on(this.event_http_edit.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      // ---------------- DELETE ---------------------
      EventBus.$on(this.event_http_del.success, (msg) => {
        this.showLoader = false;
        let ret_mesg = msg["mesg"];
        if(ret_mesg !== "success")
        {
          this.retStatus["title"] = "Error";
          this.retStatus["message"] = ret_mesg;
          this.$refs.dialogMessage.showModal();
        }
        else
          this.getListArea();
      });

      EventBus.$on(this.event_http_del.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_list.success);
      EventBus.$off(this.event_http_list.fail);
      EventBus.$off(this.event_http_add.success);
      EventBus.$off(this.event_http_add.fail);
      EventBus.$off(this.event_http_del.success);
      EventBus.$off(this.event_http_del.fail);
      EventBus.$off(this.event_http_edit.success);
      EventBus.$off(this.event_http_edit.fail);
      this.showLoader = false;
    },
  }
</script>

<style scoped>
</style>

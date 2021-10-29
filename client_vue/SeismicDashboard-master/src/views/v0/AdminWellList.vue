<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <div><span class="mr-2"
                       style="color: #0d47a1"><strong>ID Area : {{cur_area.id_area}} ({{cur_area.name}})</strong></span>
            </div>
          </div>

          <splitpanes class="default-theme" vertical style="height: 74vh" vertical>
            <pane class="p-2" min-size="20" max-size="80" style="background: ghostwhite">
              <!-- -------------------------------------------- -->
              <!-- TABLE -->
              <!-- -------------------------------------------- -->
              <!-- table header -->
              <div class="group-header">
                <b-row>
                  <b-col md="5" class="my-1">
                    <!--                <button type="button" class="btn-sm btn-success" @click="eventAddData()"-->
                    <!--                        style="margin: 3px">Add Model-->
                    <!--                </button>-->
                    <button type="button" class="btn-sm btn-warning" @click="removeAllMarker()"
                            style="margin: 3px"><i class="fa fa-map-o"></i> Clear
                    </button>
                  </b-col>
                  <b-col md="7" class="my-1">
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
                sticky-header="63vh"
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
<!--                  <button type="button" class="btn-sm btn-primary" @click="eventEditData(row.item)"-->
<!--                          style="margin: 3px">Edit-->
<!--                  </button>-->
<!--                  <button type="button" class="btn-sm btn-danger" @click="eventDeleteData(row.item)"-->
<!--                          style="margin: 3px">Delete-->
<!--                  </button>-->
                </template>

                <template v-slot:cell(show_marker)="row">
                  <span class="-align-right"><i class="fa fa-map-marker" :style="createStyleFromIndex(row.item)" @click="eventUpdateMarkerInMap(row.item)"></i></span>
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
                      <l-polygon :lat-lngs="item.polygon" :color="item.color"/>
                    </template>

                    <template v-for="item in markers">
                      <l-marker :lat-lng="item.pos">
                        <l-popup>ID : <b>{{item.id}}</b><br>X : <b>{{item.pos.lng.toFixed(2)}}</b><br>Y : <b>{{item.pos.lat.toFixed(2)}}</b></l-popup>
                      </l-marker>
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

          <vue-form-dialog
            ref="dialogSelectArea"
            :type="dialogModel.type"
            :header="dialogModel.title" body="Body"
            :btn1_text="dialogModel.text1" :btn2_text="dialogModel.text2"
            :btn1_style="dialogModel.variant1" :btn2_style="dialogModel.variant2"
            @btn1Click="dialogSelectAreaBtn1Click()" @btn2Click="dialogSelectAreaBtn2Click()">
            <!-- body slot -->
            <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="schema_area" :model="model_area" :options="formOptions"
                                  @validated="onValidated"/>
            </span>
          </vue-form-dialog>

          <!-- add dialog -->
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

          <!-- edit dialog -->
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
                <h5>Delete model <span
                  style="color: blue">'{{selected_data.label_name}}'</span> ?</h5>
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
  import {createTabProcessIcon, createTabProcessText} from '../../libs/libSeismicUi';
  import {
    createTableAreaListHeader,
    createTableAreaListHeaderV0,
    createTableSegyListAdmin,
    createTableWellHeaderV0
  } from "../../libs/libVars";
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'

  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";
  import VJsoneditor from 'v-jsoneditor'
  import {getWellPinMarker} from "../../_constant/http_api";

  import {createAreaLeafletDemoData} from "../../libs/demo_data";
  import {createLeafletAreaPolygon, fillLeafletAreaVariable} from "../../libs/simpleLib";

  import VueLeafletMap from "../components/vue-leaflet-map"
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
    name: "admin-well",

    components: {
      ViewBottomWizardButton,
      ViewProcessWizardButton,
      VueSimpleDialog,
      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,
      VJsoneditor,
      Splitpanes, Pane,

      VueLeafletMap,
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

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data() {
      return {
        showLoader: false,
        retStatus: {status: 0, title: "", message: "", data: []},
        dialogModel: {
          type: "primary",
          title: "New Area",
          text1: "Close",
          text2: "Submit",
          variant1: "danger",
          variant2: "success"
        },
        options: {
          "mode": "text",
          "search": false,
          "mainMenuBar": false,
        },
        json_model: {},

        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        cur_area: {
          id_area: -1,
          area: ""
        },
        table_headers: createTableWellHeaderV0(),
        table_datas: [],
        selected_data: {},

        show_marker_well: true,
        map_var: {},
        map_polygon: [],
        markers: [],
        wellIcon: L.icon({
          iconUrl: getWellPinMarker(),
          iconSize: [32, 36],
          iconAnchor: [16, 36]
        }),

        model_area: {id_area: -1},
        schema_area: {
          fields: [
            {
              type: 'input',
              inputType: 'text',
              label: 'ID Area',
              model: 'id_area',
              disabled: false
            }
          ]
        },
        bvalidate: true,
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_list: {success: "successList", fail: "failList"},
        event_http_add: {success: "successAdd", fail: "failAdd"},
        event_http_del: {success: "successDel", fail: "failDel"},
        event_http_edit: {success: "successEdit", fail: "failEdit"},
        event_http_info: {success: "successInfo", fail: "failInfo"},
      }
    },

    created: function () {
      this.map_var = createAreaLeafletDemoData();
    },

    methods: {
      onError() {
        console.log('error')
      },
      splitResizedEvent(strinfo, event) {
        // this.resizeevent = !this.resizeevent;
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

      cloneObjectSegy(obj) {
        let new_obj = JSON.parse(JSON.stringify(obj));
        return (new_obj);
      },

      removeAllMarker() {
        for (let i = this.markers.length - 1; i >= 0; i--) {
          let item = _.find(this.table_datas, {well_id: this.markers[i]["id"]});
          item["marker"]["plot"] = false;
          this.markers.splice(i, 1);
          //console.log(JSON.stringify(item));
        }
      },

      // ------------------ SELECT AREA -----------------------
      showSelectAreaDialog: function () {
        this.cur_area["id_area"] = this.$route.query.id_area * 1;
        if (isNaN(this.cur_area["id_area"])) {
          this.dialogModel = {
            type: "primary",
            title: "Select Area",
            text1: "Close",
            text2: "Select",
            variant1: "danger",
            variant2: "success"
          };
          this.$refs.dialogSelectArea.showModal();
        } else {
          this.getCurrentArea();
        }
      },
      dialogSelectAreaBtn1Click() {
        this.$refs.dialogSelectArea.hideModal();
      },
      dialogSelectAreaBtn2Click() {
        if (!this.bvalidate) return;
        this.cur_area["id_area"] = this.model_area["id_area"];
        this.$router.push({
          path: "admin-well-list",
          query: {id_area: this.cur_area["id_area"]}
        });
        this.getCurrentArea();
        this.$refs.dialogSelectArea.hideModal();
      },

      getCurrentArea() {
        this.showLoader = true;
        let param = {
          "data": {
            "id_area": this.cur_area["id_area"]
          }
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("area-info"), param, this.event_http_info]).then();
      },
      getListWell() {
        this.showLoader = true;
        let param = {
          "data": {
            "id_area": this.cur_area["id_area"]
          }
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("well-info-list"), param, this.event_http_list]).then();
      },

      // ---------------- ADD ---------------------
      eventAddData() {
        this.dialogModel = {
          type: "primary",
          title: "New Model",
          text1: "Close",
          text2: "Submit",
          variant1: "danger",
          variant2: "success"
        };
        // this.json_model = {};
        this.$refs.dialogAdd.showModal();
      },
      EventAddBtn1Click() {
        this.$refs.dialogAdd.hideModal();
      },
      EventAddBtn2Click() {
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("mlmodel-register"), this.json_model, this.event_http_add]).then();
        this.$refs.dialogAdd.hideModal();
      },

      // ---------------- EDIT ---------------------
      eventEditData(item) {
        this.json_model = {
          "label_name": item["label_name"],
          "data": item
        };

        this.dialogModel = {
          type: "primary",
          title: "Edit Model",
          text1: "Close",
          text2: "Submit",
          variant1: "danger",
          variant2: "success"
        };
        this.$refs.dialogEdit.showModal();
      },
      EventEditBtn1Click() {
        this.$refs.dialogEdit.hideModal();
      },
      EventEditBtn2Click() {
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("mlmodel-update"), this.json_model, this.event_http_edit]).then();
        this.$refs.dialogEdit.hideModal();
      },

      // ---------------- DELETE ---------------------
      eventDeleteData(item) {
        this.selected_data = item;
        this.dialogModel = {
          type: "primary",
          title: "Delete Model",
          text1: "Close",
          text2: "Submit",
          variant1: "danger",
          variant2: "success"
        };
        this.$refs.dialogDelete.showModal();
      },
      EventDeleteBtn1Click() {
        this.$refs.dialogDelete.hideModal();
      },
      EventDeleteBtn2Click() {
        let param =
          {
            "data": this.selected_data
          };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("mlmodel-delete"), param, this.event_http_del]).then();
        this.$refs.dialogDelete.hideModal();
      },
    },
    mounted() {
      setTimeout(function () {
        window.dispatchEvent(new Event('resize'))
      }, 250);

      // DO
      this.$nextTick(() => {
        // this.map = this.$refs.map.mapObject; // work as expected
      });

      EventBus.$on(this.event_http_info.success, (msg) => {
        this.cur_area = msg.data; //fill table contents
        this.map_var = fillLeafletAreaVariable(this.map_var, this.cur_area["coordinate"], 0);
        this.map_polygon = [];
        let item = JSON.parse(JSON.stringify(this.cur_area));
        item.poly = createLeafletAreaPolygon(this.cur_area["name"], item["coordinate"], 0);
        this.map_polygon.push(item.poly);

        this.getListWell();
      });
      EventBus.$on(this.event_http_info.fail, (msg) => {
        this.showLoader = false;
        this.table_datas = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-------------- LIST well -------------------
      EventBus.$on(this.event_http_list.success, (msg) => {
        this.table_datas = msg.data; //fill table contents

        for(let i=0; i<this.table_datas.length; i++) {
          let item = this.table_datas[i];
          let xc = item["xmd"];
          let yc = item["ymd"];
          let marker = {
            "plot": false,
            "polygon": [],
            "color": "#FF00FF",
            "pos": L.latLng(yc, xc),
            "id": item["well_id"],
          };
          this.table_datas[i]["marker"] = marker;
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
        if (ret_mesg !== "success") {
          this.retStatus["title"] = "Error";
          this.retStatus["message"] = ret_mesg;
          this.$refs.dialogMessage.showModal();
        } else
          this.getListModel();
      });

      EventBus.$on(this.event_http_add.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http_edit.success, (msg) => {
        this.showLoader = false;
        let ret_mesg = msg["mesg"];
        if (ret_mesg !== "success") {
          this.retStatus["title"] = "Error";
          this.retStatus["message"] = ret_mesg;
          this.$refs.dialogMessage.showModal();
        } else
          this.getListModel();
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
        if (ret_mesg !== "success") {
          this.retStatus["title"] = "Error";
          this.retStatus["message"] = ret_mesg;
          this.$refs.dialogMessage.showModal();
        } else
          this.getListModel();
      });

      EventBus.$on(this.event_http_del.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      this.showSelectAreaDialog();
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
      EventBus.$off(this.event_http_info.success);
      EventBus.$off(this.event_http_info.fail);
      this.showLoader = false;
    },
  }
</script>

<style scoped>
  .table > tbody > tr > td {
    vertical-align: middle;
  }
</style>

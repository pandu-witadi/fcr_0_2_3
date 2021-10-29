<template>
  <div class="panel-body">
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :background-color="spinLoader.background_color"
      :size="spinLoader.size"
      :active="showLoader"/>

        <div class="group-header ml-2">
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="openNewProbMapDialog"><i class="fa fa-plus" v-b-tooltip.hover
                                                                 title="New probability map data"/></ejs-button>
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="httpProbMapList" v-b-tooltip.hover title="Refresh data"><i
            class="fa fa-refresh"/></ejs-button>
        </div>
        <vue-good-table
          max-height="71vh"
          ref="table-prospect"
          compactMode
          :columns="table_prob_map_headers"
          :rows="table_prob_map"
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
                          v-on:click.native="eventProbMapDeleteDialog(props.row)"><i class="fa fa-trash"/></ejs-button>
            </span>
          </template>
        </vue-good-table>

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
      ref="newProbMapDialog"
      type="default"
      header="New Probability Map" body="Body"
      btn1_text="Close" btn2_text="Create"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="newProbMapDialogBtn1Click()" @btn2Click="newProbMapDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="new_prob_map_schema" :model="new_prob_map_model" :options="formOptions" @validated="onValidated"/>
            </span>
    </vue-form-dialog>

    <!-- delete dialog -->
    <vue-simple-dialog
      ref="dialogProbMapDelete"
      type="default"
      header="Delete data" body="Body"
      btn1_text="Cancel" btn2_text="Delete"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="eventProbMapDeleteBtn1Click()" @btn2Click="eventProbMapDeleteBtn2Click()">
              <span slot="slot-body">
                <h5>Delete label <span
                  style="color: blue">'{{selected_prob_map.label}}'</span> ?</h5>
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
  import {createNewProbMapModel, createNewProbMapSchema, createTableProbMapListHeader} from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {
    addShowKeyToLayer,
    createAreaDemoData,
    createAreaLeafletDemoData, createDemoProspectProjectList,
    createHeatmapDemoData
  } from "../../libs/demo_data";
  import {appDemoMode} from "../../_constant/http_api";

  export default {
    name: "dataManagementProbabilityMap",
    components: {
      VueSimpleDialog,

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

        selected_prob_map: {},
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

        new_prob_map_model: createNewProbMapModel(),
        new_prob_map_schema: createNewProbMapSchema(),
        table_prob_map_headers: createTableProbMapListHeader(),
        table_prob_map: [],

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_prob_map_list: {success: "successProbMapList", fail: "failProbMapList"},
        event_http_prob_map_add: {success: "successProbMapAdd", fail: "failProbMapAdd"},
        event_http_prob_map_del: {success: "successProbMapDel", fail: "failProbMapDel"},
      }
    },

    beforeMount: function () {
      if (this.bdemo) {
        this.showLoader = false;
      } else
        this.httpProbMapList();
    },

    watch:
      {},

    methods: {
      openNewProbMapDialog()
      {
        this.$refs.newProbMapDialog.showModal();
      },
      newProbMapDialogBtn1Click() {
        this.$refs.newProbMapDialog.hideModal();
      },
      newProbMapDialogBtn2Click() {
        if (!this.bvalidate) return;

        this.showLoader = true;
        let param = {
          data: this.new_prob_map_model
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("prob-map-register"), param, this.event_http_prob_map_add]).then();
        this.$refs.newProbMapDialog.hideModal();
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
      httpProbMapList() {
        this.showLoader = true;
        let param = {
          data: {}
        };
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("prob-map-list-all"), param, this.event_http_prob_map_list]).then();
      },

      eventProbMapDeleteDialog(item) {
        this.selected_prob_map = item;
        this.$refs.dialogProbMapDelete.showModal();
      },
      eventProbMapDeleteBtn1Click()
      {
        this.$refs.dialogProbMapDelete.hideModal();
      },
      eventProbMapDeleteBtn2Click()
      {
        this.showLoader = true;
        let param = {
          data: this.selected_prob_map
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("prob-map-delete"), param, this.event_http_prob_map_del]).then();
        this.$refs.dialogProbMapDelete.hideModal();
      },

      getHttpRefreshProspectProject() {
        let param = {
          data: {}
        };
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("prospect-list"), param, this.event_http_prospect_list]).then();
      },
    },
    mounted() {
      //-----------------------------------------------------------------
      // LIST PROB MAP
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_prob_map_list.success, (msg) => {
        this.table_prob_map = msg.data; //fill table contents
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_prob_map_list.fail, (msg) => {
        this.showLoader = false;
        this.table_prob_map = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROB MAP REGISTER
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_prob_map_add.success, (msg) => {
        this.retStatus["title"] = "Information";
        this.retStatus["message"] = msg["mesg"];
        this.$refs.dialogMessage.showModal();

        this.httpProbMapList();
      });
      EventBus.$on(this.event_http_prob_map_add.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROB MAP DELETE
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_prob_map_del.success, (msg) => {
        this.retStatus["title"] = "Information";
        this.retStatus["message"] = msg["mesg"];
        this.$refs.dialogMessage.showModal();

        this.httpProbMapList();
      });
      EventBus.$on(this.event_http_prob_map_del.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_prob_map_list.success);
      EventBus.$off(this.event_http_prob_map_list.fail);
      EventBus.$off(this.event_http_prob_map_add.success);
      EventBus.$off(this.event_http_prob_map_add.fail);
      EventBus.$off(this.event_http_prob_map_del.success);
      EventBus.$off(this.event_http_prob_map_del.fail);

      this.showLoader = false;
    },
  }
</script>

<style>

</style>

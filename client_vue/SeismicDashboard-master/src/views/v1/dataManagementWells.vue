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
                      v-on:click.native="openNewWellsDialog"><i class="fa fa-plus" v-b-tooltip.hover
                                                                 title="New Well"/></ejs-button>
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="httpWellsList" v-b-tooltip.hover title="Refresh data"><i
            class="fa fa-refresh"/></ejs-button>
        </div>
        <vue-good-table
          max-height="71vh"
          ref="table-prospect"
          compactMode
          :columns="table_wells_headers"
          :rows="table_wells"
          styleClass="vgt-table bordered striped condensed"
          :line-numbers="true"
          :pagination-options="paginationOptions"
          :select-options="tableSelectAllOptions">
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field === 'action'">
              <ejs-button cssClass='e-danger'
                          v-on:click.native="eventWellsDeleteDialog(props.row)"><i class="fa fa-trash"/></ejs-button>
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
      ref="newWellsDialog"
      type="default"
      header="New User" body="Body"
      btn1_text="Close" btn2_text="Create"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="newWellsDialogBtn1Click()" @btn2Click="newWellsDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="new_wells_schema" :model="new_wells_model" :options="formOptions" @validated="onValidated"/>
            </span>
    </vue-form-dialog>

    <!-- delete dialog -->
    <vue-simple-dialog
      ref="dialogWellsDelete"
      type="default"
      header="Delete data" body="Body"
      btn1_text="Cancel" btn2_text="Delete"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="eventWellsDeleteBtn1Click()" @btn2Click="eventWellsDeleteBtn2Click()">
              <span slot="slot-body">
                <h5>Delete well label <span
                  style="color: blue">'{{selected_well.label}}'</span> ?</h5>
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
  import {createNewWellModel, createNewWellSchema, createTableWellsLiteListHeader} from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {appDemoMode} from "../../_constant/http_api";

  export default {
    name: "dataManagementWells",
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

        selected_well: {},
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

        new_wells_model: createNewWellModel(),
        new_wells_schema: createNewWellSchema(),
        table_wells_headers: createTableWellsLiteListHeader(),
        table_wells: [],

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_wells_list: {success: "successWellsList", fail: "failWellsList"},
        event_http_wells_add: {success: "successWellsAdd", fail: "failWellsAdd"},
        event_http_wells_del: {success: "successWellsDel", fail: "failWellsDel"},
      }
    },

    beforeMount: function () {
      if (this.bdemo) {
        this.showLoader = false;
      } else {
        this.httpWellsList();
      }
    },

    watch:
      {},

    methods: {
      openNewWellsDialog()
      {
        this.$refs.newWellsDialog.showModal();
      },
      newWellsDialogBtn1Click() {
        this.$refs.newWellsDialog.hideModal();
      },
      newWellsDialogBtn2Click() {
        if (!this.bvalidate) return;

        this.showLoader = true;
        let param = {
          data: this.new_wells_model
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("well-register"), param, this.event_http_wells_add]).then();
        this.$refs.newWellsDialog.hideModal();
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
      httpWellsList() {
        this.showLoader = true;
        let param = {
          data: {}
        };
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("well-list-lite"), param, this.event_http_wells_list]).then();
      },

      eventWellsDeleteDialog(item) {
        this.selected_well = item;
        this.$refs.dialogWellsDelete.showModal();
      },
      eventWellsDeleteBtn1Click()
      {
        this.$refs.dialogWellsDelete.hideModal();
      },
      eventWellsDeleteBtn2Click()
      {
        this.showLoader = true;
        let param = {
          data: this.selected_well
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("well-delete"), param, this.event_http_wells_del]).then();
        this.$refs.dialogWellsDelete.hideModal();
      },
    },
    mounted() {
      //-----------------------------------------------------------------
      // LIST PROB MAP
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_wells_list.success, (msg) => {
        this.table_wells = msg.data; //fill table contents
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_wells_list.fail, (msg) => {
        this.showLoader = false;
        this.table_wells = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROB MAP REGISTER
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_wells_add.success, (msg) => {
        this.retStatus["title"] = "Information";
        this.retStatus["message"] = msg["mesg"];
        this.$refs.dialogMessage.showModal();

        this.httpWellsList();
      });
      EventBus.$on(this.event_http_wells_add.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROB MAP DELETE
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_wells_del.success, (msg) => {
        this.retStatus["title"] = "Information";
        this.retStatus["message"] = msg["mesg"];
        this.$refs.dialogMessage.showModal();

        this.httpWellsList();
      });
      EventBus.$on(this.event_http_wells_del.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_wells_list.success);
      EventBus.$off(this.event_http_wells_list.fail);
      EventBus.$off(this.event_http_wells_add.success);
      EventBus.$off(this.event_http_wells_add.fail);
      EventBus.$off(this.event_http_wells_del.success);
      EventBus.$off(this.event_http_wells_del.fail);

      this.showLoader = false;
    },
  }
</script>

<style>

</style>

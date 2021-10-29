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
                      v-on:click.native="openNewUsersDialog"><i class="fa fa-plus" v-b-tooltip.hover
                                                                 title="New User"/></ejs-button>
          <ejs-button cssClass='e-outline' class="mr-1"
                      v-on:click.native="httpUsersList" v-b-tooltip.hover title="Refresh data"><i
            class="fa fa-refresh"/></ejs-button>
        </div>
        <vue-good-table
          max-height="71vh"
          ref="table-prospect"
          compactMode
          :columns="table_users_headers"
          :rows="table_users"
          styleClass="vgt-table bordered striped condensed"
          :line-numbers="true"
          :pagination-options="paginationOptions"
          :select-options="tableSelectAllOptions">
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field === 'action'">
              <ejs-button cssClass='e-danger'
                          v-on:click.native="eventUsersDeleteDialog(props.row)"><i class="fa fa-trash"/></ejs-button>
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
      ref="newUsersDialog"
      type="default"
      header="New User" body="Body"
      btn1_text="Close" btn2_text="Create"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="newUsersDialogBtn1Click()" @btn2Click="newUsersDialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="new_users_schema" :model="new_users_model" :options="formOptions" @validated="onValidated"/>
            </span>
    </vue-form-dialog>

    <!-- delete dialog -->
    <vue-simple-dialog
      ref="dialogUsersDelete"
      type="default"
      header="Delete data" body="Body"
      btn1_text="Cancel" btn2_text="Delete"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="eventUsersDeleteBtn1Click()" @btn2Click="eventUsersDeleteBtn2Click()">
              <span slot="slot-body">
                <h5>Delete username <span
                  style="color: blue">'{{selected_user.username}}'</span> ?</h5>
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
  import {createNewUserModel, createNewUserSchema, createTableUsersListHeader} from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {appDemoMode} from "../../_constant/http_api";

  export default {
    name: "dataManagementUsers",
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

        selected_user: {},
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

        new_users_model: createNewUserModel(),
        new_users_schema: createNewUserSchema(),
        table_users_headers: createTableUsersListHeader(),
        table_users: [],

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        event_http_users_list: {success: "successUsersList", fail: "failUsersList"},
        event_http_users_add: {success: "successUsersAdd", fail: "failUsersAdd"},
        event_http_users_del: {success: "successUsersDel", fail: "failUsersDel"},
      }
    },

    beforeMount: function () {
      if (this.bdemo) {
        this.showLoader = false;
      } else {
        this.httpUsersList();
      }
    },

    watch:
      {},

    methods: {
      openNewUsersDialog()
      {
        this.$refs.newUsersDialog.showModal();
      },
      newUsersDialogBtn1Click() {
        this.$refs.newUsersDialog.hideModal();
      },
      newUsersDialogBtn2Click() {
        if (!this.bvalidate) return;

        this.showLoader = true;
        let param = {
          data: this.new_users_model
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("user-register"), param, this.event_http_users_add]).then();
        this.$refs.newUsersDialog.hideModal();
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
      httpUsersList() {
        this.showLoader = true;
        let param = {
          data: {}
        };
        this.$store.dispatch('http_get', [this.varRouter.getHttpType("user-list"), param, this.event_http_users_list]).then();
      },

      eventUsersDeleteDialog(item) {
        this.selected_user = item;
        this.$refs.dialogUsersDelete.showModal();
      },
      eventUsersDeleteBtn1Click()
      {
        this.$refs.dialogUsersDelete.hideModal();
      },
      eventUsersDeleteBtn2Click()
      {
        this.showLoader = true;
        let param = {
          data: this.selected_user
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("user-delete"), param, this.event_http_users_del]).then();
        this.$refs.dialogUsersDelete.hideModal();
      },
    },
    mounted() {
      //-----------------------------------------------------------------
      // LIST PROB MAP
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_users_list.success, (msg) => {
        this.table_users = msg.data; //fill table contents
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_users_list.fail, (msg) => {
        this.showLoader = false;
        this.table_users = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROB MAP REGISTER
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_users_add.success, (msg) => {
        this.retStatus["title"] = "Information";
        this.retStatus["message"] = msg["mesg"];
        this.$refs.dialogMessage.showModal();

        this.httpUsersList();
      });
      EventBus.$on(this.event_http_users_add.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-----------------------------------------------------------------
      // PROB MAP DELETE
      //-----------------------------------------------------------------
      EventBus.$on(this.event_http_users_del.success, (msg) => {
        this.retStatus["title"] = "Information";
        this.retStatus["message"] = msg["mesg"];
        this.$refs.dialogMessage.showModal();

        this.httpUsersList();
      });
      EventBus.$on(this.event_http_users_del.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_users_list.success);
      EventBus.$off(this.event_http_users_list.fail);
      EventBus.$off(this.event_http_users_add.success);
      EventBus.$off(this.event_http_users_add.fail);
      EventBus.$off(this.event_http_users_del.success);
      EventBus.$off(this.event_http_users_del.fail);

      this.showLoader = false;
    },
  }
</script>

<style>

</style>

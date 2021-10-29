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
            <div><span class="mr-2" style="color: #0d47a1"><strong>ID Area : {{cur_area.id_area}} ({{cur_area.name}})</strong></span></div>
          </div>
          <!-- -------------------------------------------- -->
          <!-- TABLE -->
          <!-- -------------------------------------------- -->
          <!-- table header -->
          <div class="group-header">
            <b-row>
              <b-col md="2" class="my-1">
                <button type="button" class="btn-sm btn-success" @click="eventAddSegy()"
                        style="margin: 3px">Add Segy
                </button>
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
              <button type="button" class="btn-sm btn-primary" @click="eventEditSegy(row.item)"
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

          <!-- show error dialog -->
          <vue-simple-dialog
            ref="dialogMessage"
            type="danger"
            :header="retStatus.title" body="Body"
            btn1_text="Close"
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
              <vue-form-generator :schema="schema_area" :model="model_area" :options="formOptions" @validated="onValidated"/>
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
                <h5>Delete Segy <span
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
  import {createTableAreaListHeader, createTableAreaListHeaderV0, createTableSegyListAdmin} from "../../libs/libVars";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";
  import VJsoneditor from 'v-jsoneditor'

  export default {
    name: "admin-segy",

    components: {
      ViewBottomWizardButton,
      ViewProcessWizardButton,
      VueSimpleDialog,
      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,
      VJsoneditor,
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
        dialogModel : {
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
        json_model: {
        },

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
        table_headers: createTableSegyListAdmin(),
        table_datas: [],
        selected_data: {},

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
      }
    },

    created: function () {
      // this.id_area = this.$route.query.area*1;
      // if(isNaN(this.id_area)) {
      //   // this.$refs.dialogSelectArea.showModal();
      //   this.sampleFun();
      // }
      // this.getListArea();
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

      cloneObjectSegy(obj)
      {
        let new_obj = JSON.parse(JSON.stringify(obj));
        return(new_obj) ;
      },
      // ------------------ SELECT AREA -----------------------
      showSelectAreaDialog: function(){
        this.cur_area["id_area"] = this.$route.query.id_area*1;
        if(isNaN(this.cur_area["id_area"])) {
          this.dialogModel = {
            type: "primary",
            title: "Select Area",
            text1: "Close",
            text2: "Select",
            variant1: "danger",
            variant2: "success"
          };
          this.$refs.dialogSelectArea.showModal();
        }
        else
        {
          this.getListSegy();
        }
      },
      dialogSelectAreaBtn1Click() {
        this.$refs.dialogSelectArea.hideModal();
      },
      dialogSelectAreaBtn2Click() {
        if (!this.bvalidate) return;
        this.cur_area["id_area"] = this.model_area["id_area"];
        this.$router.push({
          path: "admin-segy-list",
          query: {id_area: this.cur_area["id_area"]}
        });
        this.getListSegy();
        this.$refs.dialogSelectArea.hideModal();
      },

      getListSegy() {
        this.showLoader = true;
        let param = {
          "data": {
            "id_area": this.cur_area["id_area"]
          }
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("segy-list"), param, this.event_http_list]).then();
      },

      // ---------------- ADD ---------------------
      eventAddSegy() {
        this.dialogModel = {
          type: "primary",
          title: "New Segy",
          text1: "Close",
          text2: "Submit",
          variant1: "danger",
          variant2: "success"
        };
        // this.json_model = {};
        this.$refs.dialogAdd.showModal();
      },
      EventAddBtn1Click()
      {
        this.$refs.dialogAdd.hideModal();
      },
      EventAddBtn2Click()
      {
        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("segy-register"), this.json_model, this.event_http_add]).then();
        this.$refs.dialogAdd.hideModal();
      },

      // ---------------- EDIT ---------------------
      eventEditSegy(item) {
        this.json_model = {
          "label_name": item["label_name"],
          "data": item
        };

        this.dialogModel = {
          type: "primary",
          title: "Edit Segy",
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
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("segy-update"), this.json_model, this.event_http_edit]).then();
        this.$refs.dialogEdit.hideModal();
      },

      // ---------------- DELETE ---------------------
      eventDeleteArea(item) {
        this.selected_data = item;
        this.dialogModel = {
          type: "primary",
          title: "Delete Segy",
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
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("segy-delete"), param, this.event_http_del]).then();
        this.$refs.dialogDelete.hideModal();
      },
    },
    mounted() {
      //-------------- LIST LOKASI -------------------
      EventBus.$on(this.event_http_list.success, (msg) => {
        this.table_datas = msg.data; //fill table contents
        let ndata = this.table_datas.length;
        if(ndata<=0)
          this.cur_area["name"] = "~";
        else
          this.cur_area["name"] = this.table_datas[0]["area"];
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
          this.getListSegy();
      });

      EventBus.$on(this.event_http_add.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http_edit.success, (msg) => {
        this.showLoader = false;
        let ret_mesg = msg["mesg"];
        if(ret_mesg !== "success")
        {
          this.retStatus["title"] = "Error";
          this.retStatus["message"] = ret_mesg;
          this.$refs.dialogMessage.showModal();
        }
        else
          this.getListSegy();
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
          this.getListSegy();
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
      this.showLoader = false;
    },
  }
</script>

<style scoped>
  .table > tbody > tr > td {
    vertical-align: middle;
  }
</style>

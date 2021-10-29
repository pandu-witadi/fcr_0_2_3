<template>
  <div class="animated fadeIn">
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
            <strong>Well List</strong>
          </div>

          <!-- -------------------------------------------- -->
          <!-- TABLE -->
          <!-- -------------------------------------------- -->
          <!-- table header -->
          <div class="group-header">
            <b-row>
              <b-col md="6" class="my-1">
<!--                <button type="button" class="btn btn-success" @click="newData()"><i class="fa fa-plus"></i>&nbsp; Tambah Lokasi</button>-->
              </b-col>
              <b-col md="6" class="my-1">
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

          <!-- table contents -->
          <b-table
            show-empty
            stacked="md"
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

            <!-- X -->
            <template v-slot:cell(X)="row">
              <strong>Min : </strong> {{row.item.x_min.toFixed(8)}}<br><strong>Max : </strong> {{row.item.x_max.toFixed(8)}}
            </template>
            <!-- Y -->
            <template v-slot:cell(Y)="row">
              <strong>Min : </strong> {{row.item.y_min.toFixed(8)}}<br><strong>Max : </strong> {{row.item.y_max.toFixed(8)}}
            </template>
            <!-- Z -->
            <template v-slot:cell(Z)="row">
              <strong>Min : </strong> {{row.item.z_min.toFixed(8)}}<br><strong>Max : </strong> {{row.item.z_max.toFixed(8)}}
            </template>

            <!-- action status -->
            <template v-slot:cell(action)="row">
              <button type="button" class="btn-sm btn-primary" @click="openData(row.item)"
                      style="margin: 3px">Open
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

        </b-card>
      </b-col>
    </b-row>

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
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";
  import {mapState} from "vuex";
  import {createTableWellHeader} from "../../libs/libVars";
  export default {
    name: 'well-table',

    components: {
      VueSimpleDialog,
      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
      // user: state => state.user,
    }),

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },

    beforeMount: function () {
      this.getListSegy();
    },

    methods: {
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

      onValidated(isValid, errors) {
        this.bvalidate = isValid;
      },

      //-----------------------------------------------------
      //DATA ACTION
      //-----------------------------------------------------
      getListWell() {
        this.showLoader = true;
        this.$store.dispatch('actionSaveSelectedWell', {}); //set selected project
        this.$store.dispatch('http_get', ["/api/well/list", {}, this.event_http_list]).then();
      },
      getListSegy() {
        this.showLoader = true;
        this.$store.dispatch('http_get', ["/api/segy/file-list", {}, this.event_http_list_sgy]).then();
      },
      openData(item)
      {
        this.selected_data = item;
        this.$refs.radiusDialog.showModal();
      },
      radiusDialogBtn1Click() {
        this.$refs.radiusDialog.hideModal();
      },
      radiusDialogBtn2Click() {
        if (!this.bvalidate) return;
        this.selected_data["radius"] = this.model["radius"];
        this.selected_data["file_id"] = this.model["file_id"];
        //console.log(JSON.stringify(this.selected_data))

        this.$store.dispatch('actionSaveSelectedWell', this.selected_data); //set selected project
        this.$router.push({
          path: this.varRouter.getRoute("inline-crossline", 1),
        });

        this.$refs.radiusDialog.hideModal();
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
    },

    mounted() {
      //-------------- LIST SEGY -------------------
      EventBus.$on(this.event_http_list_sgy.success, (msg) => {
        this.table_segy = [];
        for(let i=0; i<msg.length; i++)
          this.table_segy.push(
            {
              id: msg[i]["_id"]["$oid"],
              // name:msg[i]["file_name"],
              name:msg[i]["label_name"]
            })
        this.schema.fields[0].values = this.table_segy;
        this.showLoader = false;
        this.getListWell();
      });
      EventBus.$on(this.event_http_list_sgy.fail, (msg) => {
        this.showLoader = false;
        this.table_segy = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      //-------------- LIST Well -------------------
      EventBus.$on(this.event_http_list.success, (msg) => {
        //create table header
        this.table_headers.push({label: "Action", key:"action", default: "", tdClass: 'align-middle'});

        // //fill table contents
        this.table_datas = msg.data;
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list.fail, (msg) => {
        this.showLoader = false;
        this.table_datas = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http.success, (msg) => {

      });

      EventBus.$on(this.event_http.fail, (msg) => {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy() {
      EventBus.$off(this.event_http_list_sgy.success);
      EventBus.$off(this.event_http_list_sgy.fail);
      EventBus.$off(this.event_http_list.success);
      EventBus.$off(this.event_http_list.fail);
      EventBus.$off(this.event_http.success);
      EventBus.$off(this.event_http.fail);
      this.showLoader = false;
    },

    data() {
      return {
        showLoader : false,
        retStatus: {status: 0, title: "", message: "", data: []},
        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        table_segy: [],
        model: {
          file_id: 0,
          radius: 0,
        },
        schema: {
          fields: [
            {
              type: 'select',
              label: 'Select File',
              model: 'file_id',
              selectOptions: {hideNoneSelectedText: true}
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Radius',
              model: 'radius',
              placeholder: 'Set Radius',
              featured: true,
              required: true
            },
          ]
        },
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },

        selected_data: {},
        table_headers: createTableWellHeader(),
        table_datas: [],

        event_http_list :{success:"successList", fail:"failList"},
        event_http_list_sgy :{success:"successListSgy", fail:"failListSgy"},
        event_http :{success:"success", fail:"fail"},
      }
    },
  };
</script>

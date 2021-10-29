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
            <strong>Geobody Info : {{cur_geobody["file_name"]}}</strong>
          </div>

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
            sticky-header
            responsive
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

            <template v-slot:cell(action)="row">
              <button type="button" class="btn-sm btn-primary" @click="openData(row.item)"
                      style="margin: 3px">Open
              </button>
            </template>

            <!-- X -->
            <template v-slot:cell(xcoord)="row">
              <strong>Min : </strong> {{row.item.x_min.toFixed(6)}}<br><strong>Max : </strong> {{row.item.x_max.toFixed(6)}}
            </template>
            <!-- Y -->
            <template v-slot:cell(ycoord)="row">
              <strong>Min : </strong> {{row.item.y_min.toFixed(6)}}<br><strong>Max : </strong> {{row.item.y_max.toFixed(6)}}
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
  import {mapState} from "vuex";
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {createTableGeobodyListHeader} from "../../libs/libVars";

  export default {
    name: "GeobodyTableContents",

    components: {
      VueSimpleDialog,
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
        showLoader: true,
        retStatus: {status: 0, title: "", message: "", data: []},

        cur_geobody: {},
        cur_well: {},
        cur_tab: 0,
        markers: [],
        perPageView: 10,
        perPage: 10,
        pageOptions: [5, 10, 15, 25, 50, 100, "All"],
        currentPage: 1,
        totalRows: 0,
        filter: null,

        table_headers: createTableGeobodyListHeader(),
        table_datas: [],

        event_http_list: {success: "successList", fail: "failList"},
      }
    },

    beforeMount: function ()
    {
      this.getListGeobodyData();
    },

    methods: {
      onValidated(isValid, errors)
      {
        this.bvalidate = isValid;
      },

      //MESSAGE HTTP I/O
      dialogMessageBtn1Click()
      {
        if (this.retStatus.status === -1)
        { //error http
          //this.$router.push({path: this.varRouter.getRoute("login", 0)}); //goto login page
          this.$refs.dialogMessage.hideModal();
        }
        else
        { //error token
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

      getListGeobodyData()
      {
        this.showLoader = true;
        this.cur_geobody = this.$store.getters.readSelectedGeobody;
        // console.log(JSON.stringify(this.cur_geobody))
        this.$store.dispatch('http_post', ["/api/geobody/info-list", this.cur_geobody, this.event_http_list]).then();
      },
    },
    mounted()
    {
      //-------------- LIST LOKASI -------------------
      EventBus.$on(this.event_http_list.success, (msg) =>
      {
        // console.log(JSON.stringify(msg))
        this.table_datas = msg; //fill table contents
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_list.fail, (msg) =>
      {
        this.showLoader = false;
        this.table_datas = [];
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy()
    {
      EventBus.$off(this.event_http_list.success);
      EventBus.$off(this.event_http_list.fail);
      this.showLoader = false;
    },
  }
</script>

<style scoped>

</style>

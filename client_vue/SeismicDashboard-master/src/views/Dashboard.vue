<template>
  <div class="dashboard-container">
    <DashboardTopInfo></DashboardTopInfo>
    <!--show error dialog -->
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
  </div>
</template>

<script>
  import {Callout} from 'MyLibVue/src/coreui'
  import {mapState, mapActions} from 'vuex'
  import {EventBus} from 'MyLibVue/src/libs/eventbus'
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import DashboardTopInfo from './components/DashboardTopInfo'

  export default {
    name: 'dashboard',
    components: {
      Callout,
      VueSimpleDialog,
      DashboardTopInfo
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      user: state => state.user,
    }),

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },

    data: function ()
    {
      return {
        showLoader: false,
        retStatus: {status: 0, title: "", message: "", data: []},
        event_http :{success:"success", fail:"fail"},
      }
    },

    beforeMount: function ()
    {
      //this.getListData();
    },

    methods: {
      getListData()
      {
        //area-read
        this.showLoader = true;
        this.$store.dispatch('http_post', [{
          token: this.user.token,
          type: "area",
          subtype: "read",
          param: [this.user]
        }, this.event_http]).then();
      },

      //MESSAGE HTTP I/O
      dialogMessageBtn1Click()
      {
        if (this.retStatus.status === -1)
        { //error http
          this.$router.push({path: this.varRouter.getRoute("login", 0)}); //goto login page
          this.$refs.dialogMessage.hideModal();
        }
        else
        { //error token
          this.$refs.dialogMessage.hideModal();
        }
      }
    },

    mounted: function ()
    {
      //get list data
      EventBus.$on(this.event_http.success, (msg) =>
      {
        this.showLoader = false;
      });
      EventBus.$on(this.event_http.fail, (msg) =>
      {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });
    },

    beforeDestroy()
    {
      EventBus.$off(this.event_http.success);
      EventBus.$off(this.event_http.fail);
    },
  }
</script>

<style lang="scss" scoped>
</style>

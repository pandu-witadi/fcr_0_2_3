<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <div><i class="user_icon fa fa-user"/> <span class="text-avatar"> Hi, {{user.user.username}}</span></div>
    </template>
    <template slot="dropdown">
      <b-dropdown-header tag="div" class="text-center"><strong>Account</strong></b-dropdown-header>
      <b-dropdown-item><i class="fa fa-user"/> Profile</b-dropdown-item>
      <b-dropdown-item><i class="fa fa-wrench"/> Settings</b-dropdown-item>
      <b-dropdown-divider/>
      <b-dropdown-item @click="logout()"><i class="fa fa-lock"/> Logout</b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {HeaderDropdown as AppHeaderDropdown} from 'MyLibVue/src/coreui'
  import {mapState} from "vuex";
  import {getDefaultUserIcon} from "../../_constant/http_api";

  export default {
    name: 'DefaultHeaderDropdownAccnt',
    components: {
      AppHeaderDropdown
    },
    computed: mapState({
      varRouter: state => state.varRouter,
      user: state => state.user
    }),
    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data() {
      return {
        showLoader: false,
        dashboard: false,
        retStatus: {status: 0, title: "", message: "", data: []},
        event_http: {success: "success", fail: "fail"},
      }
    },
    methods: {
      logout() {
        this.showLoader = true;
        this.dashboard = this.user.dashboard;
        let param = {
          data: {
            email: this.user.user["email"],
          },
        };
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("user-logout"), param, this.event_http]).then();
      },
    },
    mounted() {
      EventBus.$on(this.event_http.success, (msg) => {
        if(this.dashboard)
          this.$router.push(this.varRouter.getRoute("dashboard-login", 1));
        else
          this.$router.push(this.varRouter.getRoute("login", 1));
        this.showLoader = false;
      });
      EventBus.$on(this.event_http.fail, (msg) => {
        this.retStatus["title"] = "Error";
        this.retStatus["mesg"] = msg["mesg"];

        if(this.dashboard)
          this.$router.push(this.varRouter.getRoute("dashboard-login", 1));
        else
          this.$router.push(this.varRouter.getRoute("login", 1));
        this.showLoader = false;
      });
    },
    beforeDestroy() {
      EventBus.$off(this.event_http.success);
      EventBus.$off(this.event_http.fail);
      this.showLoader = false;
    }
  }
</script>

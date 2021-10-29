<template>
  <div class="app flex-row align-items-center">

    <div class="container h-100">
      <div class="d-flex justify-content-center h-100">
        <div class="login_user_card">
          <div class="d-flex justify-content-center">
            <div class="login_brand_logo_container">
              <img src="../../_assets/images/idea-icon.png" class="login_brand_logo" alt="Logo">
            </div>
          </div>
          <div class="d-flex justify-content-center login_form_container">
            <b-form>
              <h1 class="page-title mb-4">Login</h1>

              <b-input-group class="mb-3">
                <b-input-group-prepend><b-input-group-text><i class="fa fa-user"></i></b-input-group-text></b-input-group-prepend>
                <b-form-input type="text" class="form-control" placeholder="Login ID" autocomplete="username email" v-model="textUserName"/>
              </b-input-group>
              <b-input-group class="mb-4">
                <b-input-group-prepend><b-input-group-text><i class="fa fa-lock"></i></b-input-group-text></b-input-group-prepend>
                <b-form-input type="password" class="form-control" placeholder="Password" autocomplete="current-password" v-model="textPassword"/>
              </b-input-group>

              <div style="color: darkred">{{msg_error}}</div>
              <div class="d-flex justify-content-center mt-3 login_bottom_container">
                <b-button variant="danger" class="btn login_btn_user" @click="gotoDashboardPage()">Login</b-button>
              </div>
            </b-form>
          </div>

          <div class="mt-4">
            <div class="d-flex justify-content-center primary">
              <b-button router-link to="/forgot-password" variant="link" class="px-0">Forgot your password?</b-button>
            </div>
            <div class="d-flex justify-content-center warning">
              <b-button router-link to="/dashboard-login" variant="link" class="px-0">User Dashboard</b-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <vue-simple-dialog
      ref="dialogMessage"
      type="danger"
      :header="retStatus.title" body="Body"
      btn1_text="Tutup"
      btn1_style="success"
      @btn1Click="dialogMessageBtn1Click()">
              <span slot="slot-body">
                <h5>{{retStatus.mesg}}</h5>
              </span>
    </vue-simple-dialog>
  </div>
</template>

<script>
import { EventBus } from 'MyLibVue/src/libs/eventbus';
import {mapState} from "vuex";
import "../../_constant/_var-routers";
import {appDebugServer, getDefaultUserIcon} from "../../_constant/http_api";
import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
import {deleteUser, isValidUser, saveUser} from "../../_constant/active_user";

export default {
  name: 'Login',

  computed: mapState({
    varRouter: state => state.varRouter,
    spinLoader: state => state.spinLoader,
  }),

  components: {
    VueSimpleDialog,
  },
  created() {
    this.$store.dispatch('createVarRouter').then(); //no selected project
    // this.$store.dispatch('deleteUser').then(); //no selected project
    deleteUser();
  },

  data () {
    return {
      showLoader : false,
      retStatus: {status: 0, title: "", message: "", data: []},
      // textUserName: 'pandu@mail.com',
      // textPassword: 'pandu',
      textUserName: '',
      textPassword: '',
      msg_error: '',
      event_http :{success:"success", fail:"fail"},
    }
  },

  methods: {
    dialogMessageBtn1Click() {
      this.$refs.dialogMessage.hideModal();
    },

    gotoDashboardPage () {
      let user_name = this.textUserName.trim();
      let user_password = this.textPassword.trim();
      if (user_name.length === 0)
      {
        this.msg_error = "No user input";
        return;
      }
      if (user_password.length === 0)
      {
        this.msg_error = "No password input";
        return;
      }
      this.authenticate(user_name, user_password);
    },
    authenticate (user_name, user_password) {
      this.showLoader = true;
      let param = {
        data: {
          email: user_name,
          password: user_password
        },
      };
      this.$store.dispatch('http_post_no_auth', [this.varRouter.getHttpType("user-login"), param, this.event_http]).then();
    },
  },
  mounted () {
    EventBus.$on(this.event_http.success, (msg) => {
      this.showLoader = false;

      let status = isValidUser(msg)
      if(status) {
        saveUser(msg.user);
        this.$router.push(this.varRouter.getRoute("start", 1));
      }
      else
      {
        this.retStatus["title"] = "Error";
        this.retStatus["mesg"] = msg["mesg"];
        this.$refs.dialogMessage.showModal();
      }
    });
    EventBus.$on(this.event_http.fail, (msg) => {
      this.retStatus["title"] = "Error";
      this.retStatus["mesg"] = msg["mesg"];
      this.showLoader = false;
      this.$refs.dialogMessage.showModal();
    });
  },
  beforeDestroy () {
    EventBus.$off(this.event_http.success);
    EventBus.$off(this.event_http.fail);
    this.showLoader = false;
  }
}
</script>

<style>
  .input-group-text {
    background: #c0392b !important;
    color: white !important;
    border: 0 !important;
    border-radius: 0.25rem 0 0 0.25rem !important;
  }
</style>

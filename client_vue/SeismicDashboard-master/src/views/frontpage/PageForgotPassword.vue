<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <img src="../../_assets/images/icon-reset.png" class="user-avatar" />
                <b-form>
                  <h1 class="page-title">Lupa Password</h1>
                  <p class="error-msg">{{ errorMsg }}</p>
                  <!--<p class="text-muted">Sign In to your account</p>-->
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="text" class="form-control" placeholder="Email" autocomplete="username email" />
                  </b-input-group>
                  <b-row>
                    <b-col cols="6">
                      <b-button variant="primary" class="px-4" @click="authenticate">Reset</b-button>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <b-button router-link to="/login" variant="link" class="px-0">ke Halaman Login</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ForgotPassword',
  data () {
    return {
      email: 'demo01@mail.com',
      errorMsg: ''
    }
  },
  methods: {
    authenticate () {
      this.$store.dispatch('forgot_password', { email: this.email})
        .then(() => this.$router.push('/'))
    },
  },
  // mounted () {
  //   EventBus.$on('failedForgotPassword', (msg) => {
  //     this.errorMsg = msg
  //   })
  // },
  // beforeDestroy () {
  //   EventBus.$off('failedForgotPassword')
  // }
}
</script>


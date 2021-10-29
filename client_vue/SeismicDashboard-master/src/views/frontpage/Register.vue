<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <h1 class="page-title">Register User</h1>
                <p class="error-msg">{{ errorMsg }}</p>
                <vue-form-generator :schema="schema" :model="model" :options="formOptions" @validated="onValidated"></vue-form-generator>

                <button class="btn btn-primary" @click="showRegisterForm">Register</button>

                <br>
                &nbsp;
                <div class="form-group">
                  <label for="exampleInputEmail1">User Detail</label>
                  <input v-model="textUsername" type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username">
                </div>
                <button class="btn btn-success" @click="showFormUpdate">Update</button>


                <br><br>
                <div>
                <button class="btn btn-warning" @click="submitRegister">Submit Register</button>
                  &nbsp;<button class="btn btn-warning" @click="detailUser">Detail User</button>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import { EventBus } from 'MyLibVue/src/libs/eventbus'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";
  import {getDefaultModel} from "../../_constant/_mylib";

export default {
  name: 'Register',

  components: {"vue-form-generator": VueFormGenerator.component},

  data() {
    return {
      textUsername:"",
      errorMsg: '',
      bvalidate: false,
      model: {},
      schema: {
        fields: []
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
      }
    }
  },

  beforeMount: function () {
    // this.getData(SCHEMA_TYPE_CREATE);
  },

  methods: {
    onValidated(isValid, errors) {
      //console.log("Validation result: ", isValid, ", Errors:", errors);
      //console.log("Errors: ", JSON.stringify(errors));
      this.bvalidate = isValid;
    },

    getData(iid) {
      this.$store.dispatch('read_schema', {KEY_SCHEMA: 0, KEY_SCHEMA_TYPE:iid})
        .then(() => this.$router.push({
          path: 'register',
        }))
    },

    showRegisterForm () {
      this.getData(1);
      // if(!this.bvalidate) return;
      // console.log(JSON.stringify(this.model))
    },

    submitRegister () {
      if(!this.bvalidate){
        console.log("Fill all parameter");
        return;
      }
      this.$store.dispatch('user_register', this.model)
        .then(() => this.$router.push({
          path: 'register',
        }))
    },

    showFormUpdate () {
      this.$store.dispatch('user_update', {USERNAME: this.textUsername})
        .then(() => this.$router.push({
          path: 'register',
        }))
    },

    detailUser () {
      this.$store.dispatch('user_detail', {USERNAME: this.textUsername})
        .then(() => this.$router.push({
          path: 'register',
        }))
    },
  },

  mounted() {
    EventBus.$on('success', (msg) => {
      this.model = getDefaultModel(msg);
      this.schema.fields = msg;
      this.errorMsg = "";
      console.log(JSON.stringify(msg));
    });
    EventBus.$on('fail', (msg) => {
      this.errorMsg = msg;
    })

    EventBus.$on('successUserUpdate', (msg) => {
      this.schema.fields = msg[0];
      this.model = msg[1][0];
      this.errorMsg = "";
    });
    EventBus.$on('failUserUpdate', (msg) => {
      this.errorMsg = msg;
    })

    EventBus.$on('successUserDetail', (msg) => {
      console.log(msg);
      console.log(JSON.stringify(msg));
      this.errorMsg = "";
    });
    EventBus.$on('failUserDetail', (msg) => {
      this.errorMsg = msg;
    })
  },

  beforeDestroy() {
    EventBus.$off('success');
    EventBus.$off('fail');

    EventBus.$off('successUserDetail');
    EventBus.$off('failUserDetail');
  },
}
</script>

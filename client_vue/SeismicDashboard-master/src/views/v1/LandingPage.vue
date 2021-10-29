<template>
  <div class="flex-row align-items-center container-fluid" style="background-color:lightblue; height: 100%">

    <button class="btn btn-light m-2" @click="openPageProspectFinder">
      <img class="img-responsive" src="../../_assets/images/asset03@2x.png"/>
      <div class="menu_landing_page_text">Prospect Finder</div>
    </button>

    <button class="btn btn-light m-2" @click="openPageProspectAnalysis">
      <img class="img-responsive" src="../../_assets/images/asset02@2x.png"/>
      <div class="menu_landing_page_text">Prospect Analysis</div>
    </button>

    <button class="btn btn-light m-2" @click="openPageProspectManagement">
      <img class="gray_image img-responsive" src="../../_assets/images/asset01@2x.png"/>
      <div class="menu_landing_page_text">Prospect Management</div>
    </button>

    <button class="btn btn-light m-2" @click="openPageDataManagement">
      <img class="img-responsive" src="../../_assets/images/asset05@2x.png"/>
      <div class="menu_landing_page_text">Data Management</div>
    </button>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import Vue from 'vue';

  export default {
    name: "LandingPage",

    components: {},
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
      user: state => state.user,
    }),
    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data: () => {
      return {}
    },
    methods: {
      openPageProspectManagement()
      {

      },
      openPageDataManagement()
      {
        this.$router.push(this.varRouter.getRoute("start-data-management", 1));
      },
      openPageProspectFinder()
      {
        let routeData = this.$router.resolve({
          path: this.varRouter.getRoute("new-prospect-wizard", 1),
        });
        window.open(routeData.href, '_blank');
      },
      openPageProspectAnalysis()
      {
        let routeData = this.$router.resolve({
          path: this.varRouter.getRoute("prospect-management", 1),
        });
        window.open(routeData.href, '_blank');
      },
    }
  }
</script>

<style scoped>
  .menu_item1 {
    padding: 0px;
    margin-bottom: 10px;
    text-align: center;
    height: 100%;
  }

  .gray_image {
    filter: grayscale(100%);
    width: 80px;
  }

  .img-responsive {
    width: 200px;
    height: 200px;
  }
  .menu_landing_page_text{
    margin-top: 10px;
    font-size: 15px;
    font-weight: bold;
    font-family: sans-serif;
  }
</style>

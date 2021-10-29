<template>
  <div class="flex-row align-items-center container-fluid" style="background-color:lightblue; height: 100%">

    <button class="btn btn-light m-2" @click="openPageDataManagementArea">
      <img class="img-responsive" src="../../_assets/images/asset06@2x.png"/>
      <div class="menu_landing_page_text">Area</div>
    </button>
    <button class="btn btn-light m-2" @click="openPageDataManagementProbilityMap">
      <img class="img-responsive" src="../../_assets/images/asset04@2x.png"/>
      <div class="menu_landing_page_text">Probability Map</div>
    </button>
    <button class="btn btn-light m-2" @click="openPageDataManagementWell">
      <img class="img-responsive" src="../../_assets/images/asset07@2x.png"/>
      <div class="menu_landing_page_text">Wells</div>
    </button>
    <button class="btn btn-light m-2" @click="openPageDataManagementUser">
      <img class="img-responsive" src="../../_assets/images/asset08@2x.png"/>
      <div class="menu_landing_page_text">Users</div>
    </button>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import Vue from 'vue';

  export default {
    name: "LandingPageDataManagement",

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
      openPageDataManagementArea()
      {
        this.$router.push(this.varRouter.getRoute("dm-area", 1));
      },
      openPageDataManagementProbilityMap()
      {
        this.$router.push(this.varRouter.getRoute("dm-probability-map", 1));
      },
      openPageDataManagementWell()
      {
        this.$router.push(this.varRouter.getRoute("dm-wells", 1));
      },
      openPageDataManagementUser()
      {
        this.$router.push(this.varRouter.getRoute("dm-users", 1));
      }
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

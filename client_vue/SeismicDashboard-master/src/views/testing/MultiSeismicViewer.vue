<template>

  <div>
    <vue-element-loading
      :spinner="spinLoader.spinner"
      :color="spinLoader.color"
      :size="spinLoader.size"
      :active="showLoader"
      :background-color="spinLoader.background_color"/>

    <div>
      <b-button-toolbar aria-label="Toolbar with button groups and input groups" class="mb-1">
        <b-dropdown size="sm" class="mr-0">
          <template slot="button-content" class="pr-1" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(colormap.id)" size="sm"/><span
            class="pl-1">{{fgetColormapName(colormap.id)}}</span>
          </template>

          <b-dropdown-item @click="setColormap(0)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(0)"/> {{fgetColormapName(0)}}
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(1)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(1)"/> {{fgetColormapName(1)}}
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(2)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(2)"/> {{fgetColormapName(2)}}
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(3)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(3)"/> {{fgetColormapName(3)}}
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(4)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(4)"/> {{fgetColormapName(4)}}
          </b-dropdown-item>
          <b-dropdown-item @click="setColormap(5)" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(5)"/> {{fgetColormapName(5)}}
          </b-dropdown-item>
        </b-dropdown>
        <!--        <b-form-checkbox v-model="reverseColormap" class="mr-1">Rev</b-form-checkbox>-->
        <enhanced-check label="Rev" style="height: 20px;" v-model="reverseColormap" class="mr-2"></enhanced-check>

        <b-input-group size="sm" style="background: #343a40" class="pl-1 pr-2">
          <b-input-group-prepend class="mr-1">
            <span style="color: white">Min ({{cmin}})</span>
          </b-input-group-prepend>
          <b-form-slider style="height:20px;" v-model="tmp_cmin" @slide-stop="slideStopMin" :min="0" :max="99"></b-form-slider>
        </b-input-group>
        <b-input-group size="sm" style="background: #343a40" class="pl-1 pr-2">
          <b-input-group-prepend class="mr-1">
            <span style="color: white">Max ({{cmax}})</span>
          </b-input-group-prepend>
          <b-form-slider style="height:20px;" v-model="tmp_cmax" @slide-stop="slideStopMax" :min="0" :max="99"></b-form-slider>
        </b-input-group>
      </b-button-toolbar>
    </div>

    <b-container fluid>
      <b-row>
        <template v-for="i in parseInt(npic)">
          <b-col>
            <LChartSeismic class="lc_seismic_chart" :colormap="colormap" :points="points" :xaxis="XAxis" :yaxis="YAxis" :cmin="cmin" :cmax="cmax"
                           :title="dataTitle"></LChartSeismic>
          </b-col>
        </template>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {getData} from "../../libs/data";
  import LChartSeismic from "../components/LChartSeismic";
  import EnhancedCheck from 'MyLibVue/src/views/vue-enhancedCheck/EnhancedCheck'
  import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
  import 'bootstrap-slider/dist/css/bootstrap-slider.css'

  import {getColormapAsset, getColormapName} from "../../libs/colormap";

  export default {
    name: "MultiSeismicViewer",

    components: {
      LChartSeismic,
      EnhancedCheck,
      bFormSlider
    },

    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    data: () =>
    {
      return {
        retStatus: {status: 0, title: "", message: "", data: []},
        showLoader: true,

        npic: 2,
        points: [],
        colormap: {id: 3, reverse: false},
        XAxis: {},
        YAxis: {},
        dataTitle: "",
        perc: 0,
        reverseColormap: false,
        cmin: 20,
        cmax: 20,
        tmp_cmin: 20,
        tmp_cmax: 20,

        event_http: {success: "success", fail: "fail"},
      }
    },
    created()
    {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },

    beforeMount: function ()
    {
      this.npic = this.$route.query.n;
      this.getDemoData();
    },
    methods: {
      fgetColormapName(ii)
      {
        return (getColormapName(ii))
      },
      setColormap(ii)
      {
        this.colormap = {id: ii, reverse: this.reverseColormap};
      },

      fgetColormapAsset(ii)
      {
        return (getColormapAsset(ii))
      },
      slideStopMin()
      {
        this.cmin = this.tmp_cmin;
      },
      slideStopMax()
      {
        this.cmax = this.tmp_cmax;
      },

      getDemoData()
      {
        this.XAxis = {
          "label": "Offset (m)",
          "sampling": 1,
          "start": 0
        };
        this.YAxis = {
          "label": "Depth (m)",
          "sampling": 2,
          "start": 50
        };
        this.points = getData();
        let data = [];
        for (let i = 0; i < this.points[0].length; i++)
          data.push(i);
        this.XAxis["data"] = data;
        this.ns = this.points.length;
        this.dt = this.YAxis["sampling"];

        this.dataTitle = "CDP NO : 1";
        this.showLoader = false;
      },
    },

    mounted()
    {
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
    watch:
      {
        reverseColormap: function (val)
        {
          this.reverseColormap = val;
          this.setColormap(this.colormap["id"]);
        },
      }
  }
</script>

<style lang="scss" scoped>
  .lc_seismic_chart {
    height: 95vh;
  }

  .btn_toolbar {
    font-size: 1.4em;
  }
</style>

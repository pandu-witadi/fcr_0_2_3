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
        <b-button size="sm" class="ml-1 mr-2" @click="saveWADialogShow()" variant="success">Save</b-button>

        <b-input-group size="sm" :prepend="YAxis.label">
          <b-form-input v-model="timePos" class="text-right" style="width: 80px"></b-form-input>
        </b-input-group>
        <b-button size="sm" class="ml-1 mr-3" @click="applyTimePosClicked()" variant="dark">Apply</b-button>

        <b-dropdown size="sm" variant="dark" :text="getDropdownNeighbor()" class="mr-2">
          <b-dropdown-item-button @click="setNeighbor(0)">0</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(1)">1</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(2)">2</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(3)">3</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(4)">4</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(5)">5</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(6)">6</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(7)">7</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(8)">8</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(9)">9</b-dropdown-item-button>
          <b-dropdown-item-button @click="setNeighbor(10)">10</b-dropdown-item-button>
        </b-dropdown>

        <b-dropdown size="sm" variant="dark" :text="getDropdownMode()" class="mr-2">
          <b-dropdown-item-button @click="setChartMode('off')">Off</b-dropdown-item-button>
          <b-dropdown-item-button @click="setChartMode('min')">Min</b-dropdown-item-button>
          <b-dropdown-item-button @click="setChartMode('max')">Max</b-dropdown-item-button>
          <b-dropdown-item-button @click="setChartMode('opt')">Opt</b-dropdown-item-button>
        </b-dropdown>

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

    <splitpanes class="default-theme" vertical style="height: 81vh" @resized="splitResizedEvent('resized', $event)">
      <pane min-size="20" max-size="80">
        <template v-if="showLoader===false">
          <LChartSeismicWithLineV31 class="lc_seismic_chart" :colormap="colormap" :resizeevent="resizeevent"
                                 :title="dataTitle" :cmin="cmin" :cmax="cmax"
                                 :points="points" :xaxis="XAxis" :yaxis="YAxis"
                                 @pointInLcAxis="updateLcPoint($event)" @cursorInfo="cursorInfo($event)"
                                 :chart_info_data="seriesSeismicInfo"/>
        </template>
      </pane>
      <pane>
        <template v-if="showLoader===false">
          <ApexChartLine class="lc_seismic_chart" :chart-options="lineChartOptions" :series="lineSeries"/>
        </template>
      </pane>
    </splitpanes>
    <div>
      <span class="box_shadow pl-1 pr-1">ntrc : {{ntrc}}</span>
      <span class="box_shadow pl-1 pr-1">nsp : {{ns}}</span>
      <span class="box_shadow pl-1 pr-1">dt : {{dt}}</span>
      <span class="box_shadow pl-1 pr-1">Y Start : {{ystart}}</span>

      <span class="box_shadow ml-3 pl-1 pr-1">Label : {{data_label}}</span>
<!--      <span class="box_shadow pl-1 pr-1">{{cursorinfo.y}}</span>-->
    </div>

    <!-- show error dialog -->
    <vue-simple-dialog
      ref="dialogMessage"
      type="primary"
      :header="retStatus.title" body="Body"
      btn1_text="Close"
      btn1_style="success"
      @btn1Click="dialogMessageBtn1Click()">
              <span slot="slot-body">
                <h5>{{retStatus.message}}</h5>
              </span>
    </vue-simple-dialog>

    <!-- save prospect dialog -->
    <vue-form-dialog
      ref="saveWellAnalogy"
      type="default"
      header="Update Group" body="Body"
      btn1_text="Close" btn2_text="Save"
      btn1_style="danger" btn2_style="primary"
      @btn1Click="saveWADialogBtn1Click()" @btn2Click="saveWADialogBtn2Click()">

      <!-- body slot -->
      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">
              <vue-form-generator :schema="wa_save_schema" :model="wa_save_model" :options="formOptions" @validated="onValidated"/>
            </span>
    </vue-form-dialog>
  </div>
</template>

<script>
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import {mapState} from "vuex";
  import LChartLine from '../components/LChartLine'
  import LChartSeismicWithLine from '../components/LChartSeismicWithLine'
  import {createAvaGatherSectionDemoData, getData} from "../../libs/data";
  import ApexChartLine from "../components/ApexChartLine";
  import {createDefaultColor, createDefaultMarker, createDefaultParam} from "../../libs/defApexChartLine";
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import {
    matrix_col_optimum,
    matrix_col_optimum_v1,
    matrix_col_optimum_v2
  } from "../../libs/test_max_min_val_each_column";
  import {getColormapAsset, getColormapName} from "../../libs/colormap";

  import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
  import 'bootstrap-slider/dist/css/bootstrap-slider.css'
  import {getIndexFromArray, getIndexFromArray3, setPositionFromIndex} from "../../libs/simpleLib";
  import EnhancedCheck from 'MyLibVue/src/views/vue-enhancedCheck/EnhancedCheck'
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'
  import {appDemoMode} from "../../_constant/http_api";
  import LChartSeismicWithLineV31 from "../components/LChartSeismicWithLineV3-1";

  import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";
  import {createWellAnalogySaveModel, createWellAnalogySaveSchema} from "../../libs/libVars";

  export default {
    name: 'ViewerGatherSection',
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
      user: state => state.user,
    }),

    components: {
      LChartSeismicWithLineV31,
      VueSimpleDialog,
      ApexChartLine,
      LChartLine,
      LChartSeismicWithLine,
      Splitpanes, Pane,
      bFormSlider,
      EnhancedCheck,

      VueFormDialog,
      "vue-form-generator": VueFormGenerator.component,
    },

    data: () =>
    {
      return {
        retStatus: {status: 0, title: "", message: "", data: []},
        showLoader: true,
        bdemo: appDemoMode(),

        pageParam: {
          id_area: -1,
          filename: ""
        },

        colormap: {id: 3, reverse: false},
        cmin: 20,
        cmax: 20,
        dataTitle: "",
        XAxis: {},
        YAxis: {},
        points: [],
        seriesSeismicInfo: [],

        resizeevent: false,
        reverseColormap: false,
        ntrc: 0,
        ns: 0,
        ystart: 0,
        dt: 1.0,
        data_label: "",
        iline: 0,
        xline: 0,
        data_neigh_mode: [],

        fixedDec: 3,
        cursorinfo: {x: 0, y: 0},

        modeMinMax: "min",
        tmp_cmin: 20,
        tmp_cmax: 20,
        myTitle: {},
        nNeighbor: 0,
        timePos: 0,
        bApplyTimePos: false,
        lcpoints: [],
        lineChartTitle: '',
        lineSeries: [],
        lineChartOptions: {},

        wa_save_schema: createWellAnalogySaveSchema(),
        wa_save_model: createWellAnalogySaveModel(),
        bvalidate: false,
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },
        event_http_gather_section: {success: "successGatherSection", fail: "failGatherSection"},
        event_http_wa_add: {success: "successWaAddEl", fail: "failWaAddEl"},
      }
    },
    created()
    {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },

    beforeMount: function ()
    {
      this.pageParam["id_area"] = this.$route.query.id_area*1;
      this.pageParam["filename"] = this.$route.query.filename;

      let iline_ = this.$route.query.iline*1;
      let xline_ = this.$route.query.xline*1;
      let zmin_ = this.$route.query.zmin*1;
      let zmax_ = this.$route.query.zmax*1;
      let label_ = this.$route.query.label;
      this.wa_save_model["label"] = label_;
      let valid_gather_by_pos = !Number.isNaN(iline_ + xline_ + zmin_ + zmax_);
      if(this.bdemo)
      {
        let tmpdata = createAvaGatherSectionDemoData();
        this.parseLcSeismicData(tmpdata[0]);
        this.createChartInfo();
        this.showLoader = false;
      }
      else
      {
        if(valid_gather_by_pos)
        {
          let tmp_data = this.pageParam;
          tmp_data["iline"] = iline_;
          tmp_data["xline"] = xline_;
          tmp_data["z"] = {min: zmin_, max: zmax_};
          tmp_data["label"] = label_;
          let param = {
            // user: this.user["user"],
            data: tmp_data
          };
          this.showLoader = true;
          this.$store.dispatch('http_post', [this.varRouter.getHttpType("ava-segy-get-gather-section"), param, this.event_http_gather_section]).then();
        }
        else
        {
          let param = {
            // user: this.user["user"],
            data: this.pageParam
          };

          this.showLoader = true;
          this.$store.dispatch('http_post', [this.varRouter.getHttpType("ava-segy-view-gather-section"), param, this.event_http_gather_section]).then();
        }

      }
    },
    methods: {
      onValidated(isValid, errors) {
        this.bvalidate = isValid;
      },
      saveWADialogShow()
      {
        this.$refs.saveWellAnalogy.showModal();
      },

      saveWADialogBtn1Click() {
        this.$refs.saveWellAnalogy.hideModal();
      },
      saveWADialogBtn2Click() {
        if (!this.bvalidate) return;

        this.saveWellAnalogy();
        this.$refs.saveWellAnalogy.hideModal();
      },

      parseLcSeismicData(obj)
      {
        this.ns = obj.ava[0].length;
        this.ntrc = obj.header.length;
        this.dt = obj.interval;
        this.ystart = obj.z_st;
        this.timePos = obj.z_c;
        this.data_label = obj.label;

        this.points = [];
        for (let i = this.ns - 1; i >= 0; i--)
        {
          let tmp0 = [];
          for (let j = 0; j < this.ntrc; j++)
            tmp0.push(obj.ava[j][i]);
          this.points.push(tmp0);
        }

        this.XAxis = {
          label: "X",
          sampling: 1,
          data: obj.header
        };
        this.YAxis = {
          label: "Y",
          start: this.ystart,
          sampling: this.dt
        };
        this.dataTitle = "IL-" + obj.iline + "/XL-" + obj.xline;
        this.iline = obj.iline;
        this.xline = obj.xline;
      },
      createChartInfo()
      {
        this.lineSeries = [];
        let tidx = getIndexFromArray3(this.timePos, this.dt, this.ystart);
        let pp = tidx;
        if(tidx<0)
          pp = 0;
        else if(tidx>=this.ns)
          pp = this.ns - 1;

        this.timePos = setPositionFromIndex(pp, this.dt, this.ystart);
        let t1 = pp - this.nNeighbor;
        let t2 = pp + this.nNeighbor;
        if (t1 < 0) t1 = 0;
        if (t2 >= this.ns) t2 = this.ns - 1;

        let ArrModeMinMax = [];
        for (let k = t1; k <= t2; k++)
        {
          let tmp = [];
          for (let i = 0; i < this.ntrc; i++)
          {
            tmp.push(this.points[this.ns-k-1][i]); //karena data terflip
          }
          let line_title = setPositionFromIndex(k, this.dt, this.ystart);
          this.lineSeries.push({
            type: 'line',
            name: line_title,
            data: tmp
          });
          ArrModeMinMax.push(tmp);
        }

        // plot min max data
        this.seriesSeismicInfo = null;
        this.data_neigh_mode = [];
        if (this.modeMinMax !== 'off') {
          let opt_data = matrix_col_optimum_v2(t2 - t1 + 1, this.ntrc, this.modeMinMax, ArrModeMinMax, t1, this.XAxis["data"], this.dt, this.ystart);
          this.lineSeries.push({
            type: 'line',
            name: "Mode : " + this.modeMinMax,
            data: opt_data["opt"]
          });
          this.data_neigh_mode = opt_data["opt"];
          this.seriesSeismicInfo = opt_data["info"];
        }

        this.lineChartTitle = this.dataTitle + ", " + this.YAxis["label"] + " : " + setPositionFromIndex(pp, this.dt, this.ystart);
        this.lineChartOptions = createDefaultParam();
        this.lineChartOptions["title"]["text"] = this.lineChartTitle;
        this.lineChartOptions["xaxis"]["categories"] = this.XAxis["data"];
        this.lineChartOptions["xaxis"]["title"]["text"] = this.XAxis["label"];
        this.lineChartOptions["yaxis"]["title"]["text"] = "Amplitude";
        this.lineChartOptions["colors"] = createDefaultColor(t1, t2 + 1, [pp, t2 + 1]);
        this.lineChartOptions["markers"] = createDefaultMarker(t1, t2 + 1, [pp, t2 + 1], 4, 0)
      },
      fgetColormapName(ii)
      {
        return (getColormapName(ii))
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

      splitResizedEvent(strinfo, event)
      {
        this.resizeevent = !this.resizeevent;
        this.createChartInfo();
      },
      cursorInfo(e)
      {
        this.cursorinfo = e;
      },
      updateLcPoint(e)
      {
        this.timePos = (Math.round(e.y)).toFixed(this.fixedDec);
        if (e.isValid)
          this.createChartInfo();
      },
      setChartMode(ii)
      {
        this.modeMinMax = ii;
        this.createChartInfo();
      },
      setNeighbor(ii)
      {
        this.nNeighbor = ii;
        this.createChartInfo();
      },
      setColormap(ii)
      {
        this.colormap = {id: ii, reverse: this.reverseColormap};
      },
      getDropdownNeighbor()
      {
        return ("Neighbor ( " + this.nNeighbor + " ) ");
      },
      getDropdownMode()
      {
        return (this.modeMinMax);
      },
      getColormapColor()
      {
        return ("Colormap : " + getColormapName(this.colormap));
      },

      applyTimePosClicked()
      {
        this.bApplyTimePos = true;
        this.createChartInfo();
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

      saveWellAnalogy()
      {
        let tmp_data = {
          id_area: this.pageParam["id_area"],
          filename: this.pageParam["filename"],
          wa_el: {
            neigh: this.nNeighbor,
            z: this.timePos * 1.0,
            mode: this.modeMinMax,
            iline: this.iline,
            xline: this.xline,
            label: this.wa_save_model["label"],
            header: this.XAxis["data"],
            value: this.data_neigh_mode
          }
        };
        let param = {
          // user: this.user["user"],
          data: tmp_data
        };
        // console.log(JSON.stringify(param))

        this.showLoader = true;
        this.$store.dispatch('http_post', [this.varRouter.getHttpType("wa-add-el"), param,
          this.event_http_wa_add]).then();
      }
    },

    mounted()
    {
      EventBus.$on(this.event_http_gather_section.success, (msg) =>
      {
        this.parseLcSeismicData(msg.data[0]);
        this.createChartInfo();
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_gather_section.fail, (msg) =>
      {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

      EventBus.$on(this.event_http_wa_add.success, (msg) =>
      {
        this.retStatus.title = "Information";
        this.retStatus.message = msg.mesg;
        this.$refs.dialogMessage.showModal();
        this.showLoader = false;
      });
      EventBus.$on(this.event_http_wa_add.fail, (msg) =>
      {
        this.showLoader = false;
        this.retStatus = msg;
        this.$refs.dialogMessage.showModal();
      });

    },
    beforeDestroy()
    {
      EventBus.$off(this.event_http_gather_section.success);
      EventBus.$off(this.event_http_gather_section.fail);
      EventBus.$off(this.event_http_wa_add.success);
      EventBus.$off(this.event_http_wa_add.fail);

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
    height: 81vh;
  }

  .btn_toolbar {
    font-size: 1.4em;
  }
</style>

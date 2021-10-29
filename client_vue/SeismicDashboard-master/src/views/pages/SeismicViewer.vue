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

    <splitpanes class="default-theme" vertical style="height: 77vh" @resized="splitResizedEvent('resized', $event)">
      <pane min-size="20" max-size="80">
        <template v-if="showLoader==false">
          <LChartSeismicWithLine class="lc_seismic_chart" :colormap="colormap" :resizeevent="resizeevent"
                                 :title="dataTitle" :cmin="cmin" :cmax="cmax"
                                 :points="points" :xaxis="XAxis" :yaxis="YAxis"
                                 @pointInLcAxis="updateLcPoint($event)" @cursorInfo="cursorInfo($event)"
                                 :chart_info_data="seriesSeismicInfo"/>
        </template>
      </pane>
      <pane>
        <template v-if="showLoader==false">
          <ApexChartLine class="lc_seismic_chart" :chart-options="lineChartOptions" :series="lineSeries"/>
        </template>
      </pane>
    </splitpanes>
    <div>
      <span class="box_shadow pl-1 pr-1">ntrc : {{ntrc}}</span>
      <span class="box_shadow pl-1 pr-1">nsp : {{ns}}</span>
      <span class="box_shadow pl-1 pr-1">dt : {{dt}}</span>
      <span class="box_shadow pl-1 pr-1">start : {{ystart}}</span>
      <span class="box_shadow ml-3 pl-1 pr-1">{{cursorinfo.x}}</span>
      <span class="box_shadow pl-1 pr-1">{{cursorinfo.y}}</span>
    </div>

    <!--    <vue-form-dialog-->
    <!--      ref="dataDialog"-->
    <!--      type="default"-->
    <!--      header="Parameters" body="Body"-->
    <!--      btn1_text="Close" btn2_text="Process"-->
    <!--      btn1_style="danger" btn2_style="primary">-->
    <!--&lt;!&ndash;      @btn1Click="radiusDialogBtn1Click()" @btn2Click="radiusDialogBtn2Click()">&ndash;&gt;-->

    <!--      &lt;!&ndash; body slot &ndash;&gt;-->
    <!--&lt;!&ndash;      <span slot="slot-body" style="padding-left: 20px; padding-right: 20px; width: 100%">&ndash;&gt;-->
    <!--&lt;!&ndash;              <vue-form-generator :schema="schema" :model="model" :options="formOptions" @validated="onValidated"/>&ndash;&gt;-->
    <!--&lt;!&ndash;            </span>&ndash;&gt;-->
    <!--    </vue-form-dialog>-->

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
  import LChartLine from '../components/LChartLine'
  import LChartSeismicWithLine from '../components/LChartSeismicWithLine'
  import {getData} from "../../libs/data";
  import ApexChartLine from "../components/ApexChartLine";
  import {createDefaultColor, createDefaultMarker, createDefaultParam} from "../../libs/defApexChartLine";
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import {matrix_col_optimum, matrix_col_optimum_v1} from "../../libs/test_max_min_val_each_column";
  import {getColormapAsset, getColormapName} from "../../libs/colormap";

  import bFormSlider from 'vue-bootstrap-slider/es/form-slider';
  import 'bootstrap-slider/dist/css/bootstrap-slider.css'
  import {getIndexFromArray, setPositionFromIndex} from "../../libs/simpleLib";
  import EnhancedCheck from 'MyLibVue/src/views/vue-enhancedCheck/EnhancedCheck'
  import VueSimpleDialog from 'MyLibVue/src/components/vue-simple-dialog'

  // import VueFormDialog from 'MyLibVue/src/components/vue-form-dialog'
  // import clusterize from "vue-clusterize"

  export default {
    name: 'SeismicViewer',
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    components: {
      VueSimpleDialog,
      ApexChartLine,
      LChartLine,
      LChartSeismicWithLine,
      Splitpanes, Pane,
      bFormSlider,
      EnhancedCheck,
      // VueFormDialog,
      // "clusterize": clusterize
    },

    data: () =>
    {
      return {
        retStatus: {status: 0, title: "", message: "", data: []},
        showLoader: true,

        fixedDec: 3,
        ntrc: 0,
        ns: 0,
        ystart: 0,
        dt: 1.0,
        resizeevent: false,
        reverseColormap: false,
        colormap: {id: 3, reverse: false},
        cursorinfo: {x: 0, y: 0},
        seriesSeismicInfo: [],

        cmin: 20,
        cmax: 20,
        modeMinMax: "min",
        tmp_cmin: 20,
        tmp_cmax: 20,
        myTitle: {},
        nNeighbor: 0,
        timePos: 0,
        bApplyTimePos: false,
        points: [],
        lcpoints: [],
        dataTitle: "",
        lineChartTitle: '',
        XAxis: {},
        YAxis: {},
        lineSeries: [],
        lineChartOptions: {},
        event_http: {success: "success", fail: "fail"},
      }
    },
    created()
    {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },

    beforeMount: function ()
    {
      // this.getDemoData();
      this.getListData();
    },
    methods: {
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
        // return ("Mode ( " + this.modeMinMax + " ) ");
        return (this.modeMinMax);
      },
      getColormapColor()
      {
        return ("Colormap : " + getColormapName(this.colormap));
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
        this.createChartInfo();
        this.showLoader = false;
      },
      getListData()
      {
        this.showLoader = true;
        let imode = this.$route.query.mode * 1;

        if(imode === 0)
        {
          let str_st = this.$route.query.st;
          let str_en = this.$route.query.en;
          let cur_url = "/api/segy/trace-view/" + str_st + "/" + str_en;
          this.$store.dispatch('http_get', [cur_url, {}, this.event_http]).then();
        }
        else
        {
          let str_fid = this.$route.query.fid;
          let str_st = this.$route.query.iline;
          let str_en = this.$route.query.xline;
          let cur_url = "/api/segy/view-iline-xline";
          this.$store.dispatch('http_post', [cur_url, {file_id:str_fid, iline: str_st, xline: str_en}, this.event_http]).then();
        }
      },
      applyTimePosClicked()
      {
        this.bApplyTimePos = true;
        this.createChartInfo();
      },
      createChartInfo()
      {
        this.lineSeries = [];
        let tidx = getIndexFromArray(this.timePos, this.dt, this.ystart);

        let pp = this.ns - tidx - 1;
        if (pp < 0)
        {
          pp = 0;
          this.timePos = setPositionFromIndex(this.ns - 1, this.dt, this.ystart);
        }
        else if (pp >= this.ns)
        {
          pp = this.ns - 1;
          this.timePos = setPositionFromIndex(0, this.dt, this.ystart);
        }

        let t1 = pp - this.nNeighbor;
        let t2 = pp + this.nNeighbor;
        if (t1 < 0) t1 = 0;
        if (t2 > this.ns) t2 = this.ns - 1;

        let ArrModeMinMax = [];
        for (let k = t2; k >= t1; k--)
        {
          let tmp = [];
          for (let i = 0; i < this.points[0].length; i++)
          {
            tmp.push(this.points[k][i]);
          }
          let line_title = setPositionFromIndex(this.ns - k - 1, this.dt, this.ystart);
          this.lineSeries.push({
            type: 'line',
            name: line_title,
            data: tmp
          });
          ArrModeMinMax.push(tmp);
        }

        // plot min max data
        if (this.modeMinMax !== 'off')
        {
          let nx = this.points[0].length;
          //let v_data_minmax = matrix_col_optimum(t2 - t1 + 1, nx, this.modeMinMax, ArrModeMinMax);
          let opt_data = matrix_col_optimum_v1(t2 - t1 + 1, nx, this.modeMinMax, ArrModeMinMax, t1, this.XAxis["data"], this.dt, this.ns);
          this.lineSeries.push({
            type: 'line',
            name: "Mode : " + this.modeMinMax,
            data: opt_data["opt"]
          });
          this.seriesSeismicInfo = opt_data["info"];
          // console.log(JSON.stringify(this.seriesSeismicInfo))
        }
        else
        {
          this.seriesSeismicInfo = null;
        }

        this.lineChartTitle = this.dataTitle + ", " + this.YAxis["label"] + " : " + setPositionFromIndex(this.ns - pp - 1, this.dt, this.ystart);
        this.lineChartOptions = createDefaultParam();
        this.lineChartOptions["title"]["text"] = this.lineChartTitle;
        this.lineChartOptions["xaxis"]["categories"] = this.XAxis["data"];
        this.lineChartOptions["xaxis"]["title"]["text"] = this.XAxis["label"];
        this.lineChartOptions["yaxis"]["title"]["text"] = "Amplitude";
        this.lineChartOptions["colors"] = createDefaultColor(t1, t2 + 1, [pp, t2 + 1]);
        this.lineChartOptions["markers"] = createDefaultMarker(t1, t2 + 1, [pp, t2 + 1], 4, 0)

        if (this.bApplyTimePos === false)
        {
          this.timePos = setPositionFromIndex(this.ns - pp - 1, this.dt, this.ystart);
        }

        this.bApplyTimePos = false;
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
    },

    mounted()
    {
      EventBus.$on(this.event_http.success, (msg) =>
      {
        this.points = [];
        let tmp = msg["cdp_data"];
        this.ns = tmp[0].length;
        this.ntrc = tmp.length;
        for (let i = this.ns - 1; i >= 0; i--)
        {
          let tmp0 = [];
          for (let j = 0; j < this.ntrc; j++)
            tmp0.push(tmp[j][i]);
          this.points.push(tmp0);
        }

        this.XAxis = msg["x"];
        this.YAxis = msg["y"];
        this.XAxis["data"] = msg["cdp_header"];
        this.dt = this.YAxis["sampling"];
        this.ystart = this.YAxis["start"];
        // console.log(JSON.stringify(msg["cdp_header"]))

        this.dataTitle = msg["title"] + msg["cdp_no"];
        this.createChartInfo();
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
    height: 77vh;
  }

  .btn_toolbar {
    font-size: 1.4em;
  }
</style>

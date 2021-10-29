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
        <b-dropdown size="sm" class="mr-1">
          <template slot="button-content" class="pr-2">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(curColormap)" size="sm"/>
          </template>

          <b-dropdown-item @click="curColormap=4" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(4)"/> Gray
          </b-dropdown-item>
          <b-dropdown-item @click="curColormap=3" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(3)"/> Petrel
          </b-dropdown-item>
          <b-dropdown-item @click="curColormap=2" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(2)"/> Seismic
          </b-dropdown-item>
          <b-dropdown-item @click="curColormap=0" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(0)"/> Sharp
          </b-dropdown-item>
          <b-dropdown-item @click="curColormap=1" size="sm">
            <img class="colormapImageDropdown" :src="fgetColormapAsset(1)"/> Yrwbc
          </b-dropdown-item>
        </b-dropdown>
        <enhanced-check label="Reverse" style="height: 25px;" v-model="reverseColormap"></enhanced-check>
        <label class="switch switch-pill switch-label switch-outline-primary">
          <input type="checkbox" class="switch-input" checked>
          <span class="switch-slider" data-checked="On" data-unchecked="Off"></span>
        </label>


        <b-input-group size="sm" :prepend="YAxis.label">
          <b-form-input v-model="timePos" class="text-right" style="width: 70px"></b-form-input>
        </b-input-group>
        <b-button size="sm" class="ml-1 mr-3" @click="createChartInfo()" variant="dark">Apply</b-button>

        <!--        <b-button-group size="md">-->
        <!--          <b-button class="mr-1" variant="dark" @click="showHideChartSeismic()"><i class="btn_toolbar fa fa-image"></i></b-button>-->
        <!--          <b-button class="mr-1" variant="dark" @click="showHideChartLine()"><i class="btn_toolbar fa fa-line-chart"></i></b-button>-->
        <!--        </b-button-group>-->
        <b-dropdown size="sm" variant="dark" :text="getDropdownNeighbor()">
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
      </b-button-toolbar>
    </div>

    <splitpanes class="default-theme" vertical style="height: 77vh" @resized="splitResizedEvent('resized', $event)">
      <pane min-size="20" max-size="80">
        <template v-if="showLoader==false">
          <LChartSeismicWithLine class="lc_seismic_chart" :colormap="colormap" :perc="plotPerc" :title="dataTitle"
                                 :points="points" :xaxis="XAxis" :yaxis="YAxis" @pointInLcAxis="updateLcPoint($event)"
                                 :chart_info_data="seriesSeismicInfo"
          />
        </template>
      </pane>
      <pane>
        <template v-if="showLoader==false">
          <ApexChartLine class="lc_seismic_chart" :chart-options="lineChartOptions" :series="lineSeries"/>
        </template>
      </pane>
    </splitpanes>
  </div>
</template>

<script>
  import {EventBus} from 'MyLibVue/src/libs/eventbus';
  import EnhancedCheck from 'MyLibVue/src/views/vue-enhancedCheck/EnhancedCheck'
  import {mapState} from "vuex";
  import LChartLine from '../components/LChartLine'
  import LChartSeismicWithLine from '../components/LChartSeismicWithLine'
  import {getData} from "../../libs/data";
  import ApexChartLine from "../components/ApexChartLine";
  import {createDefaultColor, createDefaultMarker, createDefaultParam} from "../../libs/defApexChartLine";
  import {Splitpanes, Pane} from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import {getIndexFromArray3, setPositionFromIndex} from "../../libs/simpleLib";
  import {getColormapAsset} from "../../libs/colormap";
  import _ from 'lodash';
  import {matrix_col_optimum, matrix_col_optimum_v1} from "../../libs/test_max_min_val_each_column";

  export default {
    name: 'SeismicView',
    computed: mapState({
      varRouter: state => state.varRouter,
      spinLoader: state => state.spinLoader,
    }),

    components: {
      ApexChartLine,
      LChartLine,
      LChartSeismicWithLine,
      Splitpanes, Pane,
      EnhancedCheck
    },

    data: () =>
    {
      return {
        curColormap: 4,
        reverseColormap: false,

        modeMinMax: "min",
        showLoader: true,
        seriesSeismicInfo: [],
        dx: 1.0,
        dy: 1.0,
        ns: 0,
        colormap: {id: 4, reverse: false},
        myTitle: {},
        nNeighbor: 0,
        timePos: 0,
        points: [],
        lcpoints: [],
        dataTitle: "",
        plotPerc: 20,
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
      this.getDemoData();
      // this.getListData();
    },
    methods: {
      updateColormap()
      {
        this.colormap = {id: this.curColormap, reverse: this.reverseColormap}
      },
      fgetColormapAsset(ii)
      {
        return (getColormapAsset(ii))
      },
      fgetColormapReverse()
      {
        this.colormap = {id: curColormap, reverse: this.reverseColormap};
        console.log(JSON.stringify(this.colormap))
      },
      splitResizedEvent(strinfo, event)
      {
        this.createChartInfo();
      },
      updateLcPoint(e)
      {
        if (e.isValid)
        {
          let idx_pos = getIndexFromArray3(e.y, this.dy, this.YAxis["start"]);
          this.timePos = setPositionFromIndex(idx_pos, this.dy, this.YAxis["start"]);
          this.createChartInfo();
        }
      },
      setNeighbor(ii)
      {
        this.nNeighbor = ii;
        this.createChartInfo();
      },
      getDropdownNeighbor()
      {
        return ("Neighbor ( " + this.nNeighbor + " ) ");
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
          "start": 0
        };
        this.points = getData();
        let data = [];
        for (let i = 0; i < this.points[0].length; i++)
          data.push(i);
        this.XAxis["data"] = data;
        this.dy = this.YAxis["sampling"];

        this.dataTitle = "CDP NO : 1";
        this.createChartInfo();
        this.showLoader = false;
      },
      getListData()
      {
        this.showLoader = true;
        this.$store.dispatch('http_get', ["/api/segy/trace-view/1/1000", {}, this.event_http]).then();
      },
      createChartInfo()
      {
        this.lineSeries = [];

        this.ns = this.points.length;
        let tidy = getIndexFromArray3(this.timePos, this.dy, this.YAxis["start"]);

        let pp = this.ns - tidy - 1;
        if (pp < 0)
        {
          pp = 0;
          this.timePos = this.YAxis["start"] + (this.YAxis["sampling"] * this.ns) - 1;
        }
        else if (pp >= this.ns)
        {
          pp = this.ns - 1;
          this.timePos = this.YAxis["start"];
        }

        let t1 = pp - this.nNeighbor;
        let t2 = pp + this.nNeighbor;
        if (t1 < 0) t1 = 0;
        if (t2 > this.ns) t2 = this.ns - 1;

        let ArrModeMinMax = [];
        for (let k = t1; k <= t2; k++)
        {
          let tmp = [];
          for (let i = 0; i < this.points[0].length; i++)
          {
            tmp.push(this.points[k][i]);
          }
          let line_title = ((this.ns - k - 1) * this.YAxis["sampling"] + this.YAxis["start"]);
          this.lineSeries.push({
            type: 'line',
            name: line_title,
            data: tmp
          });
          ArrModeMinMax.push(tmp);
        }
        let nx = this.points[0].length;
        // let v_data_minmax = matrix_col_optimum(t2 - t1 + 1, nx, this.modeMinMax, ArrModeMinMax);
        let opt_data = matrix_col_optimum_v1(t2 - t1 + 1, nx, this.modeMinMax, ArrModeMinMax, t1, this.XAxis["data"], this.dy, this.ns);
        this.lineSeries.push({
          type: 'line',
          name: "Mode : " + this.modeMinMax,
          data: opt_data["opt"]
        });
        this.seriesSeismicInfo = opt_data["info"];
        // console.log(JSON.stringify(this.seriesSeismicInfo));

        this.lineChartTitle = this.dataTitle + ", " + this.YAxis["label"] + " : " + ((this.ns - pp - 1) * this.dy + this.YAxis["start"]);
        this.lineChartOptions = createDefaultParam();
        this.lineChartOptions["title"]["text"] = this.lineChartTitle;
        this.lineChartOptions["xaxis"]["categories"] = this.XAxis["data"];
        this.lineChartOptions["xaxis"]["title"]["text"] = this.XAxis["label"];
        this.lineChartOptions["yaxis"]["title"]["text"] = "Amplitude";
        this.lineChartOptions["colors"] = createDefaultColor(t1, t2, pp);
        this.lineChartOptions["markers"] = createDefaultMarker(t1, t2, pp, 4, 0)
      }

    },

    mounted()
    {
      EventBus.$on(this.event_http.success, (msg) =>
      {
        this.points = [];
        let tmp = msg["cdp_data"];
        for (let i = tmp[0].length - 1; i >= 0; i--)
        {
          let tmp0 = [];
          for (let j = 0; j < tmp.length; j++)
            tmp0.push(tmp[j][i])
          this.points.push(tmp0);
        }

        this.XAxis = msg["x"];
        this.YAxis = msg["y"];
        this.XAxis["data"] = msg["cdp_header"];
        this.dx = this.XAxis["data"][1] - this.XAxis["data"][0];
        this.dy = this.YAxis["sampling"] * 1.0;

        this.dataTitle = "CDP NO : " + msg["cdp_no"];
        this.createChartInfo();
        this.showLoader = false;
      });
      EventBus.$on(this.event_http.fail, (msg) =>
      {
        // printJson("INPUT --> ", msg);
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
          this.updateColormap();
        },
        curColormap: function (val)
        {
          this.curColormap = val;
          this.updateColormap();
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

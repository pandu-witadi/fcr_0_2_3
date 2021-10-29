<template>
  <div>
    <Overlay :opened="opened" :visible="visible" @closed="overlayClosed()">
      <div>
        <template v-if="bdraw===true">
          <b-container>
            <b-btn class="btn btn-md mr-1" variant="success" @click="refreshChart()">Refresh Chart</b-btn>
            <view-l-chart3-d-scatter :points="points" :bupdateChart="bupdateChart" style="height: 80vh"></view-l-chart3-d-scatter>
          </b-container>
        </template>
      </div>
    </Overlay>

    <b-container fluid>
    <b-btn class="btn btn-md mr-1" variant="success" @click="openAvaDialog()">AVA List</b-btn>
    </b-container>

  </div>
</template>

<script>
  import {mapState} from "vuex";
  import Overlay from "../components/Overlay";
  import ViewLChart3DScatter from "./viewLChart3DScatter";

  export default {
    name: "DemoOverlay",

    components: {
      ViewLChart3DScatter,
      Overlay
    },
    computed: mapState({
    }),

    created() {
      this.$store.dispatch('createVarRouter').then(); //no selected project
    },
    data() {
      return {
        opened: false,
        visible: false,
        bdraw: false,
        points: [],

        bupdateChart: false
      }
    },

    beforeMount: function () {
      let xmin = 556669.18089384;
      let xmax = 557669.18089384;
      let ymin = 9899202.54338531;
      let ymax = 9899877.54338531;
      let zmin = 485.46374512;
      let zmax = 498.89390945;
      this.points.push({x:xmin, y:ymin, z:zmin});
      this.points.push({x:xmax, y:ymin, z:zmin});
      this.points.push({x:xmax, y:ymax, z:zmin});
      this.points.push({x:xmin, y:ymax, z:zmin});
      this.points.push({x:xmin, y:ymin, z:zmax});
      this.points.push({x:xmax, y:ymin, z:zmax});
      this.points.push({x:xmax, y:ymax, z:zmax});
      this.points.push({x:xmin, y:ymax, z:zmax});
    },

    methods: {
      overlayClosed()
      {
        this.bdraw = false;
        this.opened = false;
        this.visible = false;
      },

      refreshChart()
      {
        this.bupdateChart = !this.bupdateChart;
      },
      openAvaDialog() {
        // this.bdraw = true;
        // this.opened = true;
        // this.visible = true;

        window.open("overlay", '_blank');
      },

    },
    mounted() {
    },

    beforeDestroy() {
    },
  }
</script>

<style scoped>
</style>

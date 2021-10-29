<template>
<div>
  <l-map class="map" id="map" ref="map" :zoom="zoom" :center="center">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

    <Vue2LeafletHeatmap :lat-lng="markers" :radius="25" :min-opacity=".5" :max-zoom="10" :blur="20"></Vue2LeafletHeatmap>
  </l-map>

</div>
</template>

<script>
  import {LMap, LTileLayer, LMarker, LPopup} from 'vue2-leaflet'
  import Vue2LeafletHeatmap from "../components/Vue2LeafletHeatmap";
  import 'leaflet/dist/leaflet.css'

  import * as L from "leaflet";
  import {mapState} from "vuex";
  import {getPinMarker, getMapServer} from "../../libs/simpleLib";

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

    export default {
        name: "vue-leaflet-heatmap",

      components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        Vue2LeafletHeatmap
      },
      computed: mapState({
      }),

      props: {
        markers: {
          type: Array,
          required: true
        },
        center: {
          type: Object,
          required: true,
          default : L.latLng(-6.90389, 107.61861)
        },
        popup_data : {
          type: Array,
          default: () => ([])
        }
      },

      data () {
        return {
          showLoader : false,
          retStatus: {status: 0, title: "", message: "", data: []},

          defaultIcon: L.icon({
            iconUrl: getPinMarker(),
            iconSize: [32, 36],
            iconAnchor: [16, 36]
          }),

          zoom: 11,
          // url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
          url: getMapServer(1),
          attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
        }
      },

      methods: {
        eventGeoSearch(result){
        },
        openPopup: function (event) {
          this.$nextTick(() => {
            event.target.openPopup();
          })
        },

        createDemoCss(cc)
        {
          return('<span class="map-marker1" style="background-color:' + cc +'"/>');
        },

        createCustomMarkerPopup(item)
        {
          let sstr = "";
          for (let i = 0; i < this.popup_data.length; i++)
            sstr = sstr + this.popup_data[i].label + " : <b>" + item[this.popup_data[i].key] + "</b><br>";
          return (sstr);
        },
      },

      mounted: function () {
        setTimeout(function () {
          window.dispatchEvent(new Event('resize'))
        }, 250);

        // DO
        this.$nextTick(() => {
          this.map = this.$refs.map.mapObject; // work as expected
        });
      },
    }
</script>

<style scoped>
  @import "https://unpkg.com/leaflet-geosearch@2.6.0/assets/css/leaflet.css";

  .map {
    position: absolute;
    height: 100%;
    outline: none;
    touch-action: none;
    width: calc(100% - 12px);
  }
</style>

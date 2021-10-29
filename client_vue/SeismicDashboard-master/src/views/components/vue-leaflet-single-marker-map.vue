<template>
  <div >
    <l-map class="map" ref="map" :zoom="map_var.zoom" :center="map_var.center"
           :crs="map_var.crs" :minZoom="map_var.minZoom" :maxZoom="map_var.maxZoom">
      <l-tile-layer :url="map_var.url" :attribution="map_var.attribution"/>

      <l-marker :lat-lng="cur_marker" :draggable="true" :icon="defaultIcon" @drag="dragMarkerCoordinates">
        <l-popup>X : <b>{{cur_marker.lng.toFixed(2)}}</b><br>Y : <b>{{cur_marker.lat.toFixed(2)}}</b></l-popup>
      </l-marker>

      <l-polygon :lat-lngs="map_var.polygon" :color="map_var.poly_color[0]">
      </l-polygon>
    </l-map>

  </div>
</template>

<script>
  import {LMap, LTileLayer, LMarker, LPopup, LPolygon} from 'vue2-leaflet'
  import 'leaflet/dist/leaflet.css'

  import * as L from "leaflet";
  import {mapState} from "vuex";
  import {getLocalMapServer, getMapPinMarker} from "../../_constant/http_api";
  import {createAreaLeafletDemoData} from "../../libs/demo_data";

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  export default {
    name: "vue-leaflet-single-marker-map",

    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
      LPolygon
    },
    // props: ['map_var', 'marker'],

    props: {
    //   mapstyle: {
    //     type : Object,
    //     requred : false,
    //     default: () => ({"height" : "100px"})
    //   },
      map_var: {
        type: Object,
        required: false,
        default: () => (createAreaLeafletDemoData())
      },
      marker: {
        type: Object,
        required: false,
        default: () => (L.latLng(9964642.99999999, 578261.000000058))
      }
    },

    data()
    {
      return {
        showLoader: false,
        retStatus: {status: 0, title: "", message: "", data: []},

        cur_marker: JSON.parse(JSON.stringify(this.marker)),
        defaultIcon: L.icon({
          iconUrl: getMapPinMarker(),
          iconSize: [32, 36],
          iconAnchor: [16, 36]
        }),
      }
    },

    methods: {
      dragMarkerCoordinates(location)
      {
        this.cur_marker = location.latlng;
      },
    },

    mounted: function ()
    {
      setTimeout(function () {
        window.dispatchEvent(new Event('resize'))
      }, 250);

      // DO
      this.$nextTick(() => {
        this.map = this.$refs.map.mapObject; // work as expected
      });
    },

    created() {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 450);
    },

    watch :
      {
        cur_marker: function (val) {
          this.$emit('updateMarkerPosition', val);
        },
      }
  }
</script>

<style scoped>
  .map {
    position: absolute;
    height: 300px;
    outline: none;
    touch-action: none;
    width: calc(100% - 40px);
  }
</style>

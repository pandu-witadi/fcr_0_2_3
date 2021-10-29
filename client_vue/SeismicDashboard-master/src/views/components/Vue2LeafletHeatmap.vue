<template>
  <div style="display: none">
    <slot v-if="ready"></slot>
  </div>
</template>

<script>
  import L from "leaflet";
  import "leaflet.heat";
  import { findRealParent, propsBinder } from "vue2-leaflet";
  const props = {
    latLngs: {
      type: Array,
      default: () => [],
      custom: false,
    },
    gradient: {
      type: Object,
      custom: true,
    },
    minOpacity: {
      type: Number,
      custom: true,
    },
    maxZoom: {
      type: Number,
      custom: true,
    },
    radius: {
      type: Number,
      custom: true,
    },
    blur: {
      type: Number,
      custom: true,
    },
    max: {
      type: Number,
      custom: true,
    },
    visible: {
      type: Boolean,
      custom: true,
      default: true,
    },
  };
  export default {
    name: "LHeatmap",
    props,
    data() {
      return {
        ready: false,
      };
    },
    mounted() {
      const options = {};
      if (this.minOpacity) {
        options.minOpacity = this.minOpacity;
      }
      if (this.gradient) {
        options.gradient = this.gradient;
      }
      if (this.maxZoom) {
        options.maxZoom = this.maxZoom;
      }
      if (this.radius) {
        options.radius = this.radius;
      }
      if (this.blur) {
        options.blur = this.blur;
      }
      if (this.max) {
        options.max = this.max;
      }
      this.mapObject = L.heatLayer(this.latLngs, options);
      L.DomEvent.on(this.mapObject, this.$listeners);
      propsBinder(this, this.mapObject, props);
      this.ready = true;
      this.parentContainer = findRealParent(this.$parent);
      this.parentContainer.addLayer(this, !this.visible);
    },
    beforeDestroy() {
      this.parentContainer.removeLayer(this);
    },
    methods: {
      setMinOpacity(newVal, oldVal) {
        this.mapObject.setOptions({ minOpacity: newVal });
      },
      setGradient(newVal, oldVal) {
        this.mapObject.setOptions({ gradient: newVal });
      },
      setMaxZoom(newVal, oldVal) {
        this.mapObject.setOptions({ maxZoom: newVal });
      },
      setRadius(newVal, oldVal) {
        this.mapObject.setOptions({ radius: newVal });
      },
      setBlur(newVal, oldVal) {
        this.mapObject.setOptions({ blur: newVal });
      },
      setMax(newVal, oldVal) {
        this.mapObject.setOptions({ max: newVal });
      },
      setVisible(newVal, oldVal) {
        if (newVal === oldVal) return;
        if (newVal) {
          this.parentContainer.addLayer(this);
        } else {
          this.parentContainer.removeLayer(this);
        }
      },
      addLatLng(value) {
        this.mapObject.addLatLng(value);
      },
    },
  };
</script>

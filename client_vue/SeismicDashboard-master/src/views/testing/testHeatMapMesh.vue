<template>
  <div>
    <LHeatMapMesh title="Test 123"></LHeatMapMesh>
  </div>
</template>

<script>
  import LHeatMapMesh from "../components/LHeatMapMesh";

  export default {
    name: "testHeatMap",
    components: {LHeatMapMesh},
    data()
    {
      return {
      }
    },

    methods: {
    },
    mounted()
    {
      // Chart can only be created when the component has mounted the DOM because
      // the chart needs the element with specified containerId to exist in the DOM
      // this.createChart();
    },

    beforeMount()
    {
    },

    beforeDestroy()
    {
    },
  }
</script>

<style scoped>
  .image {
    height: 100%;
    position: relative;
    z-index: 1;
  }

  .overlay {
    position: relative;
    z-index: 2;
  }
</style>


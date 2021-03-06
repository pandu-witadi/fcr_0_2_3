<template>
  <div>
    <div :id="chartId"></div>
  </div>
</template>

<script>
  import {
    ColorRGBA,
    lightningChart,
    PalettedFill,
    LUT
  } from '@arction/lcjs'

  export default {
    name: "testHeatMap",

    data()
    {
      return {
        chartId: null,
      }
    },

    methods: {
      WaterDropGenerator(sizeX, sizeZ, xPositionsNormalized, zPositionsNormalized, amplitudes, offsetLevel, volatility)
      {
        /**
         * Calculate waves at given point.
         * @param x wave origin x-coordinate.
         * @param z wave origin z-coordinate.
         * @param oscillators Oscillators.
         * @param volatility Volatility.
         * @returns wave height at given point.
         */
        function CalculateWavesAtPoint(x, z)
        {
          let resultValue = 0;
          const iOscillatorCount = oscillators.length;
          for (let i = 0; i < iOscillatorCount; i++)
          {
            const oscillator = oscillators[i];
            const distX = x - oscillator.centerX;
            const distZ = z - oscillator.centerZ;
            const dist = Math.sqrt(distX * distX + distZ * distZ);
            resultValue += oscillator.gain * oscillator.amplitude * Math.cos(dist * volatility) * Math.exp(-dist * 3.0)
          }
          return resultValue
        }

        const iOscCount = amplitudes.length;
        const oscillators = [];

        for (let iOsc = 0; iOsc < iOscCount; iOsc++)
        {
          oscillators[iOsc] = {
            amplitude: amplitudes[iOsc],
            centerX: xPositionsNormalized[iOsc],
            centerZ: zPositionsNormalized[iOsc],
            gain: 1,
            offsetY: 0
          }
        }

        const result = Array.from(Array(sizeZ)).map(() => Array(sizeX));
        const dTotalX = 1;
        const dTotalZ = 1;
        const stepX = (dTotalX / sizeX);
        const stepZ = (dTotalZ / sizeZ);

        // calculate the data
        for (let row = 0, z = 0; row < sizeZ; row++ , z += stepZ)
        {
          for (let col = 0, x = 0; col < sizeX; col++ , x += stepX)
          {
            result[col][row] = CalculateWavesAtPoint(x, z) + offsetLevel
          }
        }
        return result
      },

      createChart()
      {
        // Create a XY Chart.
        const chart = lightningChart().ChartXY()
          .setTitle('Heatmap using IntensityGrid');

        // Specify the resolution used for the heatmap.
        const sqRes = 200;
        const resolutionX = sqRes;
        const resolutionY = sqRes;

        // Generate data to use for heatmap
        const data = this.WaterDropGenerator(
          resolutionX,     // size of nodes in X
          resolutionY,     // size of nodes in Z
          [0.2, 0.5, 0.7], // Drop X positions in scale 0...1
          [0.6, 0.5, 0.3], // Drop Z positions in scale 0...1
          [15, 50, 3],     // Amplitudes, as Y axis values
          47,              // Offset level (mid-Y)
          25               // Volatility, wave generating density
        );
        // Create LUT and FillStyle
        const palette = new LUT({
          steps: [
            {value: 0, color: ColorRGBA(0, 0, 0)},
            {value: 30, color: ColorRGBA(255, 255, 0)},
            {value: 45, color: ColorRGBA(255, 204, 0)},
            {value: 60, color: ColorRGBA(255, 128, 0)},
            {value: 100, color: ColorRGBA(255, 0, 0)}
          ],
          interpolate: false
        });

        // Add a Heatmap to the Chart. By default IntensityGrid Series Type is used.
        const heatmap = chart.addHeatmapSeries({
          rows: resolutionX,
          columns: resolutionX,
          start: {x: 10, y: 10},
          end: {x: 90, y: 90},
          pixelate: false
        })
          // Add data and invalidate the Series based on added data.
          .invalidateValuesOnly(data)
          // Use created Paletted FillStyle for the Heatmap.
          .setFillStyle(new PalettedFill({lut: palette}))
      }
    },
    mounted()
    {
      // Chart can only be created when the component has mounted the DOM because
      // the chart needs the element with specified containerId to exist in the DOM
      this.createChart();
    },

    beforeMount()
    {
      // Generate random ID to us as the containerId for the chart and the target div id
      this.chartId = Math.trunc(Math.random() * 1000000)
    },

    beforeDestroy()
    {
      // "dispose" should be called when the component is unmounted to free all the resources used by the chart
      this.chart.dispose()
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


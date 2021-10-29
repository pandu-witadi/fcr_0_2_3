const path = require('path');

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  assetsDir: 'static',
  publicPath: '',
  outputDir: '../dist',

  configureWebpack: {
    resolve: {
      alias: {
        leaflet: path.join(__dirname, 'node_modules/leaflet'),
      },
    },
  },
};

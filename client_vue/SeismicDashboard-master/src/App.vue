<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: 'app',
  }
</script>

<style lang="scss">
  // CoreUI Icons Set
  @import '~MyLibVue/src/coreui/icons/css/coreui-icons.min.css';
  /* Import Font Awesome Icons Set */

  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome.scss';

  /* Import Bootstrap Vue Styles */
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
  /*@import "~bootstrap/scss/bootstrap";*/
  /*@import "~bootstrap-vue/src/index.scss";*/

  // Import Main styles for this application
  @import '_assets/scss/style';

  @import '_assets/scss/syncfusion.css';
</style>

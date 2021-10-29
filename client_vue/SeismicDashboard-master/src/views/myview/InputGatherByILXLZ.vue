<template>
  <div class="p-2">
    <b-row>
      <b-col cols="2">
        <b-input-group>
          <b-input-group-prepend><b-input-group-text>Inline</b-input-group-text></b-input-group-prepend>
          <b-form-input type="text" class="form-control" placeholder=""/>
        </b-input-group>
      </b-col>
      <b-col cols="2">
        <b-input-group>
          <b-input-group-prepend><b-input-group-text>Xline</b-input-group-text></b-input-group-prepend>
          <b-form-input type="text" class="form-control" placeholder=""/>
        </b-input-group>
      </b-col>
      <b-col cols="2">
        <b-input-group>
          <b-input-group-prepend><b-input-group-text>Z</b-input-group-text></b-input-group-prepend>
          <b-form-input type="text" class="form-control" placeholder=""/>
        </b-input-group>
      </b-col>
      <b-col cols="1">
        <b-button variant="primary">Select</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import Vue from 'vue';
  // import {TextBoxPlugin} from "@syncfusion/ej2-vue-inputs";
  // Vue.use(TextBoxPlugin);
  // import {ButtonPlugin} from '@syncfusion/ej2-vue-buttons';
  // Vue.use(ButtonPlugin);
    export default {
        name: "InputGatherByILXLZ"
    }
</script>

<style scoped>

</style>

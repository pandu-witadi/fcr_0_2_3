<template>
  <div>
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-1 variant="secondary">Dynamic input for map</b-button>
      </b-card-header>

      <b-collapse id="accordion-1" visible accordion="my-accordion1" role="tabpanel">
        <b-card-body>
      <div>
        <div>{{param[0].title}} <span class="data_range">( {{param[0].min}} to {{param[0].max}} )</span></div>
        <b-row>
          <b-col cols="5">
            <ejs-numerictextbox :min="param[0].min" :max="param[0].max" :step="param[0].step"
                                :value="param[0].vmin" format="n0"/>
          </b-col>
          <b-col cols="2" class="text-center">
            to
          </b-col>
          <b-col cols="5">
            <ejs-numerictextbox :min="param[0].min" :max="param[0].max" :step="param[0].step"
                                :value="param[0].vmax" format="n0"/>
          </b-col>
        </b-row>
      </div>

      <div class="mt-2">
        <div>{{param[1].title}} <span class="data_range">( {{param[1].min}} to {{param[1].max}} )</span></div>
        <b-row>
          <b-col cols="5">
            <ejs-numerictextbox :min="param[1].min" :max="param[1].max" :step="param[1].step"
                                :value="param[1].vmin" format="n0"/>
          </b-col>
          <b-col cols="2" class="text-center">
            to
          </b-col>
          <b-col cols="5">
            <ejs-numerictextbox :min="param[1].min" :max="param[1].max" :step="param[1].step"
                                :value="param[1].vmax" format="n0"/>
          </b-col>
        </b-row>
      </div>

      <div class="mt-2">
        <div>{{param[2].title}} <span class="data_range">( {{param[2].min}} to {{param[2].max}} )</span></div>
        <b-row>
          <b-col cols="5">
            <ejs-numerictextbox :min="param[2].min" :max="param[2].max" :step="param[2].step"
                                :value="param[2].vmin" v-model="param[2].vmin" format="n2"/>
          </b-col>
          <b-col cols="2" class="text-center">
            to
          </b-col>
          <b-col cols="5">
            <ejs-numerictextbox :min="param[2].min" :max="param[2].max" :step="param[2].step"
                                :value="param[2].vmax" v-model="param[2].vmax" format="n2"/>
          </b-col>
        </b-row>
      </div>

      <div class="mt-3">
        <ejs-button cssClass='e-danger' class="mr-2 mb-2" v-on:click.native='onClickResetSection'>Reset</ejs-button>
<!--        <ejs-button cssClass='e-success' class="mr-2 mb-2" v-on:click.native='onClickSetParameter'>Set Parameter</ejs-button>-->
        <ejs-button cssClass='e-info' class="mb-2" v-on:click.native='onClickViewPropose'>Propose Prospect</ejs-button>
      </div>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {NumericTextBoxPlugin} from "@syncfusion/ej2-vue-inputs";

  Vue.use(NumericTextBoxPlugin);
  import {ButtonPlugin} from '@syncfusion/ej2-vue-buttons';

  Vue.use(ButtonPlugin);

  export default {
    name: "DynamicInputForMap",
    props: {
      param: {
        type: Array,
        required: false,
        default: function () {
          return [
            {
              title: "InLine",
              min: 1,
              max: 3201,
              step: 1,
              min: 1,
              max: 4000,
              vmin: 20,
              vmax: 80
            },
            {
              title: "XLine",
              min: 1,
              max: 100,
              step: 1,
              min: 1,
              max: 100,
              vmin: 20,
              vmax: 80
            },
            {
              title: "Depth",
              min: 1,
              max: 100,
              step: 1,
              min: 1,
              max: 100,
              vmin: 20,
              vmax: 80
            }
          ]
        }
      },
    },
    watch :
      {
      },
    methods: {
      onClickResetSection()
      {
        let val = this.param;
        this.$emit('onClickResetSection', val);
      },
      onClickSetParameter()
      {
        let val = this.param;
        this.$emit('onClickSetParameter', val);
      },
      onClickViewPropose()
      {
        this.$emit('onClickViewPropose', this.param);
      },
      // onClickViewProspect()
      // {
      //   this.$emit('onClickViewProspect', this.param);
      // },
    },
  }
</script>

<style scoped>
.data_range {
  color: #5cb85c;
  font-size: 90%;
  font-style: oblique;
  margin-left: 20px;
}
</style>

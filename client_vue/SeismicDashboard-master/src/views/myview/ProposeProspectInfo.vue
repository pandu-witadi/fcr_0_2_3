<template>
  <div>
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-2 variant="secondary">Propose Prospect</b-button>
      </b-card-header>

      <b-collapse id="accordion-2" visible accordion="my-accordion2" role="tabpanel">
        <b-card-body>
          <b-row>
            <b-col cols="6">Area : <span class="item_value">{{param.id_area}}</span></b-col>
            <b-col cols="6">Layer : <span class="item_value">{{param.layer}}</span></b-col>
          </b-row>

          <div class="item_title">Exca</div>
          <b-table
            show-empty
            :small="true"
            :striped="false"
            :bordered="true"
            :outlined="true"
            :fields="table_exca_heder"
            :items="getTableExcaBox()">
          </b-table>

          <div class="item_title">Box</div>
          <b-table
            show-empty
            :small="true"
            :striped="false"
            :bordered="true"
            :outlined="true"
            :fields="table_propose_box_header"
            :items="getTableProposeProspectBox()">
          </b-table>
          <template v-if="showButton">
            <div class="mt-3">
              <ejs-button cssClass='e-info' class="mb-2" v-on:click.native='onClickViewProspect'>View Prospect Map
              </ejs-button>
            </div>
          </template>
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
  import {
    createTableExcaBoxHeader,
    createTableProposeProspectBoxHeader
  } from "../../libs/libVars";
  import {convertProposeExcaBoxObjectToArray, convertProposeProspectBoxObjectToArray} from "../../libs/libUpdateData";

  Vue.use(ButtonPlugin);

  export default {
    name: "ProposeProspectInfo",
    props: {
      showButton: {
        type: Boolean,
        required: false,
        default: true
      },
      param: {
        type: Object,
        required: false,
        default: function () {
          return {
            "id_area": 0,
            "layer": 0,
            "exca": {
              "iline": {
                "min": 0,
                "max": 0
              },
              "xline": {
                "min": 0,
                "max": 0
              },
              "z": {
                "min": 0.0,
                "max": 0.0
              }
            },
            "boxa": {
              "p1": {
                "iline": 0,
                "xline": 0,
                "x": 0.0,
                "y": 0.0
              },
              "p2": {
                "iline": 0,
                "xline": 0,
                "x": 0.0,
                "y": 0.0
              },
              "p3": {
                "iline": 0,
                "xline": 0,
                "x": 0.0,
                "y": 0.0
              },
              "p4": {
                "iline": 0,
                "xline": 0,
                "x": 0.0,
                "y": 0.0
              }
            }
          }
        }
      },
    },
    data: () => {
      return {
        table_exca_heder: createTableExcaBoxHeader(),
        table_exca: [],
        table_propose_box_header: createTableProposeProspectBoxHeader(),
        table_propose_box: []
      }
    },
    watch:
      {},
    methods: {
      onClickViewProspect() {
        this.$emit('onClickViewProspect', this.param);
      },

      getTableExcaBox() {
        if ("exca" in this.param === false) {
          console.log("exca NOT EXIST")
          return;
        }

        this.table_exca = convertProposeExcaBoxObjectToArray(this.param);
        return (this.table_exca);
      },
      getTableProposeProspectBox() {
        if ("boxa" in this.param === false) {
          console.log("boxa NOT EXIST")
          return;
        }

        this.table_propose_box = convertProposeProspectBoxObjectToArray(this.param);
        return (this.table_propose_box);
      }
    },
  }
</script>

<style scoped>
  .item_value {
    color: #0000CD;
    font-size: 100%;
    font-weight: bold;
  }

  .item_title {
    color: #000000;
    font-size: 120%;
    font-weight: bold;
    margin-top: 5px;
  }

  .scrollable {
    overflow-y: auto;
    max-height: 200px;
  }
</style>

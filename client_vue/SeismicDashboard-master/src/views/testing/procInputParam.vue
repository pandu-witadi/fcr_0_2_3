<template>
  <div class="panel-body">
    <h4>AVA Navigation</h4>
    <vue-form-generator :schema="schema_ava" :model="model_ava" :options="formOptions"></vue-form-generator>
    <br>
    <h4>Map Propagation</h4>
    <vue-form-generator :schema="schema_mp" :model="model_mp" :options="formOptions"></vue-form-generator>
  </div>
</template>

<script>
  import VueFormGenerator from "MyLibVue/src/views/vue-form-generator";

  export default {
    name: "procInputParam",

    components: {
      "vue-form-generator": VueFormGenerator.component,
    },

    data()
    {
      return {
        model_ava: {
          geobodyava: "",
          xava: 0,
          yava: 0,
          zava: 0
        },
        model_mp: {
          mpsub: "",
          mpevent: ""
        },
        schema_ava: {
          fields: [
            {
              type: 'select',
              label: 'Choose Geobody',
              model: 'geobodyava',
              selectOptions : {
                hideNoneSelectedText: true
              },
              values: ['Geobody 1', 'Geobody 2', 'Geobody 3', 'Geobody 4']
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'X Coordinates',
              model: 'xava',
              placeholder: 'X Coordinates',
              featured: true,
              required: true
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Y Coordinates',
              model: 'yava',
              placeholder: 'Y Coordinates',
              featured: true,
              required: true
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Z Coordinates',
              model: 'zava',
              placeholder: 'Z Coordinates',
              featured: true,
              required: true
            },
          ]
        },
        schema_mp: {
          fields: [
            {
              type: 'select',
              label: 'Sub-stack Radius',
              model: 'mpsub',
              selectOptions: {
                hideNoneSelectedText: true
              },
              values: ['x m', 'y m', 'z m']
            },
            {
              type: 'select',
              label: 'Event',
              model: 'mpevent',
              selectOptions: {
                hideNoneSelectedText: true
              },
              values: ['Peak', 'Through', 'Peak/Through']
            },
          ]
        },
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
        },
      }
    }
  }
</script>

<style scoped>

</style>

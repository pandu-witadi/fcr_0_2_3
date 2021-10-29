<template>
  <div>
    <multiselect
      v-model="value"
      :options="schema.values"
      :disabled="schema.disabled"
      :placeholder="schema.placeholder"
      :multiple="schema.multiple"
      :searchable="schema.searchable"
      :hideSelected="schema.hideSelected"
      :closeOnSelect="schema.closeOnSelect"
      :clearOnSelect="schema.clearOnSelect"
      :showNoOptions="true"
      selectLabel=""
      :label="schema.labelname"
      :custom-label="createCustomLabel"
      v-bind:style="mystyle">
    </multiselect>
  </div>
</template>

<script>
  import abstractField from "MyLibVue/src/views/vue-form-generator/fields/abstractField";
  import Multiselect from "MyLibVue/src/views/vue-multiselect";

  export default {
    name: 'field-select-item',
    mixins: [abstractField],

    components: {
      Multiselect
    },

    props: {},

    computed:{
    },
    data()
    {
      return {
        mystyle: {
          'width': "fit-content",
          'min-width' : "400px",
        }
      }
    },

    created()
    {
      //console.log(JSON.stringify(this.schema));
    },
    methods: {
      createCustomLabel({file_name, ciloc})
      {
        if(file_name===undefined) return (""); //no selected data

        return (`${file_name}`);
      }
    }
  };
</script>
<style scoped>
  .v-select .dropdown-toggle .clear { visibility: hidden; }
</style>


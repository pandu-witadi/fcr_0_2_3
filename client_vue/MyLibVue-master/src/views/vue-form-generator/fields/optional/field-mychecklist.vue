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
      v-bind:style="mystyle">
    </multiselect>
  </div>
</template>

<script>
  import abstractField from "../abstractField";
  import Multiselect from "../../../vue-multiselect";

  export default {
    name: 'field-mychecklist',
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
          'width': "100%",
          'min-width' : "200px"
        }
      }
    },

    created()
    {
      //console.log(JSON.stringify(this.schema));
    },
    methods: {
    }
  };
</script>
<style scoped>
  .v-select .dropdown-toggle .clear { visibility: hidden; }
</style>


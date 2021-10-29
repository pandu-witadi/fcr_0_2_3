<template>
  <div>
    <enhanced-check
      :label="schema.label1"
      :subClass="schema.subClass"
      v-model="value"
      :disabled="schema.disabled"
      :rounded="true"
      :animate="false"
      @change="onChanged">

    </enhanced-check>
  </div>
</template>

<script>
  import abstractField from "../abstractField";
  import EnhancedCheck from '../../../vue-enhancedCheck/EnhancedCheck';

  export default {
    name: 'field-mycheckbox',
    mixins: [abstractField],

    components: {
      "enhanced-check": EnhancedCheck
    },

    props: {},

    data() {
      return {}
    },

    methods: {
      onChanged() {
        this.$emit("model-updated", "", this.schema.model);
      }
    }
  };
</script>
<style scoped>

</style>


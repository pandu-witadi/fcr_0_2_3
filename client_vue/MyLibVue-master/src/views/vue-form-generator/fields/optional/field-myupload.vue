<template>
  <div style="width: 100%">
    <label class="file-select"
           :placeholder="schema.placeholder"
           :readonly="schema.readonly"
           v-model="value">
      <input type="file" @change="handleFileChange"/>
    </label>
  </div>
</template>

<script>
  import abstractField from "../abstractField";

  export default {
    name: 'field-myupload',
    mixins: [abstractField],

    data() {
      return {

      }
    },

    methods: {
      handleFileChange(e) {
        this.value = e.target.files[0];
      }
    }
  };
</script>
<style scoped>

</style>


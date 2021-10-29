<template>
  <div style="width: 100%" v-if="visible">
    <label class="file-select"
           :placeholder="schema.placeholder"
           :readonly="schema.readonly"
           v-model="value"
           style="margin-right: 10px">
      <input type="file" @change="handleFileChange"/>
    </label>
    <span v-if="show_scan_button">
      <a class="button button1" @click="scanFileClicked()">Scan File</a>
    </span>
  </div>
</template>

<script>
  import abstractField from "../abstractField";

  export default {
    name: 'field-myuploadwithscan',
    mixins: [abstractField],

    props: {
      visible: {
        type: Boolean,
        default: true
      },
      change_event: {
        type: String,
        default: "scan_file"
      },
    },

    data() {
      return {
        show_scan_button: false
      }
    },

    methods: {
      scanFileClicked() {
        this.$emit("model-updated", "", "scan_file");
      },
      handleFileChange(e) {
        this.value = e.target.files[0];
        if (this.value.name != null)
          this.show_scan_button = true;
      }
    }
  };
</script>
<style>
  .button1 {
    border: 1px solid black;
    background-color: #CCFFCC;
    color: #000080;
    padding: 3px 7px;
    cursor: pointer;
  }

  .button1:hover {
    background-color: #DAA520;
    color: white;
  }
</style>


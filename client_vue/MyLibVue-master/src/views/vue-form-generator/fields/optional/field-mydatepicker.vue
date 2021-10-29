<template>
  <div>
    <div class="input-group" @click="openPickDate"
         :readonly="schema.readonly">

      <div class="input-group-prepend">
        <input type="text" class="form-control" :placeholder="schema.placeholder" v-model="value"
               :disabled="schema.disabled">
      </div>
      <div class="input-group-append">
        <span class="input-group-text" id="basic-addon2"><i class="fa fa-calendar"/></span>
      </div>
    </div>
    <date-picker @close="closePickDate"
                 v-if="show"
                 v-model="value"/>
  </div>
</template>

<script>
  import abstractField from "../abstractField";
  import VueDatePicker from '../../../../components/VueDatePicker'

  export default {
    name: 'field-mydatepicker',
    mixins: [abstractField],

    components: {
      "date-picker": VueDatePicker
    },

    props: {},

    data() {
      return {
        show: false
      }
    },

    methods: {
      openPickDate() {
        if (this.show === false) {
          if (this.schema.disabled === false || this.schema.disabled === undefined)
            this.show = true;
        }
      },
      closePickDate() {
        this.show = false;
      }
    }
  };
</script>
<style scoped>

</style>


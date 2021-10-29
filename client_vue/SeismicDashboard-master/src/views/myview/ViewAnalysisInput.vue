<template>
  <div>
    <div>
      <div class="mb-2">CONFIDENCE RATING</div>
      <StarRating v-model="param.star" :rating="param.star" :star-size="30"
                  :show-rating="false" :maxRating="10" activeColor="#FF8C00"/>
    </div>
    <div>
      <div class="mb-2 mt-3">NOTE</div>
      <b-form-textarea
        v-model="param.note"
        placeholder="Enter something..."
        rows="3"
        max-rows="6"/>
    </div>
<!--    <div>-->
<!--      <div class="mb-2 mt-3">WEIGHT</div>-->
<!--      <div><strong>{{param.weight}}</strong></div>-->
<!--    </div>-->
<!--    <div>-->
<!--      <div class="mb-2 mt-3">SCORE</div>-->
<!--      <div><strong>{{param.weight}}</strong></div>-->
<!--    </div>-->
<!--    <div class="mt-2">-->
<!--      <ejs-button cssClass='e-success' v-on:click.native='onClickUpdateButton'>Update</ejs-button>-->
<!--    </div>-->
  </div>
</template>

<script>
  import Vue from 'vue';
  import {ButtonPlugin} from '@syncfusion/ej2-vue-buttons';
  Vue.use(ButtonPlugin);
  import StarRating from 'MyLibVue/src/views/star-rating/star-rating'

  export default {
    name: "ViewAnalysisInput",
    components: {
      StarRating
    },
    props: {
      param: {
        type: Object,
        required: true,
        default: function () {
          return {
            star: 0,
            weight: 0,
            note: "",
            score: 0
          }
        }
      }
    },
    methods: {
      onClickUpdateButton() {
        let val = this.param;
        this.$emit('updateParam', val);
      }
    },
    watch: {
      // param(val)
      // {
        // this.$emit('updateParam', val);
      // }
    }
  }
</script>

<style scoped>

</style>

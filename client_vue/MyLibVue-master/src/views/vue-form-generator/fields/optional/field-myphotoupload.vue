<template>
  <div style="width: 100%; background: white">
    <div class="row">
      <div class="col-3">
        <croppa v-model="mycroppa"
                :removeButtonSize="schema.btnsize"
                :width="schema.width"
                :height="schema.height"
                :quality="schema.quality"
                :file-size-limit="4000 * 1024"
                accept=".png,.jpg,.jpeg,.bmp"
                :disable-drag-and-drop="false"
                @file-size-exceed="alertFileInfo"
                @file-type-mismatch="alertFileInfo"
                :placeholder="schema.placeholder"
                :readonly="schema.readonly"
                :initial-image="value"
                :placeholder-font-size="16"
                @resetImage="resetImage">
        </croppa>
        <button class="btn-sm" @click="saveImage" style="background-color: #FFA500"><i class="fa fa-save"/>&nbsp;{{schema.btntext}}
        </button>
        &nbsp; <span v-show="successSave"><i class="fa fa-check" style="font-size: 15px; color: green"/></span>
      </div>
    </div>
  </div>
</template>

<script>
  import abstractField from "../abstractField";
  import '../../../vue-croppa/vue-croppa.css';
  import Croppa from '../../../vue-croppa/vue-croppa';

  export default {
    name: 'field-myphotomyupload',
    mixins: [abstractField],

    components: {
      Croppa,
      // 'vue-form-generator' : VueFormGenerator.component
    },

    data() {
      return {
        successSave: false,
        mycroppa: null,
        imgUrl: ''
      }
    },

    methods: {
      handleFileChange(e) {
        this.value = e.target.files[0];
      },

      alertFileInfo() {
        alert('Choose a file < 1 mb or drag and drop *.png/*.jpg/*.jpeg/*.bmp file');
      },

      saveImage() {
        let url = this.mycroppa.generateDataUrl();
        if (!url) {
          alert('no image');
          this.successSave = false;
          return
        }
        this.imgUrl = url;
        this.value = this.imgUrl;
        this.successSave = true;
      },

      resetImage(){
        this.successSave = false;
      }
    }
  };
</script>
<style scoped>
  .croppa-container {
    background-color: white;
    border: 2px solid black;
    margin-right: 15px;
  }

  .btn-sm {
    border: 2px solid black;
    background-color: #4CAF50; /* Green */
  }

  .button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
  }
</style>


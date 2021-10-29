<template>
  <b-modal
    :no-fade="banimation"
    ref="thisModalRef" id="modal-center" centered title="Bootstrap-Vue"
    :header-bg-variant="type"
    :title="header">

    <div class="modal-body">
      <b-row class="mb-1 text-center">
        <!--<b-col cols="1">ICON</b-col>-->
        <slot name="slot-body">
          {{body}}
        </slot>
      </b-row>
    </div>

    <div slot="modal-footer">
      <span v-if="showButton(btn1_text)">
        <button type="button" :class="getVariantStyle(btn1_style)" @click="btn1Click()" style="margin-right: 10px">{{btn1_text}}</button>
      </span>

      <span v-if="showButton(btn2_text)">
        <button type="button" :class="getVariantStyle(btn2_style)" @click="btn2Click()" style="margin-right: 10px">{{btn2_text}}</button>
      </span>
    </div>

  </b-modal>
</template>

<script>
  export default {
    name: "vue-simple-dialog",

    props: {
      banimation: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'success'
      },
      dialog_icon: {
        type: String,
        default: '',
        required: false
      },
      header: {
        type: String,
        required: true
      },
      body: {
        type: String,
        required: true
      },
      btn1_text: {
        type: String,
        default: ''
      },
      btn2_text: {
        type: String,
        default: ''
      },
      btn1_style: {
        type: String,
        default: 'btn btn-primary'
      },
      btn2_style: {
        type: String,
        default: 'btn btn-danger'
      },
    },

    data() {
      return {
        variants: [
          'default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark'
        ],
        headerBgVariant: 'primary',
        headerTextVariant: 'light',
        bodyBgVariant: 'light',
        bodyTextVariant: 'dark',
        footerBgVariant: 'warning',
        footerTextVariant: 'dark'
      };
    },
    methods: {
      showButton(sstr) {
        if (sstr.length === 0)
          return (false);
        else
          return (true);
      },

      getVariantStyle(sstr) {
        for (let i = 0; i < this.variants.length; i++) {
          if (this.variants[i] === sstr)
            return ("btn btn-" + this.variants[i]);
        }
        return ("btn btn-" + this.variants[0]);
      },

      btn1Click() {
        this.$emit('btn1Click');
      },
      btn2Click() {
        this.$emit('btn2Click');
      },

      hideModal() {
        this.$refs.thisModalRef.hide()
      },
      showModal() {
        this.$refs.thisModalRef.show()
      }
    },
  }
</script>

<style scoped>
  /*
  ----------------------------------------------------
  DESCRIPTION
  ----------------------------------------------------
  ref = nama modal dialog
  type = jenis header dialog --> ['default', 'primary',
      'secondary', 'success', 'warning', 'danger', 'info', 'light', 'dark']
  header = title header
  body = isi pesan
  btn1_text, btn2_text = button text [btn1 btn2]
  btn1_style, btn2_style = button style (seperti type)
  btn1Click, btn2Click = button click signal

  SLOT :
  slot-body

  Other Parameter :
  banimation : false (default)  --> use animation

  ----------------------------------------------------
  Contoh 1: simple dialog
  ----------------------------------------------------
  <vue-simple-dialog
  ref="modalRef"
  type="primary"
  header="Information" body="Body"
  btn1_text="Update" btn2_text="Batal"
  btn1_style="primary" btn2_style="danger"
  @btn1Click="btn1Click()" @btn2Click="btn2Click()"/>

  ----------------------------------------------------
  Contoh 2: dialog dengan custom body
  ----------------------------------------------------
  <vue-simple-dialog
        ref="mydialog1"
        type="primary"
        header="Information" body="Body"
        btn1_text="Update" btn2_text="Batal"
        btn1_style="primary" btn2_style="danger"
        @btn1Click="btn1Click()" @btn2Click="btn2Click()">
        <span slot="slot-body">
          <b>Hai apa kabar</b>
        </span>
  </vue-simple-dialog>
  */

</style>


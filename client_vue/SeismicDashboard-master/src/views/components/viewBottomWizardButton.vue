<template>
  <div>
    <b-row>
      <b-col class="col-1 text-left">
        <template v-if="index*1 > 0">
          <b-button class="pt-1 pb-1 pl-4 pr-4" squared :style="setButtonStyle()" @click="leftClicked()">{{textleft}}</b-button>
        </template>
      </b-col>
      <b-col class="col-10">
      </b-col>
      <b-col class="col-1 text-right">
        <b-button class="pt-1 pb-1 pl-4 pr-4" squared :style="setButtonStyle()" @click="rightClicked()">{{textright}}</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  export default {
    name: "viewBottomWizardButton",

    props: {
      textleft: {
        type: String,
        default: "Back"
      },
      textright: {
        type: String,
        default: "Next"
      },
      index: {
        type: String,
        default: 0
      },
      bgcolor: {
        type: String,
        default: "#FF8000"
      },
      fgcolor: {
        type: String,
        default: "#F5F5F5"
      },
      left_clicked: {
        type: String,
        default: ""
      },
      right_clicked: {
        type: String,
        default: ""
      },
    },
    data()
    {
      return {}
    },
    methods: {
      setButtonStyle()
      {
        let strstyle = "color:" + this.fgcolor + "; " +
          "background-color:" + this.bgcolor + "; " +
          "border-color:" + this.bgcolor + ";";
        return(strstyle);
      },

      leftClicked()
      {
        if(this.left_clicked === "")
          return;

        this.$router.push({
          path: this.left_clicked,
        });
      },

      rightClicked()
      {
        if(this.right_clicked === "")
          return;

        this.$router.push({
          path: this.right_clicked
        });
      }
    }
  }
</script>

<style scoped>

</style>

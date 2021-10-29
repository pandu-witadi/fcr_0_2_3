<template>
  <div>
    <template v-for="(item, ii) in icon">
      <b-button class="pt-0 pb-0" squared :style="getTabStyle(ii)"><span :style="setTabTextSize()"><i :class="item" style="font-size: 100%"></i></span><br>{{title[ii]}}
      </b-button>
    </template>
  </div>
</template>

<script>
  export default {
    name: "viewProcessWizardButton",
    props: {
      icon: {
        type: Array,
        default: () => ([
          "fa fa-wpforms", "fa fa-map"
        ])
      },
      title: {
        type: Array,
        default: () => ([
          "disable", "enable"
        ])
      },
      index: {
        type: Number,
        default: 0
      },
      bgactive: {
        type: String,
        default: "#FF8000"
      },
      bginactive: {
        type: String,
        default: "#F3F2EE"
      },
      fgactive: {
        type: String,
        default: "#F5F5F5"
      },
      fginactive: {
        type: String,
        default: "#C2C2BE"
      },
      textsize: {
        type: Number,
        default: 120
      },
  },
  data()
  {
    return {}
  }
  ,
  methods: {
    getTabStyle(ii)
    {
      let ndata = this.icon.length;
      let bg_color = this.bginactive;
      let fg_color = this.fginactive;
      if (ii === this.index)
      {
        bg_color = this.bgactive;
        fg_color = this.fgactive;
      }
      let strstyle = "width:" + 100 / ndata + "%; " +
        "color:" + fg_color + "; " +
        "background-color:" + bg_color + "; " +
        "border-color:" + bg_color + ";";
      return (strstyle)
    },
    setTabTextSize()
    {
      return("font-size: " + this.textsize + "%;")
    }
  }
  }
</script>

<style scoped>
</style>

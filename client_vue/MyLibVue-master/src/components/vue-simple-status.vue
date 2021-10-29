<template>
    <span class="main-group" v-bind:style="{background:getBgColor(value), color:getFgColor(value)} ">
        {{getText(value)}}
    </span>
</template>

<script>
  export default {
    name: "vue-simple-status",

    data() {
      return {
        defaultBgColor: "#FFFFFF",
        defaultFgColor: "#000000",
        NoData: "No Data",
        maxDataCount: 2,
      }
    },

    props: {
      value: {
        type: Number,
        required: true
      },
      text: {
        type: Array,
        default: () => ([
          "disable", "enable"
        ])
      },
      index: {
        type: Array,
        default: () => ([
          0, 1
        ])
      },
      bg_color: {
        type: Array,
        default: () => ([
          "#FF0000", "#008000",
        ])
      },
      fg_color: {
        type: Array,
        default: () => ([
          "#FFFFFF", "#FFFFFF",
        ])
      },
    },

    methods: {
      getIndex(n, idx) {
        for (let i = 0; i < n; i++) {
          if (idx === this.index[i]) {
            return (i);
          }
        }
        return (-1);
      },

      getText(idx) {
        let ii = this.getIndex((this.text).length, idx);
        return (ii < 0 ? this.NoData : this.text[ii]);
      },

      getBgColor(idx) {
        let ii = this.getIndex((this.text).length, idx);
        return (ii < 0 ? this.defaultBgColor : this.bg_color[ii]);
      },

      getFgColor(idx) {
        let ii = this.getIndex((this.text).length, idx);
        return (ii < 0 ? this.defaultFgColor : this.fg_color[ii]);
      }

    }
  }
</script>

<style scoped>
  .main-group {
    border-radius: 5px;
    padding-left: 4px;
    padding-right: 4px;
  }
</style>

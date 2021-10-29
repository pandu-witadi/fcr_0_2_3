<template>
  <button class="sidebar-minimizer" type="button" @click="onClick()" v-bind:style="appSkin.minimize"></button>
</template>
<script>
import { togglePs } from '../../mixins/togglePs'

export default {
  name: 'sidebar-minimizer',
  mixins: [ togglePs ],
  props: {
    appSkin:{
      type:Object,
      default: () => ({item:"", title:"", icon:"", minimize:""})
    }
  },

  mounted: function () {
    const isMinimized = document.body.classList.contains('sidebar-minimized')
    this.togglePs(!isMinimized)
  },
  methods: {
    onClick () {
      this.sidebarMinimize()
      this.brandMinimize()
    },
    sidebarMinimize () {
      const isMinimized = document.body.classList.toggle('sidebar-minimized')
      this.$emit('cui-sidebar-minimize', isMinimized)
      this.togglePs(!isMinimized)
    },
    brandMinimize () {
      document.body.classList.toggle('brand-minimized')
    }
  }
}
</script>

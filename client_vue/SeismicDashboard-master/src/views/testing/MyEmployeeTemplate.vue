<template>
  <span>
    <button v-on:click="handleClick($event)">data.OrderID</button>
    <button>Btn2</button>
  </span>
</template>

<script>
  export default {
    name: "MyEmployeeTemplate",
    data: () => {
      return {

      }
    },
    methods: {
      handleClick: function (args) {
        // debugger;
        // var data = JSON.stringify(this.data);
        // bus.$emit("getdata", data);
        //alert(data);
      },
    },
  }
</script>

<style scoped>

</style>

<script setup lang="ts">
  defineProps({
    money:{
      type:Number,
      required:true
    },
    car:{
      type:String,
      default:"宝马"
    }
  })
</script>

<template>
  <h1>子组件--{{money}} {{car}}</h1>
</template>

<style scoped>

</style>
<script setup lang="ts">
  import { ref } from 'vue';
  import Son from './components/Son.vue';
  const money = ref(10000)
  const car = ref("法拉利")
</script>

<template>
  <h1>父组件--{{money}} {{car}}</h1>
  <Son :money="money"></Son>
</template>
<style scoped> </style>
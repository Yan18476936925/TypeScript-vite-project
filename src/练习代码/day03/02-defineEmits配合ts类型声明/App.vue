<script setup lang="ts">
import { ref } from 'vue';
import Son from './components/Son.vue';

const money = ref(10000)
const car = ref("法拉利")
const addFn = (value:number) => {
  money.value += value
}
const changeCar = () => {
  car.value = '奔驰'
}
</script>

<template>
  <h1>父组件--{{money}} </h1>
  <Son :money="money" :car="car" @addFn="addFn" @changeCar="changeCar"></Son>
</template>

<style scoped>

</style>
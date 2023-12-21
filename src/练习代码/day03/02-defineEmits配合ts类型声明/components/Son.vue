<script setup lang="ts">
// vue-ts,也就是 泛型 写法
/* 
  TS 的写法
  1. 调用 defineProps ，把泛型参数(描述父组件的props的类型) 传递，返回数据
  2. 解构返回来的数据，并且加上默认值
      注意：要使用这个功能，要在 vite.config.js 里面开启
      vue({
          reactivityTransform: true,
      })
      开启后，换色的静态不用管，是提醒你注意版本号的
      并且开启后，需要重启服务
*/
const { money, car = '法拉利' } = defineProps<{
  money: Number;
  car?: String;
}>();
// const emit = defineEmits(['addFn','changeCar']);
// defineEmits配合ts类型声明，可以实现更细粒度的校验
const emit = defineEmits<{
  (event:'addFn',value:number):void,
  (event:'changeCar',car?:string):void
}>()
</script>

<template>
  <h1>子组件--{{ money }} {{ car }}</h1>
  <button @click="emit('addFn', 1000)">点我加钱</button>
  <button @click="emit('changeCar')">点我换车</button>
</template>

<style scoped></style>

<script setup lang="ts">
import { onMounted } from 'vue';

const move = (e: MouseEvent) => {
  // mouse.value.x = e.pageX
  // mouse.value.y = e.pageY
  console.log('e.pageX----->', e.pageX);
  console.log('e.pageY----->', e.pageY);
};
// 获取dom类型： document.querySelector('div')
// 获取事件的类型： document.addEventListener('mousemove')
onMounted(() => {
  return document.addEventListener('mousemove', move);
  // return document.addEventListener('keydown', keydown);
});
const keydown = (e: KeyboardEvent) => {
  console.log('e----->', e);
};
</script>

<template>
  <h1>Hello Jordan</h1>
  <input type="text" @keydown="keydown" />
</template>

<style scoped></style>

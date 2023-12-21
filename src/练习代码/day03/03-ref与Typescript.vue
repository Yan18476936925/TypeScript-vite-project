<script setup lang="ts">
import { ref } from 'vue';

// ✅简洁写法,建议
// const money = ref(10000)
// 完整写法
// const money = ref<number>(10000)

// ✅如果是复杂类型，建议写明类型描述
const list = ref<
  {
    id: number;
    name: string;
    done: boolean;
  }[]
>([]);
setTimeout(() => {
  list.value = [
    { id: 1, name: '吃饭', done: true },
    { id: 2, name: '睡觉', done: true },
  ];
}, 2000);
</script>

<template>
  <h1>Hello Jordan</h1>
  <ul>
    <li v-for="item in list" :key="item.id">{{ item.name }}</li>
  </ul>
</template>

<style scoped></style>

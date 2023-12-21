<script setup lang="ts">
import { onMounted, ref } from 'vue';

/* 
  获取dom元素
  1. 定义空变量
  2. 模板中通过 ref与变量关联
  3. 页面渲染完成，就会把dom存放到变量中
  添加ts
  通过泛型，告诉h1Ref的的类型为 null | HTMLHeadingElement
*/
// document.querySelector('h1');
const h1Ref = ref<null | HTMLHeadingElement>(null);
onMounted(() => {
  console.log('h1Ref.value----->', h1Ref.value);
  if (h1Ref.value) {
    h1Ref.value.innerHTML = '法拉利';
  }
});
</script>

<template>
  <h1 ref="h1Ref">Hello Jordan</h1>
</template>

<style scoped></style>

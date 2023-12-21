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
  console.log('h1Ref.value.innerHTML----->', h1Ref.value?.innerHTML);
  // js原生，可选链操作符保证读取对象深层属性时不会报错，有值则返回，没值就返回 undefined
  // 💥💥注意：只能读取，不能赋值
  // 应用场景：后台返回数据，页面中做渲染可以使用
  // h1Ref.value?.innerHTML = '喜洋洋'
  // if (h1Ref.value) {
  //   h1Ref.value.innerHTML = '法拉利';
  // }
  // 可以通过非空断言，告诉ts，这里不会是null，听我的就可以了
    h1Ref.value!.innerHTML = '法拉利';
});
</script>

<template>
  <h1 ref="h1Ref">Hello Jordan</h1>
  <div>{{h1Ref?.innerHTML}}</div>
</template>

<style scoped></style>

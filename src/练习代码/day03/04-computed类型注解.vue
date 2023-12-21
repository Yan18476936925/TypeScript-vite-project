<script setup lang="ts">
import { computed, ref } from 'vue';

const money = ref(10000);
const double = computed<number>(() => {
  return money.value * 2;
});
const trible = computed({
  get() {
    return money.value * 3
  },
  set() {
    return money.value * 3
  }
});
console.log('trible----->',trible);
</script>

<template>双倍快乐：{{ double }} 三倍快乐：{{ trible }}</template>

<style scoped></style>

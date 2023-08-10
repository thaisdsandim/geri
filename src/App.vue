<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
* {
  font-family: 'Lato', sans-serif;
  --el-color-primary:#6a2bc3;
  --el-color-primary-light-3:#7439c6;
  --el-color-primary-light-5:#59328f;
  --el-color-primary-light-7:#4e3472;
  --el-color-primary-light-8:#3d2a58;
  --el-color-primary-light-9:#342944;
  --el-color-primary-dark-2:#9e5ef8;
}
.mb-10 {
  margin-bottom: 10px;
}
</style>

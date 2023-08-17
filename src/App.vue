<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style>
* {
  font-family: 'Lato', sans-serif !important;
  --el-color-primary:#6a2bc3 !important;
  --el-color-primary-light-3:#7439c6 !important;
  --el-color-primary-light-5:#59328f !important;
  --el-color-primary-light-7:#4e3472 !important;
  --el-color-primary-light-8:#3d2a58 !important;
  --el-color-primary-light-9:#342944 !important;
  --el-color-primary-dark-2:#9e5ef8 !important;
  margin: 0;
  padding: 0;
}
.mb-10 {
  margin-bottom: 10px;
}
</style>

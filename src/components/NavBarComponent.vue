<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu"
      mode="horizontal"
      :ellipsis="false"
    >
      <el-menu-item @click="redirectTo('dashboard')">
        <div class="logo-container">
          <img src="../assets/geri.png" alt="Logo" class="logo">
        </div>
      </el-menu-item>
      <div class="flex-grow" />
      <el-sub-menu index="1">
        <template #title>Menu</template>
        <el-menu-item @click="redirectTo('dashboard')">Página Inicial</el-menu-item>
        <el-menu-item @click="redirectTo('pedidos')">Pedidos</el-menu-item>
        <el-menu-item @click="redirectTo('clientes')">Clientes</el-menu-item>
        <el-menu-item @click="redirectTo('catalogo')">Catálogo</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus';

const router = useRouter();

const redirectTo = (routeName) => {
  router.push({ name: routeName });
};
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
.logo-container {
  max-height: 10vh;
}
.logo {
  max-height: 10vh;
}
</style>
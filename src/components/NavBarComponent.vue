<template>
  <div class="dashboard">
    <el-menu
      :default-active="activeIndex"
      class="el-menu"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <el-menu-item index="1-1">
        <div class="logo-container">
          <img src="../assets/geri.png" alt="Logo" class="logo">
        </div>
      </el-menu-item>
      <div class="flex-grow" />
      <el-sub-menu index="1">
        <template #title>Menu</template>
        <el-menu-item index="1-1">Página Inicial</el-menu-item>
        <el-menu-item index="1-2">Pedidos</el-menu-item>
        <el-menu-item index="1-3">Clientes</el-menu-item>
        <el-menu-item index="1-4">Catálogo</el-menu-item>
      </el-sub-menu>
    </el-menu>
    <div>
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus';
import DashboardComponent from './Dashboard/DashboardComponent.vue';
import OrdersComponent from './Sales/OrdersComponent.vue';
import ClientsComponent from './Sales/ClientsComponent.vue';
import CatalogComponent from './Sales/CatalogComponent.vue';

const activeIndex = ref('1-1');
const currentComponent = ref(DashboardComponent);

const handleSelect = (index) => {
  activeIndex.value = index;
};

const componentMap = {
  '1-1': DashboardComponent,
  '1-2': OrdersComponent,
  '1-3': ClientsComponent,
  '1-4': CatalogComponent
};

watch(activeIndex, (newValue) => {
  currentComponent.value = componentMap[newValue];
});
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
.dashboard {
  margin-left: 10px;
  margin-right: 10px;
}
.logo-container {
  max-height: 10vh;
}
.logo {
  max-height: 10vh;
}
</style>
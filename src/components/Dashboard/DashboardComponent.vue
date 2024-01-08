<template>
  <div class="dashboard">
    <PanelOrders />
    <OrdersList />
  </div>
</template>

<script setup>
import OrdersList from './Orders/OrdersList.vue';
import PanelOrders from './Panel/PanelOrders.vue';
</script>

<style>
.dashboard {
  margin: 10px;
}
</style>

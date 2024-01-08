<template>
  <div class="catalog">
    <CatalogTable />
    <NewCatalogItem />
  </div>
</template>

<script setup>
import CatalogTable from './Catalog/CatalogTable.vue';
import NewCatalogItem from './Catalog/NewCatalogItem.vue';
</script>

<style>
.catalog {
  margin: 10px;
}
</style>
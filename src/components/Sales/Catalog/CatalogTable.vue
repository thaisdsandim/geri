<template>
  <el-table :data="formattedTableData" border style="width: 100%" class="catalog-table">
    <el-table-column prop="category" label="Categoria" sortable />
    <el-table-column prop="flavour" label="Tipo" sortable />
    <el-table-column prop="value" label="Valor" sortable :formatter="formatCurrency" />
    <el-table-column fixed="right" label="Ações">
      <template #header>
        <el-input v-model="search" size="small" placeholder="Digite para pesquisar um produto..." />
      </template>
      <template #default>
        <EditCatalog />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { ElTable, ElTableColumn, ElInput, ElMessage } from 'element-plus';
import axios from 'axios';
import { useAuthStore } from '../../../stores/store';
import URL from '../../../config/apiConfig';
import EditCatalog from './EditCatalog.vue';

const authStore = useAuthStore();
const token = authStore.user.authentication_token;
const unitId = authStore.user.unit_id;

const headers = {
  Authorization: `Bearer ${token}`
};

const url = `${URL}/units/${unitId}/products`;

const tableData = ref([]);
const formattedTableData = ref([]);
const search = ref('');

const formatCurrency = (row, column, cellValue) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  return formatter.format(cellValue);
};

const handleSearch = () => {
  formattedTableData.value = tableData.value.filter(
    (data) =>
      !search.value ||
      data.category.toLowerCase().includes(search.value.toLowerCase()) ||
      data.flavour.toLowerCase().includes(search.value.toLowerCase()) ||
      data.value.toString().includes(search.value)
  );
};

onMounted(() => {
  axios.get(url, { headers })
    .then(response => {
      if (response.data) {
        tableData.value = response.data;
        formattedTableData.value = response.data;
      } else {
        ElMessage({
          showClose: true,
          message: 'Não foi possível carregar os produtos!',
          type: 'error',
        });
      }
    })
    .catch(error => {
      ElMessage({
        showClose: true,
        message: 'Não foi possível carregar os produtos!',
        type: 'error',
      });
    });
});

watch(() => search.value, handleSearch);
</script>

<style>
.catalog-table {
  margin: 20px 0px;
}
</style>
<template>
  <div class="mt-20 clients">
    <div class="filters">
      <el-input v-model="customerFilter" placeholder="Digite o nome do cliente para filtrar..." @input="filterClientsByName" class="name-filter"></el-input>
    </div>
    <div class="card-container mt-10">
      <el-card v-for="client in clients" :key="client.id" class="client-card" shadow="never">
        <div class="client-header">
          <b>{{ client.name.toUpperCase() }}</b>
          <p class="mt-10">{{ client.phone }}</p>
        </div>
        <div class="client-footer">
          <EditClient :client=" {...client} " />
          <NewOrderByClient :client=" {...client} "/>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ElCard, ElMessage, ElInput } from 'element-plus';
import axios from 'axios';
import EditClient from './EditClient.vue';
import URL from '../../../config/apiConfig';
import { useAuthStore } from '../../../stores/store';
import NewOrderByClient from './NewOrderByClient.vue';

const authStore = useAuthStore();
const token = authStore.user.authentication_token;
const unitId = authStore.user.unit_id;

const headers = {
  Authorization: `Bearer ${token}`
};

const url = `${URL}/units/${unitId}/costumers`;

const clients = ref([]);
const customerFilter = ref('');

const filterClientsByName = () => {
  loadClients();
};

const filterClients = (costumers) => {
  const filteredClients = costumers
    .filter(costumer => costumer.name.toLowerCase().includes(customerFilter.value.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  clients.value = filteredClients;
};

const loadClients = () => {
  axios.get(url, { headers })
    .then(response => {
      if (response.data) {
        filterClients(response.data);
      } else {
        ElMessage({
          showClose: true,
          message: 'Não foi possível carregar os clientes!',
          type: 'error',
        });
      }
    })
    .catch(error => {
      ElMessage({
        showClose: true,
        message: 'Não foi possível carregar os clientes!',
        type: 'error',
      });
    });
};

onMounted(() => {
  loadClients();
});
</script>

<style>
.clients {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.filters {
  display: flex;
  align-items: center;
}
.name-filter {
  margin-left: 15px;
}
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.client-card {
  width: 23vw;
  margin: 10px;
  border-style: none;
  box-sizing: border-box;
  align-items: center;
}
.client-header {
  flex-wrap: wrap;
}
.client-footer {
  display: flex;
  flex-wrap: wrap;
}
.mt-10 {
  margin-top: 10px;
}
.comments {
  font-size: 14px;
  color: gray;
  font-style: italic;
}
@media (max-width: 667px) {
  .client-card {
    width: 100%;
  }
}
</style>

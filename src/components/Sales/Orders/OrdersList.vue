<template>
  <div class="mt-20 orders">
    <div class="filters">
      <el-date-picker v-model="selectedDate" type="date" placeholder="Selecione a data para filtrar..." @change="loadOrders" format="DD/MM/YYYY"></el-date-picker>
      <el-input v-model="customerFilter" placeholder="Digite o nome do cliente para filtrar..." @input="filterOrdersByCustomer" class="name-filter"></el-input>
    </div>
    <div class="card-container mt-10">
      <el-card v-for="order in dailySales" :key="order.id" class="order-card" shadow="never">
        <template #header>
          <div class="order-header">
            <p>PEDIDO N.º {{ order.id }}</p>
            <p class="name-filter">{{ order.costumer.name.toUpperCase() }}</p>
          </div>
          <div class="order-header">
            <p class="mt-20"><b>{{ formatDate(order.delivery_date) }}</b></p>
            <p class="mt-20"><b>{{ formatCurrency(order.amount) }}</b></p>
          </div>
        </template>
        <div>
          <ul>
            <li v-for="(item, index) in order.items" :key="index" class="itens">
              <p>
                {{ item.quantity }} 
                {{ item.category === 'Bolo' ? 'kg' : 'un.' }}
                de {{ item.category }} {{ item.category === 'Outros' ? '' : 'sabor' }} {{ item.flavour }}
              </p>
              <p class="comments">{{ item.comments }}</p>
            </li>
          </ul>
        </div>
        <div class="order-footer">
          <p><b>Hora de Entrega: </b>{{ formatDeliveryTime(order.delivery_hour) }}</p>
          <p v-if="order.delivery_place" class="mt-10"><b>Local de Entrega: </b>{{ order.delivery_place }}</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ElCard, ElMessage, ElDatePicker, ElInput } from 'element-plus';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import URL from '../../../config/apiConfig';
import { useAuthStore } from '../../../stores/store';

const authStore = useAuthStore();
const token = authStore.user.authentication_token;
const unitId = authStore.user.unit_id;

const headers = {
  Authorization: `Bearer ${token}`
};

const url = `${URL}/units/${unitId}/orders/list_orders`;

const dailySales = ref([]);
const dateISO = new Date();
dateISO.setUTCHours(dateISO.getUTCHours() - 4);
const selectedDate = ref(null);
const customerFilter = ref('');

const formatDeliveryTime = (deliveryHour) => {
  const date = new Date(deliveryHour);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const formatDate = (dateString) => {
  const date = parseISO(dateString);
  const formattedDate = format(date, 'dd/MM/yyyy', { awareOfUnicodeTokens: true });
  return formattedDate;
};

const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const filterOrdersByCustomer = () => {
  loadOrders();
};

const filterDailySales = (orders) => {
  const selectedDateISO = selectedDate.value ? new Date(selectedDate.value).toISOString().split('T')[0] : null;

  const filteredOrders = orders.filter(order => {
    const orderDateISO = new Date(order.delivery_date).toISOString().split('T')[0];
    const dateCondition = selectedDateISO ? orderDateISO === selectedDateISO : true;

    const customerCondition = order.costumer.name.toLowerCase().includes(customerFilter.value.toLowerCase());

    return dateCondition && customerCondition;
  });

  dailySales.value = filteredOrders;
};

const loadOrders = () => {
  axios.get(url, { headers })
    .then(response => {
      if (response.data) {
        response.data.sort((a, b) => new Date(b.delivery_date) - new Date(a.delivery_date));
        filterDailySales(response.data);
      } else {
        ElMessage({
          showClose: true,
          message: response,
          type: 'error',
        });
      }
    })
    .catch(error => {
      ElMessage({
        showClose: true,
        message: error,
        type: 'error',
      });
    });
};

onMounted(() => {
  loadOrders();
});
</script>

<style>
.orders {
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
.order-card {
  width: 31vw;
  margin: 10px 0 10px 0;
  border-style: none;
  box-sizing: border-box;
  align-items: center;
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}
.order-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.itens {
  margin: 0px 0 20px 0;
  list-style: none;
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
  .order-card {
    width: 100%;
  }
}
</style>

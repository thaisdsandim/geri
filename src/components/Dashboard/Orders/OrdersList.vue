<template>
  <div class="card-container">
    <el-card v-for="order in dailySales" :key="order.id" class="order-card">
      <div class="order-header">
        <span>PEDIDO N.º {{ order.id }} - {{ order.costumer.name.toUpperCase() }}</span>
      </div>
      <div>
        <ul>
          <li v-for="(item, index) in order.items" :key="index" class="itens">
            <p>
              {{ item.quantity }} 
              {{ item.category === 'Bolo' ? 'kg' : item.category === 'Docinhos' ? 'un.' : '' }}
              de {{ item.category }} de {{ item.flavour }}
            </p>
            <p>{{ item.comments }}</p>
          </li>
        </ul>
      </div>
      <p><b>Hora de Entrega: </b>{{ formatDeliveryTime(order.delivery_hour) }}</p>
      <p><b>Local de Entrega: </b>{{ order.delivery_place }}</p>
       <p class="mt-10"><b>{{ formatCurrency(order.amount) }}</b></p>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ElCard, ElMessage } from 'element-plus';
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

const dailySales = ref(0);

const formatDeliveryTime = (deliveryHour) => {
  const date = new Date(deliveryHour);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const filterDailySales = (orders) => {
  const today = new Date();
  today.setUTCHours(today.getUTCHours() - 4);
  const todayISOString = today.toISOString().split('T')[0];
  
  const dailySalesSum = orders
    .filter(order => order.delivery_date === todayISOString)
  dailySales.value = dailySalesSum;
};

onMounted(() => {
  axios.get(url, { headers })
    .then(response => {
      if (response.data) {
        filterDailySales(response.data);
        console.log(dailySales)
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
});
</script>

<style>
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.order-card {
  min-width: 32%;
  margin: 10px 0 10px 0;
  border-style: none;
  box-sizing: border-box;
  align-items: center;
}
.order-header {
  font-size: 16px;
  font-weight: bold;
}
.itens {
  margin: 10px 0 10px 0;
  list-style: none;
}
.mt-10 {
  margin-top: 10px;
}
@media (max-width: 667px) {
  .order-card {
    width: 100%;
  }
}
</style>

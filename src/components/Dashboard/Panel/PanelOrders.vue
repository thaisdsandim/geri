<template>
  <el-row :gutter="16">
    <el-col :span="8" class="el-col-xs-24">
      <div class="statistic-card">
        <el-statistic :value="dailySales" :precision="2" :formatter="formatCurrency">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              Valor de vendas no dia {{ currentDate }}
            </div>
          </template>
        </el-statistic>
      </div>
    </el-col>
    <el-col :span="8" class="el-col-xs-24">
      <div class="statistic-card">
        <el-statistic :value="monthlySales" :precision="2" :formatter="formatCurrency">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              Valor de vendas no mês de {{ currentMonthAndYear }}
            </div>
          </template>
        </el-statistic>
      </div>
    </el-col>
    <el-col :span="8" class="el-col-xs-24">
      <div class="statistic-card">
        <el-statistic :value="monthlyOrderCount">
          <template #title>
            <div style="display: inline-flex; align-items: center">
              Quantidade de pedidos no mês de {{ currentMonthAndYear }}
            </div>
          </template>
        </el-statistic>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/store';
import {
  ElRow,
  ElCol,
  ElStatistic,
  ElMessage
} from 'element-plus';
import axios from 'axios';
import URL from '../../../config/apiConfig';

const authStore = useAuthStore();
const token = authStore.user.authentication_token;
const unitId = authStore.user.unit_id;
const currentDate = ref("");
const currentMonthAndYear = ref("");

const headers = {
  Authorization: `Bearer ${token}`
};

const url = `${URL}/units/${unitId}/orders`;

const dailySales = ref(0);
const monthlySales = ref(0);
const monthlyOrderCount = ref(0);

const calculateDailySales = (orders) => {
  const today = new Date();
  today.setUTCHours(today.getUTCHours() - 4);
  const todayISOString = today.toISOString().split('T')[0];
  
  const dailySalesSum = orders
    .filter(order => order.delivery_date === todayISOString)
    .reduce((sum, order) => sum + order.amount, 0);
  dailySales.value = dailySalesSum;
};

const calculateMonthlySales = (orders) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const monthlySalesSum = orders
    .filter(order => {
      const orderDate = new Date(order.delivery_date);
      return orderDate.getMonth() + 1 === currentMonth && orderDate.getFullYear() === currentYear;
    })
    .reduce((sum, order) => sum + order.amount, 0);
  monthlySales.value = monthlySalesSum;
};

const calculateMonthlyOrderCount = (orders) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const monthlyOrderCountValue = orders
    .filter(order => {
      const orderDate = new Date(order.delivery_date);
      return orderDate.getMonth() + 1 === currentMonth && orderDate.getFullYear() === currentYear;
    })
    .length;
  monthlyOrderCount.value = monthlyOrderCountValue;
};

const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

onMounted(() => {
  axios.get(url, { headers })
    .then(response => {
      if (response.data) {
        calculateDailySales(response.data);
        calculateMonthlySales(response.data);
        calculateMonthlyOrderCount(response.data);
        const today = new Date();
        currentDate.value = today.toLocaleDateString('pt-BR');
        currentMonthAndYear.value = `${today.toLocaleString('pt-BR', { month: 'long' })}/${today.getFullYear()}`;
        currentMonthAndYear.value = currentMonthAndYear.value.charAt(0).toUpperCase() + currentMonthAndYear.value.slice(1);
      } else {
        ElMessage({
          showClose: true,
          message: 'Não foi possível carregar os dados!',
          type: 'error',
        });
      }
    })
    .catch(error => {
      ElMessage({
        showClose: true,
        message: 'Não foi possível carregar os dados!',
        type: 'error',
      });
    });
});
</script>

<style>
.el-statistic {
  --el-statistic-content-font-size: 28px;
}
.statistic-card {
  height: 60%;
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}
.el-col-xs-24 {
  width: 100%;
  margin-top: 10px;
}
</style>

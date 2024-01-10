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
import { ref, watch } from 'vue';
import { useAuthStore } from '../../../stores/store';
import {
  ElRow,
  ElCol,
  ElStatistic,
  ElMessage
} from 'element-plus';
import { format, parseISO } from 'date-fns';
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

const props = defineProps(['date']);
const selectedDate = ref(props.date);

const calculateMonthlySales = (orders) => {
  const today = new Date();
  const currentMonth = today.getUTCMonth();
  const currentYear = today.getUTCFullYear();

  const monthlySalesSum = orders
    .filter(order => {
      const orderDate = new Date(order.delivery_date);
      return orderDate.getUTCMonth() === currentMonth && orderDate.getUTCFullYear() === currentYear;
    })
    .reduce((sum, order) => sum + order.amount, 0);
  monthlySales.value = monthlySalesSum;
};

const calculateMonthlyOrderCount = (orders) => {
  const today = new Date();
  const currentMonth = today.getUTCMonth();
  const currentYear = today.getUTCFullYear();

  const monthlyOrderCountValue = orders
    .filter(order => {
      const orderDate = new Date(order.delivery_date);
      return orderDate.getUTCMonth() === currentMonth && orderDate.getUTCFullYear() === currentYear;
    })
    .length;
  monthlyOrderCount.value = monthlyOrderCountValue;
};

const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const calculateSales = async () => {
  try {
    const response = await axios.get(url, { headers });
    if (response.data) {
      const dailySalesSum = response.data
        .filter(order => order.delivery_date === selectedDate.value)
        .reduce((sum, order) => sum + order.amount, 0);
      dailySales.value = dailySalesSum;

      calculateMonthlySales(response.data);
      calculateMonthlyOrderCount(response.data);
      const today = new Date();
      currentMonthAndYear.value = `${today.toLocaleString('pt-BR', { month: 'long' })}/${today.getFullYear()}`;
      currentMonthAndYear.value = currentMonthAndYear.value.charAt(0).toUpperCase() + currentMonthAndYear.value.slice(1);
    } else {
      ElMessage({
        showClose: true,
        message: 'Não foi possível carregar os dados!',
        type: 'error',
      });
    }
  } catch (error) {
    ElMessage({
      showClose: true,
      message: 'Não foi possível carregar os dados!',
      type: 'error',
    });
  }
};

watch(() => {
  const inputDate = props.date;

  const isAlreadyFormatted = /^\d{4}-\d{2}-\d{2}$/.test(inputDate);

  if (!isAlreadyFormatted) {
    const dateObject = new Date(inputDate);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const formattedCurrentDate = `${day}/${month}/${year}`
  
    currentDate.value = formattedCurrentDate;
    selectedDate.value = formattedDate;
    
    calculateSales();
  } else {
    const formatDate = (dateString) => {
      const date = parseISO(dateString);
      const formattedDate = format(date, 'dd/MM/yyyy', { awareOfUnicodeTokens: true });
      return formattedDate;
    };

    const formattedDate = formatDate(inputDate);

    currentDate.value = formattedDate;
    selectedDate.value = inputDate;
    
    calculateSales();
  }
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

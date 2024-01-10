<template>
  <div>
    <el-tooltip
      effect="light"
      content="Adicionar novo pedido"
      placement="bottom-end"
    >
      <el-button :icon="Plus" type="primary" @click="toggleDialog" class="mt-20 new-button" circle></el-button>
    </el-tooltip>

    <el-dialog v-model="dialogVisible" title="Adicionar Pedido" center>
      <el-form :model="form" label-width="auto" class="mt-20">
        <el-form-item label="Cliente*">
          <el-select v-model="form.selectedClient.id" filterable placeholder="Selecione um cliente...">
            <el-option
              :key="selectedClient.id"
              :label="selectedClient.name"
              :value="selectedClient.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Data de Entrega*">
          <el-date-picker v-model="form.date" type="date" placeholder="Selecione a data de entrega..." format="DD/MM/YYYY"></el-date-picker>
        </el-form-item>
        <el-form-item label="Hora de Entrega*">
          <el-time-picker v-model="form.hour" placeholder="Selecione a hora de entrega..." format="HH:mm"></el-time-picker>
        </el-form-item>
        <el-form-item label="Endereço de Entrega">
          <el-input v-model="form.address" :rows="2" type="textarea" placeholder="Digite o endereço de entrega..." />
        </el-form-item>
        <AddOrderItem @submit="handleItemSubmit"/>
        <el-card class="box-card" shadow="never">
          <div>
            <ul>
              <li class="itens" v-for="(item, index) in orderItems" :key="index">
                <p>
                  {{ item.quantity }} 
                  {{ item.category === 'Bolo' ? 'kg' : 'un.' }}
                  de {{ item.category }} {{ item.category === 'Outros' ? '' : 'sabor' }} {{ item.flavour }}
                </p>
                <p class="comments">{{ item.comments }}</p>
              </li>
            </ul>
          </div>
        </el-card>
        <el-form-item>
          <b class="subtotal">Valor Total do Pedido: {{ formatCurrency(form.amount) }}</b>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Fechar</el-button>
        <el-button type="primary" @click="onSubmit">Salvar</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { ElMessage,
         ElSelect,
         ElOption,
         ElButton,
         ElDialog,
         ElForm,
         ElFormItem,
         ElInput,
         ElDatePicker,
         ElTimePicker,
         ElCard,
         ElLoading,
         ElTooltip
} from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { format } from 'date-fns';
import axios from 'axios';
import URL from '../../../config/apiConfig';
import { useAuthStore } from '../../../stores/store';
import AddOrderItem from '../Orders/AddOrderItem.vue';

const authStore = useAuthStore();
const token = authStore.user.authentication_token;
const unitId = authStore.user.unit_id;

const headers = {
  Authorization: `Bearer ${token}`
};

const dialogVisible = ref(false);
const orderItems = ref([]);
const props = defineProps(['client']);
const selectedClient = ref({ ...props.client });
selectedClient.value = props.client;

const form = reactive({
  client: '',
  date: '',
  hour: '',
  address: '',
  itens: orderItems,
  amount: 0,
  selectedClient: selectedClient.value
});

const resetForm = () => {
  form.client = '';
  form.date = '';
  form.hour = '';
  form.address = '';
  form.itens = [];
  form.amount = 0;
};

const toggleDialog = () => {
  dialogVisible.value = !dialogVisible.value;
};

const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const handleItemSubmit = (item) => {
  orderItems.value.push({ ...item });
  form.amount = orderItems.value.reduce((total, item) => {
    return total + (item.totalValue || 0);
  }, 0);
};

const onSubmit = async () => {
  try {
    if (!form.client) {
      ElMessage({
        showClose: true,
        message: 'Por favor, preencha o cliente!',
        type: 'warning',
      });
      return;
    };

    if (!form.date) {
      ElMessage({
        showClose: true,
        message: 'Por favor, preencha a data de entrega!',
        type: 'warning',
      });
      return;
    };

    if (!form.hour) {
      ElMessage({
        showClose: true,
        message: 'Por favor, preencha a hora de entrega!',
        type: 'warning',
      });
      return;
    };

    if (orderItems.value.length === 0) {
      ElMessage({
        showClose: true,
        message: 'Por favor, adicione pelo menos um item no pedido!',
        type: 'warning',
      });
      return;
    };

    const loading = ElLoading.service({
      lock: true,
      text: 'Salvando pedido...',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    const formattedDate = format(new Date(form.date), 'yyyy-MM-dd');
    const formattedTime = format(form.hour, 'HH:mm');
    const delivery_hour = `2000-01-01T${formattedTime}:00.000Z`;

    const orderData = {
      delivery_date: formattedDate,
      delivery_hour: delivery_hour,
      delivery_place: form.address,
      amount: form.amount,
      costumer_id: form.client,
      unit_id: unitId,
    };

    const orderResponse = await axios.post(`${URL}/units/${unitId}/orders`, orderData, { headers });
    const orderId = orderResponse.data.id;

    await Promise.all(orderItems.value.map(async (item) => {
      const itemData = {
        category: item.category,
        flavour: item.flavour,
        comments: item.comments,
        quantity: item.quantity,
        amount: item.totalValue,
        order_id: orderId,
      };

      await axios.post(`${URL}/units/${unitId}/orders/${orderId}/items`, itemData, { headers });
    }));
    window.location.reload();
    dialogVisible.value = false;
    loading.close();
    ElMessage({
      showClose: true,
      message: 'Pedido salvo com sucesso!',
      type: 'success',
    });
  } catch (error) {
    ElMessage({
      showClose: true,
      message: 'Erro ao salvar pedido!',
      type: 'error',
    });
  }
};

watch(() => dialogVisible.value, (newVisibility) => {
  if (newVisibility) {
    resetForm();
  }
});
</script>

<style scoped>
.floating-button {
  font-size: 60px;
  width: 60px;
  height: 60px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding-bottom: 15px;
}
.box-card {
  border-style: none;
  margin: 15px 0px 10px 0px;
}
.subtotal {
  font-size: 16px;
}

.itens {
  list-style: none;
}

.comments {
  font-size: 14px;
  color: gray;
  font-style: italic;
}

.new-button {
  margin-right: 10px;
}
</style>

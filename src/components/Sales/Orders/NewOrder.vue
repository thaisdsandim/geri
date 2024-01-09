<template>
  <div>
    <el-button
      type="primary"
      circle
      @click="toggleDialog"
      class="floating-button"
    >+</el-button>

    <el-dialog v-model="dialogVisible" title="Adicionar Pedido" center>
      <el-form :model="form" label-width="auto" class="mt-20">
        <el-form-item label="Cliente">
          <el-select v-model="form.client" filterable placeholder="Selecione um cliente...">
            <el-option
              v-for="client in options"
              :key="client.value"
              :label="client.label"
              :value="client.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Data de Entrega">
          <el-date-picker v-model="form.date" type="date" placeholder="Selecione a data de entrega..." format="DD/MM/YYYY"></el-date-picker>
        </el-form-item>
        <el-form-item label="Hora de Entrega">
          <el-time-picker v-model="form.hour" placeholder="Selecione a hora de entrega..." format="HH:mm"></el-time-picker>
        </el-form-item>
        <el-form-item label="Endereço de Entrega">
          <el-input v-model="form.address" :rows="2" type="textarea" placeholder="Digite o endereço de entrega..." />
        </el-form-item>
        <AddOrderItem />
        <el-card class="box-card" shadow="never">
          <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
        </el-card>
        <el-form-item>
          Valor Total do Pedido:
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Fechar</el-button>
        <el-button type="primary" @click="onSubmit">Enviar</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { ElMessage,
         ElSelect,
         ElOption,
         ElButton,
         ElDialog,
         ElForm,
         ElFormItem,
         ElInput,
         ElDatePicker,
         ElTimePicker
} from 'element-plus';
import { format } from 'date-fns';
import axios from 'axios';
import URL from '../../../config/apiConfig';
import { useAuthStore } from '../../../stores/store';
import AddOrderItem from './AddOrderItem.vue';

const authStore = useAuthStore();
const token = authStore.user.authentication_token;
const unitId = authStore.user.unit_id;

const headers = {
  Authorization: `Bearer ${token}`
};

const url = `${URL}/units/${unitId}/costumers`;

const dialogVisible = ref(false);
let options = [];
const form = reactive({
  client: '',
  date: '',
  hour: '',
  address: '',
});

const toggleDialog = () => {
  dialogVisible.value = !dialogVisible.value;
};

const onSubmit = () => {
  const formattedDate = format(new Date(form.date), 'yyyy-MM-dd');
  const formattedTime = format(form.hour, 'HH:mm');
  const dateTimeString = `2000-01-01T${formattedTime}:00.000Z`;

  console.log('Formatted Date:', formattedDate);
  console.log('Formatted Time:', dateTimeString);

  console.log('Form Data:', form);
  dialogVisible.value = false;
};



onMounted(() => {
  axios.get(url, { headers })
    .then(response => {
      if (response.data) {
        options = response.data.map(client => ({
          value: client.id,
          label: client.name,
        }));
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
</style>

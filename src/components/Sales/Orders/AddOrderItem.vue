<template>
  <div>
    <el-button
      type="primary"
      @click="toggleDialog"
    >Adicionar Item</el-button>

    <el-dialog v-model="dialogVisible" title="Adicionar Item no Pedido" center>
      <el-form :model="form" label-width="auto" class="mt-20">
        <el-form-item label="Categoria*">
          <el-select v-model="form.category" filterable placeholder="Selecione uma categoria..." @change="updateFlavourOptions">
            <el-option
              v-for="category in categoryOptions"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Tipo*">
          <el-select v-model="form.flavour" filterable placeholder="Selecione um tipo...">
            <el-option
              v-for="flavour in filteredFlavourOptions"
              :key="flavour.value"
              :label="flavour.label"
              :value="flavour.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Quantidade*">
          <el-input-number
            v-model="form.quantity"
            :precision="getPrecision(form.category)"
            :step="getStep(form.category)"
            @change="calculateTotalValue"
          />
        </el-form-item>
        <el-form-item label="Observações">
          <el-input v-model="form.comments" :rows="2" type="textarea" placeholder="Digite suas observações sobre o item..." />
        </el-form-item>
        <el-form-item>
          <b>Valor Total do Item: {{ formatCurrency(form.totalValue) }}</b>
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
import { onMounted, ref, reactive, watch } from 'vue';
import { ElMessage, ElSelect, ElOption, ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElInputNumber, ElLoading } from 'element-plus';
import axios from 'axios';
import URL from '../../../config/apiConfig';
import { useAuthStore } from '../../../stores/store';

const authStore = useAuthStore();
const token = authStore.user.authentication_token;
const unitId = authStore.user.unit_id;

const headers = {
  Authorization: `Bearer ${token}`
};

const url = `${URL}/units/${unitId}/products`;

const dialogVisible = ref(false);
const categoryOptions = ref([]);
const flavourOptions = ref([]);
const filteredFlavourOptions = ref([]);
const products = ref([]);
const emit = defineEmits(['submit']);

const form = reactive({
  category: '',
  flavour: '',
  quantity: 0,
  comments: '',
  totalValue: 0,
});

const resetForm = () => {
  form.category = '';
  form.flavour = '';
  form.quantity = 0;
  form.comments = '';
  form.totalValue = 0;
};

const toggleDialog = () => {
  dialogVisible.value = !dialogVisible.value;
};

const onSubmit = () => {
  if (!form.category) {
    ElMessage({
      showClose: true,
      message: 'Por favor, preencha a categoria!',
      type: 'warning',
    });
    return;
  };

  if (!form.flavour) {
    ElMessage({
      showClose: true,
      message: 'Por favor, preencha o tipo!',
      type: 'warning',
    });
    return;
  };

  if (!form.quantity) {
    ElMessage({
      showClose: true,
      message: 'Por favor, preencha a quantidade!',
      type: 'warning',
    });
    return;
  };

  const loading = ElLoading.service({
    lock: true,
    text: 'Salvando item...',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  const formDataCopy = { ...form };

  dialogVisible.value = false;
  emit('submit', formDataCopy);
  loading.close();
  ElMessage({
    showClose: true,
    message: 'Item adicionado com sucesso!',
    type: 'success',
  });
};

const updateFlavourOptions = () => {
  if (form.category) {
    form.flavour = '';
    form.quantity = 0;
    form.comments = '';
    form.totalValue = 0;
  }

  filteredFlavourOptions.value = flavourOptions.value.filter(flavour => flavour.category === form.category);
};

const calculateTotalValue = () => {
  const selectedProduct = products.value.find(product => product.flavour === form.flavour);

  if (form.category === 'Docinhos') {
    const centQuantity = form.quantity / 100;
    const totalValue = selectedProduct ? centQuantity * selectedProduct.value : 0;
    form.totalValue = totalValue;
  } else {
    const totalValue = selectedProduct ? form.quantity * selectedProduct.value : 0;
    form.totalValue = totalValue;
  }
};

const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const getPrecision = (category) => {
  return category === 'Bolo' ? 3 : 0;
};

const getStep = (category) => {
  return category === 'Bolo' ? 0.1 : 1;
};

onMounted(() => {
  axios.get(url, { headers })
    .then(response => {
      if (response.data) {
        products.value = response.data;
        const uniqueCategories = [...new Set(products.value.map(product => product.category))];
        categoryOptions.value = uniqueCategories.map(category => ({ label: category, value: category }));
        flavourOptions.value = products.value.map(product => ({ label: product.flavour, value: product.flavour, category: product.category }));
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

watch(() => form.category, () => {
  updateFlavourOptions();
});

watch(() => dialogVisible.value, (newVisibility) => {
  if (newVisibility) {
    resetForm();
  }
})
</script>

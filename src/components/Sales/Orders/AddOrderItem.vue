<template>
  <div>
    <el-button
      type="primary"
      @click="toggleDialog"
    >Adicionar Item</el-button>

    <el-dialog v-model="dialogVisible" title="Adicionar Item no Pedido">
      <el-form :model="form">
        <el-form-item label="Categoria">
          <el-select v-model="form.category" filterable placeholder="Selecione uma categoria..." @change="updateFlavourOptions">
            <el-option
              v-for="category in categoryOptions"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Tipo">
          <el-select v-model="form.flavour" filterable placeholder="Selecione um tipo...">
            <el-option
              v-for="flavour in filteredFlavourOptions"
              :key="flavour.value"
              :label="flavour.label"
              :value="flavour.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Quantidade">
          <el-input-number v-model="form.quantity" :precision="3" :step="0.1" />
        </el-form-item>
        <el-form-item label="Observações">
          <el-input v-model="form.comments" :rows="2" type="textarea" placeholder="Digite suas observações sobre o item..." />
        </el-form-item>
        <el-form-item>
          Valor Total do Item: 
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Enviar</el-button>
          <el-button @click="dialogVisible = false">Fechar</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, watch } from 'vue';
import { ElMessage, ElSelect, ElOption, ElButton, ElDialog, ElForm, ElFormItem, ElInput } from 'element-plus';
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

const form = reactive({
  category: '',
  flavour: '',
  quantity: 0,
  comments: '',
});

const toggleDialog = () => {
  dialogVisible.value = !dialogVisible.value;
};

const resetForm = () => {
  form.category = '';
  form.flavour = '';
  form.quantity = 0;
  form.comments = '';
};

const onSubmit = () => {
  console.log('Form Data:', form);
  dialogVisible.value = false;
};

const updateFlavourOptions = () => {
  filteredFlavourOptions.value = flavourOptions.value.filter(flavour => flavour.category === form.category);
};

onMounted(() => {
  axios.get(url, { headers })
    .then(response => {
      if (response.data) {
        console.log(response.data);
        const products = response.data;
        const uniqueCategories = [...new Set(products.map(product => product.category))];
        categoryOptions.value = uniqueCategories.map(category => ({ label: category, value: category }));
        flavourOptions.value = products.map(product => ({ label: product.flavour, value: product.flavour, category: product.category }));
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
  if (!newVisibility) {
    resetForm();
  }
})
</script>

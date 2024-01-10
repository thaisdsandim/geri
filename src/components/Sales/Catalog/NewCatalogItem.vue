<template>
  <div>
    <el-button
      type="primary"
      circle
      @click="toggleDialog"
      class="floating-button"
    >+</el-button>

    <el-dialog v-model="dialogVisible" title="Adicionar Produto" width="95%" center>
      <el-form :model="form" label-width="auto" class="mt-20">
        <el-form-item label="Categoria*">
          <el-select v-model="form.category" filterable placeholder="Selecione uma categoria...">
            <el-option
              v-for="category in options"
              :key="category.value"
              :label="category.label"
              :value="category.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Tipo*">
          <el-input v-model="form.flavour" type="text" placeholder="Digite o tipo do produto..." />
        </el-form-item>
        <el-form-item label="Valor do produto*">
          <el-input-number
            v-model="form.value"
            :precision="2"
            :step="1"
          />
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
         ElInputNumber,
         ElLoading
} from 'element-plus';
import axios from 'axios';
import URL from '../../../config/apiConfig';
import { useAuthStore } from '../../../stores/store';

const authStore = useAuthStore();
const token = authStore.user.authentication_token;
const unitId = authStore.user.unit_id;

const headers = {
  Authorization: `Bearer ${token}`
};

const dialogVisible = ref(false);

const form = reactive({
  category: '',
  flavour: '',
  value: 0,
  unit_id: unitId,
});

const resetForm = () => {
  form.category = '';
  form.flavour = '';
  form.value = 0;
  form.unit_id = unitId;
};

const options = [
  {
    value: 'Bolo',
    label: 'Bolo',
  },
  {
    value: 'Docinhos',
    label: 'Docinhos',
  },
  {
    value: 'Outros',
    label: 'Outros',
  }
]

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

  if (!form.value) {
    ElMessage({
      showClose: true,
      message: 'Por favor, preencha o valor do produto!',
      type: 'warning',
    });
    return;
  };

  const loading = ElLoading.service({
    lock: true,
    text: 'Salvando produto...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  axios.post(`${URL}/units/${unitId}/products`, form, { headers })
  .then(response => {
    if (response.data) {
      window.location.reload();
      dialogVisible.value = false;
      loading.close();
      ElMessage({
        showClose: true,
        message: 'Produto salvo com sucesso!',
        type: 'success',
      });
    } else {
      loading.close();
      ElMessage({
        showClose: true,
        message: 'Erro ao salvar produto!',
        type: 'error',
      });
    }
  }).catch(error => {
    loading.close();
    ElMessage({
      showClose: true,
      message: 'Erro ao salvar produto!',
      type: 'error',
    });
  });
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
  z-index: 999;
}
</style>

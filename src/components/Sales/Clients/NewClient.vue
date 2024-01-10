<template>
  <div>
    <el-button
      type="primary"
      circle
      @click="toggleDialog"
      class="floating-button"
    >+</el-button>

    <el-dialog v-model="dialogVisible" title="Adicionar Cliente" width="95%" center>
      <el-form :model="form" label-width="auto" class="mt-20">
        <el-form-item label="Nome*">
          <el-input v-model="form.name" type="text" placeholder="Digite o nome do cliente..." />
        </el-form-item>
        <el-form-item label="Telefone*">
          <el-input v-model="formattedPhone" type="text" placeholder="Digite o número de telefone do cliente..." @change="onPhoneInput" />
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
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage,
         ElButton,
         ElDialog,
         ElForm,
         ElFormItem,
         ElInput,
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
  name: '',
  phone: '',
  unit_id: unitId,
});

const resetForm = () => {
  form.name = '';
  form.phone = '';
  form.unit_id = unitId;
};

const toggleDialog = () => {
  dialogVisible.value = !dialogVisible.value;
};

const formattedPhone = computed({
  get: () => {
    return formatPhoneNumber(form.phone);
  },
  set: (value) => {
    form.phone = unformatPhoneNumber(value);
  },
});

const onPhoneInput = (value) => {
  form.phone = unformatPhoneNumber(value);
};

const formatPhoneNumber = (phoneNumber) => {
  const formatted = phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  return formatted;
};

const unformatPhoneNumber = (formattedPhoneNumber) => {
  return formattedPhoneNumber.replace(/\D/g, '');
};

const onSubmit = () => {
  if (!form.name) {
    ElMessage({
      showClose: true,
      message: 'Por favor, preencha o nome do cliente!',
      type: 'warning',
    });
    return;
  };

  if (!form.phone) {
    ElMessage({
      showClose: true,
      message: 'Por favor, preencha o número de telefone do cliente!',
      type: 'warning',
    });
    return;
  };

  if (form.phone.length <= 10) {
    ElMessage({
      showClose: true,
      message: 'Por favor, preencha o número de telefone do cliente corretamente!',
      type: 'warning',
    });
    return;
  };

  form.phone = formattedPhone.value;

  const loading = ElLoading.service({
    lock: true,
    text: 'Salvando cliente...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  axios.post(`${URL}/units/${unitId}/costumers`, form, { headers })
  .then(response => {
    if (response.data) {
      window.location.reload();
      dialogVisible.value = false;
      loading.close();
      ElMessage({
        showClose: true,
        message: 'Cliente salvo com sucesso!',
        type: 'success',
      });
    } else {
      loading.close();
      ElMessage({
        showClose: true,
        message: 'Erro ao salvar o cliente!',
        type: 'error',
      });
    }
  }).catch(error => {
    loading.close();
    ElMessage({
      showClose: true,
      message: 'Erro ao salvar o cliente!',
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

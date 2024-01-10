<template>
  <el-tooltip
    effect="light"
    content="Editar cliente"
    placement="bottom-end"
  >
    <el-button :icon="Edit" type="primary" @click="dialogVisible = true" class="mt-20 edit-button" circle></el-button>
  </el-tooltip>

  <el-dialog v-model="dialogVisible" title="Editar Cliente" width="95%" center>
    <el-form :model="editedClient" label-width="auto" class="mt-20">
      <el-form-item label="Nome*">
        <el-input v-model="editedClient.name" type="text" placeholder="Digite o nome do cliente..." />
      </el-form-item>
      <el-form-item label="Telefone*">
        <el-input v-model="editedClient.phone" type="text" placeholder="Digite o número de telefone do cliente..." @input="formatPhoneNumber" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">Fechar</el-button>
      <el-button type="primary" @click="onSubmit">Salvar</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue';
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElMessage, ElLoading, ElTooltip } from 'element-plus';
import { Edit } from '@element-plus/icons-vue';
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

const props = defineProps(['client']);
const editedClient = ref({ ...props.client });

const resetEditedClient = () => {
  editedClient.value = {
    name: props.client.name,
    phone: props.client.phone,
  };
};

const formatPhoneNumber = () => {
  let phoneNumber = editedClient.value.phone.replace(/\D/g, '');

  phoneNumber = phoneNumber.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');

  editedClient.value.phone = phoneNumber;
};

const onSubmit = () => {
  if (!editedClient.value.name) {
    ElMessage({
      showClose: true,
      message: 'Por favor, preencha o nome do cliente!',
      type: 'warning',
    });
    return;
  };

  if (!editedClient.value.phone) {
    ElMessage({
      showClose: true,
      message: 'Por favor, preencha o número de telefone do cliente!',
      type: 'warning',
    });
    return;
  };

  if (editedClient.value.phone.length !== 15) {
    ElMessage({
      showClose: true,
      message: 'Por favor, preencha o número de telefone do cliente corretamente!',
      type: 'warning',
    });
    return;
  };

  const form = {
    name: editedClient.value.name,
    phone: editedClient.value.phone,
    unit_id: unitId
  }

  const loading = ElLoading.service({
    lock: true,
    text: 'Salvando a modificação no cliente...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  axios.put(`${URL}/units/${unitId}/costumers/${props.client.id}`, form, { headers })
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
    resetEditedClient();
  }
});
</script>

<style>
.edit-button {
  margin-right: 10px;
}
</style>

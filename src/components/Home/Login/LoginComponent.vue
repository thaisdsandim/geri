<template>
  <GoogleLogin :callback="callback"/>
</template>

<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../../../stores/store';
import URL from '../../../config/apiConfig';

const router = useRouter();
const authStore = useAuthStore();

const callback = async (response) => {
  try {
    const data = {
      token: response.credential,
    };

    const apiResponse = await axios.post(`${URL}/users/sign_in`, data);

    if (apiResponse.status === 200) {
      authStore.setUser(apiResponse.data);
      ElMessage({
        showClose: true,
        message: 'Usuário logado com sucesso!',
        type: 'success',
      });
      router.push(`/dashboard`);
    } else {
      ElMessage({
        showClose: true,
        message: apiResponse.data.error,
        type: 'error',
      });
    }
  } catch (error) {
    ElMessage({
      showClose: true,
      message: error.response.data.error,
      type: 'error',
    });
  }
};
</script>

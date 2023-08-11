<template>
  <div class="welcome">
    <el-row class="center-row mb-10">
      <el-col>
        <img src="../assets/geri.png" alt="Logo">
      </el-col>
      <el-col class="text">Bem-vindo ao</el-col>
      <el-col class="name mb-10">Geri</el-col>
    </el-row>
    <el-row class="center-row">
        <el-col>
          <el-button type="primary" class="login mb-10" @click="showLogin">ENTRAR</el-button>
        </el-col>
      <el-col><el-button class="register" @click="register">CADASTRAR</el-button></el-col>
    </el-row>
    <el-dialog v-model="isLoginVisible" title="Escolha a conta para entrar" class="loginDialog">
      <GoogleLogin :callback="callback"/>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ElRow, ElCol, ElButton, ElDialog, ElMessage } from 'element-plus';
import { ref } from 'vue';
import axios from 'axios';
import URL from '../config/apiConfig';

const router = useRouter();

const isLoginVisible = ref(false);

const showLogin = () => {
  isLoginVisible.value = true;
};

const register = () => {
  router.push('/cadastrar');
};

const callback = async (response) => {
  try {
    const data = {
      token: response.credential,
    };

    const apiResponse = await axios.post(`${URL}/users/sign_in`, data);

    if (apiResponse.status === 200) {
      console.log(apiResponse.data)
      ElMessage({
        showClose: true,
        message: 'Usuário logado com sucesso!',
        type: 'success',
      });
      isLoginVisible.value = false;
    } else {
      ElMessage({
        showClose: true,
        message: apiResponse.data.error,
        type: 'error',
      });
      isLoginVisible.value = false;
    }
  } catch (error) {
    ElMessage({
      showClose: true,
      message: error.response.data.error,
      type: 'error',
    });
    isLoginVisible.value = false;
  }
};
</script>

<style>
.welcome {
  display: flex;
  flex-direction: column;
}
.center-row {
  text-align: center;
}
.text, .register {
  font-size: 14px;
  border-style: none;
}
.name {
  font-size: 60px;
  font-weight: 700;
}
.login {
  font-size: 18px;
  padding: 20px;
  padding-left: 50px;
  padding-right: 50px;
}
.loginDialog {
  display: flex;
  flex-direction: column;
  align-items: center;
}
img {
  max-height: 25vw;
}
</style>

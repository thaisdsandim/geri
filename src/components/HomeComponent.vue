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
      <el-col><el-button class="register" @click="showRegister">CADASTRAR</el-button></el-col>
    </el-row>

    <el-dialog v-model="isLoginVisible" title="Escolha a conta para entrar" class="dialog">
      <GoogleLogin :callback="callback"/>
    </el-dialog>

    <el-dialog v-model="isRegisterVisible" title="Cadastre-se no Geri" class="dialog">
      Deixe seu contato que retornaremos com informações sobre planos e valores:
      <el-form label-position="top" @submit.prevent="validateForm" class="mt-20">
        <el-form-item label="Nome">
          <el-input type="name" v-model="register.from_name" placeholder="Nome Completo" required/>
        </el-form-item>
        <el-form-item label="Email">
          <el-input type="email" v-model="register.from_email" placeholder="seu@email.com.br" required/>
        </el-form-item>
        <el-form-item label="Mensagem">
          <el-input type="textarea" v-model="register.message" placeholder="Digite sua mensagem aqui..."/>
        </el-form-item>
        <el-form-item class="submit-button">
          <el-button type="primary" native-type="submit">ENVIAR</el-button>
          <el-button class="register" @click="hideRegister">CANCELAR</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/store';
import axios from 'axios';
import emailjs from 'emailjs-com';
import URL from '../config/apiConfig';
import {
  ElRow,
  ElCol,
  ElButton,
  ElDialog,
  ElMessage,
  ElForm,
  ElFormItem,
  ElInput
} from 'element-plus';

const router = useRouter();
const authStore = useAuthStore();
const isLoginVisible = ref(false);
const isRegisterVisible = ref(false);
const serviceId = 'service_866m4dz';
const templateId = 'template_guxh768';
const userId = '07lhIkLQvaxZGcFuL';

const register = ref({
  from_name: '',
  from_email: '',
  message: ''
});

const resetRegisterForm = () => {
  register.value.from_name = '';
  register.value.from_email = '';
  register.value.message = '';
};

const showLogin = () => {
  isLoginVisible.value = true;
};

const showRegister = () => {
  isRegisterVisible.value = true;
};

const hideRegister = () => {
  isRegisterVisible.value = false;
};

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
      isLoginVisible.value = false;
      router.push(`/dashboard`);
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

const validateForm = () => {
  const fullName = register.value.from_name.split(' ');
  if (fullName.length < 2) {
    ElMessage({
      showClose: true,
      message: 'Digite seu nome completo!',
      type: 'warning',
    });
    return;
  }

  const templateParams = { ...register.value };

  submitForm(templateParams);
  resetRegisterForm();
};

const submitForm = (templateParams) => {

  emailjs.send(serviceId, templateId, templateParams, userId)
    .then(response => {
      console.log(response);
      ElMessage({
        showClose: true,
        message: 'Cadastro enviado com sucesso!',
        type: 'success',
      });
      isRegisterVisible.value = false;
    })
    .catch(error => {
      console.error(error);
      ElMessage({
        showClose: true,
        message: 'Erro ao enviar cadastro!',
        type: 'error',
      });
      isRegisterVisible.value = false;
    });
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
.dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80vw;
}
.mt-20 {
  margin-top: 20px;
}
img {
  max-height: 25vw;
}
</style>

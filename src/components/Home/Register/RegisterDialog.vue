<template>
  <el-button class="register" @click="showRegister">CADASTRAR</el-button>

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
</template>

<script setup>
import { ref } from 'vue';
import emailjs from 'emailjs-com';
import {
  ElButton,
  ElDialog,
  ElMessage,
  ElForm,
  ElFormItem,
  ElInput
} from 'element-plus';

const isRegisterVisible = ref(false);
const serviceId = 'service_866m4dz';
const templateId = 'template_guxh768';
const userId = 'IPjhIUVeygJvsyWBU';

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

const showRegister = () => {
  isRegisterVisible.value = true;
};

const hideRegister = () => {
  isRegisterVisible.value = false;
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
.register {
  font-size: 14px;
  border-style: none;
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
</style>

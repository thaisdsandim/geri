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
      <el-col><el-button type="primary" class="login mb-10" @click="login">ENTRAR</el-button></el-col>
      <el-col><el-button class="register" @click="register">CADASTRAR</el-button></el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const login = () => {
  router.push('/entrar');
};

const register = () => {
  router.push('/cadastrar');
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
img {
  max-height: 25vw;
}
</style>

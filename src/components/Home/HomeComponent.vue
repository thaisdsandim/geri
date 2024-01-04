<template>
  <div class="welcome">
    <el-row class="center-row mb-10">
      <el-col>
        <img src="../../assets/geri.png" alt="Logo">
      </el-col>
      <el-col class="text">Bem-vindo ao</el-col>
      <el-col class="name mb-10">Geri</el-col>
    </el-row>
    <el-row class="center-row">
      <el-col class="login mb-10">
        <LoginComponent />
      </el-col>
      <el-col>
        <RegisterDialog />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ElRow, ElCol } from 'element-plus';
import RegisterDialog from '../Home/Register/RegisterDialog.vue';
import LoginComponent from '../Home/Login/LoginComponent.vue';
</script>

<style>
.welcome {
  display: flex;
  flex-direction: column;
}
.center-row {
  text-align: center;
}
.text {
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

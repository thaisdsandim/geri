<template>
  <el-button type="primary" @click="dialogVisible = true">Editar</el-button>

  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="70%"
    :before-close="handleClose"
  >
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { ElButton, ElDialog } from 'element-plus';

const dialogVisible = ref(false);
</script>
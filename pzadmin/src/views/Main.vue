<template>
    <div class="common-layout">
      <el-container>
        <el-header><Header /></el-header>
        <el-container>
          <el-aside ><Aside /></el-aside> 
          <el-main><RouterView /></el-main>
        </el-container>
      </el-container>
    </div>
  </template>

<script setup>
import { RouterView } from 'vue-router';
import Aside from '../components/aside.vue'
import Header from '../components/navHeader.vue'
</script>
<style lang="less">
    .common-layout {
        height: 100%;
        .el-container{
            height: 100%;
        }
    }
</style>
<template>
  <header>
    <h1>儿童、青少年身高、体重、BMI百分位曲线图</h1>
  </header>
  <main class="main-body">
    <div class="inner-view">
      <el-tabs v-model="activeTabName" class="demo-tabs" @tab-click="handleClickTab">
        <el-tab-pane label="主程序" name="tab1">
          <MainView />
        </el-tab-pane>
        <el-tab-pane label="历史数据" name="tab2">
          <HistoryView />
        </el-tab-pane>
      </el-tabs>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainView from '@/views/MainView.vue'
import HistoryView from '@/views/HistoryView.vue'

const activeTabName = ref('tab1')

const handleClickTab = (tabName: string) => {
  activeTabName.value = tabName
}

setTimeout(() => {
  activeTabName.value = 'tab2'
}, 0)


</script>

<style scoped></style>

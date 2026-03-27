<template>
  <header>
    <h1>儿童、青少年身高、体重、BMI百分位曲线图</h1>
  </header>
  <main class="main-body">
    <div class="inner-view">
      <el-tabs v-model="activeTabName" class="demo-tabs" @tab-change="handleChangeTab">
        <el-tab-pane label="曲线图" name="tab1">
          <MainView ref="view1" />
        </el-tab-pane>
        <el-tab-pane label="历史检查数据" name="tab2">
          <HistoryView ref="view2" @view-in-chart="onView" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainView from '@/views/MainView.vue'
import HistoryView from '@/views/HistoryView.vue'

const view1 = ref()
const view2 = ref()
const activeTabName = ref('tab1')

const handleChangeTab = (tabName: string) => {
  activeTabName.value = tabName
  if (tabName === 'tab2') {
    view2.value.refreshTable()
  }
}

const onView = (arr: any[]) => {
  activeTabName.value = 'tab1'
  view1.value.setupData(arr)
}
// setTimeout(() => {
//   activeTabName.value = 'tab2'
// }, 0)

</script>

<style scoped></style>

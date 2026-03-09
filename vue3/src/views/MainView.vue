<template>
  <Block>
    <div class="top-bar">
      <ul class="search-items">
        <li>
          <label>性别：</label>
          <el-select v-model="sex" placeholder="请选择性别" style="width: 160px;">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
          </el-select>
        </li>
        <li>
          <label>年龄段：</label>
          <el-select v-model="age" placeholder="请选择年龄段" style="width: 160px;">
            <el-option label="0~3岁" value="1" />
            <el-option label="3~18岁" value="2" />
          </el-select>
        </li>
      </ul>
      <ul class="right-btns">
        <li><el-button type="primary" :icon="Printer" @click="onInputData" disabled>打印身高体重图</el-button></li>
        <li><el-button type="primary" :icon="Printer" @click="onInputData" disabled>打印BMI图</el-button></li>
        <li><el-button type="success" :icon="Edit" @click="onInputData">录入数据</el-button></li>
      </ul>
    </div>
  </Block>
  <Block>
    <div class="chart-can">
      <Echarts :option="chartOption" />
    </div>
  </Block>
  <Block>
    <div class="chart-can"></div>
  </Block>
  <el-drawer v-model="viewDrawer" title="检查数据录入">
    <DataForm />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Printer, Edit } from '@element-plus/icons-vue'
import Block from '@/components/Block.vue'
import DataForm from '@/components/DataForm.vue'
import Echarts from '@/components/Echart.vue'

// 显示编辑抽屉
const viewDrawer = ref<boolean>(false)

const sex = ref(null)
const age = ref(null)

const chartOption = ref({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
}) // 图表1

const onInputData = () => {
  viewDrawer.value = true
}

</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  padding: 0.5em;
}

.top-bar ul.search-items {
  display: flex;
}

.top-bar ul.search-items li {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 1em;
}

.top-bar ul.search-items li label {
  display: block;
  text-align: right;
  width: 70px;
  margin-right: 0.5em;
}

ul.right-btns {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

ul.right-btns li {
  margin-left: 1em;
}
</style>
<template>
  <div style="padding:20px;">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="range" label="BMI 范围" align="center" width="180" />
      <el-table-column prop="class" label="分类" align="center" width="180" />
      <el-table-column prop="tips" label="健康提示" align="center" />
      <el-table-column prop="color" label="提示色" align="center" width="100">
        <template #default="scope">
          <div class="color-can">
            <div :style="`background-color: ${scope.row.color};`"></div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  { range: '< 18.5', class: '体重过低（消瘦）', tips: '可能存在营养不良、免疫力下降、骨质疏松等风险', color: '#87CEFA' },
  { range: '18.5 ~ 23.9', class: '正常范围', tips: '体重理想，慢性病风险较低；其中 BMI = 20 被视为“理想体重”', color: 'green' },
  { range: '24.0 ~ 27.9', class: '超重', tips: '建议控制饮食、增加运动，预防慢性疾病', color: 'orange' },
  { range: '≥ 28.0	', class: '肥胖', tips: '显著增加患高血压、糖尿病、冠心病等疾病的风险，需积极干预', color: 'red' },
])

</script>

<style scoped>
.color-can {
  display: flex;
  justify-content: center;
  align-items: center;
}

.color-can>div {
  width: 30px;
  height: 15px;
}
</style>
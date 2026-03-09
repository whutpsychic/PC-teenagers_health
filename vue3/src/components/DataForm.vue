<!-- 这是录入数据的表单 -->
<template>
  <div class="form-can">
    <el-form label-position="right" label-width="80px" :model="formData" style="max-width: 600px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名" :style="`width:${itemWidth}px;`" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="formData.sex" placeholder="请选择姓名" :style="`width:${itemWidth}px;`">
          <el-option label="男" value="male"></el-option>
          <el-option label="女" value="female"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检查时间" prop="checkoutTime">
        <el-date-picker v-model="formData.checkoutTime" placeholder="请选择时间" :style="`width:${itemWidth}px;`" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="formData.age" placeholder="请输入年龄，例如：2.5岁 或 30个月" :style="`width:${itemWidth}px;`" />
      </el-form-item>
      <el-form-item label="登记号" prop="number">
        <el-input v-model="formData.number" placeholder="请输入登记号(七位数字)" :style="`width:${itemWidth}px;`" />
      </el-form-item>
      <el-form-item label="身高(cm)" prop="height">
        <el-input-number v-model="formData.height" placeholder="请输入身高" :style="`width:${itemWidth}px;`" />
      </el-form-item>
      <el-form-item label="体重(kg)" prop="weight">
        <el-input-number v-model="formData.weight" placeholder="请输入体重" :style="`width:${itemWidth}px;`" />
      </el-form-item>
      <el-form-item label="BMI" prop="bmi">
        <el-input v-model="formData.bmi" disabled :style="`width:${itemWidth}px;`" />
      </el-form-item>
    </el-form>
    <div class="btns">
      <el-button type="primary" :icon="Histogram" @click="onCalculate" disabled>计算BMI</el-button>
      <el-button type="success" :icon="Operation" @click="onSave" disabled>保存数据</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Histogram, Operation } from '@element-plus/icons-vue'

const itemWidth = 280

const formData = reactive({
  name: '',
  sex: '',
  checkoutTime: null,
  age: null,
  number: null,
  height: null,
  weight: null,
  bmi: null
})

const formRules = [

]

const onCalculate = () => { }

const onSave = () => { }

</script>

<style scoped>
.btns {
  width: calc(100% - 40px);
  margin: 20px;
  display: flex;
  justify-content: center;
}

.btns button {
  margin: 0 15px;
}
</style>
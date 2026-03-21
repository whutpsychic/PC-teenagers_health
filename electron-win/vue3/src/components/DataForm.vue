<!-- 这是录入数据的表单 -->
<template>
  <div class="form-can">
    <el-form ref="formRef" label-position="right" label-width="120px" :model="formData" :rules="formRules"
      style="max-width: 600px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名" :style="`width:${itemWidth}px;`" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="formData.sex" placeholder="请选择姓名" :style="`width:${itemWidth}px;`">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检查时间" prop="time">
        <el-date-picker v-model="formData.time" placeholder="请选择时间" :style="`width:${itemWidth}px;`" value-format="x" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <!-- <el-input v-model="formData.age" placeholder="请输入年龄，例如：2.5岁 或 30个月" :style="`width:${itemWidth}px;`" /> -->
        <el-select v-model="formData.age" placeholder="请选择年龄层" :style="`width:${itemWidth}px;`">
          <el-option v-for="(item) in [...growthData.ages, ...growthData.ages2]" :key="item" :label="item"
            :value="item"></el-option>
        </el-select>
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
        <span v-if="formData.bmi">{{ formData.bmi }}</span>
        <span v-else style="color: #aaa">{{ '请填好身高体重后再计算' }}</span>
      </el-form-item>
      <p class="details">BMI计算公式：体重 (kg) 除以身高 (m) 的平方</p>
    </el-form>
    <div class="btns">
      <el-button type="primary" :icon="Histogram" @click="onCalculate"
        :disabled="!formData.height || !formData.weight">计算BMI</el-button>
      <el-button type="success" :icon="Operation" @click="onSave">保存数据</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Histogram, Operation } from '@element-plus/icons-vue'
import type { FormRules } from 'element-plus'
import { growthData } from '@/static/data'

const emits = defineEmits(['save'])

const itemWidth = 280

const formRef = ref()

const formData = reactive<Databar>({
  id: null,
  name: null,
  sex: null,
  time: null,
  age: null,
  number: null,
  height: null,
  weight: null,
  bmi: null
})

const validateSevenDigitNumber = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入一个七位数字'))
  } else if (!/^\d{7}$/.test(value)) {
    callback(new Error('你输入的不是一个七位数字'))
  } else {
    callback()
  }
}

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  time: [{ required: true, message: '请选择日期', trigger: ['blur', 'change'] }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  number: [{ required: true, validator: validateSevenDigitNumber, trigger: 'blur' }],
  height: [{ required: true, message: '请输入身高', trigger: ['blur', 'change'] }],
  weight: [{ required: true, message: '请输入体重', trigger: ['blur', 'change'] }],
})

const onCalculate = () => {
  const { weight, height } = formData

  if (weight && height) {
    const result = (weight / height * 100) / (height / 100)
    formData.bmi = Number(result.toFixed(2))
  }
}

const onSave = () => {
  formRef.value.validate().then((res: any) => {
    // 通过校验
    if (res === true) {
      // 如果没有id
      if (!formData.id) {
        formData.id = Date.now()
      }
      // 开始准备保存数据
      emits('save', formData)
    }
  })
}

// 清除数据
const clear = () => {
  formRef.value.resetFields()
  formData.id = null
}

// 加载预设数据
const setupData = (data: any) => {
  const keys = Object.keys(formData) as (keyof Databar)[];
  for (const key of keys) {
    formData[key] = data[key]; // ✅ TS 现在能正确推断每个 key 的类型！
  }
}

defineExpose({ clear, setupData })

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

.details {
  font-size: 13px;
  color: #666;
  text-align: center;
}
</style>
<template>
  <Block>
    <div class="top-bar">
      <ul class="search-items">
        <li>
          <label>性别：</label>
          <el-select v-model="sex" placeholder="请选择性别" style="width: 160px;" @change="onChangeSex">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </li>
        <li>
          <label>年龄段：</label>
          <el-select v-model="age" placeholder="请选择年龄段" style="width: 160px;" @change="onChangeAge">
            <el-option label="0~3岁" value="1" />
            <el-option label="3~18岁" value="2" />
          </el-select>
        </li>
      </ul>
      <ul class="right-btns">
        <li><el-button type="success" :icon="Edit" @click="onInputData">录入数据</el-button></li>
      </ul>
    </div>
  </Block>
  <Block>
    <p class="title">
      <span>{{ title1 }}</span>
    <div style="display: flex;align-items: center;">
      <ul class="operate-btns">
        <li>
          <label>查看身高数据</label>
          <el-switch v-model="viewDots1" @change="() => setupChartOption1()" :disabled="mainData.length < 1" />
        </li>
        <li>
          <label>查看体重数据</label>
          <el-switch v-model="viewDots2" @change="() => setupChartOption1()" :disabled="mainData.length < 1" />
        </li>
        <li><label>身高参考曲线</label><el-switch v-model="viewlines1" @change="() => setupChartOption1()" /></li>
        <li><label>体重参考曲线</label><el-switch v-model="viewlines2" @change="() => setupChartOption1()" /></li>
      </ul>
    </div>
    </p>
    <div class="chart-can">
      <Echarts :option="chartOption1" />
    </div>
  </Block>
  <Block>
    <p class="title">{{ title2 }}</p>
    <div class="chart-can">
      <Echarts :option="chartOption2" />
    </div>
  </Block>
  <el-drawer v-model="viewDrawer" title="检查数据录入">
    <DataForm @save="onSaveDataLine" />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Printer, Edit } from '@element-plus/icons-vue'
import Block from '@/components/Block.vue'
import DataForm from '@/components/DataForm.vue'
import Echarts from '@/components/Echart.vue'
import { growthData } from '@/static/data'
import { ElMessage } from 'element-plus'

// 显示编辑抽屉
const viewDrawer = ref<boolean>(false)

// 顶部搜索条件
const sex = ref('男')
const age = ref('1')

const title1 = ref<string>('')
const title2 = ref<string>('')

const viewDots1 = ref(true) // 查看人物身高数据
const viewDots2 = ref(true) // 查看人物体重数据
const viewlines1 = ref(true) // 查看曲线系列1
const viewlines2 = ref(true) // 查看曲线系列2

// 外部个人数据
const mainData = ref<any>([])

// 图表1的option
const chartOption1 = ref({})
// 图表2的option
const chartOption2 = ref({})

// 横坐标
const chartXaxis = computed(() => {
  return age.value === '1' ? growthData.ages : age.value === '2' ? growthData.ages2 : []
})

// 整理并给chart下料
const setupChartOption1 = () => {
  const key = sex.value === '男' ? 'male' : 'female'

  const heightLine1 = age.value === '1' ? growthData[key].height['3rd'].slice(0, 12) : age.value === '2' ? growthData[key].height['3rd'].slice(12, 42) : []
  const heightLine2 = age.value === '1' ? growthData[key].height['10th'].slice(0, 12) : age.value === '2' ? growthData[key].height['10th'].slice(12, 42) : []
  const heightLine3 = age.value === '1' ? growthData[key].height['25th'].slice(0, 12) : age.value === '2' ? growthData[key].height['25th'].slice(12, 42) : []
  const heightLine4 = age.value === '1' ? growthData[key].height['50th'].slice(0, 12) : age.value === '2' ? growthData[key].height['50th'].slice(12, 42) : []
  const heightLine5 = age.value === '1' ? growthData[key].height['75th'].slice(0, 12) : age.value === '2' ? growthData[key].height['75th'].slice(12, 42) : []
  const heightLine6 = age.value === '1' ? growthData[key].height['90th'].slice(0, 12) : age.value === '2' ? growthData[key].height['90th'].slice(12, 42) : []
  const heightLine7 = age.value === '1' ? growthData[key].height['97th'].slice(0, 12) : age.value === '2' ? growthData[key].height['97th'].slice(12, 42) : []

  const weightLine1 = age.value === '1' ? growthData[key].weight['3rd'].slice(0, 12) : age.value === '2' ? growthData[key].weight['3rd'].slice(12, 42) : []
  const weightLine2 = age.value === '1' ? growthData[key].weight['10th'].slice(0, 12) : age.value === '2' ? growthData[key].weight['10th'].slice(12, 42) : []
  const weightLine3 = age.value === '1' ? growthData[key].weight['25th'].slice(0, 12) : age.value === '2' ? growthData[key].weight['25th'].slice(12, 42) : []
  const weightLine4 = age.value === '1' ? growthData[key].weight['50th'].slice(0, 12) : age.value === '2' ? growthData[key].weight['50th'].slice(12, 42) : []
  const weightLine5 = age.value === '1' ? growthData[key].weight['75th'].slice(0, 12) : age.value === '2' ? growthData[key].weight['75th'].slice(12, 42) : []
  const weightLine6 = age.value === '1' ? growthData[key].weight['90th'].slice(0, 12) : age.value === '2' ? growthData[key].weight['90th'].slice(12, 42) : []
  const weightLine7 = age.value === '1' ? growthData[key].weight['97th'].slice(0, 12) : age.value === '2' ? growthData[key].weight['97th'].slice(12, 42) : []

  const title = age.value === '1' ? `中国0~3岁儿童（${sex.value}）身高、体重百分位曲线图` : age.value === '2' ? `中国3~18岁儿童（${sex.value}）身高、体重百分位曲线图` : '???'
  title1.value = title

  const result = {
    grid: { top: '20%', right: '5%', bottom: '15%', left: '5%' },
    tooltip: {},
    toolbox: { feature: { saveAsImage: {} } },
    legend: {
      data: ['身高3rd', '身高10th', '身高25th', '身高50th', '身高75th', '身高90th', '身高97th', '体重3rd', '体重10th', '体重25th', '体重50th', '体重75th', '体重90th', '体重97th']
    },
    xAxis: { type: 'category', data: chartXaxis.value, boundaryGap: false, axisLabel: { interval: 0 } },
    yAxis: [
      { type: 'value', name: '身高（cm）', nameTextStyle: { fontWeight: 'bold' }, axisLine: { show: true }, splitNumber: 20 },
      { type: 'value', name: '体重（kg）', nameTextStyle: { fontWeight: 'bold' }, axisLine: { show: true }, max: age.value === '1' ? 40 : 100 },
    ],
    series: []
  }

  const seriesData: any = []

  // 1系列标准线
  if (viewlines1.value) {
    seriesData.push({ name: '身高3rd', type: 'line', data: heightLine1, yAxisIndex: 0, lineStyle: { type: 'dashed' } })
    seriesData.push({ name: '身高10th', type: 'line', data: heightLine2, yAxisIndex: 0, lineStyle: { type: 'dotted' } })
    seriesData.push({ name: '身高25th', type: 'line', data: heightLine3, yAxisIndex: 0, lineStyle: { type: 'dashed' } })
    seriesData.push({ name: '身高50th', type: 'line', data: heightLine4, yAxisIndex: 0, lineStyle: { type: 'solid' } })
    seriesData.push({ name: '身高75th', type: 'line', data: heightLine5, yAxisIndex: 0, lineStyle: { type: 'dashed' } })
    seriesData.push({ name: '身高90th', type: 'line', data: heightLine6, yAxisIndex: 0, lineStyle: { type: 'dotted' } })
    seriesData.push({ name: '身高97th', type: 'line', data: heightLine7, yAxisIndex: 0, lineStyle: { type: 'dashed' } })
  }

  // 2系列标准线
  if (viewlines2.value) {
    seriesData.push({ name: '体重3rd', type: 'line', data: weightLine1, yAxisIndex: 1, lineStyle: { type: 'dashed' } })
    seriesData.push({ name: '体重10th', type: 'line', data: weightLine2, yAxisIndex: 1, lineStyle: { type: 'dotted' } })
    seriesData.push({ name: '体重25th', type: 'line', data: weightLine3, yAxisIndex: 1, lineStyle: { type: 'dashed' } })
    seriesData.push({ name: '体重50th', type: 'line', data: weightLine4, yAxisIndex: 1, lineStyle: { type: 'solid' } })
    seriesData.push({ name: '体重75th', type: 'line', data: weightLine5, yAxisIndex: 1, lineStyle: { type: 'dashed' } })
    seriesData.push({ name: '体重90th', type: 'line', data: weightLine6, yAxisIndex: 1, lineStyle: { type: 'dotted' } })
    seriesData.push({ name: '体重97th', type: 'line', data: weightLine7, yAxisIndex: 1, lineStyle: { type: 'dashed' } })
  }

  // 如果存在有个人数据
  // 注：目前仅支持显示单人数据(1个系列)
  if (mainData.value.length > 0) {
    if (viewDots1.value) {
      const _data1 = []
      for (let i = 0; i < chartXaxis.value.length; i++) {
        const axis = chartXaxis.value[i]
        const target = mainData.value.find((item: any) => {
          return item.age === axis
        })
        if (target) {
          _data1.push({ name: `${target.name}`, age: target.age, value: Number(target.height.toFixed(2)), yAxisIndex: 0 })
        } else {
          _data1.push({ value: undefined })
        }
      }
      seriesData.push(
        {
          name: `身高数据`,
          type: 'scatter',
          data: _data1,
          labelLayout: { y: 0, align: 'center', hideOverlap: true, moveOverlap: 'shiftX' },
          labelLine: { show: true, length2: 5, lineStyle: { color: '#bbb' } },
          symbolSize: function (data: any) {
            return 10
          },
          emphasis: { focus: 'self' },
          label: {
            show: true, minMargin: 10, position: 'top',
            formatter: function (param: any) {
              return `${param.data.age}: ${param.data.value}cm`;
            },
          },
        }
      )
    }

    if (viewDots2.value) {
      const _data2 = []
      for (let i = 0; i < chartXaxis.value.length; i++) {
        const axis = chartXaxis.value[i]
        const target = mainData.value.find((item: any) => {
          return item.age === axis
        })
        if (target) {
          _data2.push({ name: `${target.name}`, age: target.age, value: Number(target.weight.toFixed(2)), yAxisIndex: 1 })
        } else {
          _data2.push({ value: undefined })
        }
      }
      seriesData.push(
        {
          name: `体重数据`,
          type: 'scatter',
          data: _data2,
          labelLayout: { y: 20, align: 'center', hideOverlap: true, moveOverlap: 'shiftX' },
          labelLine: { show: true, length2: 5, lineStyle: { color: '#bbb' } },
          symbolSize: function (data: any) {
            return 10
          },
          emphasis: { focus: 'self' },
          label: {
            show: true, minMargin: 10, position: 'top',
            formatter: function (param: any) {
              return `${param.data.age}: ${param.data.value}kg`;
            },
          },
        }
      )
    }
  }

  result.series = seriesData

  chartOption1.value = result
}

// 整理并给chart下料
const setupChartOption2 = () => {
  const key = sex.value === '男' ? 'male' : 'female'

  const bmiLine1 = age.value === '1' ? growthData[key].bmi['3rd'].slice(0, 12) : age.value === '2' ? growthData[key].bmi['3rd'] : []
  const bmiLine2 = age.value === '1' ? growthData[key].bmi['5th'].slice(0, 12) : age.value === '2' ? growthData[key].bmi['5th'] : []
  const bmiLine3 = age.value === '1' ? growthData[key].bmi['10th'].slice(0, 12) : age.value === '2' ? growthData[key].bmi['10th'] : []
  const bmiLine4 = age.value === '1' ? growthData[key].bmi['15th'].slice(0, 12) : age.value === '2' ? growthData[key].bmi['15th'] : []
  const bmiLine5 = age.value === '1' ? growthData[key].bmi['50th'].slice(0, 12) : age.value === '2' ? growthData[key].bmi['50th'] : []
  const bmiLine6 = age.value === '1' ? growthData[key].bmi['85th'].slice(0, 12) : age.value === '2' ? growthData[key].bmi['85th'] : []
  const bmiLine7 = age.value === '1' ? growthData[key].bmi['90th'].slice(0, 12) : age.value === '2' ? growthData[key].bmi['90th'] : []
  const bmiLine8 = age.value === '1' ? growthData[key].bmi['95th'].slice(0, 12) : age.value === '2' ? growthData[key].bmi['95th'] : []
  const bmiLine9 = age.value === '1' ? growthData[key].bmi['97th'].slice(0, 12) : age.value === '2' ? growthData[key].bmi['97th'] : []

  const title = age.value === '1' ? `中国0~3岁儿童（${sex.value}）BMI曲线图` : age.value === '2' ? `中国3~18岁儿童（${sex.value}）BMI曲线图` : '???'
  title2.value = title

  const seriesData: any = [
    { name: '3rd', type: 'line', data: bmiLine1, lineStyle: { type: 'dashed' } },
    { name: '5th', type: 'line', data: bmiLine2, lineStyle: { type: 'dotted' } },
    { name: '10th', type: 'line', data: bmiLine3, lineStyle: { type: 'dashed' } },
    { name: '15th', type: 'line', data: bmiLine4, lineStyle: { type: 'dotted' } },
    { name: '50th', type: 'line', data: bmiLine5, lineStyle: { type: 'solid' } },
    { name: '85th', type: 'line', data: bmiLine6, lineStyle: { type: 'dotted' } },
    { name: '90th', type: 'line', data: bmiLine7, lineStyle: { type: 'dashed' } },
    { name: '95th', type: 'line', data: bmiLine8, lineStyle: { type: 'dotted' } },
    { name: '97th', type: 'line', data: bmiLine9, lineStyle: { type: 'dashed' } }
  ]

  const result = {
    grid: { top: '10%', right: '5%', bottom: '15%', left: '5%' },
    tooltip: {},
    toolbox: { feature: { saveAsImage: {} } },
    legend: {
      data: ['3rd', '5th', '10th', '15th', '50th', '85th', '90th', '95th', '97th']
    },
    xAxis: { type: 'category', data: chartXaxis.value, boundaryGap: false, axisLabel: { interval: 0 } },
    yAxis: { type: 'value', name: 'BMI', nameTextStyle: { fontWeight: 'bold' }, axisLine: { show: true }, min: 10 },
    series: []
  }

  if (mainData.value.length > 0) {
    const _data1: any[] = []
    for (let i = 0; i < chartXaxis.value.length; i++) {
      const axis = chartXaxis.value[i]
      const target = mainData.value.find((item: any) => {
        return item.age === axis
      })
      if (target) {
        _data1.push({ name: `${target.name}`, age: target.age, value: Number(target.bmi.toFixed(2)) })
      } else {
        _data1.push({ value: undefined })
      }
    }
    seriesData.push(
      {
        name: `bmi数据`,
        type: 'scatter',
        data: _data1,
        labelLayout: { y: 10, align: 'center', hideOverlap: true, moveOverlap: 'shiftX' },
        labelLine: { show: true, length2: 5, lineStyle: { color: '#bbb' } },
        symbolSize: function (data: any) {
          return 10
        },
        emphasis: { focus: 'self' },
        label: {
          show: true, minMargin: 10, position: 'top',
          formatter: function (param: any) {
            return `${param.data.age}: ${param.data.value}`;
          },
        },
      }
    )
  }

  result.series = seriesData

  chartOption2.value = result
}

// 准备录入数据
const onInputData = () => {
  viewDrawer.value = true
}

// 准备保存数据
const onSaveDataLine = async (dataline: any) => {
  const { electronAPI } = window as any
  if (electronAPI) {
    // 新增
    try {
      await electronAPI.saveData({ ...dataline });
      viewDrawer.value = false
      ElMessage({
        message: '新增数据成功',
        type: 'success',
      })
      mainData.value.push({ ...dataline })
      setupChartOption1()
      setupChartOption2()
    } catch (error) {
      console.error(error)
    }
  } else {
    console.log('Electron API not available')
  }
}

const onChangeSex = (v: string) => {
  setupChartOption1()
  setupChartOption2()
}

const onChangeAge = (v: string) => {
  setupChartOption1()
  setupChartOption2()
}

const addFakeData = () => {
  // 添加20条测试数据 
  const arr = []
  for (let i = 1; i < 8; i++) {
    const h = Math.floor(Math.random() * (100 - 60 + 1)) + 60
    const w = Math.floor(Math.random() * (20 - 6 + 1)) + 6
    arr.push({
      id: i,
      name: `测试姓名`,
      sex: '男',
      age: growthData.ages[i],
      time: Date.now(),
      number: `123456${i}`,
      height: h,
      weight: w,
      bmi: (w / h * 100) / (h / 100)
    })
  }
  mainData.value = arr
}

const setupData = (arr: any[]) => {
  mainData.value = arr
  setupChartOption1()
  setupChartOption2()
}

onMounted(() => {
  // 
  // addFakeData()

  setTimeout(() => {
    setupChartOption1()
    setupChartOption2()
  }, 300)
})

defineExpose({
  setupData
})

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

p.title {
  margin-bottom: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.operate-btns {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.operate-btns li {
  display: flex;
  align-items: center;
  margin-left: 1em;
}

.operate-btns li label {
  font-size: 13px;
  margin-right: 0.5em;
}
</style>
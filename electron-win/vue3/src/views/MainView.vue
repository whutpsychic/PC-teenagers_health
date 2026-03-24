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
        <li><el-button type="success" :icon="Edit" @click="onInputData">录入检查数</el-button></li>
      </ul>
    </div>
  </Block>
  <Block>
    <div style="display: flex;align-items: center;justify-content: flex-end;">
      <ul class="operate-btns">
        <li>
          <label>显示连线</label>
          <el-switch v-model="viewLabelLines1" @change="() => setupChartOption1()" :disabled="mainData.length < 1" />
        </li>
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
    <div class="chart-can">
      <Echarts :option="chartOption1" />
    </div>
  </Block>
  <Block>
    <div style="display: flex;align-items: center;justify-content: flex-end;">
      <ul class="operate-btns">
        <li>
          <label>显示连线</label>
          <el-switch v-model="viewLabelLines2" @change="() => setupChartOption2()" :disabled="mainData.length < 1" />
        </li>
        <li>
          <label>BMI参考线</label>
          <el-switch v-model="viewlines0" @change="() => setupChartOption2()" :disabled="mainData.length < 1" />
        </li>
      </ul>
    </div>
    <div class="chart-can">
      <Echarts :option="chartOption2" />
    </div>
  </Block>
  <el-drawer v-model="viewDrawer" title="检查数据录入">
    <DataForm @save="onSaveDataLine" />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { Printer, Edit } from '@element-plus/icons-vue'
import Block from '@/components/Block.vue'
import DataForm from '@/components/DataForm.vue'
import Echarts from '@/components/Echart.vue'
import { growthData } from '@/static/data'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { debugging } from '@/appConfig'
// 显示编辑抽屉
const viewDrawer = ref<boolean>(false)

const hospitalStr: string = '首都医科大学附属北京中医医院    儿科'

// 顶部搜索条件
const sex = ref<string>('男')
const age = ref<string>('2')

const viewDots1 = ref<boolean>(true) // 查看人物身高参考线
const viewDots2 = ref<boolean>(true) // 查看人物体重参考线
const viewlines1 = ref<boolean>(true) // 查看曲线系列1
const viewlines2 = ref<boolean>(true) // 查看曲线系列2
const viewLabelLines1 = ref<boolean>(true) // 显示落点数据的标签和连线

const viewlines0 = ref<boolean>(true)   // 查看BMI参考线
const viewLabelLines2 = ref<boolean>(true) // 显示落点数据的标签和连线

const pointSize: number = 1

// 外部个人数据
const mainData = ref<any>([])

// 图表1的option
const chartOption1 = ref({})
// 图表2的option
const chartOption2 = ref({})

// 给xaxis插入额外值(仅0~3岁添加额外数据)
const dealWithDataArr = (base: any[]) => {
  const result = []
  for (let i = 0; i < base.length; i++) {
    if (i !== 0) {
      result.push(``)
      result.push(``)
      result.push(``)
    }
    result.push(base[i])
  }
  return age.value == '1' ? result : base
}

// 给line添加补充值(仅0~3岁添加额外数据)
const insertExtraValues = (base: any[]) => {
  const result = []
  for (let i = 0; i < base.length; i++) {
    let currv = base[i]
    let nextv = base[i + 1]
    if (currv && nextv) {
      let middlev = (currv + nextv) / 2
      let mlv = (currv + middlev) / 2
      let mrv = (middlev + nextv) / 2
      result.push(currv)
      result.push(mlv)
      result.push(middlev)
      result.push(mrv)
    }
    // 最后一项
    else {
      result.push(currv)
    }
  }
  return age.value == '1' ? result : base
}

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

  const title = {
    text: age.value === '1' ? `中国0~3岁儿童（${sex.value}）身高、体重百分位曲线图` : age.value === '2' ? `中国3~18岁儿童（${sex.value}）身高、体重百分位曲线图` : '???',
    subtext: '',
    top: 10
  }

  const target = mainData.value[0]
  if (target) {
    title.subtext = `姓名：${target.name}  性别：${target.sex}  登记号：${target.number}`
  }

  // 横坐标(各刻度之间新增3个虚拟刻度)
  const chartXaxis = computed(() => {
    const arr = age.value === '1' ? growthData.ages.slice(0, 12) : age.value === '2' ? growthData.ages.slice(12, 42) : []
    // return arr
    return dealWithDataArr(arr)
  })

  const result = {
    title,
    grid: { top: '15%', right: '5%', bottom: '12%', left: '5%' },
    tooltip: {},
    toolbox: { feature: { saveAsImage: {} } },
    legend: {
      icon: 'circle',
      bottom: 30,
      data: ['身高3rd', '身高10th', '身高25th', '身高50th', '身高75th', '身高90th', '身高97th', '体重3rd', '体重10th', '体重25th', '体重50th', '体重75th', '体重90th', '体重97th']
    },
    xAxis: [
      { type: 'category', data: chartXaxis.value, boundaryGap: false, axisLabel: { interval: 0 }, splitLine: { show: true } },
      // { type: 'category', data: dealWithDataArr(chartXaxis.value), boundaryGap: false, axisLabel: { show: true, interval: 0 }, splitLine: { show: false } },
    ],
    yAxis: [
      { type: 'value', name: '身高（cm）', nameTextStyle: { fontWeight: 'bold' }, axisLine: { show: true }, splitNumber: 20, splitLine: { show: true }, max: age.value === '1' ? 110 : 200 },
      { type: 'value', name: '体重（kg）', nameTextStyle: { fontWeight: 'bold' }, axisLine: { show: true }, max: age.value === '1' ? 30 : 140, splitNumber: 20, splitLine: { show: !viewlines1.value } },
    ],
    series: [],
    graphic: {
      elements: [{ type: 'text', style: { text: hospitalStr, font: '0.8em "STHeiti", sans-serif', fill: '#888' }, bottom: 10, right: 120 }]
    }
  }

  const seriesData: any = []

  // 1系列标准线
  if (viewlines1.value) {
    seriesData.push({ name: '身高3rd', type: 'line', data: insertExtraValues(heightLine1), yAxisIndex: 0, lineStyle: { type: 'dashed', width: 1, color: '#FF0000' }, itemStyle: { color: '#FF0000' }, symbolSize: pointSize })
    seriesData.push({ name: '身高10th', type: 'line', data: insertExtraValues(heightLine2), yAxisIndex: 0, lineStyle: { type: 'dashed', width: 1, color: '#FF8C00' }, itemStyle: { color: '#FF8C00' }, symbolSize: pointSize })
    seriesData.push({ name: '身高25th', type: 'line', data: insertExtraValues(heightLine3), yAxisIndex: 0, lineStyle: { type: 'dashed', width: 1, color: '#32CD32' }, itemStyle: { color: '#32CD32' }, symbolSize: pointSize })
    seriesData.push({ name: '身高50th', type: 'line', data: insertExtraValues(heightLine4), yAxisIndex: 0, lineStyle: { type: 'solid', width: 1, color: '#483D8B' }, itemStyle: { color: '#483D8B' }, symbolSize: pointSize })
    seriesData.push({ name: '身高75th', type: 'line', data: insertExtraValues(heightLine5), yAxisIndex: 0, lineStyle: { type: 'dashed', width: 1, color: '#32CD32' }, itemStyle: { color: '#32CD32' }, symbolSize: pointSize })
    seriesData.push({ name: '身高90th', type: 'line', data: insertExtraValues(heightLine6), yAxisIndex: 0, lineStyle: { type: 'dashed', width: 1, color: '#FF8C00' }, itemStyle: { color: '#FF8C00' }, symbolSize: pointSize })
    seriesData.push({ name: '身高97th', type: 'line', data: insertExtraValues(heightLine7), yAxisIndex: 0, lineStyle: { type: 'dashed', width: 1, color: '#FF0000' }, itemStyle: { color: '#FF0000' }, symbolSize: pointSize })
  }

  // 2系列标准线
  if (viewlines2.value) {
    seriesData.push({ name: '体重3rd', type: 'line', data: insertExtraValues(weightLine1), yAxisIndex: 1, lineStyle: { type: 'dashed', width: 1, color: '#FF0000' }, itemStyle: { color: '#FF0000' }, symbolSize: pointSize })
    seriesData.push({ name: '体重10th', type: 'line', data: insertExtraValues(weightLine2), yAxisIndex: 1, lineStyle: { type: 'dashed', width: 1, color: '#FF8C00' }, itemStyle: { color: '#FF8C00' }, symbolSize: pointSize })
    seriesData.push({ name: '体重25th', type: 'line', data: insertExtraValues(weightLine3), yAxisIndex: 1, lineStyle: { type: 'dashed', width: 1, color: '#32CD32' }, itemStyle: { color: '#32CD32' }, symbolSize: pointSize })
    seriesData.push({ name: '体重50th', type: 'line', data: insertExtraValues(weightLine4), yAxisIndex: 1, lineStyle: { type: 'solid', width: 1, color: '#483D8B' }, itemStyle: { color: '#483D8B' }, symbolSize: pointSize })
    seriesData.push({ name: '体重75th', type: 'line', data: insertExtraValues(weightLine5), yAxisIndex: 1, lineStyle: { type: 'dashed', width: 1, color: '#32CD32' }, itemStyle: { color: '#32CD32' }, symbolSize: pointSize })
    seriesData.push({ name: '体重90th', type: 'line', data: insertExtraValues(weightLine6), yAxisIndex: 1, lineStyle: { type: 'dashed', width: 1, color: '#FF8C00' }, itemStyle: { color: '#FF8C00' }, symbolSize: pointSize })
    seriesData.push({ name: '体重97th', type: 'line', data: insertExtraValues(weightLine7), yAxisIndex: 1, lineStyle: { type: 'dashed', width: 1, color: '#FF0000' }, itemStyle: { color: '#FF0000' }, symbolSize: pointSize })
  }

  // 如果存在有个人数据
  // 注：目前仅支持显示单人数据(1个系列)
  if (mainData.value.length > 0) {
    const dataArr = mainData.value.filter((item: Databar) => {
      return item.sex === sex.value
    })

    if (viewDots1.value) {
      const _data1 = []
      for (let i = 0; i < chartXaxis.value.length; i++) {
        const axis = chartXaxis.value[i]
        const target = dataArr.find((item: any) => {
          return item.age === axis
        })
        if (target) {
          _data1.push({
            name: `${target.name}`, age: target.age, date: target.time, value: Number(target.height.toFixed(2)), yAxisIndex: 0,
            label: { show: viewLabelLines1.value ? true : false },
            labelLine: { show: viewLabelLines1.value ? true : false },
          })
        } else {
          _data1.push({ value: undefined, yAxisIndex: 0 })
        }
      }
      seriesData.push(
        {
          name: `身高数据`,
          type: 'scatter',
          yAxisIndex: 0,
          data: _data1,
          // labelLayout: { align: 'center', dx: 100, dy: -100 },
          labelLayout: { y: 70, align: 'center', hideOverlap: true, moveOverlap: 'shiftX' },
          labelLine: { show: true, length2: 5, lineStyle: { color: '#bbb' } },
          symbol: 'diamond', itemStyle: { color: '#555' }, symbolSize: function (data: any) { return 10 },
          emphasis: { focus: 'none' },
          label: {
            show: true, minMargin: 10,
            formatter: function (param: any) {
              return `${param.data.age}，测量身高: ${param.data.value}cm（${dayjs(param.data.date).format('YYYY-MM-DD')}）`;
            },
          },
        }
      )
    }

    if (viewDots2.value) {
      const _data2 = []
      for (let i = 0; i < chartXaxis.value.length; i++) {
        const axis = chartXaxis.value[i]
        const target = dataArr.find((item: any) => {
          return item.age === axis
        })
        if (target) {
          _data2.push({
            name: `${target.name}`, age: target.age, date: target.time, value: Number(target.weight.toFixed(2)), yAxisIndex: 1,
            label: { show: viewLabelLines1.value ? true : false },
            labelLine: { show: viewLabelLines1.value ? true : false },
          })
        } else {
          _data2.push({ value: undefined })
        }
      }
      seriesData.push(
        {
          name: `体重数据`,
          type: 'scatter',
          yAxisIndex: 1,
          data: _data2,
          labelLayout: { y: 100, align: 'center', hideOverlap: true, moveOverlap: 'shiftX' },
          labelLine: { show: true, length2: 5, lineStyle: { color: '#bbb' } },
          symbol: 'diamond', itemStyle: { color: '#555' }, symbolSize: function (data: any) { return 10 },
          emphasis: { focus: 'none' },
          label: {
            show: true, minMargin: 10,
            formatter: function (param: any) {
              return `${param.data.age}，测量体重: ${param.data.value}kg（${dayjs(param.data.date).format('YYYY-MM-DD')}）`;
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

  const bmiLine1 = growthData[key].bmi['3rd']
  const bmiLine2 = growthData[key].bmi['5th']
  const bmiLine3 = growthData[key].bmi['10th']
  const bmiLine4 = growthData[key].bmi['15th']
  const bmiLine5 = growthData[key].bmi['50th']
  const bmiLine6 = growthData[key].bmi['85th']
  const bmiLine7 = growthData[key].bmi['90th']
  const bmiLine8 = growthData[key].bmi['95th']
  const bmiLine9 = growthData[key].bmi['97th']

  const title = {
    text: `中国2~18岁儿童（${sex.value}）BMI曲线图`,
    subtext: ''
  }

  const target = mainData.value[0]
  if (target) {
    title.subtext = `姓名：${target.name}  性别：${target.sex}  登记号：${target.number}`
  }

  const seriesData: any = viewlines0.value ? [
    { name: '3rd', type: 'line', data: bmiLine1, lineStyle: { type: 'dashed', width: 1, color: '#FF0000' }, itemStyle: { color: '#FF0000' }, symbolSize: pointSize },
    { name: '5th', type: 'line', data: bmiLine2, lineStyle: { type: 'dashed', width: 1, color: '#FF8C00' }, itemStyle: { color: '#FF8C00' }, symbolSize: pointSize },
    { name: '10th', type: 'line', data: bmiLine3, lineStyle: { type: 'dashed', width: 1, color: '#FFD700' }, itemStyle: { color: '#FFD700' }, symbolSize: pointSize },
    { name: '15th', type: 'line', data: bmiLine4, lineStyle: { type: 'dashed', width: 1, color: '#32CD32' }, itemStyle: { color: '#32CD32' }, symbolSize: pointSize },
    { name: '50th', type: 'line', data: bmiLine5, lineStyle: { type: 'solid', width: 1, color: '#483D8B' }, itemStyle: { color: '#483D8B' }, symbolSize: pointSize },
    { name: '85th', type: 'line', data: bmiLine6, lineStyle: { type: 'dashed', width: 1, color: '#32CD32' }, itemStyle: { color: '#32CD32' }, symbolSize: pointSize },
    { name: '90th', type: 'line', data: bmiLine7, lineStyle: { type: 'dashed', width: 1, color: '#FFD700' }, itemStyle: { color: '#FFD700' }, symbolSize: pointSize },
    { name: '95th', type: 'line', data: bmiLine8, lineStyle: { type: 'dashed', width: 1, color: '#FF8C00' }, itemStyle: { color: '#FF8C00' }, symbolSize: pointSize },
    { name: '97th', type: 'line', data: bmiLine9, lineStyle: { type: 'dashed', width: 1, color: '#FF0000' }, itemStyle: { color: '#FF0000' }, symbolSize: pointSize }
  ] : []

  const xAxisData = growthData.ages2

  const result = {
    title,
    grid: { top: '15%', right: '5%', bottom: '12%', left: '5%' },
    tooltip: {},
    toolbox: { feature: { saveAsImage: {} } },
    legend: {
      icon: 'circle',
      bottom: 30,
      data: ['3rd', '5th', '10th', '15th', '50th', '85th', '90th', '95th', '97th']
    },
    xAxis: { type: 'category', data: xAxisData, boundaryGap: false, axisLabel: { interval: 0 }, splitLine: { show: true } },
    yAxis: { type: 'value', name: 'BMI', nameTextStyle: { fontWeight: 'bold' }, splitNumber: 20, axisLine: { show: true }, min: 8, max: 33 },
    series: [],
    graphic: {
      elements: [{ type: 'text', style: { text: hospitalStr, font: '0.8em "STHeiti", sans-serif', fill: '#888' }, bottom: 10, right: 120 }]
    }
  }

  if (mainData.value.length > 0) {
    const _data1: any[] = []
    for (let i = 0; i < xAxisData.length; i++) {
      const axis = xAxisData[i]
      const target = mainData.value.find((item: any) => {
        return item.age === axis
      })
      if (target) {
        _data1.push({
          name: `${target.name}`, age: target.age, date: target.time, value: Number(target.bmi.toFixed(2)),
          label: { show: viewLabelLines2.value ? true : false },
          labelLine: { show: viewLabelLines2.value ? true : false },
        })
      } else {
        _data1.push({ value: undefined })
      }
    }
    seriesData.push(
      {
        name: `bmi数据`,
        type: 'scatter',
        data: _data1,
        labelLayout: { y: 70, align: 'center', hideOverlap: true, moveOverlap: 'shiftX' },
        labelLine: { show: true, length2: 5, lineStyle: { color: '#bbb' } },
        symbol: 'diamond', itemStyle: { color: '#555' }, xsymbolSize: function (data: any) { return 10 },
        emphasis: { focus: 'none' },
        label: {
          show: true, minMargin: 10,
          formatter: function (param: any) {
            return `${param.data.age}，BMI: ${param.data.value}（${dayjs(param.data.date).format('YYYY-MM-DD')}）`;
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
    console.error('Electron API not available')
  }
}

const onChangeSex = (v: string) => {
  setupChartOption1()
  setupChartOption2()
}

const onChangeAge = (v: string) => {
  setupChartOption1()
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
      age: growthData.ages[i + 8],
      time: Date.now(),
      number: `1234567`,
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
  if (debugging) {
    addFakeData()
  }

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

.operate-btns {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 30px;
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
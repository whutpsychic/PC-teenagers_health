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
      <Echarts :option="chartOption1" :loading="loadingChart1" />
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
      <Echarts :option="chartOption2" :loading="loadingChart2" />
    </div>
  </Block>
  <el-drawer v-model="viewDrawer" title="检查数据录入">
    <DataForm @save="onSaveDataLine" />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import Block from '@/components/Block.vue'
import DataForm from '@/components/DataForm.vue'
import Echarts from '@/components/Echart.vue'
// import { growthData } from '@/static/data'
import { growthData as growthData2 } from '@/static/data2'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { developing } from '@/appConfig'
// import { transformHWData, transformBMIData } from '@/utils/extend-data'
import { formatAgeText } from '@/utils/tool'
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

const loadingChart1 = ref<boolean>(false) // 图表1数据加载中
const loadingChart2 = ref<boolean>(false) // 图表2数据加载中

const lineWidth: number = 1 // 曲线宽度
const symbolSize: number = 0  // 曲线点尺寸

const dotSymbolSize: number = 6 // 落点菱形尺寸
const dotSymbolColor: string = `#233` // 落点菱形颜色

const timeasync = 1000  // 延迟加载

// 外部个人数据
const mainData = ref<any>([])

// 图表1的option
const chartOption1 = ref({})
// 图表2的option
const chartOption2 = ref({})

// 整理并给chart下料
const setupChartOption1 = () => {
  const key = sex.value === '男' ? 'male' : 'female'

  const heightLine1 = age.value === '1' ? growthData2[key].height['3rd'].slice(0, 37) : age.value === '2' ? growthData2[key].height['3rd'].slice(36, 218) : []
  const heightLine2 = age.value === '1' ? growthData2[key].height['10th'].slice(0, 37) : age.value === '2' ? growthData2[key].height['10th'].slice(36, 218) : []
  const heightLine3 = age.value === '1' ? growthData2[key].height['25th'].slice(0, 37) : age.value === '2' ? growthData2[key].height['25th'].slice(36, 218) : []
  const heightLine4 = age.value === '1' ? growthData2[key].height['50th'].slice(0, 37) : age.value === '2' ? growthData2[key].height['50th'].slice(36, 218) : []
  const heightLine5 = age.value === '1' ? growthData2[key].height['75th'].slice(0, 37) : age.value === '2' ? growthData2[key].height['75th'].slice(36, 218) : []
  const heightLine6 = age.value === '1' ? growthData2[key].height['90th'].slice(0, 37) : age.value === '2' ? growthData2[key].height['90th'].slice(36, 218) : []
  const heightLine7 = age.value === '1' ? growthData2[key].height['97th'].slice(0, 37) : age.value === '2' ? growthData2[key].height['97th'].slice(36, 218) : []

  const weightLine1 = age.value === '1' ? growthData2[key].weight['3rd'].slice(0, 37) : age.value === '2' ? growthData2[key].weight['3rd'].slice(36, 218) : []
  const weightLine2 = age.value === '1' ? growthData2[key].weight['10th'].slice(0, 37) : age.value === '2' ? growthData2[key].weight['10th'].slice(36, 218) : []
  const weightLine3 = age.value === '1' ? growthData2[key].weight['25th'].slice(0, 37) : age.value === '2' ? growthData2[key].weight['25th'].slice(36, 218) : []
  const weightLine4 = age.value === '1' ? growthData2[key].weight['50th'].slice(0, 37) : age.value === '2' ? growthData2[key].weight['50th'].slice(36, 218) : []
  const weightLine5 = age.value === '1' ? growthData2[key].weight['75th'].slice(0, 37) : age.value === '2' ? growthData2[key].weight['75th'].slice(36, 218) : []
  const weightLine6 = age.value === '1' ? growthData2[key].weight['90th'].slice(0, 37) : age.value === '2' ? growthData2[key].weight['90th'].slice(36, 218) : []
  const weightLine7 = age.value === '1' ? growthData2[key].weight['97th'].slice(0, 37) : age.value === '2' ? growthData2[key].weight['97th'].slice(36, 218) : []

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
    const arr = age.value === '1' ? growthData2.ages.slice(0, 37) : age.value === '2' ? growthData2.ages.slice(36, 217) : []
    return arr
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
      {
        type: 'category', data: chartXaxis.value, boundaryGap: false,
        axisLabel: {
          formatter: formatAgeText,
        },
        axisTick: {
          interval: age.value == '1' ? 0 : 1,
        },
        splitLine: { show: true, interval: age.value == '1' ? 0 : 1 },
      },
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
    seriesData.push({ name: '身高3rd', type: 'line', data: (heightLine1), yAxisIndex: 0, lineStyle: { type: 'solid', width: lineWidth, color: '#FF0000' }, itemStyle: { color: '#FF0000' }, symbolSize })
    seriesData.push({ name: '身高10th', type: 'line', data: (heightLine2), yAxisIndex: 0, lineStyle: { type: 'dashed', width: lineWidth, color: '#FF8C00' }, itemStyle: { color: '#FF8C00' }, symbolSize })
    seriesData.push({ name: '身高25th', type: 'line', data: (heightLine3), yAxisIndex: 0, lineStyle: { type: 'dashed', width: lineWidth, color: '#32CD32' }, itemStyle: { color: '#32CD32' }, symbolSize })
    seriesData.push({ name: '身高50th', type: 'line', data: (heightLine4), yAxisIndex: 0, lineStyle: { type: 'solid', width: lineWidth, color: '#483D8B' }, itemStyle: { color: '#483D8B' }, symbolSize })
    seriesData.push({ name: '身高75th', type: 'line', data: (heightLine5), yAxisIndex: 0, lineStyle: { type: 'dashed', width: lineWidth, color: '#32CD32' }, itemStyle: { color: '#32CD32' }, symbolSize })
    seriesData.push({ name: '身高90th', type: 'line', data: (heightLine6), yAxisIndex: 0, lineStyle: { type: 'dashed', width: lineWidth, color: '#FF8C00' }, itemStyle: { color: '#FF8C00' }, symbolSize })
    seriesData.push({ name: '身高97th', type: 'line', data: (heightLine7), yAxisIndex: 0, lineStyle: { type: 'solid', width: lineWidth, color: '#FF0000' }, itemStyle: { color: '#FF0000' }, symbolSize })
  }

  // 2系列标准线
  if (viewlines2.value) {
    seriesData.push({ name: '体重3rd', type: 'line', data: (weightLine1), yAxisIndex: 1, lineStyle: { type: 'solid', width: lineWidth, color: '#FF0000' }, itemStyle: { color: '#FF0000' }, symbolSize })
    seriesData.push({ name: '体重10th', type: 'line', data: (weightLine2), yAxisIndex: 1, lineStyle: { type: 'dashed', width: lineWidth, color: '#FF8C00' }, itemStyle: { color: '#FF8C00' }, symbolSize })
    seriesData.push({ name: '体重25th', type: 'line', data: (weightLine3), yAxisIndex: 1, lineStyle: { type: 'dashed', width: lineWidth, color: '#32CD32' }, itemStyle: { color: '#32CD32' }, symbolSize })
    seriesData.push({ name: '体重50th', type: 'line', data: (weightLine4), yAxisIndex: 1, lineStyle: { type: 'solid', width: lineWidth, color: '#483D8B' }, itemStyle: { color: '#483D8B' }, symbolSize })
    seriesData.push({ name: '体重75th', type: 'line', data: (weightLine5), yAxisIndex: 1, lineStyle: { type: 'dashed', width: lineWidth, color: '#32CD32' }, itemStyle: { color: '#32CD32' }, symbolSize })
    seriesData.push({ name: '体重90th', type: 'line', data: (weightLine6), yAxisIndex: 1, lineStyle: { type: 'dashed', width: lineWidth, color: '#FF8C00' }, itemStyle: { color: '#FF8C00' }, symbolSize })
    seriesData.push({ name: '体重97th', type: 'line', data: (weightLine7), yAxisIndex: 1, lineStyle: { type: 'solid', width: lineWidth, color: '#FF0000' }, itemStyle: { color: '#FF0000' }, symbolSize })
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
          symbol: 'diamond', itemStyle: { color: dotSymbolColor }, symbolSize: function (data: any) { return dotSymbolSize },
          emphasis: { focus: 'none' },
          label: {
            show: true, minMargin: 10,
            formatter: function (param: any) {
              return `${formatAgeText(param.data.age)}，测量身高: ${param.data.value}cm（${dayjs(param.data.date).format('YYYY-MM-DD')}）`;
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
          symbol: 'diamond', itemStyle: { color: dotSymbolColor }, symbolSize: function (data: any) { return dotSymbolSize },
          emphasis: { focus: 'none' },
          label: {
            show: true, minMargin: 10,
            formatter: function (param: any) {
              return `${formatAgeText(param.data.age)}，测量体重: ${param.data.value}kg（${dayjs(param.data.date).format('YYYY-MM-DD')}）`;
            },
          },
        }
      )
    }
  }

  result.series = seriesData

  chartOption1.value = result
  loadingChart1.value = false
}

// 整理并给chart下料
const setupChartOption2 = () => {
  const key = sex.value === '男' ? 'male' : 'female'

  const bmiLine1 = growthData2[key].bmi['3rd']
  const bmiLine2 = growthData2[key].bmi['5th']
  const bmiLine3 = growthData2[key].bmi['10th']
  const bmiLine4 = growthData2[key].bmi['15th']
  const bmiLine5 = growthData2[key].bmi['50th']
  const bmiLine6 = growthData2[key].bmi['85th']
  const bmiLine7 = growthData2[key].bmi['90th']
  const bmiLine8 = growthData2[key].bmi['95th']
  const bmiLine9 = growthData2[key].bmi['97th']

  const title = {
    text: `中国2~18岁儿童（${sex.value}）BMI曲线图`,
    subtext: ''
  }

  const target = mainData.value[0]
  if (target) {
    title.subtext = `姓名：${target.name}  性别：${target.sex}  登记号：${target.number}`
  }

  const seriesData: any = viewlines0.value ? [
    { name: '3rd', type: 'line', data: bmiLine1, lineStyle: { type: 'solid', width: lineWidth, color: '#FF0000' }, itemStyle: { color: '#FF0000' }, symbolSize },
    { name: '5th', type: 'line', data: bmiLine2, lineStyle: { type: 'dashed', width: lineWidth, color: '#FF8C00' }, itemStyle: { color: '#FF8C00' }, symbolSize },
    { name: '10th', type: 'line', data: bmiLine3, lineStyle: { type: 'dashed', width: lineWidth, color: '#FFD700' }, itemStyle: { color: '#FFD700' }, symbolSize },
    { name: '15th', type: 'line', data: bmiLine4, lineStyle: { type: 'dashed', width: lineWidth, color: '#32CD32' }, itemStyle: { color: '#32CD32' }, symbolSize },
    { name: '50th', type: 'line', data: bmiLine5, lineStyle: { type: 'solid', width: lineWidth, color: '#483D8B' }, itemStyle: { color: '#483D8B' }, symbolSize },
    { name: '85th', type: 'line', data: bmiLine6, lineStyle: { type: 'dashed', width: lineWidth, color: '#32CD32' }, itemStyle: { color: '#32CD32' }, symbolSize },
    { name: '90th', type: 'line', data: bmiLine7, lineStyle: { type: 'dashed', width: lineWidth, color: '#FFD700' }, itemStyle: { color: '#FFD700' }, symbolSize },
    { name: '95th', type: 'line', data: bmiLine8, lineStyle: { type: 'dashed', width: lineWidth, color: '#FF8C00' }, itemStyle: { color: '#FF8C00' }, symbolSize },
    { name: '97th', type: 'line', data: bmiLine9, lineStyle: { type: 'solid', width: lineWidth, color: '#FF0000' }, itemStyle: { color: '#FF0000' }, symbolSize }
  ] : []

  const xAxisData = growthData2.ages2

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
    xAxis: {
      type: 'category', data: xAxisData, boundaryGap: false,
      axisLabel: {
        formatter: formatAgeText,
        interval: 11,
      },
      axisTick: { interval: 1 },
      splitLine: { show: true, interval: 1 },
    },
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
        symbol: 'diamond', itemStyle: { color: dotSymbolColor }, symbolSize: function (data: any) { return dotSymbolSize },
        emphasis: { focus: 'none' },
        label: {
          show: true, minMargin: 10,
          formatter: function (param: any) {
            return `${formatAgeText(param.data.age)}，BMI: ${param.data.value}（${dayjs(param.data.date).format('YYYY-MM-DD')}）`;
          },
        },
      }
    )
  }

  result.series = seriesData

  chartOption2.value = result
  loadingChart2.value = false
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
  loadingChart1.value = true
  loadingChart2.value = true
  setTimeout(() => {
    setupChartOption1()
    setupChartOption2()
  }, timeasync)
}

const onChangeAge = (v: string) => {
  loadingChart1.value = true
  setTimeout(() => {
    setupChartOption1()
  }, timeasync)
}

const addFakeData = () => {
  // 添加24条测试数据 
  const arr = []
  for (let i = 1; i < 8; i++) {
    const h = Math.floor(Math.random() * (100 - 60 + 1)) + 60
    const w = Math.floor(Math.random() * (20 - 6 + 1)) + 6
    arr.push({
      id: i,
      name: `测试姓名`,
      sex: '男',
      age: growthData2.ages[i + 30],
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
  const target = arr[0]
  // 自动代入性别
  if (target.sex === '男') {
    sex.value = '男'
  } else if (target.sex === '女') {
    sex.value = '女'
  }
  // 自动代入年龄段
  if (target.age > 36) {
    age.value = '2'
  } else {
    age.value = '1'
  }
  // 根据过来的数据自动切换性别和年龄
  setTimeout(() => {
    setupChartOption1()
    setupChartOption2()
  }, 10)
}

onMounted(() => {
  // 
  if (developing) {
    addFakeData()
  }

  loadingChart1.value = true
  loadingChart2.value = true
  setTimeout(() => {
    setupChartOption1()
    setupChartOption2()
  }, timeasync)
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
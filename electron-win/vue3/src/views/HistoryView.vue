<template>
  <Block>
    <div class="top-searcher">
      <el-form inline label-position="right" label-width="80px" :model="searchForm">
        <el-form-item class="fi" label="姓名：">
          <el-input v-model="searchForm.name" placeholder="请输入姓名以搜索" clearable></el-input>
        </el-form-item>
        <el-form-item class="fi" label="登记号：">
          <el-input v-model="searchForm.number" placeholder="请输入登记号以搜索" clearable></el-input>
        </el-form-item>
        <el-form-item class="fi">
          <el-button type="primary" :icon="Search" @click="onSearch">搜索</el-button>
        </el-form-item>
        <el-form-item class="fi">
          <el-button type="success" :icon="Plus" @click="onAdd">新增</el-button>
        </el-form-item>
        <el-form-item class="fi">
          <el-button type="danger" :icon="Delete" @click="onBatchDelete"
            :disabled="selectedRows.length <= 0">批量删除</el-button>
        </el-form-item>
        <el-form-item class="fi">
          <el-button type="primary" :icon="View" @click="() => viewInChart()"
            :disabled="allData.length <= 0">代入曲线图</el-button>
        </el-form-item>
        <el-form-item class="fi">
          <el-button type="primary" :icon="Download" @click="onExport" :disabled="allData.length <= 0">导出数据</el-button>
        </el-form-item>
        <el-form-item class="fi" v-if="developing">
          <el-button @click="onTest">添加 24 条测试数据</el-button>
        </el-form-item>
        <el-form-item class="fi" v-if="developing">
          <el-button @click="onTest2">清空数据库</el-button>
        </el-form-item>
      </el-form>
      <el-button :icon="InfoFilled" round @click="viewBmiInfo = true"></el-button>
    </div>
    <div class="table-can">
      <el-table :data="tableData" stripe style="width: 100%" @selection-change="onChangeTableSelection">
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column prop="name" label="姓名" align="center" width="180" />
        <el-table-column prop="sex" label="性别" align="center" width="100" />
        <el-table-column prop="age" label="年龄" align="center" />
        <el-table-column prop="number" label="登记号" align="center" />
        <el-table-column prop="height" label="身高" align="center">
          <template #default="scope">
            <span>{{ scope.row.height }}cm</span>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="体重" align="center">
          <template #default="scope">
            <span>{{ scope.row.weight }}kg</span>
          </template>
        </el-table-column>
        <el-table-column prop="bmi" label="BMI" align="center">
          <template #default="scope">
            <span v-if="scope.row.bmi && (scope.row.bmi < 18.5)" style="font-weight:bold;color: #87CEFA;">
              {{ scope.row.bmi ? scope.row.bmi.toFixed(2) : '' }}
            </span>
            <span v-else-if="scope.row.bmi && (scope.row.bmi <= 23.9)" style="font-weight:bold;color: green;">
              {{ scope.row.bmi ? scope.row.bmi.toFixed(2) : '' }}
            </span>
            <span v-else-if="scope.row.bmi && (scope.row.bmi <= 27.9)" style="font-weight:bold;color: orange;">
              {{ scope.row.bmi ? scope.row.bmi.toFixed(2) : '' }}
            </span>
            <span v-else style="font-weight:bold;color: red;">
              {{ scope.row.bmi ? scope.row.bmi.toFixed(2) : '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="检查时间" align="center" width="220">
          <template #default="scope">
            <span>{{ scope.row.time ? dayjs(scope.row.time).format('YYYY-MM-DD') : ' — ' }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" min-width="100">
          <template #default="scope">
            <el-button type="text" :icon="View" title="代入曲线图" @click="() => viewInChart([scope.row])" />
            <el-button type="text" :icon="Edit" title="编辑" @click="() => onEdit(scope.row)" />
            <el-popconfirm width="220" :icon="WarningFilled" icon-color="orange"
              :title="`确定要删除 ${scope.row.name} 的数据吗？`" confirm-button-text="确定" cancel-button-text="取消"
              @confirm="() => onDelete(scope.row.id)">
              <template #reference>
                <el-button type="text" :icon="Delete" title="删除" style="color: red;" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagin-can">
      <el-pagination v-model:current-page="pagin.current" v-model:page-size="pagin.pageSize" :page-sizes="pagin.sizes"
        layout="total, sizes, prev, pager, next, jumper" :total="pagin.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </Block>
  <el-drawer v-model="viewDrawer" title="检查数据录入">
    <DataForm ref="dataForm" @save="onSaveDataLine" />
  </el-drawer>
  <el-dialog v-model="viewBmiInfo" title="BMI指数参考信息">
    <BMIboard />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Block from '@/components/Block.vue'
import DataForm from '@/components/DataForm.vue'
import BMIboard from '@/components/BMIboard.vue'
import { Search, Plus, Delete, WarningFilled, InfoFilled, Edit, View, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { growthData } from '@/static/data'
import { exportExcel } from '@/utils/excel-export'
import { developing } from '@/appConfig'

const emits = defineEmits(['viewInChart'])

const dd = 3 // bmi显示精确到小数点后几位

const formMode = ref('add') // add | edit
const dataForm = ref()
const viewDrawer = ref<boolean>(false)
const viewBmiInfo = ref<boolean>(false)

// 搜索条件
const searchForm = reactive({
  name: "",
  number: ""
})

const allData = ref<Databar[]>([]) // 所有数据
const allTableData = ref<Databar[]>([]) // 所有经筛选过的表格数据
const tableData = ref<Databar[]>([]) // 表格数据(查看用)
const selectedRows = ref<Databar[]>([]) // 表格选择项

// 分页相关
const pagin = reactive({
  current: 1,
  pageSize: 10,
  sizes: [5, 10, 20, 50],
  total: 0
})

// 根据搜索条件、分页信息计算表格渲染数据
const calcTableData = async () => {
  await loadAllData()
  const { name, number } = searchForm
  const { current, pageSize } = pagin
  const arr = allData.value.filter((item: any) => {
    return (item.name!.includes(name)) && (`${item.number!}`.includes(number))
  })
  allTableData.value = arr

  const result = arr.slice((current - 1) * pageSize, current * pageSize);
  tableData.value = result
  pagin.total = arr.length
}

const handleCurrentChange = (val: number) => {
  pagin.current = val
  calcTableData()
}

const handleSizeChange = (val: number) => {
  pagin.pageSize = val
  calcTableData()
}

const onChangeTableSelection = (rows: Databar[]) => {
  selectedRows.value = rows
}

// 查询所有数据
const loadAllData = async () => {
  const { electronAPI } = window as any
  if (electronAPI) {
    try {
      const data = await electronAPI.loadAllData();
      allData.value = data
    } catch (error) {
      console.error(error)
    }
  } else {
    console.log('Electron API not available')
  }
}

// 搜索
const onSearch = () => {
  calcTableData()
}

// 新增
const onAdd = async () => {
  formMode.value = 'add'
  viewDrawer.value = true
}

// 编辑
const onEdit = async (data: any) => {
  formMode.value = 'edit'
  viewDrawer.value = true
  setTimeout(() => {
    dataForm.value.setupData(data)
  }, 0)
}

const onSaveDataLine = async (data: Databar) => {
  const { electronAPI } = window as any
  if (electronAPI) {
    // 新增
    if (formMode.value === 'add') {
      try {
        await electronAPI.saveData({ ...data });
        viewDrawer.value = false
        ElMessage({
          message: '新增数据成功',
          type: 'success',
        })
        setTimeout(() => {
          dataForm.value.clear()
        }, 0)
        calcTableData()
      } catch (error) {
        console.error(error)
      }
    }
    // 编辑
    else if (formMode.value === 'edit') {
      try {
        await electronAPI.updateData(data.id, { ...data });
        viewDrawer.value = false
        ElMessage({
          message: '修改数据成功',
          type: 'success',
        })
        setTimeout(() => {
          dataForm.value.clear()
        }, 0)
        calcTableData()
      } catch (error) {
        console.error(error)
      }
    }
  } else {
    console.log('Electron API not available')
  }
}

// 删除(单条)
const onDelete = async (id: any) => {
  const { electronAPI } = window as any
  if (electronAPI) {
    try {
      await electronAPI.deleteData(id);
      ElMessage({
        message: '数据删除成功',
        type: 'success',
      })
      calcTableData()
    } catch (error) {
      console.error(error)
    }
  } else {
    console.log('Electron API not available')
  }
}

// 删除(批量)
const onBatchDelete = async () => {
  ElMessageBox.confirm(
    '确定要删除选中的所有数据吗？',
    '操作确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    // 确认操作
    .then(async () => {
      const { electronAPI } = window as any
      if (electronAPI) {
        try {
          const ids = selectedRows.value.map((row) => row.id)
          await electronAPI.batchDeleteData(ids)
        } catch (error) {
          console.error(error)
        }
      } else {
        console.log('Electron API not available')
      }
    }).then(() => {
      ElMessage({
        message: '数据删除成功',
        type: 'success',
      })
      calcTableData()
    })
}

// 代入到曲线图查看数据
const viewInChart = (arr?: any) => {
  // 行内查看单条数据
  if (arr instanceof Array && arr.length > 0) {
    emits('viewInChart', arr)
  } else {
    // 如果有已选中的数据
    if (selectedRows.value && selectedRows.value.length > 0) {
      // 判断是不是同一登记号
      const num = selectedRows.value[0]?.number
      const numValid = selectedRows.value.every((item) => item.number == num)

      if (numValid) {
        emits('viewInChart', selectedRows.value)
      }
      // 如果不是则拒绝操作
      else {
        ElMessage.error({ message: '非同一登记号不可同时代入' })
      }
    }
    // 否则代入全部的表格数据
    else {
      // 判断是不是同一登记号
      const num = allTableData.value[0]?.number
      const numValid = allTableData.value.every((item) => item.number == num)

      if (numValid) {
        emits('viewInChart', allTableData.value)
      }
      // 如果不是则拒绝操作
      else {
        ElMessage.error({ message: '非同一登记号不可同时代入' })
      }
    }
  }
}

onMounted(async () => {
  calcTableData()
})

const onTest = () => {
  const { electronAPI } = window as any
  // 添加20条测试数据 
  const arr = []
  const n = 24
  const splitTime = 30

  for (let i = 0; i < n; i++) {
    const h = Math.floor(Math.random() * (180 - 130 + 1)) + 130
    const w = Math.floor(Math.random() * (100 - 60 + 1)) + 60
    arr.push({
      time: (i + 1) * splitTime,
      data: {
        id: i,
        name: `测试姓名${i + 1}`,
        sex: i < 10 ? '男' : '女',
        age: growthData.ages2[i],
        time: Date.now(),
        // number: `123456${i >= 10 ? i - 10 : i}`,
        number: `1234567`,
        height: h,
        weight: w,
        bmi: (w / h * 100) / (h / 100)
      }
    })
  }

  arr.forEach((item) => {
    setTimeout(() => {
      electronAPI.saveData({ ...item.data });
    }, item.time)
  })

  setTimeout(() => {
    calcTableData()
  }, (n + 1) * splitTime)
}

const onTest2 = async () => {
  ElMessageBox.confirm(
    '清空数据？',
    '操作确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    // 确认操作
    .then(async () => {
      const { electronAPI } = window as any
      if (electronAPI) {
        try {
          const ids = allData.value.map((row) => row.id)
          await electronAPI.batchDeleteData(ids)
        } catch (error) {
          console.error(error)
        }
      } else {
        console.log('Electron API not available')
      }
    }).then(() => {
      ElMessage({
        message: '数据删除成功',
        type: 'success',
      })
      calcTableData()
    })
}

const onExport = () => {
  exportExcel(allData.value, [
    { key: 'id', label: '用户ID' },
    { key: 'name', label: '姓名' },
    { key: 'sex', label: '性别' },
    { key: 'time', label: '检查时间', isTime: true },
    { key: 'age', label: '年龄' },
    { key: 'number', label: '登记号' },
    { key: 'height', label: '身高（cm）' },
    { key: 'weight', label: '体重（kg）' },
  ], '数据列表.xlsx');
}

const refreshTable = () => {
  calcTableData()
}

defineExpose({
  refreshTable
})

</script>

<style scoped>
.top-searcher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.fi {
  margin: 0;
  margin-right: 15px;
}

.table-can {
  min-height: 500px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.pagin-can {
  display: flex;
  justify-content: center;
}
</style>

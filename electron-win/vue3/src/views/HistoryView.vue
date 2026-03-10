<template>
  <Block>
    <!-- <p>{{ result }}</p>
    <el-button @click="loadData">查询所有数据</el-button>
    <el-button @click="onAdd">添加数据</el-button>
    <el-button @click="onEdit">修改数据</el-button>
    <el-button @click="onDelete">删除数据</el-button> -->
    <div class="top-searcher">
      <el-form inline label-position="right" label-width="80px" :model="searchForm">
        <el-form-item class="fi" label="姓名：">
          <el-input v-model="searchForm.name" placeholder="请输入姓名以搜索"></el-input>
        </el-form-item>
        <el-form-item class="fi" label="登记号：">
          <el-input v-model="searchForm.number" placeholder="请输入登记号以搜索"></el-input>
        </el-form-item>
        <el-form-item class="fi">
          <el-button type="primary" :icon="Search" @click="onSearch">搜索</el-button>
        </el-form-item>
        <el-form-item class="fi">
          <el-button type="success" :icon="Plus" @click="onAdd">新增</el-button>
        </el-form-item>
        <el-form-item class="fi">
          <el-button type="danger" :icon="Delete" @click="onBatchDelete">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-can">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="name" label="姓名" align="center" width="180" />
        <el-table-column prop="sex" label="性别" align="center" width="100" />
        <el-table-column prop="time" label="检查时间" align="center" />
        <el-table-column prop="age" label="年龄" align="center" />
        <el-table-column prop="number" label="登记号" align="center" />
        <el-table-column prop="height" label="身高" align="center" />
        <el-table-column prop="weight" label="体重" align="center" />
        <el-table-column prop="bmi" label="BMI" align="center" />
      </el-table>
    </div>
    <div class="pagin-can">
      <el-pagination v-model:current-page="pagin.current" v-model:page-size="pagin.pageSize" :page-sizes="pagin.sizes"
        :size="pagin.size" layout="total, sizes, prev, pager, next, jumper" :total="pagin.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </Block>
  <el-drawer v-model="viewDrawer" title="检查数据录入">
    <DataForm ref="dataForm" @save="onSaveDataLine" />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Block from '@/components/Block.vue'
import DataForm from '@/components/DataForm.vue'
import { Search, Plus, Delete } from '@element-plus/icons-vue'

const result = ref()
const formMode = ref('add') // add | edit
const dataForm = ref()
const viewDrawer = ref<boolean>(false)

// 搜索条件
const searchForm = reactive({
  name: "",
  number: ""
})

const allData = ref<Databar[]>([]) // 所有数据
const tableData = ref<Databar[]>([]) // 表格数据（展示用）

// 分页相关
const pagin = reactive({
  current: 1,
  pageSize: 10,
  sizes: [10, 20, 50, 100],
  size: 10,
  total: 0
})

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

// 查询所有数据
const loadData = async () => {
  const { electronAPI } = window as any
  if (electronAPI) {
    try {
      const data = await electronAPI.loadAllData();
      result.value = JSON.stringify(data, null, 2);
    } catch (error) {
      result.value = `Error: ${error}`;
    }
  } else {
    result.value = 'Electron API not available';
  }
}

// 搜索
const onSearch = () => {

}

// 新增
const onAdd = async () => {
  formMode.value = 'add'
  viewDrawer.value = true
}

// 编辑
const onEdit = async (data: any) => {
  formMode.value = 'edit'
  console.log(data)
  // viewDrawer.value = true

}

const onSaveDataLine = async (data: Databar) => {
  console.log(data)
  const { electronAPI } = window as any
  if (electronAPI) {
    // 新增
    if (formMode.value === 'add') {
      try {
        const data = await electronAPI.saveData({ name: 'aaaaaaaaa', value: 89000 });
        result.value = JSON.stringify(data, null, 2);
        loadData()
      } catch (error) {
        result.value = `Error: ${error}`;
      }
    }
    // 编辑
    else if (formMode.value === 'edit') {
      try {
        const data = await electronAPI.updateData(1, { name: 'aaaaaaaaa', value: 89000 });
        result.value = JSON.stringify(data, null, 2);
        loadData()
      } catch (error) {
        result.value = `Error: ${error}`;
      }
    }
  } else {
    result.value = 'Electron API not available';
  }
}

// 删除(单条)
const onDelete = async () => {
  const { electronAPI } = window as any

  if (electronAPI) {
    try {
      const data = await electronAPI.deleteData(1);
      result.value = JSON.stringify(data, null, 2);
      loadData()
    } catch (error) {
      result.value = `Error: ${error}`;
    }
  } else {
    result.value = 'Electron API not available';
  }
}

// 删除(批量)
const onBatchDelete = async () => {
  const { electronAPI } = window as any

  if (electronAPI) {
    try {
      const data = await electronAPI.deleteData(1);
      result.value = JSON.stringify(data, null, 2);
      loadData()
    } catch (error) {
      result.value = `Error: ${error}`;
    }
  } else {
    result.value = 'Electron API not available';
  }
}

onMounted(() => {
  loadData()
  setTimeout(() => {
    console.log(result.value)
  }, 1000)
})

</script>

<style scoped>
.top-searcher {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px 0;
}

.fi {
  margin: 0;
  margin-right: 15px;
}

.table-can {
  min-height: 600px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.pagin-can {
  display: flex;
  justify-content: center;
}
</style>

<template>
  <div ref="cc" style="width: 100%;height:100%;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts';

const props = defineProps({
  option: { type: Object, default: () => ({}) }
})

const cc = ref()
const chartInstance = ref<any>(null)

onMounted(() => {
  chartInstance.value = echarts.init(cc.value)
  chartInstance.value.setOption(props.option)
  // window.addEventListener('resize', () => {
  //   chartInstance.value?.resize()
  // })
})

watch(() => props.option, (newv, oldv) => {
  // chartInstance.value.clear()
  chartInstance.value.setOption(newv, true)
})

</script>

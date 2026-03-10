<template>
  <div class="block-can">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.block-can {
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  /* 添加阴影效果 */
  margin: 0 4px 16px 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}


</style>
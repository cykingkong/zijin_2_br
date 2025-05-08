<template>

  <div class="commodities-content">

    <div class="th flex px-12">
      <div class=" w-40% flex-shrink text-align-left "> 名称代码</div>
      <div class=" flex-1 text-align-center">价格</div>
      <div class=" flex-1 text-align-right">剩余手数</div>
    </div>
    <div class="empty w-full mt-40 text-bluegray text-align-center"> 已无更多～</div>




  </div>
</template>
<route lang="json5">
  {
    name: 'commodities',
    path: '/quotes/commodities/:commodities?', // 保留可选参数保证路由唯一性
    meta: {
      title: 'commodities',
      i18n: 'menus.commodities'
    }
  }
</route>
<script setup lang="ts">
import { ref, reactive } from "vue"





</script>

<style lang="less" scoped></style>

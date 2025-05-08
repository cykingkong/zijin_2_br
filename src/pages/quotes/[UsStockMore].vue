<template>

  <div class="commodities-content">

    <div class="th flex px-12">
      <div class=" w-40% flex-shrink text-align-left "> 名称代码</div>
      <div class=" flex-1 text-align-center">价格</div>
      <div class=" flex-1 text-align-right">剩余手数</div>
    </div>

    <div class="item flex p-12 flex-wrap" v-for="i in 10" :key="i">
      <div class=" w-40% flex-shrink text-align-left ">
        XPFT
      </div>
      <div class=" flex-1 text-align-center up">0%</div>
      <div class=" flex-1 text-align-right">0</div>
      <div class="w-full font-size-12 text-blueGray mt-6">
        REKSA DANA INDEKS PINNACLE FTSE ETF PT PINNACLE PERSADA INVESTAMA
      </div>
    </div>
    <div class="empty w-full mt-40 text-bluegray text-align-center" v-if="false"> 已无更多～</div>




  </div>
</template>
<route lang="json5">
  {
    name: 'UsStockMore',
    path: '/quotes/UsStockMore/:UsStockMore?', // 保留可选参数保证路由唯一性
    meta: {
      title: 'UsStockMore',
      i18n: 'menus.UsStockMore'
    }
  }
</route>
<script setup lang="ts">
import { ref, reactive } from "vue"





</script>

<style lang="less" scoped>
.item {
  border-bottom: 1px solid var(--border_color)
}
</style>

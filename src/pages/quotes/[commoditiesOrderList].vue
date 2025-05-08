<template>
  <div class="commodities-order-list px-12 pt-12 pb-30">
    <orderItem></orderItem>
    <orderItem></orderItem>





  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import orderItem from "./component/commoditiesOrderItem/order-item.vue";



</script>
<route lang="json5">
    {
      name: 'commoditiesOrderList',
      path: '/quotes/commoditiesOrderList/:commoditiesOrderList?', 
      meta: {
        title: 'commoditiesOrderList',
        i18n: 'menus.commoditiesOrderList'
      },
    }
</route>
<style lang="less" scoped>
.commodities-order-list {}
</style>

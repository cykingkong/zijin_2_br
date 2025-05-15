<template>
  <div class="user-balance-content w-full flex py-12 gap-48 items-center">

    <div class="w-200 flex items-center gap-8">
      <img :src="data.baseAsset.symbolLogo" v-if="data.baseAsset && data.baseAsset.symbolLogo" alt=""
        class="w-40 rounded-full">

      <div class="price">{{ data.baseAsset.baseSymbol }} {{ data.baseAsset ?
        addCommasToNumber(data.baseAsset.baseBalance) : '' }}</div>

    </div>

    <div class="flex-1">
      <!-- <van-button type="primary" block @click="handleClickSubmit" class="h-32!">
        资产中心</van-button> -->

    </div>



  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { addCommasToNumber } from '@/utils/tool'
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      baseAsset: {

      }
    }
  }
})



</script>
<style lang="less" scoped></style>

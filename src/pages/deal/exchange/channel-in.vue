<template>
  <div class="exchange-in-content p-12">
    <div class="t font-size-12">请选择充值币种</div>
    <div class="flex w-full gap-12 mt-12">
      <div class="channel-item  rounded-10 flex-1 text-align-center py-12" @click="toUrl('/deal/exchange/charge-bank')">
        <img src="@/assets/bank_icon.png" alt="" class="block w-55px h-55px mx-auto">

        <div class="font-size-12 mt-12">银行入款</div>
      </div>
      <div class="channel-item  rounded-10 flex-1 text-align-center py-12">
        <img src="@/assets/trx_icon.png" alt="" class="block w-55px h-55px  mx-auto">
        <div class="font-size-12 mt-12">USDT充值</div>
      </div>
    </div>



  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
const router = useRouter()
const toUrl = (url) => {
  router.push({ path: url })
}



</script>
<style lang="less" scoped>
.channel-item {
  border: 1px solid #1678FF;
}
</style>

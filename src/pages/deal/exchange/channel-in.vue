<template>
  <div class="exchange-in-content p-12">
    <div class="flex justify-between items-center font-size-12">
      {{ t("Please select the payment currency") }}
      <img
        src="@/assets/image/deliveryContract/Group1663.png"
        alt=""
        class="w-24 h-18 pr-6"
        @click="toUrl('/deal/orderList?type=1')"
      />
    </div>
    <div class="flex w-full gap-12 mt-12">
      <div
        class="channel-item rounded-10 flex-1 text-align-center py-12"
        @click="toUrl('/deal/exchange/charge-bank')"
      >
        <img
          src="@/assets/bank_icon.png"
          alt=""
          class="block w-55px h-55px mx-auto"
        />

        <div class="font-size-12 mt-12">{{ t("Bank Deposit") }}</div>
      </div>
      <div
        class="channel-item rounded-10 flex-1 text-align-center py-12"
        @click="toUrl('/deal/exchange/usdt-in')"
      >
        <img
          src="@/assets/trx_icon.png"
          alt=""
          class="block w-55px h-55px mx-auto"
        />
        <div class="font-size-12 mt-12">{{ t("USDT Top-up") }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
const router = useRouter();
const toUrl = (url: string) => {
  router.push(url);
};
const { t } = useI18n();
</script>
<style lang="less" scoped>
.channel-item {
  border: 1px solid #1678ff;
}
</style>
<route lang="json5">
{
  name: 'exchange-in',
  meta: {
    i18n: 'deal.quickRecharge',
  },
}
</route>
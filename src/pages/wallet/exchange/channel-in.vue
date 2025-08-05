<template>
  <div class="exchange-in-content py-16 px-24">
    <!-- <div class="flex justify-between items-center font-size-12">
      {{ t("Please select the payment currency") }}
      <img src="@/assets/image/deliveryContract/Group1663.png" alt="" class="w-24 h-18 pr-6"
        @click="toUrl('/wallet/orderList?type=1')" />
    </div>
    <div class="flex w-full gap-12 mt-12">
      <div class="channel-item rounded-10 flex-1 text-align-center py-12" @click="toUrl('/deal/exchange/charge-bank')">
        <img src="@/assets/bank_icon.png" alt="" class="block w-55px h-55px mx-auto" />

        <div class="font-size-12 mt-12">{{ t("Bank Deposit") }}</div>
      </div>
      <div class="channel-item rounded-10 flex-1 text-align-center py-12" @click="toUrl('/wallet/exchange/usdt-in')">
        <img src="@/assets/trx_icon.png" alt="" class="block w-55px h-55px mx-auto" />
        <div class="font-size-12 mt-12">{{ t("USDT Top-up") }}</div>
      </div>
    </div> -->
    <div class="radio-group flex flex-col gap-16px mb-16px" v-for="(item, index) in payTypeList" :key="index">
      <div class="label text-#0F172A text-18px font-bold">
        {{ item.name }}
      </div>
      <item v-for="(listItem, key) in item.list" :key="key">
        <template #left>
          <div class="left h-46px flex items-center gap-16px">
            <div class="img rounded-full w-40px h-40px overflow-hidden bg-#F8F9FD"></div>
            <div class="info h-46px flex flex-col justify-between ">
              <div class="name text-#0F172A text-14px font-bold">{{ listItem.title }}</div>
              <div class="name2 text-#64748B text-12px">{{ listItem.tips }}</div>
            </div>
          </div>
        </template>
        <template #right>
          <div class="radio border-solid border-1px border-#D1D5DB rounded-full w-20px h-20px relative flex-shrink-0"
            :class="payType == listItem.value ? 'radio-active' : ''">
          </div>
        </template>
      </item>
    </div>
    <BottomButton :button-text="`Confirm`" @click="handleBuyClick" />
  </div>
</template>
<script setup lang="ts">
import BottomButton from '../component/bottom-button.vue'
import { ref, reactive } from "vue";
import item from '../component/item.vue'
const router = useRouter();
const toUrl = (url: string) => {
  router.push(url);
};
const payType = ref('1')
const payTypeList = [
  {
    name: '银行卡支付',
    list: [
      {
        title: 'Bank of America',
        tips: '金额范围: 100 ~ 100000',
        value: '1',
        radio: false,
      },
      {
        title: 'Bank of America',
        tips: '金额范围: 100 ~ 100000',
        value: '2',
        radio: false,
      },
    ]
  },
  {
    name: '数字货币支付',
    list: [
      {
        title: 'USDT-TRC20',
        tips: '金额范围: 100 ~ 100000',
        value: '1',
        radio: false,
      },
      {
        title: '支付宝',
        tips: '金额范围: 100 ~ 100000',
        value: '2',
        radio: false,
      },
    ]
  },
]
const { t } = useI18n();
</script>
<style lang="less" scoped>
.channel-item {
  border: 1px solid #1678ff;
}

.radio-active {
  border-color: #6B39F4 !important;
  position: relative;
}

.radio-active::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 13.33px;
  height: 13.33px;
  background-color: #6B39F4;
  border-radius: 50%;
  transform: translate(-50%, -50%);
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
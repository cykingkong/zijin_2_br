<template>
  <div class="exchange-in-content py-16 px-24 pb-95px">
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
    <div
      class="radio-group flex flex-col gap-16px mb-16px"
      v-for="(item, index) in payTypeList"
      :key="index"
    >
      <div class="label text-#0F172A text-18px font-bold">
        {{ item.name }}
      </div>
      <div
        class="item w-full rounded-12px border-1px border-solid border-#E2E8F0 min-h-78px flex items-center justify-between px-16px"
        v-for="(listItem, key) in item.list"
        :key="key"
        @click="payType = listItem.id"
      >
        <div class="left h-46px flex items-center gap-16px">
          <div
            class="img rounded-full w-40px h-40px overflow-hidden bg-#F8F9FD"
          >
            <img
              :src="listItem.logo"
              alt=""
              class="w-full h-full object-cover"
            />
          </div>
          <div class="info h-46px flex flex-col justify-between">
            <div class="name text-#0F172A text-14px font-bold">
              {{ listItem.name }}
            </div>
            <div class="name2 text-#64748B text-12px">
              金额范围: MX${{ listItem.min_amount }} ~ MX${{
                listItem.max_amount
              }}
            </div>
          </div>
        </div>

        <div
          class="radio border-solid border-1px border-#D1D5DB rounded-full w-20px h-20px relative flex-shrink-0"
          :class="payType == listItem.id ? 'radio-active' : ''"
        ></div>
      </div>
    </div>

    <BottomButton :button-text="`Confirm`" @click="handleBuyClick" />
  </div>
</template>
<script setup lang="ts">
import BottomButton from "../component/bottom-button.vue";
import { ref, reactive } from "vue";
import item from "@/components/item.vue";
const router = useRouter();
const toUrl = (url: string) => {
  router.push(url);
};
import { depositMethod } from "@/api/billing";

const payType = ref("1");
const payTypeList = ref([]);
const { t } = useI18n();
const getMethod = async () => {
  try {
    const { data, code } = await depositMethod({
      type: "auto", //bank,crypto,auto
    });

    if (code == 200) {
      payTypeList.value = [
        {
          name: t("Bank card recharge"),
          list: data.bank,
        },
        {
          name: t("Digital currency recharge"),
          list: data.crypto,
        },
      ];
    }
  } catch (error) {
    console.log(error);
  }
};

const handleBuyClick = () => {
  let item = payTypeList.value.find((item) =>
    item.list.find((listItem) => listItem.id == payType.value)
  );
  let payTypeItem = item.list.find((listItem) => listItem.id == payType.value);
  localStorage.setItem("payType", JSON.stringify(payTypeItem));
  router.push(`/wallet/exchange/cashierCenter?payType=${payType.value}`);
};

onMounted(() => {
  getMethod();
});
</script>
<style lang="less" scoped>
.channel-item {
  border: 1px solid #1678ff;
}

.radio-active {
  border-color: #6b39f4 !important;
  position: relative;
}

.radio-active::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 13.33px;
  height: 13.33px;
  background-color: #6b39f4;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
</style>
<route lang="json5">
{
  name: 'Deposit',
  meta: {
    i18n: 'Deposit',
  },
}
</route>
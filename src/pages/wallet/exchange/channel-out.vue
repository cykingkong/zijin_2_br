<template>
  <div class="exchange-in-content py-16 px-24 pb-[95px]">
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
    <div class="radio-group flex flex-col gap-[16px] mb-[16px]" v-for="(item, index) in payTypeList" :key="index">
      <div class="label text-[#0F172A] text-[18px] font-bold">
        {{ item.name }}
      </div>
      <div
        class="item w-full rounded-[12px] border border-solid border-[#E2E8F0] min-h-[78px] flex items-center justify-between px-[16px]"
        v-for="(listItem, key) in item.list" :key="key" @click="payType = listItem.id">
        <div class="left h-[46px] flex items-center gap-[16px] ">
          <div class="img rounded-full flex items-center justify-center w-[40px] h-[40px] overflow-hidden bg-[#F8F9FD]">
            <!-- <img :src="listItem.logo" alt="" class="w-full h-full object-cover" /> -->
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_89_627)">
                <path
                  d="M15.4224 3.49854C15.2466 3.17201 14.9703 2.75219 14.5433 2.42566C14.3675 2.26239 14.1414 2.14577 13.84 2.09913C13.6139 2.05248 13.3879 1.98251 13.1367 1.98251H13.0864C12.785 1.98251 12.2073 2.02915 11.8808 2.4723C11.705 2.63557 11.6547 2.89213 11.705 3.17201C11.7552 3.38192 11.8808 3.54519 12.1069 3.59184C12.1069 3.59184 12.1571 3.59184 12.2827 3.63848C12.2324 3.63848 12.1571 3.7551 12.1571 3.7551C12.0315 3.91837 11.7552 4.17493 10.9514 4.17493H10.9012C10.4993 4.17493 10.1477 4.05831 9.74579 3.59184C9.51973 3.26531 9.34391 2.77551 9.34391 1.93586C9.34391 1.51604 9.29367 1.11953 9.16808 0.862974C9.11785 0.653061 8.94202 0.489796 8.7662 0.373178C8.64061 0.25656 8.46478 0.209913 8.23872 0.163265C8.01267 0 7.66102 0 7.38472 0C7.03307 0 6.85725 0.0466472 6.75678 0.209913C6.75678 0.209913 6.75678 0.25656 6.70654 0.25656H6.48048C6.30466 0.25656 6.12884 0.303207 5.95301 0.303207C5.60136 0.349854 5.42554 0.466472 5.19948 0.629738C5.14924 0.676385 4.97342 0.83965 4.89807 1.04956C4.84783 1.21283 4.89807 1.32945 4.9483 1.37609C4.9483 1.37609 4.9483 1.42274 4.99854 1.42274C5.12413 1.30612 5.29995 1.25948 5.57625 1.25948C5.92789 1.25948 6.45537 1.42274 6.60607 1.6793C6.83213 2.05248 6.7819 2.33236 6.73166 2.70554C6.60607 3.61516 6.20419 4.10496 5.45066 4.19825H5.04877C4.47107 4.19825 4.06918 4.03499 3.89336 3.70845C3.76777 3.59184 3.76777 3.54519 3.76777 3.54519C3.76777 3.54519 3.818 3.54519 3.89336 3.49854C4.11942 3.38192 4.24501 3.28863 4.29524 3.07872C4.34548 2.8688 4.29524 2.58892 4.11942 2.37901C3.818 2.09913 3.41612 1.95918 2.91377 1.95918C2.61235 1.95918 2.38629 2.00583 2.21047 2.0758C1.50717 2.23907 1.00482 2.65889 0.602933 3.47522C0.301521 4.01166 0.0754609 4.75802 0.0252254 5.50437C-0.02501 6.25073 -0.02501 6.90379 0.0252254 7.48688C0.150814 8.44315 0.326638 9.04956 0.552698 9.63265C0.778758 10.2857 1.13041 10.8688 1.48205 11.4052C1.60764 11.6152 1.65788 11.7318 1.70811 11.7784C1.75835 11.7318 1.8337 11.6618 1.88394 11.5685C2.00953 11.4519 2.41141 10.9854 2.51188 10.8222C2.68771 10.7055 2.86353 10.4023 2.964 10.1691L3.01424 10.0525L3.13982 10.1691C3.26541 10.2857 3.31565 10.379 3.31565 10.5423C3.31565 10.7055 3.26541 10.8688 3.19006 11.1953C3.06447 11.5219 2.88865 11.9417 2.66259 12.2682C2.66259 12.3149 2.61235 12.3848 2.61235 12.3848C2.48676 12.5948 2.43653 12.7114 2.48676 12.758C2.537 12.758 2.71282 12.7114 2.88865 12.5481C3.11471 12.4548 3.51659 12.1283 4.01895 11.4286C4.42083 10.9388 4.72224 10.4023 4.99854 9.81924L5.04877 9.70262L5.17436 9.74927C5.2246 9.74927 5.29995 9.79592 5.29995 9.86589C5.35019 9.98251 5.35019 10.0758 5.35019 10.2391C5.29995 10.6122 5.04877 11.1487 4.89807 11.5219C4.59665 12.1749 4.01895 12.9213 3.61706 13.4577C3.61706 13.4577 3.49147 13.5743 3.49147 13.621C3.54171 13.6676 3.61706 13.7376 3.71753 13.7843L3.89336 13.9009C4.47107 14.3207 4.99854 14.7172 5.67672 15.0204C6.20419 15.3003 7.28425 15.8367 7.98755 15.9767C8.69084 15.8134 9.77091 15.277 10.2984 15.0204C11.0017 14.6472 11.504 14.3207 12.0817 13.9009L12.2576 13.7843C12.3832 13.7376 12.4334 13.621 12.4836 13.621C12.4836 13.621 12.4334 13.5743 12.4334 13.5044L12.3832 13.4577C11.9813 12.9213 11.4036 12.1749 11.1021 11.5219C10.9263 11.1487 10.7003 10.5656 10.65 10.2391C10.65 10.0758 10.65 9.95918 10.7003 9.86589C10.7003 9.81924 10.7505 9.81924 10.8259 9.74927C10.8761 9.70262 10.9514 9.70262 10.9514 9.70262L11.0017 9.81924C11.3031 10.4023 11.6296 10.8921 11.9813 11.4286C12.5087 12.1283 12.9106 12.4548 13.0864 12.5481C13.2623 12.6647 13.4381 12.758 13.4883 12.758H13.5637C13.6139 12.7114 13.5637 12.5948 13.4381 12.3848C13.4381 12.3382 13.3879 12.2682 13.3879 12.2682C13.1618 11.895 12.986 11.5219 12.8604 11.1953C12.7348 10.8688 12.6846 10.7055 12.6846 10.5423C12.6846 10.379 12.7348 10.2157 12.8604 10.1691L12.986 10.1224L13.0362 10.2391C13.1618 10.449 13.3879 10.7755 13.4381 10.8921C13.5637 11.0554 13.9656 11.4752 14.066 11.6385L14.2419 11.8017C14.2921 11.7551 14.3675 11.6385 14.4679 11.4752V11.4286C14.8196 10.8921 15.0959 10.309 15.3973 9.65598C15.6233 9.00292 15.7992 8.46647 15.9248 7.5102C15.975 6.92711 16.0503 6.27405 15.9248 5.5277C15.9248 4.78134 15.774 4.03499 15.4224 3.49854Z"
                  fill="url(#paint0_radial_89_627)" />
              </g>
              <defs>
                <radialGradient id="paint0_radial_89_627" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(0.438977 2.88211) scale(17.6636 16.4019)">
                  <stop stop-color="#20C4F4" />
                  <stop offset="0.304" stop-color="#09B4F0" />
                  <stop offset="0.5" stop-color="#00AEEF" />
                  <stop offset="0.8" stop-color="#0092C8" />
                  <stop offset="1" stop-color="#006E98" />
                </radialGradient>
                <clipPath id="clip0_89_627">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>

          </div>
          <div class="info  flex flex-col justify-between items-center">
            <div class="name text-[#0F172A] text-[14px] font-bold">
              {{ listItem.method }}
            </div>
            <!-- <div class="name2 text-[#64748B] text-[12px]">
              {{ t("Amount range") }}: ₹{{ listItem.min_amount }} ~ ₹{{
                listItem.max_amount
              }}
            </div> -->
          </div>
        </div>

        <div
          class="radio flex items-center justify-center border-solid border border-[#D1D5DB] rounded-full w-[20px] h-[20px] relative flex-shrink-0"
          :class="payType == listItem.id ? 'radio-active' : ''">
          <svg width="10" v-if="payType == listItem.id" height="10" viewBox="0 0 10 10" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M8.33341 2.70825L3.75008 7.29159L1.66675 5.20825" stroke="white" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        </div>
      </div>
    </div>

    <BottomButton :button-text="t(`Confirm`)" color="#1b1b1b" @click="handleBuyClick" />
  </div>
</template>
<script setup lang="ts">
import BottomButton from "@/components/bottom-button.vue";
import { ref, reactive } from "vue";
import item from "@/components/item.vue";
const router = useRouter();
const toUrl = (url: string) => {
  router.push(url);
};
import { depositMethod } from "@/api/billing";

const payType = ref<any>("1");
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
          name: t("Bank card recharge Type"),
          list: data.methods,
        },
        // {
        //   name: t("Digital currency recharge"),
        //   list: data.crypto,
        // },
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
  if (payType.value == 99) {
    setTimeout(() => {
      window.location.href = payTypeItem.entrance;
    }, 40);
    return;
  }
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
  border-color: #F47C3E !important;
  position: relative;
  background: #F47C3E;
}

.radio-active::after {}
</style>
<route lang="json5">
{
  name: 'Deposit',
  meta: {
    i18n: 'Deposit',
  },
}
</route>
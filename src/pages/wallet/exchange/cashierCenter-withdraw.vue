<!-- 提现 -->
<template>
  <div class="cashier-center-content px-12 w-full pb-120">
    <VanNavBar title="" :fixed="true" clickable :left-arrow="true" @click-left="onBack" z-index="999">
      <template #title>
        <div class="text-[16px] font-bold color-[#0F172A]">
          {{ t("Withdraw") }}
        </div>
      </template>
    </VanNavBar>
    <div class="info mt-32" v-if="info">
      <div class="min-count text-[#0F172A] font-size-[40px] mx-a text-center mt-[57px] font-bold overflow-y-auto">
        ₹ {{ count }}
      </div>
      <div class="min-count-fee text-[#64748B] font-size-[14px] mx-a text-center mt-[6px] font-bold overflow-y-auto">
        {{ t("Withdraw fee") }} ₹{{ fee }}
      </div>
      <div class="mt-[30px]">
        <item class="mt-[62px]">
          <template #left>
            <div class="left h-[46px] flex items-center gap-[16px]">
              <div class="w-40 h-40 flex items-center justify-center flex-shrink-0 block bg-[#F8F9FD] rounded-full"
                alt="">
                <svg class="w-16 h-16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15.4223 3.49854C15.2465 3.17201 14.9702 2.75219 14.5432 2.42566C14.3673 2.26239 14.1413 2.14577 13.8399 2.09913C13.6138 2.05248 13.3877 1.98251 13.1366 1.98251H13.0863C12.7849 1.98251 12.2072 2.02915 11.8807 2.4723C11.7049 2.63557 11.6546 2.89213 11.7049 3.17201C11.7551 3.38192 11.8807 3.54519 12.1067 3.59184C12.1067 3.59184 12.157 3.59184 12.2826 3.63848C12.2323 3.63848 12.157 3.7551 12.157 3.7551C12.0314 3.91837 11.7551 4.17493 10.9513 4.17493H10.9011C10.4992 4.17493 10.1476 4.05831 9.74567 3.59184C9.51961 3.26531 9.34378 2.77551 9.34378 1.93586C9.34378 1.51604 9.29355 1.11953 9.16796 0.862974C9.11772 0.653061 8.9419 0.489796 8.76608 0.373178C8.64049 0.25656 8.46466 0.209913 8.2386 0.163265C8.01254 0 7.6609 0 7.3846 0C7.03295 0 6.85713 0.0466472 6.75666 0.209913C6.75666 0.209913 6.75666 0.25656 6.70642 0.25656H6.48036C6.30454 0.25656 6.12871 0.303207 5.95289 0.303207C5.60124 0.349854 5.42542 0.466472 5.19936 0.629738C5.14912 0.676385 4.9733 0.83965 4.89794 1.04956C4.84771 1.21283 4.89794 1.32945 4.94818 1.37609C4.94818 1.37609 4.94818 1.42274 4.99841 1.42274C5.124 1.30612 5.29983 1.25948 5.57612 1.25948C5.92777 1.25948 6.45524 1.42274 6.60595 1.6793C6.83201 2.05248 6.78177 2.33236 6.73154 2.70554C6.60595 3.61516 6.20407 4.10496 5.45053 4.19825H5.04865C4.47094 4.19825 4.06906 4.03499 3.89323 3.70845C3.76765 3.59184 3.76765 3.54519 3.76765 3.54519C3.76765 3.54519 3.81788 3.54519 3.89323 3.49854C4.11929 3.38192 4.24488 3.28863 4.29512 3.07872C4.34535 2.8688 4.29512 2.58892 4.11929 2.37901C3.81788 2.09913 3.416 1.95918 2.91364 1.95918C2.61223 1.95918 2.38617 2.00583 2.21035 2.0758C1.50705 2.23907 1.0047 2.65889 0.602811 3.47522C0.301398 4.01166 0.0753388 4.75802 0.0251034 5.50437C-0.0251321 6.25073 -0.0251321 6.90379 0.0251034 7.48688C0.150692 8.44315 0.326516 9.04956 0.552576 9.63265C0.778635 10.2857 1.13028 10.8688 1.48193 11.4052C1.60752 11.6152 1.65776 11.7318 1.70799 11.7784C1.75823 11.7318 1.83358 11.6618 1.88382 11.5685C2.0094 11.4519 2.41129 10.9854 2.51176 10.8222C2.68758 10.7055 2.86341 10.4023 2.96388 10.1691L3.01411 10.0525L3.1397 10.1691C3.26529 10.2857 3.31553 10.379 3.31553 10.5423C3.31553 10.7055 3.26529 10.8688 3.18994 11.1953C3.06435 11.5219 2.88853 11.9417 2.66247 12.2682C2.66247 12.3149 2.61223 12.3848 2.61223 12.3848C2.48664 12.5948 2.43641 12.7114 2.48664 12.758C2.53688 12.758 2.7127 12.7114 2.88853 12.5481C3.11459 12.4548 3.51647 12.1283 4.01882 11.4286C4.42071 10.9388 4.72212 10.4023 4.99841 9.81924L5.04865 9.70262L5.17424 9.74927C5.22447 9.74927 5.29983 9.79592 5.29983 9.86589C5.35006 9.98251 5.35006 10.0758 5.35006 10.2391C5.29983 10.6122 5.04865 11.1487 4.89794 11.5219C4.59653 12.1749 4.01882 12.9213 3.61694 13.4577C3.61694 13.4577 3.49135 13.5743 3.49135 13.621C3.54159 13.6676 3.61694 13.7376 3.71741 13.7843L3.89323 13.9009C4.47094 14.3207 4.99841 14.7172 5.67659 15.0204C6.20407 15.3003 7.28413 15.8367 7.98743 15.9767C8.69072 15.8134 9.77079 15.277 10.2983 15.0204C11.0016 14.6472 11.5039 14.3207 12.0816 13.9009L12.2574 13.7843C12.383 13.7376 12.4333 13.621 12.4835 13.621C12.4835 13.621 12.4333 13.5743 12.4333 13.5044L12.383 13.4577C11.9811 12.9213 11.4034 12.1749 11.102 11.5219C10.9262 11.1487 10.7001 10.5656 10.6499 10.2391C10.6499 10.0758 10.6499 9.95918 10.7001 9.86589C10.7001 9.81924 10.7504 9.81924 10.8257 9.74927C10.876 9.70262 10.9513 9.70262 10.9513 9.70262L11.0016 9.81924C11.303 10.4023 11.6295 10.8921 11.9811 11.4286C12.5086 12.1283 12.9105 12.4548 13.0863 12.5481C13.2621 12.6647 13.438 12.758 13.4882 12.758H13.5636C13.6138 12.7114 13.5636 12.5948 13.438 12.3848C13.438 12.3382 13.3877 12.2682 13.3877 12.2682C13.1617 11.895 12.9859 11.5219 12.8603 11.1953C12.7347 10.8688 12.6844 10.7055 12.6844 10.5423C12.6844 10.379 12.7347 10.2157 12.8603 10.1691L12.9859 10.1224L13.0361 10.2391C13.1617 10.449 13.3877 10.7755 13.438 10.8921C13.5636 11.0554 13.9654 11.4752 14.0659 11.6385L14.2417 11.8017C14.292 11.7551 14.3673 11.6385 14.4678 11.4752V11.4286C14.8195 10.8921 15.0957 10.309 15.3972 9.65598C15.6232 9.00292 15.799 8.46647 15.9246 7.5102C15.9749 6.92711 16.0502 6.27405 15.9246 5.5277C15.9246 4.78134 15.7739 4.03499 15.4223 3.49854Z"
                    fill="url(#paint0_radial_49_714)" />
                  <defs>
                    <radialGradient id="paint0_radial_49_714" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(0.438855 2.88211) scale(17.6636 16.4019)">
                      <stop stop-color="#20C4F4" />
                      <stop offset="0.304" stop-color="#09B4F0" />
                      <stop offset="0.5" stop-color="#00AEEF" />
                      <stop offset="0.8" stop-color="#0092C8" />
                      <stop offset="1" stop-color="#006E98" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
              <div class="info h-[46px] flex flex-col justify-between">
                <div class="name text-[#0F172A] text-[14px] font-bold">
                  {{ info.address.receiveName }}
                </div>
                <div class="name2 text-[#64748B] text-[12px]">
                  {{ info.address.bankName }}
                </div>
              </div>
            </div>
          </template>
          <template #right>
            <div class="color-[#FFCC00] text-[14px] font-bold text-nowrap" @click="onSelect">
              {{ t("Picker") }}
            </div>
          </template>
        </item>
        <div class="tips mt-[45px]">
          <div class="t-title mb-[12px] color-[#FF383C80] font-bold text-[18px]">
            {{ t("Pay attention") }}
          </div>
          <div class="l flex items-start color-[#64748B] text-[14px] gap-[8px] pl-[6px]">
            <div class="dot w-4 h-4 rounded-full bg-[#64748B]"></div>
            {{ t("Withdrawal time on business days is") }}
            {{ withdrwaInfo?.withdrawHour?.[0] }} AM ~
            {{ withdrwaInfo?.withdrawHour?.[1] }} PM
          </div>
          <div class="l flex items-start color-[#64748B] text-[14px] gap-[8px] pl-[6px]">
            <div class="dot w-4 h-4 rounded-full bg-[#64748B]"></div>
            {{ t("Minimum withdrawal amount") }} ₹
            {{ withdrwaInfo.minWithdraw }} ~ ₹
            {{ withdrwaInfo.maxWithdraw }}
          </div>
          <div class="l flex items-start color-[#64748B] text-[14px] gap-[8px] pl-[6px]">
            <div class="dot w-4 h-4 rounded-full bg-[#64748B]"></div>
            {{
              t(
                "The withdrawal will be processed and credited within 24 hours. Please wait patiently."
              )
            }}
          </div>
        </div>
      </div>
    </div>

    <div class="input-box px-12 mt-[60px]">
      <div class="keypad">
        <div class="keypad-row flex gap-[8px] mb-[8px]" v-for="row in keypadRows" :key="row.join('')">
          <div v-for="key in row" :key="key" @click="handleKeyClick(key)"
            class="keypad-btn flex-1 h-[56px] bg-[#FFFFFF] border border-[#E2E8F0] border-solid rounded-[8px] text-[20px] font-medium text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center">
            <svg width="29" v-if="key === 'delete'" height="28" viewBox="0 0 29 28" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_94_1671)">
                <path
                  d="M23.5832 7C23.8927 7 24.1894 7.12292 24.4082 7.34171C24.627 7.5605 24.7499 7.85725 24.7499 8.16667V19.8333C24.7499 20.1428 24.627 20.4395 24.4082 20.6583C24.1894 20.8771 23.8927 21 23.5832 21H10.7499L4.91657 15.1667C4.6296 14.8458 4.47095 14.4305 4.47095 14C4.47095 13.5695 4.6296 13.1542 4.91657 12.8333L10.7499 7H23.5832Z"
                  stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M18.9167 11.6667L14.25 16.3334M14.25 11.6667L18.9167 16.3334L14.25 11.6667Z" stroke="#0F172A"
                  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_94_1671">
                  <rect width="28" height="28" fill="white" transform="translate(0.25)" />
                </clipPath>
              </defs>
            </svg>

            <span v-else>{{ key }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="v-html" v-html="optimizeRichText(withdrwaInfo.withdrawContent)"></div>

    <BottomButton :button-text="t(`Withdraw Preview`)" color="#1B1B1B" @click="onConfirm" />
    <van-popup v-model:show="showPicker" destroy-on-close round :position="'bottom'" :safe-area-inset-bottom="true">
      <div class="p-12">

        <div
          class="add-bank-li mb-12 h-52 border border-[#f0f0f0] border-solid rounded-[16px] p-[12px] flex justify-between items-center"
          @click="handleClickAddBank">
          <div class="name flex items-center gap-12 text-[#0F172A] text-[14px] font-bold">
            <svg class="w-20 h-20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.6641 3.33325C11.9648 3.33325 12.2598 3.41457 12.5181 3.56862C12.7763 3.72266 12.988 3.94367 13.1308 4.20825L13.5358 4.95825C13.6786 5.22283 13.8903 5.44385 14.1485 5.59789C14.4067 5.75193 14.7018 5.83326 15.0025 5.83325H16.6666C17.1087 5.83325 17.5326 6.00885 17.8451 6.32141C18.1577 6.63397 18.3333 7.05789 18.3333 7.49992V14.9999C18.3333 15.4419 18.1577 15.8659 17.8451 16.1784C17.5326 16.491 17.1087 16.6666 16.6666 16.6666H3.33329C2.89127 16.6666 2.46734 16.491 2.15478 16.1784C1.84222 15.8659 1.66663 15.4419 1.66663 14.9999V7.49992C1.66663 7.05789 1.84222 6.63397 2.15478 6.32141C2.46734 6.00885 2.89127 5.83325 3.33329 5.83325H4.99746C5.29781 5.83327 5.59258 5.75212 5.85061 5.59839C6.10864 5.44466 6.32033 5.22406 6.46329 4.95992L6.87079 4.20659C7.01376 3.94244 7.22545 3.72184 7.48347 3.56811C7.7415 3.41438 8.03627 3.33324 8.33663 3.33325H11.6641Z"
                stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M9.99996 13.3333C11.3807 13.3333 12.5 12.214 12.5 10.8333C12.5 9.45254 11.3807 8.33325 9.99996 8.33325C8.61925 8.33325 7.49996 9.45254 7.49996 10.8333C7.49996 12.214 8.61925 13.3333 9.99996 13.3333Z"
                stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ t("Add Bank Account") }}
          </div>
          <svg class="w-20 h-20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.33325 13.3334L11.6666 10.0001L8.33325 6.66675" stroke="#888888" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div
          class="add-bank-li mb-12 h-52 border border-[#f0f0f0] border-solid rounded-[16px] p-[12px] flex justify-between items-center"
          v-for="(item, index) in bankList" :key="index" @click="selectBank = item.id; showPicker = false; info = item">
          <div class="name text-[#0F172A] text-[14px] font-bold">
            {{ item.address.receiveName }}
          </div>
          <div
            class="picker border border-[#f0f0f0] border-solid rounded-[4px] w-16 h-16 flex justify-center items-center"
            :class="selectBank == item.id ? 'bg-[#F47C3E]' : ''">
            <svg v-if="selectBank == item.id" class="w-10 h-10" viewBox="0 0 10 10" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M8.33341 2.70825L3.75008 7.29159L1.66675 5.20825" stroke="white" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script setup lang="ts">
import { addCommasToNumber } from "@/utils/tool";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useLoadingStore } from "@/stores/modules/loading";
import { bank_list } from "@/api/payment";
import { optimizeRichText } from '@/utils/richText';

import { deposit, withdraw_info, withdraw } from "@/api/billing";
import item from "../../../components/item.vue";
import BottomButton from "@/components/bottom-button.vue";
const info = ref<any>();
const count = ref(0);
const showPicker = ref(false)
const { t } = useI18n();
const displayValue = ref("");
const fee = computed(() => {
  return addCommasToNumber(count.value * withdrwaInfo.value.withdrawFee * 0.01);
});
const { proxy } = getCurrentInstance()!;
const loadingStore = useLoadingStore();
const selectBank = ref(0)
// 数字键盘布局数据
const keypadRows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "delete"],
];

// 统一的按键处理方法
const handleKeyClick = (key: string) => {
  if (key === "delete") {
    deleteLastChar();
  } else if (key === ".") {
    appendDecimal();
  } else {
    appendNumber(key);
  }
};
const handleClickAddBank = () => {
  router.push({
    path: "/profile/bankAccount/addBank"
  })
}
const onSelect = () => {
  // router.replace("/wallet/exchange/withdraw-bank");
  showPicker.value = true
};
const bankList = ref([])
const getBankList = async () => {
  const { data, code } = await bank_list({ ...{ pageIndex: 1, pageSize: 30 }, wallet_type: "auto" });
  if (code == 200) {
    if (data.rows && data.rows.length == 0) {
      router.push({ path: '/profile/bankAccount' })
      return
    }
    bankList.value = data.rows;
    info.value = data.rows[0]
    selectBank.value = data.rows[0].id
  }
};
const handleBuyClickOriginal = async () => {
  // 处理购买逻辑
  console.log("购买金额:", count.value);
  console.log("购买信息:", info.value);
  // 将数据整合到一起，存进localStorage
  const dataInfo = {
    amount: count.value,
    fee: fee.value,
    info: info.value,
  };
  // localStorage.setItem("withdrawInfo", JSON.stringify(dataInfo));
  // router.push('/wallet/exchange/withdraw-preview')
  const { data, code } = await withdraw({
    type: "1",
    cardId: selectBank.value,
    amount: count.value,
  });
  if (code == 200) {
    setTimeout(() => {
      router.push("/wallet/exchange/withdraw-success");
    }, 400);
  }
};
const onConfirm = proxy!.$throttle(handleBuyClickOriginal, 1000, {
  onStart: () => loadingStore.show(),
  onEnd: () => loadingStore.hide(),
});
// 数字键盘相关方法
const appendNumber = (num: string) => {
  if (displayValue.value === "0" && num !== ".") {
    displayValue.value = num;
  } else {
    displayValue.value += num;
  }
  // 更新count值
  count.value = displayValue.value === "" ? 0 : parseFloat(displayValue.value);
};

// 添加小数点方法
const appendDecimal = () => {
  // 如果已经包含小数点，则不允许再添加
  if (displayValue.value.includes(".")) {
    return;
  }

  // 如果当前值为空或0，则添加0.
  if (displayValue.value === "" || displayValue.value === "0") {
    displayValue.value = "0.";
  } else {
    displayValue.value += ".";
  }

  // 更新count值
  count.value = displayValue.value === "" ? 0 : parseFloat(displayValue.value);
};

const deleteLastChar = () => {
  if (displayValue.value.length > 0) {
    displayValue.value = displayValue.value.slice(0, -1);
    // 如果删除后为空，则count为0，否则解析数值
    count.value =
      displayValue.value === "" ? 0 : parseFloat(displayValue.value);
  }
};

// 更新info的函数
const updateInfo = () => {
  const dataInfo = localStorage.getItem("withdrawType");
  if (dataInfo) {
    try {
      // 如果dataInfo是JSON字符串，则解析为对象
      info.value = JSON.parse(dataInfo);
    } catch (error) {
      // 如果不是JSON格式，直接赋值字符串
      info.value = dataInfo;
    }
  } else {
    info.value = null;
  }
};
const withdrwaInfo = ref<any>({
  withdrawFee: 0,
  withdrawContent:"",
});
const getWithdrawInfo = async () => {
  const { data, code } = await withdraw_info();
  if (code == 200) {
    withdrwaInfo.value = data;
  }
};
onMounted(() => {
  // 初始获取localStorage中的dataInfo
  // updateInfo();
  getWithdrawInfo();
  getBankList()
  // 监听localStorage变化
  window.addEventListener("storage", (e) => {
    if (e.key === "dataInfo") {
      updateInfo();
    }
  });
});

// 使用watch监听info的变化（可选，用于调试）
watch(
  info,
  (newValue) => {
    console.log("info已更新:", newValue);
  },
  { deep: true }
);

const router = useRouter();
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
</script>

<style lang="less" scoped>
.cashier-center-content {
  padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
}

.dot {
  flex-shrink: 0;
  margin-top: 8px;
}
</style>

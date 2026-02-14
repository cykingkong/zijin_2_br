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
      <div class="text-[14px] mt-[57px] text-center">{{ t("Withdrawal account") }}</div>
      <div class="min-count text-[#0F172A] font-size-[24px] mx-a text-center mt-4 font-bold overflow-y-auto">
        R$ {{ count || '0' }}
      </div>
      <div class="min-count-fee text-[#1b1b1b] font-size-[14px] mx-a text-center mt-[4px] font-bold overflow-y-auto">
        {{ t("Tax") }} R${{ fee }}
      </div>
      <div class="min-count-fee text-[#1b1b1b] font-size-[14px] mx-a text-center mt-[4px] font-bold overflow-y-auto">
        {{ t('Withdrawable Amount') }} R$ {{ addCommasToNumber(userInfo.teamBalance) }}
      </div>

      <div class="mt-[30px] ">
        <div class="px-12 py-[20px] bg-[#fff] rounded-[20px] flex-col flex gap-12 card">
          <div class="label  " :class="['flex items-center gap-4']">
            {{ t('Bank Card') }}
          </div>
        <item class="">
            <template #left>
              <div class=" left h-[46px] flex items-center gap-[16px]">
            <div class="w-40 h-40 flex items-center justify-center flex-shrink-0 block bg-[#F8F9FD] rounded-full"
              alt="">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_5701_58995)">
                  <rect width="28" height="28" rx="8" fill="blue" fill-opacity="0.15" />
                  <path
                    d="M16 16.3333C16 18.7267 14.06 20.6667 11.6667 20.6667C9.27337 20.6667 7.33337 18.7267 7.33337 16.3333C7.33337 13.94 9.27337 12 11.6667 12C11.78 12 11.9 12.0067 12.0134 12.0133C14.1267 12.18 15.82 13.8733 15.9867 15.9867C15.9934 16.1 16 16.22 16 16.3333Z"
                    fill="#161616" />
                  <path opacity="0.4"
                    d="M20.6667 11.6668C20.6667 14.0602 18.7267 16.0002 16.3333 16.0002C16.22 16.0002 16.1 15.9935 15.9867 15.9868C15.82 13.8735 14.1267 12.1802 12.0133 12.0135C12.0067 11.9002 12 11.7802 12 11.6668C12 9.2735 13.94 7.3335 16.3333 7.3335C18.7267 7.3335 20.6667 9.2735 20.6667 11.6668Z"
                    fill="#161616" />
                  <path
                    d="M9.7267 7.3335H8.00004C7.63337 7.3335 7.33337 7.6335 7.33337 8.00016V9.72683C7.33337 10.3202 8.05337 10.6202 8.47337 10.2002L10.2 8.4735C10.6134 8.0535 10.32 7.3335 9.7267 7.3335Z"
                    fill="#161616" />
                  <path
                    d="M18.2733 20.6667H20C20.3666 20.6667 20.6666 20.3667 20.6666 20V18.2733C20.6666 17.68 19.9466 17.38 19.5266 17.8L17.8 19.5267C17.3866 19.9467 17.68 20.6667 18.2733 20.6667Z"
                    fill="#161616" />
                </g>
                <defs>
                  <clipPath id="clip0_5701_58995">
                    <rect width="28" height="28" fill="white" />
                  </clipPath>
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
  <div class="color-[#1b1b1b] text-[14px] font-bold text-nowrap" @click="onSelect">
    {{ t("Picker") }}
  </div>
</template>
</item>
<div class="label  " :class="['flex items-center gap-4']">
            {{ t('Extract Amount') }}
          </div>
          <div class=" phone-input">
  <inputCom :placeholder="t('PleaseEnterAmount')" v-model:value="count" :tips="''" class="flex-1 w-full"
        :formatter="digitFormatter">
  </inputCom>
</div>
<van-button type="primary" class="h-[56px]" color="#1b1b1b" block @click="onConfirm">
  {{ t(`Withdraw Preview`) }}
</van-button>
</div>
</div>
</div>

<!-- <div class="input-box px-12 mt-[20px]">
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
    </div> -->
<div class="v-html" v-html="optimizeRichText(withdrwaInfo.withdrawContent)"></div>

<!-- <BottomButton :button-text="t(`Withdraw Preview`)" color="#1B1B1B" @click="onConfirm" /> -->
<van-popup v-model:show="showPicker" destroy-on-close round :position="'bottom'" :safe-area-inset-bottom="true">
  <div class="p-12">

    <div
      class="add-bank-li mb-12 h-52 border border-[#f0f0f0] border-solid rounded-[16px] p-[12px] flex justify-between items-center"
      @click="handleClickAddBank" v-if="bankList && bankList.length < 1">
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
      <div class="picker border border-[#f0f0f0] border-solid rounded-[4px] w-16 h-16 flex justify-center items-center"
        :class="selectBank == item.id ? 'bg-[#1b1b1b]' : ''">
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
import { useUserStore } from "@/stores";

import { deposit, withdraw_info, withdraw } from "@/api/billing";
import item from "../../../components/item.vue";
import BottomButton from "@/components/bottom-button.vue";
const info = ref<any>();
const count = ref<any>(0);
const showPicker = ref(false)
const { t } = useI18n();
const displayValue = ref("");
const fee = computed(() => {
  return addCommasToNumber(count.value * withdrwaInfo.value.withdrawFee * 0.01);
});
// 【新增】监听 count 变化，强制取整
// watch(count, (newVal) => {
//   // 转换为字符串判断是否包含小数点
//   const strVal = String(newVal)
//   if (strVal.includes('.')) {
//     // 截取小数点前的部分，实现仅保留整数
//     count.value = strVal.split('.')[0]
//   }
// })
const { proxy } = getCurrentInstance()!;
const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);
const loadingStore = useLoadingStore();
const selectBank = ref(0)
// 数字键盘布局数据
const keypadRows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "delete"],
];
// 定义格式化函数：过滤非数字
const digitFormatter = (value: string) => {
 // 1. 先把非数字字符全部过滤掉
  let result = value.replace(/\D/g, '');
  // 2. 处理前导 0 的情况
  // 逻辑：如果字符串以 0 开头，并且后面还有其他数字（例如 "01", "007"），
  // 则把开头的 0 去掉。
  // 注意：这样保留了单独的 "0"，防止用户想输入 0 时输入不进去，
  // 但输入 "01" 时会自动变成 "1"。
  result = result.replace(/^0+(?=\d)/, '');
  
  return result;
};
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
      router.push({ path: '/profile/bankAccount' ,  replace: true,})
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
    amount: Number(count.value),
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
  withdrawContent: "",
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

.phone-input {
  border: 1px solid #F0F0F0;
  border-radius: 12px;

  :deep(.input-box) {
    /* height: 48px; */
    margin-top: 0px;


  }

  :deep(.tips) {
    margin-bottom: 0px;
  }
}

.card {
  border: 1px solid #0000001A
}

.dot {
  flex-shrink: 0;
  margin-top: 8px;
}
</style>

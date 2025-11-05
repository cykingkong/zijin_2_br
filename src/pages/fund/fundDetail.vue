<template>
  <div class="fund-detail p-12 pb-120">
    <!-- <div class="px-30">
            <div class="w-full text-14px bg-#0F172A80 rounded-12px flex items-center justify-between p-12px color-#fff">
                <div class="l">距离结束</div>
                <div class="r">{{ countdownText }}</div>
            </div>
        </div> -->
    <div class="name mt-30px font-700 text-20px mb-10px">{{ info.name }}</div>
    <div v-html="info.content" class="h-400px overflow-y-auto"></div>
    <div
      class="input w-full rounded-12px bg-#F8F9FD text-align-center font-bold items-center text-16px h-58px flex px-24px gap-8px"
      :class="{
        'border-1px border-#E11D48': isInvalidAmount || isInvalidFormat,
      }">
      <div class="unit text-16px">MX$</div>
      <input type="text" placeholder="" v-model="amount" @input="handleAmountInput" @blur="handleAmountBlur"
        class="w-full h-full text-16px text-align-left input"
        :class="{ 'color-#E11D48': isInvalidAmount || isInvalidFormat }" />
    </div>

    <!-- 错误提示 -->
    <div v-if="isInvalidAmount" class="error-tip text-12px color-#E11D48 mt-8px text-center">
      {{
        t(
          "The entered amount cannot be less than the minimum investment amount."
        )
      }}
      MX$ {{ info.minAmount }}
    </div>
    <div v-if="isInvalidFormat" class="error-tip text-12px color-#E11D48 mt-8px text-center">
      {{ t("Please enter a valid positive integer amount.") }}
    </div>
    <!-- <Keypad v-model="amount" /> -->
    <bottom-button :buttonText="t('Reserve') + ' ' + info.name" :color="info.status == 1 ? '#6B39F4' : '#CCC'" @click="handleReserveConfirm" />

    <!-- 预约弹窗 -->
    <bottom-pop ref="bottomPopRef" :item="reserveItem" pop-type="fund" @onConfirm="handleReserveConfirm" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { fundProductInfo, fundSubscribe } from "@/api/bond";
import bottomPop from "./component/bottom-pop.vue";
import { showToast, showSuccessToast } from "vant";
import Keypad from "@/components/Keypad.vue";
import bottomButton from "@/components/bottom-button.vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

// 定义接口类型
interface FundInfo {
  name: string;
  content: string;
  minAmount: number;
  start_time_end: string;
  id: string;
  [key: string]: any;
}

const info = ref<FundInfo>({
  name: "",
  content: "",
  minAmount: 0,
  start_time_end: "",
  id: "",
});
const amount = ref("");
const isInvalidAmount = ref(false);
const isInvalidFormat = ref(false);
const { t } = useI18n();
// 预约相关
const bottomPopRef = ref();
const reserveItem = ref({
  name: "",
  minAmount: 0,
  id: "",
});


const routerr = useRouter();
// 处理预约确认
const handleReserveConfirm = async () => {
  if(info.value.status != 1){
    return;
  }
  try {
    const reserveData = {
      id: info.value.id,
      amount: amount.value,
    };

    const res = await fundSubscribe(reserveData);

    if (res.code === 200 || res.success) {
      showSuccessToast("");
      setTimeout(() => {
        routerr.push({
          path: "/fund",
          query: { tab: "1" },
          replace: true,
        });
      }, 1200);
    }
    //  else {
    //   showToast(res.message || "预约失败，请重试");
    // }
  } catch (error) {
    console.error("预约失败:", error);
    // showToast("预约失败，请重试");
  }
};

const getInfo = async (id: string) => {
  const res = await fundProductInfo({ id });
  console.log(res);
  info.value = res.data;
  // 确保字段映射正确
  info.value.minAmount = res.data.min_amount || res.data.minAmount || 0;
  amount.value = res.data.min_amount || res.data.minAmount || "0";
};

const router = useRoute();
onMounted(() => {
  console.log(router);
  if (router.query.id) {
    getInfo(router.query.id as string);
  }
});

const handleAmountInput = () => {
  // 检查是否为正整数
  const positiveIntegerRegex = /^[1-9]\d*$/;
  if (!positiveIntegerRegex.test(amount.value)) {
    isInvalidFormat.value = true;
    isInvalidAmount.value = false;
    return;
  }

  isInvalidFormat.value = false;
  const inputValue = parseFloat(amount.value) || 0;
  if (inputValue < info.value.minAmount) {
    isInvalidAmount.value = true;
  } else {
    isInvalidAmount.value = false;
  }
};

const handleAmountBlur = () => {
  // 检查是否为正整数
  const positiveIntegerRegex = /^[1-9]\d*$/;
  if (!positiveIntegerRegex.test(amount.value)) {
    isInvalidFormat.value = true;
    isInvalidAmount.value = false;
    // 清空无效输入
    amount.value = info.value.minAmount.toString();
    return;
  }

  isInvalidFormat.value = false;
  const inputValue = parseFloat(amount.value) || 0;
  if (inputValue < info.value.minAmount) {
    isInvalidAmount.value = true;
    // 如果输入值小于最小金额，重置为最小金额
    amount.value = info.value.minAmount.toString();
  } else {
    isInvalidAmount.value = false;
  }
};
</script>

<style lang="less" scoped>
.input {
  transition: all 0.3s ease;

  &.border-1px {
    border-color: #e11d48;
    background: #fef2f2;
  }
}

input {
  background: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
  }

  &::-webkit-input-placeholder {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
  }

  &::-moz-placeholder {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
  }

  &:-ms-input-placeholder {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
  }

  &.color-#E11D48 {
    color: #e11d48;
  }
}

.error-tip {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/modules/loading'

import { deposit } from '@/api/billing'
import item from '../../../components/item.vue'
import BottomButton from '../component/bottom-button.vue'

const info = ref<any>()
const count = ref(0)
const displayValue = ref('')
const { t } = useI18n()
const { proxy } = getCurrentInstance()!
const loadingStore = useLoadingStore()

// 数字键盘布局数据
const keypadRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [".", "0", "delete"],

]

// 统一的按键处理方法
function handleKeyClick(key: string) {
  if (key === 'delete') {
    deleteLastChar()
  } else if (key === ".") {
    appendDecimal();
  }
  else {
    appendNumber(key)
  }
}
function onSelect() {
  router.replace('/wallet/exchange/channel-out')
}

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
async function handleBuyClickOriginal() {
  // 处理购买逻辑
  console.log('购买金额:', count.value)
  console.log('购买信息:', info.value)
  // 这里可以添加购买确认、API调用等逻辑
  const { data, code } = await deposit({
    amount: count.value,
    id: info.value.id,
  })
  if (code === 200) {
    if (data.type == 'bank') {
      setTimeout(() => {
        window.location.href = data.url
      }, 40)
    }
    if (data.type == 'crypto') {
      let cInfo = {
        ...data,
        amount: count.value,
      }
      localStorage.setItem('cryptoInfo', JSON.stringify(cInfo))
      setTimeout(() => {
        router.push({
          path: '/wallet/exchange/deposit-preview',
          replace: true,
        })
      }, 400)
    }
  }
}
const onConfirm = proxy!.$throttle(handleBuyClickOriginal, 1000, {
  onStart: () => loadingStore.show(),
  onEnd: () => loadingStore.hide(),
})
// 数字键盘相关方法
function appendNumber(num: string) {
  if (displayValue.value === "0" && num !== ".") {
    displayValue.value = num;
  } else {
    displayValue.value += num;
  }
  // 更新count值
  count.value = displayValue.value === "" ? 0 : parseFloat(displayValue.value);
}

function deleteLastChar() {
  if (displayValue.value.length > 0) {
    displayValue.value = displayValue.value.slice(0, -1)
    // 如果删除后为空，则count为0，否则解析数值
    count.value = displayValue.value === '' ? 0 : Number.parseInt(displayValue.value)
  }
}

// 更新info的函数
function updateInfo() {
  const dataInfo = localStorage.getItem('payType')
  if (dataInfo) {
    try {
      // 如果dataInfo是JSON字符串，则解析为对象
      info.value = JSON.parse(dataInfo)
    }
    catch (error) {
      // 如果不是JSON格式，直接赋值字符串
      info.value = dataInfo
    }
  }
  else {
    info.value = null
  }
}

onMounted(() => {
  // 初始获取localStorage中的dataInfo
  updateInfo()

  // 监听localStorage变化
  window.addEventListener('storage', (e) => {
    if (e.key === 'dataInfo') {
      updateInfo()
    }
  })
})

// // 页面离开时清空payType
// onBeforeUnmount(() => {
//   localStorage.removeItem("payType");
// });

// 使用watch监听info的变化（可选，用于调试）
watch(
  info,
  (newValue) => {
    console.log('info已更新:', newValue)
  },
  { deep: true },
)

const router = useRouter()
function onBack() {
  if (window.history.state.back)
    history.back()
  else router.replace('/')
}
</script>

<template>
  <div class="cashier-center-content w-full px-12 pb-120">
    <VanNavBar title="" :fixed="true" clickable :left-arrow="true" z-index="999" @click-left="onBack">
      <template #title>
        <div class="text-16px color-#0F172A font-bold">
          {{ t("Checkout counter") }}
        </div>
      </template>
    </VanNavBar>
    <div v-if="info" class="info mt-32">
      <div class="min-count mx-a mt-57px overflow-y-auto text-center font-size-40px text-#0F172A font-700">
        MX${{ count }}
      </div>
      <div class="mt-30px">
        <item class="mt-62px">
          <template #left>
            <div class="left h-46px flex items-center gap-16px">
              <div class="img h-40px w-40px overflow-hidden rounded-full bg-#F8F9FD">
                <img :src="info.logo" alt="" class="h-full w-full">
              </div>
              <div class="info h-46px flex flex-col justify-between">
                <div class="name text-14px text-#0F172A font-bold">
                  {{ info.name }}
                </div>
                <div class="name2 text-12px text-#64748B">
                  {{ t("Amount range") }}: MX${{ info.min_amount }} ~ MX${{
                    info.max_amount
                  }}
                </div>
              </div>
            </div>
          </template>
          <template #right>
            <div class="text-nowrap text-14px color-#6B39F4 font-bold" @click="onSelect">
              {{ t("Picker") }}
            </div>
          </template>
        </item>
      </div>
    </div>
    <div class="tips mt-45px">
      <div class="t-title mb-12px text-18px color-#FF383C80 font-bold">
        {{ t("Pay attention") }}
      </div>
      <div class="l flex items-start gap-8px pl-6px text-14px color-#64748B">
        <div class="dot h-4 w-4 rounded-full bg-#64748B" />
        {{ t("fetchNewOrderForDeposit") }}
      </div>
      <div class="l flex items-start gap-8px pl-6px text-14px color-#64748B">
        <div class="dot h-4 w-4 rounded-full bg-#64748B" />
        {{ t("avoidRepeatedDeposits") }}
      </div>
      <div class="l flex items-start gap-8px pl-6px text-14px color-#64748B">
        <div class="dot h-4 w-4 rounded-full bg-#64748B" />
        {{ t("contactSupportForDepositIssues") }}
      </div>
    </div>
    <div class="input-box mt-41px px-12">
      <div class="keypad">
        <div v-for="row in keypadRows" :key="row.join('')" class="keypad-row mb-8px flex gap-8px">
          <div v-for="key in row" :key="key"
            class="keypad-btn h-56px flex flex-1 items-center justify-center border border-#E2E8F0 rounded-8px bg-#FFFFFF text-20px text-#0F172A font-medium hover:bg-#F1F5F9"
            @click="handleKeyClick(key)">
            <svg v-if="key === 'delete'" width="29" height="28" viewBox="0 0 29 28" fill="none"
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
    <BottomButton :button-text="t(`Deposit Preview`)" @click="onConfirm" />
  </div>
</template>

<style lang="less" scoped>
.cashier-center-content {
  padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
}


.dot {
  flex-shrink: 0;
  margin-top: 8px;
}
</style>

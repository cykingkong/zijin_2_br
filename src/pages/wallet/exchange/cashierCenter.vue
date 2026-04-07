<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/modules/loading'

import { deposit, rechargeMethods } from '@/api/billing'
import { addCommasToNumber } from '@/utils/tool'

import Keypad from '../../../components/Keypad.vue'

const info = ref<any>()
const count = ref(0)
const displayValue = ref('')
const { t } = useI18n()
const { proxy } = getCurrentInstance()!
const loadingStore = useLoadingStore()
const router = useRouter()
const exchangeRateData = ref<any>()
const methodsList = ref<any[]>([])
const selectedMethod = ref<any>(null)
const amountScopeList = ref<any[]>([])
const showPicker = ref(false)

function getMethodKey(item: any) {
  return item?.id ?? item?.method ?? item?.name ?? item?.channel_name ?? ''
}

function getMethodName(item: any) {
  return item?.method || item?.name || item?.channel_name || ''
}

function getAmountScope(item: any) {
  return Array.isArray(item?.amount_scope) ? item.amount_scope : []
}

function getAmountScopeValue(item: any) {
  return item?.parameter ?? item?.value ?? item?.amount ?? item
}

function getAmountScopeLabel(item: any) {
  const value = getAmountScopeValue(item)
  return item?.label || item?.name || value
}

function isAmountScopeActive(item: any) {
  return String(getAmountScopeValue(item) ?? '') === displayValue.value
}

const methodColumns = computed(() =>
  methodsList.value.map(item => ({
    text: getMethodName(item),
    value: getMethodKey(item),
  })),
)

function syncSelectedMethod(item: any) {
  selectedMethod.value = item || null
  const nextAmountScopeList = item ? getAmountScope(item) : []
  amountScopeList.value = nextAmountScopeList

  const hasMatchedAmount = nextAmountScopeList.some(scope => String(getAmountScopeValue(scope) ?? '') === displayValue.value)
  if (!hasMatchedAmount)
    displayValue.value = ''
}

function handleSelectMethod(item: any) {
  syncSelectedMethod(item)
  showPicker.value = false
}

function handleMethodConfirm({ selectedValues }: { selectedValues: any[] }) {
  const selectedValue = selectedValues?.[0]
  const matchedMethod = methodsList.value.find(item => getMethodKey(item) === selectedValue)
  handleSelectMethod(matchedMethod || null)
}

function handleSelectAmountScope(item: any) {
  const value = getAmountScopeValue(item)
  displayValue.value = value === undefined || value === null ? '' : String(value)
}

// 监听 displayValue 变化，更新 count
watch(displayValue, (newVal) => {
  count.value = newVal === '' ? 0 : Number.parseFloat(newVal)
})

// 计算需要支付的金额
const paymentAmount = computed(() => {
  if (!exchangeRateData.value?.usd_to || count.value === 0)
    return 0
  return addCommasToNumber(count.value * exchangeRateData.value.usd_to)
})

// 获取汇率
async function getExchangeRate() {
  const { data, code } = await rechargeMethods({})
  if (code === 200) {
    exchangeRateData.value = Array.isArray(data) ? null : data
    methodsList.value = Array.isArray(data) ? data : (Array.isArray(data?.methods) ? data.methods : [])
    if (methodsList.value.length > 0) {
      syncSelectedMethod(methodsList.value[0])
    }
    else {
      syncSelectedMethod(null)
    }
  }
}

async function handleBuyClickOriginal() {
  const { data, code } = await deposit({
    amount: count.value,
  })
  if (code === 200) {
    localStorage.setItem('depositInfo', JSON.stringify(data))
    router.push('/wallet/exchange/deposit-bank')
  }
}
const onConfirm = proxy!.$throttle(handleBuyClickOriginal, 1000, {
  onStart: () => loadingStore.show(),
  onEnd: () => loadingStore.hide(),
})

// 更新info的函数
function updateInfo() {
  const dataInfo = localStorage.getItem('payType')
  if (dataInfo) {
    try {
      // 如果dataInfo是JSON字符串，则解析为对象
      info.value = JSON.parse(dataInfo)
    }
    catch {
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
  // updateInfo()

  // 获取汇率
  getExchangeRate()

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

function onBack() {
  if (window.history.state.back)
    history.back()
  else router.replace('/')
}
</script>

<template>
  <div class="cashier-center-content w-full px-20 pb-120 pt-[20px]">
    <VanNavBar title="" :fixed="true" clickable :left-arrow="true" z-index="999" placeholder @click-left="onBack">
      <template #left>
        <div class="flex items-center gap-14">
          <svg class="h-28 w-28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M23.3333 14.3201C23.3333 14.763 23.0041 15.1291 22.577 15.1871L22.4583 15.1951L4.95831 15.1951C4.47506 15.1951 4.08331 14.8033 4.08331 14.3201C4.08331 13.8771 4.41249 13.511 4.83958 13.4531L4.95831 13.4451L22.4583 13.4451C22.9416 13.4451 23.3333 13.8368 23.3333 14.3201Z"
              fill="#212121"
            />
            <path
              d="M12.6338 20.7284C12.9762 21.0694 12.9774 21.6234 12.6365 21.9658C12.3265 22.2771 11.8404 22.3064 11.4974 22.053L11.399 21.9685L4.3407 14.9405C4.02846 14.6296 4.00005 14.1418 4.2555 13.7987L4.34065 13.7004L11.399 6.67126C11.7414 6.33026 12.2954 6.33141 12.6364 6.67382C12.9464 6.98511 12.9737 7.47128 12.7188 7.8133L12.6339 7.91126L6.19848 14.3208L12.6338 20.7284Z"
              fill="#212121"
            />
          </svg>
          <div class="flex gap-6 flex-items-center font-size-[18px] font-bold">
            {{ `${t('Deposit to')}Otrade` }}
          </div>
        </div>
      </template>
    </VanNavBar>
    <div class="info">
      <div
        class="min-count relative mx-a mt-[px] h-[140px] flex items-center justify-center overflow-hidden border border-[3px] border-[#2DC07E] rounded-[32px] border-solid px-16 text-center text-[#0F172A]"
      >
        <!-- 占位符提示（count为0时显示） -->
        <span v-if="count === 0" class="absolute text-[20px] text-[#94A3B8]">
          {{ t("Enter amount") }}
        </span>
        <!-- 金额显示（count>0时显示） -->
        <span v-else class="text-[40px] font-bold">
          $ {{ count }}
        </span>
      </div>
      <div class="my-20 text-center color-[#616161]">
        <div class="mb-[10px] text-[16px]">
          {{ t("Your balance will immediately receive") }} {{ count }} {{
            t("USD") }}
        </div>
        <div class="text-[16px]">
          {{ t("You need to pay") }} Rp {{ paymentAmount }}
        </div>
      </div>
      <div class="flex items-center justify-between py-[10px]" @click="showPicker = true">
        <div class="text-[16px] text-[#0F172A] font-bold">
          {{ getMethodName(selectedMethod) || t('BRL Pay') }}
        </div>
        <svg class="h-16 w-16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd" clip-rule="evenodd"
            d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5ZM10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
            fill="#12D18E"
          />
          <path
            d="M15.8334 10.0001C15.8334 13.2217 13.2217 15.8334 10 15.8334C6.77836 15.8334 4.16669 13.2217 4.16669 10.0001C4.16669 6.77842 6.77836 4.16675 10 4.16675C13.2217 4.16675 15.8334 6.77842 15.8334 10.0001Z"
            fill="#12D18E"
          />
        </svg>
      </div>
      <div v-if="amountScopeList.length" class="grid grid-cols-3 mt-[12px] gap-12">
        <div
          v-for="(item, index) in amountScopeList"
          :key="index"
          class="h-[40px] flex items-center justify-center border rounded-[12px] border-solid text-[14px] font-medium transition-colors" :class="isAmountScopeActive(item) ? 'bg-[#12D18E] border-[#12D18E] text-white' : 'bg-[#F5F5F5] border-[#F5F5F5] text-[#0F172A]'" @click="handleSelectAmountScope(item)"
        >
          {{ getAmountScopeLabel(item) }}
        </div>
      </div>
    </div>
    <div class="input-box mt-[41px]">
      <Keypad v-model="displayValue" :show-decimal="false" />
    </div>
    <BottomButton :button-text="t(`Deposit Preview`)" @click="onConfirm" />
    <van-popup v-model:show="showPicker" destroy-on-close round position="bottom" :safe-area-inset-bottom="true">
      <van-picker
        :title="t('BRL Pay')"
        :columns="methodColumns"
        :model-value="[getMethodKey(selectedMethod)]"
        :confirm-button-text="t('Confirm')"
        :cancel-button-text="t('Cancel')"
        @confirm="handleMethodConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
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

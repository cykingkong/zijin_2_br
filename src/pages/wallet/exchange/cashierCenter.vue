<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/modules/loading'

import { deposit, rechargeMethods } from '@/api/billing'
import { formatRupiah } from '@/utils/tool'
import { optimizeRichText} from '@/utils/richText'
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
const isNavSolid = ref(false)
const rechargeNote = ref("")
function getMethodKey(item: any) {
  return item?.id ?? item?.method ?? item?.name ?? item?.channel_name ?? ''
}

function getMethodName(item: any) {
  return item?.method || item?.name || item?.channel_name || ''
}

function isMethodSelected(item: any) {
  return getMethodKey(item) === getMethodKey(selectedMethod.value)
}

function formatDisplayNumber(value: any) {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue))
    return '--'
  return formatRupiah(numericValue)
}

const selectedMethodName = computed(() => getMethodName(selectedMethod.value) || t('BRL Pay'))
const formattedDepositAmount = computed(() => (count.value === 0 ? formatRupiah(0) : formatDisplayNumber(count.value)))
const methodMinAmountLabel = computed(() => formatDisplayNumber(selectedMethod.value?.min_amount))
const methodMaxAmountLabel = computed(() => formatDisplayNumber(selectedMethod.value?.max_amount))

function syncSelectedMethod(item: any) {
  selectedMethod.value = item || null
}

function handleSelectMethod(item: any) {
  syncSelectedMethod(item)
}

function syncNavSolidState() {
  isNavSolid.value = window.scrollY > 36
}

// 监听 displayValue 变化，更新 count
watch(displayValue, (newVal) => {
  count.value = newVal === '' ? 0 : Number.parseFloat(newVal)
})

// 获取汇率
async function getExchangeRate() {
  const { data, code } = await rechargeMethods({})
  if (code === 200) {
    rechargeNote.value = data?.recharge_note || ""
    exchangeRateData.value = Array.isArray(data) ? null : data
    methodsList.value = Array.isArray(data?.rechargeMethods)
      ? data.rechargeMethods
      : (Array.isArray(data?.methods) ? data.methods : (Array.isArray(data) ? data : []))
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
    method:getMethodName(selectedMethod.value),
    amount: count.value,
  })
  if (code === 200) {
    router.replace({
      path: '/profile',
    })
    window.location.href = data.url

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
  syncNavSolidState()

  // 监听localStorage变化
  window.addEventListener('storage', (e) => {
    if (e.key === 'dataInfo') {
      updateInfo()
    }
  })
  window.addEventListener('scroll', syncNavSolidState, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', syncNavSolidState)
})

function onBack() {
  if (window.history.state.back)
    history.back()
  else router.replace('/')
}
</script>

<template>
  <div class="cashier-center-content w-full px-20 pb-130 pt-[8px]">
    <VanNavBar class="cashier-nav" :class="{ 'cashier-nav-solid': isNavSolid }" title="" :fixed="true" clickable
      :left-arrow="true" z-index="999" placeholder @click-left="onBack">
      <template #left>
        <div class="nav-left">
          <div class="nav-icon-wrap">
            <svg class="h-28 w-28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M23.3333 14.3201C23.3333 14.763 23.0041 15.1291 22.577 15.1871L22.4583 15.1951L4.95831 15.1951C4.47506 15.1951 4.08331 14.8033 4.08331 14.3201C4.08331 13.8771 4.41249 13.511 4.83958 13.4531L4.95831 13.4451L22.4583 13.4451C22.9416 13.4451 23.3333 13.8368 23.3333 14.3201Z"
                fill="#fff" />
              <path
                d="M12.6338 20.7284C12.9762 21.0694 12.9774 21.6234 12.6365 21.9658C12.3265 22.2771 11.8404 22.3064 11.4974 22.053L11.399 21.9685L4.3407 14.9405C4.02846 14.6296 4.00005 14.1418 4.2555 13.7987L4.34065 13.7004L11.399 6.67126C11.7414 6.33026 12.2954 6.33141 12.6364 6.67382C12.9464 6.98511 12.9737 7.47128 12.7188 7.8133L12.6339 7.91126L6.19848 14.3208L12.6338 20.7284Z"
                fill="#fff" />
            </svg>
          </div>
          <div class="nav-copy">
            <div class="nav-eyebrow">
              {{ t('Deposit Workspace') }}
            </div>
            <div class="nav-title">
              {{ `${t('Deposit')}` }}
            </div>
          </div>
        </div>
      </template>
    </VanNavBar>

    <section class="hero-panel">
      <div class="hero-badge">
        {{ t('Clean transfer flow') }}
      </div>
      <h1 class="hero-title">
        {{ t('Fund your balance with a documented, polished payment workspace') }}
      </h1>
      <p class="hero-copy">
        {{ t(
          `Choose a recharge method from the list, then enter a custom value with the keypad below.`
          ) }}
      </p>
    </section>

    <section class="surface-card amount-card">
      <div class="section-head">
        <div>
          <div class="section-kicker">
            {{ t('Deposit Amount') }}
          </div>
          <div class="section-title">
            {{ t('Live funding preview') }}
          </div>
        </div>
        <div class="section-pill">
          {{ selectedMethodName }}
        </div>
      </div>

      <div class="amount-display">
        <span class="amount-value">{{ formattedDepositAmount }}</span>
        <span v-if="count === 0" class="amount-placeholder">
          {{ t("Enter amount") }}
        </span>
      </div>

      <div class="keypad-inline">
        <div class="keypad-inline-head">
          <div>
            <div class="section-kicker">
              {{ t('Manual Input') }}
            </div>
            <div class="keypad-copy">
              {{ t('Use the keypad below to adjust the visible amount instantly.') }}
            </div>
          </div>
          <div class="section-pill section-pill-muted">
            {{ t('Keypad') }}
          </div>
        </div>
        <div class="keypad-shell">
          <Keypad v-model="displayValue" :show-decimal="false" />
        </div>
      </div>
    </section>

    <section class="surface-card method-card">
      <div class="section-head">
        <div>
          <div class="section-kicker">
            {{ t('Payment Method') }}
          </div>
          <div class="section-title">
            {{ t('API-backed channel configuration') }}
          </div>
        </div>
      </div>

        <div class="method-list">
          <button
            v-for="item in methodsList"
            :key="getMethodKey(item)"
            type="button"
            class="method-option"
            :class="{ 'method-option-active': isMethodSelected(item) }"
            @click="handleSelectMethod(item)"
          >
            <span class="method-option-label">{{ getMethodName(item) }}</span>
            <span class="method-option-radio" :class="{ 'method-option-radio-active': isMethodSelected(item) }">
              <span class="method-option-radio-dot" />
            </span>
          </button>
        </div>

        <div class="spec-grid">
          <div class="spec-card">
            <span class="spec-label">{{ t('Min') }}</span>
            <strong class="spec-value">{{ methodMinAmountLabel }}</strong>
          </div>
          <div class="spec-card">
            <span class="spec-label">{{ t('Max') }}</span>
            <strong class="spec-value">{{ methodMaxAmountLabel }}</strong>
          </div>
        </div>

    </section>
    
    <div class="html text-[#fff]" v-html="optimizeRichText(rechargeNote||'')"></div>
    <BottomButton :button-text="t('Deposit Preview')" color="#1b1b1b" @click="onConfirm" />
  </div>
</template>

<style lang="less" scoped>
.cashier-center-content {
  --cashier-bg: #050505;
  --cashier-surface: linear-gradient(180deg, rgba(17, 17, 17, 0.96) 0%, rgba(8, 8, 8, 0.96) 100%);
  --cashier-border: rgba(255, 255, 255, 0.06);
  --cashier-title: #f5f5f5;
  --cashier-copy: #a3a3a3;
  --cashier-muted: #6b6b6b;
  --cashier-accent: #8bffbe;
  --cashier-accent-soft: rgba(124, 255, 178, 0.08);
  --cashier-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.04), inset 0 -8px 20px rgba(0, 0, 0, 0.45), 0 8px 24px rgba(0, 0, 0, 0.45);
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at top, rgba(124, 255, 178, 0.16), transparent 30%),
    linear-gradient(180deg, #050505 0%, var(--cashier-bg) 48%, #000 100%);
  padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
}

.cashier-center-content::before,
.cashier-center-content::after {
  position: absolute;
  border-radius: 999px;
  content: '';
  pointer-events: none;
}

.cashier-center-content::before {
  top: 126px;
  right: -72px;
  width: 188px;
  height: 188px;
  background: rgba(124, 255, 178, 0.12);
  filter: blur(6px);
}

.cashier-center-content::after {
  top: 390px;
  left: -92px;
  width: 220px;
  height: 220px;
  background: rgba(216, 146, 27, 0.12);
}

.cashier-nav {
  position: relative;
  z-index: 2;
}

.cashier-nav :deep(.van-nav-bar) {
  background: rgba(8, 8, 8, 0.72);
  transition:
    background-color 0.22s ease,
    box-shadow 0.22s ease,
    backdrop-filter 0.22s ease,
    border-color 0.22s ease;
}

.cashier-nav :deep(.van-nav-bar__content) {
  padding-inline: 20px;
  transition: padding 0.22s ease;
}

.cashier-nav :deep(.van-nav-bar__left) {
  left: 0;
}

.cashier-nav-solid :deep(.van-nav-bar) {
  background: rgba(8, 8, 8, 0.92);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(16px);
}

.cashier-nav-solid :deep(.van-nav-bar)::after {
  border-color: rgba(255, 255, 255, 0.06);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(124, 255, 178, 0.18);
  border-radius: 14px;
  background: rgba(124, 255, 178, 0.08);
  box-shadow: inset 0 0 0 1px rgba(124, 255, 178, 0.12), 0 0 18px rgba(124, 255, 178, 0.14);
  backdrop-filter: blur(14px);
}

.nav-copy {
  display: grid;
  gap: 2px;
}

.nav-eyebrow,
.section-kicker {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cashier-accent);
}

.nav-title,
.section-title,
.hero-title {
  color: var(--cashier-title);
}

.nav-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
}

.hero-panel,
.surface-card {
  position: relative;
  z-index: 1;
}

.hero-panel {
  margin-top: 8px;
  margin-bottom: 20px;
}

.hero-badge,
.section-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(124, 255, 178, 0.35);
  border-radius: 999px;
  background: rgba(124, 255, 178, 0.08);
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  color: var(--cashier-accent);
  backdrop-filter: blur(16px);
}

.hero-title {
  margin: 14px 0 10px;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.14;
  letter-spacing: -0.04em;
}

.hero-copy,
.keypad-copy,
.spec-label {
  color: var(--cashier-copy);
}

.hero-copy {
  max-width: 92%;
  font-size: 14px;
  line-height: 1.6;
}

.surface-card {
  margin-bottom: 18px;
  border: 1px solid var(--cashier-border);
  border-radius: 28px;
  background: var(--cashier-surface);
  box-shadow: var(--cashier-shadow);
  padding: 18px;
  backdrop-filter: blur(18px);
}

.amount-card {
  overflow: hidden;
}

.amount-card::after {
  position: absolute;
  top: -44px;
  right: -26px;
  width: 132px;
  height: 132px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(124, 255, 178, 0.16) 0%, rgba(124, 255, 178, 0) 70%);
  content: '';
}

.section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.section-title {
  margin-top: 5px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.section-pill {
  flex-shrink: 0;
}

.section-pill-muted {
  color: var(--cashier-muted);
}

.amount-display {
  position: relative;
  display: flex;
  align-items: baseline;
  min-height: 132px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  padding: 30px 22px 24px;
}

.amount-value {
  font-size: 44px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  color: var(--cashier-title);
}

.amount-placeholder {
  position: absolute;
  left: 22px;
  bottom: 20px;
  font-size: 14px;
  color: var(--cashier-muted);
}

.method-list {
  display: grid;
  gap: 12px;
}

.method-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.03);
  padding: 18px;
  text-align: left;
  color: inherit;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.method-option-active {
  transform: translateY(-1px);
  border-color: rgba(124, 255, 178, 0.35);
  background: rgba(124, 255, 178, 0.08);
  box-shadow: 0 0 12px rgba(124, 255, 178, 0.18);
}

.method-option-label {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--cashier-title);
}

.method-option-radio {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border: 1.5px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.method-option-radio-active {
  border-color: #8bffbe;
  background: rgba(124, 255, 178, 0.08);
  box-shadow: 0 0 12px rgba(124, 255, 178, 0.22);
}

.method-option-radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #8bffbe;
  transform: scale(0);
  transition: transform 0.18s ease;
}

.method-option-radio-active .method-option-radio-dot {
  transform: scale(1);
}

.spec-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.spec-card {
  display: grid;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
}

.spec-value {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--cashier-title);
}


.keypad-copy {
  margin: 4px 0 0;
}

.keypad-inline {
  margin-top: 18px;
}

.keypad-inline-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.keypad-shell {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
}

.keypad-shell :deep(.keypad-row) {
  margin-bottom: 10px;
  gap: 10px;
}

.keypad-shell :deep(.keypad-row:last-child) {
  margin-bottom: 0;
}

.keypad-shell :deep(.keypad-btn) {
  height: 58px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  background: linear-gradient(180deg, #111 0%, #0b0b0b 100%);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.04), 0 8px 16px rgba(0, 0, 0, 0.3);
  font-size: 20px;
  font-weight: 700;
  color: #f5f5f5;
}

@media (max-width: 360px) {
  .hero-title {
    font-size: 26px;
  }

  .amount-value {
    font-size: 36px;
  }

  .spec-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

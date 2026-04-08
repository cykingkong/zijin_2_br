<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/modules/loading'

import { deposit, rechargeMethods } from '@/api/billing'
import { formatRupiah } from '@/utils/tool'

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
const isNavSolid = ref(false)

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

function formatDisplayNumber(value: any) {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue))
    return '--'
  return formatRupiah(numericValue)
}

const methodColumns = computed(() =>
  methodsList.value.map(item => ({
    text: getMethodName(item),
    value: getMethodKey(item),
  })),
)

const selectedMethodName = computed(() => getMethodName(selectedMethod.value) || t('BRL Pay'))
const formattedDepositAmount = computed(() => (count.value === 0 ? formatRupiah(0) : formatDisplayNumber(count.value)))
const methodEntranceLabel = computed(() => selectedMethod.value?.entrance || '--')
const methodModeLabel = computed(() => selectedMethod.value?.mode || '--')
const methodMinAmountLabel = computed(() => formatDisplayNumber(selectedMethod.value?.min_amount))
const methodMaxAmountLabel = computed(() => formatDisplayNumber(selectedMethod.value?.max_amount))

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
  <div class="cashier-center-content w-full px-20 pb-120 pt-[8px]">
    <VanNavBar
      class="cashier-nav" :class="{ 'cashier-nav-solid': isNavSolid }" title="" :fixed="true" clickable
      :left-arrow="true" z-index="999" placeholder @click-left="onBack"
    >
      <template #left>
        <div class="nav-left">
          <div class="nav-icon-wrap">
            <svg class="h-28 w-28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M23.3333 14.3201C23.3333 14.763 23.0041 15.1291 22.577 15.1871L22.4583 15.1951L4.95831 15.1951C4.47506 15.1951 4.08331 14.8033 4.08331 14.3201C4.08331 13.8771 4.41249 13.511 4.83958 13.4531L4.95831 13.4451L22.4583 13.4451C22.9416 13.4451 23.3333 13.8368 23.3333 14.3201Z"
                fill="#0F172A"
              />
              <path
                d="M12.6338 20.7284C12.9762 21.0694 12.9774 21.6234 12.6365 21.9658C12.3265 22.2771 11.8404 22.3064 11.4974 22.053L11.399 21.9685L4.3407 14.9405C4.02846 14.6296 4.00005 14.1418 4.2555 13.7987L4.34065 13.7004L11.399 6.67126C11.7414 6.33026 12.2954 6.33141 12.6364 6.67382C12.9464 6.98511 12.9737 7.47128 12.7188 7.8133L12.6339 7.91126L6.19848 14.3208L12.6338 20.7284Z"
                fill="#0F172A"
              />
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
        {{ t('Choose a payment rail from the API response, apply a preset amount, or enter a custom value with the keypad below.') }}
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

      <button type="button" class="method-trigger" @click="showPicker = true">
        <div>
          <div class="trigger-label">
            {{ t('Current channel') }}
          </div>
          <div class="trigger-value">
            {{ selectedMethodName }}
          </div>
        </div>
        <div class="trigger-action">
          <span>{{ t('Change') }}</span>
          <svg class="h-20 w-20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.5 4.16675L13.3333 10.0001L7.5 15.8334" stroke="currentColor" stroke-width="1.67"
              stroke-linecap="round" stroke-linejoin="round"
            />
          </svg>
        </div>
      </button>

      <div class="spec-grid">
        <div class="spec-card">
          <span class="spec-label">{{ t('Gateway') }}</span>
          <strong class="spec-value">{{ methodEntranceLabel }}</strong>
        </div>
        <div class="spec-card">
          <span class="spec-label">{{ t('Mode') }}</span>
          <strong class="spec-value">{{ methodModeLabel }}</strong>
        </div>
        <div class="spec-card">
          <span class="spec-label">{{ t('Min') }}</span>
          <strong class="spec-value">{{ methodMinAmountLabel }}</strong>
        </div>
        <div class="spec-card">
          <span class="spec-label">{{ t('Max') }}</span>
          <strong class="spec-value">{{ methodMaxAmountLabel }}</strong>
        </div>
      </div>

      <div v-if="amountScopeList.length" class="scope-section">
        <div class="scope-head">
          <div class="section-kicker">
            {{ t('Preset Amounts') }}
          </div>
          <div class="scope-copy">
            {{ t('Tap any preset to sync amount instantly.') }}
          </div>
        </div>

        <div class="scope-grid">
          <button
            v-for="(item, index) in amountScopeList" :key="index" type="button" class="scope-chip"
            :class="{ 'scope-chip-active': isAmountScopeActive(item) }"
            @click="handleSelectAmountScope(item)"
          >
            <span class="scope-chip-label">{{ t('Preset') }}</span>
            <span class="scope-chip-value">{{ getAmountScopeLabel(item) }}</span>
          </button>
        </div>
      </div>
    </section>

    <BottomButton :button-text="t('Deposit Preview')" color="#1b1b1b" @click="onConfirm" />
    <van-popup
      v-model:show="showPicker" class="method-popup" destroy-on-close round position="bottom"
      :safe-area-inset-bottom="true"
    >
      <van-picker
        :title="t('Select payment method')" :columns="methodColumns"
        :model-value="[getMethodKey(selectedMethod)]" :confirm-button-text="t('Confirm')"
        :cancel-button-text="t('Cancel')" @confirm="handleMethodConfirm" @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.cashier-center-content {
  --cashier-bg: #f4f7fb;
  --cashier-surface: rgba(255, 255, 255, 0.88);
  --cashier-border: rgba(148, 163, 184, 0.18);
  --cashier-title: #0f172a;
  --cashier-copy: #475569;
  --cashier-muted: #64748b;
  --cashier-accent: #0f766e;
  --cashier-accent-soft: rgba(15, 118, 110, 0.08);
  --cashier-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(45, 212, 191, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 24%),
    linear-gradient(180deg, #f8fbff 0%, var(--cashier-bg) 48%, #edf2f7 100%);
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
  background: rgba(255, 255, 255, 0.5);
  filter: blur(6px);
}

.cashier-center-content::after {
  top: 390px;
  left: -92px;
  width: 220px;
  height: 220px;
  background: rgba(191, 219, 254, 0.28);
}

.cashier-nav {
  position: relative;
  z-index: 2;
}

.cashier-nav :deep(.van-nav-bar) {
  background: transparent;
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
  background: rgba(248, 250, 252, 0.9);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(16px);
}

.cashier-nav-solid :deep(.van-nav-bar)::after {
  border-color: rgba(226, 232, 240, 0.9);
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
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
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
  border: 1px solid rgba(15, 118, 110, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.74);
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
.scope-copy,
.keypad-copy,
.spec-label,
.trigger-label {
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
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.82) 100%);
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
  background: radial-gradient(circle, rgba(45, 212, 191, 0.18) 0%, rgba(45, 212, 191, 0) 70%);
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
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.96) 0%, rgba(255, 255, 255, 0.98) 100%);
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

.spec-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.spec-card {
  display: grid;
  gap: 8px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 20px;
  background: rgba(248, 250, 252, 0.85);
  padding: 16px;
}

.spec-value,
.trigger-value {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--cashier-title);
}

.method-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
  padding: 18px;
  text-align: left;
  color: inherit;
}

.trigger-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  background: var(--cashier-accent-soft);
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--cashier-accent);
}

.spec-grid {
  margin-top: 16px;
}

.scope-section {
  margin-top: 20px;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  padding-top: 18px;
}

.scope-head {
  margin-bottom: 14px;
}

.scope-copy,
.keypad-copy,
.spec-label,
.trigger-label {
  font-size: 13px;
  line-height: 1.5;
}

.scope-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.scope-chip {
  display: grid;
  gap: 6px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.82);
  padding: 14px;
  text-align: left;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.scope-chip-label {
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cashier-muted);
}

.scope-chip-value {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--cashier-title);
}

.scope-chip-active {
  transform: translateY(-1px);
  border-color: rgba(15, 118, 110, 0.28);
  background: linear-gradient(135deg, rgba(15, 118, 110, 0.1) 0%, rgba(255, 255, 255, 0.98) 100%);
  box-shadow: 0 16px 32px rgba(15, 118, 110, 0.14);
}

.scope-chip-active .scope-chip-label,
.scope-chip-active .scope-chip-value {
  color: #0f766e;
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
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 24px;
  background: rgba(248, 250, 252, 0.75);
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
  border: 1px solid rgba(203, 213, 225, 0.9);
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.04);
  font-size: 20px;
  font-weight: 700;
}

.method-popup :deep(.van-popup) {
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  background: linear-gradient(180deg, #fcfdff 0%, #f3f7fb 100%);
}

.method-popup :deep(.van-picker) {
  --van-picker-background: transparent;
  --van-picker-option-text-color: #0f172a;
  --van-picker-mask-color:
    linear-gradient(180deg, rgba(244, 247, 251, 0.96), rgba(244, 247, 251, 0.6)),
    linear-gradient(0deg, rgba(244, 247, 251, 0.96), rgba(244, 247, 251, 0.6));
}

.method-popup :deep(.van-picker__toolbar) {
  padding-inline: 16px;
}

.method-popup :deep(.van-picker__title) {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.method-popup :deep(.van-picker__confirm) {
  color: #0f766e;
  font-weight: 700;
}

@media (max-width: 360px) {
  .hero-title {
    font-size: 26px;
  }

  .amount-value {
    font-size: 36px;
  }

  .spec-grid,
  .scope-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

<template>
  <div class="prize-page min-h-screen bg-[#f4f0ff] pb-[120px]">
    <div class="px-[16px] pt-[16px]">
      <div class="hero-card rounded-[24px] p-[16px] text-white relative overflow-hidden">
        <div class="relative z-[1] flex items-start justify-between gap-[12px]">
          <div>
            <div class="text-[13px] opacity-80 mb-[6px]">{{ t('Prize Draw') }}</div>
            <div class="text-[30px] leading-[1] font-bold">{{ displayPoints }}</div>
            <div class="text-[12px] opacity-80 mt-[8px]">{{ t('Available Points') }}</div>
          </div>
          <div class="text-right">
            <div class="text-[12px] opacity-80 mb-[6px]">{{ t('Current Round') }}</div>
            <div class="text-[18px] font-bold">{{ currentRoundLabel }}</div>
          </div>
        </div>
        <div
          class="relative z-[1] mt-[14px] rounded-[16px] bg-[#ffffff1f] px-[12px] py-[10px] text-[12px] leading-[1.6]">
          {{ exchangeRuleText }}
        </div>
      </div>
    </div>

    <div class="px-[16px] mt-[14px] grid grid-cols-3 gap-[10px]">
      <div v-for="key in keyCards" :key="key.type" class="key-card rounded-[18px] p-[12px]" :class="key.cardClass"
        @click="openExchangePopup">
        <div class="flex items-center justify-between mb-[8px]">
          <div class="text-[20px]">{{ key.icon }}</div>
          <div class="text-[11px] px-[8px] py-[2px] rounded-[999px] bg-[#ffffff99] text-[#333]">
            {{ key.ruleText }}
          </div>
        </div>
        <div class="text-[13px] font-semibold mb-[4px]">{{ key.name }}</div>
        <div class="text-[24px] font-bold leading-[1]">{{ key.count }}</div>
      </div>
    </div>

    <div class="px-[16px] mt-[14px]">
      <div class="flex gap-[8px] rounded-[18px] bg-white p-[6px] shadow-sm">
        <div v-for="pool in poolTabs" :key="pool.type"
          class="flex-1 h-[42px] rounded-[14px] flex items-center justify-center text-[14px] font-semibold transition-all"
          :class="activePoolType === pool.type ? pool.activeClass : 'text-[#8f86aa]'" @click="switchPool(pool.type)">
          {{ pool.name }}
        </div>
      </div>
    </div>

    <div class="px-[16px] mt-[16px]">
      <div class="bg-white rounded-[24px] p-[16px] shadow-sm">
        <div class="flex items-center justify-between mb-[12px]">
          <div>
            <div class="text-[16px] font-bold text-[#251b44]">{{ currentPoolName }}</div>
            <div class="text-[12px] text-[#8f86aa] mt-[2px]">
              {{ t('Round') }} {{ currentRoundDisplay }}
            </div>
          </div>
          <div class="text-[12px] px-[10px] py-[5px] rounded-[999px] bg-[#f2ecff] text-[#7c3aed]">
            {{ revealStateText }}
          </div>
        </div>

        <div class="grid grid-cols-3 gap-[10px]">
          <div v-for="(card, index) in displayCards" :key="`${activePoolType}-${index}`"
            class="prize-card h-[112px] rounded-[18px] border-[1px] relative overflow-hidden"
            :class="getCardClass(card, index)" @click="selectCard(index + 1)">
            <template v-if="poolIsEmpty">
              <div class="h-full flex flex-col items-center justify-center px-[8px] text-center">
                <div class="text-[26px] mb-[8px]">📭</div>
                <div class="text-[12px] font-semibold text-[#251b44]">{{ t('Empty Pool') }}</div>
                <div class="text-[11px] text-[#8f86aa] mt-[4px]">{{ emptyPoolMessage }}</div>
              </div>
            </template>

            <template v-else-if="isCurrentPoolDrawn">
              <div v-if="Number(card?.high_value) === 1"
                class="absolute right-[6px] top-[6px] z-[2] rounded-[999px] bg-[#059669] px-[6px] py-[2px] text-[10px] text-white">
                {{ t('Valioso') }}
              </div>

              <div class="h-full flex flex-col items-center justify-center px-[8px] text-center">
                <template v-if="card?.isWin === 1">
                  <img v-if="card?.prizeImage || card?.image" :src="card?.prizeImage || card?.image"
                    class="w-[34px] h-[34px] rounded-[10px] object-cover mb-[6px]" />
                  <div v-else class="text-[24px] mb-[6px]">
                    {{ getRewardEmoji(card?.rewardType) }}
                  </div>

                  <div class="text-[12px] font-semibold text-[#251b44] line-clamp-2">
                    {{ card?.prizeName || card?.name || '--' }}
                  </div>
                  <div class="text-[12px] font-bold mt-[4px]" :class="currentPoolAccentClass">
                    {{ card?.showValue || '--' }}
                  </div>
                </template>

                <template v-else>
                  <img v-if="card?.prizeImage || card?.image" :src="card?.prizeImage || card?.image"
                    class="w-[34px] h-[34px] rounded-[10px] object-cover mb-[6px] opacity-60" />
                  <div v-else class="text-[24px] mb-[6px] opacity-60">
                    {{ getRewardEmoji(card?.rewardType) }}
                  </div>

                  <div class="text-[12px] font-semibold text-[#8f86aa] line-clamp-2">
                    {{ t('Prize') }}
                  </div>
                  <div class="text-[12px] mt-[4px] text-[#8f86aa]">
                    {{ card?.showValue || '--' }}

                  </div>
                </template>
              </div>
            </template>

            <template v-else>
              <div class="h-full flex flex-col items-center justify-center">
                <div class="text-[28px] mb-[8px]">🔒</div>
                <div class="text-[12px] text-[#8f86aa] text-center">{{ selectedCardNo === index + 1 ?
                  t('Selected') : t('Tap to pick') }}</div>
              </div>
            </template>
          </div>
        </div>

        <div v-if="poolIsEmpty"
          class="mt-[14px] rounded-[16px] bg-[#f6f2ff] px-[14px] py-[12px] text-[12px] text-[#5a4e7a] leading-[1.6]">
          {{ emptyPoolMessage }}
        </div>

        <div v-else-if="isCurrentPoolDrawn && currentDeliverText"
          class="mt-[14px] rounded-[16px] bg-[#f6f2ff] px-[14px] py-[12px] text-[12px] text-[#5a4e7a] leading-[1.6]">
          <div class="font-semibold text-[#251b44] mb-[4px]">{{ currentPrizeName }}</div>
          <div>{{ t('The prize has been awarded') }}</div>
        </div>
      </div>
    </div>

    <div class="px-[16px] mt-[16px]">
      <button class="h-[52px] w-full rounded-[18px] border-none text-[16px] font-bold text-white"
        :class="drawButtonClass" :disabled="drawDisabled" @click="handleDraw">
        {{ drawButtonText }}
      </button>
      <button v-if="isCurrentPoolDrawn"
        class="mt-[10px] h-[48px] w-full rounded-[18px] border-none bg-[#7c3aed] text-[15px] font-bold text-white"
        :disabled="resetting" @click="handleNextRound">
        {{ resetting ? t('Loading') : t('Next Round') }}
      </button>
    </div>

    <div class="px-[16px] mt-[20px]">
      <div class="rounded-[24px] bg-white p-[16px] shadow-sm">
        <div class="flex gap-[8px] rounded-[16px] bg-[#f5f2ff] p-[6px] mb-[14px]">
          <div class="flex-1 h-[38px] rounded-[12px] flex items-center justify-center text-[13px] font-semibold"
            :class="recordTab === 'draw' ? 'bg-white text-[#251b44]' : 'text-[#8f86aa]'"
            @click="switchRecordTab('draw')">
            {{ t('Draw Records') }}
          </div>
          <div class="flex-1 h-[38px] rounded-[12px] flex items-center justify-center text-[13px] font-semibold"
            :class="recordTab === 'point' ? 'bg-white text-[#251b44]' : 'text-[#8f86aa]'"
            @click="switchRecordTab('point')">
            {{ t('Point Records') }}
          </div>
        </div>

        <template v-if="recordTab === 'draw'">
          <div v-if="drawLogs.length" class="flex flex-col gap-[10px]">
            <div v-for="item in drawLogs" :key="item.id" class="rounded-[16px] bg-[#faf8ff] p-[12px]">
              <div class="flex items-center justify-between gap-[8px]">
                <div class="text-[14px] font-semibold text-[#251b44]">{{ item.prizeName || '--' }}</div>
                <div class="text-[12px]" :class="deliverStatusClass(item.deliverStatus)">{{
                  getDeliverStatusText(item.deliverStatus) }}</div>
              </div>
              <div class="text-[12px] text-[#7f7598] mt-[6px]">{{ item.showValue || '--' }} · {{
                getPoolName(item.poolType) }} · {{ t('Round') }} {{ item.roundIndex || '--' }}</div>
              <div class="text-[11px] text-[#9b8fb5] mt-[4px]">{{ item.createdAt || '--' }}</div>
            </div>
            <LoadMore :status="drawLogStatus" @load-more="loadMoreDrawLogs" />
          </div>
          <empty v-else :no-tips="true" />
        </template>

        <template v-else>
          <div v-if="pointLogs.length" class="flex flex-col gap-[10px]">
            <div v-for="item in pointLogs" :key="item.id" class="rounded-[16px] bg-[#faf8ff] p-[12px]">
              <div class="flex items-center justify-between gap-[8px]">
                <div class="text-[14px] font-semibold text-[#251b44]">{{ getPointSourceText(item.sourceType) }}</div>
                <div class="text-[13px] font-bold" :class="item.changeType === 1 ? 'text-[#059669]' : 'text-[#db2777]'">
                  {{ item.changeType === 1 ? '+' : '-' }}{{ item.changePoint || 0 }}
                </div>
              </div>
              <!-- <div class="text-[12px] text-[#7f7598] mt-[6px]">{{ item.remark || '--' }}</div> -->
              <div class="text-[11px] text-[#9b8fb5] mt-[4px]">{{ item.createdAt || '--' }}</div>
            </div>
            <LoadMore :status="pointLogStatus" @load-more="loadMorePointLogs" />
          </div>
          <empty v-else :no-tips="true" />
        </template>
      </div>
    </div>

    <van-popup v-model:show="showExchangePopup" position="bottom" round>
      <div class="bg-[#f9f6ff] px-[16px] pt-[18px] pb-[28px]">
        <div class="text-[18px] font-bold text-center text-[#251b44] mb-[8px]">{{ t('Exchange Keys') }}</div>
        <div class="text-[13px] text-center text-[#8f86aa] mb-[16px]">
          {{ t('Available Points') }}: {{ displayPoints }}
        </div>
        <div class="flex flex-col gap-[10px]">
          <div v-for="key in keyCards" :key="`exchange-${key.type}`"
            class="rounded-[18px] bg-white p-[14px] flex items-center justify-between gap-[12px]">
            <div>
              <div class="text-[14px] font-semibold text-[#251b44]">{{ key.name }}</div>
              <div class="text-[12px] text-[#8f86aa] mt-[4px]">{{ t('Owned') }}: {{ key.count }} · {{ key.ruleText }}
              </div>
            </div>
            <button class="h-[36px] min-w-[92px] rounded-[12px] border-none text-[13px] font-semibold text-white"
              :class="key.buttonClass" :disabled="exchangingKeyType === key.type"
              @click="openExchangeCountDialog(key.type)">
              {{ exchangingKeyType === key.type ? t('Loading') : t('Exchange') }}
            </button>
          </div>
        </div>
      </div>
    </van-popup>

    <payKeypad ref="payKeypadRef" :title="exchangeDialogTitle" :sub-text="exchangeRemainingText" :show-close="true"
      prefix="" @on-click="handleExchangeConfirm" />

    <van-popup v-model:show="showPrizePopup" position="bottom" round>
      <div class="bg-[#f9f6ff] px-[20px] pt-[24px] pb-[32px] text-center">
        <div class="text-[14px] text-[#8f86aa] mb-[8px]">{{ t('Congratulations') }}</div>
        <div class="mx-auto mb-[12px] w-[84px] h-[84px] rounded-full flex items-center justify-center overflow-hidden"
          :class="prizeGlowClass">
          <img v-if="currentPrizeImage" :src="currentPrizeImage" class="w-[58px] h-[58px] object-contain" />
          <div v-else class="text-[42px]">
            {{ currentPrizeEmoji }}
          </div>
        </div>
        <div class="text-[22px] font-bold text-[#251b44] mb-[6px]">{{ currentPrizeName }}</div>
        <div class="text-[32px] font-bold mb-[8px]" :class="currentPoolAccentClass">{{ currentPrizeValue }}</div>
        <div class="text-[13px] leading-[1.7] text-[#7f7598] mb-[18px]">{{ t('The prize has been awarded') }}</div>
        <button class="h-[48px] w-full rounded-[16px] border-none bg-[#7c3aed] text-[15px] font-bold text-white"
          @click="showPrizePopup = false">
          {{ t('OK') }}
        </button>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { showSuccessToast, showToast } from 'vant'
import empty from '@/components/empty.vue'
import LoadMore from '@/components/LoadMore.vue'
import payKeypad from '@/components/payKeypad.vue'
import {
  drawPrize,
  exchangePrizeKey,
  getPrizeDrawLog,
  getPrizeHome,
  getPrizePointLog,
  getPrizePoolConfig,
  resetPrizeRound,
} from '@/api/prize'

const { t } = useI18n()

const poolTypeMap = {
  1: 'iron',
  2: 'silver',
  3: 'gold',
} as const

const poolLabelMap = {
  1: 'Iron Pool',
  2: 'Silver Pool',
  3: 'Gold Pool',
} as const

const keyNameMap = {
  1: 'Iron Key',
  2: 'Silver Key',
  3: 'Gold Key',
} as const

const rewardTypeMap = {
  1: '🎁',
  2: '💵',
  3: '📦',
  4: '🎟️',
  5: '💠',
} as const

const homeData = ref<any>({
  pointBalance: 0,
  keys: {
    iron: 0,
    silver: 0,
    gold: 0,
  },
  round: {
    iron: 1,
    silver: 1,
    gold: 1,
  },
  cardCache: {
    iron: null,
    silver: null,
    gold: null,
  },
  exchangeRules: [],
})

const activePoolType = ref<1 | 2 | 3>(1)
const poolData = ref<any>({
  poolType: 1,
  roundIndex: 1,
  isDrawn: 0,
  drawNo: '',
  prize: null,
  cards: [],
  deliverStatus: 0,
  deliverMsg: '',
  updatedAt: '',
})

const selectedCardNo = ref<number | null>(null)
const drawing = ref(false)
const resetting = ref(false)
const showExchangePopup = ref(false)
const showPrizePopup = ref(false)
const exchangingKeyType = ref<number | null>(null)
const pendingExchangeKeyType = ref<number | null>(null)
const exchangeCount = ref(1)
const payKeypadRef = ref<any>(null)
const initialized = ref(false)

const recordTab = ref<'draw' | 'point'>('draw')
const drawLogs = ref<any[]>([])
const pointLogs = ref<any[]>([])
const drawLogStatus = ref(1)
const pointLogStatus = ref(1)
const drawLogLoaded = ref(false)
const pointLogLoaded = ref(false)

const drawPage = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 0,
})

const pointPage = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 0,
})

const poolTabs = [
  { type: 1, name: t(poolLabelMap[1]), activeClass: 'bg-[#e8edf4] text-[#607080]' },
  { type: 2, name: t(poolLabelMap[2]), activeClass: 'bg-[#f2eafb] text-[#8f6eb0]' },
  { type: 3, name: t(poolLabelMap[3]), activeClass: 'bg-[#fff3cf] text-[#c08a08]' },
] as const

const displayPoints = computed(() => homeData.value?.pointBalance ?? 0)
const currentPoolKey = computed(() => poolTypeMap[activePoolType.value])
const currentPoolName = computed(() => getPoolName(activePoolType.value))
const currentRoundDisplay = computed(() => {
  if (poolData.value?.roundIndex) return poolData.value.roundIndex
  return homeData.value?.round?.[currentPoolKey.value] ?? 1
})
const currentRoundLabel = computed(() => `${currentPoolName.value} · ${t('Round')} ${currentRoundDisplay.value}`)
const isCurrentPoolDrawn = computed(() => Number(poolData.value?.isDrawn) === 1)
const revealStateText = computed(() => isCurrentPoolDrawn.value ? t('Revealed') : t('Not Drawn'))
const currentPrizeName = computed(() => poolData.value?.prize?.name || poolData.value?.prize?.prizeName || '--')
const currentPrizeValue = computed(() => poolData.value?.prize?.showValue || '--')
const currentPrizeImage = computed(() => poolData.value?.prize?.image || poolData.value?.prize?.prizeImage || '')
const currentPrizeEmoji = computed(() => getRewardEmoji(poolData.value?.prize?.rewardType))
const currentDeliverText = computed(() => poolData.value?.deliverMsg || getDeliverStatusText(poolData.value?.deliverStatus))
const poolIsEmpty = computed(() => Number(poolData.value?.code) === 1001)
const emptyPoolMessage = computed(() => poolData.value?.message || t('Prize pool is empty'))

const drawDisabled = computed(() => drawing.value || isCurrentPoolDrawn.value || !selectedCardNo.value || currentKeyCount.value <= 0 || poolIsEmpty.value)
const drawButtonText = computed(() => {
  if (drawing.value) return t('Loading')
  if (isCurrentPoolDrawn.value) return t('Revealed')
  if (poolIsEmpty.value) return t('Empty Pool')
  if (currentKeyCount.value <= 0) return t('Insufficient key')
  if (!selectedCardNo.value) return t('Select a Card')
  return t('Start Draw')
})

const currentKeyCount = computed(() => {
  const key = currentPoolKey.value
  return homeData.value?.keys?.[key] ?? 0
})

const currentPoolAccentClass = computed(() => {
  if (activePoolType.value === 1) return 'text-[#748595]'
  if (activePoolType.value === 2) return 'text-[#9a73b5]'
  return 'text-[#c28b09]'
})

const prizeGlowClass = computed(() => {
  if (activePoolType.value === 1) return 'bg-[#e8edf4]'
  if (activePoolType.value === 2) return 'bg-[#f2eafb]'
  return 'bg-[#fff3cf]'
})

const drawButtonClass = computed(() => {
  if (drawDisabled.value) return 'bg-[#d6cfee]'
  if (activePoolType.value === 1) return 'bg-[#748595]'
  if (activePoolType.value === 2) return 'bg-[#9a73b5]'
  return 'bg-[#c28b09]'
})

const exchangeRuleText = computed(() => {
  const rules = homeData.value?.exchangeRules || []
  if (!rules.length) return t('Use points to exchange keys and start drawing prizes.')
  return rules.map((rule: any) => `${getPoolName(rule.keyType)}: ${rule.pointCost}${t(' Points')}`).join('  ·  ')
})

const exchangeDialogTitle = computed(() => {
  if (pendingExchangeKeyType.value) return `${t('Exchange Quantity')} · ${t(keyNameMap[pendingExchangeKeyType.value])}`
  return t('Enter amount')
})

const exchangeRemainingText = computed(() => {
  if (!pendingExchangeKeyType.value) return ''
  const currentKey = keyCards.value.find((item) => item.type === pendingExchangeKeyType.value)
  if (!currentKey) return ''
  return `${t('Left')} ${currentKey.count} ${t('Codes')}`
})

const keyCards = computed(() => [
  {
    type: 1,
    name: t(keyNameMap[1]),
    icon: '🗝️',
    count: homeData.value?.keys?.iron ?? 0,
    ruleText: formatRuleText(1),
    cardClass: 'bg-[#e8edf4] text-[#51606f]',
    buttonClass: 'bg-[#748595]',
  },
  {
    type: 2,
    name: t(keyNameMap[2]),
    icon: '🔑',
    count: homeData.value?.keys?.silver ?? 0,
    ruleText: formatRuleText(2),
    cardClass: 'bg-[#f2eafb] text-[#8f6eb0]',
    buttonClass: 'bg-[#9a73b5]',
  },
  {
    type: 3,
    name: t(keyNameMap[3]),
    icon: '🪙',
    count: homeData.value?.keys?.gold ?? 0,
    ruleText: formatRuleText(3),
    cardClass: 'bg-[#fff3cf] text-[#c08a08]',
    buttonClass: 'bg-[#c28b09]',
  },
])

const displayCards = computed(() => {
  const cards = poolData.value?.cards || []
  if (cards.length) return cards
  return new Array(9).fill(null).map((_, index) => ({ id: index + 1 }))
})

const highValueCardId = computed(() => {
  let targetId: string | number | null = null
  let maxValue = Number.NEGATIVE_INFINITY

  displayCards.value.forEach((card: any, index: number) => {
    const raw = card?.showValue
    if (raw === undefined || raw === null || raw === '') return
    const numericValue = Number(String(raw).replace(/[^\d.-]/g, ''))
    if (Number.isNaN(numericValue)) return
    if (numericValue > maxValue) {
      maxValue = numericValue
      targetId = card?.id ?? card?.cardNo ?? index
    }
  })

  return targetId
})

function formatRuleText(keyType: number) {
  const rule = (homeData.value?.exchangeRules || []).find((item: any) => Number(item.keyType) === keyType)
  if (!rule) return '--'
  return `${rule.pointCost}${t(' Points')}`
}

function openExchangePopup() {
  showExchangePopup.value = true
}

function openExchangeCountDialog(keyType: number) {
  pendingExchangeKeyType.value = keyType
  exchangeCount.value = 1
  payKeypadRef.value?.show(true, 1)
}

function getPoolName(type: number) {
  return t(poolLabelMap[Number(type) as keyof typeof poolLabelMap] || poolLabelMap[1])
}

function getPoolCacheByType(type: number) {
  const key = poolTypeMap[type as 1 | 2 | 3]
  return homeData.value?.cardCache?.[key] || null
}

function getRewardEmoji(rewardType: number) {
  return rewardTypeMap[rewardType as keyof typeof rewardTypeMap] || '🎉'
}

function getDeliverStatusText(status: number) {
  if (Number(status) === 1) return t('Delivered')
  if (Number(status) === 2) return t('Delivery Failed')
  return t('Pending Delivery')
}

function deliverStatusClass(status: number) {
  if (Number(status) === 1) return 'text-[#059669]'
  if (Number(status) === 2) return 'text-[#db2777]'
  return 'text-[#c08a08]'
}

function getPointSourceText(sourceType: string) {
  const sourceMap: Record<string, string> = {
    exchange_key: t('Exchange Key'),
    draw_reward: t('Draw Reward'),
    invite_lottery: t('Invite Reward'),
    repurchase_lottery: t('Repurchase Reward'),
    admin_adjust: t('Admin Adjust'),
    refund: t('Refund'),
  }
  return sourceMap[sourceType] || sourceType || '--'
}

function isHighValueCard(card: any, index?: number) {
  if (!card) return false
  const cardId = card?.id ?? card?.cardNo ?? index
  return cardId !== undefined && cardId === highValueCardId.value
}

function getCardClass(card: any, index: number) {
  if (isCurrentPoolDrawn.value) {
    if (card?.isWin === 1) return 'border-[#059669] bg-[#ecfdf5]'
    if (activePoolType.value === 1) return 'border-[#d5dde6] bg-[#f7f9fc]'
    if (activePoolType.value === 2) return 'border-[#e4d7f1] bg-[#fbf8ff]'
    return 'border-[#f3df9c] bg-[#fffbee]'
  }

  if (selectedCardNo.value === index + 1) {
    if (activePoolType.value === 1) return 'border-[#748595] bg-[#eef3f8]'
    if (activePoolType.value === 2) return 'border-[#9a73b5] bg-[#f6f0fb]'
    return 'border-[#c28b09] bg-[#fff7de]'
  }

  if (activePoolType.value === 1) return 'border-[#dbe2ea] bg-[#f7f9fc]'
  if (activePoolType.value === 2) return 'border-[#e8ddf4] bg-[#fbf8ff]'
  return 'border-[#f5e5b6] bg-[#fffdf3]'
}

function applyHomePartial(data: any) {
  homeData.value = {
    ...homeData.value,
    ...data,
    keys: {
      ...homeData.value.keys,
      ...(data?.keys || {}),
    },
    round: {
      ...homeData.value.round,
      ...(data?.round || {}),
    },
    cardCache: {
      ...homeData.value.cardCache,
      ...(data?.cardCache || {}),
    },
  }
}

function buildPoolDataFromCache(cache: any, poolType: number) {
  if (!cache) return null
  return {
    poolType,
    roundIndex: cache.round,
    isDrawn: 1,
    drawNo: cache.drawNo,
    prize: cache.prize
      ? {
        id: cache.prize.id,
        name: cache.prize.name || cache.prize.prizeName,
        image: cache.prize.image || cache.prize.prizeImage,
        showValue: cache.prize.showValue,
        rewardType: cache.prize.rewardType,
      }
      : null,
    cards: cache.cards || [],
    deliverStatus: cache.deliverStatus,
    deliverMsg: cache.deliverMsg,
    updatedAt: cache.updatedAt,
  }
}

async function fetchHome() {
  const { data } = await getPrizeHome()
  applyHomePartial(data || {})
}

async function fetchPoolConfig(poolType: 1 | 2 | 3) {
  const cache = getPoolCacheByType(poolType)
  if (cache) {
    const cachedPool = buildPoolDataFromCache(cache, poolType)
    if (cachedPool) {
      poolData.value = cachedPool
      return
    }
  }

  const response = await getPrizePoolConfig(poolType)
  const data = response?.data || {}
  poolData.value = {
    poolType,
    roundIndex: homeData.value?.round?.[poolTypeMap[poolType]] ?? 1,
    isDrawn: Number(data?.isDrawn) || 0,
    drawNo: data?.drawNo || '',
    prize: data?.prize || null,
    cards: data?.cards || [],
    deliverStatus: data?.deliverStatus || 0,
    deliverMsg: data?.deliverMsg || '',
    updatedAt: data?.updatedAt || '',
    success: response?.success,
    code: response?.code,
    message: response?.message || '',
  }
}

async function initPage() {
  await fetchHome()
  await fetchPoolConfig(activePoolType.value)
  await fetchDrawLogs(true)
  initialized.value = true
}

async function switchPool(type: 1 | 2 | 3) {
  if (activePoolType.value === type) return
  activePoolType.value = type
  selectedCardNo.value = null
  await fetchPoolConfig(type)
}

function selectCard(cardNo: number) {
  if (drawing.value || isCurrentPoolDrawn.value || poolIsEmpty.value) return
  selectedCardNo.value = cardNo
}

async function handleDraw() {
  if (drawDisabled.value) {
    if (poolIsEmpty.value) showToast(emptyPoolMessage.value)
    else if (currentKeyCount.value <= 0) showToast(t('Insufficient key'))
    else if (!selectedCardNo.value) showToast(t('Select a Card'))
    return
  }

  drawing.value = true
  try {
    const { data } = await drawPrize({
      poolType: activePoolType.value,
      clientCardNo: selectedCardNo.value,
    })

    applyHomePartial({
      pointBalance: data?.pointBalance,
      keys: data?.keys,
      round: data?.round,
      cardCache: {
        [currentPoolKey.value]: {
          round: currentRoundDisplay.value,
          drawNo: data?.drawNo,
          prize: data?.prize,
          cards: data?.boardCards || [],
          deliverStatus: data?.deliverStatus,
          deliverMsg: data?.deliverMsg,
          updatedAt: new Date().toISOString(),
        },
      },
    })

    poolData.value = {
      poolType: activePoolType.value,
      roundIndex: currentRoundDisplay.value,
      isDrawn: 1,
      drawNo: data?.drawNo,
      prize: data?.prize,
      cards: data?.boardCards || [],
      deliverStatus: data?.deliverStatus,
      deliverMsg: data?.deliverMsg,
      updatedAt: new Date().toISOString(),
    }

    showPrizePopup.value = true
    showSuccessToast(data?.cached ? t('Opened cached result') : t('Draw Success'))
    drawPage.pageIndex = 1
    await fetchDrawLogs(true)
  }
  finally {
    drawing.value = false
  }
}

async function handleNextRound() {
  resetting.value = true
  try {
    const { data } = await resetPrizeRound({ poolType: activePoolType.value })
    applyHomePartial({
      pointBalance: data?.pointBalance,
      keys: data?.keys,
      round: data?.round,
      cardCache: {
        [currentPoolKey.value]: null,
      },
    })
    selectedCardNo.value = null
    showPrizePopup.value = false
    await fetchPoolConfig(activePoolType.value)
  }
  finally {
    resetting.value = false
  }
}

async function handleExchangeKey(keyType: number, count: number) {
  exchangingKeyType.value = keyType
  try {
    const { data } = await exchangePrizeKey({ keyType, count })
    applyHomePartial({
      pointBalance: data?.pointBalance,
      keys: data?.keys,
    })
    showSuccessToast(t('Exchange Success'))
  }
  finally {
    exchangingKeyType.value = null
  }
}

async function handleExchangeConfirm(count: number) {
  const keyType = pendingExchangeKeyType.value
  const normalizedCount = Number(count)

  if (!keyType) return
  if (!Number.isInteger(normalizedCount) || normalizedCount <= 0) {
    showToast(t('Please enter a valid quantity'))
    return
  }

  exchangeCount.value = normalizedCount
  await handleExchangeKey(keyType, exchangeCount.value)
}

async function fetchDrawLogs(reset = false) {
  if (reset) {
    drawPage.pageIndex = 1
    drawLogStatus.value = 1
  }

  const { data } = await getPrizeDrawLog({
    pageIndex: drawPage.pageIndex,
    pageSize: drawPage.pageSize,
  })

  const rows = data?.rows || []
  drawPage.total = data?.total || 0
  drawLogs.value = drawPage.pageIndex === 1 ? rows : drawLogs.value.concat(rows)
  drawLogStatus.value = drawLogs.value.length >= drawPage.total ? 3 : 2
  drawLogLoaded.value = true
}

async function fetchPointLogs(reset = false) {
  if (reset) {
    pointPage.pageIndex = 1
    pointLogStatus.value = 1
  }

  const { data } = await getPrizePointLog({
    pageIndex: pointPage.pageIndex,
    pageSize: pointPage.pageSize,
  })

  const rows = data?.rows || []
  pointPage.total = data?.total || 0
  pointLogs.value = pointPage.pageIndex === 1 ? rows : pointLogs.value.concat(rows)
  pointLogStatus.value = pointLogs.value.length >= pointPage.total ? 3 : 2
  pointLogLoaded.value = true
}

async function loadMoreDrawLogs() {
  if (drawLogStatus.value !== 2) return
  drawPage.pageIndex += 1
  await fetchDrawLogs()
}

async function loadMorePointLogs() {
  if (pointLogStatus.value !== 2) return
  pointPage.pageIndex += 1
  await fetchPointLogs()
}

async function switchRecordTab(tab: 'draw' | 'point') {
  recordTab.value = tab
  if (tab === 'point' && !pointLogLoaded.value) {
    await fetchPointLogs(true)
  }
  if (tab === 'draw' && !drawLogLoaded.value) {
    await fetchDrawLogs(true)
  }
}

onMounted(async () => {
  await initPage()
})
</script>

<route lang="json5">
{
  name: 'prize',
  meta: {
    title: 'Prize Draw',
    i18n: 'Prize Draw'
  },
}
</route>

<style scoped lang="less">
.hero-card {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 55%, #db2777 100%);
  box-shadow: 0 12px 30px rgba(124, 58, 237, 0.2);
}

.hero-card::after {
  content: '';
  position: absolute;
  right: -20px;
  top: -20px;
  width: 120px;
  height: 120px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.key-card,
.prize-card {
  transition: all 0.2s ease;
}

.key-card:active,
.prize-card:active {
  transform: scale(0.98);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { showSuccessToast, showToast } from 'vant'
import empty from '@/components/empty.vue'
import payKeypad from '@/components/payKeypad.vue'
import { buyTreasure, getTreasureDrawLogList, getTreasureHome, getTreasureMyOrderList } from '@/api/treasure'
import type {
  LatestDrawGroup,
  OrderResultType,
  TreasureClassItem,
  TreasureDrawLogItem,
  TreasureHomeData,
  TreasureIssueItem,
  TreasureListData,
  TreasureOrderItem,
  TreasureOrderView,
  TreasureRecordTab,
} from '@/api/treasure'
import TreasureIssueCard from './components/TreasureIssueCard.vue'
import TreasureRecordPanel from './components/TreasureRecordPanel.vue'

const { t } = useI18n()

const homeData = ref<TreasureHomeData>({
  walletBalance: 0,
  classes: [],
  latestDrawLogs: [],
})

const activeClassId = ref<number>(1)
const issueList = ref<TreasureIssueItem[]>([])
const selectedIssue = ref<TreasureIssueItem | null>(null)
const selectedDrawIssue = ref<TreasureIssueItem | null>(null)
const buying = ref(false)
const payKeypadRef = ref<any>(null)
const recordTab = ref<TreasureRecordTab>('draw')

const drawLogs = ref<TreasureDrawLogItem[]>([])
const myOrders = ref<TreasureOrderView[]>([])
const drawLogStatus = ref(1)
const orderStatus = ref(1)
const drawLogLoaded = ref(false)
const orderLoaded = ref(false)
const orderDrawLogMap = reactive<Record<number, TreasureDrawLogItem | null>>({})

const drawLogPage = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 0,
})

const orderPage = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 0,
})

const ruleItems = [
  { icon: '💰', label: 'Recharge wallet only' },
  { icon: '🎟️', label: 'Each share gets one code' },
  { icon: '⏳', label: 'Sold out waits for draw' },
  { icon: '🏆', label: 'Check latest winners anytime' },
]

const classTabs = computed(() => {
  const classes = homeData.value?.classes || []
  return classes.map((item: TreasureClassItem) => ({
    classId: Number(item.classId),
    name: item.className || getClassName(item.classId),
    priceLabel: Number(item.classId) === 10 ? '10' : '1',
  }))
})

const walletBalance = computed(() => homeData.value?.walletBalance ?? 0)
const currentClassName = computed(() => getClassName(activeClassId.value))
const currentDrawFilter = computed<{ issueId?: number, goodsId?: number }>(() => {
  if (selectedDrawIssue.value?.goodsId)
    return { goodsId: selectedDrawIssue.value.goodsId }
  return {}
})
const buyDialogTitle = computed(() => {
  if (!selectedIssue.value)
    return t('Enter quantity')
  return `${t('Buy Quantity')} · ${selectedIssue.value.goodsName || ''}`
})
const latestDrawGoodsGroups = computed<LatestDrawGroup[]>(() => {
  const logs = homeData.value?.latestDrawLogs || []
  const groups = new Map<string, LatestDrawGroup>()

  logs.forEach((item) => {
    const key = item.goodsId ? `goods-${item.goodsId}` : `goods-name-${item.goodsName || item.id}`
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        goodsId: Number(item.goodsId || 0),
        goodsName: item.goodsName || '--',
        records: [],
      })
    }
    groups.get(key)?.records.push(item)
  })

  return Array.from(groups.values())
})
const winningOrders = computed(() => myOrders.value.filter(item => item.resultType === 'won'))

function getClassName(classId: number) {
  if (Number(classId) === 10)
    return t('Ten Yuan Zone')
  return t('One Yuan Zone')
}

function normalizeCodes(codes: TreasureOrderItem['codes']) {
  if (!Array.isArray(codes))
    return []
  return codes.map(code => String(code))
}

function getOrderResultType(order: TreasureOrderItem, drawLog: TreasureDrawLogItem | null): OrderResultType {
  if (!drawLog)
    return 'pending'
  const orderCodes = normalizeCodes(order.codes)
  return orderCodes.includes(String(drawLog.winnerCode)) ? 'won' : 'lost'
}

function getIssueSaleStats(issue: any) {
  const totalCodes = Math.max(Number(issue?.totalCodes || 0), 0)
  const soldCodes = Math.max(Number(issue?.soldCodes || 0), 0)
  const rawLeftCodes = Math.max(Number(issue?.leftCodes || 0), 0)
  const rawProgress = Number(issue?.progress || 0)

  const leftCodes = totalCodes > 0 ? Math.max(totalCodes - soldCodes, 0) : rawLeftCodes
  if (totalCodes <= 0) {
    const progress = Math.min(Math.max(Math.round(rawProgress), 0), 100)
    return {
      totalCodes,
      soldCodes,
      leftCodes,
      progress,
      remainingMode: progress >= 80 && progress < 100,
    }
  }

  const phaseOneSold = totalCodes * 0.3
  const phaseTwoSold = totalCodes * 0.605
  const soldRatio = Math.min(soldCodes, totalCodes)
  let progress = 0

  if (leftCodes <= 0 || soldRatio >= totalCodes) {
    progress = 100
  }
  else if (soldRatio <= phaseOneSold) {
    progress = Math.round((soldRatio / phaseOneSold) * 30)
  }
  else if (soldRatio <= phaseOneSold + phaseTwoSold) {
    progress = Math.round(30 + ((soldRatio - phaseOneSold) / phaseTwoSold) * 50)
  }
  else {
    progress = 80
  }

  return {
    totalCodes,
    soldCodes,
    leftCodes,
    progress: Math.min(Math.max(progress, 0), 100),
    remainingMode: leftCodes > 0 && soldRatio > phaseOneSold + phaseTwoSold,
  }
}

function getIssueLeftCodes(issue: any) {
  return getIssueSaleStats(issue).leftCodes
}

function normalizeIssueSaleStats(issue: any) {
  const { leftCodes, progress, remainingMode } = getIssueSaleStats(issue)
  return {
    ...issue,
    leftCodes,
    progress,
    remainingMode,
  }
}

function syncIssueList() {
  const classes = homeData.value?.classes || []
  const matched = classes.find((item: TreasureClassItem) => Number(item.classId) === Number(activeClassId.value))
  issueList.value = matched?.issues || []
  if (!matched && classes.length) {
    activeClassId.value = Number(classes[0].classId)
    issueList.value = classes[0].issues || []
  }
}

async function fetchHome() {
  const { data } = await getTreasureHome()
  homeData.value = {
    walletBalance: data?.walletBalance ?? 0,
    classes: (data?.classes || []).map((item: TreasureClassItem) => ({
      ...item,
      issues: (item?.issues || []).map((issue: TreasureIssueItem) => normalizeIssueSaleStats(issue)),
    })),
    latestDrawLogs: data?.latestDrawLogs || [],
  }
  if (!activeClassId.value && homeData.value.classes.length) {
    activeClassId.value = Number(homeData.value.classes[0].classId)
  }
  if (!homeData.value.classes.find(item => Number(item.classId) === Number(activeClassId.value)) && homeData.value.classes.length) {
    activeClassId.value = Number(homeData.value.classes[0].classId)
  }
  syncIssueList()
}

async function fetchDrawLogs(reset = false) {
  const filter = currentDrawFilter.value
  if (!filter.issueId && !filter.goodsId) {
    drawLogs.value = []
    drawLogStatus.value = 3
    drawLogLoaded.value = true
    return
  }

  if (reset) {
    drawLogPage.pageIndex = 1
    drawLogStatus.value = 1
    drawLogLoaded.value = false
  }

  const { data } = await getTreasureDrawLogList({
    ...filter,
    pageIndex: drawLogPage.pageIndex,
    pageSize: drawLogPage.pageSize,
  })

  const rows = (data?.rows || []) as TreasureDrawLogItem[]
  drawLogPage.total = Number(data?.total || 0)
  drawLogs.value = drawLogPage.pageIndex === 1 ? rows : drawLogs.value.concat(rows)
  drawLogStatus.value = drawLogs.value.length >= drawLogPage.total ? 3 : 2
  drawLogLoaded.value = true
}

async function syncOrderDrawLogs(rows: TreasureOrderItem[]) {
  const issueIds = Array.from(
    new Set(rows.map(item => Number(item.issueId)).filter(issueId => issueId > 0)),
  ).filter(issueId => !Object.prototype.hasOwnProperty.call(orderDrawLogMap, issueId))

  await Promise.all(issueIds.map(async (issueId) => {
    const { data } = await getTreasureDrawLogList({
      issueId,
      pageIndex: 1,
      pageSize: 1,
    })

    orderDrawLogMap[issueId] = ((data as TreasureListData<TreasureDrawLogItem>)?.rows || [])[0] || null
  }))
}

function normalizeOrder(item: TreasureOrderItem): TreasureOrderView {
  const drawLog = orderDrawLogMap[Number(item.issueId)] || null
  return {
    ...item,
    drawLog,
    resultType: getOrderResultType(item, drawLog),
  }
}

async function fetchOrders(reset = false) {
  if (reset) {
    orderPage.pageIndex = 1
    orderStatus.value = 1
    orderLoaded.value = false
    Object.keys(orderDrawLogMap).forEach((key) => {
      delete orderDrawLogMap[Number(key)]
    })
  }

  const { data } = await getTreasureMyOrderList({
    pageIndex: orderPage.pageIndex,
    pageSize: orderPage.pageSize,
  })

  const rows = (data?.rows || []) as TreasureOrderItem[]
  await syncOrderDrawLogs(rows)
  const nextOrders = rows.map(normalizeOrder)
  orderPage.total = Number(data?.total || 0)
  myOrders.value = orderPage.pageIndex === 1 ? nextOrders : myOrders.value.concat(nextOrders)
  orderStatus.value = myOrders.value.length >= orderPage.total ? 3 : 2
  orderLoaded.value = true
}

async function initPage() {
  await fetchHome()
  await fetchOrders(true)
}

async function switchClass(classId: number) {
  if (Number(activeClassId.value) === Number(classId))
    return
  activeClassId.value = Number(classId)
  syncIssueList()
  selectedIssue.value = null
  clearDrawLogFilter()
}

function openBuyDialog(issue: TreasureIssueItem) {
  if (!issue?.canBuy || Number(issue?.status) !== 0) {
    showToast(getIssueStatusText(issue?.status))
    return
  }
  selectedIssue.value = issue
  payKeypadRef.value?.show(true, 1)
}

function openDrawLogForIssue(issue: TreasureIssueItem) {
  selectedDrawIssue.value = issue
  recordTab.value = 'draw'
  fetchDrawLogs(true)
}

function clearDrawLogFilter() {
  selectedDrawIssue.value = null
  drawLogs.value = []
  drawLogLoaded.value = false
  drawLogStatus.value = 1
}

async function handleBuyConfirm(count: number) {
  const issue = selectedIssue.value
  const normalizedCount = Number(count)
  if (!issue)
    return

  if (!Number.isInteger(normalizedCount) || normalizedCount <= 0) {
    showToast(t('Please enter a valid quantity'))
    return
  }
  if (normalizedCount > 500) {
    showToast(t('Maximum purchase quantity is 500'))
    return
  }
  if (normalizedCount > getIssueLeftCodes(issue)) {
    showToast(t('Exceed remaining codes'))
    return
  }

  buying.value = true
  try {
    const { data } = await buyTreasure({
      issueId: issue.issueId,
      buyCount: normalizedCount,
    })

    showSuccessToast(t('Purchase Success'))

    issue.soldCodes = data?.soldCodes
    issue.totalCodes = data?.totalCodes
    const { leftCodes, progress, remainingMode } = getIssueSaleStats(issue)
    issue.leftCodes = leftCodes
    issue.progress = progress
    issue.remainingMode = remainingMode
    issue.status = data?.status
    issue.drawAt = data?.drawAt
    issue.canBuy = Number(data?.status) === 0 && getIssueLeftCodes(issue) > 0
    homeData.value.walletBalance = data?.walletBalance ?? homeData.value.walletBalance

    await fetchHome()
    await fetchOrders(true)
    if (selectedDrawIssue.value) {
      await fetchDrawLogs(true)
    }
  }
  finally {
    buying.value = false
  }
}

async function switchRecordTab(tab: TreasureRecordTab) {
  recordTab.value = tab
  if (tab === 'draw' && selectedDrawIssue.value && !drawLogLoaded.value) {
    await fetchDrawLogs(true)
  }
  if ((tab === 'order' || tab === 'win') && !orderLoaded.value) {
    await fetchOrders(true)
  }
}

async function loadMoreDrawLogs() {
  if (drawLogStatus.value !== 2)
    return
  drawLogPage.pageIndex += 1
  await fetchDrawLogs()
}

async function loadMoreOrders() {
  if (orderStatus.value !== 2)
    return
  orderPage.pageIndex += 1
  await fetchOrders()
}

async function loadMoreWinningOrders() {
  if (orderStatus.value !== 2)
    return

  const beforeCount = winningOrders.value.length
  while (orderStatus.value === 2 && winningOrders.value.length === beforeCount) {
    orderPage.pageIndex += 1
    await fetchOrders()
  }
}

onMounted(async () => {
  await initPage()
})
</script>

<template>
  <div class="treasure-page min-h-screen bg-[#faf7f2] pb-[120px]">
    <div class="sticky top-0 z-[20] border-b border-[#ece0cc] bg-[#faf7f2f2] backdrop-blur-[10px]">
      <div class="px-[16px] pb-[10px] pt-[12px]">
        <div class="mb-[10px] flex items-center justify-between">
          <div>
            <div class="text-[12px] text-[#b08c44] font-semibold tracking-[2px]">
              {{ t('SIGNET JEWELERS') }}
            </div>
            <div class="mt-[2px] text-[18px] text-[#2e2010] font-bold">
              {{ t('One Yuan Treasure') }}
            </div>
          </div>
          <div class="flex items-center gap-[6px] text-[11px] text-[#8a7a5a]">
            <span class="h-[6px] w-[6px] rounded-full bg-[#d03535]" />
            <span>{{ t('Live') }}</span>
          </div>
        </div>

        <div
          class="flex items-center gap-[10px] border border-[#e7d8bb] rounded-[16px] border-solid from-[#fffaf0] to-[#f7eddc] bg-gradient-to-r px-[14px] py-[10px]"
        >
          <div
            class="h-[32px] w-[32px] flex items-center justify-center rounded-[10px] from-[#9a7a2c] to-[#e8cf85] bg-gradient-to-r text-[16px] text-white"
          >
            💰
          </div>
          <div class="flex-1">
            <div class="text-[10px] text-[#b0a080]">
              {{ t('Recharge Balance') }}
            </div>
            <div class="text-[20px] text-[#9a7a2c] font-bold leading-[1.1]">
              {{ walletBalance }}
            </div>
          </div>
          <div class="text-right text-[10px] text-[#b0a080]">
            {{ t('Wallet used for purchase') }}
          </div>
        </div>
      </div>
    </div>

    <div class="px-[16px] pt-[16px]">
      <div class="hero relative overflow-hidden rounded-[24px] px-[18px] py-[20px]">
        <div class="relative z-[1] max-w-[240px]">
          <div
            class="mb-[10px] inline-flex items-center rounded-[999px] from-[#9a7a2c] to-[#c9a84c] bg-gradient-to-r px-[10px] py-[4px] text-[10px] text-white font-bold"
          >
            {{ t('Limited Event') }}
          </div>
          <div class="text-[28px] text-[#1e1608] font-bold leading-[1.2]">
            {{ t('Spend') }} <span class="text-[#c9a84c]">1</span> {{ t('Unit and Win Goodies') }}
          </div>
          <div class="mt-[8px] text-[11px] text-[#8a7a5a]">
            {{ t('Buy codes, wait for draw, and check your luck.') }}
          </div>
        </div>
        <div class="absolute right-[16px] top-[24px] text-[56px] opacity-80">
          💎
        </div>
      </div>
    </div>

    <div class="mt-[12px] overflow-x-auto whitespace-nowrap px-[8px] pb-[4px]">
      <div class="inline-flex gap-[8px] px-[8px]">
        <div
          v-for="rule in ruleItems" :key="rule.label"
          class="min-w-[96px] border border-[#ece0cc] rounded-[14px] border-solid bg-[#fffaf2] px-[12px] py-[8px] text-center"
        >
          <div class="text-[18px]">
            {{ rule.icon }}
          </div>
          <div class="mt-[4px] text-[10px] text-[#8a7a5a]">
            {{ t(rule.label) }}
          </div>
        </div>
      </div>
    </div>

    <div class="sticky top-[104px] z-[15] bg-[#faf7f2f2] px-[16px] pb-[8px] pt-[12px] backdrop-blur-[8px]">
      <div class="flex rounded-[18px] bg-white p-[6px] shadow-sm">
        <div
          v-for="tab in classTabs" :key="tab.classId"
          class="h-[46px] flex flex-1 flex-col items-center justify-center rounded-[14px]"
          :class="activeClassId === tab.classId ? 'bg-[#f4ede0] text-[#9a7a2c]' : 'text-[#b0a080]'"
          @click="switchClass(tab.classId)"
        >
          <div class="text-[18px] font-bold leading-[1]">
            {{ tab.priceLabel }}
          </div>
          <div class="mt-[2px] text-[10px]">
            {{ tab.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="px-[14px] pt-[12px]">
      <div class="mb-[12px] flex items-center justify-between">
        <div>
          <div class="text-[14px] text-[#1e1608] font-bold">
            {{ currentClassName }}
          </div>
          <div class="mt-[2px] text-[11px] text-[#b0a080]">
            {{ t('Current available issues') }} {{ issueList.length }}
          </div>
        </div>
      </div>

      <div v-if="issueList.length" class="flex flex-col gap-[14px]">
        <TreasureIssueCard
          v-for="issue in issueList" :key="issue.issueId"
          :issue="issue"
          :buying="buying"
          :latest-draw-logs="homeData.latestDrawLogs"
          @buy="openBuyDialog"
          @draw-history="openDrawLogForIssue"
        />
      </div>
      <empty v-else :no-tips="true" />
    </div>

    <div class="px-[14px] pt-[8px]">
      <TreasureRecordPanel
        :record-tab="recordTab"
        :selected-draw-issue="selectedDrawIssue"
        :latest-draw-goods-groups="latestDrawGoodsGroups"
        :draw-logs="drawLogs"
        :my-orders="myOrders"
        :winning-orders="winningOrders"
        :draw-log-status="drawLogStatus"
        :order-status="orderStatus"
        @switch-tab="switchRecordTab"
        @clear-filter="clearDrawLogFilter"
        @load-more-draw="loadMoreDrawLogs"
        @load-more-order="loadMoreOrders"
        @load-more-winning="loadMoreWinningOrders"
      />
    </div>

    <payKeypad ref="payKeypadRef" :title="buyDialogTitle" prefix="" @on-click="handleBuyConfirm" />
  </div>
</template>

<route lang="json5">
{
  name: 'treasure',
  meta: {
    title: 'One Yuan Treasure',
    i18n: 'One Yuan Treasure'
  },
}
</route>

<style scoped lang="less">
.hero {
  background: linear-gradient(155deg, #fffdf8 0%, #f8f0e2 45%, #f0e4cc 100%);
}

.hero::before {
  content: '';
  position: absolute;
  right: -30px;
  top: -20px;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  border: 1px solid rgba(201, 168, 76, 0.18);
}
</style>

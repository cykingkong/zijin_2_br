<template>
  <div class="treasure-page min-h-screen bg-[#faf7f2] pb-[120px]">
    <div class="sticky top-0 z-[20] bg-[#faf7f2f2] backdrop-blur-[10px] border-b border-[#ece0cc]">
      <div class="px-[16px] pt-[12px] pb-[10px]">
        <div class="flex items-center justify-between mb-[10px]">
          <div>
            <div class="text-[12px] font-semibold tracking-[2px] text-[#b08c44]">SIGNET JEWELERS</div>
            <div class="text-[18px] font-bold text-[#2e2010] mt-[2px]">{{ t('One Yuan Treasure') }}</div>
          </div>
          <div class="flex items-center gap-[6px] text-[11px] text-[#8a7a5a]">
            <span class="w-[6px] h-[6px] rounded-full bg-[#d03535]"></span>
            <span>{{ t('Live') }}</span>
          </div>
        </div>

        <div
          class="rounded-[16px] border border-[#e7d8bb] border-solid bg-gradient-to-r from-[#fffaf0] to-[#f7eddc] px-[14px] py-[10px] flex items-center gap-[10px]">
          <div
            class="w-[32px] h-[32px] rounded-[10px] bg-gradient-to-r from-[#9a7a2c] to-[#e8cf85] flex items-center justify-center text-white text-[16px]">
            💰
          </div>
          <div class="flex-1">
            <div class="text-[10px] text-[#b0a080]">{{ t('Recharge Balance') }}</div>
            <div class="text-[20px] leading-[1.1] font-bold text-[#9a7a2c]">{{ walletBalance }}</div>
          </div>
          <div class="text-[10px] text-[#b0a080] text-right">{{ t('Wallet used for purchase') }}</div>
        </div>
      </div>
    </div>

    <div class="px-[16px] pt-[16px]">
      <div class="hero rounded-[24px] px-[18px] py-[20px] relative overflow-hidden">
        <div class="relative z-[1] max-w-[240px]">
          <div
            class="inline-flex items-center rounded-[999px] bg-gradient-to-r from-[#9a7a2c] to-[#c9a84c] px-[10px] py-[4px] text-[10px] font-bold text-white mb-[10px]">
            {{ t('Limited Event') }}
          </div>
          <div class="text-[28px] leading-[1.2] font-bold text-[#1e1608]">
            {{ t('Spend') }} <span class="text-[#c9a84c]">1</span> {{ t('Unit and Win Goodies') }}
          </div>
          <div class="text-[11px] text-[#8a7a5a] mt-[8px]">
            {{ t('Buy codes, wait for draw, and check your luck.') }}
          </div>
        </div>
        <div class="absolute right-[16px] top-[24px] text-[56px] opacity-80">💎</div>
      </div>
    </div>

    <div class="mt-[12px] overflow-x-auto whitespace-nowrap px-[8px] pb-[4px]">
      <div class="inline-flex gap-[8px] px-[8px]">
        <div v-for="rule in ruleItems" :key="rule.label"
          class="rounded-[14px] border border-[#ece0cc] border-solid bg-[#fffaf2] px-[12px] py-[8px] text-center min-w-[96px]">
          <div class="text-[18px]">{{ rule.icon }}</div>
          <div class="text-[10px] text-[#8a7a5a] mt-[4px]">{{ t(rule.label) }}</div>
        </div>
      </div>
    </div>

    <div class="sticky top-[104px] z-[15] bg-[#faf7f2f2] backdrop-blur-[8px] px-[16px] pt-[12px] pb-[8px]">
      <div class="flex rounded-[18px] bg-white p-[6px] shadow-sm">
        <div v-for="tab in classTabs" :key="tab.classId"
          class="flex-1 h-[46px] rounded-[14px] flex flex-col items-center justify-center"
          :class="activeClassId === tab.classId ? 'bg-[#f4ede0] text-[#9a7a2c]' : 'text-[#b0a080]'"
          @click="switchClass(tab.classId)">
          <div class="text-[18px] font-bold leading-[1]">{{ tab.priceLabel }}</div>
          <div class="text-[10px] mt-[2px]">{{ tab.name }}</div>
        </div>
      </div>
    </div>

    <div class="px-[14px] pt-[12px]">
      <div class="flex items-center justify-between mb-[12px]">
        <div>
          <div class="text-[14px] font-bold text-[#1e1608]">{{ currentClassName }}</div>
          <div class="text-[11px] text-[#b0a080] mt-[2px]">{{ t('Current available issues') }} {{ issueList.length }}
          </div>
        </div>
      </div>

      <div v-if="issueList.length" class="flex flex-col gap-[14px]">
        <div v-for="issue in issueList" :key="issue.issueId"
          class="rounded-[22px] border border-[#eadfcf] border-solid bg-[#fffcf7] overflow-hidden shadow-[0_3px_18px_rgba(201,168,76,0.08)]">
          <div
            class="relative h-[190px] bg-gradient-to-br from-[#faf7f0] via-[#f4ecdd] to-[#ecdfc8] flex items-center justify-center">
            <div
              class="absolute left-[10px] top-[10px] rounded-[999px] bg-gradient-to-r from-[#9a7a2c] to-[#c9a84c] px-[10px] py-[4px] text-[10px] font-bold text-white">
              {{ t('Issue') }} {{ issue.issueNo }}
            </div>
            <button
              class="absolute right-[10px] top-[10px] rounded-[999px] border border-[#d9c7a0] border-solid bg-[#fffbf3] px-[10px] py-[4px] text-[10px] font-bold text-[#9a7a2c]"
              @click.stop="openDrawLogForIssue(issue)">
              {{ t('Draw History') }}
            </button>
            <img v-if="issue.goodsImage" :src="issue.goodsImage" class="max-h-[140px] max-w-[78%] object-contain" />
            <div v-else class="text-[54px]">🎁</div>
          </div>

          <div class="px-[15px] py-[15px]">
            <div class="flex items-start justify-between gap-[10px]">
              <div class="flex-1">
                <div class="text-[15px] font-bold text-[#1e1608] leading-[1.5]">{{ issue.goodsName || '--' }}</div>
                <div class="text-[11px] text-[#8a7a5a] mt-[4px]">{{ issue.goodsSubName || issue.classDesc || '--' }}
                </div>
              </div>
              <div
                class="rounded-[12px] border border-[#e4d4b2] border-solid bg-[#f8f1e5] px-[10px] py-[8px] text-center min-w-[66px]">
                <div class="text-[18px] leading-[1] font-bold text-[#9a7a2c]">{{ issue.leftCodes || 0 }}</div>
                <div class="text-[9px] text-[#b0a080] mt-[2px]">{{ t('Left') }}</div>
              </div>
            </div>

            <div class="flex items-end justify-between mt-[8px] gap-[8px]">
              <div>
                <div class="flex items-end gap-[4px]">
                  <span class="text-[26px] leading-[1] font-bold text-[#d03535]">{{ issue.unitPrice || issue.classId
                  }}</span>
                  <span class="text-[11px] text-[#8a7a5a]">{{ t('Per Code') }}</span>
                </div>
                <div class="text-[10px] text-[#c9b79e] line-through mt-[3px]">{{ issue.marketPrice || '--' }}</div>
              </div>
              <div class="text-[11px] font-semibold" :class="statusClass(issue.status)">{{
                getIssueStatusText(issue.status) }}</div>
            </div>

            <div class="mt-[14px]">
              <div class="flex items-center justify-between text-[11px] text-[#8a7a5a] mb-[6px]">
                <div>{{ t('Sold') }} <b class="text-[#9a7a2c]">{{ issue.soldCodes || 0 }}</b></div>
                <div class="text-[#d03535]">{{ t('Left') }} {{ issue.leftCodes || 0 }}</div>
              </div>
              <div class="h-[10px] rounded-[999px] bg-[#ece0cc] overflow-hidden">
                <div
                  class="h-full rounded-[999px] bg-gradient-to-r from-[#9a7a2c] via-[#c9a84c] to-[#e8cf85] transition-all duration-500"
                  :style="{ width: `${issue.progress || 0}%` }"></div>
              </div>
              <div class="flex justify-between text-[9px] text-[#b0a080] mt-[4px]">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div v-if="Number(issue.status) === 1"
              class="mt-[12px] rounded-[14px] border border-[#e0c880] border-solid bg-[#fff9eb] px-[12px] py-[10px] flex items-start gap-[8px]">
              <div class="text-[18px]">⏳</div>
              <div>
                <div class="text-[12px] font-bold text-[#9a7a2c]">{{ t('Pending Draw') }}</div>
                <div class="text-[11px] text-[#8a7a5a] mt-[4px]">{{ issue.drawAt || '--' }}</div>
              </div>
            </div>

            <div class="mt-[12px] rounded-[14px] bg-[#faf6ed] px-[12px] py-[10px]">
              <div class="text-[10px] text-[#b0a080] mb-[6px]">{{ t('Latest Winner Preview') }}</div>
              <div v-if="getIssueWinnerPreview(issue).length" class="flex gap-[6px] overflow-x-auto whitespace-nowrap">
                <div v-for="log in getIssueWinnerPreview(issue)" :key="log.id"
                  class="inline-flex flex-col rounded-[10px] border border-[#eadfcf] border-solid bg-[#fffaf2] px-[8px] py-[6px] min-w-[92px]">
                  <span class="text-[9px] text-[#b0a080]">{{ t('Issue') }} {{ log.issueNo }}</span>
                  <span class="text-[10px] font-bold text-[#1e1608] mt-[2px]">{{ log.winnerPhone }}</span>
                  <span class="text-[10px] font-bold text-[#9a7a2c] mt-[2px]">{{ log.winnerCode }}</span>
                </div>
              </div>
              <div v-else class="text-[11px] text-[#b0a080]">{{ t('No draw history yet') }}</div>
            </div>

            <button class="mt-[14px] h-[44px] w-full rounded-[999px] border-none text-[14px] font-bold tracking-[1px]"
              :class="issue.canBuy && Number(issue.status) === 0 ? 'bg-gradient-to-r from-[#9a7a2c] via-[#c9a84c] to-[#e8cf85] text-[#1e1608]' : 'bg-[#d8d0c0] text-white'"
              :disabled="!issue.canBuy || Number(issue.status) !== 0 || buying" @click="openBuyDialog(issue)">
              {{ issue.canBuy && Number(issue.status) === 0 ? t('Join Now') : getIssueStatusText(issue.status) }}
            </button>
          </div>
        </div>
      </div>
      <empty v-else :no-tips="true" />
    </div>

    <div class="px-[14px] pt-[8px]">
      <div class="rounded-[22px] bg-white border border-[#eadfcf] border-solid p-[14px]">
        <div class="flex gap-[8px] rounded-[16px] bg-[#f7f1e6] p-[6px] mb-[14px]">
          <div class="flex-1 h-[38px] px-8 rounded-[12px] flex items-center justify-center text-[13px] font-semibold"
            :class="recordTab === 'draw' ? 'bg-white text-[#1e1608]' : 'text-[#8a7a5a]'"
            @click="switchRecordTab('draw')">
            {{ t('Latest Draw Records') }}
          </div>
          <div class="flex-1 h-[38px]  rounded-[12px] flex items-center justify-center text-[13px] font-semibold"
            :class="recordTab === 'order' ? 'bg-white text-[#1e1608]' : 'text-[#8a7a5a]'"
            @click="switchRecordTab('order')">
            {{ t('My Orders') }}
          </div>
        </div>

        <template v-if="recordTab === 'draw'">
          <div v-if="drawLogs.length" class="flex flex-col gap-[10px]">
            <div v-for="item in drawLogs" :key="item.id"
              class="rounded-[16px] bg-[#fffaf2] p-[12px] border border-[#f0e6d6] border-solid">
              <div class="flex items-center justify-between gap-[8px]">
                <div class="text-[14px] font-bold text-[#1e1608]">{{ item.goodsName || '--' }}</div>
                <div class="text-[11px] text-[#9a7a2c]">{{ getDrawSourceText(item.drawSource) }}</div>
              </div>
              <div class="text-[12px] text-[#8a7a5a] mt-[6px]">{{ t('Issue') }} {{ item.issueNo || '--' }} · {{
                item.winnerPhone || '--' }}</div>
              <div class="text-[12px] font-semibold text-[#9a7a2c] mt-[4px]">{{ item.winnerCode || '--' }}</div>
              <div class="text-[11px] text-[#b0a080] mt-[4px]">{{ item.createdAt || '--' }}</div>
            </div>
            <LoadMore :status="drawLogStatus" @load-more="loadMoreDrawLogs" />
          </div>
          <empty v-else :no-tips="true" />
        </template>

        <template v-else>
          <div v-if="myOrders.length" class="flex flex-col gap-[10px]">
            <div v-for="item in myOrders" :key="item.orderId"
              class="rounded-[16px] bg-[#fffaf2] p-[12px] border border-[#f0e6d6] border-solid">
              <div class="flex gap-[10px]">
                <img v-if="item.goodsImage" :src="item.goodsImage"
                  class="w-[58px] h-[58px] rounded-[12px] object-cover bg-[#f3ead8]" />
                <div v-else
                  class="w-[58px] h-[58px] rounded-[12px] bg-[#f3ead8] flex items-center justify-center text-[24px]">🎁
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-[14px] font-bold text-[#1e1608] line-clamp-2">{{ item.goodsName || '--' }}</div>
                  <div class="text-[12px] text-[#8a7a5a] mt-[4px]">{{ t('Issue') }} {{ item.issueNo || '--' }} · {{
                    t('Buy Count') }} {{ item.buyCount || 0 }}</div>
                  <div class="text-[12px] text-[#9a7a2c] mt-[4px]">{{ t('Codes') }}: {{ formatCodes(item.codes) }}</div>
                  <div class="text-[11px] text-[#b0a080] mt-[4px]">{{ item.createdAt || '--' }}</div>
                </div>
              </div>
            </div>
            <LoadMore :status="orderStatus" @load-more="loadMoreOrders" />
          </div>
          <empty v-else :no-tips="true" />
        </template>
      </div>
    </div>

    <payKeypad ref="payKeypadRef" :title="buyDialogTitle" prefix="" @on-click="handleBuyConfirm" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { showSuccessToast, showToast } from 'vant'
import empty from '@/components/empty.vue'
import LoadMore from '@/components/LoadMore.vue'
import payKeypad from '@/components/payKeypad.vue'
import { buyTreasure, getTreasureDrawLogList, getTreasureHome, getTreasureMyOrderList } from '@/api/treasure'

const { t } = useI18n()

const homeData = ref<any>({
  walletBalance: 0,
  classes: [],
  latestDrawLogs: [],
})

const activeClassId = ref<number>(1)
const issueList = ref<any[]>([])
const selectedIssue = ref<any>(null)
const buying = ref(false)
const payKeypadRef = ref<any>(null)
const recordTab = ref<'draw' | 'order'>('draw')

const drawLogs = ref<any[]>([])
const myOrders = ref<any[]>([])
const drawLogStatus = ref(1)
const orderStatus = ref(1)
const drawLogLoaded = ref(false)
const orderLoaded = ref(false)

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
  return classes.map((item: any) => ({
    classId: Number(item.classId),
    name: item.className || getClassName(item.classId),
    priceLabel: Number(item.classId) === 10 ? '10' : '1',
  }))
})

const walletBalance = computed(() => homeData.value?.walletBalance ?? 0)
const currentClassName = computed(() => getClassName(activeClassId.value))
const currentDrawFilter = computed(() => {
  const firstIssue = issueList.value[0]
  if (selectedIssue.value?.issueId) return { issueId: selectedIssue.value.issueId }
  if (firstIssue?.goodsId) return { goodsId: firstIssue.goodsId }
  return {}
})
const buyDialogTitle = computed(() => {
  if (!selectedIssue.value) return t('Enter quantity')
  return `${t('Buy Quantity')} · ${selectedIssue.value.goodsName || ''}`
})

function getClassName(classId: number) {
  if (Number(classId) === 10) return t('Ten Yuan Zone')
  return t('One Yuan Zone')
}

function getIssueStatusText(status: number) {
  if (Number(status) === 1) return t('Pending Draw')
  if (Number(status) === 2) return t('Drawn')
  if (Number(status) === 3) return t('Cancelled')
  if (Number(status) === 4) return t('Coming Soon')
  return t('Join Now')
}

function statusClass(status: number) {
  if (Number(status) === 1) return 'text-[#c9a84c]'
  if (Number(status) === 2) return 'text-[#059669]'
  if (Number(status) === 3) return 'text-[#d03535]'
  if (Number(status) === 4) return 'text-[#8a7a5a]'
  return 'text-[#9a7a2c]'
}

function getDrawSourceText(drawSource: number) {
  return t('Random Draw')
}

function getIssueWinnerPreview(issue: any) {
  const logs = homeData.value?.latestDrawLogs || []
  return logs.filter((item: any) => Number(item.goodsId) === Number(issue.goodsId)).slice(0, 3)
}

function formatCodes(codes: any) {
  if (Array.isArray(codes)) return codes.join(', ')
  return codes || '--'
}

function syncIssueList() {
  const classes = homeData.value?.classes || []
  const matched = classes.find((item: any) => Number(item.classId) === Number(activeClassId.value))
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
    classes: data?.classes || [],
    latestDrawLogs: data?.latestDrawLogs || [],
  }
  if (!activeClassId.value && homeData.value.classes.length) {
    activeClassId.value = Number(homeData.value.classes[0].classId)
  }
  if (!homeData.value.classes.find((item: any) => Number(item.classId) === Number(activeClassId.value)) && homeData.value.classes.length) {
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
  }

  const { data } = await getTreasureDrawLogList({
    ...filter,
    pageIndex: drawLogPage.pageIndex,
    pageSize: drawLogPage.pageSize,
  })

  const rows = data?.rows || []
  drawLogPage.total = Number(data?.total || 0)
  drawLogs.value = drawLogPage.pageIndex === 1 ? rows : drawLogs.value.concat(rows)
  drawLogStatus.value = drawLogs.value.length >= drawLogPage.total ? 3 : 2
  drawLogLoaded.value = true
}

async function fetchOrders(reset = false) {
  if (reset) {
    orderPage.pageIndex = 1
    orderStatus.value = 1
  }

  const { data } = await getTreasureMyOrderList({
    pageIndex: orderPage.pageIndex,
    pageSize: orderPage.pageSize,
  })

  const rows = data?.rows || []
  orderPage.total = Number(data?.total || 0)
  myOrders.value = orderPage.pageIndex === 1 ? rows : myOrders.value.concat(rows)
  orderStatus.value = myOrders.value.length >= orderPage.total ? 3 : 2
  orderLoaded.value = true
}

async function initPage() {
  await fetchHome()
  await fetchDrawLogs(true)
  await fetchOrders(true)
}

async function switchClass(classId: number) {
  if (Number(activeClassId.value) === Number(classId)) return
  activeClassId.value = Number(classId)
  syncIssueList()
  selectedIssue.value = null
  await fetchDrawLogs(true)
}

function openBuyDialog(issue: any) {
  if (!issue?.canBuy || Number(issue?.status) !== 0) {
    showToast(getIssueStatusText(issue?.status))
    return
  }
  selectedIssue.value = issue
  payKeypadRef.value?.show(true, 1)
}

function openDrawLogForIssue(issue: any) {
  selectedIssue.value = issue
  recordTab.value = 'draw'
  fetchDrawLogs(true)
}

async function handleBuyConfirm(count: number) {
  const issue = selectedIssue.value
  const normalizedCount = Number(count)
  if (!issue) return

  if (!Number.isInteger(normalizedCount) || normalizedCount <= 0) {
    showToast(t('Please enter a valid quantity'))
    return
  }
  if (normalizedCount > 500) {
    showToast(t('Maximum purchase quantity is 500'))
    return
  }
  if (normalizedCount > Number(issue.leftCodes || 0)) {
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
    issue.leftCodes = Math.max(Number(data?.totalCodes || 0) - Number(data?.soldCodes || 0), 0)
    issue.progress = issue.totalCodes ? Math.min(100, Math.round((Number(issue.soldCodes || 0) / Number(issue.totalCodes || 1)) * 100)) : 0
    issue.status = data?.status
    issue.drawAt = data?.drawAt
    issue.canBuy = Number(data?.status) === 0 && issue.leftCodes > 0
    homeData.value.walletBalance = data?.walletBalance ?? homeData.value.walletBalance

    await fetchHome()
    await fetchOrders(true)
    await fetchDrawLogs(true)
  }
  finally {
    buying.value = false
  }
}

async function switchRecordTab(tab: 'draw' | 'order') {
  recordTab.value = tab
  if (tab === 'draw' && !drawLogLoaded.value) {
    await fetchDrawLogs(true)
  }
  if (tab === 'order' && !orderLoaded.value) {
    await fetchOrders(true)
  }
}

async function loadMoreDrawLogs() {
  if (drawLogStatus.value !== 2) return
  drawLogPage.pageIndex += 1
  await fetchDrawLogs()
}

async function loadMoreOrders() {
  if (orderStatus.value !== 2) return
  orderPage.pageIndex += 1
  await fetchOrders()
}

onMounted(async () => {
  await initPage()
})
</script>

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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

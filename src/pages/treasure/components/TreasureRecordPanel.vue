<script setup lang="ts">
import empty from '@/components/empty.vue'
import LoadMore from '@/components/LoadMore.vue'
import type {
  LatestDrawGroup,
  OrderResultType,
  TreasureDrawLogItem,
  TreasureIssueItem,
  TreasureOrderItem,
  TreasureOrderView,
  TreasureRecordTab,
} from '@/api/treasure'

defineProps<{
  recordTab: TreasureRecordTab
  selectedDrawIssue: TreasureIssueItem | null
  latestDrawGoodsGroups: LatestDrawGroup[]
  drawLogs: TreasureDrawLogItem[]
  myOrders: TreasureOrderView[]
  winningOrders: TreasureOrderView[]
  drawLogStatus: number
  orderStatus: number
}>()

const emit = defineEmits<{
  switchTab: [tab: TreasureRecordTab]
  clearFilter: []
  loadMoreDraw: []
  loadMoreOrder: []
  loadMoreWinning: []
}>()

const { t } = useI18n()

const recordTabs: Array<{ key: TreasureRecordTab, label: string }> = [
  { key: 'draw', label: 'Latest Draw Records' },
  { key: 'order', label: 'My Orders' },
  { key: 'win', label: 'My Winning Records' },
]

function getDrawSourceText(drawSource?: number) {
  if (Number(drawSource) === 1)
    return t('Manual Draw')
  return t('Random Draw')
}

function formatCodes(codes: TreasureOrderItem['codes']) {
  if (Array.isArray(codes))
    return codes.join(', ')
  return codes || '--'
}

function getOrderResultText(resultType: OrderResultType) {
  if (resultType === 'won')
    return t('Won')
  if (resultType === 'lost')
    return t('Not Won')
  return t('Pending Draw')
}

function getOrderResultClass(resultType: OrderResultType) {
  if (resultType === 'won')
    return 'bg-[#edf9f0] text-[#059669]'
  if (resultType === 'lost')
    return 'bg-[#fff1f1] text-[#d03535]'
  return 'bg-[#fff6dd] text-[#b7791f]'
}

function getOrderResultDesc(item: TreasureOrderView) {
  if (item.resultType === 'won')
    return `${t('Winning Code')}: ${item.drawLog?.winnerCode || '--'}`
  if (item.resultType === 'lost')
    return `${t('Winning Code')}: ${item.drawLog?.winnerCode || '--'}`
  return t('Waiting for draw result')
}
</script>

<template>
  <div class="border border-[#eadfcf] rounded-[22px] border-solid bg-white p-[14px]">
    <div class="mb-[14px] flex gap-[8px] rounded-[16px] bg-[#f7f1e6] p-[6px]">
      <div
        v-for="tab in recordTabs" :key="tab.key"
        class="h-[38px] flex flex-1 items-center justify-center rounded-[12px] text-[12px] font-semibold"
        :class="recordTab === tab.key ? 'bg-white text-[#1e1608]' : 'text-[#8a7a5a]'"
        @click="emit('switchTab', tab.key)"
      >
        {{ t(tab.label) }}
      </div>
    </div>

    <template v-if="recordTab === 'draw'">
      <div v-if="selectedDrawIssue" class="mb-[10px] rounded-[16px] bg-[#faf6ed] px-[12px] py-[10px]">
        <div class="flex items-center justify-between gap-[10px]">
          <div class="min-w-0">
            <div class="line-clamp-2 text-[13px] text-[#1e1608] font-bold">
              {{ selectedDrawIssue.goodsName || '--' }}
            </div>
            <div class="mt-[2px] text-[11px] text-[#8a7a5a]">
              {{ t('Showing draw history for this product') }}
            </div>
          </div>
          <button
            class="shrink-0 border border-[#e4d4b2] rounded-[999px] border-solid bg-white px-[10px] py-[5px] text-[10px] text-[#9a7a2c] font-semibold"
            @click="emit('clearFilter')"
          >
            {{ t('Latest Summary') }}
          </button>
        </div>
      </div>

      <div v-if="selectedDrawIssue ? drawLogs.length : latestDrawGoodsGroups.length" class="flex flex-col gap-[10px]">
        <template v-if="selectedDrawIssue">
          <div
            v-for="item in drawLogs" :key="item.id"
            class="border border-[#f0e6d6] rounded-[16px] border-solid bg-[#fffaf2] p-[12px]"
          >
            <div class="flex items-center justify-between gap-[8px]">
              <div class="text-[14px] text-[#1e1608] font-bold">
                {{ item.goodsName || '--' }}
              </div>
              <div class="text-[11px] text-[#9a7a2c]">
                {{ getDrawSourceText(item.drawSource) }}
              </div>
            </div>
            <div class="mt-[6px] text-[12px] text-[#8a7a5a]">
              {{ t('Issue') }} {{ item.issueNo || '--' }} · {{
                item.winnerPhone || '--' }}
            </div>
            <div class="mt-[4px] text-[12px] text-[#9a7a2c] font-semibold">
              {{ item.winnerCode || '--' }}
            </div>
            <div class="mt-[4px] text-[11px] text-[#b0a080]">
              {{ item.createdAt || '--' }}
            </div>
          </div>
          <LoadMore :status="drawLogStatus" @load-more="emit('loadMoreDraw')" />
        </template>

        <template v-else>
          <div
            v-for="group in latestDrawGoodsGroups" :key="group.key"
            class="border border-[#f0e6d6] rounded-[16px] border-solid bg-[#fffaf2] p-[12px]"
          >
            <div class="flex items-center justify-between gap-[8px]">
              <div class="text-[14px] text-[#1e1608] font-bold">
                {{ group.goodsName || '--' }}
              </div>
              <div class="text-[11px] text-[#9a7a2c]">
                {{ t('Latest Draw Summary') }}
              </div>
            </div>
            <div class="mt-[10px] flex flex-col gap-[8px]">
              <div
                v-for="item in group.records" :key="item.id"
                class="border border-[#f2e7d8] rounded-[12px] border-solid bg-white px-[10px] py-[8px]"
              >
                <div class="text-[12px] text-[#8a7a5a]">
                  {{ t('Issue') }} {{ item.issueNo || '--' }} · {{
                    item.winnerPhone || '--' }}
                </div>
                <div class="mt-[4px] text-[12px] text-[#9a7a2c] font-semibold">
                  {{ item.winnerCode || '--' }}
                </div>
                <div class="mt-[4px] text-[11px] text-[#b0a080]">
                  {{ item.createdAt || '--' }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <empty v-else :no-tips="true" />
    </template>

    <template v-else-if="recordTab === 'order'">
      <div v-if="myOrders.length" class="flex flex-col gap-[10px]">
        <div
          v-for="item in myOrders" :key="item.orderId"
          class="border border-[#f0e6d6] rounded-[16px] border-solid bg-[#fffaf2] p-[12px]"
        >
          <div class="flex gap-[10px]">
            <img
              v-if="item.goodsImage" :src="item.goodsImage"
              class="h-[58px] w-[58px] rounded-[12px] bg-[#f3ead8] object-cover"
            >
            <div
              v-else
              class="h-[58px] w-[58px] flex items-center justify-center rounded-[12px] bg-[#f3ead8] text-[24px]"
            >
              🎁
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-[8px]">
                <div class="line-clamp-2 text-[14px] text-[#1e1608] font-bold">
                  {{ item.goodsName || '--' }}
                </div>
                <div
                  class="shrink-0 rounded-[999px] px-[10px] py-[4px] text-[10px] font-bold"
                  :class="getOrderResultClass(item.resultType)"
                >
                  {{ getOrderResultText(item.resultType) }}
                </div>
              </div>
              <div class="mt-[4px] text-[12px] text-[#8a7a5a]">
                {{ t('Issue') }} {{ item.issueNo || '--' }} · {{
                  t('Buy Count') }} {{ item.buyCount || 0 }}
              </div>
              <div class="mt-[4px] text-[12px] text-[#9a7a2c]">
                {{ t('Codes') }}: {{ formatCodes(item.codes) }}
              </div>
              <div
                class="mt-[4px] text-[11px]"
                :class="item.resultType === 'won' ? 'text-[#059669]' : item.resultType === 'lost' ? 'text-[#d03535]' : 'text-[#b7791f]'"
              >
                {{ getOrderResultDesc(item) }}
              </div>
              <div class="mt-[4px] text-[11px] text-[#b0a080]">
                {{
                  item.drawLog?.createdAt ? `${t('Draw Time')}: ${item.drawLog.createdAt}` : item.createdAt || '--'
                }}
              </div>
            </div>
          </div>
        </div>
        <LoadMore :status="orderStatus" @load-more="emit('loadMoreOrder')" />
      </div>
      <empty v-else :no-tips="true" />
    </template>

    <template v-else>
      <div v-if="winningOrders.length" class="flex flex-col gap-[10px]">
        <div
          v-for="item in winningOrders" :key="item.orderId"
          class="border border-[#f0e6d6] rounded-[16px] border-solid bg-[#fffaf2] p-[12px]"
        >
          <div class="flex gap-[10px]">
            <img
              v-if="item.goodsImage" :src="item.goodsImage"
              class="h-[58px] w-[58px] rounded-[12px] bg-[#f3ead8] object-cover"
            >
            <div
              v-else
              class="h-[58px] w-[58px] flex items-center justify-center rounded-[12px] bg-[#f3ead8] text-[24px]"
            >
              🏆
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-[8px]">
                <div class="line-clamp-2 text-[14px] text-[#1e1608] font-bold">
                  {{ item.goodsName || '--' }}
                </div>
                <div class="shrink-0 rounded-[999px] bg-[#edf9f0] px-[10px] py-[4px] text-[10px] text-[#059669] font-bold">
                  {{ t('Won') }}
                </div>
              </div>
              <div class="mt-[4px] text-[12px] text-[#8a7a5a]">
                {{ t('Issue') }} {{ item.issueNo || '--' }} · {{
                  t('Buy Count') }} {{ item.buyCount || 0 }}
              </div>
              <div class="mt-[4px] text-[12px] text-[#059669] font-semibold">
                {{ t('Winning Code') }}: {{
                  item.drawLog?.winnerCode || '--' }}
              </div>
              <div class="mt-[4px] text-[12px] text-[#9a7a2c]">
                {{ t('Codes') }}: {{ formatCodes(item.codes) }}
              </div>
              <div class="mt-[4px] text-[11px] text-[#b0a080]">
                {{ item.drawLog?.createdAt || '--' }}
              </div>
            </div>
          </div>
        </div>
        <LoadMore :status="orderStatus" @load-more="emit('loadMoreWinning')" />
      </div>
      <div v-else-if="orderStatus === 2" class="py-[8px]">
        <div class="mb-[10px] text-center text-[12px] text-[#8a7a5a]">
          {{ t('No winning records in current page') }}
        </div>
        <LoadMore :status="orderStatus" @load-more="emit('loadMoreWinning')" />
      </div>
      <empty v-else :no-tips="true" />
    </template>
  </div>
</template>

<style scoped lang="less">
.line-clamp-2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>

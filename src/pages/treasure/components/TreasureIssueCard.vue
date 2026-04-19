<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { TreasureDrawLogItem, TreasureIssueItem } from '@/api/treasure'

const props = defineProps<{
  issue: TreasureIssueItem
  buying: boolean
  latestDrawLogs: TreasureDrawLogItem[]
}>()

const emit = defineEmits<{
  buy: [issue: TreasureIssueItem]
  drawHistory: [issue: TreasureIssueItem]
}>()

const { t } = useI18n()
const now = ref(Date.now())
let countdownTimer: ReturnType<typeof setInterval> | null = null

function getIssueStatusText(status: number) {
  if (Number(status) === 1)
    return t('Pending Draw')
  if (Number(status) === 2)
    return t('Drawn')
  if (Number(status) === 3)
    return t('Cancelled')
  if (Number(status) === 4)
    return t('Coming Soon')
  return t('Join Now')
}

function statusClass(status: number) {
  if (Number(status) === 1)
    return 'text-[#c9a84c]'
  if (Number(status) === 2)
    return 'text-[#059669]'
  if (Number(status) === 3)
    return 'text-[#d03535]'
  if (Number(status) === 4)
    return 'text-[#8a7a5a]'
  return 'text-[#9a7a2c]'
}

function getIssueSaleStats(issue: TreasureIssueItem) {
  const totalCodes = Math.max(Number(issue?.totalCodes || 0), 0)
  const soldCodes = Math.max(Number(issue?.soldCodes || 0), 0)
  const rawLeftCodes = Math.max(Number(issue?.leftCodes || 0), 0)
  const rawProgress = Number(issue?.progress || 0)

  const leftCodes = totalCodes > 0 ? Math.max(totalCodes - soldCodes, 0) : rawLeftCodes
  if (totalCodes <= 0) {
    const progress = Math.min(Math.max(rawProgress, 0), 100)
    return {
      leftCodes,
      progress,
      remainingMode: progress >= 80 && progress < 100,
    }
  }

  const soldRatio = Math.min(soldCodes, totalCodes)
  const phaseOneSold = totalCodes * 0.3
  const phaseTwoSold = totalCodes * 0.8
  let progress = 0

  if (leftCodes <= 0 || soldRatio >= totalCodes) {
    progress = 100
  }
  else if (soldRatio <= phaseOneSold) {
    progress = Math.round((soldRatio / Math.max(phaseOneSold, 1)) * 30)
  }
  else if (soldRatio <= phaseTwoSold) {
    progress = Math.round(30 + ((soldRatio - phaseOneSold) / Math.max(phaseTwoSold - phaseOneSold, 1)) * 50)
  }
  else {
    progress = 80
  }

  return {
    leftCodes,
    progress: Math.min(Math.max(progress, 0), 100),
    remainingMode: leftCodes > 0 && soldRatio > phaseTwoSold,
  }
}

function getIssueLeftCodes(issue: TreasureIssueItem) {
  return getIssueSaleStats(issue).leftCodes
}

function getProgressWidth(issue: TreasureIssueItem) {
  return getIssueSaleStats(issue).progress
}

function isRemainingMode(issue: TreasureIssueItem) {
  return getIssueSaleStats(issue).remainingMode
}

function getProgressText(issue: TreasureIssueItem) {
  if (isRemainingMode(issue))
    return `${t('Left')} ${getIssueLeftCodes(issue)}`
  return `${getProgressWidth(issue)}%`
}

function formatCountdown(diffMs: number) {
  if (diffMs <= 0)
    return ''

  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0)
    return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const drawCountdownText = computed(() => {
  const drawAt = props.issue?.drawAt
  if (!drawAt)
    return '--'

  const targetTime = new Date(drawAt).getTime()
  if (Number.isNaN(targetTime))
    return drawAt

  return formatCountdown(targetTime - now.value)
})

onMounted(() => {
  countdownTimer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onBeforeUnmount(() => {
  if (countdownTimer)
    clearInterval(countdownTimer)
})

function getIssueWinnerPreview(issue: TreasureIssueItem) {
  return props.latestDrawLogs.filter(item => Number(item.goodsId) === Number(issue.goodsId)).slice(0, 3)
}
</script>

<template>
  <div
    class="overflow-hidden border border-[#eadfcf] rounded-[22px] border-solid bg-[#fffcf7] shadow-[0_3px_18px_rgba(201,168,76,0.08)]"
  >
    <div
      class="relative h-[190px] flex items-center justify-center from-[#faf7f0] via-[#f4ecdd] to-[#ecdfc8] bg-gradient-to-br"
    >
      <div
        class="absolute left-[10px] top-[10px] rounded-[999px] from-[#9a7a2c] to-[#c9a84c] bg-gradient-to-r px-[10px] py-[4px] text-[10px] text-white font-bold"
      >
        {{ t('Issue') }} {{ issue.issueNo }}
      </div>
      <!-- <button
        class="absolute right-[10px] top-[10px] border border-[#d9c7a0] rounded-[999px] border-solid bg-[#fffbf3] px-[10px] py-[4px] text-[10px] text-[#9a7a2c] font-bold"
        @click.stop="emit('drawHistory', issue)"
      >
        {{ t('Draw History') }}
      </button> -->
      <img v-if="issue.goodsImage" :src="issue.goodsImage" class="max-h-[140px] max-w-[78%] object-contain">
      <div v-else class="text-[54px]">
        🎁
      </div>
    </div>

    <div class="px-[15px] py-[15px]">
      <div class="flex items-start justify-between gap-[10px]">
        <div class="flex-1">
          <div class="text-[15px] text-[#1e1608] font-bold leading-[1.5]">
            {{ issue.goodsName || '--' }}
          </div>
          <div class="mt-[4px] text-[11px] text-[#8a7a5a]">
            {{ issue.goodsSubName || issue.classDesc || '--' }}
          </div>
        </div>
        
      </div>

      <div class="mt-[8px] flex items-end justify-between gap-[8px]">
        <div>
          <div class="flex items-end gap-[4px]">
            <span class="text-[26px] text-[#d03535] font-bold leading-[1]">{{ issue.unitPrice || issue.classId }}</span>
            <span class="text-[11px] text-[#8a7a5a]">{{ t('Per Code') }}</span>
          </div>
        </div>
        <div
          class="min-w-[66px] border border-[#e4d4b2] rounded-[12px] border-solid bg-[#f8f1e5] px-[10px] py-[8px] text-center"
        >
          <div
            class="text-[18px] font-bold leading-[1]"
            :class="isRemainingMode(issue) ? 'text-[#d03535]' : 'text-[#9a7a2c]'"
          >
            {{ getProgressText(issue) }}
          </div>
        </div>
      </div>

      <div class="mt-[14px]">
        <div class="h-[10px] overflow-hidden rounded-[999px] bg-[#ece0cc]">
          <div
            class="h-full rounded-[999px] from-[#9a7a2c] via-[#c9a84c] to-[#e8cf85] bg-gradient-to-r transition-all duration-500"
            :style="{ width: `${getProgressWidth(issue)}%` }"
          />
        </div>
      </div>

      <div
        v-if="Number(issue.status) === 1"
        class="mt-[12px] flex items-start gap-[8px] border border-[#e0c880] rounded-[14px] border-solid bg-[#fff9eb] px-[12px] py-[10px]"
      >
        <div class="text-[18px]">
          ⏳
        </div>
        <div>
          <div class="text-[12px] text-[#9a7a2c] font-bold">
            {{ t('Pending Draw') }}
          </div>
          <div class="mt-[4px] text-[11px] text-[#8a7a5a]">
            {{ drawCountdownText }}
          </div>
        </div>
      </div>

      <div class="mt-[12px] rounded-[14px] bg-[#faf6ed] px-[12px] py-[10px]">
        <div class="mb-[6px] text-[10px] text-[#b0a080]">
          {{ t('Latest Winner Preview') }}
        </div>
        <div v-if="getIssueWinnerPreview(issue).length" class="flex gap-[6px] overflow-x-auto whitespace-nowrap">
          <div
            v-for="log in getIssueWinnerPreview(issue)" :key="log.id"
            class="min-w-[92px] inline-flex flex-col border border-[#eadfcf] rounded-[10px] border-solid bg-[#fffaf2] px-[8px] py-[6px]"
          >
            <span class="text-[9px] text-[#b0a080]">{{ t('Issue') }} {{ log.issueNo }}</span>
            <span class="mt-[2px] text-[10px] text-[#1e1608] font-bold">{{ log.winnerPhone }}</span>
            <span class="mt-[2px] text-[10px] text-[#9a7a2c] font-bold">{{ log.winnerCode }}</span>
          </div>
        </div>
        <div v-else class="text-[11px] text-[#b0a080]">
          {{ t('No draw history yet') }}
        </div>
      </div>

      <button
        class="mt-[14px] h-[44px] w-full rounded-[999px] border-none text-[14px] font-bold tracking-[1px]"
        :class="issue.canBuy && Number(issue.status) === 0 ? 'bg-gradient-to-r from-[#9a7a2c] via-[#c9a84c] to-[#e8cf85] text-[#1e1608]' : 'bg-[#d8d0c0] text-white'"
        :disabled="!issue.canBuy || Number(issue.status) !== 0 || buying"
        @click="emit('buy', issue)"
      >
        {{ issue.canBuy && Number(issue.status) === 0 ? t('Join Now') : getIssueStatusText(issue.status) }}
      </button>
    </div>
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

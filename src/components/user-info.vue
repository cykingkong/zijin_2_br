<script setup>
const props = defineProps({
  showAsset: {
    type: Boolean,
    default: false,
  },

})
import { useUserStore } from '@/stores'
import { addCommasToNumber } from '@/utils/tool'
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
console.log(userInfo.value, 'sddd')
</script>

<template>
  <div class="user-info-content">
    <div class="user-info px-12 py-16">
      <div class="avatar h-44 w-44 rounded-full" />
      <div class="info-box .dark:font-color-#fff .light:font-color-#000">
        <div class="name">
          {{ userInfo.username }}
        </div>
        <div class="id mt-4 flex flex-items-center">
          ID:{{ userInfo.userId }} <img class="h-14 w-14"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAYAAAC4JqlRAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADcSURBVHgB7ZbPCcIwFId/iSn06AgdoSO4ggMo9iQ9KDiBblA8SI8GxHtHcARHyAgeC5Y+I3ooiNi0YhXfB0kgf+Dj5ZEX4N8RLpuTdBtIqAkaIkBmHo91dU7BCRVIKZZoComD7XV1SqJjHCNQGEGedjlBEiHItncILOLI2CFyObNOdyt7bfUFks0+hCz7aEVh7rIveRBQHiU2WQZoAZW9a5R0nb2dJyELsAALsAALOJZjd6TEUdCtLghBBp8WmE1HmR2yZ+ucAyzAAt/3EBXeeejnaPUrzn2cwPwKFxW7LTg5Kt77AAAAAElFTkSuQmCC"
            alt="id">
        </div>
      </div>
    </div>
    <div v-if="props.showAsset" class="asset px-12 font-size-12">
      <div class="line flex">
        <div class="line-item flex-1 text-align-left">
          <p class="title">
            ETF总资产
          </p>
          <p class="content">
            $ {{ addCommasToNumber(userInfo.assetsBalance.availableBalanceUsd) }}

          </p>
        </div>
        <div class="line-item flex-1 text-align-right">
          <p class="title">
            ETF浮动盈亏
          </p>
          <p class="content "
            :class="{ up: userInfo.assetsData.totalProfitRate >= 0, down: userInfo.assetsData.totalProfitRate < 0 }">
            {{ userInfo.assetsData.totalProfitRate }} %
          </p>
        </div>
      </div>
      <div class="line flex">
        <div class="line-item flex-1 text-align-left">
          <p class="title">
            ETF可用余额
          </p>
          <p class="content">
            $ {{ addCommasToNumber(userInfo.assetsBalance.availableBalanceBrl) }}

            <!-- $ {{ userInfo.asset[1].balance || "" }} -->
          </p>
        </div>
        <div class="line-item flex-1 text-align-right">
          <p class="title">
            ETF当日盈亏
          </p>
          <p class="content "
            :class="{ up: userInfo.assetsData.totalProfit >= 0, down: userInfo.assetsData.totalProfit < 0 }">
            {{ userInfo.assetsData.totalProfit }} %
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.user-info {
  width: 100%;
  background: #131a2e;
  display: flex;
  align-items: center;
  gap: 10px;

  .avatar {
    flex-shrink: 0;
    background: white;
  }

  .info-box {
    flex: 1;
    color: var(--van-text-color);

    .name {
      font-size: 16px;
      line-height: 20px;
    }

    .id {
      font-size: 14px;
      gap: 12px;
    }
  }
}

.asset {
  // background: var(--bg);

  grid-template-columns: 1fr 1fr;

  .asset-item {
    width: 100%;

    .line {}
  }
}
</style>

<script setup>
import { useUserStore } from '@/stores'
import { addCommasToNumber } from '@/utils/tool'
const props = defineProps({
  showAsset: {
    type: Boolean,
    default: false,
  },
  assetTitle: {
    type: String,
    default: ''
  },
  activeName: {
    type: String,
    default: '1' // 1:usd 2:brl
  }
})

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
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
            总资产
          </p>
          <p class="content" v-if="activeName == '1'">
            $ {{ addCommasToNumber(userInfo.assetsBalance.availableBalanceUsd) }}
          </p>
          <p class="content" v-if="activeName == '2'">
            $ {{ addCommasToNumber(userInfo.assetsBalance.availableBalanceBrl) }}
          </p>
        </div>
        <div class="line-item flex-1 text-align-right">
          <p class="title">
            浮动盈亏
          </p>
          <p class="content " v-if="activeName == '1'"
            :class="{ up: userInfo.assetsData.totalProfitRateUsd >= 0, down: userInfo.assetsData.totalProfitRateUsd < 0 }">
            {{ userInfo.assetsData.totalProfitRateUsd }} %
          </p>
          <p class="content " v-if="activeName == '2'"
            :class="{ up: userInfo.assetsData.totalProfitRateBrl >= 0, down: userInfo.assetsData.totalProfitRateBrl < 0 }">
            {{ userInfo.assetsData.totalProfitRateBrl }} %
          </p>
        </div>
      </div>
      <div class="line flex">
        <div class="line-item flex-1 text-align-left">
          <p class="title">
            可用余额
          </p>
          <p class="content">
            $ {{ activeName == '1' ? addCommasToNumber(userInfo.assetsBalance.availableBalanceUsd) :
              addCommasToNumber(userInfo.assetsBalance.availableBalanceBrl) }}

            <!-- $ {{ userInfo.asset[1].balance || "" }} -->
          </p>
        </div>
        <div class="line-item flex-1 text-align-right">
          <p class="title">
            总投入
          </p>
          <p class="content " v-show="activeName == '1'"
            :class="{ up: userInfo.assetsData.totalAmountUsd >= 0, down: userInfo.assetsData.totalAmountUsd < 0 }">
            $ {{ userInfo.assetsData.totalAmountUsd }}
          </p>
          <p class="content " v-show="activeName == '2'"
            :class="{ up: userInfo.assetsData.totalAmountBrl >= 0, down: userInfo.assetsData.totalAmountBrl < 0 }">
            $ {{ userInfo.assetsData.totalAmountBrl }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.user-info {
  width: 100%;
  // background: #131a2e;
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

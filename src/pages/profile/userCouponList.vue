<template>
  <div class="stockOrderList w-full p-24">


    <div v-for="(item, index) in couponList" :key="index"
      class="coupon-item z-1 relative  rounded-[12px] p-[16px] cursor-pointer transition-all duration-200 mb-16">
      <div
        class="notches absolute -left-[5px] top-[71px] w-[10px] z-[10] h-[10px] bg-[#fff] rounded-full border-r border-[#eee]">
        <svg class="absolute -left-[2px] top-[-1px] w-11 h-12" viewBox="0 0 10 10">
          <path d="M 5 0 A 5 5 0 0 0 5 10 Z" fill="#FFFFFF" />
          <path d="M 5 0 A 5 5 0 0 0 5 10" stroke="#fff" stroke-width="2" fill="none" />
        </svg>
      </div>
      <div
        class="notches absolute -right-[5px] top-[71px] w-[10px] z-10 h-[10px] bg-[#fff] rounded-full border-l border-[#eee]">
        <svg class="absolute -right-[2px] top-[-2px] w-12 h-13" wi viewBox="0 0 10 10">
          <path d="M 5 0 A 5 5 0 0 1 5 10 Z" fill="#FFFFFF" />
          <path d="M 5 0 A 5 5 0 0 1 5 10" stroke="#fff" stroke-width="2" fill="none" />
        </svg>
      </div>
      <div class="flex justify-between items-start mb-[8px]">
        <div class="font-bold text-[15px] text-[#1A1A1A]">{{ item.couponName }}</div>

      </div>

      <div class="countdown flex items-center text-[12px] text-[#FF4E4E] mb-[12px] gap-6">
        <van-icon name="clock-o" class="mr-1" />
        <span>{{ $t('RemainingUseTime') }} {{ item.validEndTime }}</span>
      </div>

      <div class="coupon-divider relative mb-[12px]">
      </div>

      <div class="terms text-[12px] text-[#666]">
        <span class="text-[#00B86B]">Terms and conditions</span> apply for eligible products
      </div>
    </div>
    <empty v-if="couponList.length == 0" :no-tips="true" />

  </div>
</template>
<script setup lang="ts">

import { useUserStore } from '@/stores';

const userStore = useUserStore();
const couponList = computed(() => {
  return userStore.userInfo?.couponsList || []
})


onMounted(() => {
  userStore.getUserCouponList(1)
})

</script>
<style lang="less" scoped>
// --- 新增变量 ---
@coupon-border-color: #F0F0F0; // 优惠券未选中时的边框颜色（图中为黄色）
@coupon-active-color: #ffd700; // 优惠券选中时的边框颜色
@coupon-bg-color: #fff;
@notch-size: 10px; // 凹口（半圆）的直径

.productDetail {
  padding-bottom: calc(env(safe-area-inset-bottom) + 180px);
}

.header-section {
  border-bottom: 2px dashed #eee;
}

.dashed-line {
  border-top: 1px dashed #eee;
}

.coupon-item {
  border: 1px solid @coupon-border-color; // 默认使用黄色边框
  box-shadow: 0 0 0 1px @coupon-border-color inset; // 添加内嵌阴影模拟双线边框
  background-color: @coupon-bg-color;
  // overflow: hidden; // 隐藏凹口溢出的部分
  padding-bottom: 16px; // 确保底部有足够的内边距
}

.active-coupon {
  border-color: #FFD700;
}

.coupon-divider {
  // 自身不显示边框，仅作为伪元素的容器
  height: 1px;

  width: 100%;
  border-top: 1px dashed #e5e5e5;
  height: 0; // 移除默认高度

}


.notches {
  border: 1.5px solid #F0F0F0;
}

.active-notches {
  border-color: #FFD700;
}
</style>
<route lang="json5">
    {
      name: 'userCouponList',
      meta: {
        title: 'userCouponList',
        i18n: 'userCouponList',
      },
    }
</route>
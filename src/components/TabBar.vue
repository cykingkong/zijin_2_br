<script setup lang="ts">
import { routeWhiteList } from "@/config/routes";
import home from '@/assets/tabbar/home.png'
import picture from '@/assets/tabbar/picture.png'
import wallet from '@/assets/tabbar/wallet.png'
import help from '@/assets/tabbar/help.png'

const { t } = useI18n();
const active = ref(0);
const route = useRoute();

const show = computed(() => route.name && routeWhiteList.includes(route.name));
const tabList = [
  {
    name: "Home",
    path: "/",
    icon: home,
  },
  {
    name: "Picture",
    path: "/news",
    icon: picture,
  },
  {
    name: "Wallet",
    path: "/profile",
    icon: wallet,
  },
  {
    name: "Help",
    path: "/help",
    icon: help,
  },

];
</script>

<template>
  <!-- 移除 placeholder，因为悬浮样式通常需要自定义页面底部内边距，或者保留它但在CSS中特殊处理 -->
  <!-- 移除 active-color 属性，改用 CSS 控制 -->
  <van-tabbar v-if="show" v-model="active" route z-index="9999" class="custom-floating-tabbar">
    <van-tabbar-item replace :to="item.path" v-for="(item, k) in tabList" :key="k">
      <!-- 移除 {{ t(item.name) }} 文字，仅保留图标以符合设计图 -->

      <template #icon="props">

          <img :src="item.icon" alt="" class=" " :class="{'active-icon': k === active}">
      </template>
      {{ t(item.name) }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<style lang="less" scoped>
.custom-floating-tabbar {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(env(safe-area-inset-bottom) + 20px);
  width: calc(100% - 32px);
  max-width: 640px;
  height: 78px;
  padding: 0 12px;
  border-top: none;
  border-radius: 999px;
  background:
    linear-gradient(180deg, rgba(17, 17, 17, 0.96) 0%, rgba(8, 8, 8, 0.98) 100%);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.04),
    inset 0 -8px 20px rgba(0, 0, 0, 0.45),
    0 8px 24px rgba(0, 0, 0, 0.45),
    0 0 30px rgba(124, 255, 178, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at top center, rgba(124, 255, 178, 0.12), transparent 52%);
    pointer-events: none;
  }

  :deep(.van-tabbar-item) {
    position: relative;
    z-index: 1;
    background: transparent;
    color: #6b6b6b;
    transition: all 0.3s ease;

    .van-tabbar-item__text {
      margin-top: 2px;
      font-size: 11px;
      line-height: 1.2;
      letter-spacing: 0.04em;
      color: #6b6b6b;
      transition: all 0.3s ease;
    }

    .van-tabbar-item__icon {
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
      border-radius: 50%;
      transition: all 0.3s ease;

      img {
        width: 24px;
        height: 24px;
        object-fit: contain;
        opacity: 0.72;
        transition: all 0.3s ease;
      }
    }

    &--active {
      background: transparent;
      color: #f5f5f5;

      .van-tabbar-item__text {
        color: #8bffbe;
        font-weight: 700;
      }

      .van-tabbar-item__icon {
        background: rgba(124, 255, 178, 0.08);
        box-shadow:
          inset 0 0 0 1px rgba(124, 255, 178, 0.2),
          0 0 12px rgba(124, 255, 178, 0.24),
          0 0 36px rgba(124, 255, 178, 0.12);

        img {
          opacity: 1;
          filter: drop-shadow(0 0 10px rgba(124, 255, 178, 0.28));
        }
      }
    }
  }
}

.active-icon {
  opacity: 1;
}
</style>

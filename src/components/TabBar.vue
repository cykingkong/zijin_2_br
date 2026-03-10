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
// 自定义悬浮 Tabbar 样式
.custom-floating-tabbar {
  // 1. 设置悬浮和胶囊形状
  position: fixed;
  left: 50%;
  transform: translateX(-50%); // 水平居中
  bottom: calc(env(safe-area-inset-bottom) + 24px); // 距离底部的悬浮高度
  width: calc(100% - 48px); // 左右留出间距
  max-width: 600px; // 在大屏上限制最大宽度
  height: 72px; // 增加高度以容纳更大的圆形按钮
  border-radius: 999px; // 胶囊圆角
  background-color: #ffffff;
  border-top: none; // 移除默认的边框
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); // 添加阴影增加立体感
  padding: 0 10px; // 内部左右内边距

  // 2. 穿透修改 vant-tabbar-item 样式
  :deep(.van-tabbar-item) {
    background: transparent;

    // 选中态时的图标容器样式 (黑色圆圈)
    &--active {
      background: transparent;
      color:#1B1B1B;
      font-weight: bold;
      .van-tabbar-item__icon {
        background-color: rgba(26, 115, 232, 0.12); // 选中时的黑色背景
        width: 40px; // 圆圈宽度
        height: 40px; // 圆圈高度
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0; // 移除图标下方的默认间距
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.327); // 圆圈的阴影
        transition: all 0.3s ease; // 添加平滑过渡动画
        margin-bottom: 6px;
        img{
          width: 24px;
          height: 24px;
        }
      }
    }

    // 未选中态时的图标容器，保持高度一致以防抖动
    .van-tabbar-item__icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
        margin-bottom: 6px;
      justify-content: center;
      transition: all 0.3s ease;
         img{
          width: 24px;
          height: 24px;
        }
    }
  }
}

// 3. 图标颜色控制
.active-icon {
  path {
    // stroke: #ffffff !important; // 选中时图标变为白色
    // fill: #ffffff !important; // 选中时图标填充白色
  }
}
</style>

<script setup lang="ts">
import { routeWhiteList } from "@/config/routes";

const { t } = useI18n();
const active = ref(0);
const route = useRoute();

const show = computed(() => route.name && routeWhiteList.includes(route.name));
const tabList = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Picture",
    path: "/news",
  },
  {
    name: "Wallet",
    path: "/profile",
  },
  {
    name: "Help",
    path: "/help",
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

        <!-- Home -->

        <svg :class="props.active ? 'active-icon' : ''" v-if="item.name == 'Home'" class="w-24 h-24" viewBox="0 0 21 22"
          fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_6869_1253" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="21"
            height="22">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H20.4998V21.505H0V0Z" fill="white" />
          </mask>
          <g mask="url(#mask0_6869_1253)">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M11.7168 14.2913C12.9208 14.2913 13.9008 15.2642 13.9008 16.4603V19.5362C13.9008 19.7932 14.1068 19.9992 14.3708 20.0052H16.2768C17.7788 20.0052 18.9998 18.7993 18.9998 17.3173V8.59325C18.9928 8.08325 18.7498 7.60325 18.3328 7.28425L11.7398 2.02625C10.8548 1.32525 9.6168 1.32525 8.7288 2.02825L2.1808 7.28225C1.7478 7.61125 1.5048 8.09125 1.4998 8.61025V17.3173C1.4998 18.7993 2.7208 20.0052 4.2228 20.0052H6.1468C6.4178 20.0052 6.6378 19.7902 6.6378 19.5262C6.6378 19.4682 6.6448 19.4102 6.6568 19.3552V16.4603C6.6568 15.2712 7.6308 14.2993 8.8258 14.2913H11.7168ZM16.2768 21.5053H14.3528C13.2508 21.4793 12.4008 20.6143 12.4008 19.5363V16.4603C12.4008 16.0913 12.0938 15.7913 11.7168 15.7913H8.8308C8.4618 15.7933 8.1568 16.0943 8.1568 16.4603V19.5263C8.1568 19.6013 8.1468 19.6733 8.1258 19.7413C8.0178 20.7313 7.1718 21.5053 6.1468 21.5053H4.2228C1.8938 21.5053 -0.000198364 19.6262 -0.000198364 17.3172V8.60325C0.00980164 7.60925 0.467802 6.69925 1.2588 6.10025L7.7938 0.85525C9.2328 -0.28475 11.2378 -0.28475 12.6738 0.85325L19.2558 6.10325C20.0288 6.69225 20.4868 7.60025 20.4998 8.58225V17.3172C20.4998 19.6262 18.6058 21.5053 16.2768 21.5053Z"
              fill="#8C91A2" />
          </g>
        </svg>

        <!-- Product -->
        <svg class="w-24 h-24" v-if="item.name == 'Picture'" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
            :stroke="props.active ? '#fff' : '#8C91A2'" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M12 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V11"
            :stroke="props.active ? '#fff' : '#8C91A2'" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M16.12 5.11002C15.79 4.07002 16.18 2.78002 17.26 2.43002C17.83 2.25002 18.54 2.40002 18.94 2.95002C19.32 2.38002 20.05 2.24002 20.62 2.43002C21.71 2.78002 22.1 4.07002 21.77 5.11002C21.25 6.75002 19.45 7.61002 18.95 7.61002C18.44 7.61002 16.65 6.77002 16.12 5.11002Z"
            :stroke="props.active ? '#fff' : '#8C91A2'" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M2.66998 18.9501L7.59998 15.6401C8.38998 15.1101 9.52998 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001"
            :stroke="props.active ? '#fff' : '#8C91A2'" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>




        <!-- News -->

        <svg class="w-24 h-24" :class="props.active ? 'active-icon' : ''" v-if="item.name == 'Help'" viewBox="0 0 24 24"
          fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M11.2113 11.2119L10.1643 14.5589L13.5103 13.5109L14.5583 10.1639L11.2113 11.2119ZM9.02033 16.4519C8.82433 16.4519 8.63233 16.3749 8.48933 16.2329C8.29233 16.0349 8.22033 15.7439 8.30433 15.4789L9.89733 10.3899C9.97033 10.1539 10.1543 9.97089 10.3883 9.89789L15.4773 8.30489C15.7443 8.21989 16.0343 8.29289 16.2323 8.48989C16.4293 8.68789 16.5013 8.97889 16.4173 9.24389L14.8253 14.3329C14.7523 14.5679 14.5673 14.7519 14.3333 14.8249L9.24433 16.4179C9.17033 16.4409 9.09433 16.4519 9.02033 16.4519Z"
            fill="#8C91A2" />
          <mask id="mask0_5701_57939" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="2" y="2" width="21"
            height="21">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2 2H22.7218V22.7217H2V2Z" fill="white" />
          </mask>
          <g mask="url(#mask0_5701_57939)">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M12.3608 3.5C7.47476 3.5 3.49976 7.476 3.49976 12.361C3.49976 17.247 7.47476 21.222 12.3608 21.222C17.2468 21.222 21.2218 17.247 21.2218 12.361C21.2218 7.476 17.2468 3.5 12.3608 3.5ZM12.3608 22.722C6.64776 22.722 1.99976 18.074 1.99976 12.361C1.99976 6.648 6.64776 2 12.3608 2C18.0738 2 22.7218 6.648 22.7218 12.361C22.7218 18.074 18.0738 22.722 12.3608 22.722Z"
              fill="#8C91A2" />
          </g>
        </svg>
        <!-- TaskBonus -->
        <svg  class="w-24 h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          v-if="item.name == 'Wallet'">
          <path
            d="M10.7516 16.8604V18.8904C10.7516 20.6104 9.15158 22.0004 7.18158 22.0004C5.21158 22.0004 3.60156 20.6104 3.60156 18.8904V16.8604C3.60156 18.5804 5.20158 19.8004 7.18158 19.8004C9.15158 19.8004 10.7516 18.5704 10.7516 16.8604Z"
            :stroke="props.active ? '#fff' : '#8C91A2'" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M10.7501 14.11C10.7501 14.61 10.6101 15.07 10.3701 15.47C9.78006 16.44 8.57004 17.05 7.17004 17.05C5.77004 17.05 4.56003 16.43 3.97003 15.47C3.73003 15.07 3.59009 14.61 3.59009 14.11C3.59009 13.25 3.99007 12.48 4.63007 11.92C5.28007 11.35 6.17003 11.01 7.16003 11.01C8.15003 11.01 9.04006 11.36 9.69006 11.92C10.3501 12.47 10.7501 13.25 10.7501 14.11Z"
            :stroke="props.active ? '#fff' : '#8C91A2'" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M10.7516 14.11V16.86C10.7516 18.58 9.15158 19.8 7.18158 19.8C5.21158 19.8 3.60156 18.57 3.60156 16.86V14.11C3.60156 12.39 5.20158 11 7.18158 11C8.17158 11 9.06161 11.35 9.71161 11.91C10.3516 12.47 10.7516 13.25 10.7516 14.11Z"
            :stroke="props.active ? '#fff' : '#8C91A2'" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M22 10.97V13.03C22 13.58 21.56 14.03 21 14.05H19.0399C17.9599 14.05 16.97 13.26 16.88 12.18C16.82 11.55 17.0599 10.96 17.4799 10.55C17.8499 10.17 18.36 9.95001 18.92 9.95001H21C21.56 9.97001 22 10.42 22 10.97Z"
            :stroke="props.active ? '#fff' : '#8C91A2'" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
          <path
            d="M2 10.5V8.5C2 5.78 3.64 3.88 6.19 3.56C6.45 3.52 6.72 3.5 7 3.5H16C16.26 3.5 16.51 3.50999 16.75 3.54999C19.33 3.84999 21 5.76 21 8.5V9.95001H18.92C18.36 9.95001 17.85 10.17 17.48 10.55C17.06 10.96 16.82 11.55 16.88 12.18C16.97 13.26 17.96 14.05 19.04 14.05H21V15.5C21 18.5 19 20.5 16 20.5H13.5"
            :stroke="props.active ? '#fff' : '#8C91A2'" stroke-width="1.3" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>


        <!-- Profile -->
        <svg class="w-24 h-24" :class="props.active ? 'active-icon' : ''" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg" v-if="item.name == 'Profile'">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M11.889 12.6187H11.921C14.849 12.6187 17.23 10.2377 17.23 7.30969C17.23 4.38169 14.849 1.99969 11.921 1.99969C8.99202 1.99969 6.61002 4.3817 6.61002 7.30669C6.60002 10.2267 8.96702 12.6097 11.889 12.6187ZM8.03802 7.30969C8.03802 5.16869 9.78002 3.42769 11.921 3.42769C14.061 3.42769 15.802 5.16869 15.802 7.30969C15.802 9.44969 14.061 11.1917 11.921 11.1917H11.892C9.76002 11.1837 8.03102 9.4437 8.03802 7.30969Z"
            fill="#8C91A2" />
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M4 18.173C4 21.87 9.962 21.87 11.921 21.87C15.32 21.87 19.84 21.489 19.84 18.193C19.84 14.496 13.88 14.496 11.921 14.496C8.521 14.496 4 14.877 4 18.173ZM5.5 18.173C5.5 16.728 7.66 15.996 11.921 15.996C16.181 15.996 18.34 16.735 18.34 18.193C18.34 19.638 16.181 20.37 11.921 20.37C7.66 20.37 5.5 19.631 5.5 18.173Z"
            fill="#8C91A2" />
        </svg>
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
  height: 82px; // 增加高度以容纳更大的圆形按钮
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
        background-color: #1B1B1B; // 选中时的黑色背景
        width: 54px; // 圆圈宽度
        height: 54px; // 圆圈高度
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0; // 移除图标下方的默认间距
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // 圆圈的阴影
        transition: all 0.3s ease; // 添加平滑过渡动画

      }
    }

    // 未选中态时的图标容器，保持高度一致以防抖动
    .van-tabbar-item__icon {
      width: 54px;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
  }
}

// 3. 图标颜色控制
.active-icon {
  path {
    // stroke: #ffffff !important; // 选中时图标变为白色
    fill: #ffffff !important; // 选中时图标填充白色
  }
}
</style>

<script setup>
import router from "@/router";
import Grid from "@/components/grid.vue";
import { useUserStore } from "@/stores";
import LangSelectDropdown from '@/components/LangSelectDropdown.vue'
import { navTitleStore } from "@/stores/index";
import { receiveCoupon } from '@/api/product'
import { isLogin } from "@/utils/auth";
import { useI18n } from "vue-i18n";
import { indexInfo, articleList } from "@/api/market";
import local from "@/utils/local";
import { closeToast, showLoadingToast } from "vant";
import { getKfUrl } from '@/api/user'
import { ref, computed, watch, onMounted } from 'vue'; // 确保引入了 ref 等
import { showToast, showSuccessToast, showFailToast } from 'vant';

const { t } = useI18n();
const navStore = navTitleStore();
const newsList = ref([]);
const activityList = ref([])
// getStockData();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const indexInfoData = ref({
  banners: [],
  discountBanners: [],
});
// 2. 定义 video 的 ref 引用
const bannerVideoRef = ref(null);
const lang = ref(local.getlocal('lang') || 'br')

// --- 新增：判断是否为视频 ---
const isVideo = (url) => {
  if (!url) return false;
  // 如果后台 url 没有后缀，或者通过 type 字段判断，请修改此处逻辑
  const videoExtensions = ['.mp4', '.mov', '.webm', '.ogg']; 
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
};
// -------------------------

let pathEnum = {
  0: 'SignIn',
  1: 'team',
  2: 'inviteFriends',
  3: '',
  4: 'weeklySalary',
  5: 'monthlySalary',
  6: 'yearSalary',
  7: 'taskbonus',
  8: 'receive',
}
function handleClickSeeAll() {
  router.push({
    path: '/faqList',
  })
}
function handleClickGrid(val) {
  if (val == 3) {
    showToast({
      message:'Em desenvolvimento...'
    })
    return
  }
  router.push({
    path: pathEnum[val],
  });
  return
  // ... 原有的被注释或未执行的代码保持原样
}
const handleClickBanner = async (item) => {
  if (!item.coupon_id) return
  const res = await receiveCoupon({
    couponId: item?.coupon_id
  })
  if (res.code == 200) {
    // 注意：原代码这里似乎缺少 showSuccessToast 的 import，请确认
    showSuccessToast({}) 
    console.log('Coupon received');
  }
}
function getContent(html) {
  if (!html) return "";
  const reg = /<[^>]+>/g;
  return html.replace(reg, "");
}
const indexData = ref({});

function init() {
  // 只有在用户已登录的情况下才调用 info
  if (isLogin()) {
    userStore.info();
  } else {
    router.push({
      path: "/login",
    });
  }
  indexInfo().then((res) => {
    indexInfoData.value = res.data
    if (res.data.notice) {
      indexInfoData.value.noticeContent = getContent(indexInfoData.value.notice)
      indexInfoData.value.banners = [{
        url:'https://api.signet-jewelers-br.com/video.mp4'
      }]
      // // 3. JS 实现自动播放逻辑
      // nextTick(() => {
      //   // v-for 中的 ref 会自动变成数组，取第一个
      //   const videoEl = bannerVideoRef.value?.[0]; 
      //   if (videoEl) {
      //     // 确保静音（浏览器策略核心）
      //     videoEl.muted = true; 
      //     // 尝试播放
      //     const playPromise = videoEl.play();
      //     videoEl.muted = false; 

      //     if (playPromise !== undefined) {
      //       playPromise.catch(error => {
      //         console.log("Auto-play was prevented by browser:", error);
      //         // 这里可以做降级处理，比如显示一个播放按钮
      //       });
      //     }
      //   }
      // })
      const readedNotice = local.getlocal('readedNotice')
      if (res.data.pop_status == '1') {
        local.setlocal('readedNotice', '0')
        showDatePicker.value = true
      }
    }
    console.log(indexInfoData.value)
  })
  getArticleList({ article_type: 2 })
  getArticleList({ article_type: 3 })
}
function getArticleList(params) {
  // 1 关于我们 常见问题 2 新闻中心 3 新闻活动
  articleList({ pageIndex: 1, pageSize: 20, ...params }).then(({ data, code }) => {
    if (code == 200) {
      if (params.article_type === 2) {
        newsList.value = data.rows
      }
      else if (params.article_type === 3) {
        activityList.value = data.rows
      }
    }
  });
}
const handleClickItem = (item) => {
  localStorage.setItem('activityDetail', JSON.stringify(item))
  router.push({
    path: '/activityDetail',
  })
}
const handleClickNoticeDetail = () => {
  localStorage.setItem('noticeDetail', JSON.stringify(indexInfoData.value.notice))
  router.push({
    path: '/noticeDetail',
  })
}
const categoryId = ref();

const showDatePicker = ref(false);
function cancelNotice() {
  showDatePicker.value = false;
  local.setlocal("readedNotice", "1");
}

showLoadingToast({
  message: "",
  duration: 0,
});
navStore.setShowNavLeft(false);
watch(
  () => navStore.showNavLeft,
  () => {
    if (navStore.showNavLeft) {
      closeToast();
    }
  }
);
const formatName = (str) => {
  if (typeof str !== 'string') {
    return '';
  }
  let processedStr = str;
  if (str.startsWith('91')) {
    processedStr = str.substring(2);
  }
  if (processedStr.length <= 6) {
    return processedStr;
  }
  const firstThree = processedStr.substring(0, 3);
  const lastThree = processedStr.substring(processedStr.length - 3);
  return `${firstThree}***${lastThree}`;
};
onMounted(() => {
  init();
  navStore.setShowNavLeft(true);
});
</script>

<template>
  <div class="Home bg-[#f7f7f7] pb-[120px]">
    <header class="header flex items-center justify-between">
      <div class="left flex items-center gap-[16px]">
        <div class="info">
          <img src="@/assets/Logo.png" alt="" class="w-auto h-30">
        </div>
      </div>
      <div class="flex justify-center items-center icon-box gap-[8px]">
        <div class="relative" @click="handleClickGrid(8)">
          <div
            class="dot absolute bottom-[8px] right-[1px]  rounded-full bg-[#FF4E4E] color-[#fff] text-[8px] w-[5px] h-[5px] text-center"
            v-if="userInfo.productCount">
          </div>
          <svg class="w-20 h-20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.0167 2.42505C7.25835 2.42505 5.01668 4.66672 5.01668 7.42505V9.83338C5.01668 10.3417 4.80001 11.1167 4.54168 11.55L3.58335 13.1417C2.99168 14.125 3.40001 15.2167 4.48335 15.5834C8.07501 16.7834 11.95 16.7834 15.5417 15.5834C16.55 15.2501 16.9917 14.0584 16.4417 13.1417L15.4833 11.55C15.2333 11.1167 15.0167 10.3417 15.0167 9.83338V7.42505C15.0167 4.67505 12.7667 2.42505 10.0167 2.42505Z"
              stroke="#161616" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
            <path
              d="M11.5583 2.6667C11.3 2.5917 11.0333 2.53337 10.7583 2.50003C9.95831 2.40003 9.19164 2.45837 8.47498 2.6667C8.71664 2.05003 9.31664 1.6167 10.0166 1.6167C10.7166 1.6167 11.3166 2.05003 11.5583 2.6667Z"
              stroke="#161616" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
              stroke-linejoin="round" />
            <path
              d="M12.5167 15.8833C12.5167 17.2583 11.3917 18.3833 10.0167 18.3833C9.33333 18.3833 8.7 18.1 8.25 17.65C7.8 17.2 7.51666 16.5666 7.51666 15.8833"
              stroke="#161616" stroke-width="1.5" stroke-miterlimit="10" />
          </svg>
        </div>
      </div>
    </header>

    <!-- First Swipe Area -->
    <div class="detail-image w-full px-[24px]" v-if="indexInfoData.banners.length > 0">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <!-- Added index to key, and video check -->
        <van-swipe-item v-for="(item, index) in indexInfoData.banners" :key="index" @click="handleClickBanner(item)">
          <div class="image bg-[#f5f5f5] rounded-[16px] w-full h-full overflow-hidden relative">
            <video 
              v-if="isVideo(item.url)" 
              ref="bannerVideoRef"
              :src="item.url" 
              class="w-full h-full object-cover rounded-[16px] block"
              autoplay 
              loop 
              playsinline 
              webkit-playsinline
            ></video>
            <img v-else :src="item.url" alt="" class="w-full h-full object-cover rounded-[16px] block">
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- notice -->
    <div class="w-full pl-[4px] pr-[4px] my-16">
      <div class="notice text-[12px]  w-full border-[1px] px-12 h-42  px-4 py-2 overflow-hidden flex items-center"
        @click="handleClickNoticeDetail">
        <div class="content text-no-wrap w-full">
          <van-notice-bar scrollable :text="indexInfoData.noticeContent" background="transparent" color="#161616"
            class="notice flex-1">
            <template #left-icon> <svg class="mr-12 w-12 h-12" viewBox="0 0 12 12" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.99464 1.52131L3.0985 3.7067H1.14209V8.27507H3.10021L3.32349 8.37557L7.99464 10.4759V1.52131ZM8.51087 0.0405852C8.745 -0.0759082 9.0111 0.0668531 9.10476 0.360371C9.12589 0.427183 9.13673 0.498564 9.13673 0.571087V11.429C9.13673 11.7442 8.9323 12 8.6799 12C8.62093 11.9997 8.56285 11.9856 8.5103 11.9589L2.85523 9.41716H0.456837C0.204434 9.41716 -1.67299e-08 9.16133 0 8.84611V3.13565C0 2.82044 0.204434 2.56461 0.456837 2.56461H2.85523L8.51087 0.0405852ZM10.2788 3.13565H11.4209V8.84611H10.2788V3.13565Z"
                  fill="black" />
              </svg>
            </template>
            <template #right-icon>
              <svg class="w-14 h-14 ml-14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="14" height="1.5" fill="#1D1F22" />
                <rect y="6" width="14" height="1.5" fill="#1D1F22" />
                <rect y="12" width="14" height="1.5" fill="#1D1F22" />
              </svg>
            </template>
          </van-notice-bar>
        </div>
      </div>
    </div>

   

    <Grid @handleClickGrid="handleClickGrid" />
 <!-- Second Swipe Area -->
    <div class="detail-image w-full px-[24px]"
      v-if="indexInfoData.discountBanners && indexInfoData.discountBanners.length > 0">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <!-- Added index to key, and video check -->
        <van-swipe-item v-for="(item, index) in indexInfoData.discountBanners" :key="index" @click="handleClickBanner(item)">
          <div class="image bg-[#f5f5f5] rounded-[16px] w-full h-full overflow-hidden relative">
            <video 
              v-if="isVideo(item.url)" 
              :src="item.url" 
              class="w-full h-full object-cover rounded-[16px] block"
              muted autoplay loop playsinline webkit-playsinline
            ></video>
            <img v-else :src="item.url" alt="" class="w-full h-full object-cover rounded-[16px] block">
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="indicator-title px-24 font-bold text-[16px] mt-12 flex items-center justify-between">
      {{ t("FAQ") }}
      <div class="see-all text-[14px] color-[#9CA3AF] flex items-center" @click="handleClickSeeAll">{{ t("See all") }} <svg width="14"
          height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.19751 11.62L9.00084 7.81667C9.45001 7.3675 9.45001 6.6325 9.00084 6.18334L5.19751 2.38"
            stroke="#8C91A2" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
    <div class="news-list px-24 py-16 flex flex-col gap-12">
      <FaqItem v-for="(item, index) in newsList" :key="index" :item="item" @click="handleClickItem(item)" />
    </div>

    <van-popup v-model:show="showDatePicker" position="center" :round="true">
      <div class="h-auto max-h-500 overflow-y-auto p-12">
        <div class="div" v-html="indexInfoData.notice" />
      </div>
      <div class="w-full flex gap-12 px-12 pb-12">
        <div class="btn-box flex-1">
          <van-button type="default" class="h-[40]!" plain block @click="cancelNotice">
            {{ t("Cancel") }}
          </van-button>
        </div>
        <div class="btn-box flex-1">
          <van-button type="primary" class="h-[40]!" block @click="cancelNotice">
            {{ t("Confirm") }}
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<!-- Style 保持不变 -->
<route lang="json5">
{
  name: 'home',
  meta: {
    title: 'home',
    i18n: 'Página inicial'
  },
}
</route>

<style lang="less" scoped>
.iconTop3 {
  width: 9px;
  height: 8px;
}
.header {
  display: flex;
  height: 64px;
  padding: 0 24px;
  align-items: center;
  justify-content: space-between;
  color: var(--van-text);

  .left {
    font-size: 20px;
    font-style: italic;
    font-weight: 400;
  }

  .right {
    display: flex;
    align-items: center;
    img {
      width: 22px;
      height: 22px;
    }
  }
}
.kf-fixed {
  z-index: 1002;
}
// :deep(.van-tabs__line) {
//   background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADxSURBVHgBnVHLDYJAEJ1ZjJ+LoQTsQDtA48GjJXj1YNQKKIGDIR4pQY8eTLQD7EBKIIZIBGEEiQSR5eNLNrs7efP27RsEDiZbR3J9OEXnrtce7Ndo5fEYT8D1cRluUrTslqPweFjw+jVdawrQO8w7ZiUHbkBqtub5oOdxfwRGmjMDwmm2TgDyeOPIpQIhk/vfAEGfqiRyBUbaI2qWgA/p1riv0oUkxHdwTzIAUYRCoNUUaPAJNHHgBaH10uYIJHoBql8OZM3uMxIMqAFGMDwuOmcWX4Qd1ARhHDbGY8ufcQWZNSsaWzmYwsIQTPgTCHR5AaMKT03qmstiAAAAAElFTkSuQmCC) no-repeat center;
//   width: 9px;
//   height: 8px;
//   background-size: 100% 100%;
// }
</style>

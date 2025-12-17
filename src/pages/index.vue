<script setup>
import router from "@/router";
import Grid from "@/components/grid.vue";
import { useUserStore } from "@/stores";
import { navTitleStore } from "@/stores/index";
import { receiveCoupon } from '@/api/product'
import { isLogin } from "@/utils/auth";
import { useI18n } from "vue-i18n";
import { indexInfo, articleList } from "@/api/market";
import local from "@/utils/local";
import { closeToast, showLoadingToast } from "vant";
import { getKfUrl } from '@/api/user'
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

function handleClickGrid(val) {
  if (val === 0) {

    router.push({
      path: "/exchange",
    });
  }
  if (val === 1) {
    router.push({
      path: "/lottery",
    });

  }
  if (val === 2) {
    router.push({
      path: "/receive",
    });
  }
  if (val === 3) {
    // router.push('/quotes/accountChange?type=3' + '&categoryId=' + categoryId.value)
    getKfUrl().then((res) => {
      if (res.code == 200) {
        window.open(res.data.kfUrl)
      }
    })
  }
  if (val === 4) {
    router.push({
      path: "/community",
    });
  }
}
const handleClickBanner = async (item) => {
  if (!item.coupon_id) return
  const res = await receiveCoupon({
    couponId: item?.coupon_id
  })
  if (res.code == 200) {
    showSuccessToast('Claim Coupon Success')
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
  // getMarketInfo({})
  // getChartsDesc(1)
  // getMarketIndex({
  //   categoryId: 500,
  // })
  // initKfUrl();
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
  // router.push({
  //   path: "/activityDetail",
  //   query: {
  //     id: item.article_id,
  //   },
  // });
  // local.setlocal('activityDetail', item)
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
  // 将姓名开头的62 去掉，然后只显示前三字符和后三字符，中间用***替换
  if (typeof str !== 'string') {
    return '';
  }

  // 去掉开头的62
  let processedStr = str;
  if (str.startsWith('91')) {
    processedStr = str.substring(2);
  }

  // 如果处理后的字符串长度小于等于6，直接返回
  if (processedStr.length <= 6) {
    return processedStr;
  }

  // 截取前3个字符和后3个字符，中间用***替换
  const firstThree = processedStr.substring(0, 3);
  const lastThree = processedStr.substring(processedStr.length - 3);

  return `${firstThree}***${lastThree}`;

};
onMounted(() => {
  init();
  // closeToast();
  navStore.setShowNavLeft(true);
});
</script>

<template>
  <div class="Home">
    <header class="header flex items-center justify-between">
      <div class="left flex items-center gap-[16px]">
        <div class="info">
          <div class="phone color-[#888888] text-12">{{ formatName(userInfo.username) }}</div>
          <div class="lv text-12 color-[#000]">{{ userInfo && userInfo.levelName ? userInfo.levelName : '--' }}</div>
        </div>
      </div>
      <div class="flex icon-box gap-[8px]" @click="handleClickGrid(2)">
        <div class="relative">
          <div
            class="dot absolute top-[4px] right-[1px] py-4 rounded-full bg-[#FF4E4E] color-[#fff] text-[8px] min-w-[18px] text-center"
            v-if="userInfo.productCount">
            {{ userInfo.productCount || 0 }}
          </div>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="20" fill="#F6F6F6" />
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M13.3305 13.3306H26.6694C27.1298 13.3306 27.5031 13.7038 27.5031 14.1642V25.8358C27.5031 26.7566 26.7566 27.5031 25.8357 27.5031H14.1642C13.2433 27.5031 12.4968 26.7566 12.4968 25.8358V14.1642C12.4968 13.7038 12.8701 13.3306 13.3305 13.3306Z"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.4968 16.2484H27.5031" stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path
              d="M23.3347 19.1663C23.3347 21.008 21.8417 22.501 20 22.501C18.1583 22.501 16.6653 21.008 16.6653 19.1663"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>


      </div>
    </header>
    <div class="detail-image w-full px-[24px]" v-if="indexInfoData.banners.length > 0">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="item in indexInfoData.banners" :key="index" @click="handleClickBanner(item)">
          <div class="image bg-[#f5f5f5] rounded-[16px] w-full">
            <img :src="item.url" alt="" class="w-full h-full object-cover rounded-[16px]">
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- notice -->
    <div class="w-full px-[24px] my-16">
      <div
        class="notice text-[12px]  w-full border-[1px] px-12 h-42 border-solid border-[#B1DDC6] bg-[#F7FDFB] rounded-[8px] px-4 py-2 overflow-hidden flex items-center">

        <div class="content text-no-wrap w-full">
          <van-notice-bar scrollable :text="indexInfoData.noticeContent" background="#F7FDFB" color="#888888"
            class="notice flex-1">
            <template #left-icon> <svg width="16" height="16" class="w-16 h-16 flex-shrink-0 mr-12" viewBox="0 0 16 16"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.06668 13.3333H6.93335" stroke="#369A66" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M11.3333 6.68799V6.66666V6.66666C11.3333 4.82599 9.84065 3.33333 7.99998 3.33333V3.33333C6.15931 3.33333 4.66665 4.82599 4.66665 6.66666V6.66666V6.68799V8.33599C4.66665 8.55199 4.54465 8.74866 4.35198 8.84533L4.01665 9.01266C3.59798 9.22266 3.33331 9.65066 3.33331 10.1187V10.1187C3.33331 10.8013 3.88665 11.3547 4.56931 11.3547H11.4306C12.1133 11.3547 12.6666 10.8013 12.6666 10.1187V10.1187C12.6666 9.65066 12.402 9.22266 11.9833 9.01333L11.648 8.84599C11.4553 8.74866 11.3333 8.55199 11.3333 8.33599V6.68799Z"
                  stroke="#369A66" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12.634 4.03267C12.1593 3.19934 11.4673 2.50734 10.634 2.03267" stroke="#369A66"
                  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.36603 4.03267C3.84069 3.19934 4.53269 2.50734 5.36603 2.03267" stroke="#369A66"
                  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg> </template>
          </van-notice-bar>
        </div>
      </div>

    </div>
    <div class="detail-image w-full px-[24px]"
      v-if="indexInfoData.discountBanners && indexInfoData.discountBanners.length > 0">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="item in indexInfoData.discountBanners" :key="index" @click="handleClickBanner(item)">
          <div class="image bg-[#f5f5f5] rounded-[16px] w-full">
            <img :src="item.url" alt="" class="w-full h-full object-cover rounded-[16px]">
          </div>
        </van-swipe-item>

      </van-swipe>
    </div>
    <Grid @handleClickGrid="handleClickGrid" />
    <div class="indicator-title px-24 font-bold text-[16px] mt-12">
      {{ t("Activity Center") }}
    </div>
    <ActivityCenter :arr="activityList" />
    <div class="indicator-title px-24 font-bold text-[16px] mt-12 flex items-center justify-between">
      {{ t("News Center") }}
      <!-- <div class="see-all text-[14px] color-[#9CA3AF]">{{ t("See all") }}</div> -->
    </div>
    <div class="news-list px-24 py-12">
      <div
        class="news-item w-full rounded-[16px]  min-h-[120px] flex gap-[12px]   p-12 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
        v-for="(item, index) in newsList" :key="index" @click="handleClickItem(item)">
        <div class="img w-96 h-96 flex-shrink-0 bg-[#F5F5F5] overflow-hidden rounded-[16px]">
          <img :src="item.article_image" alt="" v-if="item && item.article_image"
            class="w-full h-full object-cover rounded-[16px]">
        </div>
        <div class="info color-[#111827] font-bold">{{ item.title }}</div>
      </div>
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

<route lang="json5">
{
  name: 'home',
  meta: {
    title: 'quotes',
    i18n: 'home'
  },
}
</route>

<style lang="less" scoped>
.quotes {
  // padding-bottom: calc(var(--van-tabbar-height) + 2px);
}

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

    // 文字倾斜
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

:deep(.van-tabs__line) {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADxSURBVHgBnVHLDYJAEJ1ZjJ+LoQTsQDtA48GjJXj1YNQKKIGDIR4pQY8eTLQD7EBKIIZIBGEEiQSR5eNLNrs7efP27RsEDiZbR3J9OEXnrtce7Ndo5fEYT8D1cRluUrTslqPweFjw+jVdawrQO8w7ZiUHbkBqtub5oOdxfwRGmjMDwmm2TgDyeOPIpQIhk/vfAEGfqiRyBUbaI2qWgA/p1riv0oUkxHdwTzIAUYRCoNUUaPAJNHHgBaH10uYIJHoBql8OZM3uMxIMqAFGMDwuOmcWX4Qd1ARhHDbGY8ufcQWZNSsaWzmYwsIQTPgTCHR5AaMKT03qmstiAAAAAElFTkSuQmCC) no-repeat center;
  width: 9px;
  height: 8px;
  background-size: 100% 100%;
}
</style>

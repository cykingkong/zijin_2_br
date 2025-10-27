<script setup lang="ts">
import router from "@/router";
import { useStore } from "@/stores/modules/index";

import Indicator from "@/pages/deal/components/indicator.vue";

import Grid from "@/components/grid.vue";
import axios from "axios";

import { useUserStore } from "@/stores";
import { navTitleStore } from "@/stores/index";
import { isLogin } from "@/utils/auth";
import CryptoJS from "crypto-js";
import { useI18n } from "vue-i18n";
import { appCharts, indexInfo, market } from "@/api/market";
import { getKfUrl } from "@/api/user";
import local from "@/utils/local";
import { closeToast, showLoadingToast } from "vant";
import { addCommasToNumber } from "@/utils/tool";

const { t } = useI18n();
const activeName = ref("");
const navStore = navTitleStore();

const store = useStore();
const requestCount = ref(0);
const getStockData = async () => {
  try {
    const response = await axios.get(
      "https://stockanalysis.com/api/charts/a/bvmf-vale3/stream/c?chartiq=true&start=2025-08-13&end=2025-08-14&interval=1min"
    );

    console.log("股票数据:", response.data);
    return response.data;
  } catch (error) {
    console.error("请求失败:", error);
  }
};
// getStockData();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const marketData = ref<any>([]);
const indexInfoData = ref<any>({
  banners: [],
});

function handleClickGrid(val: any) {
  if (val === 0) {
    // local.setlocal('rankInfo', marketData.value.list[0])
    // router.push('/quotes/openTrade?id=' + marketData.value.list[0].tradingPairsId + '&categoryId=' + categoryId.value)
    router.push({
      path: "/market",
      // query: {
      //   id: marketData.value.list[0].tradingPairsId,
      //   categoryId: categoryId.value
      // }
    });
  }
  if (val === 1) {
    router.push(`/discount`);
  }
  if (val === 2) {
    router.push({
      path: "/fund",
      // query: {
      //   categoryId: activeName.value == '200' ? "202" : "198",
      // },
    });
  }
  if (val === 3) {
    // router.push('/quotes/accountChange?type=3' + '&categoryId=' + categoryId.value)
    router.push({
      path: "/IPO",
      query: {
        type: 3,
        categoryId: categoryId.value,
      },
    });
  }
}

function getContent(html: string) {
  if (!html) return "";
  const reg: RegExp = /<[^>]+>/g;
  return html.replace(reg, "");
}
const indexData = ref({});
const chartsDesc = ref([]);

const kfUrl = ref("");
function jumptoSearchUrl(data, url) {
  for (var key in data) {
    if (data[key]) {
      url += '&' + key + '=' + data[key];
    }
  }
  // window.location.href=encodeURI(url);
  window.open(encodeURI(url), "_blank");
}
async function initKfUrl() {
  await userStore.info()
  if (!userInfo.value.kf_url) return;
  router.push({
    path: '/webview',
    query: {
      islogin: 'true',
    }
  })
  return
  // setTimeout(() => {
  //   // 使用MD5加密生成wttUUid
  //   let wttUUid = CryptoJS.MD5(
  //     `${userInfo.value.user_id}+WTTexcellent`
  //   ).toString();
  //   const selData = {
  //     uuid: wttUUid,
  //     nickname: userInfo.value.user_id || userInfo.value.account || userInfo.value.email || userInfo.value.phone || 'User',
  //   }
  //   jumptoSearchUrl(selData, userInfo.value.kf_url)

  //   console.log(wttUUid, userInfo.value);
  //   // window.location.href =
  //   //   userInfo.value.kf_url +
  //   //   "&nickname=" +
  //   //   userInfo.value.user_id +
  //   //   `&uuid=${wttUUid}`;
  // }, 40);
  // }
}
function toUrl(path) {
  router.push({
    path,
  });
}
async function getChartsDesc(type) {
  const { data, code } = await appCharts({ type });
  if (code == 200) {
    chartsDesc.value = data.rows || [];
  }
}
function init() {
  // 只有在用户已登录的情况下才调用 info
  if (isLogin()) {
    userStore.info();
  } else {
    router.push({
      path: "/login",
    });
  }
  // indexInfo().then((res) => {
  //   indexInfoData.value = res.data
  //   if (res.data.notice) {
  //     indexInfoData.value.noticeContent = getContent(indexInfoData.value.notice)
  //     const readedNotice = local.getlocal('readedNotice')
  //     if (!readedNotice) {
  //       local.setlocal('readedNotice', '0')
  //       showDatePicker.value = true
  //     }
  //     else {
  //       if (readedNotice === '0') {
  //         showDatePicker.value = true
  //       }
  //     }
  //   }
  // })
  // getMarketInfo({})
  // getChartsDesc(1)
  // getMarketIndex({
  //   categoryId: 500,
  // })
  // initKfUrl();
}
const page = reactive({
  pageIndex: 1,
  pageSize: 20,
});
const rankListStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const proName = ref("");
function getMarketIndex(params) {
  market({ pageIndex: 1, pageSize: 20, ...params }).then(({ data, code }) => {
    if (code == 200) {
      indexData.value = data.list;
    }
  });
}
function getMarketInfo(params) {
  let p = {
    ...page,
  };
  p.pageIndex = params.pageIndex || 1;
  rankListStatus.value = 1;
  requestCount.value++;
  market({ ...p, ...params }).then((res) => {
    const { data, code } = res;
    if (code == 200) {
      if (!data.list) {
        rankListStatus.value = 3;
        return;
      }
      rankListStatus.value = 2;
      let result = [];
      if (p.pageIndex == 1) {
        result = data.list || [];
      } else {
        result = marketData.value.list.concat(data.list || []);
      }
      if (requestCount.value == 1) {
        activeName.value = data.category[0].category_id;
        categoryId.value = data.category[0].category_id;
      }

      marketData.value = {
        ...res.data,
        list: result,
      };
      store.setMarketList(result || []);
      if (data.total <= marketData.value.list.length) {
        rankListStatus.value = 3;
      }
    } else {
      rankListStatus.value = 4;
    }
  });
}
const categoryId = ref();
function handleClickTabs(val: any) {
  rankListStatus.value = 1;
  categoryId.value = val;
  marketData.value.list = [];
  getMarketInfo({
    categoryId: val,
  });
  if (val == 200) {
    getMarketIndex({
      categoryId: 500,
    });
    getChartsDesc(1);
  } else if (val == 201) {
    getMarketIndex({
      categoryId: 501,
    });
    getChartsDesc(2);
  } else if (val == 202) {
    getMarketIndex({
      categoryId: 502,
    });
  }

  activeName.value = val;
}
const showDatePicker = ref<boolean>(false);
function handleClickIndicator(val) {
  local.setlocal("rankInfo", val);
  // router.push('/quotes/detail?id=' + val.tradingPairsId + '&categoryId=' + categoryId.value)
  router.push({
    path: "/quotes/detail",
    query: {
      id: val.tradingPairsId,
      categoryId: categoryId.value,
    },
  });
}
function clickNotice() {
  showDatePicker.value = true;
}
function cancelNotice() {
  showDatePicker.value = false;
  local.setlocal("readedNotice", "1");
}
function confirmNotice() {
  try {
    local.setlocal("readedNotice", "1");
    if (indexInfoData.value.openUrl) {
      const urlEnum = {
        1: "/fund",
        2: "/discount",
        3: "/IPO",
        4: "/dividend",
      };
      const url = urlEnum[indexInfoData.value.openUrl];
      router.push(url);
    }
    showDatePicker.value = false;
  } catch (e) {
    console.error(e);
  }
}

function toDetail() {
  const id = marketData.value.list[0].tradingPairsId || 1;
  const categoryId = marketData.value.category[0].category_id || 200;
  // router.push(`/quotes/detail?id=${id}&categoryId=${categoryId}`)
  router.push({
    path: "/quotes/detail",
    query: {
      id,
      categoryId,
    },
  });
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
onMounted(() => {
  init();
  // closeToast();
  navStore.setShowNavLeft(true);
});
</script>

<template>
  <div class="quotes">
    <header class="header flex items-center justify-between" v-if="false">
      <div class="left flex items-center gap-16px">
        <!-- <div class="icon w-24 h-24">
          <img src="../assets/logo.svg" alt="">
        </div> -->
        <!-- WTTexcellent -->
      </div>
      <!-- <div class="icon w-24 h-24 relative" @click="toUrl('/notify')">
        <div class="dot w-4 h-4 rounded-full bg-#F14437 absolute top-0 right-0" v-if="userInfo.notify_start"></div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.02 2.91003C8.71 2.91003 6.02 5.60003 6.02 8.91003V11.8C6.02 12.41 5.76 13.34 5.45 13.86L4.3 15.77C3.59 16.95 4.08 18.26 5.38 18.7C9.69 20.14 14.34 20.14 18.65 18.7C19.86 18.3 20.39 16.87 19.73 15.77L18.58 13.86C18.28 13.34 18.02 12.41 18.02 11.8V8.91003C18.02 5.61003 15.32 2.91003 12.02 2.91003Z"
            stroke="#94A3B8" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
          <path
            d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z"
            stroke="#94A3B8" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.89999 21.1801C9.35999 20.6401 9.01999 19.8801 9.01999 19.0601"
            stroke="#94A3B8" stroke-width="1.5" stroke-miterlimit="10" />
        </svg>
      </div> -->
    </header>
    <div class="w-full px-24px">

      <div class="w-full px-24px mt-24 min-h-177px relative bg-#154183 rounded-12px overflow-hidden p-20px card-box">
        <div class="round w-300 h-300 rounded-full absolute top-[-45px] left-[-99px] bg-#0b2956 z-1"></div>
        <!-- <img :src="boxBg" alt="" class="w-486 h-468px absolute top-[-167px] left-[-55px]" /> -->
        <div class="info z-80 relative">
          <div class="title text-14px color-#94A3B8">
            {{ t("Total assets") }}
          </div>
          <div class="price text-32px color-#fff font-bold mt-8px text-nowrap overflow-y-auto">
            MX$ {{ addCommasToNumber(userInfo.user_balance) }}
          </div>
          <div class="bottom-li mt-24px flex items-center justify-between">
            <div class="left">
              <div class="title text-10px color-#94A3B8 line-height-170%">
                {{ t("Profit") }}
              </div>
              <div class="title text-14px color-#fff line-height-140%">
                MX$ {{ addCommasToNumber(userInfo.total_profit) }}
              </div>
            </div>
            <div
              class="right p4 h-24px rounded-24px color-#fff flex text-12px items-center justify-center gap-8px min-w-80px"
              :class="userInfo.total_profit_rate > 0 ? 'bg-#1DCE5C' : 'bg-#F14437'
                ">
              <svg class="w-17 h-16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                :class="userInfo.total_profit_rate > 0 ? 'rotate-0' : 'rotate-180'">
                <path
                  d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
                  stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.00001 5.33337L5.33334 8.00004M8.00001 5.33337V10.6667M10.6667 8.00004L8.00001 5.33337"
                  stroke="white" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ addCommasToNumber(userInfo.total_profit_rate) || 0 }} %
            </div>
          </div>
        </div>
      </div>
    </div>

    <Grid @handleClickGrid="handleClickGrid" />
    <div class="indicator-title px-24 font-bold text-16px mt-12">
      {{ t("Holding assets") }}
    </div>
    <Indicator :activeName="activeName" />

    <div class="kf-fixed fixed bottom-120px right-0 h-auto w-40 overflow-hidden rounded-12px" @click="initKfUrl">
      <img src="@/assets/kf.png" class="block h-full w-full scale-[1.1] bg-white" alt="" />
    </div>
    <van-popup v-model:show="showDatePicker" position="center" round="true">
      <div class="h-auto max-h-500 overflow-y-auto p-12">
        <div class="div" v-html="indexInfoData.notice" />
      </div>
      <div class="w-full flex gap-12 px-12 pb-12">
        <div class="btn-box flex-1">
          <van-button type="default" class="h-40!" plain block @click="cancelNotice">
            {{ t("Cancel") }}
          </van-button>
        </div>
        <div class="btn-box flex-1">
          <van-button type="primary" class="h-40!" block @click="confirmNotice">
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
    i18n: 'menus.home'
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
    font-weight: 600;
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

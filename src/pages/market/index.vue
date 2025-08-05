<script setup lang="ts">
import router from '@/router';
import { useStore } from '@/stores/modules/index'
import Grid from '@/components/grid.vue'
import CardList from './component/card-list.vue';
import stockItem from './component/stock-item.vue';
import { useUserStore } from '@/stores'
import { navTitleStore } from '@/stores/index'

import { useI18n } from 'vue-i18n'
import { appCharts, indexInfo, market } from '@/api/market'
import { getKfUrl } from '@/api/user'
import local from '@/utils/local'
import { closeToast, showLoadingToast } from 'vant'

const { t } = useI18n()
const activeName = ref(0)
const navStore = navTitleStore();
const requestCount = ref(0);
const indexData = ref({});
const page = reactive({
    pageIndex: 1,
    pageSize: 20,
});
const rankListStatus = ref(1); // 1-加载中 2-成功 3-已无更多

const marketData = ref<any>([]);
const indexInfoData = ref<any>();
const tabList = ref([
    {
        name: '美股',
        id: '200'
    }, {
        name: '墨西哥',
        id: '201'
    }
])
const categoryId = ref();
const store = useStore();
function isString(value) {
    return typeof value === "string" && value.constructor === String;
}
const getMarketInfo = (params, isSearch = false) => {
    let p = {
        ...page,
    };

    p.pageIndex = params.pageIndex || 1;
    if (params.categoryId && isString(params.categoryId)) {
        params.categoryId = params.categoryId.split(",");
    }

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

            marketData.value = {
                ...res.data,
                list: result,
            };
            console.log(requestCount.value);
            // let allCategoryArr = {
            //   name: "All Stocks",
            //   exchangeName: "",
            //   category_id: data.category
            //     .map((e) => {
            //       return e.category_id;
            //     })
            //     .join(","),
            // };
            // marketData.value.category.push(allCategoryArr);
            if (requestCount.value == 1) {
                activeName.value = data.category[0].category_id;
                categoryId.value = data.category[0].category_id;
                console.log(activeName.value, requestCount.value);
            }
            if (isSearch) {
                if (data.list && data.list.length) {
                    const { tradingInfo } = data.list[0];
                    activeName.value = tradingInfo.categoryId;
                }
            }
            store.setMarketList(result || []);
            if (data.total <= marketData.value.list.length) {
                rankListStatus.value = 3;
            }
        } else {
            rankListStatus.value = 4;
        }
    });
};



function handleClickGrid(val: any) {

    if (val === 0) {

    }
    if (val === 1) {
        router.push(`/discount`)
    }
    if (val === 2) {
        router.push({
            path: '/fund',
            // query: {
            //   categoryId: activeName.value == '200' ? "202" : "198",
            // },
        })
    }
    if (val === 3) {
        // router.push('/quotes/accountChange?type=3' + '&categoryId=' + categoryId.value)
        router.push({
            path: '/IPO',
            // query: {
            //     type: 3,
            //     categoryId: categoryId.value,
            // },
        })
    }
}
watch(
    () => store.getklineList,
    (newV) => {
        if (
            newV &&
            marketData.value &&
            marketData.value.list &&
            marketData.value.list.length
        ) {
            marketData.value.list.forEach((el) => {
                let listItem = newV.find((item: any) => {
                    return item.tradingId == el.tradingPairsId;
                });
                if (listItem) {
                    if (listItem.tradingId == el.tradingPairsId) {
                        el.lastPrice = listItem.tick.close;
                        el.dayIncrease = listItem.tick.dayIncrease;
                        el.increase = listItem.tick.increase;
                    }
                }
            });
        }
    }
);
onMounted(() => {
    getMarketInfo({});

    // closeToast();
})
</script>

<template>
    <div class="market">
        <Grid @handleClickGrid="handleClickGrid" class="mt-32px" />
        <div class="px-24px">
            <div class="tab-list flex items-center mt-32px gap-7px mb-31px">
                <div class="tab-item flex-1 items-center justify-center flex text-14px text-#94A3B8 bg-#F8F9FD py-4px"
                    v-for="(item, index) in tabList" :key="index" @click="activeName = index"
                    :class="{ 'bg-#F8F5FF color-#6B39F4 font-700': activeName == index }">{{ item.name }}</div>
            </div>
            <div class="search w-full rounded-12px bg-#F8F9FD flex py-9 px-16 flex items-center gap-12px">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9.80549" cy="9.80541" r="7.49047" stroke="#94A3B8" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M15.0153 15.4043L17.9519 18.3334" stroke="#94A3B8" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="p text-16px text-#94A3B8">Search...</div>
            </div>
            <CardList class="mb-23px"></CardList>
            <div class="list ">
                <div class="label text-16px text-#0F172A font-700 mb-16px">
                    All Stocks
                </div>
                <div class="flex flex-col gap-16px">
                    <stockItem v-for="(item, index) in marketData.list" :key="index" :item="item"></stockItem>
                </div>
            </div>
        </div>

    </div>
</template>

<route lang="json5">
{
  name: 'Market',
  meta: {
    title: 'Market',
    i18n: 'menus.Market'
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

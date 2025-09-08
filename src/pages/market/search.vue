<script setup lang="ts">
import router from "@/router";
import { useStore } from "@/stores/modules/index";

import { assetsSearch, depth, market } from "@/api/market";
import local from "@/utils/local";
import singleTicker from "@/components/singleTicker.vue";
const { t } = useI18n();
const activeName = ref<any>("");
const store = useStore();
const requestCount = ref(0);
const marketData = ref<any>([]);
const indexInfoData = ref<any>();
const search = ref("");
const searchLoading = ref(false);
const handleClickGrid = (val: any) => {
    if (val == 0) {
        local.setlocal("rankInfo", marketData.value.list[0]);
        router.push(
            "/quotes/openTrade?id=" +
            marketData.value.list[0].tradingPairsId +
            "&categoryId=" +
            categoryId.value
        );
    }
    if (val == 1) {
        router.push("/discount?categoryId=" + categoryId.value);
    }
    if (val == 2) {
        router.push("/fund");
    }
    if (val == 3) {
        router.push(
            "/quotes/accountChange?type=3" + "&categoryId=" + categoryId.value
        );
    }
};

const getContent = (html: string) => {
    let reg = /<[^>]+>/g;
    return html.replace(reg, "");
};
const indexData = ref({});

const onSearch = () => {
    // 将搜索关键词转换为大写
    const upperCaseKeyword = search.value.toUpperCase();

    // 开始loading
    searchLoading.value = true;

    assetsSearch(
        {
            keyword: upperCaseKeyword,
        }
    ).then((res) => {
        // 如果res.data为空对象，不为数组的情况下 marketData.value = [];
        if (Array.isArray(res.data)) {
            marketData.value = res.data;
        } else {
            marketData.value = [];
        }

        // marketData.value = res.data;
        // console.log(indexInfoData.value);
    }).catch((error) => {
        console.error('搜索失败:', error);
        marketData.value = [];
    }).finally(() => {
        // 结束loading
        searchLoading.value = false;
    });


};
const init = () => {
    // assetsSearch({
    //     keyword: search.value || '',
    // }).then((res) => {
    //     indexInfoData.value = res.data;
    //     console.log(indexInfoData.value);
    // });
    // getMarketInfo({});
};
const page = reactive({
    pageIndex: 1,
    pageSize: 20,
});
const rankListStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const getMarketIndex = (params) => {
    market({ pageIndex: 1, pageSize: 3, ...params }).then(({ data, code }) => {
        if (code == 200) {
            indexData.value = data.list;
        }
    });
};
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
    // 将搜索关键词转换为大写
    const upperCaseSymbol = search.value ? search.value.toUpperCase() : '';
    market({ ...p, ...params, symbol: upperCaseSymbol }).then((res) => {
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
const categoryId = ref();
const handleClickTabs = (val: any) => {
    rankListStatus.value = 1;
    categoryId.value = val;
    marketData.value.list = [];
    getMarketInfo(
        {
            categoryId: val,
        },
        true
    );
    // if (val == 200) {
    //   getMarketIndex({
    //     categoryId: 500
    //   })
    // } else if (val == 201) {
    //   getMarketIndex({
    //     categoryId: 501
    //   })
    // } else if (val == 202) {
    //   getMarketIndex({
    //     categoryId: 502
    //   })
    // }

    activeName.value = val;
};
const showDatePicker = ref(false);
const handleClickIndicator = (val) => {
    local.setlocal("rankInfo", val);
    router.push(
        "/quotes/detail?symbol=" +
        val.symbol
    );
};
const clickNotice = () => {
    showDatePicker.value = true;
};
const loadMore = () => {
    if (rankListStatus.value == 4) {
        return;
    }
    let index = (page.pageIndex += 1);
    getMarketInfo({
        pageIndex: index,
        categoryId: categoryId.value,
    });
};
const toDetail = () => {
    let id = marketData.value.list[0].tradingPairsId || 1;
    let categoryId = marketData.value.category[0].category_id || 200;
    router.push(`/quotes/detail?id=${id}&categoryId=${categoryId}`);
};
onMounted(() => {
    init();
});
</script>

<template>
    <div class="quotes">
        <van-search v-model="search" show-action :placeholder="t('input.PleaseEnter')" @search="onSearch">
            <template #action>
                <div @click="onSearch" :class="{ 'opacity-50': searchLoading }">
                    <van-loading v-if="searchLoading" size="16px" color="#1989fa" />
                    <span v-else>{{ t("input.Search") }}</span>
                </div>
            </template>
        </van-search>
        <van-tabs v-model:active="activeName" shrink @change="handleClickTabs">

            <div class="list-content flex flex-col gap-16px px-12">
                <!-- 搜索loading状态 -->
                <div v-if="searchLoading" class="flex flex-col justify-center items-center py-20">
                    <van-loading size="24px" color="#1989fa" />
                    <!-- <span class="ml-8 text-gray-500">{{ t('common.Loading') || '搜索中...' }}</span> -->
                </div>

                <!-- 搜索结果列表 -->
                <div v-else-if="!searchLoading && marketData.length > 0" class="list-items relative"
                    v-for="(item, index) in marketData" :key="index">
                    <div class="mark absolute left-0 top-0 w-full h-full" @click="handleClickIndicator(item)"></div>
                    <singleTicker :symbol="item.tradingview_name" :chartId="index + ''"></singleTicker>
                </div>

                <!-- 无搜索结果 -->
                <div v-else-if="!searchLoading && marketData.length === 0 && search"
                    class="flex flex-col items-center justify-center py-20">
                    <div class="text-gray-400 text-14">{{ t('common.NoData') || '暂无搜索结果' }}</div>
                </div>
            </div>

        </van-tabs>
    </div>
</template>
<route lang="json5">
{
  meta: {
    i18n: 'Stock List',
  },
}
</route>


<style lang="less" scoped>
.quotes {
    padding-bottom: calc(var(--van-tabbar-height) + 2px);
}

.iconTop3 {
    width: 9px;
    height: 8px;
}

.header {
    display: flex;
    height: var(--van-nav-bar-height);
    padding: 0 12px;
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

:deep(.van-tabs__line) {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADxSURBVHgBnVHLDYJAEJ1ZjJ+LoQTsQDtA48GjJXj1YNQKKIGDIR4pQY8eTLQD7EBKIIZIBGEEiQSR5eNLNrs7efP27RsEDiZbR3J9OEXnrtce7Ndo5fEYT8D1cRluUrTslqPweFjw+jVdawrQO8w7ZiUHbkBqtub5oOdxfwRGmjMDwmm2TgDyeOPIpQIhk/vfAEGfqiRyBUbaI2qWgA/p1riv0oUkxHdwTzIAUYRCoNUUaPAJNHHgBaH10uYIJHoBql8OZM3uMxIMqAFGMDwuOmcWX4Qd1ARhHDbGY8ufcQWZNSsaWzmYwsIQTPgTCHR5AaMKT03qmstiAAAAAElFTkSuQmCC) no-repeat center;
    width: 9px;
    height: 8px;
    background-size: 100% 100%;
}
</style>
mm
<template>
    <!-- 根容器：保持浅灰色背景，Flex布局 -->
    <div class="sign-in-page min-h-[100vh] bg-[#F7F7F7] flex flex-col ">
        <div class="title mx-a text-center text-[18px] font-bold w-full h-44 flex justify-center items-center ">
            {{ t('Task Bonus') }}
        </div>
        <!-- 顶部收益区域 -->
        <div class="earnings-section flex justify-between items-center px-[24px] py-[10px] h-[134px]">
            <div class="flex flex-col ">
                <span class="text-[#666] text-[14px] mb-[4px] t1">{{t("My Earnings")}}</span>
                <span class="text-[#333] text-[36px] font-bold ">{{ addCommasToNumber(userInfo.teamBalance || 0)
                    }}</span>
            </div>
            <!-- 金币大图 -->
            <div class="coin-img">
                <img src="@/assets/coin.png" alt="Coin" class="w-[100px] h-[94px] object-contain drop-shadow-lg" />
            </div>
        </div>

        <!-- 签到卡片区域 -->
        <div class="sign-card bg-white  py-[16px] shadow-sm pb-[122px] min-h-[calc(100vh-178px)]">
            <div class="title text-16 color-[#161616] font-bold mx-16 mb-16">{{ t('Task Bonus') }}</div>
            <div class="li-list w-full px-16 flex-col flex gap-16">
                <div class="li-item h-40 flex w-full gap-9" v-for="(item, i) in newsList" :key="i"
                    @click="handleClickDetail(item)">
                    <div class="left w-full flex items-start gap-8">
                        <div class="img-box w-[40px] h-[40px] rounded-[8px] bg-[] flex-shrink-0">
                            <img :src="item.article_image" alt="Icon" class="w-[40px] h-[40px] block object-contain"
                                v-if="item.article_image" />
                        </div>
                        <div class="text-[12px] font-bold">{{ item.title }} </div>
                    </div>
                    <div
                        class="right text-11 font-bold flex-shrink-0 px-4 h-[28px] rounded-[8px] border-solid border-[1px] border-[#0000002a] flex items-center justify-center">
                        <img src="@/assets/coin.png" alt="Arrow Right" class="w-[20px] h-[20px] block object-contain" />
                        + R$ {{ addCommasToNumber(item.amount) }}
                    </div>
                </div>
            </div>
            <!-- 底部留白，防止被手机Home条遮挡 -->
        </div>


    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 假设使用了 vue-router
import { indexInfo, articleList } from "@/api/market";
import { addCommasToNumber } from "@/utils/tool";
import { useUserStore } from '@/stores';
import lv1 from '@/assets/lv/lv1.png';
import lv2 from '@/assets/lv/lv2.png';
import lv3 from '@/assets/lv/lv3.png'; // 修正了原本代码中指向 lv1 的路径
import lv4 from '@/assets/lv/lv4.png'; // 修正路径
import lv5 from '@/assets/lv/lv5.png'; // 修正路径
import lv6 from '@/assets/lv/lv6.png'; // 修正路径
import lv7 from '@/assets/lv/lv7.png'; // 修正路径
import lv8 from '@/assets/lv/lv8.png'; // 修正路径
const router = useRouter();
const newsList = ref([])
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo)
// 模拟签到天数数据
// status: 'missed' | 'checked' | 'today' | 'future'
const checkInDays = ref([
    { label: 'Day1', amount: 20, status: 'missed' },
    { label: 'Day2', amount: 20, status: 'checked' },
    { label: 'Today', amount: 20, status: 'today' },
    { label: 'Day4', amount: 20, status: 'future' },
    { label: 'Day5', amount: 20, status: 'future' },
    { label: 'Day6', amount: 20, status: 'future' },
    { label: 'Day7', amount: 20, status: 'future' },
]);

// 模拟等级奖励数据
const rewardList = ref([
    { lv: 'LV1', reward: '0.01', img: lv1 },
    { lv: 'LV2', reward: '0.70', img: lv2 },
    { lv: 'LV3', reward: '3.50', img: lv3 },
    { lv: 'LV4', reward: '6.00', img: lv4 },
    { lv: 'LV5', reward: '10.00', img: lv5 },
    { lv: 'LV6', reward: '25.00', img: lv6 },
    { lv: 'LV7', reward: '70.00', img: lv7 },
    { lv: 'LV8', reward: '150.00', img: lv8 },
]);
const { t } = useI18n()
// 根据状态返回对应的 UnoCSS 类名
function getDayClass(day) {
    switch (day.status) {
        case 'today':
            // 黑色背景，白色文字，金色边框感
            return 'bg-[#1A1A1A] text-white shadow-lg';
        case 'checked':
            // 浅黄色背景，深色文字
            return 'bg-[#FFF6D6] text-[#DFA948]';
        case 'missed':
            // 灰色背景，淡化文字
            return 'bg-[#F2F2F2] text-[#999] opacity-80';
        case 'future':
        default:
            // 默认浅灰色背景
            return 'bg-[#F9F9F9] text-[#666]';
    }
}

// 辅助函数：生成不同的颜色占位符
function getColor(idx) {
    const colors = ['grey', 'purple', 'green', 'red', 'orange', 'gold', 'brown', 'black'];
    return colors[idx % colors.length];
}

function handleSignIn() {
    console.log('Signing in...');
    // TODO: 调用签到 API
}
function handleClickDetail(item) {
    localStorage.setItem('activityDetail', JSON.stringify(item))
    router.push({
        path: '/activityDetail',
    })
}
function goBack() {
    if (router) router.back();
}
function getArticleList(params) {
    // 1 关于我们 常见问题 2 新闻中心 3 新闻活动
    articleList({ pageIndex: 1, pageSize: 20, ...params }).then(({ data, code }) => {
        if (code == 200) {

            newsList.value = data.rows || []

        }
    });
}
onMounted(() => {
    getArticleList({ article_type: 4 })
})
</script>

<!-- 
   是假设你项目中可能有数字专用字体，如果没有会自动回退
  i-carbon-chevron-left 是 unocss iconify 的写法，如果没有配置 presetIcons，可以直接换成 < 符号
-->

<route lang="json5">
{
  name: 'taskBonus',
  meta: {
    title: 'TaskBonus',
    i18n: 'TaskBonus'
  },
}
</route>

<style scoped>
/* 如果 UnoCSS 没覆盖到的细节，可以在这里补充 */
.sign-card {
    border-radius: 16px 16px 0 0;
}

.level {}
</style>

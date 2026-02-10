<template>
    <!-- 根容器：保持浅灰色背景，Flex布局 -->
    <div class="sign-in-page min-h-[100vh] bg-[#F7F7F7] flex flex-col font-sans">
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
        <div class="sign-card bg-white rounded-[16px] mx-[16px] p-[16px] shadow-sm mb-[24px]">
            <!-- 等级显示 -->
            <div class="level-info flex items-center mb-[16px]">
                <img src="@/assets/sign-level.png" class="w-[16px] h-[16px] mr-[6px] rounded-full" />
                <span class="font-bold text-[16px] text-[#333] level">LV{{ userInfo.level || '' }}</span>
            </div>

            <!-- 7天签到 Grid -->
            <div class="days-grid grid grid-cols-7 gap-[4.5px] mb-[20px]">
                <div v-for="(day, index) in checkInDays" :key="index"
                    class="day-item flex flex-col items-center justify-center py-[8px] rounded-[8px] text-[12px]"
                    :class="getDayClass(day)">
                    <!-- 顶部文字 (Day1 / Today) -->
                    <span class="mb-[4px] scale-90 block" :class="day.status === 'today' ? 'font-bold' : ''">
                        {{ day.label }}
                    </span>

                    <!-- 图标或状态 -->
                    <div class="icon-area mb-[2px]">
                        <span v-if="day.status === 'checked'" class="text-[14px]"><svg class="w-16 h-16"
                                viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.99996 12.8333C10.2083 12.8333 12.8333 10.2083 12.8333 6.99996C12.8333 3.79163 10.2083 1.16663 6.99996 1.16663C3.79163 1.16663 1.16663 3.79163 1.16663 6.99996C1.16663 10.2083 3.79163 12.8333 6.99996 12.8333Z"
                                    fill="#F9D54A" />
                                <path d="M4.52087 6.99995L6.17171 8.65079L9.47921 5.34912" stroke="white"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                        <img v-else-if="day.status == 'future' || day.status == 'today'" src="@/assets/signin.png"
                            class="w-[16px] h-[16px] rounded-full" />
                        <img v-else src="@/assets/unsignin.png" class="w-[16px] h-[16px] rounded-full" />
                    </div>

                    <!-- 金额 -->
                    <span class=" scale-90 block">{{ day.amount }}</span>
                </div>
            </div>

            <!-- 签到按钮 -->
            <button
                class="w-full bg-[#1A1A1A] text-white h-[48px] rounded-[12px] font-bold text-[16px] active:opacity-90 transition-opacity"
                @click="handleSignIn">
                {{t("Sign In")}}
            </button>
        </div>

        <!-- 奖励规则列表 -->
        <div class="criteria-section px-[16px] flex-1">
            <h3 class="text-[18px] font-bold text-[#333] mb-[12px]">{{t("Reward Criteria")}}</h3>

            <div class="reward-table bg-white rounded-[16px] p-[16px] pb-[8px]">
                <!-- 表头 -->
                <div
                    class="flex justify-between text-[#333] font-bold text-[14px] mb-[12px] pb-[12px] border-b-solid border-b-[1px] border-b-[#0000000D] border ">
                    <span>{{t("Level")}}</span>
                    <span>{{t("Reward")}}</span>
                </div>

                <!-- 列表内容 -->
                <div class="rows flex flex-col gap-[16px]">
                    <div v-for="(level, idx) in rewardList" :key="idx"
                        class="flex justify-between items-center text-[14px]">
                        <div class="flex items-center">
                            <!-- 不同等级不同颜色的图标占位 -->
                            <img :src="level.img" class="w-[20px] h-[20px] mr-[8px] rounded-full" />
                            <span class="text-[#00000080]">LV{{ level.level }}</span>
                        </div>
                        <span class="text-[#333] font-medium ">{{ level.dayAmount }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部留白，防止被手机Home条遮挡 -->
        <div class="h-[30px]"></div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 假设使用了 vue-router
import { useUserStore } from "@/stores";
import { day, receiveDay } from '@/api/salary';
import { addCommasToNumber } from '@/utils/tool';
import lv1 from '@/assets/lv/lv1.png';
import lv2 from '@/assets/lv/lv2.png';
import lv3 from '@/assets/lv/lv3.png'; // 修正了原本代码中指向 lv1 的路径
import lv4 from '@/assets/lv/lv4.png'; // 修正路径
import lv5 from '@/assets/lv/lv5.png'; // 修正路径
import lv6 from '@/assets/lv/lv6.png'; // 修正路径
import lv7 from '@/assets/lv/lv7.png'; // 修正路径
import lv8 from '@/assets/lv/lv8.png'; // 修正路径
const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n()
const userInfo = computed(() => userStore.userInfo);
// 模拟签到天数数据
// status: 'missed' | 'checked' | 'today' | 'future'
//  tatus: 1-已领取 2-可领取 3-不可领取
const checkInDays = ref([]);

// 模拟等级奖励数据
const rewardList = ref([

]);
const imgEnum =
{
    lv1: lv1,
    lv2: lv2,
    lv3: lv3,
    lv4: lv4,
    lv5: lv5,
    lv6: lv6,
    lv7: lv7,
    lv8: lv8,
}

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

async function handleSignIn() {
    console.log('Signing in...');
    // TODO: 调用签到 API
    const { data, code } = await receiveDay()
    if (code == 200) {
        console.log(data)
        return
        checkInDays.value = data.dayList || [];
    }
}

function goBack() {
    if (router) router.back();
}


async function getDayConfig() {
    const { data, code } = await day()
    if (code == 200) {
        checkInDays.value = data.days.map((item) => {
            return {
                ...item,
                label: `Day${item.day}`,
                status: item.status == 1 ? 'checked' : item.status == 2 ? 'today' : 'future',

            }
        }) || [];
        rewardList.value = data.configs.map((el) => {
            el.img = imgEnum[`lv${el.level}`]
            return {
                ...el
            }
        })
        console.log(rewardList.value)
    }
}
onMounted(async () => {
    getDayConfig()
    // await userStore.info()
})

</script>

<!-- 
   是假设你项目中可能有数字专用字体，如果没有会自动回退
  i-carbon-chevron-left 是 unocss iconify 的写法，如果没有配置 presetIcons，可以直接换成 < 符号
-->

<route lang="json5">
{
  name: 'signIn',
  meta: {
    title: 'SignIn',
    i18n: 'SignIn'
  },
}
</route>

<style scoped>
/* 如果 UnoCSS 没覆盖到的细节，可以在这里补充 */


.level {}
</style>

<template>
    <div class="team-page min-h-[100vh] pt-[40px] bg-[#F7F7F7] flex flex-col">



        <!-- 内容区域 -->
        <div class="content flex-1 px-[16px] pb-[30px]">

            <!-- 1. 顶部总览卡片 (Total Recharge) -->
            <div class="overview-card bg-white rounded-[16px] p-[20px] shadow-sm mb-[16px] flex flex-col items-center">
                <!-- Icon -->
                <div class="w-[48px] h-[48px] rounded-full bg-orange-100 flex items-center justify-center mb-[8px]">
                    <!-- 占位金币图标，实际请替换为图片 -->
                    <img src="@/assets/coin.png" alt="" class="w-44 h-44">
                </div>

                <!-- Total Amount -->
                <div class="text-[28px] font-bold text-[#1A1A1A]  mb-[4px]">R$ {{ '0' }}</div>
                <div class="text-[12px] text-[#666] mb-[24px]">{{t("Total Team Top-up")}}</div>

                <!-- 4-Grid Stats -->
                <div class="w-full grid grid-cols-2 gap-y-[20px]">
                    <div class="flex flex-col items-start pl-[20px] border-r border-[#f5f5f5]">
                        <span class="text-[#999] text-[12px] mb-[4px]">{{t("Today's Top-up")}}</span>
                        <span class="text-[#333] text-[16px] font-bold ">{{
                            addCommasToNumber(userInfo.rechargeData.todayRecharge)
                        }}</span>
                    </div>
                    <div class="flex flex-col items-end pr-[20px]">
                        <span class="text-[#999] text-[12px] mb-[4px]">{{t("Yesterday's Top-up")}}</span>
                        <span class="text-[#333] text-[16px] font-bold ">{{
                            addCommasToNumber(userInfo.rechargeData.yesterdayRecharge)
                        }}</span>
                    </div>
                    <div class="flex flex-col items-start pl-[20px] border-r border-[#f5f5f5]">
                        <span class="text-[#999] text-[12px] mb-[4px]">{{t("This Month's Top-up")}}</span>
                        <span class="text-[#333] text-[16px] font-bold ">{{
                            addCommasToNumber(userInfo.rechargeData.thisMonthRecharge)
                        }}</span>
                    </div>
                    <div class="flex flex-col items-end pr-[20px]">
                        <span class="text-[#999] text-[12px] mb-[4px]">{{t("Last Month's Top-up")}}</span>
                        <span class="text-[#333] text-[16px] font-bold ">{{
                            addCommasToNumber(userInfo.rechargeData.lastMonthRecharge)
                        }}</span>
                    </div>
                </div>
            </div>

            <!-- 2. 等级概览 (Level Cards) -->
            <div class="level-overview bg-white rounded-[16px] p-[16px] shadow-sm mb-[16px]">
                <div class="flex justify-between gap-[10px] mb-[16px]">
                    <div v-for="(lv, index) in levelStats" :key="index"
                        class="flex-1 border border-[#F2F2F2] border-solid rounded-[12px] py-[12px] flex flex-col items-center">
                        <div class="flex items-center mb-[4px]">
                            <!-- 小图标占位 -->

                            <img :src="lv.img" alt="" class="w-14 h-14 object-cover mr-4">

                            <span class="text-[#999] text-[12px]">{{ lv.name }}</span>
                        </div>
                        <span class="text-[#333] text-[16px] font-bold ">{{ lv.count }}</span>
                    </div>
                </div>
                <!-- <p class="text-[#999] text-[11px] leading-[1.4]">
                  Regras: Membros Nível 1 - comissão de {{ teamsData?.rates[tab.key] }}%; Membros Nível 2 - comissão de 5%; Membros Nível 3 - comissão de 2%.
                </p> -->
            </div>

            <!-- 3. 我的团队 (My Team) -->
            <div class="team-stats bg-white rounded-[16px] p-[16px] shadow-sm mb-[16px]">
                <div class="text-[15px] font-bold text-[#1A1A1A] mb-[16px]">{{t("My Team")}}</div>
                <div class="grid grid-cols-2 gap-y-[20px]">
                    <div class="flex flex-col items-center">
                        <span class="text-[#333] text-[18px] font-bold  mb-[2px]">{{
                            userInfo.teamData.todayNewMembers }}</span>
                        <span class="text-[#999] text-[12px]">{{t("Total Team Members")}}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-[#333] text-[18px] font-bold  mb-[2px]">{{
                            userInfo.teamData.vaildTeamCount }}</span>
                        <span class="text-[#999] text-[12px]">{{t("Valid Team Members")}}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-[#333] text-[18px] font-bold  mb-[2px]">{{
                            userInfo.teamData.todayNewMembers }}</span>
                        <span class="text-[#999] text-[12px]">{{t("Today's New Members")}}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-[#333] text-[18px] font-bold  mb-[2px]">{{
                            userInfo.teamData.yesterdayNewMembers }}</span>
                        <span class="text-[#999] text-[12px]">{{t("Yesterday's New Members")}}</span>
                    </div>
                </div>
            </div>

            <!-- 4. 筛选操作区 -->
            <!-- 顶部 Toggle Buttons -->
            <div class="flex bg-[#0000000D] rounded-[8px] p-[4px] mb-[16px] flex h-38">
                <div class="btn-1 flex-1 flex justify-center items-center text-[13px] font-bold"
                    v-for="(item, index) in typeList" @click="activeIndex = index; fetchTeamData()"
                    :class="activeIndex == index ? 'bg-[#161616] text-white rounded-[8px]' : ''" :key="index"> {{ item
                    }}
                </div>
            </div>

            <!-- 等级 Tab 切换 -->
            <div class="flex gap-[12px] mb-[16px]">
                <div v-for="tab in levelTabs" :key="tab.id" @click="currentLevel = tab.key; fetchTeamData()"
                    class="flex-1 py-[8px] text-[12px] font-medium rounded-[8px] border transition-all text-center"
                    :class="currentLevel === tab.key
                        ? 'bg-white border-[#8B5E3C] border border-solid text-[#8B5E3C]'
                        : 'bg-[#F2F2F2] border-transparent text-[#999]'">
                    {{ tab.label }}{{ teamsData?.rates[tab.key]||'0' }}% ({{ activeIndex ? tab.unNum : tab.num }})
                </div>
            </div>

            <!-- 5. 数据列表 -->
            <div class="data-table bg-white rounded-[16px] px-[16px] pb-[16px] shadow-sm min-h-[200px]">
                <!-- Header -->
                <div class="flex py-[14px] border-b border-[#F5F5F5]">
                    <div class="w-[30%] text-[12px] text-[#333] font-medium">{{ $t('Account') }}</div>
                    <div class="w-[30%] text-[12px] text-[#333] font-medium text-center">{{ $t('Subordinate Count') }}
                    </div>
                    <div class="w-[40%] text-[12px] text-[#333] font-medium text-right">{{ $t('Total Product Amount') }}
                    </div>
                </div>

                <!-- Rows -->
                <div class="flex flex-col">
                    <div v-for="(row, idx) in teamsData?.userList" :key="idx"
                        class="flex py-[14px] items-center border-b border-[#F9F9F9] last:border-0">
                        <div class="w-[30%] text-[14px] text-wrap text-[#1A1A1A]">{{ row.account }}</div>
                        <div class="w-[30%] text-[14px] text-[#1A1A1A] text-center">{{ row.chilrenCount }}</div>
                        <div class="w-[40%] text-[14px] text-[#1A1A1A] text-right">R$ {{ row.productPrice }}</div>
                    </div>
                </div>
                <!-- Empty State Placeholder -->
                <div v-if="teamsData?.userList?.length === 0" class="py-[40px] text-center text-[#999] text-[12px]">
                    No Data
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import lv1 from '@/assets/lv/lv1.png';
import lv2 from '@/assets/lv/lv2.png';
import lv3 from '@/assets/lv/lv3.png';
import { useUserStore } from '@/stores';
import { getTeamData } from '@/api/user'
import { addCommasToNumber } from '@/utils/tool';
const router = useRouter();
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const {t} = useI18n()
// 筛选状态
const filterType = ref('cancel'); // 
const currentLevel = ref('B');

// 模拟数据
const levelStats = ref([
    { name: 'LV1', count: userInfo.value?.topData?.find((item) => item.generation === 1)?.allUserCount || 0, img: lv1 },
    { name: 'LV2', count: userInfo.value?.topData?.find((item) => item.generation === 2)?.allUserCount || 0, img: lv2 },
    { name: 'LV3', count: userInfo.value?.topData?.find((item) => item.generation === 3)?.allUserCount || 0, img: lv3 },
]);

const levelTabs = ref([
    {
        id: 'L1', label: 'L1-', key: 'B',
        num: userInfo.value?.topData?.find((item) => item.generation === 1)?.vaildUserCount || 0,
        unNum: userInfo.value?.topData?.find((item) => item.generation === 1)?.noVaildUserCount || 0,
    },
    {
        id: 'L2', label: 'L2-', key: 'C',
        num: userInfo.value?.topData?.find((item) => item.generation === 2)?.vaildUserCount || 0,
        unNum: userInfo.value?.topData?.find((item) => item.generation === 2)?.noVaildUserCount || 0,
    },
    {
        id: 'L3', label: 'L3-', key: 'D',
        num: userInfo.value?.topData?.find((item) => item.generation === 3)?.vaildUserCount || 0,
        unNum: userInfo.value?.topData?.find((item) => item.generation === 3)?.noVaildUserCount || 0,
    },

]);

// 模拟列表数据
const tableData = ref([
    { account: '2333665', referrer: 25, maxAmount: '200' },
    { account: '2333665', referrer: 12, maxAmount: '200' },
    { account: '2333665', referrer: 124, maxAmount: '4574' },
    { account: '2333665', referrer: 4533, maxAmount: '4452' },
    { account: '2333665', referrer: 744, maxAmount: '1214' },
]);
const teamsData = ref({
    userList: [
        { account: '2333665', referrer: 25, maxAmount: '200' },
    ],
    rates: {
        B: '0',
        C: '0',
        D: '0',
    }
})
function goBack() {
    if (router) router.back();
}
const fetchTeamData = async () => {
    // level B=1代, C=2代, D=3代
    const res = await getTeamData({
        level: currentLevel.value
        , pageIndex: 1
        , pageSize: 100,
        onlyValid: activeIndex.value == 0 ? 1 : 2 // onlyValid: -1全部 1有效 2无效
    });
    console.log(res, 'asdasd')
    if (res.code == 200) {
        teamsData.value = res.data || {};
        console.log(teamsData.value, 'asdasd')

    }
}

const activeIndex = ref(0);
const typeList = ref([
    'Membros ativos',
    'Membro inativo',
])
onMounted(async () => {
    await fetchTeamData()
    await userStore.fetchTeamInfoData()

})
</script>

<route lang="json5">
{
  name: 'team',
  meta: {
    title: 'Team',
    i18n: 'Team'
  },
}
</route>

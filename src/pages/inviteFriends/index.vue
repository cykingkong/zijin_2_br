<template>
    <div class="team-page min-h-[100vh] pt-[40px] bg-[#F7F7F7] flex flex-col">

        <img src="@/assets/reward.png" alt="" class="w-200 h-170 block m-x-auto mb-30 mt-]">

        <!-- 内容区域 -->
        <div class="content flex-1 px-[16px] pb-[30px]">


            <!-- 2. 等级概览 (Level Cards) -->
            <div class="level-overview bg-white rounded-[16px] p-[16px] shadow-sm mb-[16px]">
                <div class="commission-section">
                    <div class="text-[#666] text-[12px] leading-[1.8] ">
                        <div>B-level commission-{{ teamsData.commission.v1_commission }}% </div>
                        <div>C-level commission-{{ teamsData.commission.v2_commission }}% </div>
                        <div>D=-level commission-{{ teamsData.commission.v3_commission }}% </div>
                    </div>
                </div>
            </div>


            <!-- 等级 Tab 切换 -->
            <div class="flex gap-[12px] mb-[16px]">
                <div v-for="tab in levelTabs" :key="tab.id" @click="currentLevel = tab.key; fetchTeamData()"
                    class="flex-1 py-[8px] text-[12px]  rounded-[8px] border transition-all text-center font-bold"
                    :class="currentLevel === tab.key
                        ? 'bg-white border-[#8B5E3C] border border-solid text-[#1b1b1b]'
                        : 'bg-[#F2F2F2] border-transparent text-[#00000033]'">
                    {{ tab.label }}{{ teamsData?.commission[tab.key] || '0' }}% ({{ teamsData?.userNum[tab.numKey] ||
                        0
                    }})
                </div>
            </div>

            <!-- 5. 数据列表 -->
            <div class="data-table bg-white rounded-[16px] px-[16px] pb-[16px] shadow-sm min-h-[200px]">
                <!-- Header -->
                <div class="flex py-[14px] border-b border-[#F5F5F5]">
                    <div class="w-[30%] text-[12px] text-[#333] font-medium">{{ $t('Account') }}</div>
                    <div class="w-[30%] text-[12px] text-[#333] font-medium text-center">{{ $t('Today Upload') }}
                    </div>
                    <div class="w-[40%] text-[12px] text-[#333] font-medium text-right">{{ $t('Upload Success') }}
                    </div>
                </div>

                <!-- Rows -->
                <div class="flex flex-col">
                    <div v-for="(row, idx) in teamsData?.userList" :key="idx"
                        class="flex py-[14px] items-center border-b border-[#F9F9F9] last:border-0">
                        <div class="w-[30%] text-[14px] text-wrap text-[#1A1A1A]">{{ row.uuid }}</div>
                        <div class="w-[30%] text-[14px] text-[#1A1A1A] text-center">{{ row.todayImgNum }}</div>
                        <div class="w-[40%] text-[14px] text-[#1A1A1A] text-right">{{ row.totalImgNum }}</div>
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
const { t } = useI18n()
// 筛选状态
const filterType = ref('cancel'); // 
const currentLevel = ref('v1_commission');

// 模拟数据
const levelStats = ref([
    { name: 'LV1', count: userInfo.value?.topData?.find((item) => item.generation === 1)?.allUserCount || 0, img: lv1 },
    { name: 'LV2', count: userInfo.value?.topData?.find((item) => item.generation === 2)?.allUserCount || 0, img: lv2 },
    { name: 'LV3', count: userInfo.value?.topData?.find((item) => item.generation === 3)?.allUserCount || 0, img: lv3 },
]);

const levelTabs = ref([
    {
        id: 'L1', label: 'L1-', key: 'v1_commission', numKey: "v1_num",

    },
    {
        id: 'L2', label: 'L2-', key: 'v2_commission', numKey: "v2_num",

    },
    {
        id: 'L3', label: 'L3-', key: 'v3_commission', numKey: "v3_num",


    },

]);
let levelEnum = {
    v1_commission: '1',
    v2_commission: '2',
    v3_commission: '3',
}

// 模拟列表数据
const tableData = ref([
    { account: '2333665', referrer: 25, maxAmount: '200' },
    { account: '2333665', referrer: 12, maxAmount: '200' },
    { account: '2333665', referrer: 124, maxAmount: '4574' },
    { account: '2333665', referrer: 4533, maxAmount: '4452' },
    { account: '2333665', referrer: 744, maxAmount: '1214' },
]);
const teamsData = ref({
    "commission": {
        "v1_commission": "0",
        "v2_commission": "0",
        "v3_commission": "0"
    },
    "userNum": {
        "v1_num": 0,
        "v2_num": 0,
        "v3_num": 0
    },
    "userList": [

    ]
})
function goBack() {
    if (router) router.back();
}
const fetchTeamData = async () => {
    // level B=1代, C=2代, D=3代
    const res = await getTeamData({
        level: levelEnum[currentLevel.value]
        , page: 1
        , size: 100,
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
    // await userStore.fetchTeamInfoData()

})
</script>

<route lang="json5">
{
  name: 'inviteFriends',
  meta: {
    title: 'Invite Friends',
    i18n: 'Invite Friends'
  },
}
</route>

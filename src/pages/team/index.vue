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
                <div class="text-[28px] font-bold text-[#1A1A1A]  mb-[4px]">$266556.233</div>
                <div class="text-[12px] text-[#666] mb-[24px]">团队累计总充值</div>

                <!-- 4-Grid Stats -->
                <div class="w-full grid grid-cols-2 gap-y-[20px]">
                    <div class="flex flex-col items-start pl-[20px] border-r border-[#f5f5f5]">
                        <span class="text-[#999] text-[12px] mb-[4px]">今日充值</span>
                        <span class="text-[#333] text-[16px] font-bold ">528,701</span>
                    </div>
                    <div class="flex flex-col items-end pr-[20px]">
                        <span class="text-[#999] text-[12px] mb-[4px]">昨日充值</span>
                        <span class="text-[#333] text-[16px] font-bold ">573,615</span>
                    </div>
                    <div class="flex flex-col items-start pl-[20px] border-r border-[#f5f5f5]">
                        <span class="text-[#999] text-[12px] mb-[4px]">本月充值</span>
                        <span class="text-[#333] text-[16px] font-bold ">16,261</span>
                    </div>
                    <div class="flex flex-col items-end pr-[20px]">
                        <span class="text-[#999] text-[12px] mb-[4px]">上月充值</span>
                        <span class="text-[#333] text-[16px] font-bold ">19,356</span>
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
                <p class="text-[#999] text-[11px] leading-[1.4]">
                    Rules: B-level commission -10%; C-level -5% commission; D-level -2% commission
                </p>
            </div>

            <!-- 3. 我的团队 (My Team) -->
            <div class="team-stats bg-white rounded-[16px] p-[16px] shadow-sm mb-[16px]">
                <div class="text-[15px] font-bold text-[#1A1A1A] mb-[16px]">My Team</div>
                <div class="grid grid-cols-2 gap-y-[20px]">
                    <div class="flex flex-col items-center">
                        <span class="text-[#333] text-[18px] font-bold  mb-[2px]">88</span>
                        <span class="text-[#999] text-[12px]">团队总人数</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-[#333] text-[18px] font-bold  mb-[2px]">568</span>
                        <span class="text-[#999] text-[12px]">有效团队规模</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-[#333] text-[18px] font-bold  mb-[2px]">57.8</span>
                        <span class="text-[#999] text-[12px]">今日新成员</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-[#333] text-[18px] font-bold  mb-[2px]">5622.8</span>
                        <span class="text-[#999] text-[12px]">昨日新成员</span>
                    </div>
                </div>
            </div>

            <!-- 4. 筛选操作区 -->
            <!-- 顶部 Toggle Buttons -->
            <div class="flex bg-[#0000000D] rounded-[8px] p-[4px] mb-[16px] flex h-38">
                <div class="btn-1 flex-1 flex justify-center items-center text-[13px] font-bold"
                    v-for="(item, index) in typeList" @click="activeIndex = index"
                    :class="activeIndex == index ? 'bg-[#161616] text-white rounded-[8px]' : ''" :key="index"> {{ item
                    }}
                </div>
            </div>

            <!-- 等级 Tab 切换 -->
            <div class="flex gap-[12px] mb-[16px]">
                <button v-for="tab in levelTabs" :key="tab.id" @click="currentLevel = tab.id"
                    class="flex-1 py-[8px] text-[12px] font-medium rounded-[8px] border transition-all text-center"
                    :class="currentLevel === tab.id
                        ? 'bg-white border-[#8B5E3C] border border-solid text-[#8B5E3C]'
                        : 'bg-[#F2F2F2] border-transparent text-[#999]'">
                    {{ tab.label }}
                </button>
            </div>

            <!-- 5. 数据列表 -->
            <div class="data-table bg-white rounded-[16px] px-[16px] pb-[16px] shadow-sm min-h-[200px]">
                <!-- Header -->
                <div class="flex py-[14px] border-b border-[#F5F5F5]">
                    <span class="w-[30%] text-[13px] font-bold text-[#333]">账户</span>
                    <span class="w-[30%] text-[13px] font-bold text-[#333] text-center">推荐人</span>
                    <span class="w-[40%] text-[13px] font-bold text-[#333] text-right">最大乘积</span>
                </div>

                <!-- Rows -->
                <div class="flex flex-col">
                    <div v-for="(row, idx) in tableData" :key="idx"
                        class="flex py-[14px] items-center border-b border-[#F9F9F9] last:border-0">
                        <span class="w-[30%] text-[14px] text-[#333] ">{{ row.account }}</span>
                        <span class="w-[30%] text-[14px] text-[#333] text-center">{{ row.referrer }}人</span>
                        <span class="w-[40%] text-[14px] text-[#333] text-right ">${{ row.maxAmount }}</span>
                    </div>
                </div>
                <!-- Empty State Placeholder -->
                <div v-if="tableData.length === 0" class="py-[40px] text-center text-[#999] text-[12px]">
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

const router = useRouter();

// 筛选状态
const filterType = ref('cancel'); // 'active' | 'cancel' (截图选中右侧黑色)
const currentLevel = ref('L1');

// 模拟数据
const levelStats = ref([
    { name: 'LV1', count: 30, img: lv1 },
    { name: 'LV2', count: 30, img: lv2 },
    { name: 'LV3', count: 30, img: lv3 },
]);

const levelTabs = ref([
    { id: 'L1', label: 'L1-10% (12)' },
    { id: 'L2', label: 'L2-10% (12)' },
    { id: 'L3', label: 'L3-10% (0)' },
]);

// 模拟列表数据
const tableData = ref([
    { account: '2333665', referrer: 25, maxAmount: '200' },
    { account: '2333665', referrer: 12, maxAmount: '200' },
    { account: '2333665', referrer: 124, maxAmount: '4574' },
    { account: '2333665', referrer: 4533, maxAmount: '4452' },
    { account: '2333665', referrer: 744, maxAmount: '1214' },
]);

function goBack() {
    if (router) router.back();
}
const activeIndex = ref(0);
const typeList = ref([
    '活跃会员',
    '所有会员',
])
</script>

<route lang="json5">
{
  name: 'team',
  meta: {
    title: 'Team',
    i18n: 'team'
  },
}
</route>

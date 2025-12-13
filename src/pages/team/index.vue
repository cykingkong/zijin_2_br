<template>
    <div class="team-page min-h-screen bg-white pb-[30px] px-[16px]">
        <!-- Top Title -->
        <div class="text-center pt-[30px] pb-[20px]">
            <h1 class="text-[18px] font-bold text-[#1A1A1A]">Invite Friends With Link Shared</h1>
        </div>

        <!-- Invite Link Box -->
        <div
            class="invite-box flex items-center justify-between bg-[#F7F8FA] rounded-[12px] h-[50px] px-[16px] mb-[24px]">
            <div class="link text-[14px] text-[#333] truncate flex-1 mr-2">
                {{ inviteLink }}
            </div>
            <div class="copy-btn flex items-center gap-1 cursor-pointer" @click="copyLink">
                <van-icon name="description" color="#00B86B" size="16" />
                <span class="text-[14px] font-medium text-[#00B86B]">Copy</span>
            </div>
        </div>

        <!-- Overall Stats Card -->
        <div
            class="stats-card bg-white rounded-[16px] border border-[#eee] border-solid p-[20px] mb-[24px] flex justify-between items-center shadow-sm">
            <div class="stat-item flex flex-col items-center">
                <div class="num text-[20px] font-bold text-[#1A1A1A] mb-[4px]">150</div>
                <div class="label text-[12px] text-[#999]">有效</div>
            </div>
            <div class="stat-item flex flex-col items-center">
                <div class="num text-[20px] font-bold text-[#1A1A1A] mb-[4px]">50</div>
                <div class="label text-[12px] text-[#999]">无效</div>
            </div>
            <div class="stat-item flex flex-col items-center">
                <div class="num text-[20px] font-bold text-[#1A1A1A] mb-[4px]">₹25,000,000</div>
                <div class="label text-[12px] text-[#999]">团队总充值</div>
            </div>
        </div>

        <!-- Level Tabs -->
        <div class="level-tabs mb-[20px]">
            <van-tabs v-model:active="activeTab" shrink line-width="40px" color="#333" title-active-color="#333"
                title-inactive-color="#999" :border="false">
                <van-tab title="Level B (10%)" name="b"></van-tab>
                <van-tab title="Level C (5%)" name="c"></van-tab>
                <van-tab title="Level D (3%)" name="d"></van-tab>
            </van-tabs>
        </div>

        <!-- Level Stats Card -->
        <div
            class="stats-card bg-white rounded-[16px] border border-[#eee] border-solid p-[20px] mb-[24px] flex justify-between items-center shadow-sm">
            <div class="stat-item flex flex-col items-center">
                <div class="num text-[20px] font-bold text-[#1A1A1A] mb-[4px]">150</div>
                <div class="label text-[12px] text-[#999]">有效</div>
            </div>
            <div class="stat-item flex flex-col items-center">
                <div class="num text-[20px] font-bold text-[#1A1A1A] mb-[4px]">50</div>
                <div class="label text-[12px] text-[#999]">无效</div>
            </div>
            <div class="stat-item flex flex-col items-center">
                <div class="num text-[20px] font-bold text-[#1A1A1A] mb-[4px]">₹25,000,000</div>
                <div class="label text-[12px] text-[#999]">佣金收入</div>
            </div>
        </div>

        <!-- Team Member List -->
        <div class="member-list bg-[#F9FAFB] rounded-[16px] overflow-hidden">
            <!-- Table Header -->
            <div class="flex items-center h-[44px] px-[16px] border-b border-[#eee]">
                <div class="w-[30%] text-[12px] text-[#333] font-medium">账号</div>
                <div class="w-[30%] text-[12px] text-[#333] font-medium text-center">下级人数</div>
                <div class="w-[40%] text-[12px] text-[#333] font-medium text-right">产品总金额</div>
            </div>

            <!-- Table Body -->
            <div class="list-body">
                <div v-for="(item, index) in memberList" :key="index"
                    class="flex items-center h-[48px] px-[16px] bg-white">
                    <div class="w-[30%] text-[14px] text-[#1A1A1A]">{{ item.account }}</div>
                    <div class="w-[30%] text-[14px] text-[#1A1A1A] text-center">{{ item.count }}</div>
                    <div class="w-[40%] text-[14px] text-[#1A1A1A] text-right">{{ item.amount }}</div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';

const inviteLink = ref('https://drops.com/adidasindonesia...');
const activeTab = ref('d');

const memberList = ref([
    { account: '123****666', count: 8, amount: '₹100,000' },
    { account: '123****666', count: 8, amount: '₹100,000' },
    { account: '123****666', count: 8, amount: '₹100,000' },
    { account: '123****666', count: 8, amount: '₹100,000' },
    { account: '123****666', count: 8, amount: '₹100,000' },
    { account: '123****666', count: 8, amount: '₹100,000' },
]);

const copyLink = () => {
    // navigator.clipboard.writeText(inviteLink.value);
    showToast('Copied successfully');
};
</script>

<style lang="less" scoped>
:deep(.van-tabs__wrap) {
    height: 40px;
}

:deep(.van-tab) {
    font-size: 14px;
    color: #999;
}

:deep(.van-tab--active) {
    font-weight: 500;
    color: #333;
}

:deep(.van-tabs__line) {
    background-color: #333;
    bottom: 0;
}
</style>
<route lang="json5">
{
  name: 'Team',
  meta: {
    title: 'Team',
    i18n: 'Team'
  },
}
</route>

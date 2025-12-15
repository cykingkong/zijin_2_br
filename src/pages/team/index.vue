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
                <div class="num text-[20px] font-bold text-[#1A1A1A] mb-[4px]">{{ teamsData?.topData?.vaildUserCount ||
                    0
                    }}</div>
                <div class="label text-[12px] text-[#999]">{{ $t('Valid') }}</div>
            </div>
            <div class="stat-item flex flex-col items-center">
                <div class="num text-[20px] font-bold text-[#1A1A1A] mb-[4px]">{{ teamsData?.topData?.noVaildUserCount
                    ||
                    0 }}</div>
                <div class="label text-[12px] text-[#999]">{{ $t('Invalid') }}</div>
            </div>
            <div class="stat-item flex flex-col items-center">
                <div class="num text-[20px] font-bold text-[#1A1A1A] mb-[4px]">₹ {{
                    teamsData?.topData?.itemRecharge || 0 }}</div>
                <div class="label text-[12px] text-[#999]">{{ $t('Team Recharge') }}</div>
            </div>
        </div>

        <!-- Level Tabs -->
        <div class="level-tabs mb-[20px]">
            <van-tabs v-model:active="activeTab" line-width="140px" color="#333" title-active-color="#333"
                :ellipsis="false" title-inactive-color="#999" :border="true">
                <van-tab :title="`Level B (${teamsData?.rates?.B || 0}%)`" name="B"></van-tab>
                <van-tab :title="`Level C (${teamsData?.rates?.C || 0}%)`" name="C"></van-tab>
                <van-tab :title="`Level D (${teamsData?.rates?.D || 0}%)`" name="D"></van-tab>
            </van-tabs>
        </div>

        <!-- Level Stats Card -->
        <div
            class="stats-card bg-white rounded-[16px] border border-[#eee] border-solid p-[20px] mb-[24px] flex justify-between items-center shadow-sm">
            <div class="stat-item flex flex-col items-center">
                <div class="num text-[20px] font-bold text-[#1A1A1A] mb-[4px]">{{ teamsData?.levelData?.vaildUserCount
                    ||
                    0 }}</div>
                <div class="label text-[12px] text-[#999]">{{ $t('Valid') }}</div>
            </div>
            <div class="stat-item flex flex-col items-center">
                <div class="num text-[20px] font-bold text-[#1A1A1A] mb-[4px]">{{ teamsData?.levelData?.noVaildUserCount
                    ||
                    0 }}</div>
                <div class="label text-[12px] text-[#999]">{{ $t('Invalid') }}</div>
            </div>
            <div class="stat-item flex flex-col items-center">
                <div class="num text-[20px] font-bold text-[#1A1A1A] mb-[4px]">₹ {{
                    teamsData?.levelData?.commisonPrice || 0 }}</div>
                <div class="label text-[12px] text-[#999]">{{ $t('Commission Income') }}</div>
            </div>
        </div>

        <!-- Team Member List -->
        <div class="member-list bg-[#F9FAFB] rounded-[16px] overflow-hidden">
            <!-- Table Header -->
            <div class="flex items-center h-[44px] px-[16px] border-b border-[#eee]">
                <div class="w-[30%] text-[12px] text-[#333] font-medium">{{ $t('Account') }}</div>
                <div class="w-[30%] text-[12px] text-[#333] font-medium text-center">{{ $t('Subordinate Count') }}</div>
                <div class="w-[40%] text-[12px] text-[#333] font-medium text-right">{{ $t('Total Product Amount') }}
                </div>
            </div>
            <!-- Table Body -->
            <div class="list-body">
                <div v-for="(item, index) in teamsData?.userList" :key="index"
                    class="flex items-center h-[48px] px-[16px] bg-white">
                    <div class="w-[30%] text-[14px] text-[#1A1A1A]">{{ item.account }}</div>
                    <div class="w-[30%] text-[14px] text-[#1A1A1A] text-center">{{ item.chilrenCount }}</div>
                    <div class="w-[40%] text-[14px] text-[#1A1A1A] text-right">{{ item.productPrice }}</div>
                </div>
                <empty v-if="teamsData?.userList?.length == 0" :no-tips="true"></empty>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';
import { getTeamData } from '@/api/user'
const inviteLink = ref(location.origin + '/#/login?loginType=1&inviteCode=...');
const activeTab = ref('B');


const teamsData = ref<any>({});
const fetchTeamData = async () => {
    // level B=1代, C=2代, D=3代
    const res = await getTeamData({
        level: activeTab.value
        , pageIndex: 1
        , pageSize: 50,
    });
    if (res.code == 200) {
        teamsData.value = res.data || {};
    }
}
const copyLink = () => {
    let url = location.href;
    console.log(location);
    navigator.clipboard.writeText(origin + '/#/login?loginType=1&inviteCode=' + teamsData.value?.inviteCode);
    showToast('Copied successfully');
};
onMounted(() => {
    fetchTeamData()
})
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
    // bottom: 0;
    width: 100%;
    height: 1px;
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

<template>
    <div class="weekly-salary-page min-h-[100vh] bg-[#F7F7F7] flex flex-col font-sans">


        <!-- 内容区域 -->
        <div class="content flex-1 px-[16px] pt-[10px] pb-[30px]">

            <!-- 1. 顶部薪资卡片 -->
            <div class="salary-card bg-white rounded-[16px] p-[20px] shadow-sm mb-[24px]">
                <!-- Weekly Salary Row -->
                <div class="flex justify-between items-center mb-[12px]">
                    <span class="text-[#8E9FAE] text-[15px]">Weekly salary</span>
                    <span class="text-[#333] text-[18px] font-bold ">R$ {{
                        addCommasToNumber(config.weekly.pending_income) }}</span>
                </div>

                <!-- Total Weekly Salary Row -->
                <div class="flex justify-between items-center mb-[24px]">
                    <span class="text-[#8E9FAE] text-[15px]">Total weekly salary</span>
                    <span class="text-[#333] text-[18px] font-bold ">R$ {{
                        addCommasToNumber(config.weekly.received_income) }}</span>
                </div>

                <!-- Claim 按钮 -->
                <button
                    class="w-full bg-[#1A1A1A] text-white h-[48px] rounded-[12px] font-bold text-[16px] active:opacity-90 transition-opacity"
                    @click="handleClaim">
                    Claim
                </button>
            </div>

            <!-- 2. 薪资标准标题 -->
            <div class="text-[16px] font-bold text-[#333] mb-[12px]">Salary Standards</div>

            <!-- 薪资标准列表 -->
            <div class="standards-table bg-white rounded-[16px] p-[16px]  mb-[24px]">
                <div class="html" v-html="config.salaryTextMonth"></div>


            </div>

            <!-- 3. 规则说明 -->
            <h3 class="text-[16px] font-bold text-[#333] mb-[12px]">Rule</h3>
            <div class="rules-text text-[#666] text-[13px] leading-[1.8]">
                <p class="mb-[8px]">1. Salary is collected every Sunday from 10am to 10pm.</p>
                <p class="mb-[8px]">2. After the upgrade, the salary will automatically increase.</p>
                <p class="mb-[8px]">3. If you forget to receive your weekly salary, the company is not responsible.</p>
                <p class="mb-[8px]">4. If you violate the company's rules and regulations, our company has the right to
                    dismiss you.</p>
                <p>5. Limited quota, first come, first served.</p>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { week, weekRecord, receiveWeek } from '@/api/salary'
// 复用之前的图片资源引入逻辑
import lv2 from '@/assets/lv/lv2.png';
import lv3 from '@/assets/lv/lv3.png';
import lv4 from '@/assets/lv/lv4.png';
import lv5 from '@/assets/lv/lv5.png';
import lv6 from '@/assets/lv/lv6.png';
import lv7 from '@/assets/lv/lv7.png';
import lv8 from '@/assets/lv/lv8.png';
import { addCommasToNumber } from '@/utils/tool';

const router = useRouter();
const config = ref({
    salaryTextWeek: "",
    weekly: {
        pending_income: 0,
        received_income: 0,
    }
})
// 模拟列表数据 (根据截图构建)
// 注意：截图是从 LV2 开始的
const salaryList = ref([
    { lv: 'LV2', amount: '$7.00', img: lv2 },
    { lv: 'LV3', amount: '$20.00', img: lv3 },
    { lv: 'LV4', amount: '$45.00', img: lv4 },
    { lv: 'LV5', amount: '$120.00', img: lv5 },
    { lv: 'LV6', amount: '$300.00', img: lv6 },
    { lv: 'LV7', amount: '$1,000.00', img: lv7 },
    { lv: 'LV8', amount: '$3,000.00', img: lv8 },
]);

async function handleClaim() {
    console.log('Claim button clicked');
    // TODO: 调用领取薪资 API
    await receiveWeek()
    await getWeekConfig()
}

function goBack() {
    if (router) router.back();
}
async function getWeekConfig() {
    const { data, code } = await week()
    if (code == 200) {
        config.value = data || {};
        config.value.salaryTextWeek = optimizeRichText(data.salary_text_week || '');
    }
}
onMounted(async () => {
    await getWeekConfig()

})
</script>

<route lang="json5">
{
  name: 'weeklySalary',
  meta: {
    title: 'Weekly Salary',
    i18n: 'weeklySalary'
  },
}
</route>

<style scoped></style>

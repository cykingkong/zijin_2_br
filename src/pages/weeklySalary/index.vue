<template>
    <div class="weekly-salary-page min-h-[100vh] bg-[#F7F7F7] flex flex-col font-sans">


        <!-- 内容区域 -->
        <div class="content flex-1 px-[16px] pt-[10px] pb-[30px]">

            <!-- 1. 顶部薪资卡片 -->
            <div class="salary-card bg-white rounded-[16px] p-[20px] shadow-sm mb-[24px]">
                <!-- Weekly Salary Row -->
                <div class="flex justify-between items-center mb-[12px]">
                    <span class="text-[#8E9FAE] text-[15px]">Weekly salary</span>
                    <span class="text-[#333] text-[18px] font-bold font-din">$17.00</span>
                </div>

                <!-- Total Weekly Salary Row -->
                <div class="flex justify-between items-center mb-[24px]">
                    <span class="text-[#8E9FAE] text-[15px]">Total weekly salary</span>
                    <span class="text-[#333] text-[18px] font-bold font-din">$117.00</span>
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
                <!-- 表头 -->
                <div
                    class="flex justify-between text-[#333] font-bold text-[14px] mb-[16px] pb-[12px] border-b-solid border-b-[1px] border-b-[#0000000D] border">
                    <span>Level</span>
                    <span>Weekly pay</span>
                </div>

                <!-- 列表内容 -->
                <div class="flex flex-col gap-[18px]">
                    <div v-for="(item, index) in salaryList" :key="index"
                        class="flex justify-between items-center text-[14px]">
                        <div class="flex items-center">
                            <!-- 图标 -->
                            <img :src="item.img" class="w-[20px] h-[20px] mr-[8px] object-contain" />
                            <!-- 等级文字 -->
                            <span class="text-[#999]">{{ item.lv }}</span>
                        </div>
                        <!-- 金额 -->
                        <span class="text-[#333] font-medium font-din text-[15px]">{{ item.amount }}</span>
                    </div>
                </div>
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

// 复用之前的图片资源引入逻辑
import lv2 from '@/assets/lv/lv2.png';
import lv3 from '@/assets/lv/lv3.png';
import lv4 from '@/assets/lv/lv4.png';
import lv5 from '@/assets/lv/lv5.png';
import lv6 from '@/assets/lv/lv6.png';
import lv7 from '@/assets/lv/lv7.png';
import lv8 from '@/assets/lv/lv8.png';

const router = useRouter();

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

function handleClaim() {
    console.log('Claim button clicked');
    // TODO: 调用领取薪资 API
}

function goBack() {
    if (router) router.back();
}
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

<style scoped>
.font-din {
    font-family: 'DIN Alternate', 'Roboto', sans-serif;
}
</style>

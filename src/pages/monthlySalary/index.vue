<template>
    <div class="monthly-salary-page min-h-[100vh] bg-[#F7F7F7] flex flex-col font-sans">

        <!-- 内容区域 -->
        <div class="content flex-1 px-[16px] pt-[16px] pb-[30px]">
            <button
                class="w-full bg-[#1A1A1A] text-white h-[48px] rounded-[12px] font-bold text-[16px] active:opacity-90 transition-opacity mb-16"
                @click="handleClaim">
                {{ t("Claim") }}
            </button>
            <!-- 薪资标准表格卡片 -->
            <div class="standards-table bg-white rounded-[16px] p-[16px] mb-[24px]">
                <div class="html" v-html="config.salaryTextMonth"></div>

                <!-- 表头：三列布局 -->
                <div v-if="false"
                    class="flex items-center text-[#333] font-bold text-[14px] mb-[16px] pb-[12px] border-b border-[#0000000D]">
                    <!-- 第一列：左对齐 -->
                    <span class="w-[30%] text-left">Level</span>
                    <!-- 第二列：居中 -->
                    <span class="w-[35%] text-center">Weekly pay</span>
                    <!-- 第三列：右对齐 -->
                    <span class="w-[35%] text-right">Team subsidy</span>
                </div>

                <!-- 列表内容 -->
                <div class="flex flex-col gap-[18px]">
                    <div class="flex items-center text-[14px]" v-if="false">
                        <!-- Level 列 -->
                        <div class="w-[30%] flex items-center text-left">
                            <img :src="item.img" class="w-[20px] h-[20px] mr-[8px] object-contain" />
                            <span class="text-[#999]">{{ item.lv }}</span>
                        </div>

                        <!-- Weekly Pay 列 -->
                        <div class="w-[35%] text-center">
                            <span class="text-[#333] font-medium  text-[15px]">{{ item.weekly }}</span>
                        </div>

                        <!-- Team Subsidy 列 -->
                        <div class="w-[35%] text-right">
                            <span class="text-[#333] font-medium  text-[15px]">{{ item.subsidy }}</span>
                        </div>

                    </div>
                </div>
            </div>

            <!-- 规则说明 -->
            <h3 class="text-[16px] font-bold text-[#333] mb-[12px]">
                {{ t("Rules") }}
            </h3>
            <div class="rules-text text-[#666] text-[13px] leading-[1.6]">
                <p class="mb-[16px]">
                    {{ t("The monthly salary is divided into two parts: individual monthly salary and team subsidy.") }}
                </p>
                <p class="mb-[8px]">
                    {{ t("Personal monthly salary is your personal income, and team subsidies are used for your team meetings and meals. The team subsidies will be distributed after you complete the team meetings or meals.") }}
                </p>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { month, receiveMonth } from '@/api/salary'
import { optimizeRichText } from '@/utils/richText';

// 导入图片资源
import lv3 from '@/assets/lv/lv3.png';
import lv4 from '@/assets/lv/lv4.png';
import lv5 from '@/assets/lv/lv5.png';
import lv6 from '@/assets/lv/lv6.png';
import lv7 from '@/assets/lv/lv7.png';
import lv8 from '@/assets/lv/lv8.png';

const router = useRouter();

// 模拟列表数据 (根据截图 LV3 - LV8)
const salaryList = ref([
    { lv: 'LV3', weekly: '$20.00', subsidy: '$200', img: lv3 },
    { lv: 'LV4', weekly: '$45.00', subsidy: '$500', img: lv4 },
    { lv: 'LV5', weekly: '$120.00', subsidy: '$1500', img: lv5 },
    { lv: 'LV6', weekly: '$300.00', subsidy: '$4500', img: lv6 },
    { lv: 'LV7', weekly: '$1,000.0', subsidy: '$115000', img: lv7 },
    { lv: 'LV8', weekly: '$3,000.0', subsidy: '$70000', img: lv8 },
]);
const config = ref({
    salaryTextMonth: ''
})
function goBack() {
    if (router) router.back();
}
async function getMonthConfig() {
    const { data, code } = await month()
    if (code == 200) {
        config.value = data || {};
        config.value.salaryTextMonth = optimizeRichText(data.salary_text_month || '');
    }
}
async function handleClaim() {
    console.log('Claim button clicked');
    // TODO: 调用领取薪资 API
    await receiveMonth()
    await getMonthConfig()
}

onMounted(async () => {
    await getMonthConfig()

})
</script>

<route lang="json5">
{
  name: 'monthlySalary',
  meta: {
    title: 'Monthly Salary',
    i18n: 'Salário mensal'
  },
}
</route>

<style scoped></style>

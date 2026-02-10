<template>
    <div class="annual-salary-page  bg-[#F7F7F7]">

        <div v-html="optimizeRichText(config.salaryTextYear)" v-if="config.salaryTextYear"></div>

        <!-- 内容区域 -->
        <div class="content flex-1 px-[16px] pt-[10px] pb-[30px]" v-if="false">

            <!-- 1. 年薪列表卡片 -->
            <div class="salary-list bg-white rounded-[16px] px-[16px] shadow-sm mb-[24px]">
                <div v-for="(item, index) in salaryList" :key="index"
                    class="flex justify-between items-center py-[16px] border-b border-[#F2F2F2] last:border-b-0">

                    <!-- 左侧信息 -->
                    <div class="flex items-center">
                        <!-- 等级图标 -->
                        <img :src="item.img" class="w-[42px] h-[42px] mr-[12px] object-contain" />

                        <div class="flex flex-col">
                            <!-- 第一行：等级 + 职位勋章 -->
                            <div class="flex items-center mb-[4px]">
                                <span class="font-bold text-[#333] text-[15px] mr-[8px]">{{ item.lv }}</span>
                                <!-- 模拟职位勋章 -->
                                <div
                                    class="flex items-center bg-[] bg-opacity-20 rounded-[4px] px-[6px] py-[2px] tag-bg">
                                    <!-- 勋章图标占位 -->
                                    <div
                                        class="w-[12px] h-[12px] bg-gradient-to-br from-gray-400 to-gray-600 rounded-full mr-[4px]">
                                    </div>
                                    <span class="text-[#666] text-[10px] font-medium">{{ item.title }}</span>
                                </div>
                            </div>
                            <!-- 第二行：年薪金额 -->
                            <span class="text-[#999] text-[12px]">
                                Annual salary: <span class="">{{ item.salary }}</span>
                            </span>
                        </div>
                    </div>

                    <!-- 右侧按钮 -->
                    <button
                        class="bg-[#1A1A1A] text-white text-[13px] font-bold px-[14px] py-[6px] rounded-[8px] active:opacity-80">
                        Receive
                    </button>
                </div>
            </div>

            <!-- 2. 年终奖标题 -->
            <h3 class="text-[16px] font-bold text-[#333] mb-[12px]">End of Year Gifts</h3>

            <!-- 3. 年终奖列表 -->
            <div class="gift-list bg-white rounded-[16px] px-[16px] shadow-sm">
                <div v-for="(gift, index) in giftList" :key="index"
                    class="flex justify-between items-center py-[16px] border-b border-[#F2F2F2] last:border-b-0">

                    <!-- 左侧：等级 -->
                    <span class="font-bold text-[#333] text-[15px] w-[50px]">{{ gift.lv }}</span>

                    <!-- 右侧：商品信息 -->
                    <div class="flex items-center flex-1 justify-end">
                        <!-- 商品图片占位 -->
                        <div class="w-[48px] h-[48px] mr-[10px] bg-gray-100 rounded-[4px] overflow-hidden">
                            <!-- 实际开发中替换为 :src="gift.img" -->
                            <img v-if="gift.img" :src="gift.img" class="w-full h-full object-cover" />
                        </div>

                        <!-- 商品文字 -->
                        <div class="flex flex-col text-right"> <!-- 截图文字似乎是左对齐在图片右侧，还是整体靠右？这里按整体靠右布局 -->
                            <span class="text-[#999] text-[11px] mb-[2px] text-left">{{ gift.name }}</span>
                            <span class="text-[#999] text-[11px] text-left">{{ gift.value }}</span>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { year } from '@/api/salary'
import { optimizeRichText } from '@/utils/richText';

// 导入等级图片
import lv1 from '@/assets/lv/lv1.png';
import lv2 from '@/assets/lv/lv2.png';
import lv3 from '@/assets/lv/lv3.png';
import lv4 from '@/assets/lv/lv4.png';
import lv5 from '@/assets/lv/lv5.png';
import lv6 from '@/assets/lv/lv6.png';
import lv7 from '@/assets/lv/lv7.png';
import lv8 from '@/assets/lv/lv8.png';

const router = useRouter();
const config = ref({
    salaryTextYear: ""
})
// 模拟年薪列表数据
const salaryList = ref([
    { lv: 'LV1', title: 'Junior Assistant', salary: '15000.00', img: lv1 },
    { lv: 'LV2', title: 'Junior Assistant', salary: '15000.00', img: lv2 },
    { lv: 'LV3', title: 'Senior Manager', salary: '15000.00', img: lv3 },
    { lv: 'LV4', title: 'Junior Assistant', salary: '15000.00', img: lv4 },
    { lv: 'LV5', title: 'Junior Assistant', salary: '15000.00', img: lv5 },
    { lv: 'LV6', title: 'Junior Assistant', salary: '15000.00', img: lv6 },
    { lv: 'LV7', title: 'Senior Manager', salary: '15000.00', img: lv7 },
    { lv: 'LV8', title: 'Global Manager', salary: '15000.00', img: lv8 },
]);

// 模拟年终奖数据
// 注意：截图中的文字（iPhone 16 ProMax）似乎是重复的占位符，这里我照搬截图文字
const giftList = ref([
    { lv: 'LV5', name: 'iPhone 16 ProMax', value: '价值RM5666', img: null }, // img 设为 null 显示灰色占位
    { lv: 'LV6', name: 'iPhone 16 ProMax', value: '价值RM5666', img: null },
    { lv: 'LV7', name: 'iPhone 16 ProMax', value: '价值RM5666', img: null },
    { lv: 'LV8', name: 'iPhone 16 ProMax', value: '价值RM5666', img: null },
]);

function goBack() {
    if (router) router.back();
} async function getYearConfig() {
    const { data, code } = await year()
    if (code == 200) {
        config.value = data || {}
    }
}
onMounted(async () => {
    await getYearConfig()

})
</script>

<route lang="json5">
{
  name: 'yearSalary',
  meta: {
    title: 'Year Salary',
    i18n: 'yearSalary'
  },
}
</route>

<style scoped>
.tag-bg {
    background: linear-gradient(0deg, #F0F2F8, #F0F2F8),
        linear-gradient(360deg, #E4E4E4 -30.82%, #B3B3B3 54.43%);

}
</style>

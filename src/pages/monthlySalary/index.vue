<template>
    <div class="monthly-salary-page min-h-[100vh] bg-[#F7F7F7] flex flex-col font-sans">

        <!-- 内容区域 -->
        <div class="content flex-1 px-[16px] pt-[16px] pb-[30px]">
            <!-- Total Amount -->
            <div class="text-[28px] font-bold text-[var(--text-brand)] mb-[4px] text-center">
                COP {{ addCommasToNumber(userInfo.rechargePrice) || '0' }}
            </div>
            <div class="text-[12px] text-[#666] mb-[24px] text-center">{{ t("Valor Total de Recarga") }}</div>
            <button
                class="w-full bg-[var(--brand-primary)] text-white h-[48px] rounded-[12px] font-bold text-[16px] active:opacity-90 transition-opacity mb-16"
                @click="handleClaim">
                {{ t("Claim") }}
            </button>

            <!-- 薪资标准表格卡片 -->
            <div class="standards-table bg-white rounded-[16px] p-[16px] mb-[24px]">

                <!-- 表头 -->
                <div
                    class="flex items-center text-[#333] font-bold text-[13px] mb-[16px] pb-[12px] border-b border-[#0000000D]">
                    <span class="w-[20%] text-left">Nível</span>
                    <span class="w-[40%] text-center">Salário Mensal</span>
                    <span class="w-[40%] text-right">Auxílio-Conferêncial</span>
                </div>

                <!-- 列表内容 -->
                <div class="flex flex-col gap-[18px]">
                    <div class="flex items-center text-[14px]" v-for="item in config.configs" :key="item.id">
                        <!-- Level 列 -->
                        <div class="w-[20%] flex items-center text-left">
                            <img :src="imgEnum[item.level]" class="w-[20px] h-[20px] mr-[4px] object-contain" />
                            <span class="text-[#999]">{{ t('Lv') }}{{ item.level }}</span>
                        </div>

                        <!-- Salário Mensal 列（一半） -->
                        <div class="w-[40%] text-center">
                            <span class="text-[#333] font-medium text-[15px]">COP {{ addCommasToNumber(item.monthlySalary) }}</span>
                        </div>

                        <!-- Auxílio-Conferêncial 列（另一半） -->
                        <div class="w-[40%] text-right">
                            <span class="text-[#333] font-medium text-[15px]">COP {{ addCommasToNumber(item.monthlySalary) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="html" v-html="config.salaryTextMonth"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { month, receiveMonth } from '@/api/salary';
import { optimizeRichText } from '@/utils/richText';
import { useUserStore } from '@/stores';
import { addCommasToNumber } from '@/utils/tool';

import lv1 from '@/assets/lv/lv1.png';
import lv2 from '@/assets/lv/lv2.png';
import lv3 from '@/assets/lv/lv3.png';
import lv4 from '@/assets/lv/lv4.png';
import lv5 from '@/assets/lv/lv5.png';
import lv6 from '@/assets/lv/lv6.png';
import lv7 from '@/assets/lv/lv7.png';
import lv8 from '@/assets/lv/lv8.png';

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const router = useRouter();
const { t } = useI18n();

const imgEnum = {
    1: lv1, 2: lv2, 3: lv3, 4: lv4,
    5: lv5, 6: lv6, 7: lv7, 8: lv8,
};

const config = ref({
    salaryTextMonth: '',
    configs: []
});

/**
 * 将 monthlySalary 拆分为两半
 * @param {string|number} monthlySalary - 月薪总额
 * @returns {{ salaryHalf: string, subsidyHalf: string }}
 */
function splitMonthlySalary(monthlySalary) {
    const total = parseFloat(monthlySalary) || 0;
    const half = total / 2;
    return {
        // Salário Mensal —— 向下取两位小数（保证两部分加起来 = 总额）
        salaryHalf: half.toFixed(2),
        // Auxílio-Conferêncial —— 用总额减去前一半，避免精度丢失
        subsidyHalf: (total - half).toFixed(2)
    };
}

async function getMonthConfig() {
    const { data, code } = await month();
    if (code == 200) {
        config.value = data || {};
        config.value.configs = (data.configs || []).map((item) => {
            const { salaryHalf, subsidyHalf } = splitMonthlySalary(item.monthlySalary);
            return {
                ...item,
                salaryHalf,   // Salário Mensal（一半）
                subsidyHalf   // Auxílio-Conferêncial（另一半）
            };
        });
        config.value.salaryTextMonth = optimizeRichText(data.salaryTextMonth || '');
    }
}

async function handleClaim() {
    const { data, code, message } = await receiveMonth();
    if (code == 200) {
        showToast(data.message || message || '');
    }
}

onMounted(async () => {
    await getMonthConfig();
    await userStore.getWalletInfo();
});
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
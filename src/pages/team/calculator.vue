<template>
    <div class="calculator-page min-h-[100vh] bg-[#F7F7F7] px-[16px] py-[16px]">
        <div class="bg-white rounded-[16px] p-[20px] shadow-sm">
            <!-- 标题 -->
            <div class="text-[16px] font-bold text-[var(--text-brand)] mb-[16px]">
                {{ t('Please enter your team size') }}
            </div>

            <!-- 三个层级人数输入 L1/L2/L3 -->
            <div class="flex gap-[12px] mb-[20px]">
                <div v-for="lv in levels" :key="lv.key" class="flex-1 flex flex-col">
                    <span class="text-[#999] text-[12px] mb-[6px]">{{ lv.label }}</span>
                    <input v-model="form[lv.key]" type="text" inputmode="numeric" placeholder="0"
                        class="w-full h-[44px] px-[12px] rounded-[10px] bg-[#0000000D] text-[14px] text-[#333] border-none outline-none" />
                </div>
            </div>

            <!-- 分类选择 -->
            <div class="select-box flex items-center justify-between h-[44px] px-[12px] mb-[12px] rounded-[10px] bg-[#0000000D]"
                @click="showClassPicker = true">
                <span class="text-[14px]" :class="selectedClass ? 'text-[#333]' : 'text-[#999]'">
                    {{ selectedClass ? selectedClass.text : t('Select Class') }}
                </span>
                <van-icon name="arrow" class="rotate-90 text-[#999]" />
            </div>

            <!-- 产品选择（未选分类前禁用半透明） -->
            <div class="select-box flex items-center justify-between h-[44px] px-[12px] mb-[20px] rounded-[10px] bg-[#0000000D]"
                :class="{ 'is-disabled opacity-50': !selectedClass }" @click="openProductPicker">
                <span class="text-[14px]" :class="selectedProductOption ? 'text-[#333]' : 'text-[#999]'">
                    {{ selectedProductOption ? selectedProductOption.text : t('Select Product') }}
                </span>
                <van-icon name="arrow" class="rotate-90 text-[#999]" />
            </div>

            <!-- 计算结果 -->
            <div v-if="result" class="result mb-[20px]">
                <!-- ① 每日团队收益 -->
                <div class="pt-[16px] border-t border-[#F2F2F2]">
                    <div class="text-[13px] text-[#666] mb-[10px]">① {{ t('Your daily team earnings will be') }}</div>
                    <div v-for="row in result.rows" :key="row.label"
                        class="flex justify-between text-[13px] text-[#333] mb-[8px]">
                        <span>{{ row.daily.toFixed(2) }} * {{ row.rate }}% * {{ row.count }}</span>
                        <span>COP {{ addCommasToNumber(row.amount) }}</span>
                    </div>
                    <div class="flex justify-between text-[14px] font-bold mt-[6px]">
                        <span class="text-[#333]">{{ t('Total') }}</span>
                        <span class="text-[#FF6464]">COP {{ addCommasToNumber(result.dailyTotal) }}</span>
                    </div>
                </div>

                <!-- ② 每月收益 -->
                <div class="pt-[16px] mt-[16px] border-t border-[#F2F2F2]">
                    <div class="text-[13px] text-[#666] mb-[10px]">② {{ t("Your team's monthly income will be") }}</div>
                    <div class="flex justify-between text-[14px] font-bold">
                        <span class="text-[#333]">{{ addCommasToNumber(result.dailyTotal) }} * 30</span>
                        <span class="text-[#FF6464]">COP {{ addCommasToNumber(result.monthly) }}</span>
                    </div>
                </div>

                <!-- ③ 总收益 -->
                <div class="pt-[16px] mt-[16px] border-t border-[#F2F2F2]">
                    <div class="text-[13px] text-[#666] mb-[10px]">③ {{ t("Your team's total income will be") }}</div>
                    <div class="flex justify-between text-[14px] font-bold">
                        <span class="text-[#333]">{{ addCommasToNumber(result.dailyTotal) }} * {{ result.cycle }}</span>
                        <span class="text-[#FF6464]">COP {{ addCommasToNumber(result.total) }}</span>
                    </div>
                </div>
            </div>

            <!-- 计算按钮 -->
            <div class="h-[46px] rounded-[10px] bg-[var(--brand-primary)] text-white text-[15px] font-bold flex items-center justify-center active:opacity-80"
                @click="calculate">
                {{ t('Calculate Now') }}
            </div>
        </div>

        <!-- 分类 Picker -->
        <van-popup v-model:show="showClassPicker" destroy-on-close position="bottom">
            <van-picker :columns="classColumns" :model-value="selectedClass ? [selectedClass.value] : []"
                :title="t('Select Class')" :confirm-button-text="t('Confirm')" :cancel-button-text="t('Cancel')"
                @confirm="onConfirmClass" @cancel="showClassPicker = false" />
        </van-popup>

        <!-- 产品 Picker -->
        <van-popup v-model:show="showProductPicker" destroy-on-close position="bottom">
            <van-picker :columns="productColumns" :model-value="selectedProductOption ? [selectedProductOption.value] : []"
                :title="t('Select Product')" :confirm-button-text="t('Confirm')" :cancel-button-text="t('Cancel')"
                @confirm="onConfirmProduct" @cancel="showProductPicker = false" />
        </van-popup>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { showToast } from 'vant';
import { productList, productInfo } from '@/api/product';
import { addCommasToNumber } from '@/utils/tool';

const { t } = useI18n();

// L1/L2/L3 对应内部 key B/C/D
const levels = [
    { key: 'B', label: 'L1' },
    { key: 'C', label: 'L2' },
    { key: 'D', label: 'L3' },
];
const form = reactive({ B: '', C: '', D: '' });

// 分类
const classColumns = ref([]);
const showClassPicker = ref(false);
const selectedClass = ref(null);

// 产品
const productColumns = ref([]);
const showProductPicker = ref(false);
const selectedProductOption = ref(null);
const selectedProduct = ref(null);

// 计算结果
const result = ref(null);

// 获取分类列表
const fetchClasses = async () => {
    const res = await productList({ pageIndex: 1, pageSize: 1 });
    if (res.code == 200) {
        classColumns.value = (res.data?.classList || []).map((e) => ({
            text: e.class_name,
            value: e.class_id,
        }));
        // 默认选中第一个分类，并自动选中其第一个产品
        if (classColumns.value.length) {
            selectedClass.value = classColumns.value[0];
            fetchProducts(selectedClass.value.value, true);
        }
    }
};

// 选择分类后获取对应产品列表，autoSelectFirst 时默认选中第一个产品
const fetchProducts = async (classId, autoSelectFirst = false) => {
    const res = await productList({ classId, pageIndex: 1, pageSize: 100 });
    if (res.code == 200) {
        productColumns.value = (res.data?.rows || []).map((e) => ({
            text: e.productName,
            value: e.productId,
        }));
        if (autoSelectFirst && productColumns.value.length) {
            selectProduct(productColumns.value[0]);
        }
    }
};

const onConfirmClass = ({ selectedOptions }) => {
    selectedClass.value = selectedOptions[0];
    showClassPicker.value = false;
    // 切换分类：重置已选产品、产品列表与计算结果
    selectedProductOption.value = null;
    selectedProduct.value = null;
    productColumns.value = [];
    result.value = null;
    fetchProducts(selectedClass.value.value);
};

const openProductPicker = () => {
    if (!selectedClass.value) {
        showToast(t('Please select a class'));
        return;
    }
    showProductPicker.value = true;
};

// 选中产品：拉取详情，清空旧的计算结果（需重新计算）
const selectProduct = async (option) => {
    selectedProductOption.value = option;
    result.value = null;
    const res = await productInfo({ productId: option.value });
    if (res.code == 200) {
        selectedProduct.value = res.data;
    }
};

const onConfirmProduct = ({ selectedOptions }) => {
    showProductPicker.value = false;
    if (selectedOptions[0]) selectProduct(selectedOptions[0]);
};

const calculate = () => {
    if (!selectedProduct.value) {
        showToast(t('Please select a product'));
        return;
    }
    const daily = Number(selectedProduct.value.dailyIncome) || 0;
    const cycle = Number(selectedProduct.value.incomeCycle) || 0;
    const rates = selectedProduct.value.rates || {};

    const rows = levels.map((lv) => {
        const rate = Number(rates[lv.key]) || 0;
        const count = Number(form[lv.key]) || 0;
        return {
            label: lv.label,
            daily,
            rate,
            count,
            amount: daily * (rate / 100) * count,
        };
    });
    const dailyTotal = rows.reduce((sum, r) => sum + r.amount, 0);

    result.value = {
        rows,
        dailyTotal,
        monthly: dailyTotal * 30,
        total: dailyTotal * cycle,
        cycle,
    };
};

onMounted(() => {
    fetchClasses();
});
</script>

<route lang="json5">
{
  name: 'team-calculator',
  meta: {
    title: 'Earnings Calculator',
    i18n: 'Earnings Calculator'
  },
}
</route>

<template>
    <div class="productDetail min-h-screen bg-white " :style="{ 'padding-bottom': bottomHeight }">

        <!-- 顶部导航栏 (如果这是子页面通常会有个 header，这里保留 content 结构) -->
        <!-- 假设外部 layout 已处理 header，这里直接开始内容 -->

        <!-- 1. Hero Image (顶部大图) -->
        <div class="w-full aspect-square bg-[#F7F7F7] relative overflow-hidden">
            <img :src="productInfo.productImage" class="w-full h-full object-cover" v-if="productInfo.productImage" />
            <!-- 空白占位 -->
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                <span>{{ t("Product Image") }}</span>
            </div>
        </div>

        <div class="px-[px] -mt-[20px] relative z-10">
            <!-- 2. Product Title (产品标题) -->
            <!-- 使用白色背景和圆角模拟截图中的卡片头部效果，或者直接放在背景上 -->
            <div class="bg-white rounded-t-[20px] pt-[20px] pb-[10px] px-20">
                <h1 class="text-[20px] font-bold text-[#1A1A1A] leading-[1.3]">
                    {{ productInfo.productName || '-' }}
                </h1>
            </div>
            <div class="px-20">

                <!-- 3. Core Data Card (核心数据列表) -->
                <div
                    class="data-card bg-white rounded-[12px] border border-[#F2F2F2] border-solid shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-[16px] mb-[24px]">

                    <!-- Limit buying -->
                    <div class="flex justify-between items-center py-[12px] border-b border-[#F5F5F5]">
                        <span class="text-[#999] text-[14px]">{{ t("Limit buying") }}</span>
                        <span class="text-[#333] text-[15px] font-bold ">
                            {{ productInfo.purchaseCount || 0 }}/{{ productInfo.purchaseLimit || 1 }}
                        </span>
                    </div>

                    <!-- Price -->
                    <div class="flex justify-between items-center py-[12px] border-b border-[#F5F5F5]">
                        <span class="text-[#999] text-[14px]">{{ t("Price") }}</span>
                        <span class="text-[#333] text-[15px] font-bold ">
                            {{ currencySymbol }} {{ addCommasToNumber(productInfo.discountPrice ||
                                productInfo.originalPrice) }}
                        </span>
                    </div>

                    <!-- Validity period -->
                    <div class="flex justify-between items-center py-[12px] border-b border-[#F5F5F5]">
                        <span class="text-[#999] text-[14px]">{{ t("Validity period") }}</span>
                        <span class="text-[#333] text-[15px] font-bold ">
                            {{ productInfo.incomeCycle }} {{ t("Days") }}
                        </span>
                    </div>

                    <!-- Daily Income -->
                    <div class="flex justify-between items-center py-[12px] border-b border-[#F5F5F5]">
                        <span class="text-[#999] text-[14px]">{{ t("Daily Income") }}</span>
                        <span class="text-[#333] text-[15px] font-bold ">
                            {{ currencySymbol }} {{ addCommasToNumber(productInfo.dailyIncome) }}
                        </span>
                    </div>

                    <!-- Total Revenue (Calculated) -->
                    <div class="flex justify-between items-center py-[12px] border-b border-[#F5F5F5]">
                        <span class="text-[#999] text-[14px]">{{ t("Total Revenue") }}</span>
                        <span class="text-[#333] text-[15px] font-bold ">
                            {{ currencySymbol }} {{ addCommasToNumber(productInfo.totalIncome) }}
                        </span>
                    </div>

                    <!-- Rate of return (Calculated) -->
                    <!-- <div class="flex justify-between items-center py-[12px]">
                        <span class="text-[#999] text-[14px]">{{ t("Rate of return") }}</span>
                        <span class="text-[#333] text-[15px] font-bold ">
                            {{ addCommasToNumber(productInfo.incomeRate) }}%
                        </span>
                    </div> -->
                </div>

                <!-- 4. Description Text (产品描述) -->
                <div class="description text-[#666] text-[13px] leading-[1.6] mb-[24px]">
                    <!-- 如果后端有富文本，使用 v-html，否则显示静态模拟文案 -->
                    <div v-if="productInfo.productContented" v-html="productInfo.productContented"></div>
                </div>

                <!-- 5. Rewards Info (奖励信息 - 仿截图样式) -->
                <h3 class="text-[15px] font-bold text-[#1A1A1A] mb-[12px]">About Rewards</h3>
                <div
                    class="rewards-card bg-white rounded-[12px] border border-[#F2F2F2] border-solid shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-[16px] mb-[24px]">
                    <div class="flex justify-between items-center py-[10px] border-b border-[#F5F5F5]">
                        <span class="text-[#666] text-[13px]">{{ t("Referral reward") }}</span>
                        <span class="text-[#333] text-[14px] font-bold ">{{ currencySymbol }} {{ productInfo.shareReward
                            }}</span>
                    </div>
                    <!-- <div class="flex justify-between items-center py-[10px] border-b border-[#F5F5F5]">
                        <span class="text-[#666] text-[13px]">{{ t("Upgrade reward") }}</span>
                        <span class="text-[#333] text-[14px] font-bold ">{{ currencySymbol }} {{
                            productInfo.repurchaseReward
                        }}</span>
                    </div> -->
                    <div class="flex justify-between items-center py-[10px]">
                        <span class="text-[#666] text-[13px]">{{ t("Upgrade Diamonds") }}</span>
                        <span class="text-[#333] text-[14px] font-bold ">{{ currencySymbol }} {{ productInfo.seedReward
                            }}</span>
                    </div>
                </div>

                <!-- 6. Commission Info (佣金信息 - 仿截图样式) -->
                <div class="commission-section mb-[30px]">
                    <h3 class="text-[14px] font-bold text-[#1A1A1A] mb-[8px]">B/C/D Team commission</h3>
                    <div class="text-[#666] text-[12px] leading-[1.8] ">
                        <p>B={{ productInfo.rates.B }}% = {{ productInfo.rates.B / 100 }} * {{ productInfo.totalIncome
                            }} = {{
                                currencySymbol }} {{ addCommasToNumber(productInfo.rates.B / 100 * productInfo.totalIncome)
                            }}</p>
                        <p>C={{ productInfo.rates.C }}% = {{ productInfo.rates.C / 100 }} * {{ productInfo.totalIncome
                            }} = {{
                                currencySymbol }} {{ addCommasToNumber(productInfo.rates.C / 100 * productInfo.totalIncome)
                            }}</p>
                        <p>D={{ productInfo.rates.D }}% = {{ productInfo.rates.D / 100 }} * {{ productInfo.totalIncome
                            }} = {{
                                currencySymbol }} {{ addCommasToNumber(productInfo.rates.D / 100 * productInfo.totalIncome)
                            }}</p>
                    </div>
                </div>
            </div>

        </div>

        <!-- 底部按钮 -->
        <bottom-button color="#1B1B1B" :button-text="t(enumBtnText[productInfo.status] || 'Buy Now')"
            ref="bottomButtonRef" @click="handlePurchase">
            <template #top>
                <div class="flex w-full">
                    <div class="couponListBox w-full" v-if="couponList && couponList.length > 0">
                        <div class="label font-bold flex items-center mb-6" @click="showCounpon()">{{ t("Coupon") }}
                            <svg class="w-16 h-16 transition-all duration-300"
                                :class="show ? '-rotate-180' : 'rotate-0'" viewBox=" 0 0 16 16" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.667 10L7.66699 6L11.667 10" stroke="#8C91A2" stroke-width="1.2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div class="payTypeBox w-full flex flex-col gap-12 " v-if="couponList && couponList.length > 0"
                            :class="show ? 'h-auto' : 'h-0 overflow-hidden'">
                            <div class="li-item flex items-center justify-between w-full" v-for="(i, k) in couponList"
                                :key="k" @click="handleClickSelectCounpon(k)">
                                <div class="label text-12 color-[#FF6464]">{{ i.couponName }}<span
                                        class="font-bold"></span>
                                </div>
                                <svg class="w-16 h-16 flex-shrink-0" v-if="activeConponIndex == k" viewBox="0 0 16 16"
                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M7.99992 14.6666C11.6666 14.6666 14.6666 11.6666 14.6666 7.99992C14.6666 4.33325 11.6666 1.33325 7.99992 1.33325C4.33325 1.33325 1.33325 4.33325 1.33325 7.99992C1.33325 11.6666 4.33325 14.6666 7.99992 14.6666Z"
                                        fill="#161616" />
                                    <path d="M5.16675 7.99995L7.05341 9.88661L10.8334 6.11328" stroke="white"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex w-full flex-1">
                    <div class="payTypeBox w-full flex flex-col gap-12">
                        <div class="li-item flex items-center justify-between w-full"
                            v-for="(item, index) in payTypeList" :key="index" @click="activePayIndex = index">
                            <div class="label">{{ item.name }} <span class="font-bold">R$ {{ item.num }}</span></div>
                            <svg class="w-16 h-16 flex-shrink-0" v-if="activePayIndex == index" viewBox="0 0 16 16"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M7.99992 14.6666C11.6666 14.6666 14.6666 11.6666 14.6666 7.99992C14.6666 4.33325 11.6666 1.33325 7.99992 1.33325C4.33325 1.33325 1.33325 4.33325 1.33325 7.99992C1.33325 11.6666 4.33325 14.6666 7.99992 14.6666Z"
                                    fill="#161616" />
                                <path d="M5.16675 7.99995L7.05341 9.88661L10.8334 6.11328" stroke="white"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </template></bottom-button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { productInfo as infoApi, purchase } from '@/api/product';
import { useUserStore } from '@/stores';
import { addCommasToNumber } from '@/utils/tool';
import { optimizeRichText } from '@/utils/richText';
import { showToast } from 'vant';

// 假设 BottomButton 是全局组件或已注册
// import BottomButton from '@/components/BottomButton.vue';
const show = ref(true)
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();
const userInfo = computed(() => { return userStore.userInfo })
const currencySymbol = 'R$'; // 根据截图或项目配置修改货币符号，截图是 $ 但代码原为 ₹
const activePayIndex = ref(0)
const activeConponIndex = ref<any>(-1)
const payTypeList = ref([{
    name: 'Wallet Top-Up',
    num: 0,
    key: '1'
}, {
    name: "Balance Wallet",
    num: 0,
    key: '2'
}])
const couponList = computed(() => {
    // 过滤出 status != 0 的优惠券
    return userStore.userInfo?.couponsList.filter(item => item.status != 0) || []
})
const bottomButtonRef = ref(null)
const bottomHeight = computed(() => {
    if (bottomButtonRef.value) {
        return (bottomButtonRef.value.$el.offsetHeight + 20) + 'px'
    }
    return '20px'
})
const productInfo = ref<any>({
    productId: '',
    productName: '',
    productImage: '',
    originalPrice: 0,
    discountPrice: 0,
    dailyIncome: 0,
    incomeCycle: 0,
    purchaseLimit: 1,
    purchaseCount: 0, // 当前购买数
    status: 1,
    productContented: '',
    shareReward: "",
    seedReward: "",
    repurchaseReward: "",
    rates: {
        B: '',
        C: "",
        D: ""
    }
});

// 模拟的奖励数据 (如果接口没有返回，暂时使用计算值或固定值)

const enumBtnText = {
    0: 'Sold out',
    1: 'Buy Now', // 截图上没显示按钮文字，改为通用购买文字
    2: 'Sold out',
    3: 'Pre-sale'
};

// 计算总收益: 日收益 * 周期
const totalRevenue = computed(() => {
    const daily = Number(productInfo.value.dailyIncome) || 0;
    const cycle = Number(productInfo.value.incomeCycle) || 0;
    return addCommasToNumber((daily * cycle).toFixed(2));
});

// 计算回报率: ((总收益 - 本金) / 本金) * 100% 或者 (总收益 / 本金) * 100%
// 通常这类理财App的回报率是指总产出比例，这里按 (Total / Price) * 100 计算，或者按截图自行调整逻辑
const rateOfReturn = computed(() => {
    const price = Number(productInfo.value.discountPrice) || 1; // 避免除以0
    const daily = Number(productInfo.value.dailyIncome) || 0;
    const cycle = Number(productInfo.value.incomeCycle) || 0;
    const total = daily * cycle;

    // 简单计算：(总收益 / 价格) * 100，保留1位小数
    if (price <= 0) return '0.0';
    return ((total / price) * 100).toFixed(1);
});
const showCounpon = () => {
    show.value = !show.value
}
const getProductDetail = async (id) => {
    try {
        const { data, code } = await infoApi({ productId: id });
        if (code == 200) {
            productInfo.value = data;
            // 处理富文本
            if (data.productContent) {
                productInfo.value.productContented = optimizeRichText(data.productContent);
            }
            // 如果需要更新用户优惠券等信息
            await userStore.getUserCouponList(1);
        }
    } catch (e) {
        console.log(e);
    }
};
const handleClickSelectCounpon = (index) => {
    if (index == activeConponIndex.value) {
        activeConponIndex.value = -1
        return
    }
    activeConponIndex.value = index;
}
const handlePurchase = async () => {
    // 简化购买逻辑，截图未显示优惠券选择，这里直接调用购买
    // 如果需要弹窗选择优惠券，可以在这里加弹窗逻辑
    try {
        const { code } = await purchase({
            productId: productInfo.value.productId,
            couponId: activeConponIndex.value == -1 ? '' : couponList.value[activeConponIndex.value].couponId, // 假设不传或传-1代表不使用优惠券
        });
        if (code == 200) {
            showToast({ message: t('ActivateSuccess') });
            await getProductDetail(productInfo.value.productId);
            setTimeout(() => {
                router.push({ path: "/buy/success" });
            }, 500);
        }
    } catch (e) {
        console.log(e);
    }
};

onMounted(() => {
    if (route.query.productId) {
        getProductDetail(route.query.productId);
        userStore.getWalletInfo()
    }
    payTypeList.value.forEach(item => {
        item.num = userInfo.value?.[item.key] || 0
    })
});
</script>

<style scoped lang="less">
/* 使用 DIN 字体显示数字，符合财经类 App 风格 */


/* 隐藏滚动条但保留功能 (如果 Description 太长) */
.description::-webkit-scrollbar {
    display: none;
}

.couponListBox {
    padding-bottom: 10px;
    border-bottom: 1px solid #0000000D;
}
</style>

<route lang="json5">
{
  name: 'productDetailss', 
  meta: {
    title: 'Product Details',
    i18n: 'Product Details'
  }
}
</route>

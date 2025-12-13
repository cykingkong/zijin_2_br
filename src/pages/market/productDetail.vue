<template>
    <div class="productDetail min-h-screen bg-white px-[16px] ">
        <!-- 1. Product Header -->
        <div class="header-section flex py-[20px] ">
            <div
                class="img-box w-[100px] h-[100px] bg-[#F7F7F7] rounded-[12px] flex items-center justify-center mr-[16px] overflow-hidden">
                <!-- Placeholder Image -->
                <van-icon name="photo-o" size="40" color="#ccc" v-if="!productInfo.productImage" />
                <img v-else :src="productInfo.productImage" class="w-full h-full object-cover" />
            </div>
            <div class="info flex flex-col justify-between py-[4px]">
                <div>
                    <div class="text-[16px] font-bold text-[#1A1A1A]">{{ productInfo.productName || '产品名字' }}</div>
                    <p class="text-[13px] text-[#999]">{{ productInfo.productContent || '产品介绍' }}</p>
                </div>
                <div class="price text-[18px] font-bold text-[#FF6B00]">₹{{ productInfo.originalPrice || '1,099.00' }}
                </div>
            </div>
        </div>

        <!-- 2. Coupon Selection -->
        <div class="coupon-section mt-[20px]">
            <h3 class="text-[16px] font-bold text-[#1A1A1A] mb-[12px]">优惠券选择</h3>

            <!-- Coupon List -->
            <div class="coupon-list flex flex-col gap-[12px]">
                <div v-for="(item, index) in couponList" :key="index"
                    class="coupon-item z-1 relative  rounded-[12px] p-[16px] cursor-pointer transition-all duration-200"
                    :class="selectedCouponId === item.id ? 'active-coupon' : ''" @click="handleClickCoupon(item)">
                    <div class="notches absolute -left-[5px] top-[71px] w-[10px] z-[10] h-[10px] bg-[#fff] rounded-full border-r border-[#eee]"
                        :class="selectedCouponId === item.id ? 'active-notches' : ''">
                        <svg class="absolute -left-[2px] top-[-1px] w-11 h-12" viewBox="0 0 10 10">
                            <path d="M 5 0 A 5 5 0 0 0 5 10 Z" fill="#FFFFFF" />
                            <path d="M 5 0 A 5 5 0 0 0 5 10" stroke="#fff" stroke-width="2" fill="none" />
                        </svg>
                    </div>
                    <div class="notches absolute -right-[5px] top-[71px] w-[10px] z-10 h-[10px] bg-[#fff] rounded-full border-l border-[#eee]"
                        :class="selectedCouponId === item.id ? 'active-notches' : ''">
                        <svg class="absolute -right-[2px] top-[-2px] w-12 h-13" wi viewBox="0 0 10 10">
                            <path d="M 5 0 A 5 5 0 0 1 5 10 Z" fill="#FFFFFF" />
                            <path d="M 5 0 A 5 5 0 0 1 5 10" stroke="#fff" stroke-width="2" fill="none" />
                        </svg>
                    </div>
                    <div class="flex justify-between items-start mb-[8px]">
                        <div class="font-bold text-[15px] text-[#1A1A1A]">{{ item.couponName }}</div>
                        <div class="checkbox">
                            <div class="radio w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center"
                                :class="selectedCouponId === item.id ? 'radio-active' : ''">
                                <svg class="w-10 h-10" v-if="selectedCouponId === item.id" viewBox="0 0 10 10"
                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.33341 2.70834L3.75008 7.29168L1.66675 5.20834" stroke="white"
                                        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </div>
                        </div>
                    </div>

                    <div class="countdown flex items-center text-[12px] text-[#FF4E4E] mb-[12px] gap-6">
                        <van-icon name="clock-o" class="mr-1" />
                        <span>剩余可使用时间 {{ item.validEndTime }}</span>
                    </div>

                    <div class="coupon-divider relative mb-[12px]">
                    </div>

                    <div class="terms text-[12px] text-[#666]">
                        <span class="text-[#00B86B]">Terms and conditions</span> apply for eligible products
                    </div>
                </div>
            </div>
        </div>

        <!-- 3. Purchase Details -->
        <div class="detail-section mt-[24px]">
            <h3 class="text-[16px] font-bold text-[#1A1A1A] mb-[12px]">产品购买详情</h3>

            <div class="detail-card border border-[#eee] border-solid rounded-[16px] p-[16px]">
                <div class="row flex justify-between mb-[12px]">
                    <span class="label text-[14px] text-[#999]">产品价格</span>
                    <span class="value text-[14px] text-[#666]">₹{{ productInfo.price || '1,099.00' }}</span>
                </div>
                <div class="row flex justify-between mb-[12px]">
                    <span class="label text-[14px] text-[#999]">每日收入</span>
                    <span class="value text-[14px] text-[#666]">₹{{ productInfo.dailyIncome }}</span>
                </div>
                <div class="row flex justify-between mb-[12px]">
                    <span class="label text-[14px] text-[#999]">周期天数</span>
                    <span class="value text-[14px] text-[#666]">{{ productInfo.incomeCycle }} 天</span>
                </div>
                <div class="row flex justify-between mb-[12px]">
                    <span class="label text-[14px] text-[#999]">等级限制</span>
                    <span class="value text-[14px] text-[#666]">{{ productInfo.levelLimit == 0 ? t('NoLimit') :
                        t('LevelLimit') }}</span>
                </div>
                <div class="row flex justify-between mb-[12px]">
                    <span class="label text-[14px] text-[#999]">限购数量</span>
                    <span class="value text-[14px] text-[#666]">{{ productInfo.purchaseLimit ? productInfo.purchaseLimit
                        : t('NoLimit') }}</span>
                </div>
                <div class="row flex justify-between mb-[12px]">
                    <span class="label text-[14px] text-[#999]">新购奖励</span>
                    <span class="value text-[14px] text-[#FF4E4E]">₹{{ productInfo.newUserReward }}</span>
                </div>
                <div class="row flex justify-between mb-[16px] pb-[16px] border-b border-[#eee]">
                    <span class="label text-[14px] text-[#999]">折扣百分比</span>
                    <span class="value text-[14px] text-[#FF4E4E]">{{ productInfo.discountRate }}%</span>
                </div>

                <div class="total-row flex justify-between items-center">
                    <span class="label text-[14px] font-bold text-[#333]">支付总金额</span>
                    <span class="value text-[18px] font-bold text-[#1A1A1A]">₹ {{ totalPrice }}</span>
                </div>
            </div>
        </div>
        <bottom-button color="#1B1B1B" :button-text="t('Activate')" @click="activateCoupon"></bottom-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { productInfo as info, purchase } from '@/api/product';
import { useUserStore } from '@/stores';
import { addCommasToNumber } from '@/utils/tool';
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const { t } = useI18n()
const productInfo = ref<any>({
    name: '产品名字',
    desc: '产品介绍',
    price: '1,099.00',
    image: '' // Add image URL here
});

const selectedCouponId = ref(-1);
const router = useRouter()
const couponList = computed(() => {
    return userStore.userInfo?.couponsList || []
})
const totalPrice = computed(() => {
    if (selectedCouponId.value) {
        const coupon = couponList.value.find(item => item.id == selectedCouponId.value)
        let couponType = coupon?.couponType // 1:百分比折扣 2:固定金额
        if (couponType == 1) {
            // 百分比折扣
            let discountPrice = productInfo.value.discountPrice * (1 - coupon.discountValue / 100)
            return addCommasToNumber(discountPrice.toFixed(2))
        } else if (couponType == 2) {
            // 固定金额折扣
            let discountPrice = productInfo.value.discountPrice - coupon.discountValue
            return addCommasToNumber(discountPrice.toFixed(2))
        }
        console.log(coupon, 'citem')
    }
    return addCommasToNumber(productInfo.value.discountPrice)
})
const getProductDetail = async (id) => {
    try {
        const { data, code } = await info({ productId: id })
        if (code == 200) {
            productInfo.value = data
            await userStore.getUserCouponList(1)
        }
    } catch (e) {
        console.log(e)
    }
}
const handleClickCoupon = (item) => {

    if (item.status == 2) return
    selectedCouponId.value = item.id
}
const activateCoupon = async () => {
    try {
        const { data, code } = await purchase({
            productId: productInfo.value.productId,
            couponId: selectedCouponId.value
        })
        if (code == 200) {
            showToast({
                message: t('ActivateSuccess')
            })
            await getProductDetail(productInfo.value.productId)
            setTimeout(() => {
                router.push({
                    path: "/buy/success"
                })
            })
        }
    } catch (e) {
        console.log(e)
    }
}
const init = (id) => {
    getProductDetail(id)
}
const route = useRoute()
onMounted(() => {
    if (route.query.productId) {
        init(route.query.productId)
    }
})
</script>

<style lang="less" scoped>
// --- 新增变量 ---
@coupon-border-color: #F0F0F0; // 优惠券未选中时的边框颜色（图中为黄色）
@coupon-active-color: #ffd700; // 优惠券选中时的边框颜色
@coupon-bg-color: #fff;
@notch-size: 10px; // 凹口（半圆）的直径

.productDetail {
    padding-bottom: calc(env(safe-area-inset-bottom) + 180px);
}

.header-section {
    border-bottom: 2px dashed #eee;
}

.dashed-line {
    border-top: 1px dashed #eee;
}

.coupon-item {
    border: 1px solid @coupon-border-color; // 默认使用黄色边框
    box-shadow: 0 0 0 1px @coupon-border-color inset; // 添加内嵌阴影模拟双线边框
    background-color: @coupon-bg-color;
    // overflow: hidden; // 隐藏凹口溢出的部分
    padding-bottom: 16px; // 确保底部有足够的内边距
}

.active-coupon {
    border-color: #FFD700;
}

.coupon-divider {
    // 自身不显示边框，仅作为伪元素的容器
    height: 1px;

    width: 100%;
    border-top: 1px dashed #e5e5e5;
    height: 0; // 移除默认高度

}


.notches {
    border: 1.5px solid #F0F0F0;
}

.active-notches {
    border-color: #FFD700;
}

.radio {
    border: 1px solid #cbd5e1;
}

.radio.radio-active {
    background-color: #FFD700;
    border-color: #FFD700;
}

.radio .radio-active::after {
    content: "";
    width: 8px;
    height: 4px;
    border: 2px solid #ffffff;
    border-top: none;
    border-right: none;
    transform: rotate(-45deg);
    position: absolute;
    top: 4px;
    left: 3px;
}
</style>

<route lang="json5">
{
  name: 'productDetail',
  meta: {
    title: 'Product Detail',
    i18n: 'Product Detail'
  }
}
</route>

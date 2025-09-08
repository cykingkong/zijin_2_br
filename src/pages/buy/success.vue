<template>
    <div class="buy-success-content bg-white min-h-screen flex flex-col">
        <!-- 主要内容区域 -->
        <div class="flex-1 flex flex-col items-center pt-40px px-24px">
            <!-- 成功图标区域 -->
            <div class="success-icon-section mb-32px relative">
                <!-- 主成功图标 -->
                <img src="@/assets/image/orderSuccess.png" class="w-full h-full block" alt="">
            </div>

            <!-- 确认信息 -->
            <div class="confirmation-info text-center mb-32px">
                <h1 class="title text-24px font-400 color-#0F172A mb-8px">Buy order received!</h1>
                <div class="amount text-32px font-400 color-#0F172A mb-4px">MX$ {{ info.total_amount || info.amount }}
                </div>
            </div>

            <!-- 支付详情卡片 -->
            <div class="payment-details-card bg-white rounded-16px px-24px pb-24px w-full shadow-lg">
                <div class="card-header text-center mb-24px">
                    <h2 class="text-18px font-600 color-#374151">Payment Details</h2>
                </div>

                <div class="details-list space-y-16px" v-if="buyType == 'discount'">
                    <!-- 数量 -->
                    <div class="detail-row flex justify-between items-center">
                        <div class="label text-14px color-#6B7280">数量</div>
                        <div class="value text-14px font-600 color-#0F172A">{{ info.quantity }} Shares</div>
                    </div>

                    <!-- 购买金额 -->
                    <div class="detail-row flex justify-between items-start">
                        <div class="label text-14px color-#6B7280">购买金额</div>
                        <div class="value text-right">
                            <div class="text-14px font-600 color-#0F172A">MX$ {{ info.total_amount }}</div>
                        </div>
                    </div>

                    <!-- 买入价格 -->
                    <div class="detail-row flex justify-between items-start">
                        <div class="label text-14px color-#6B7280">买入价格</div>
                        <div class="value text-right">
                            <div class="text-14px font-600 color-#0F172A">MX$ {{ info.discount_price }}</div>
                        </div>
                    </div>

                    <!-- 折扣率 -->
                    <div class="detail-row flex justify-between items-center">
                        <div class="label text-14px color-#6B7280">折扣率</div>
                        <div class="value text-14px font-600 color-#0F172A">{{ info.discount_rate }}%</div>
                    </div>

                    <!-- 可出售时间 -->
                    <div class="detail-row flex justify-between items-center">
                        <div class="label text-14px color-#6B7280">可出售时间</div>
                        <div class="value text-14px font-600 color-#0F172A">{{ info.sale_end_time }}</div>
                    </div>


                </div>
                <div class="details-list space-y-16px" v-if="buyType == 'stock'">
                    <!-- 数量 -->
                    <div class="detail-row flex justify-between items-center">
                        <div class="label text-14px color-#6B7280">数量</div>
                        <div class="value text-14px font-600 color-#0F172A">{{ info.quantity }} Shares</div>
                    </div>

                    <!-- 购买金额 -->
                    <div class="detail-row flex justify-between items-start">
                        <div class="label text-14px color-#6B7280">购买金额</div>
                        <div class="value text-right">
                            <div class="text-14px font-600 color-#0F172A">MX$ {{ info.amount }}</div>
                        </div>
                    </div>

                    <!-- 买入价格 -->
                    <div class="detail-row flex justify-between items-start">
                        <div class="label text-14px color-#6B7280">手续费</div>
                        <div class="value text-right">
                            <div class="text-14px font-600 color-#0F172A">MX$ {{ info.fee }}</div>
                        </div>
                    </div>



                </div>
            </div>

        </div>

        <!-- 底部按钮区域 -->
        <div class="bottom-buttons px-24px pb-24px flex flex-col gap-16px">
            <!-- 查看详情按钮 -->
            <van-button type="primary" class="h-56px" color="#6B39F4" block @click="handleShowDetails"
                v-if="buyType != 'discount'">
                Show Details
            </van-button>

            <!-- 完成按钮 -->
            <van-button plain class="h-56px" color="#6B39F4" block @click="handleDone">
                Done
            </van-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { addCommasToNumber } from "@/utils/tool";
import { ref, onMounted, watch } from "vue";
import { orderDetail } from '@/api/stock'
import { useRouter } from "vue-router";

const info = ref({
    total_amount: 0,
    quantity: 0,
    discount_price: 0,
    discount_rate: 0,
    sale_end_time: 0
})
const router = useRouter()

// 更新info的函数
const updateInfo = () => {
    const dataInfo = localStorage.getItem("successInfo");
    if (dataInfo) {
        try {
            // 如果dataInfo是JSON字符串，则解析为对象
            info.value = JSON.parse(dataInfo);
        } catch (error) {
            // 如果不是JSON格式，直接赋值字符串
            info.value = dataInfo;
        }
    } else {
        info.value = null;
    }
};

// 查看详情
const handleShowDetails = () => {
    console.log('查看购买详情')
    router.push('/quotes/stockOrderList')
}
const getStockDetail = async (transactionId: any) => {
    console.log('获取股票详情')
    const { data, code } = await orderDetail({ 'transaction_id': transactionId })
    if (code == 200) {
        info.value = data
    }
}
const buyType = ref('')
const route = useRoute()
// 完成
const handleDone = () => {
    console.log('完成')
    if (buyType.value == 'discount') {
        router.push('/discount')
    }
    if (buyType.value == 'stock') {
        router.push('/market')
    }
}

onMounted(() => {
    if (route.query.buyType) {
        buyType.value = route.query.buyType as string
        if (buyType.value == 'discount') {
            updateInfo()

        }
        if (buyType.value == 'stock') {
            console.log(route.query)
            getStockDetail(route.query.transaction as string)
        }
    }
});
</script>

<style lang="less" scoped>
.buy-success-content {
    .success-icon-section {
        .success-icon {
            box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
        }

        .sparkles {
            .sparkle {
                animation: sparkle 2s ease-in-out infinite;

                &:nth-child(2) {
                    animation-delay: 0.5s;
                }

                &:nth-child(3) {
                    animation-delay: 1s;
                }

                &:nth-child(4) {
                    animation-delay: 1.5s;
                }
            }
        }
    }

    .payment-details-card {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .bottom-buttons {
        padding-bottom: calc(env(safe-area-inset-bottom) + 24px);
    }
}

@keyframes sparkle {

    0%,
    100% {
        opacity: 0.3;
        transform: scale(1);
    }

    50% {
        opacity: 0.8;
        transform: scale(1.2);
    }
}
</style>

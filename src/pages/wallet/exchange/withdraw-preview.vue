<template>
    <div class="deposit-preview bg-[#0F172A] min-h-screen">
        <!-- 头部导航 -->
        <VanNavBar title="提现确认" :fixed="true" clickable :left-arrow="true" @click-left="onBack" z-index="999" />

        <!-- 主要内容 -->
        <div class="content px-12 pt-[80px] pb-[24px]">
            <!-- 主卡片 -->
            <div class="main-card bg-white rounded-[16px] p-[24px] mb-[24px]">
                <!-- 顶部图标和金额 -->
                <div class="top-section text-center mb-[32px]">
                    <div class="w-40 h-40 flex mx-auto items-center justify-center flex-shrink-0 block bg-[#6B39F4] rounded-full"
                        alt="">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M17.9 8V5C17.9 4.73478 17.7947 4.48043 17.6071 4.29289C17.4196 4.10536 17.1652 4 16.9 4H6.90002C6.36959 4 5.86088 4.21071 5.48581 4.58579C5.11074 4.96086 4.90002 5.46957 4.90002 6M4.90002 6C4.90002 6.53043 5.11074 7.03914 5.48581 7.41421C5.86088 7.78929 6.36959 8 6.90002 8H18.9C19.1652 8 19.4196 8.10536 19.6071 8.29289C19.7947 8.48043 19.9 8.73478 19.9 9V12M4.90002 6V18C4.90002 18.5304 5.11074 19.0391 5.48581 19.4142C5.86088 19.7893 6.36959 20 6.90002 20H18.9C19.1652 20 19.4196 19.8946 19.6071 19.7071C19.7947 19.5196 19.9 19.2652 19.9 19V16"
                                stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M20.9 12V16H16.9C16.3696 16 15.8609 15.7893 15.4858 15.4142C15.1107 15.0391 14.9 14.5304 14.9 14C14.9 13.4696 15.1107 12.9609 15.4858 12.5858C15.8609 12.2107 16.3696 12 16.9 12H20.9Z"
                                stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="deposit-type text-[14px] color-[#6B7280] mb-[8px]">Withdrawal (₹)</div>
                    <div class="amount text-[32px] font-bold color-[#0F172A]">+ ₹{{ depositData.amount }}</div>
                </div>

                <!-- 详细信息 -->
                <div class="details-section">
                    <!-- 钱包地址 -->
                    <div class="detail-row flex justify-between items-start py-[16px] border-b border-[#E5E7EB]">
                        <div class="label text-[14px] color-[#0F172A]">提现账户</div>
                        <div class="value text-[14px] color-[#0F172A] text-right max-w-[200px] break-all">
                            {{ depositData.info.account }}
                        </div>
                    </div>

                    <!-- USDT数量 -->
                    <div class="detail-row flex justify-between items-center py-[16px] border-b border-[#E5E7EB]">
                        <div class="label text-[14px] color-[#0F172A]">提现金额</div>
                        <div class="value text-[14px] color-[#0F172A]">₹{{ depositData.amount }}</div>
                    </div>

                    <!-- 充值到账 -->
                    <div class="detail-row flex justify-between items-center py-[16px]">
                        <div class="label text-[14px] color-[#0F172A]">提现手续费</div>
                        <div class="value text-[14px] color-[#0F172A]">₹{{ depositData.fee }}</div>
                    </div>
                    <div class="detail-row flex justify-between items-center py-[16px]">
                        <div class="label text-[14px] color-[#0F172A]">提现时间</div>
                        <div class="value text-[14px] color-[#0F172A]">{{ dayjs().format('DD/MM') }}</div>
                    </div>
                    <div class="detail-row flex justify-between items-center py-[16px]">
                        <div class="label text-[14px] color-[#0F172A]">实际到账</div>
                        <div class="value text-[14px] color-[#0F172A]">20 次网络确认</div>
                    </div>
                </div>
            </div>



        </div>

        <!-- 底部按钮 -->
        <BottomButton bg-color="#0F172A" button-text="确认无误" @click="handleClickConfirm" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import BottomButton from '@/components/bottom-button.vue'
import { withdraw, withdraw_info } from '@/api/billing'
import dayjs from 'dayjs'
const { proxy } = getCurrentInstance()!
const router = useRouter()

// 充值数据
const depositData = ref({
    amount: '280.00',
    unit: '₹',
    rate: '233.33',
    info: {
        account: '',
        name: ''
    },

    name: 'USDT-TRC20'
})

// 更新info的函数
const updateInfo = () => {
    const dataInfo = localStorage.getItem("withdrawInfo");
    if (dataInfo) {
        try {
            // 如果dataInfo是JSON字符串，则解析为对象
            depositData.value = JSON.parse(dataInfo);
        } catch (error) {
            // 如果不是JSON格式，直接赋值字符串
            depositData.value = dataInfo;
        }
    } else {
        depositData.value = null;
    }
};
// 返回上一页
const onBack = () => {
    router.back()
}

// 复制钱包地址
const handleClickConfirm = async () => {
    try {
        await withdraw({})
        // 可以添加复制成功的提示
        console.log('钱包地址已复制到剪贴板')
    } catch (err) {
        console.error('复制失败:', err)
    }
}
onMounted(() => {
    updateInfo()
})
</script>

<style lang="less" scoped>
.deposit-preview {
    .content {
        padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
    }

    .main-card {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .note-section {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .icon-wrapper {
        // box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
    }

    .detail-row {
        border-bottom: 1px solid #E5E7EB;

        &:last-child {
            border-bottom: none;

        }
    }
}

// 为这个页面单独设置导航栏样式
:deep(.van-nav-bar) {
    --van-nav-bar-background: #0F172A !important;
    --van-nav-bar-title-text-color: #fff !important;
    --van-nav-bar-text-color: #fff !important;
    --van-nav-bar-icon-color: #fff !important;
    --van-border-color: transparent !important;
}
</style>
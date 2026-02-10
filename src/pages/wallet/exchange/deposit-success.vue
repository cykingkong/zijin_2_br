<template>
    <div class="deposit-success bg- flex flex-col">
        <!-- 主要内容区域 -->
        <div class="flex flex-col items-center pt-[150px] px-[24px]">
            <!-- 中央图形 -->
            <div class="success-graphic mb-[32px] relative">
                <!-- 外层灰色圆圈 -->
                <div
                    class="outer-circle w-[120px] h-[120px] rounded-full border-[2px] border-dashed border-[#E5E7EB] border flex items-center justify-center">
                    <!-- 内层白色卡片 -->
                    <div
                        class="inner-card w-[80px] h-[60px] bg- rounded-[12px] shadow-lg flex items-center justify-center relative">
                        <!-- 紫色存钱罐图标 -->
                        <div
                            class="piggy-bank w-[40px] h-[40px] bg-[#6B39F4] rounded-[8px] flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"
                                    fill="white" />
                                <path
                                    d="M18 8H6C4.9 8 4 8.9 4 10V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V10C20 8.9 19.1 8 18 8Z"
                                    fill="white" />
                                <path d="M8 12H10V14H8V12Z" fill="white" />
                                <path d="M14 12H16V14H14V12Z" fill="white" />
                                <path d="M12 16H10V18H12V16Z" fill="white" />
                            </svg>
                        </div>

                        <!-- 金币 -->
                        <div class="coins absolute -top-[8px] -right-[8px]">
                            <div
                                class="coin w-[16px] h-[16px] bg-[#FFD700] rounded-full flex items-center justify-center text-[8px] font-bold text-white absolute top-0 right-0">
                                $
                            </div>
                            <div
                                class="coin w-[16px] h-[16px] bg-[#FFD700] rounded-full flex items-center justify-center text-[8px] font-bold text-white absolute top-[4px] right-[8px]">
                                $
                            </div>
                            <div
                                class="coin w-[16px] h-[16px] bg-[#FFD700] rounded-full flex items-center justify-center text-[8px] font-bold text-white absolute top-[8px] right-[16px]">
                                $
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 成功图标 -->
                <div
                    class="success-icon absolute -bottom-[4px] -right-[4px] w-[32px] h-[32px] bg-[#10B981] rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8L7 12L13 4" stroke="white" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
            </div>

            <!-- 文字内容 -->
            <div class="text-content text-center mb-[28px]">
                <h1 class="title text-[24px] font-bold color-[#0F172A] mb-[12px]">Deposit Successful</h1>
                <p class="subtitle text-[14px] color-[#6B7280] leading-[20px]">
                    Deposit are reviewed which may result in delays or funds being frozen.
                </p>
            </div>
        </div>

        <!-- 底部按钮区域 -->
        <div class="bottom-buttons px-[24px] pb-[24px] flex flex-col gap-[16px] mt-[60px]">
            <!-- 查看详情按钮 -->
            <van-button type="primary" class="h-[56px] mb-[16px]" color="#6B39F4" block @click="handleShowDetails">
                Show Details
            </van-button>

            <!-- 完成按钮 -->
            <van-button plain class="h-[56px]" color="#6B39F4" block @click="handleDone">
                Done
            </van-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"

const { proxy } = getCurrentInstance()!
const router = useRouter()

// 查看详情
const handleShowDetails = () => {
    // 跳转到详情页面或显示详情弹窗
    console.log('查看详情')
    router.push('/wallet/deposit-details')
}

// 完成
const handleDone = () => {
    // 返回钱包首页或指定页面
    console.log('完成')
    router.push('/wallet')
}
</script>

<style lang="less" scoped>
.deposit-success {
    .success-graphic {
        .outer-circle {
            background: #F9FAFB;
        }

        .inner-card {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .piggy-bank {
            box-shadow: 0 2px 8px rgba(107, 57, 244, 0.3);
        }

        .coins {
            .coin {
                box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
            }
        }

        .success-icon {
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }
    }

    .bottom-buttons {
        padding-bottom: calc(env(safe-area-inset-bottom) + 24px);
    }
}
</style>
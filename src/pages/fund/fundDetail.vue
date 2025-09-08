<template>
    <div class="fund-detail p-12">
        <div class="px-30">
            <div class="w-full text-14px bg-#0F172A80 rounded-12px flex items-center justify-between p-12px color-#fff">
                <div class="l">距离结束</div>
                <div class="r">{{ countdownText }}</div>
            </div>
        </div>
        <div class="name mt-30px font-700 text-20px mb-10px">{{ info.name }}</div>
        <div v-html="info.content" class="h-400px overflow-y-auto "></div>
        <div class="input w-full rounded-12px bg-#F8F9FD text-align-center font-bold  items-center text-16px h-58px flex px-24px gap-8px "
            :class="{ 'border-1px border-#E11D48': isInvalidAmount || isInvalidFormat }">
            <div class="unit  text-16px">R$</div>
            <input type="text" placeholder="" v-model="amount" @input="handleAmountInput" @blur="handleAmountBlur"
                class="w-full h-full text-16px text-align-left input"
                :class="{ 'color-#E11D48': isInvalidAmount || isInvalidFormat }">
        </div>
        <!-- 错误提示 -->
        <div v-if="isInvalidAmount" class="error-tip text-12px color-#E11D48 mt-8px text-center">
            输入金额不能小于最小投资金额 R$ {{ info.minAmount }}
        </div>
        <div v-if="isInvalidFormat" class="error-tip text-12px color-#E11D48 mt-8px text-center">
            请输入有效的正整数金额
        </div>
        <div class="mt-40px">
            <van-button type="primary" color="#6B39F4" class=" h-56px" block @click="handleReserveConfirm">
                预约{{ info.name }}
            </van-button>
        </div>

        <!-- 预约弹窗 -->
        <bottom-pop ref="bottomPopRef" :item="reserveItem" pop-type="fund" @onConfirm="handleReserveConfirm" />
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue"
import { fundProductInfo, fundSubscribe } from "@/api/bond"
import bottomPop from "./component/bottom-pop.vue"
import { showToast } from 'vant'
import { useRouter } from 'vue-router'

// 定义接口类型
interface FundInfo {
    name: string
    content: string
    minAmount: number
    start_time_end: string
    id: string
    [key: string]: any
}

const info = ref<FundInfo>({
    name: '',
    content: '',
    minAmount: 0,
    start_time_end: '',
    id: ''
})
const amount = ref('')
const isInvalidAmount = ref(false)
const isInvalidFormat = ref(false)
const countdownText = ref('--d : --h : --m : --s')
let countdownTimer: NodeJS.Timeout | null = null

// 预约相关
const bottomPopRef = ref()
const reserveItem = ref({
    name: '',
    minAmount: 0,
    id: ''
})

// 计算倒计时
const calculateCountdown = () => {
    if (!info.value.start_time_end) {
        countdownText.value = '--d : --h : --m : --s'
        return
    }

    const endTime = new Date(info.value.start_time_end).getTime()
    const now = new Date().getTime()
    const timeLeft = endTime - now

    if (timeLeft <= 0) {
        countdownText.value = '已结束'
        if (countdownTimer) {
            clearInterval(countdownTimer)
            countdownTimer = null
        }
        return
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    countdownText.value = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`
}

// 启动倒计时
const startCountdown = () => {
    if (countdownTimer) {
        clearInterval(countdownTimer)
    }

    calculateCountdown()
    countdownTimer = setInterval(calculateCountdown, 1000)
}

// 显示预约弹窗
const showReservePopup = () => {
    // 验证输入金额
    if (isInvalidAmount.value || isInvalidFormat.value) {
        showToast('请先输入有效的投资金额')
        return
    }

    // 设置预约项目信息
    reserveItem.value = {
        name: info.value.name,
        minAmount: parseFloat(amount.value) || info.value.minAmount,
        id: info.value.id
    }

    // 显示弹窗
    bottomPopRef.value?.show(true)
}

// 处理预约确认
const handleReserveConfirm = async (params: any) => {
    try {
        const reserveData = {
            id: info.value.id,
            amount: amount.value,

        }

        const res = await fundSubscribe(reserveData)

        if (res.code === 200 || res.success) {
            showToast('预约成功')
            // 跳转到订单详情页面
            const router = useRouter()
            router.push({
                path: '/deal/orderList',
                query: {
                    orderId: res.data?.order_id || res.data?.id,
                    type: 'fund'
                }
            })
        } else {
            showToast(res.message || '预约失败，请重试')
        }
    } catch (error) {
        console.error('预约失败:', error)
        showToast('预约失败，请重试')
    }
}

const getInfo = async (id: string) => {
    const res = await fundProductInfo({ id })
    console.log(res)
    info.value = res.data
    // 确保字段映射正确
    info.value.minAmount = res.data.min_amount || res.data.minAmount || 0
    amount.value = res.data.min_amount || res.data.minAmount || '0'

    // 启动倒计时
    startCountdown()
}

const router = useRoute()
onMounted(() => {
    console.log(router)
    if (router.query.id) {
        getInfo(router.query.id as string)
    }
})

// 组件卸载时清理定时器
onUnmounted(() => {
    if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
    }
})

const handleAmountInput = () => {
    // 检查是否为正整数
    const positiveIntegerRegex = /^[1-9]\d*$/
    if (!positiveIntegerRegex.test(amount.value)) {
        isInvalidFormat.value = true
        isInvalidAmount.value = false
        return
    }

    isInvalidFormat.value = false
    const inputValue = parseFloat(amount.value) || 0
    if (inputValue < info.value.minAmount) {
        isInvalidAmount.value = true
    } else {
        isInvalidAmount.value = false
    }
}

const handleAmountBlur = () => {
    // 检查是否为正整数
    const positiveIntegerRegex = /^[1-9]\d*$/
    if (!positiveIntegerRegex.test(amount.value)) {
        isInvalidFormat.value = true
        isInvalidAmount.value = false
        // 清空无效输入
        amount.value = info.value.minAmount.toString()
        return
    }

    isInvalidFormat.value = false
    const inputValue = parseFloat(amount.value) || 0
    if (inputValue < info.value.minAmount) {
        isInvalidAmount.value = true
        // 如果输入值小于最小金额，重置为最小金额
        amount.value = info.value.minAmount.toString()
    } else {
        isInvalidAmount.value = false
    }
}
</script>

<style lang="less" scoped>
.input {
    transition: all 0.3s ease;

    &.border-1px {
        border-color: #E11D48;
        background: #FEF2F2;
    }
}

input {
    background: transparent;
    border: none;
    outline: none;

    &::placeholder {
        color: #999999;
        font-size: 14px;
        font-weight: 400;
    }

    &::-webkit-input-placeholder {
        color: #999999;
        font-size: 14px;
        font-weight: 400;
    }

    &::-moz-placeholder {
        color: #999999;
        font-size: 14px;
        font-weight: 400;
    }

    &:-ms-input-placeholder {
        color: #999999;
        font-size: 14px;
        font-weight: 400;
    }

    &.color-#E11D48 {
        color: #E11D48;
    }
}

.error-tip {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

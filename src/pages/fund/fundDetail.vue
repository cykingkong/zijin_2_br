<template>
    <div class="fund-detail p-12">
        <div class="px-30">
            <div class="w-full text-14px bg-#0F172A80 rounded-12px flex items-center justify-between p-12px color-#fff">
                <div class="l">距离结束</div>
                <div class="r">31d : 0h : 2m : 21s</div>
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
            <van-button type="primary" color="#6B39F4" class=" h-56px" block>
                购买{{ info.name }}
            </van-button>
        </div>

    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { fundProductInfo } from "@/api/bond"

// 定义接口类型
interface FundInfo {
    name: string
    content: string
    minAmount: number
    [key: string]: any
}

const info = ref<FundInfo>({
    name: '',
    content: '',
    minAmount: 0
})
const amount = ref('')
const isInvalidAmount = ref(false)
const isInvalidFormat = ref(false)

const getInfo = async (id: string) => {
    const res = await fundProductInfo({ id })
    console.log(res)
    info.value = res.data
    amount.value = res.data.minAmount
}

const router = useRoute()
onMounted(() => {
    console.log(router)
    if (router.query.id) {
        getInfo(router.query.id as string)
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

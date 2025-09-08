<template>
    <div class="cashier-center-content px-12 w-full">
        <VanNavBar title="" :fixed="true" clickable :left-arrow="true" @click-left="onBack" z-index="999">
            <template #title>
                <div class="text-16px font-bold color-#0F172A">收银台</div>
            </template>
        </VanNavBar>
        <div class="info mt-32" v-if="info">
            <div class="min-count text-#0F172A font-size-40px mx-a text-center mt-57px font-700 overflow-y-auto">
                MX${{ count }}
            </div>
            <div class="min-count-fee text-#64748B font-size-14px mx-a text-center mt-6px font-700 overflow-y-auto">
                Withdraw fee ${{ fee }}
            </div>
            <div class="mt-30px">
                <item class="mt-62px">
                    <template #left>
                        <div class="left h-46px flex items-center gap-16px">
                            <div class="w-40 h-40 flex items-center  justify-center flex-shrink-0 block bg-#6B39F4 rounded-full"
                                alt="">
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M17.9 8V5C17.9 4.73478 17.7947 4.48043 17.6071 4.29289C17.4196 4.10536 17.1652 4 16.9 4H6.90002C6.36959 4 5.86088 4.21071 5.48581 4.58579C5.11074 4.96086 4.90002 5.46957 4.90002 6M4.90002 6C4.90002 6.53043 5.11074 7.03914 5.48581 7.41421C5.86088 7.78929 6.36959 8 6.90002 8H18.9C19.1652 8 19.4196 8.10536 19.6071 8.29289C19.7947 8.48043 19.9 8.73478 19.9 9V12M4.90002 6V18C4.90002 18.5304 5.11074 19.0391 5.48581 19.4142C5.86088 19.7893 6.36959 20 6.90002 20H18.9C19.1652 20 19.4196 19.8946 19.6071 19.7071C19.7947 19.5196 19.9 19.2652 19.9 19V16"
                                        stroke="#fff" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path
                                        d="M20.9 12V16H16.9C16.3696 16 15.8609 15.7893 15.4858 15.4142C15.1107 15.0391 14.9 14.5304 14.9 14C14.9 13.4696 15.1107 12.9609 15.4858 12.5858C15.8609 12.2107 16.3696 12 16.9 12H20.9Z"
                                        stroke="#fff" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div class="info h-46px flex flex-col justify-between ">
                                <div class="name text-#0F172A text-14px font-bold">{{ info.account }}</div>
                                <div class="name2 text-#64748B text-12px">{{ info.name }}</div>
                            </div>
                        </div>
                    </template>
                    <template #right>
                        <div class=" color-#6B39F4 text-14px font-bold text-nowrap" @click="onSelect">选择更多</div>
                    </template>
                </item>
                <div class="tips mt-45px">
                    <div class="t-title mb-12px color-#FF383C80 font-bold text-18px">注意</div>
                    <div class="l flex items-center color-#64748B text-14px gap-8px pl-6px">
                        <div class="dot w-4 h-4 rounded-full bg-#64748B"></div>
                        工作日提现时间为 {{ withdrwaInfo.withdraw_hour_before }} AM ~ {{ withdrwaInfo.withdraw_hour_after }} PM
                    </div>
                    <div class="l flex items-center color-#64748B text-14px gap-8px pl-6px">
                        <div class="dot w-4 h-4 rounded-full bg-#64748B"></div>
                        最低提现金额为 MX$ {{ withdrwaInfo.withdraw_amount_before }} ~ MX$ {{
                            withdrwaInfo.withdraw_amount_after
                        }}
                    </div>
                    <div class="l flex items-center color-#64748B text-14px gap-8px pl-6px">
                        <div class="dot w-4 h-4 rounded-full bg-#64748B"></div>
                        提现到账时间为24 小时内,请耐心等待
                    </div>
                </div>
            </div>
        </div>

        <div class="input-box px-12 mt-60px">
            <div class="keypad">
                <div class="keypad-row flex gap-8px mb-8px" v-for="row in keypadRows" :key="row.join('')">
                    <div v-for="key in row" :key="key" @click="handleKeyClick(key)"
                        class="keypad-btn flex-1 h-56px bg-#FFFFFF border border-#E2E8F0 rounded-8px text-20px font-medium text-#0F172A hover:bg-#F1F5F9 flex items-center justify-center">
                        <svg width="29" v-if="key === 'delete'" height="28" viewBox="0 0 29 28" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_94_1671)">
                                <path
                                    d="M23.5832 7C23.8927 7 24.1894 7.12292 24.4082 7.34171C24.627 7.5605 24.7499 7.85725 24.7499 8.16667V19.8333C24.7499 20.1428 24.627 20.4395 24.4082 20.6583C24.1894 20.8771 23.8927 21 23.5832 21H10.7499L4.91657 15.1667C4.6296 14.8458 4.47095 14.4305 4.47095 14C4.47095 13.5695 4.6296 13.1542 4.91657 12.8333L10.7499 7H23.5832Z"
                                    stroke="#0F172A" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path d="M18.9167 11.6667L14.25 16.3334M14.25 11.6667L18.9167 16.3334L14.25 11.6667Z"
                                    stroke="#0F172A" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_94_1671">
                                    <rect width="28" height="28" fill="white" transform="translate(0.25)" />
                                </clipPath>
                            </defs>
                        </svg>

                        <span v-else>{{ key }}</span>
                    </div>
                </div>
            </div>
        </div>
        <BottomButton :button-text="`Deposit Preview`" @click="onConfirm" />
    </div>
</template>
<script setup lang="ts">
import { addCommasToNumber } from "@/utils/tool";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useLoadingStore } from "@/stores/modules/loading";


import { deposit, withdraw_info, withdraw } from '@/api/billing'
import item from '../../../components/item.vue'
import BottomButton from '../component/bottom-button.vue'
const info = ref<any>();
const count = ref(0)
const displayValue = ref('');
const fee = computed(() => {
    return addCommasToNumber(count.value * withdrwaInfo.value.bank_fee)

})
const { proxy } = getCurrentInstance()!
const loadingStore = useLoadingStore();

// 数字键盘布局数据
const keypadRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'delete']
];

// 统一的按键处理方法
const handleKeyClick = (key: string) => {
    if (key === 'delete') {
        deleteLastChar();
    } else if (key === '.') {
        appendDecimal();
    } else {
        appendNumber(key);
    }
};
const onSelect = () => {
    router.push('/wallet/exchange/withdraw-bank')
}

const handleBuyClickOriginal = async () => {
    // 处理购买逻辑
    console.log('购买金额:', count.value)
    console.log('购买信息:', info.value)
    // 将数据整合到一起，存进localStorage
    const dataInfo = {
        amount: count.value,
        fee: fee.value,
        info: info.value
    };
    // localStorage.setItem("withdrawInfo", JSON.stringify(dataInfo));
    // router.push('/wallet/exchange/withdraw-preview')
    const { data, code } = await withdraw({
        "wallet_type": "bank",
        "wallet_id": info.value.id,
        "amount": count.value
    })
    if (code == 200) {
        setTimeout(() => {
            router.push('/wallet/exchange/withdraw-success')

        }, 400)

    }

}
const onConfirm = proxy!.$throttle(handleBuyClickOriginal, 1000, {
    onStart: () => loadingStore.show(),
    onEnd: () => loadingStore.hide(),
});
// 数字键盘相关方法
const appendNumber = (num: string) => {
    if (displayValue.value === '0' && num !== '.') {
        displayValue.value = num;
    } else {
        displayValue.value += num;
    }
    // 更新count值
    count.value = displayValue.value === '' ? 0 : parseFloat(displayValue.value);
};

// 添加小数点方法
const appendDecimal = () => {
    // 如果已经包含小数点，则不允许再添加
    if (displayValue.value.includes('.')) {
        return;
    }

    // 如果当前值为空或0，则添加0.
    if (displayValue.value === '' || displayValue.value === '0') {
        displayValue.value = '0.';
    } else {
        displayValue.value += '.';
    }

    // 更新count值
    count.value = displayValue.value === '' ? 0 : parseFloat(displayValue.value);
};

const deleteLastChar = () => {
    if (displayValue.value.length > 0) {
        displayValue.value = displayValue.value.slice(0, -1);
        // 如果删除后为空，则count为0，否则解析数值
        count.value = displayValue.value === '' ? 0 : parseFloat(displayValue.value);
    }
};

// 更新info的函数
const updateInfo = () => {
    const dataInfo = localStorage.getItem("withdrawType");
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
const withdrwaInfo = ref()
const getWithdrawInfo = async () => {
    const { data, code } = await withdraw_info()
    if (code == 200) {
        withdrwaInfo.value = data
    }

}
onMounted(() => {
    // 初始获取localStorage中的dataInfo
    updateInfo();
    getWithdrawInfo()

    // 监听localStorage变化
    window.addEventListener('storage', (e) => {
        if (e.key === 'dataInfo') {
            updateInfo();
        }
    });
});

// 使用watch监听info的变化（可选，用于调试）
watch(info, (newValue) => {
    console.log('info已更新:', newValue);
}, { deep: true });

const router = useRouter();
function onBack() {
    if (window.history.state.back) history.back();
    else router.replace("/");
}
</script>

<style lang="less" scoped>
.cashier-center-content {
    padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
}
</style>

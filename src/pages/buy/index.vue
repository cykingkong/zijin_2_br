<template>
    <div class="discont-content px-12 w-full ">
        <VanNavBar title="" :fixed="true" clickable :left-arrow="true" @click-left="onBack" z-index="999">
            <template #title>
                <div class="flex flex-items-center gap-6 font-size-18px font-bold">{{ type == '0' ? t('Buy') : t('Sell')
                    }} {{
                        info?.name || ''
                    }}</div>
            </template>
        </VanNavBar>
        <div class="info mt-32" v-if="info && info">
            <div class="mid-content flex items-center mx-auto items-center justify-center gap-8px">

                <img :src="info.logo" class="block w-45 h-45 rounded-full" alt="" />
                <div class="name font-size-18px"> 1 {{ info?.name || '' }} = </div>
                <div class="price">
                    <div class="price-1 font-size-16px text-#0F172A ">{{ info?.close_unit || 'MX$' }}
                        {{
                            buyType == 'stock' ? addCommasToNumber(info?.close) : addCommasToNumber(info?.price) || '' }}
                    </div>
                </div>
            </div>
            <div class="min-count text-#0F172A font-size-40px mx-a text-center mt-57px overflow-y-auto">
                {{ count }}
            </div>
            <div class="balance flex items-start  justify-center gap-8px text-#64748B mt-8">
                <div class="label text-14px ">Balance</div>
                <div class="value">
                    <div class="v1 text-14px">MX$ {{ addCommasToNumber(userInfo.user_balance) || 0 }}</div>
                </div>
            </div>
            <div class="tips text-#64748B text-12px text-center" v-if="info.min">{{ t('Minimum purchase amount is ') +
                info.min
            }}
            </div>

        </div>
        <div class="input-box px-12 mt-111px">
            <div class="keypad">
                <div class="keypad-row flex gap-8px mb-8px" v-for="row in keypadRows" :key="row.join('')">
                    <div v-for="key in row" :key="key" @click="key === 'delete' ? deleteLastChar() : appendNumber(key)"
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
        <van-button type="primary" class="h-56px" color="#6B39F4" block @click="handleClickBtn">
            {{ type == '0' ? t('Buy') : t('Sell')
            }} {{ info?.unit || 'MX$ ' }}{{ buyType == 'stock' ? addCommasToNumber(count * info?.close) :
                addCommasToNumber(count * info?.price) }}
        </van-button>
    </div>
</template>
<script setup lang="ts">
import { addCommasToNumber } from "@/utils/tool";
import { ref, onMounted, watch } from "vue";
import { assetsDetail, buySell } from '@/api/stock'
import { discountOrderBuy } from '@/api/bond'
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores";
const { t } = useI18n();

const info = ref<any>();
const count = ref(0)
const displayValue = ref('');
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

// 数字键盘布局数据
const keypadRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0', 'delete']
];

// 数字键盘相关方法
const appendNumber = (num: string) => {
    if (displayValue.value === '0' && num !== '.') {
        displayValue.value = num;
    } else {
        displayValue.value += num;
    }
    // 更新count值
    count.value = parseFloat(displayValue.value) || 0;
};

const deleteLastChar = () => {
    console.log(count.value, displayValue.value)
    if (displayValue.value.length > 0) {
        displayValue.value = displayValue.value.slice(0, -1);
        count.value = parseFloat(displayValue.value) || 0;
        console.log(count.value, displayValue.value)

    }
};
const handleClickBtn = async () => {
    if (buyType.value == 'stock') {
        const { data, code } = await buySell({
            "type": type.value == 0 ? "buy" : "sell",
            "symbol": info.value.symbol,
            "number": count.value
        })
        if (code == 200) {
            router.push({
                path: '/buy/success',
                query: {
                    buyType: 'stock',
                    transaction: data.transaction
                }
            })
        }
        return
    }
    if (buyType.value == 'discount') {
        const { data, code } = await discountOrderBuy({
            id: info.value.id,
            number: count.value
        })
        if (code == 200) {
            localStorage.setItem('successInfo', JSON.stringify(data))
            router.push({
                path: '/buy/success',
                query: {
                    buyType: 'discount'
                }
            })
        }
    }
}
const buyType = ref()
// 更新info的函数
const updateInfo = () => {
    const dataInfo = localStorage.getItem("dataInfo");
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
    count.value = info.value.min || '0'
    displayValue.value = info.value.min || '0'
    console.log(count.value, displayValue.value, info.value)
};
const route = useRoute();
const getDetail = async (params) => {
    const { data, code } = await assetsDetail(params)
    if (code == 200) {
        info.value = data
        count.value = 1
        displayValue.value = '1'
    }
}
const type = ref()
onMounted(async () => {
    // 初始获取localStorage中的dataInfo

    if (route.query.buyType == 'stock') {
        getDetail({ symbol: route.query.symbol })
        type.value = route.query.type
    }
    if (route.query.buyType == 'discount') {
        updateInfo();
        type.value = 0
    }
    buyType.value = route.query.buyType

    await userStore.info()
    // 监听localStorage变化
    window.addEventListener('storage', (e) => {
        if (e.key === 'dataInfo' && route.query.buyType == 'discount') {
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

<style lang="less" scoped></style>

<template>
    <van-popup v-model:show="showPicker" destroy-on-close round :position="'bottom'" :safe-area-inset-bottom="true"
        z-index="10000">
        <div class="title text-24px font-bold mt-12px text-center">{{ title }}</div>
        <div class="min-count text-#0F172A font-size-40px mx-a text-center mt-24px overflow-y-auto">
            MX$ {{ count }}
        </div>
        <div class="input-box px-12 mt-40px">
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
        <div class="p-12">
            <van-button type="primary" class="h-56px" color="#6B39F4" block @click="handleClick" :loading="loading"
                :disabled="disabled">
                {{ t('Confirm') }}
            </van-button>
        </div>

    </van-popup>
</template>

<script setup>
import more from '@/assets/image/icon-right.png';
const { t } = useI18n();
const emit = defineEmits(['onClick']);

const props = defineProps({
    status: {
        type: Number,
        default: 0 // 0: 默认 1: 加载中 4: 已无更多
    },
    title: {
        type: String,

    }
});

const count = ref(0);
const displayValue = ref("");

const showPicker = ref(false);
const show = (val, amount = 0) => {
    count.value = amount
    displayValue.value = amount == 0 ? '' : amount;
    showPicker.value = val;
};
const handleClick = () => {
    showPicker.value = false;
    emit('onClick', count.value)
}
// 数字键盘布局数据
const keypadRows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["0", "delete"],
];

// 数字键盘相关方法
const appendNumber = (num) => {
    if (displayValue.value === "0" && num !== ".") {
        displayValue.value = num;
    } else {
        displayValue.value += num;
    }
    // 更新count值
    count.value = parseFloat(displayValue.value) || 0;
};

const deleteLastChar = () => {
    console.log(count.value, displayValue.value, displayValue.value);
    if (displayValue.value.length > 0) {
        displayValue.value = displayValue.value.slice(0, -1);
        count.value = parseFloat(displayValue.value) || 0;
        console.log(count.value, displayValue.value);
    }
};
defineExpose({
    show,
});
</script>

<style scoped lang="less">
.more {
    width: 100%;
    height: 70px;
    line-height: 70px;
    text-align: center;
    color: var(--van-gray-6);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    .icon {
        width: 7px;
        height: 10px;
    }
}
</style>

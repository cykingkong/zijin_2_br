<template>
    <van-popup v-model:show="showPicker" destroy-on-close round :position="'bottom'" :safe-area-inset-bottom="true"
        z-index="10000">
        <div class="relative px-12 pt-[12px]">

            <div class="title text-[24px] font-bold text-center">{{ title }}</div>
            <div v-if="subText" class="mt-[8px] text-center text-[14px] text-[#64748B]">{{ subText }}</div>
        </div>
        <div class="min-count text-[#0F172A] font-size-[40px] mx-a text-center mt-[24px] overflow-y-auto">
            {{ displayPrefix }}{{ count }}
        </div>
        <div class="input-box px-12 mt-[40px]">
            <Keypad v-model="displayValue" />
        </div>
        <div class="p-12 flex gap-[12px]">
            <van-button type="default" class="h-[56px]" plain block @click="handleClose" v-if="showClose">
                {{ t("Cancel") }}
            </van-button>
            <van-button type="primary" class="h-[56px]" color="#6B39F4" block @click="handleClick" :loading="loading"
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

    },
    prefix: {
        type: String,
        default: '₹'
    },
    showClose: {
        type: Boolean,
        default: false
    },
    subText: {
        type: String,
        default: ''
    }
});

const displayPrefix = computed(() => props.prefix ?? '');

const count = ref(0);
const displayValue = ref("");

const showPicker = ref(false);
const show = (val, amount = 0) => {
    count.value = amount
    displayValue.value = amount == 0 ? '' : amount;
    showPicker.value = val;
};
const handleClose = () => {
    showPicker.value = false;
}
const handleClick = () => {
    showPicker.value = false;
    emit('onClick', count.value)
}
// 监听 displayValue 变化，更新 count 值
watch(displayValue, (newValue) => {
    count.value = parseFloat(newValue) || 0;
});
defineExpose({
    show,
    close: handleClose,
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

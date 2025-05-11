<template>
    <div class="more" @click="handleClick">
        {{ statusText }} <img :src="more" alt="" class="icon">
    </div>
</template>

<script setup>
import more from '@/assets/image/icon-right.png';

const emit = defineEmits(['load-more']);

const props = defineProps({
    status: {
        type: Number,
        default: 0 // 0: 默认 1: 加载中 4: 已无更多
    }
});

const statusText = computed(() => {
    return props.status === 1 ? '加载中..' :
        props.status === 4 ? '已无更多' : '加载更多';
});

const handleClick = () => {
    if (props.status !== 1 && props.status !== 4) {
        emit('load-more');
    }
};
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

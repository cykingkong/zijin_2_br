<template>
    <div class="close-button h-56px w-full flex items-center px-24px" :class="[customClass, { 'disabled': disabled }]"
        @click="handleClose">
        <div class="close-icon" :style="iconStyle"></div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    // 自定义样式类
    customClass?: string
    // 是否禁用点击
    disabled?: boolean
    // 自定义图标样式
    iconStyle?: Record<string, string>
    // 图标大小
    iconSize?: string
}

interface Emits {
    (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
    customClass: '',
    disabled: false,
    iconStyle: () => ({}),
    iconSize: '24px'
})

const emit = defineEmits<Emits>()

// 处理关闭事件
const handleClose = () => {
    if (!props.disabled) {
        emit('close')
    }
}
</script>

<style scoped>
.close-button {
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.close-button:hover {
    opacity: 0.8;
}

.close-button:active {
    opacity: 0.6;
}

.close-button.disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.close-icon {
    width: 24px;
    height: 24px;
    background: url('@/assets/image/white-close.svg') no-repeat center;
    background-size: 100% 100%;
}
</style>

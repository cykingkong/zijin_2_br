<template>
    <div class="fixed bottom-btn-box w-full px-24px left-0" :style="{ background: bgColor }">
        <van-button type="primary" class="h-56px" color="#6B39F4" block @click="handleClick" :loading="loading"
            :disabled="disabled">
            {{ buttonText }}
        </van-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

interface Props {
    buttonText?: string
    loading?: boolean
    disabled?: boolean
    bgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
    buttonText: '确认',
    loading: false,
    disabled: false,
    bgColor: 'white'
})

const emit = defineEmits<{
    click: []
}>()

const handleClick = () => {
    emit('click')
}
</script>

<style lang="less" scoped>
.bottom-btn-box {
    padding-top: 12px;
    bottom: 0;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
    padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
}
</style>
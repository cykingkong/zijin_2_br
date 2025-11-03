<template>
    <div class="code-input-container">
        <div class="code-input-wrapper" :class="{ 'error': hasError }">
            <div v-for="(item, index) in codeArray" :key="index" class="code-input-item"
                :class="{ 'active': currentIndex === index, 'filled': item !== '' }" @click="focusInput">
                <span v-if="item !== ''" class="code-text">{{ item }}</span>
                <span v-else-if="currentIndex === index" class="cursor"></span>
            </div>
            <input ref="inputRef" v-model="inputValue" :maxlength="length" type="text" class="hidden-input"
                :inputmode="inputMode" :pattern="pattern" @input="handleInput" @keydown="handleKeydown"
                @focus="handleFocus" @blur="handleBlur" @paste="handlePaste" />
        </div>
        <div v-if="hasError" class="error-message">{{ errorMessage }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface Props {
    modelValue?: string
    length?: number
    inputMode?: 'text' | 'numeric' | 'tel' | 'email'
    pattern?: string
    errorMessage?: string
    hasError?: boolean
    autoFocus?: boolean
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    length: 6,
    inputMode: 'numeric',
    pattern: '[0-9]*',
    errorMessage: 'error',
    hasError: false,
    autoFocus: false,
    disabled: false
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'complete': [value: string]
    'change': [value: string]
}>()

const inputRef = ref<HTMLInputElement>()
const inputValue = ref(props.modelValue)
const currentIndex = ref(0)

// 计算属性：将输入值转换为数组
const codeArray = computed(() => {
    const value = inputValue.value || ''
    const array = value.split('').slice(0, props.length)
    // 补齐空位
    while (array.length < props.length) {
        array.push('')
    }
    return array
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
    inputValue.value = newValue
    currentIndex.value = Math.min(newValue.length, props.length)
})

// 监听输入值变化
watch(inputValue, (newValue) => {
    emit('update:modelValue', newValue)
    emit('change', newValue)

    // 当输入完成时触发complete事件
    if (newValue.length === props.length) {
        emit('complete', newValue)
    }

    // 更新当前焦点位置
    currentIndex.value = Math.min(newValue.length, props.length)
})

// 处理输入
const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    let value = target.value

    // 根据inputMode过滤输入
    if (props.inputMode === 'numeric') {
        value = value.replace(/[^0-9]/g, '')
    }

    // 限制长度
    value = value.slice(0, props.length)

    inputValue.value = value
}

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
        if (inputValue.value.length > 0) {
            inputValue.value = inputValue.value.slice(0, -1)
        }
    }
}

// 处理焦点
const handleFocus = () => {
    currentIndex.value = Math.min(inputValue.value.length, props.length)
}

// 处理失焦
const handleBlur = () => {
    currentIndex.value = -1
}

// 处理粘贴
const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault()
    const pastedData = event.clipboardData?.getData('text') || ''
    let value = pastedData.replace(/[^0-9]/g, '').slice(0, props.length)
    inputValue.value = value
}

// 点击容器聚焦输入框
const focusInput = () => {
    if (!props.disabled) {
        inputRef.value?.focus()
    }
}

// 暴露方法
const focus = () => {
    inputRef.value?.focus()
}

const blur = () => {
    inputRef.value?.blur()
}

const clear = () => {
    inputValue.value = ''
    currentIndex.value = 0
}

// 组件挂载后自动聚焦
if (props.autoFocus) {
    nextTick(() => {
        focusInput()
    })
}

defineExpose({
    focus,
    blur,
    clear
})
</script>

<style scoped>
.code-input-container {
    width: 100%;
}

.code-input-wrapper {
    display: flex;
    gap: 8px;
    justify-content: justify-between;
    align-items: center;
    position: relative;
}

.code-input-item {
    width: 48px;
    height: 48px;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: #FFFFFF;
    transition: all 0.2s ease;
    flex-shrink: 0;
    cursor: pointer;
}

.code-input-item.active {
    border-color: #6B39F4;
    box-shadow: 0 0 0 2px rgba(107, 57, 244, 0.1);
}

.code-input-item.filled {
    border-color: #6B39F4;
    background-color: #F8FAFC;
}

.code-input-item.error {
    border-color: #EF4444;
}

.code-text {
    font-size: 18px;
    font-weight: 600;
    color: #0F172A;
    line-height: 1;
}

.cursor {
    width: 2px;
    height: 20px;
    background-color: #6B39F4;
    animation: blink 1s infinite;
}

@keyframes blink {

    0%,
    50% {
        opacity: 1;
    }

    51%,
    100% {
        opacity: 0;
    }
}

.hidden-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    pointer-events: none;
}

.error-message {
    margin-top: 8px;
    font-size: 12px;
    color: #EF4444;
    text-align: center;
}

/* 禁用状态 */
.code-input-wrapper.disabled .code-input-item {
    background-color: #F1F5F9;
    border-color: #CBD5E1;
    cursor: not-allowed;
    opacity: 0.6;
}
</style>
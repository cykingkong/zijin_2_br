<template>
  <div class="keypad">
    <div class="keypad-row flex gap-8px mb-8px" v-for="row in keypadRows" :key="row.join('')">
      <div v-for="key in row" :key="key" @click="onKeyClick(key)"
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
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

// 数字键盘布局数据
const keypadRows = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["0", "delete"],
]

const displayValue = ref(props.modelValue.toString())

// 监听 modelValue 变化，更新 displayValue
watch(() => props.modelValue, (newVal) => {
  displayValue.value = newVal.toString()
})

const onKeyClick = (key) => {
  if (key === 'delete') {
    deleteLastChar()
  } else {
    appendNumber(key)
  }
}

// 数字键盘相关方法
const appendNumber = (num) => {
  if (displayValue.value === "0" && num !== ".") {
    displayValue.value = num
  } else {
    displayValue.value += num
  }
  emit('update:modelValue', displayValue.value)
}

const deleteLastChar = () => {
  if (displayValue.value.length > 0) {
    displayValue.value = displayValue.value.slice(0, -1)
    emit('update:modelValue', displayValue.value)
  }
}
</script>

<style scoped lang="less">
.keypad-btn {
  cursor: pointer;
  user-select: none;
}
</style>
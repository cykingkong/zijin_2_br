# CodeInput 验证码输入组件

一个用于验证码输入的格子间距输入框组件，支持自定义格子数量、间距和样式。

## 功能特性

- ✅ 格子间距输入框
- ✅ 支持自定义格子数量
- ✅ 自动聚焦和光标显示
- ✅ 支持数字/文本输入模式
- ✅ 错误状态显示
- ✅ 粘贴功能支持
- ✅ 响应式设计
- ✅ 完整的TypeScript支持

## 基本用法

```vue
<template>
  <CodeInput
    v-model="verificationCode"
    :length="6"
    :auto-focus="true"
    @complete="handleComplete"
  />
</template>

<script setup>
import CodeInput from '@/components/CodeInput.vue'

const verificationCode = ref('')

const handleComplete = (code) => {
  console.log('验证码输入完成:', code)
}
</script>
```

## Props

| 参数         | 类型                                    | 默认值       | 说明             |
| ------------ | --------------------------------------- | ------------ | ---------------- |
| modelValue   | string                                  | ''           | 输入值           |
| length       | number                                  | 6            | 格子数量         |
| inputMode    | 'text' \| 'numeric' \| 'tel' \| 'email' | 'numeric'    | 输入模式         |
| pattern      | string                                  | '[0-9]*'     | 输入模式匹配规则 |
| errorMessage | string                                  | '验证码错误' | 错误提示信息     |
| hasError     | boolean                                 | false        | 是否显示错误状态 |
| autoFocus    | boolean                                 | false        | 是否自动聚焦     |
| disabled     | boolean                                 | false        | 是否禁用         |

## Events

| 事件名            | 参数            | 说明             |
| ----------------- | --------------- | ---------------- |
| update:modelValue | (value: string) | 输入值变化时触发 |
| complete          | (value: string) | 输入完成时触发   |
| change            | (value: string) | 输入值变化时触发 |

## Methods

| 方法名 | 参数 | 说明       |
| ------ | ---- | ---------- |
| focus  | -    | 聚焦输入框 |
| blur   | -    | 失焦输入框 |
| clear  | -    | 清空输入值 |

## 样式定制

组件使用CSS变量，可以通过以下方式定制样式：

```css
.code-input-item {
  --code-input-width: 48px;
  --code-input-height: 56px;
  --code-input-gap: 12px;
  --code-input-border-color: #E2E8F0;
  --code-input-active-color: #6B39F4;
  --code-input-error-color: #EF4444;
}
```

## 完整示例

```vue
<template>
  <div class="verification-section">
    <CodeInput
      v-model="verificationCode"
      :length="6"
      :auto-focus="true"
      :has-error="codeError"
      :error-message="codeErrorMessage"
      @complete="handleCodeComplete"
      @change="handleCodeChange"
    />
    
    <div class="resend-section">
      <span v-if="!countdownActive" @click="resendCode">
        重新发送
      </span>
      <span v-else>
        重新发送 ({{ countdown }}s)
      </span>
    </div>
    
    <van-button 
      :disabled="verificationCode.length !== 6"
      @click="verifyCode"
    >
      验证
    </van-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CodeInput from '@/components/CodeInput.vue'

const verificationCode = ref('')
const codeError = ref(false)
const codeErrorMessage = ref('')
const countdown = ref(0)
const countdownActive = ref(false)

const handleCodeComplete = (code) => {
  console.log('验证码完成:', code)
  // 自动验证逻辑
}

const handleCodeChange = (code) => {
  verificationCode.value = code
  codeError.value = false
}

const resendCode = async () => {
  // 发送验证码逻辑
}

const verifyCode = async () => {
  // 验证逻辑
}
</script>
``` 
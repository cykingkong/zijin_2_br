<template>
    <div class="input-com">
        <div class="label-box w-full flex gap-[8px] items-center">
            <slot name="label">
                <div class="label" :class="[{ require: props.require }, 'flex items-center gap-4']">
                    {{ label }}
                </div>
                <div class="label-tips font-size-12 text-blueGray">
                    {{ labelTips }}
                </div>
            </slot>

        </div>
        <div class="input-box h-[56px] w-full rounded-[12px] px-10 flex flex-items-center mt-12"
            :class="{ 'focused': isFocused }">
            <div class="max-input w-full  font-size-16 relative flex items-center" v-if="type == 'text'">
                <slot name="picker"></slot>
                <input type="text" :placeholder="placeholder" :disabled="onlyRead" :value="value"
                    class="w-full   font-size-16" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
                    v-if="inputType == 'text'" />
                <input type="password" :placeholder="placeholder" :disabled="onlyRead" :value="value"
                    class="w-full   font-size-16" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
                    v-if="inputType == 'password'" />
                <input type="number" :placeholder="placeholder" :disabled="onlyRead" :value="value"
                    class="w-full   font-size-16" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
                    v-if="inputType == 'number'" />
                <input type="search" :placeholder="placeholder" :disabled="onlyRead" :value="value"
                    class="w-full   font-size-16" @input="handleInput" @focus="handleFocus" @blur="handleBlur"
                    v-if="inputType == 'search'" />
                <slot name="sendCode">
                    <van-icon name="clear" class="absolute color-blueGray closeIcon"
                        v-if="!onlyRead && (inputType == 'text' || inputType == 'password') && value != ''"
                        @click="$emit('update:value', '')" />
                </slot>
            </div>

            <slot></slot>

        </div>
        <!-- <div class="tips font-size-12 text-#000 mt-10"> {{ tips }}</div> -->
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const props = defineProps({
    label: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: "text"
    },
    inputType: {
        type: String,
        default: "text"
    },
    placeholder: {
        type: String,
        default: ""
    },
    value: {
        type: String,
        default: ""
    },
    require: {
        type: Boolean,
        default: false
    },
    onlyRead: {
        type: Boolean,
        default: false
    },
    tips: {
        type: String,
        default: ""
    },
    labelTips: {
        type: String,
        default: ""
    },
      formatter: {
        type: Function,
        default: null
    }
})

const emit = defineEmits(['update:value']);

// 跟踪输入框是否被选中
const isFocused = ref(false);

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
     let val = target.value;
     // 如果父组件传了 formatter，就用 formatter 处理值
    if (props.formatter) {
        val = props.formatter(val);
    }
    emit('update:value', val);
}

const handleFocus = () => {
    isFocused.value = true;
}

const handleBlur = () => {
    isFocused.value = false;
}

</script>
<style lang="less" scoped>
.input-com {
    color: #f5f5f5;
}

.label {
    color: #f5f5f5;
    font-size: 14px;
    font-weight: 600;
}

.label-tips {
    color: #6b6b6b;
}

.input-box {
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.03);
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.04),
        inset 0 -8px 20px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;

    &.focused {
        border-color: rgba(124, 255, 178, 0.35);
        box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 0.04),
            inset 0 -8px 20px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(124, 255, 178, 0.08),
            0 0 18px rgba(124, 255, 178, 0.12);
    }
}

.require {
    &::before {
        content: "*";
        color: #FF4E4E;
    }
}

.closeIcon {
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b6b6b;
}

.max-input {
    input {
        border: none;
        background: transparent;
        color: #f5f5f5;

        &::placeholder {
            color: #6b6b6b;
            font-size: 14px;
            font-weight: 400;
        }

        &::-webkit-input-placeholder {
            color: #6b6b6b;
            font-size: 14px;
            font-weight: 400;
        }

        &::-moz-placeholder {
            color: #6b6b6b;
            font-size: 14px;
            font-weight: 400;
        }

        &:-ms-input-placeholder {
            color: #6b6b6b;
            font-size: 14px;
            font-weight: 400;
        }
    }
}
</style>

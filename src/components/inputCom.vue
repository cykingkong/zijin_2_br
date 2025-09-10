<template>
    <div class="input-com">
        <!-- <div class="label-box wfull flex gap-8px items-center">
            <div class="label" :class="[{ require: props.require }, 'flex items-center gap-4']">
                {{ label }}
            </div>
            <div class="label-tips font-size-12 text-blueGray">
                {{ labelTips }}
            </div>
        </div> -->
        <div class="input-box h-56px w-full rounded-12px py-12  px-10  flex flex-items-center mt-12"
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
                <slot name="sendCode">
                    <van-icon name="clear" class="absolute color-blueGray closeIcon"
                        v-if="!onlyRead && (inputType == 'text' || inputType == 'password') && value != ''"
                        @click="$emit('update:value', '')" />
                </slot>
            </div>

            <slot></slot>

        </div>
        <div class="tips font-size-12 text-#000 mt-10"> {{ tips }}</div>
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
    }
})

const emit = defineEmits(['update:value']);

// 跟踪输入框是否被选中
const isFocused = ref(false);

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:value', target.value);
}

const handleFocus = () => {
    isFocused.value = true;
}

const handleBlur = () => {
    isFocused.value = false;
}

</script>
<style lang="less" scoped>
.input-box {
    background: #F8F9FD;
    border: 1px solid transparent;
    transition: border-color 0.3s ease;

    &.focused {
        border-color: #6B39F4;
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
}

.max-input {
    input {
        background: #F8F9FD;
        border: none;

        &::placeholder {
            color: #999999;
            font-size: 14px;
            font-weight: 400;
        }

        &::-webkit-input-placeholder {
            color: #999999;
            font-size: 14px;
            font-weight: 400;
        }

        &::-moz-placeholder {
            color: #999999;
            font-size: 14px;
            font-weight: 400;
        }

        &:-ms-input-placeholder {
            color: #999999;
            font-size: 14px;
            font-weight: 400;
        }
    }
}
</style>

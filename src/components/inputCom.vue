<template>
    <div class="input-com">
        <div class="label-box wfull flex gap-8px items-center">
            <div class="label" :class="[{ require: props.require }, 'flex items-center gap-4']">
                {{ label }}
            </div>
            <div class="label-tips font-size-12 text-blueGray">
                {{ labelTips }}
            </div>
        </div>
        <div class="input-box w-full rounded-4px py-12  px-10  flex flex-items-center mt-12">
            <div class="max-input w-full text-white font-size-16 relative flex" v-if="type == 'text'">
                <slot name="picker"></slot>

                <input type="text" :placeholder="placeholder" :disabled="onlyRead" :value="value"
                    class="w-full  text-white font-size-16" @input="$emit('update:value', $event.target.value)"
                    v-if="inputType == 'text'" />
                <input type="password" :placeholder="placeholder" :disabled="onlyRead" :value="value"
                    class="w-full  text-white font-size-16" @input="$emit('update:value', $event.target.value)"
                    v-if="inputType == 'password'" />
                <slot name="sendCode">
                    <van-icon name="clear" class="absolute color-blueGray closeIcon" v-if="!onlyRead && type == 'text'"
                        @click="$emit('update:value', '')" />
                </slot>
            </div>

            <slot></slot>

        </div>
        <div class="tips font-size-12 text-blueGray mt-10"> {{ tips }}</div>
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


</script>
<style lang="less" scoped>
.input-box {
    background: #27293B;
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
        background: #27293B;
        border: none;
    }
}
</style>

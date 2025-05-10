<template>
    <van-popup v-model:show="showPicker" destroy-on-close round :position="'bottom'" :safe-area-inset-bottom="true">
        <div class="w-full  p-12 flex flex-col gap-12">
            <div class="l flex flex-[2] flex-shrink-0 items-center gap-6">
                <div class="logo w-25 h-25 rounded-full overflow-hidden ">
                    <img :src="item.assetInfo.logo" alt="" v-if="item.assetInfo" class="w-full h-full">

                </div>
                <div class="name font-size-14">{{ item.name }}</div>
            </div>
            <inputCom :label="popType == 'ipo' ? '订阅数量' : '卖出数量'"
                :placeholder="popType == 'ipo' ? '请输入购入数量' : '请输入卖出数量'" v-model:value="form.number"
                v-if="popType == 'ipo'">

            </inputCom>
            <div class="sell-tips font-size-18 font-500" v-if="popType == 'order'">ipo将全部售出，请确认!</div>
            <div class="w-full flex gap-12">
                <div class="btn-box flex-1">
                    <van-button type="default" class="h-40!" plain block @click="showPicker = false"
                        v-if="itemType == 'order'">取消</van-button>
                    <van-button type="default" class="h-40!" plain block @click="confirm" v-else>订阅</van-button>
                </div>
                <div class="btn-box flex-1">
                    <van-button type="primary" class="h-40!" block @click="confirm"
                        v-if="itemType == 'order'">确认</van-button>
                    <van-button type="primary" class="h-40!" block @click="confirmAll" v-else>订阅全部</van-button>

                </div>
            </div>
        </div>
    </van-popup>





</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue"
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    },
    popType: {
        type: String,
        default: ''
    }

})
const emits = defineEmits(['onConfirm'])
const form = reactive({
    id: '',
    number: ''
})
const showPicker = ref(false)
const show = (val: boolean) => {
    if (val) form.number = ''
    showPicker.value = val
}

const confirm = () => {
    form.ipoId = props.item.ipoId
    let params = {
        ...form,
        type: props.popType
    }
    emits('onConfirm', params)
}
const confirmAll = () => {
    let params = {
        ipoId: props.item.ipoId,
        type: props.popType,
        full: true,
    }
    emits('onConfirm', params)
}
defineExpose({
    show
})
</script>
<style lang="less" scoped></style>

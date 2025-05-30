<template>
    <van-popup v-model:show="showPicker" destroy-on-close round :position="'bottom'" :safe-area-inset-bottom="true">
        <div class="w-full  p-12 flex flex-col gap-12">
            <div class="l flex flex-[2] flex-shrink-0 items-center gap-6">
                <div class="logo w-25 h-25 rounded-full overflow-hidden ">
                    <img :src="item.tradingInfo.baseAssetInfo.logo" alt=""
                        v-if="item.tradingInfo && item.tradingInfo.baseAssetInfo" class="w-full h-full">
                </div>
                <div class="name font-size-14">{{ item.tradingInfo.baseAssetInfo ?
                    item.tradingInfo.baseAssetInfo.symbol : '-' }}</div>
            </div>
            <inputCom :label="popType == 'discount' ? '购入数量' : '卖出数量'"
                :placeholder="popType == 'discount' ? '请输入购入数量' : '请输入卖出数量'" v-model:value="form.number" :tips="tips"
                v-if="popType == 'discount'">

            </inputCom>
            <div class="sell-tips font-size-18 font-500" v-if="popType == 'order'">股息将全部售出，请确认!</div>
            <div class="w-full flex gap-12">
                <div class="btn-box flex-1">
                    <van-button type="default" class="h-40!" plain block @click="showPicker = false">取消</van-button>
                </div>
                <div class="btn-box flex-1">
                    <van-button type="primary" class="h-40!" block @click="confirm">确认</van-button>

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
const tips = ref('')
watch(() => props.item, (newVal) => {
    if (newVal) {
        tips.value = `最小购买数量：${newVal.min}`
    }
}, {
    immediate: true
})
const showPicker = ref(false)
const show = (val: boolean) => {
    if (val) form.number = ''
    showPicker.value = val
}

const confirm = () => {
    if (form.number == '' && props.popType == 'discount') {
        showToast('请输入数量')
        return
    }
    form.id = props.item.id
    let params = {
        ...form,
        type: props.popType
    }
    emits('onConfirm', params)
}
defineExpose({
    show
})
</script>
<style lang="less" scoped></style>

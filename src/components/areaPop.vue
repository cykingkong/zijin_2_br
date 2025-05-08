<template>
    <div class="slidePop">
        <van-popup position="bottom" round v-model:show="show">
            <div class="areas-pop-content p-24">
                <div class="areas-content overflow-auto wfull flex flex-col gap-4 max-h-[70vh] pb-70 ">

                    <van-radio-group v-model="country_id">
                        <van-radio shape="dot" class="mb-24" :name="item.country_id" v-for="(item, index) in areaArr"
                            :key="index">{{
                                item.area_code }} {{
                                item.name_cn }}</van-radio>
                    </van-radio-group>
                </div>
                <div class="bottom-btn wfull h100 px-24 pt-24 fixed bottom-0 left-0">
                    <van-button type="primary" block @click="submit">确定</van-button>

                </div>
            </div>

        </van-popup>



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import areas from '@/utils/areas'

const show = ref(false)
const areaArr = computed(() => { return areas })
const checked = ref(1)
const props = defineProps({
    country_id: {
        type: Number,
        default: 25
    }
})
const emits = defineEmits(['popOnOk'])
const country_id = toRef(props.country_id)
watch(() => props.country_id, (newVal) => {
    console.log(newVal)
    let area = areaArr.value.find((item: any) => item.country_id == newVal)
    console.log(area)
    setTimeout(() => {
        emits('popOnOk', area)
    }, 80)
}, {
    immediate: true
})
const popShow = async () => {
    console.log(areaArr)
    show.value = true;
}
const submit = () => {
    let area = areaArr.value.find((item: any) => item.country_id == country_id.value)
    console.log(area)
    emits('popOnOk', area)
    show.value = false;

}
defineExpose({
    popShow

})
</script>
<style lang="less" scoped>
.bottom-btn {
    background-color: var(--van-popup-background);
}
</style>

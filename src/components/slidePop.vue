<template>
    <div class="slidePop">
        <van-popup position="center" v-model:show="show">
            <div class="slidePop-content p-12">
                <div class="slidePop-content-title">

                    <div class="slidePop-content-title-right">
                        <div class="slidePop-content-title-right-text">
                            <div class="slidePop-content-title-right-text-title font-size-14">
                                <span>滑动验证</span>
                            </div>
                            <div class="slidePop-content-title-right-text-content font-size-12 my-12">
                                <span>拖动滑块完成拼图</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="slidePop-content-body">
                    <div class="slidePop-content-body-left relative">
                        <div class="slidePop-content-body-left-img">
                            <img :src="slideData.imageBase64" alt="">
                        </div>
                        <div class="thumb-img absolute" :style="`top:${slideData.dots.y}px;left:${thumbLeft}px`">
                            <img :src="slideData.thumbBase64" alt="">
                        </div>
                    </div>
                </div>
                <div class="slide-box px-12">
                    <van-slider v-model="thumbLeft" @change="onChange" :max="300" class="mt-24 mb-42" />

                </div>
                <van-button type="primary" block @click="submit">确定</van-button>
            </div>

        </van-popup>



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { getCaptchaSlide, sendCode } from "@/api/user";
const show = ref(false)
const thumbLeft = ref(0)
const slideData = ref<any>({
    "dots": {
        x:'',
        y:''
    },
    "imageBase64": "",
    "thumbBase64": "",
    "key": '',
    verifyType: '2'
})
const getSlide = async () => {
    try {
        const res = await getCaptchaSlide()
        slideData.value = res.data
    } catch {

    }
}
const onChange = ()=>{}
const popShow = async () => {
    await getSlide()

    show.value = true;

}
const submit = async () => {
    let dot = { ...slideData.value.dots }
    dot.x = thumbLeft.value
    const { data } = await sendCode({
        dot,
        phone: '',
        key: slideData.value.key,
        type: 'phone'
    })
}
defineExpose({
    popShow

})
</script>
<style lang="less" scoped></style>

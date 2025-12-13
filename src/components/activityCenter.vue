<template>
    <div class="item-box w-full px-[24px] py-[24px]  flex overflow-x-auto gap-[20px]  min-h-[335px]">
        <div class="item w-240 p-[7px] rounded-[16px] bg-[#fff] flex-shrink-0 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
            v-for="(item, index) in arr" :key="index">
            <div class="image-box w-full rounded-[16px] bg-[#f5f5f5] min-h-[150px]">
                <img :src="item?.article_image" alt="" class="w-full h-full  min-h-[150px] object-cover rounded-[16px]">
            </div>
            <div class="info pl-4 my-12">
                <div class="title text-[16px] font-bold text-[#333] mb-4">{{ item?.title }}</div>
                <div class="tips text-[14px] text-[#666]">{{ item?.tips }}</div>
            </div>
            <div class="avatar-box relative flex items-center justify-center h-[30px]">
                <div class="avatar w-[30px] h-[30px] border-[1px] border-[#fff] rounded-full bg-[#FF4E4E] relative">
                </div>
                <div
                    class="avatar w-[30px] h-[30px] border-[1px] border-[#fff] rounded-full bg-[blue] -ml-[10px] relative ">
                </div>
                <div
                    class="avatar w-[30px] h-[30px] border-[1px] border-[#fff] rounded-full bg-[green] -ml-[10px] relative ">
                </div>
            </div>
            <div class="join-btn w-full rounded-[16px] mt-[24px] text-[#00334E] text-[16px] font-bold text-align-center h-[44px] flex items-center justify-center"
                @click="handleClickActivity(item)">
                {{ t('Claim Coupon') }}
            </div>
        </div>
    </div>
</template>
<script setup>
import { receiveCoupon } from '@/api/product'

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
    arr: {
        type: Array,
        default: [],
    },
});

const gridList = ref([]);
const emits = defineEmits(["clickItem"]);
const handleClickItem = (k) => {
    emits("clickItem", k);
};
const handleClickActivity = async (item) => {
    if (item) {
        const res = await receiveCoupon({
            couponId: item?.couponId
        })
        if (res.code == 200) {
            showSuccessToast('Claim Coupon Success')
        }

    }
}
</script>
<style lang="less">
.avatar {
    border: 4px solid #fff;
}

.join-btn {
    border: 1px solid #00334E
}
</style>

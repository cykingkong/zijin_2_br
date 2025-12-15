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
                <div
                    class="avatar w-[30px] h-[30px] border-[1px] border-[#fff] rounded-full bg-[#FF4E4E] relative overflow-hidden">
                    <img :src="getRandomAvatar()" alt="" class="w-full h-full object-cover">
                </div>
                <div
                    class="avatar w-[30px] h-[30px] border-[1px] border-[#fff] rounded-full bg-[blue] -ml-[10px] relative  overflow-hidden">
                    <img :src="getRandomAvatar()" alt="" class="w-full h-full object-cover">
                </div>
                <div
                    class="avatar w-[30px] h-[30px] border-[1px] border-[#fff] rounded-full bg-[green] -ml-[10px] relative overflow-hidden">
                    <img :src="getRandomAvatar()" alt="" class="w-full h-full object-cover">
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
import avatar1 from '@/assets/avatar/1.jpg'
import avatar2 from '@/assets/avatar/2.jpg'
import avatar3 from '@/assets/avatar/3.jpg'
import avatar4 from '@/assets/avatar/4.jpg'
import avatar5 from '@/assets/avatar/5.jpg'
import avatar6 from '@/assets/avatar/6.jpg'
import avatar7 from '@/assets/avatar/7.jpg'
import avatar8 from '@/assets/avatar/8.jpg'
import avatar9 from '@/assets/avatar/9.jpg'
import avatar10 from '@/assets/avatar/10.jpg'
import avatar11 from '@/assets/avatar/11.jpg'
import avatar12 from '@/assets/avatar/12.jpg'
import avatar13 from '@/assets/avatar/13.jpg'
import avatar14 from '@/assets/avatar/14.jpg'
import avatar15 from '@/assets/avatar/15.jpg'



import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
    arr: {
        type: Array,
        default: [],
    },
});
const avatarList = ref([avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10, avatar11, avatar12, avatar13, avatar14, avatar15])
const gridList = ref([]);
const emits = defineEmits(["clickItem"]);
const handleClickItem = (k) => {
    emits("clickItem", k);
};
const getRandomAvatar = () => {
    const index = Math.floor(Math.random() * avatarList.value.length)
    return avatarList.value[index]
}
const handleClickActivity = async (item) => {
    if (item) {
        localStorage.setItem('activityDetail', JSON.stringify(item))


        router.push({
            path: '/activityDetail',
        })
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

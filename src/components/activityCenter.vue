<template>
    <div class="item-box  px-24 py-12 flex flex-col gap-12">
        <div class="news-item w-full rounded-[16px]  min-h-[120px] flex gap-[12px]   p-12 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
            v-for="(item, index) in arr" :key="index">
            <div class="img w-96 h-96 flex-shrink-0 bg-[#F5F5F5] overflow-hidden rounded-[16px]">
                <img :src="item.article_image" alt="" v-if="item && item.article_image"
                    class="w-full h-full object-cover rounded-[16px] ">
            </div>
            <div class="info w-full color-[#111827] font-bold flex flex-col justify-between">
                {{ item.title }}
                <div class="w-full flex justify-end">
                    <div @click="handleClickActivity(item)"
                        class="receive-btn border b-solid b-[#1b1b1b] rounded-[16px] text-[#1b1b1b] text-[12px] min-w-[86px] h-37 text-center p-6 line-height-[24px]">
                        {{
                            t('Receive')
                        }}
                    </div>
                </div>

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
const router = useRouter()
const handleClickActivity = async (item) => {
    if (item) {
        localStorage.setItem('activityDetail', JSON.stringify(item))


        router.push({
            path: '/activityDetail',
        })
        // const res = await receiveCoupon({
        //     couponId: item?.couponId
        // })
        // if (res.code == 200) {
        //     showSuccessToast('Claim Coupon Success')
        // }

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

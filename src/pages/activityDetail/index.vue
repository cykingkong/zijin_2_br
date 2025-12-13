<template>
    <div class="activity-detail w-full">
        <div class="close-button h-[56px] w-full flex items-center px-[24px] justify-between">
            <svg class="w-32 h-32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"
                @click="handleClose">
                <path d="M6.66663 16H25.3333" stroke="#111827" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                <path d="M6.66663 16L12 21.3333" stroke="#111827" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                <path d="M6.66663 16L12 10.6667" stroke="#111827" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </div>
        <div class="detail-image w-full px-[24px]">
            <div class="image bg-[#f5f5f5] rounded-[16px] min-h-[240px] w-full mb-16">
                <img :src="info?.image" alt="" class="w-full h-full object-cover rounded-[16px]">
            </div>
            <div class="title text-[16px] font-bold text-[#333] mb-31">{{ info?.title }}</div>
            <div class="w-full">
                <div class="w-full" v-html="info?.content"></div>
            </div>
        </div>
        <BottomButton :color="'#FEC600'" :button-text="t('Claim Coupon')" @click="handleClickClaimCoupon">
        </BottomButton>
    </div>
</template>
<script setup lang="ts">
import local from '@/utils/local'
import { receiveCoupon } from '@/api/product'
import { showSuccessToast } from 'vant'
const { t } = useI18n()
const router = useRouter()
const handleClose = () => {
    router.back()
}
const info = ref<any>()

const handleClickClaimCoupon = async () => {
    if (info.value) {
        const res = await receiveCoupon({
            couponId: info.value?.couponId
        })
        if (res.code == 200) {
            showSuccessToast('Claim Coupon Success')
        }

    }
}

onMounted(() => {
    const item = local.getlocal('activityDetail')
    if (item) {
        document.title = item.title
        info.value = item
    }
})
</script>
<route lang="json5">
{
  name: 'activityDetail',
  meta: {
    title: 'activityDetail',
    i18n: 'activityDetail'
  },
}
</route>
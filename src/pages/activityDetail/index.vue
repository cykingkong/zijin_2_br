<template>
    <div class="activity-detail w-full pb-140">
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

            <div class="title text-[16px] font-bold text-[#333] mb-31">{{ info?.title }}</div>
            <div class="w-full">
                <div class="w-full" v-html="info?.content"></div>
            </div>
        </div>

    </div>
</template>
<script setup lang="ts">
import local from '@/utils/local'
import { activityDetail } from '@/api/image'
import { showSuccessToast } from 'vant'
import { optimizeRichText } from '@/utils/richText';

const { t } = useI18n()
const router = useRouter()
const handleClose = () => {
    if (window.history.state.back) history.back();
    else router.replace("/");
}
const info = ref<any>({ couponId: null })

const getActivityDetail = async (id: any) => {



    const res = await activityDetail({
        id
    })
    if (res.code == 200) {
        showSuccessToast('Claim Coupon Success')
        info.value = res.data
        info.value.content = optimizeRichText(info.value.content)
    }


}
const route = useRoute()
onMounted(() => {
    if (route.query.id) {
        getActivityDetail(route.query.id)
    }

})
</script>
<route lang="json5">
{
  name: 'activityDetail',
  meta: {
    title: 'activityDetail',
    i18n: 'Detalhe da atividade'
  },
}
</route>
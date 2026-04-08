<template>
    <div class="activity-detail w-full pb-140">
        <div class="close-button h-[56px] w-full flex items-center px-[20px] justify-between">
            <svg class="w-32 h-32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"
                @click="handleClose">
                <path d="M6.66663 16H25.3333" stroke="#F5F5F5" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                <path d="M6.66663 16L12 21.3333" stroke="#F5F5F5" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                <path d="M6.66663 16L12 10.6667" stroke="#F5F5F5" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </div>
        <div class="detail-image w-full px-[20px]">

            <div class="detail-shell">
                <div class="title text-[18px] font-bold text-[#F5F5F5] mb-[18px]">{{ info?.title }}</div>
                <div class="detail-content w-full" v-html="info?.content"></div>
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

<style scoped>
.activity-detail {
    min-height: 100vh;
    background:
        radial-gradient(circle at top, rgba(124, 255, 178, 0.16), transparent 32%),
        linear-gradient(180deg, #050505 0%, #000000 100%);
    color: #f5f5f5;
}

.close-button {
    padding-top: 18px;
}

.detail-shell {
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 24px;
    background: linear-gradient(180deg, rgba(17, 17, 17, 0.96) 0%, rgba(8, 8, 8, 0.96) 100%);
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.04),
        inset 0 -8px 20px rgba(0, 0, 0, 0.45),
        0 8px 24px rgba(0, 0, 0, 0.35);
    padding: 20px 18px;
}

.detail-content {
    color: #a3a3a3;
    line-height: 1.7;
}

.detail-content :deep(*) {
    color: inherit;
}

.detail-content :deep(img) {
    max-width: 100%;
    border-radius: 16px;
}
</style>
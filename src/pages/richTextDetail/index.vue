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
            <div class="image bg-[#f5f5f5] rounded-[16px]  w-full mb-16">
                <img :src="info?.article_image" alt="" class="w-full block h-full object-cover rounded-[16px]">
            </div>
            <div class="title text-[16px] font-bold text-[#333] mb-31">{{ info?.title }}</div>
            <div class="w-full">
                <div class="w-full" v-html="info?.content"></div>
            </div>
        </div>

    </div>
</template>
<script setup lang="ts">
import local from '@/utils/local'
import { receiveCoupon } from '@/api/product'
import { showSuccessToast } from 'vant'
import { optimizeRichText } from '@/utils/richText';
import { articleInfo } from '@/api/market'

const { t } = useI18n()
const router = useRouter()
const handleClose = () => {
    if (window.history.state.back) history.back();
    else router.replace("/");
}
const info = ref<any>({ couponId: null })

const fetchArticleInfo = async () => {
    const res = await articleInfo({
        articleKey: type.value
    })
    if (res.code == 200) {
        info.value = res.data
        info.value.content = optimizeRichText(info.value.content)
    }
}
const type = ref('')
const route = useRoute()
onMounted(() => {
    if (route.query.type) {
        type.value = route.query.type as string;
        fetchArticleInfo()
    }

})
</script>
<route lang="json5">
{
  name: 'richTextDetail',
  meta: {
    title: 'richTextDetail',
    i18n: 'RichTextDetail'
  },
}
</route>
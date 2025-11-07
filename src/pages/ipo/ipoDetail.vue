<template>
    <div class="px-12 pt-12 ipoDetail min-h-100vh">
        <div class="ipoName font-bold text-24">{{ ipoInfo.name }}</div>
        <div v-html="ipoInfo.content" v-if="ipoInfo.content" class="h-400px overflow-y-auto"></div>

        <div class="ipoDetailInfo mt-64px">
            <div class="title color-#0F172A mb-8px font-bold">
                {{ t('Time') }}
            </div>
            <div class="li h-48px w-full flex items-center justify-between gap-12px">
                <div class="label color-#64748B">{{ t('Subscription Period') }}</div>
                <div class="value color-#0F172A">{{ipoInfo.sub_time_begin}} ~ {{ ipoInfo.sub_time_end }}</div>
            </div> 
             <div class="li h-48px w-full flex items-center justify-between gap-12px">
                <div class="label color-#64748B">{{ t('Allotment Date') }}</div>
                             <div class="value color-#0F172A">{{ipoInfo.won_time_begin}} ~ {{ ipoInfo.won_time_end }}</div>

            </div>
              <div class="li h-48px w-full flex items-center justify-between gap-12px">
                <div class="label color-#64748B">{{ t('Listing Date') }}</div>
                <div class="value color-#0F172A">{{ ipoInfo.market_time }}</div>
            </div>
        </div>
    <BottomButton :button-text="t(`Reserve`)" :color="ipoInfo.status == 1 ? '#6B39F4' : '#ccc'" @click="onConfirm" />

    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const { proxy } = getCurrentInstance()
import BottomButton from "@/components/bottom-button.vue";
import dayjs from "dayjs";
import { ipoProductInfo,ipoSub } from "@/api/ipo";
import { navTitleStore } from "@/stores";
const navStore = navTitleStore()
const { t } = useI18n()

const ipoInfo = ref<any>({
    content:'',

})
const getIpoInfo = async (id) => {
    const res = await ipoProductInfo({ 'ipo_id': id })
    // navStore.setNavTitle(res.data.name || '')
    // route.meta.title = res.data.name // 设置你需要的标题

    ipoInfo.value = res.data
    // 将文字颜色color: #000000 全部改为 color: #ffffff
    ipoInfo.value.content = res.data.content.replace(/color: #000/g, 'color: #ffffff')
    

    // ipoInfo.value.content = res.data.content.replace(/<img/g, '<img style="max-width:100%"')
}
const router = useRouter()
const onConfirm = async() => {
    if(ipoInfo.value.status != 1){
     
        return
    }
    const {data,code} = await ipoSub({
    type:1,
    number:0,
    'ipo_id':ipoInfo.value.id
  })
  if(code == 200){
    showSuccessToast({
      message:t('Subscription successful')
    })
    router.push({
        path:'/ipo',
        query:{
            tab:1
        },replace:true
    })
  }
}
const route = useRoute()
onMounted(() => {
    if (route.query.id) {
        getIpoInfo(route.query.id)
    }
})




</script>
<route lang="json5">
    {
    name:'ipoDetail',
      meta: {
        title: '',
      },
    }
</route>
<style lang="less" scoped>
.ipoDetail {
    padding-bottom: calc(env(safe-area-inset-bottom) + 120px);
}
.value{
    text-align: right;
}
</style>

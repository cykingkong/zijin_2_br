<template>
    <div class="px-12 pt-12 ipoDetail">
        <ipo-item-top :item="ipoInfo"></ipo-item-top>
        <div v-html="ipoInfo.content" class="py-12"></div>
        <ipoItemInfo :item="ipoInfo"></ipoItemInfo>

    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const { proxy } = getCurrentInstance()
import ipoItemTop from "./component/ipo-item-top.vue";
import ipoItemInfo from "./component/ipo-item-info.vue";
import dayjs from "dayjs";
import { ipoProductInfo } from "@/api/ipo";
import { navTitleStore } from "@/stores";
const navStore = navTitleStore()
const ipoInfo = ref({})
const getIpoInfo = async (id) => {
    const res = await ipoProductInfo({ ipoId: id })
    // navStore.setNavTitle(res.data.name || '')
    // route.meta.title = res.data.name // 设置你需要的标题

    ipoInfo.value = res.data
    // 将文字颜色color: #000000 全部改为 color: #ffffff
    ipoInfo.value.content = res.data.content.replace(/color: #000/g, 'color: #ffffff')
    ipoInfo.value.formatSubTimeBegin = dayjs(res.data.subTimeBegin).format('MM/DD/YYYY');
    ipoInfo.value.formatSubTimeEnd = dayjs(res.data.subTimeEnd).format('MM/DD/YYYY');
    ipoInfo.value.formatWonTimeBegin = dayjs(res.data.wonTimeBegin).format('MM/DD/YYYY')
    ipoInfo.value.formatWonTimeEnd = dayjs(res.data.wonTimeEnd).format('MM/DD/YYYY');
    ipoInfo.value.formatMarketTime = dayjs(res.data.marketTime).format('MM/DD/YYYY');
    console.log(ipoInfo.value.content.substring(0, 600), 'ipoInfoval')
    // ipoInfo.value.content = res.data.content.replace(/<img/g, '<img style="max-width:100%"')
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
    padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
}
</style>

<template>
    <div class="community p-16  flex flex-col gap-16">
        <item v-for="item in logList" :key="item.id" :arr="item.pictureList" :item="item" />
        <empty v-if="logList?.length == 0" :no-tips="true"></empty>
        <LoadMore :status="listStatus" @load-more="loadMore" />

        <!-- <BottomButton color="#1b1b1b" :button-text="t('Add Community')" @click="toAdd"></BottomButton> -->
    </div>
</template>
<script setup>
import item from './com/item.vue';
import { list } from '@/api/dyname'
const { t } = useI18n();
const logList = ref([])
const listStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const page = reactive({
    pageIndex: 1,
    pageSize: 10,
})
const router = useRouter()
const toAdd = () => {
    router.push({
        name: 'addCommunity',
    })
}
const getList = async () => {
    try {
        const { data, code } = await list({
            ...page
        })
        if (code === 200) {
            if (page.pageIndex == 1) {
                logList.value = data.rows.map((item) => ({
                    ...item,
                    pictureList: item.image.split(',')
                }));
                console.log(logList.value)

            } else {
                logList.value = [...logList.value, ...data.rows.map((item) => ({
                    ...item,
                    pictureList: item.image.split(',')
                }))]
            }
            if (data.length >= data.total) {
                listStatus.value = 3
            }
            if (!data.row || data.rows.length == 0) {
                listStatus.value = 3
                return
            }
            listStatus.value = 2
        }
    } catch (err) {
        console.log(err, '获取动态列表失败')
    }
}
onMounted(() => {
    getList()
})
</script>
<style scoped>
.community {
    padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
}
</style>
<route lang="json5">
{
  name: 'community',
  meta: {
    i18n: 'Community'
  },
}
</route>
<template>
    <div class="community p-16  flex flex-col gap-16">
        <!-- <item v-for="(item ,index) in logList" :key="index" :arr="item.pictureList || []" :item="item" /> -->
          <div class="item w-full b border b-solid b-[#F0F0F0] p-16 rounded-16" v-for="(item ,index) in logList" :key="index">

        <div class="content mb-12">
            <div class="text-[#888888] text-16">{{ item?.content || '' }} </div>
        </div>
        <div class="picture-box">
            <!-- 单张图片 -->
            <div class="w-full min-h-[120px] rounded-[16px] overflow-hidden bg-[#f5f5f5]" v-if="item.pictureList.length == 1"
                v-for="(item, index) in item.pictureList" :key="index">
                <van-image :src="item" fit="cover" class="w-full h-full object-cover" @click="showImagePreview(index)"></van-image>
            </div>
            <!-- 两张图片 -->
            <div class="w-full grid grid-cols-3 gap-8" v-if="[2, 3].includes(item.pictureList.length)">
                <div class="w-full h-120 rounded-[16px] overflow-hidden bg-[#f5f5f5] flex-1"
                    v-for="(item, index) in item.pictureList" :key="index">
                    <van-image :src="item" fit="cover" class="w-full h-full object-cover"
                        @click="showImagePreview(index)"></van-image>
                </div>


            </div>
            <!-- 四张图片 -->
            <div class="w-full grid grid-cols-2 gap-8" v-if="item.pictureList.length == 4">
                <div class="w-full h-120 rounded-[16px] overflow-hidden bg-[#f5f5f5] flex-1"
                    v-for="(item, index) in item.pictureList" :key="index">
                    <van-image :src="item" fit="cover" class="w-full h-full object-cover"
                        @click="showImagePreview(index)"></van-image>
                </div>

                <!-- <div class="w-full h-120 rounded-[16px] overflow-hidden bg-[#f5f5f5] flex-1"></div> -->
            </div>
        </div>
          <div class="info w-full flex gap-8 justify-start mt-12">
            <!-- <div class="avatar rounded-full w-44 h-44 bg-[#f5f5f5]"></div> -->
            <div class="detail flex flex-col justify-between">
                <!-- <div class="name text-[#1B1B1B] text-16">{{ item?.userName || '匿名用户' }}</div> -->
                <div class="time text-[#888888] text-14">{{ item?.createdAt || '2023-01-01' }}</div>
            </div>
        </div>
    </div>
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
                    pictureList: item.image.split(',') || []
                }));

            } else {
                logList.value = [...logList.value, ...data.rows.map((item) => ({
                    ...item,
                    pictureList: item.image.split(',')||[]
                }))]
            }
            console.log(logList.value,'logList')

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
        console.log(err, 'error')
    }
}
const showImagePreview = (index) => {
    previewImage({
        images: props.arr,
        startPosition: index
    })
}
onMounted(() => {
    getList()
    setTimeout(()=>{
            console.log(logList.value,'logList')
    },1200)
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
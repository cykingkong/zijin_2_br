<template>
    <div class="community p-16 flex flex-col">
        <!-- <item v-for="(item ,index) in logList" :key="index" :arr="item.pictureList || []" :item="item" /> -->
        <div class="detail-image w-full px-[24px]" v-if="banners.length > 0">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="item in banners" :key="index" @click="handleClickBanner(item)">
                    <div class="image bg-[#f5f5f5] rounded-[16px] w-full">
                        <img :src="item.url" alt="" class="w-full h-full object-cover rounded-[16px]">
                    </div>
                </van-swipe-item>
            </van-swipe>
        </div>
        <div class="tag-li flex flex-nowrap gap-4">
            <div class="tag-item px-10 py-6.5px text-nowrap bg-[#0000000D] color-[#00000080] text-[12px] rounded-[8px]"
                :class="activeIndex == index ? 'active-tag' : ''" v-for="(item, index) in tags" :key="index">
                {{ item }}
            </div>
        </div>
        <div class="flex mt-12 gap-12 w-full">
            <div class=" phone-input  flex-1 items-center w-full">
                <inputCom :placeholder="t('')" v-model="search" :input-type="'search'" :tips="''" class="flex-1 w-full">
                    <template #sendCode>
                        <div class="absolute right-10 font-size-12 h-28 flex justify-center items-center sendCode text-[#1b1b1b]"
                            @click="toSearch()">
                            {{ t("Seach") }}
                        </div>
                    </template>
                </inputCom>
            </div>
        </div>


        <div class="item w-full  p-16 rounded-16" v-for="(item, index) in logList" :key="index">

            <div class="content mb-12">
                <div class="text-[#888888] text-16 font-bold">{{ item?.title || '' }} </div>
            </div>
            <div class="picture-box">
                <!-- 单张图片 -->
                <div class="w-full min-h-[120px] rounded-[16px] overflow-hidden bg-[#f5f5f5]"
                    v-if="item.pictureList.length == 1" v-for="(item, index) in item.pictureList" :key="index">
                    <van-image :src="item" fit="cover" class="w-full h-full object-cover"
                        @click="showImagePreview(index)"></van-image>
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
                <div class="detail flex flex justify-between w-full items-center">
                    <!-- <div class="name text-[#1B1B1B] text-16">{{ item?.userName || '匿名用户' }}</div> -->
                    <div class="time text-[#888888] text-14">{{ dayjs(item?.createdAt).format('YYYY-MM-DD') ||
                        '' }}</div>
                    <div class="flex gap-20 text-[#8C91A2] text-[12px]">
                        <div class="flex gap-4"><svg class="w-20 h-20" viewBox="0 0 20 20" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12.9833 9.99993C12.9833 11.6499 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.6499 7.01666 9.99993C7.01666 8.34993 8.35 7.0166 10 7.0166C11.65 7.0166 12.9833 8.34993 12.9833 9.99993Z"
                                    stroke="#8C91A2" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path
                                    d="M10 16.8918C12.9417 16.8918 15.6833 15.1584 17.5917 12.1584C18.3417 10.9834 18.3417 9.00843 17.5917 7.83343C15.6833 4.83343 12.9417 3.1001 10 3.1001C7.05834 3.1001 4.31667 4.83343 2.40834 7.83343C1.65834 9.00843 1.65834 10.9834 2.40834 12.1584C4.31667 15.1584 7.05834 16.8918 10 16.8918Z"
                                    stroke="#8C91A2" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>

                            {{ item.view || 0 }}</div>
                        <div class="flex gap-4"><svg class="w-20 h-20" viewBox="0 0 20 20" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10.517 17.3404C10.2337 17.4404 9.76699 17.4404 9.48366 17.3404C7.06699 16.5154 1.66699 13.0737 1.66699 7.24036C1.66699 4.66536 3.74199 2.58203 6.30032 2.58203C7.81699 2.58203 9.15866 3.31536 10.0003 4.4487C10.842 3.31536 12.192 2.58203 13.7003 2.58203C16.2587 2.58203 18.3337 4.66536 18.3337 7.24036C18.3337 13.0737 12.9337 16.5154 10.517 17.3404Z"
                                    stroke="#8C91A2" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>


                            {{ item.like || 0 }}</div>
                    </div>
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
import { list } from '@/api/dyname';
import dayjs from 'dayjs'
const { t } = useI18n();
const logList = ref([])
const listStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const page = reactive({
    pageIndex: 1,
    pageSize: 10,
})
const banners = ref([])
const tags = ref([

])
const search = ref('')
const router = useRouter()
const toAdd = () => {
    router.push({
        name: 'addCommunity',
    })
}

const getList = async () => {
    try {
        const { data, code } = await list({
            ...page,
            ...search.value,
        })
        if (code === 200) {
            tags.value = data.classList || []
            if (page.pageIndex == 1) {
                logList.value = data.rows.map((item) => ({
                    ...item,
                    pictureList: item.image.split(',') || []
                }));

            } else {
                logList.value = [...logList.value, ...data.rows.map((item) => ({
                    ...item,
                    pictureList: item.image.split(',') || []
                }))]
            }
            console.log(logList.value, 'logList')

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
    setTimeout(() => {
        console.log(logList.value, 'logList')
    }, 1200)
})
</script>
<style scoped>
.community {
    padding-bottom: calc(env(safe-area-inset-bottom) + 82px);
}

.phone-input {
    border: 1px solid #F0F0F0;
    border-radius: 12px;
    background: #0000000D;


    :deep(.input-box) {
        height: 39px;
        margin-top: 0px;

        input {
            background: transparent;
        }

    }

    :deep(.tips) {
        margin-bottom: 0px;
    }
}

.sendCode {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #868c9a;
    color: #fff;
    background: #424242;
}

.active-tag {
    background: #424242;
    color: #fff;
}
</style>
<route lang="json5">
{
  name: 'news',
  meta: {
    i18n: 'News'
  },
}
</route>
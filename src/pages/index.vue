<template>
    <div class="community px-16  flex flex-col">
    <div class="label w-full text-right h-44 pt-16 font-bold  relative">
    <div class="absolute transition-all duration-300 left-1/2 -translate-x-1/2">{{ t('List') }}</div>
                    <LangSelectDropdown v-model="lang" />

    </div>

   
        <div class="flex mt-[20px] w-full text-center pb-20 border-b-solid border-b-[1px] border-b-[#0000000D] mb-20">
            <div class="flex-1">
                <div class="value font-bold mb-4">{{ imageObj.images_today }}</div>
                <div class="label font-bold mb-4">{{ t('Today Submit') }}</div>
            </div>
            <div class="flex-1">
                <div class="value font-bold mb-4">{{ imageObj.images_total }}</div>
                <div class="label font-bold mb-4">{{ t('Total Pass') }}</div>
            </div>
        </div>
        <div class="item w-full p-16 rounded-16" v-for="(item, index) in logList" :key="index"
            @click="handleClickItem(item)">
            <div class="content mb-12">
                <!-- 移除了原本堆砌在此处的冗长 SVG，保持 DOM 干净 -->
                <div class="text-[#888888] text-16 font-bold flex items-center gap-[4px]">
                    ID:{{ item?.order_id || '' }}
                </div>
            </div>
            <div class="picture-box">
                <!-- 单张图片 -->
                <div class="w-full min-h-[120px] rounded-[16px] overflow-hidden bg-[#f5f5f5] relative"
                    v-if="item.images.length == 1" v-for="(imgItem, imgIndex) in item.images" :key="imgIndex">
                    <van-image :src="imgItem.image" fit="cover" class="w-full h-full object-cover"
                        @click.stop="handleClickPicture(index, imgIndex)"></van-image>
                    <!-- 蒙版层 (图片状态) -->
                    <div :style="{ background: statusIconMap[imgItem.status].bg }"
                        class="absolute bottom-0 h-[30px] w-full color-white pointer-events-none flex px-2 gap-4 z-10 justify-center items-center text-nowrap">
                        <div class="text-12 font-bold">{{ statusIconMap[imgItem.status].label || '' }}</div>
                        <svg v-if="statusIconMap[imgItem.status]" class="w-16 h-16 flex-shrink-0" viewBox="0 0 20 20"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path :d="statusIconMap[imgItem.status].path" :fill="'#FFF'" />
                        </svg>
                    </div>
                </div>

                <!-- 两张图片、三张图片 -->
                <div class="w-full grid grid-cols-3 gap-8" v-if="[2, 3].includes(item.images.length)">
                    <div class="w-full h-120 rounded-[16px] overflow-hidden bg-[#f5f5f5] flex-1 relative"
                        v-for="(imgItem, imgIndex) in item.images" :key="imgIndex">
                        <van-image :src="imgItem.image" fit="cover" class="w-full h-full object-cover"
                            @click.stop="handleClickPicture(index, imgIndex)"></van-image>

                        <!-- 蒙版层 (图片状态) -->
                        <div :style="{ background: statusIconMap[imgItem.status].bg }"
                            class="absolute bottom-0 h-[30px] w-full color-white pointer-events-none flex px-2 gap-4 z-10 justify-center items-center text-nowrap">
                            <div class="text-12 font-bold">{{ statusIconMap[imgItem.status].label || '' }}</div>
                            <svg v-if="statusIconMap[imgItem.status]" class="w-16 h-16 flex-shrink-0"
                                viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path :d="statusIconMap[imgItem.status].path" :fill="'#FFF'" />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- 四张图片 -->
                <div class="w-full grid grid-cols-2 gap-8" v-if="item.images.length == 4">
                    <div class="w-full h-120 rounded-[16px] overflow-hidden bg-[#f5f5f5] flex-1 relative"
                        v-for="(imgItem, imgIndex) in item.images" :key="imgIndex">
                        <van-image :src="imgItem.image" fit="cover" class="w-full h-full object-cover"
                            @click.stop="handleClickPicture(index, imgIndex)"></van-image>

                        <!-- 蒙版层 (图片状态) -->
                        <div :style="{ background: statusIconMap[imgItem.status].bg }"
                            class="absolute bottom-0 h-[30px] w-full color-white pointer-events-none flex px-2 gap-4 z-10 justify-center items-center text-nowrap">
                            <div class="text-12 font-bold">{{ statusIconMap[imgItem.status].label || '' }}</div>
                            <svg v-if="statusIconMap[imgItem.status]" class="w-16 h-16 flex-shrink-0"
                                viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path :d="statusIconMap[imgItem.status].path" :fill="'#FFF'" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div class="info w-full flex gap-8 justify-start mt-12">
                <div class="detail flex flex justify-between w-full items-center">
                    <div class="time text-[#888888] text-14">{{ dayjs(item?.createdAt).format('YYYY-MM-DD') || '' }}
                    </div>
                </div>
            </div>
        </div>
        <empty v-if="logList?.length == 0" :no-tips="true"></empty>
        <LoadMore :status="listStatus" @load-more="loadMore" />
    </div>
</template>

<script setup>
import itemCom from '@/pages/news/com/item.vue'; // 为避免与变量 item 冲突，建议将引入名改为 itemCom
import { imageList as list } from '@/api/image'
import dayjs from 'dayjs'
import { showImagePreview } from 'vant';
const { t, locale } = useI18n();
const logList = ref([])
const imageObj = ref({
    images_today: 0,
    images_total: 0
})
const listStatus = ref(1);
const page = reactive({
    pageIndex: 1,
    pageSize: 10,
})
const banners = ref([])
const activeIndex = ref(0)
const tags = ref([
    { label: t("Success"), key: 0 },
    { label: t('Under review'), key: 1 },
    { label: t("Rejection"), key: 2 }
])
const search = ref('')
const router = useRouter()


// ===== 核心优化点：提取 SVG 状态映射表 =====
// 0: 审核中(黄) 1: 通过(绿) 2: 已拒绝(红)
const statusIconMap = {
    0: {
        color: '#FFAA37',
        path: 'M9.99999 1.66666C5.40832 1.66666 1.66666 5.40832 1.66666 9.99999C1.66666 14.5917 5.40832 18.3333 9.99999 18.3333C14.5917 18.3333 18.3333 14.5917 18.3333 9.99999C18.3333 5.40832 14.5917 1.66666 9.99999 1.66666ZM13.625 12.975C13.5083 13.175 13.3 13.2833 13.0833 13.2833C12.975 13.2833 12.8667 13.2583 12.7667 13.1917L10.1833 11.65C9.54166 11.2667 9.06666 10.425 9.06666 9.68332V6.26666C9.06666 5.92499 9.34999 5.64166 9.69166 5.64166C10.0333 5.64166 10.3167 5.92499 10.3167 6.26666V9.68332C10.3167 9.98332 10.5667 10.425 10.825 10.575L13.4083 12.1167C13.7083 12.2917 13.8083 12.675 13.625 12.975Z'
        , label: t('Waiting'),
        bg: 'rgba(255, 170, 55, 0.8)', // 蒙版背景色 (黄色, 80%不透明) 
    },
    1: {
        color: '#34C759',
        path: 'M17.9667 8.95L16.8333 7.63333C16.6167 7.38333 16.4417 6.91667 16.4417 6.58333V5.16666C16.4417 4.28333 15.7167 3.55833 14.8333 3.55833H13.4167C13.0917 3.55833 12.6167 3.38333 12.3667 3.16666L11.05 2.03333C10.475 1.54166 9.53334 1.54166 8.95 2.03333L7.64167 3.175C7.39167 3.38333 6.91667 3.55833 6.59167 3.55833H5.15C4.26667 3.55833 3.54167 4.28333 3.54167 5.16666V6.59166C3.54167 6.91666 3.36667 7.38333 3.15834 7.63333L2.03334 8.95833C1.55 9.53333 1.55 10.4667 2.03334 11.0417L3.15834 12.3667C3.36667 12.6167 3.54167 13.0833 3.54167 13.4083V14.8333C3.54167 15.7167 4.26667 16.4417 5.15 16.4417H6.59167C6.91667 16.4417 7.39167 16.6167 7.64167 16.8333L8.95834 17.9667C9.53334 18.4583 10.475 18.4583 11.0583 17.9667L12.375 16.8333C12.625 16.6167 13.0917 16.4417 13.425 16.4417H14.8417C15.725 16.4417 16.45 15.7167 16.45 14.8333V13.4167C16.45 13.0917 16.625 12.6167 16.8417 12.3667L17.975 11.05C18.4583 10.475 18.4583 9.525 17.9667 8.95ZM13.4667 8.425L9.44167 12.45C9.325 12.5667 9.16667 12.6333 9 12.6333C8.83334 12.6333 8.675 12.5667 8.55834 12.45L6.54167 10.4333C6.3 10.1917 6.3 9.79167 6.54167 9.55C6.78334 9.30833 7.18334 9.30833 7.425 9.55L9 11.125L12.5833 7.54167C12.825 7.3 13.225 7.3 13.4667 7.54167C13.7083 7.78333 13.7083 8.18333 13.4667 8.425Z'
        , label: t('Success'), bg: 'rgba(52, 199, 89, 0.8)',  // 蒙版背景色 (绿色, 80%不透明)
    },
    2: {
        color: '#FF6464',
        path: 'M13.4917 1.66669H6.50832C3.47499 1.66669 1.66666 3.47502 1.66666 6.50835V13.4834C1.66666 16.525 3.47499 18.3334 6.50832 18.3334H13.4833C16.5167 18.3334 18.325 16.525 18.325 13.4917V6.50835C18.3333 3.47502 16.525 1.66669 13.4917 1.66669ZM12.8 11.9167C13.0417 12.1584 13.0417 12.5584 12.8 12.8C12.675 12.925 12.5167 12.9834 12.3583 12.9834C12.2 12.9834 12.0417 12.925 11.9167 12.8L9.99999 10.8834L8.08332 12.8C7.95832 12.925 7.79999 12.9834 7.64166 12.9834C7.48332 12.9834 7.32499 12.925 7.19999 12.8C6.95832 12.5584 6.95832 12.1584 7.19999 11.9167L9.11666 10L7.19999 8.08335C6.95832 7.84169 6.95832 7.44169 7.19999 7.20002C7.44166 6.95835 7.84166 6.95835 8.08332 7.20002L9.99999 9.11669L11.9167 7.20002C12.1583 6.95835 12.5583 6.95835 12.8 7.20002C13.0417 7.44169 13.0417 7.84169 12.8 8.08335L10.8833 10L12.8 11.9167Z'
        , label: t('Rejection'), bg: 'rgba(255, 100, 100, 0.8)',// 蒙版背景色 (红色, 80%不透明)
    }
}

const toAdd = () => {
    router.push({ name: 'addCommunity' })
}

const handleClickItem = (item) => {
    // localStorage.setItem('newDetail', JSON.stringify(item))
    // router.push({ path: '/news/newDetail' })
}

const getList = async () => {
    try {
        const { data, code } = await list({ ...page, ...search.value })
        if (code === 200) {
            imageObj.value = {
                images_today: data.images_today,
                images_total: data.images_total
            }
            if (page.pageIndex == 1) {
                logList.value = data.list.map((item) => ({ ...item }));
            } else {
                logList.value = [...logList.value, ...data.list.map((item) => ({ ...item }))]
            }

            if (data.length >= data.total) {
                listStatus.value = 3
            }
            if (!data.row || data.list.length == 0) {
                listStatus.value = 3
                return
            }
            listStatus.value = 2
        }
    } catch (err) {
        console.log(err, 'error')
    }
}

// 修改这里：修复预览图片的索引传递，避免越界或不对应
const handleClickPicture = (listIndex, imgIndex) => {
    let item = logList.value[listIndex]
    console.log(item,'')
    let images = item.images.map((el) => {
       return el.image
    })
    // 假设你引入了预览方法，此处需根据你的实际预览 API 传递
    showImagePreview({
        images: images,
        startPosition: imgIndex // 修正此处，使用内部图片的索引
    })
}

const loadMore = () => {
    if (listStatus.value === 2) {
        page.pageIndex++
        getList()
    }
}


onMounted(() => {
    getList()
})
</script>

<style scoped>
/* 样式保留你的原版即可 */
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
    i18n: 'List'
  },
}
</route>
<template>
    <div class="lottery-content min-h-[100vh] w-full flex items-center justify-center">
        <svg class="w-40 h-40 absolute left-[24px] top-[40px]" viewBox="0 0 40 40" fill="none" @click="handleClickBack"
            xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="white" />
            <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#F0F0F0" />
            <path d="M21.6667 16.6667L18.3333 20L21.6667 23.3333" stroke="#1B1B1B" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="w-40 h-40 bg-[#fff] flex items-center rounded-full justify-center absolute right-[24px] top-[40px]"
            @click="getLogList()">
            <svg t="1765923256063" class="icon w-30 h-30 " viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="12595">
                <path
                    d="M673.4848 72.96H324.6592a221.5424 221.5424 0 0 0-221.5424 221.5424v414.1056a221.5424 221.5424 0 0 0 221.5424 221.5424h179.968a278.272 278.272 0 0 1 390.4-394.24V294.5024a221.5424 221.5424 0 0 0-221.5424-221.5424z m-215.04 389.12H288.7168a40.96 40.96 0 1 1 0-81.92h169.472a40.96 40.96 0 1 1 0 81.92z m184.6272-166.1952H288.7168a40.96 40.96 0 0 1 0-81.92h354.0992a40.96 40.96 0 1 1 0 81.92z"
                    fill="#EC6B44" p-id="12596"></path>
                <path
                    d="M715.7248 537.6A211.0976 211.0976 0 1 0 926.72 748.9024 211.0976 211.0976 0 0 0 715.7248 537.6z m80.1792 262.3488h-92.16a40.96 40.96 0 0 1-40.96-40.96v-94.1056a40.96 40.96 0 1 1 81.92 0v53.3504h51.2a40.96 40.96 0 0 1 0 81.92z"
                    fill="#EC6B44" p-id="12597"></path>
                <path
                    d="M673.4848 72.96H324.6592a221.5424 221.5424 0 0 0-221.5424 221.5424v414.1056a228.9152 228.9152 0 0 0 1.792 27.9552 524.7488 524.7488 0 0 0 335.0016 49.408 278.272 278.272 0 0 1 379.8016-295.2192 525.5168 525.5168 0 0 0 38.6048-318.3104 221.184 221.184 0 0 0-184.832-99.4816z m-215.04 389.12H288.7168a40.96 40.96 0 1 1 0-81.92h169.472a40.96 40.96 0 1 1 0 81.92z m184.6272-166.1952H288.7168a40.96 40.96 0 0 1 0-81.92h354.0992a40.96 40.96 0 1 1 0 81.92z"
                    fill="#EE7C55" p-id="12598"></path>
                <path
                    d="M504.6272 748.9024c0 6.8608 0.3584 13.7216 1.024 20.48a524.6976 524.6976 0 0 0 156.9792-82.4832v-21.9648a40.96 40.96 0 0 1 62.7712-34.6624 523.6224 523.6224 0 0 0 62.0032-79.9232 211.2 211.2 0 0 0-282.7776 198.6048z"
                    fill="#EE7C55" p-id="12599"></path>
                <path
                    d="M324.6592 72.96a221.5424 221.5424 0 0 0-221.5424 221.5424v266.8032a421.376 421.376 0 0 0 586.24-487.7312c-5.12-0.3584-10.5472-0.6144-15.872-0.6144z m133.5296 389.12h-169.472a40.96 40.96 0 1 1 0-81.92h169.472a40.96 40.96 0 1 1 0 81.92z m184.6272-166.1952H288.7168a40.96 40.96 0 0 1 0-81.92h354.0992a40.96 40.96 0 1 1 0 81.92z"
                    fill="#F19970" p-id="12600"></path>
                <path
                    d="M247.7568 254.9248a40.96 40.96 0 0 1 40.96-40.96h212.1728a389.12 389.12 0 0 0 35.84-121.344c0.8192-6.5536 1.4336-13.1072 1.9456-19.6608h-214.016a221.5424 221.5424 0 0 0-221.5424 221.5424V431.616a389.5808 389.5808 0 0 0 144.6912-9.7792v-0.7168a40.96 40.96 0 0 1 40.96-40.96h59.0848a391.7824 391.7824 0 0 0 99.7888-84.2752h-158.72a40.96 40.96 0 0 1-41.1648-40.96z"
                    fill="#F5C295" p-id="12601"></path>
            </svg>
        </div>

        <LuckyWheel ref="myLucky" width="300px" height="300px" :prizes="prizes" :blocks="blocks" :buttons="buttons"
            @start="startCallback" @end="endCallback" />

        <van-popup v-model:show="showPicker" destroy-on-close round :position="'bottom'" :safe-area-inset-bottom="true">
            <div class="p-12">
                <div class="top w-32 h-4 bg-[#f0f0f0] mx-auto mb-32"></div>
                <div class="h-300 overflow-auto">
                    <div class="add-bank-li mb-12 h-52 border border-[#f0f0f0] border-solid rounded-[16px] p-[12px] flex justify-between items-center"
                        v-for="(item, index) in logList" :key="index">
                        <div class="name flex items-center gap-12 text-[#0F172A] text-[14px] font-bold">
                            ₹ {{ item.amount }}
                        </div>

                        {{ item.createdAt }}
                    </div>
                    <empty :no-tips="true" v-if="logList.length === 0" />
                    <LoadMore :status="listStatus" @load-more="loadMore" />
                </div>

            </div>
        </van-popup>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { configList, draw, logList as logListApi } from '@/api/lottery'
import type LoadMoreVue from '@/components/LoadMore.vue'
import { list } from '@/api/dyname'

const config = ref<any>()
const logList = ref<any>()
const showPicker = ref(false)
const myLucky = ref(null)
const listStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const router = useRouter()
const blocks = [{
    padding: '38px', imgs: [{
        src: "https://zj.crossbordershopping.one/storage/kyc_images/kyc_18_78c3625c4b54551d738e76f11a27e949.jpg",
        width: '125%',
        height: '125%',
        top: '-14%',
    }]
}]
const prizes = ref([])
const buttons = [{
    radius: '35%',
    pointer: true,
    imgs: [{
        src: "https://zj.crossbordershopping.one/storage/kyc_images/kyc_18_9c0ae261d5799cc126848f494d42c1e3.jpg",
        width: '100%',
        height: '100%',
        top: '-160%'
    }]
}]
const handleClickBack = () => {
    router.back()
}
// 点击抽奖按钮会触发startCallback回调
const startCallback = async () => {
    // 调用抽奖组件的play方法开始游戏
    myLucky.value.play()
    // 模拟调用接口异步抽奖

    const { data, code } = await draw({})
    if (code == 200) {
        console.log(data)
        let index = prizes.value.findIndex((item: any) => {
            return item.fonts[0].amount == data.amount
        })
        setTimeout(() => {
            showSuccessToast({})
            myLucky.value.stop(index)
        }, 3000)
    }
}
const page = reactive({
    pageIndex: 1,
    pageSize: 10
})
const getLogList = async () => {
    const { data, code } = await logListApi({
        ...page
    })

    if (code === 200) {
        if (page.pageIndex == 1) {
            logList.value = data.rows;
        } else {
            logList.value = [...logList.value, ...data.rows]
        }
        if (data.length >= data.total) {
            listStatus.value = 3
        }
        if (!data.row) {
            listStatus.value = 3
            showPicker.value = true
            return
        }
        listStatus.value = 2
        showPicker.value = true

    }
}
const loadMore = () => {
    page.pageIndex++
    getLogList()
}
// 抽奖结束会触发endCallback回调
const endCallback = (prize) => {
    console.log(prize)
}
const enumColor = {
    0: '#fd7070',
    1: '#fac25d',
}
const getConfig = async () => {
    const { data, code } = await configList({})

    if (code === 200) {


        prizes.value = data.map((item: any, index: any) => {
            let fonts = [{ text: `₹ ${item.amount} `, top: '10%', amount: item.amount }]
            let background = enumColor[index % 2]
            return {
                fonts: fonts,
                background: background,
            }
        })
        console.log(prizes.value)
    }
}
onMounted(() => {
    getConfig()
})
</script>
<style scoped lang="less">
.lottery-content {
    padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
    background-image: url('@/assets/lottery/lottery-bg.png');
    background-size: cover;
    background-position: center;
}
</style>
<route lang="json5">
{
  name: 'lottery',
  meta: {
    i18n: 'lottery'
  },
}
</route>
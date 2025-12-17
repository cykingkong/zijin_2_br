<template>
    <div class="receive-content p-16 flex flex-col gap-16 ">
        <div @click="handleClickActivity()"
            class="receive-btn border b-solid b-[#1b1b1b] rounded-[16px] text-[#1b1b1b] text-[12px] min-w-[86px] h-37 text-center p-6 flex items-center justify-center">
            {{
                $t('Receive')
            }}
        </div>
        <div class="news-item w-full rounded-[16px]  min-h-[120px] flex gap-[12px]   p-12 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
            v-for="(item, index) in userProductList" :key="index">
            <div class="img w-96 h-96 flex-shrink-0 bg-[#F5F5F5] overflow-hidden rounded-[16px]">
                <img :src="item.productImage" alt="" v-if="item && item.productImage"
                    class="w-full h-full object-cover rounded-[16px] ">
            </div>
            <div class="info w-full color-[#111827] font-bold flex flex-col justify-between">
                {{ item.productName || 'Product Name' }}
                <div class="bottom text-12 my-6 w-full">
                    <div class="li flex justify-between">
                        <div class="label text-[#666]">{{ $t('Cycle') }}</div>
                        <div class="value text-amber">{{ `${item.total_days} ${$t('Days')}` || '- ' + $t('Days') }}
                        </div>
                    </div>
                    <div class="li flex justify-between">
                        <div class="label text-[#666]">{{ $t('Daily') }}</div>
                        <div class="value text-amber">₹ {{ item.dailyIncome }}</div>
                    </div>
                    <div class="li flex justify-between">
                        <div class="label text-[#666]">{{ $t('Total') }}</div>
                        <div class="value text-amber">₹ {{ item.totalIncome }}</div>
                    </div>

                </div>
                <div class="w-full flex justify-end">


                </div>

            </div>
        </div>
        <empty :no-tips="true" v-if="userProductList.length == 0" />
        <LoadMore :status="listStatus" @load-more="loadMore" />
        <van-popup v-model:show="showPicker" destroy-on-close round :position="'center'" :safe-area-inset-bottom="true">
            <div class="p-12">
                <div class="mid mx-auto text-center mb-12 text-16 ">{{ $t('Tips') }}</div>
                <div class="content" v-html="errorHtml"></div>
                <div class="w-full flex gap-12  mt-12">
                    <div class="btn-box flex-1">
                        <van-button type="default" class="btn-h" plain block @click="showPicker = false">
                            {{ $t("Cancel") }}
                        </van-button>
                    </div>
                    <div class="btn-box flex-1">
                        <van-button type="primary" class="btn-h" color="#1b1b1b" block @click="handleClickConfirm">
                            {{ $t("Confirm") }}
                        </van-button>
                    </div>
                </div>
            </div>

        </van-popup>
    </div>
</template>
<script setup lang="ts">
import { userProductList as userProductListApi, claimIncome, tipsList } from '@/api/product'
const userProductList = ref([])
const listStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const page = reactive({
    pageIndex: 1,
    pageSize: 10
})
const router = useRouter()
const errorHtml = ref("")
const showPicker = ref(false)
const receivedInfo = ref({ id: null })
const watingReceiveIds = ref([])
const handleClickActivity = async () => {

    watingReceiveIds.value = watingReceiveIds.value = userProductList.value
        .filter(item => item.can_claim === true)
        .map(item => item.id)
    console.log(watingReceiveIds.value)

    try {
        for (let i = 0; i < watingReceiveIds.value.length; i++) {
            console.log(watingReceiveIds.value[i])
            const { data, code, message } = await claimIncome({ id: watingReceiveIds.value[i] })
            console.log(data, message, 'asdasd')
            if (code == 200) {
                showSuccessToast({})
                router.push({
                    path: "/profile"
                })
            } else {
                errorHtml.value = message
                showPicker.value = true
                break
            }
        }


    } catch (e) {
        // showPicker.value = true
        console.log(e)
    }
}

const handleClickConfirm = () => {
    let idsString = JSON.stringify(watingReceiveIds.value)
    router.push({
        path: '/community/addCommunity?watingReceiveIds=' + idsString,
        query: {
            watingReceiveIds: idsString
        }
    })
}
const getUserCouponList = async () => {
    try {
        const { data, code } = await userProductListApi({
            ...page
        })
        if (code == 200) {
            if (page.pageIndex == 1) {
                userProductList.value = data.rows || []
                console.log(userProductList.value)
            } else {
                userProductList.value = [...userProductList.value, ...data.rows]
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
    } catch (e) {
        console.log(e)
    }
}
const loadMore = () => {
    page.pageIndex++
    getUserCouponList()
}
onMounted(() => {
    getUserCouponList();
    // tipsList({}).then(({ data }) => {

    // })
})
</script>
<style scoped>
.btn-h {
    height: 40px !important;
}

.disable-btn {
    border: none;
    background: #c0c0c0;
    color: #fff;
}

.li {
    gap: 48px;
}
</style>
<route lang="json5">
{
  name: 'Receive',
  meta: {
    i18n: 'Receive'
  },
}
</route>
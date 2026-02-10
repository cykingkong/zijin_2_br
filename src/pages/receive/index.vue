<template>
    <div class="receive-content p-16 flex flex-col gap-16 ">
        <div class="p-[16px] rounded-[12px] bg-[#fff] border-solid flex flex-col gap-[16px] border-[#0000000D] border">
            <div class="li-flex flex justify-between items-center">
                <div class="label text-[12px] text-[#8C91A2]">Today's product revenue</div>
                <div class="value flex items-center font-bold gap-8">
                    <img src="@/assets/coin.png" class="w-20 h-20 block" alt="">
                    R$ {{ info.todayIncome || '0' }}
                </div>
            </div>
            <div class="li-flex flex justify-between items-center">
                <div class="label text-[12px] text-[#8C91A2]">Yesterday's product revenue</div>
                <div class="value flex items-center font-bold gap-8">
                    <img src="@/assets/coin.png" class="w-20 h-20 block" alt="">
                    R${{ info.yesterdayIncome || '0' }}
                </div>
            </div>
            <div class="li-flex flex justify-between items-center">
                <div class="label text-[12px] text-[#8C91A2]">Received product revenue</div>
                <div class="value flex items-center font-bold gap-8">
                    <img src="@/assets/coin.png" class="w-20 h-20 block" alt="">
                    R${{ info.allIncome || '0' }}
                </div>
            </div>
        </div>
        <!-- <div @click="handleClickActivity()"
            class="receive-btn border b-solid b-[#1b1b1b] rounded-[16px] text-[#1b1b1b] text-[12px] min-w-[86px] h-37 text-center p-6 flex items-center justify-center">
            {{
                $t('Receive')
            }}
        </div> -->
        <div class="flex bg-[#0000000D] rounded-[8px] p-[4px] mb-[16px] flex h-38">
            <div class="btn-1 flex-1 flex text-[13px] font-bold justify-center items-center"
                v-for="(item, index) in typeList" @click="activeIndex = index; getUserCouponList()"
                :class="activeIndex == index ? 'bg-[#161616] text-white rounded-[8px]' : ''" :key="index"> {{ item
                }}
            </div>
        </div>
        <div class="news-item w-full flex-wrap rounded-[16px]  min-h-[120px] flex gap-[12px]   p-12 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
            v-for="(item, index) in userProductList" :key="index">
            <div class="img w-96 h-96 flex-shrink-0 bg-[#F5F5F5] overflow-hidden rounded-[16px]">
                <img :src="item.productImage" alt="" v-if="item && item.productImage"
                    class="w-full h-full object-cover rounded-[16px] ">
            </div>
            <div class="info w-[calc(100%-108px)] color-[#111827] font-bold flex flex-col justify-between">
                {{ item.productName || 'Product Name' }}
                <div class="bottom text-12 my-6 w-full">
                    <div class="li flex justify-between">
                        <div class="label text-[#666]">{{ $t('Validity period') }}</div>
                        <div class="value text-[#1b1b1b]">
                            {{ `${item.received_days} / ${item.total_days} ` || '- ' }}
                        </div>
                    </div>
                    <div class="li flex justify-between">
                        <div class="label text-[#666]">{{ $t('Every 1 day') }}</div>
                        <div class="value text-[#1b1b1b]">R$ {{ item.dailyIncome }}</div>
                    </div>
                    <div class="li flex justify-between">
                        <div class="label text-[#666]">{{ $t('Total Revenue') }}</div>
                        <div class="value text-[#1b1b1b]">R$ {{ item.totalIncome }}</div>
                    </div>
                    <div class="li flex justify-between">
                        <div class="label text-[#666]">{{ $t('Already received') }}</div>
                        <div class="value text-[#1b1b1b]">R$ {{ item.receivedIncome }}</div>
                    </div>
                </div>
                <div class="w-full flex justify-end">


                </div>

            </div>
            <button
                class="w-full h-[48px] rounded-[12px] font-bold text-[16px] transition-all flex items-center justify-center"
                :class="[
                    // 如果倒计时未结束(disabled为true)，使用灰色背景和禁止手势
                    (timerMap[item.id] && timerMap[item.id].disabled)
                        ? 'bg-[#E5E5E5] text-[#999] cursor-not-allowed'
                        : 'bg-[#1A1A1A] text-white active:opacity-90'
                ]" :disabled="timerMap[item.id]?.disabled" @click="handleClickReceived(item)">
                <!-- 显示倒计时 或者 'Received' -->
                {{ timerMap[item.id]?.text || 'Received' }}
            </button>
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
import { showNotify, showLoadingToast, closeToast } from 'vant'
import local from '@/utils/local';
import dayjs from 'dayjs';
const timerMap = ref({}); // 存储结构: { [id]: { text: '00:00:00', disabled: true } }
let intervalId = null;
const userProductList = ref([])
const listStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const page = reactive({
    pageIndex: 1,
    pageSize: 10
})
const info = ref({
    todayIncome: "0",
    yesterdayIncome: "0",
    allIncome: "0"
})
const router = useRouter()
const errorHtml = ref("")
const activeIndex = ref(0);
const typeList = ref([
    'Unexpired products',
    'Expired products',
])
const showPicker = ref(false)
const receivedInfo = ref({ id: null })
const watingReceiveIds = ref([])
const formatDuration = (ms) => {
    if (ms <= 0) return '';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const format = (n) => n.toString().padStart(2, '0');

    // 如果大于1天，显示 "x Days HH:mm:ss"，否则显示 "HH:mm:ss"
    if (days > 0) {
        return `${days}D ${format(hours)}:${format(minutes)}:${format(seconds)}`;
    }
    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
};
// 更新倒计时的主函数
const updateTimer = () => {
    const now = dayjs();

    // 遍历当前列表中的所有商品
    userProductList.value.forEach(item => {
        if (!item.nextClaimTime) {
            // 如果没有时间字段，默认可领取
            timerMap.value[item.id] = { text: 'Received', disabled: false };
            return;
        }
        const targetTime = dayjs(item.nextClaimTime);
        const diff = targetTime.diff(now); // 获取毫秒差值
        if (diff > 0) {
            // 倒计时进行中：显示时间，禁用按钮
            timerMap.value[item.id] = {
                text: formatDuration(diff),
                disabled: true
            };
        } else {
            // 时间已到：显示 Received，启用按钮
            timerMap.value[item.id] = {
                text: 'Received',
                disabled: false
            };
        }
    });
};
// 开启定时器
const startTimer = () => {
    // 先执行一次，避免 1秒 延迟
    updateTimer();
    // 清除旧的定时器防止重复
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(updateTimer, 1000);
};
const handleClickReceived = async (item) => {
    try {
        const { data, code, message } = await claimIncome({ id: item.id })
        if (code == 200) {
            showSuccessToast({})
            getUserCouponList()
            // router.push({
            //     path: "/profile"
            // })
        } else if (code == 1001) {

            showNotify({
                type: 'danger',
                message: message
            })
        } else {
            errorHtml.value = message
            showPicker.value = true

        }
    } catch (e) {
        console.log(e, 'error')
    }
}
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
            } else if (code == 1001) {
                showNotify({
                    type: 'danger',
                    message: message
                })
            } else {
                errorHtml.value = message
                showPicker.value = true
                break
            }
        }


    } catch (e) {
        // showPicker.value = true
        console.log(e, 'error')
    }
}

const handleClickConfirm = () => {
    let idsString = JSON.stringify(watingReceiveIds.value)
    local.setlocal('idsString', idsString)
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
            ...page,
            status: activeIndex.value + 1
        })
        if (code == 200) {
            if (page.pageIndex == 1) {
                userProductList.value = data.rows || []
                info.value = data.info || {
                    todayIncome: "0",
                    yesterdayIncome: "0",
                    allIncome: "0"
                }
                console.log(userProductList.value)
            } else {
                userProductList.value = [...userProductList.value, ...data.rows]
            }
            startTimer()

            if (data.length >= data.total) {
                listStatus.value = 3
            }
            if (!data.row || data.rows.length == 0) {
                listStatus.value = 3
                return
            }
            listStatus.value = 2;
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
<template>
    <div class="exchange-content p-16 min-h-[100vh]">
        <img src="@/assets/reward.png" alt="" class="w-200 h-170 block m-x-auto mb-30 mt-32">
        <div class="bg-white p-16 rounded-[16px] mb-16 card">
            <div class="flex items-center font-bold mb-16">
                <img src="@/assets/reward.png" alt="" class="w-28 h-24 block mr-[3px]">
                {{ t('Exchange') }}
            </div>
            <div class="input-box flex flex-col gap-16 w-full">
                <div class="input-content h-48 w-full">
                    <input type="text" :placeholder="t('Enter your Amount')" v-model="codes">
                </div>
                <div class="button  border b-solid border flex-shrink-0 bg-[#1b1b1b] text-white px-12 h-48 rounded-16 flex items-center justify-center"
                    :class="{ 'opacity-60 cursor-not-allowed': submitting }"
                    :aria-disabled="submitting"
                    @click="handleClickExchange">
                    {{ submitting ? t('Submitting') : t('Exchange') }}</div>
            </div>
        </div>

        <div class="bg-white p-16 rounded-[16px] card" v-if="userList.length > 0">
            <div class="text-[16px] font-bold mb-12">{{ t('BonusRecords') }}</div>
            <div class="flex flex-col gap-12">
                <div class="rounded-[12px] bg-[#F8F9FD] p-12" v-for="(item, index) in userList" :key="item.id || index">
                    <div class="flex justify-between gap-12 text-[14px] mb-6">
                        <span class="text-[#8C91A2]">{{ t('RewardCode') }}</span>
                        <span class="text-[#183E40] font-bold break-all text-right">{{ item.code || item.giftCode || item.exchangeCode || '-' }}</span>
                    </div>
                    <div class="flex justify-between gap-12 text-[14px] mb-6">
                        <span class="text-[#8C91A2]">{{ t('RewardAmount') }}</span>
                        <span class="text-[#183E40] font-bold text-right">{{ item.amount || item.reward || item.value || item.money || '-' }}</span>
                    </div>
                    <div class="flex justify-between gap-12 text-[14px]">
                        <span class="text-[#8C91A2]">{{ t('Receive Time') }}</span>
                        <span class="text-[#666] text-right">{{ item.createdAt || item.createTime || item.receiveTime || item.updatedAt || '-' }}</span>
                    </div>
                </div>
            </div>
            <LoadMore :status="listStatus" @load-more="loadMore" />
        </div>
        <div class="bg-white p-16 rounded-[16px] card text-center text-[#8C91A2]" v-else>
            {{ t('NoBonusRecords') }}
        </div>

        <van-popup v-model:show="feedbackPopupShow" destroy-on-close round position="center">
            <div class="feedback-popup p-16 text-center">
                <div class="text-[18px] font-bold mb-8 text-[#183E40]">{{ feedbackTitle }}</div>
                <div class="text-[14px] text-[#666] leading-[20px] mb-16">{{ feedbackMessage }}</div>
                <van-button type="primary" color="#1b1b1b" block @click="feedbackPopupShow = false">
                    {{ t('OK') }}
                </van-button>
            </div>
        </van-popup>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { create, list } from '@/api/gift'
// 复用之前的图片资源引入逻辑
import lv2 from '@/assets/lv/lv2.png';
import lv3 from '@/assets/lv/lv3.png';
import lv4 from '@/assets/lv/lv4.png';
import lv5 from '@/assets/lv/lv5.png';
import lv6 from '@/assets/lv/lv6.png';
import lv7 from '@/assets/lv/lv7.png';
import lv8 from '@/assets/lv/lv8.png';
const codes = ref('')
const submitting = ref(false)
const userList = ref([])
const feedbackPopupShow = ref(false)
const feedbackTitle = ref('')
const feedbackMessage = ref('')
const listStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const { t } = useI18n()
const page = reactive({
    pageIndex: 1,
    pageSize: 10
})
// 注意：截图是从 LV2 开始的
const salaryList = ref([
    { lv: 'LV2', amount: '$7.00', img: lv2 },
    { lv: 'LV3', amount: '$20.00', img: lv3 },
    { lv: 'LV4', amount: '$45.00', img: lv4 },
    { lv: 'LV5', amount: '$120.00', img: lv5 },
    { lv: 'LV6', amount: '$300.00', img: lv6 },
    { lv: 'LV7', amount: '$1,000.00', img: lv7 },
    { lv: 'LV8', amount: '$3,000.00', img: lv8 },
]);
const openFeedback = (title: string, message: string) => {
    feedbackTitle.value = title
    feedbackMessage.value = message
    feedbackPopupShow.value = true
}
const handleClickExchange = async () => {
    if (submitting.value) return

    const codeValue = codes.value.trim()
    if (!codeValue) {
        openFeedback(t('RewardExchangeFailed'), t('RewardCodeRequired'))
        return
    }

    submitting.value = true
    try {
        const { code, message } = await create({
            code: codeValue
        })

        if (code == 200) {
            openFeedback(t('Exchange Success'), t('RewardExchangeSuccess'))
            page.pageIndex = 1
            getUserList()
            codes.value = ''
        } else {
            openFeedback(t('RewardExchangeFailed'), message || t('RewardExchangeFailed'))
        }
    } catch (err) {
        console.log(err, '')
        openFeedback(t('RewardExchangeFailed'), t('RewardExchangeNetworkError'))
    } finally {
        submitting.value = false
    }
}
const getUserList = async () => {
    try {
        const { data } = await list({
            pageIndex: page.pageIndex,
            pageSize: page.pageSize
        })
        if (!data.rows || data.rows.length == 0) {
            if (page.pageIndex === 1) {
                userList.value = []
            }
            listStatus.value = 3
            return
        }
        if (page.pageIndex == 1) {
            userList.value = data.rows || []
        } else {
            userList.value = [...userList.value, ...data.rows || []]
        }
        if (data.length >= data.total) {
            listStatus.value = 3
            return
        }
        listStatus.value = 2
    } catch (err) {
        console.log(err, '获取用户列表失败')
    }
}
const loadMore = () => {
    page.pageIndex++;
    getUserList();
}
onMounted(() => {
    getUserList()
})
</script>
<style scoped lang="less">
.exchange-content {
    padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
}

.feedback-popup {
    width: min(88vw, 320px);
}

.input-content {
    border: 1px solid #F0F0F0;
    border-radius: 16px;
    padding: 6px;



    input {
        // background: #F8F9FD;
        border: none;
        height: 100%;
        padding: 0 16px;
        width: 100%;

        &::placeholder {
            color: #999999;
            font-size: 14px;
            font-weight: 400;
        }

        &::-webkit-input-placeholder {
            color: #999999;
            font-size: 14px;
            font-weight: 400;
        }

        &::-moz-placeholder {
            color: #999999;
            font-size: 14px;
            font-weight: 400;
        }

        &:-ms-input-placeholder {
            color: #999999;
            font-size: 14px;
            font-weight: 400;
        }
    }
}

.card {
    border: 1px solid #0000001A
}
</style>
<route lang="json5">
{
  name: 'reward',
  meta: {
    i18n: 'Reward'
  },
}
</route>

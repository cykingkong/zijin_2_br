<template>
    <div class="exchange-content p-16">
        <div class="mt-32 font-bold text-24 text-center">R$ {{ seedConfigData?.seedBalance }}</div>
        <div class="tips text-[#424242] text-center mb-32">{{ t('Number of pearls') }}</div>
        <div class="bg-white p-16 rounded-[16px] mb-16 card">
            <div class="input-box flex flex-col gap-8 w-full">
                <div class="input-content h-48 w-full">
                    <input type="number" :placeholder="t('Enter your Exchange Amount')" v-model="codes">
                </div>
                <div class="text-14 text-[#424242] mb-12">{{ t('Redeemable Amount:') }}{{ canExchangeNum }} </div>
                <div class="button border b-solid border flex-shrink-0 bg-[#1b1b1b] text-white px-12 h-48 rounded-16 flex items-center justify-center"
                    @click="handleClickExchange">
                    {{ t('Exchange') }}</div>
            </div>
        </div>

        <!-- 2. 薪资标准标题 -->
        <div class="text-[16px] font-bold text-[#333] mb-[12px]">{{ t('Salary Standards') }}</div>

        <!-- 薪资标准列表 -->
        <div class="standards-table bg-white rounded-[16px] p-[16px]  mb-[24px]">
            <!-- 表头 -->
            <div
                class="flex justify-between text-[#333] font-bold text-[14px] mb-[16px] pb-[12px] border-b-solid border-b-[1px] border-b-[#0000000D] border">
                <span class=" flex-1">{{ t('Level') }}</span>
                <span class=" flex-1">{{ t('Rate') }}</span>
            </div>

            <!-- 列表内容 -->
            <div class="flex flex-col gap-[18px]">

                <div v-for="(item, index) in seedConfigData?.exchangeRates" :key="index"
                    class="flex justify-between items-center text-[14px] ">
                    <div class="flex items-center flex-1">
                        <!-- 图标 -->
                        <img :src="imgEnum[item.level]" class="w-[20px] h-[20px] mr-[8px] object-contain" />
                        <!-- 等级文字 -->
                        <span class="text-[#00000080]">{{ t('Lv') }}{{ item.level }}</span>
                    </div>
                    <!-- 金额 -->
                    <span class="text-[#333] font-medium  text-[15px] flex-1">{{ item.seedRadio }} %</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { seed, exchangeSeed } from '@/api/seed'

// 复用之前的图片资源引入逻辑
import lv1 from '@/assets/lv/lv1.png';
import lv2 from '@/assets/lv/lv2.png';
import lv3 from '@/assets/lv/lv3.png';
import lv4 from '@/assets/lv/lv4.png';
import lv5 from '@/assets/lv/lv5.png';
import lv6 from '@/assets/lv/lv6.png';
import lv7 from '@/assets/lv/lv7.png';
import lv8 from '@/assets/lv/lv8.png';
const codes = ref(undefined)
const seedConfigData = ref<any>({})
const listStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const { t } = useI18n()
const page = reactive({
    pageIndex: 1,
    pageSize: 10
})
const canExchangeNum = computed(() => {
    if (!codes.value) {
        return '0'
    }
    // 如果codes.value不为数字，返回0
    if (isNaN(Number(codes.value))) {
        return '0'
    }
    return (Number(codes.value) * Number(seedConfigData.value?.seedRadio)).toFixed(2)
})
const imgEnum = {
    1: lv1,
    2: lv2,
    3: lv3,
    4: lv4,
    5: lv5,
    6: lv6,
    7: lv7,
    8: lv8,
}
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
const handleClickExchange = async () => {
    if (!codes.value) {

        return
    }
    try {
        const { code } = await exchangeSeed({
            seedNum: codes.value
        })

        if (code == 200) {
            showSuccessToast({
                message: t("Exchange successful")
            })
            getUserList()
            codes.value = undefined
        }
    } catch (err) {
        console.log(err, '兑换失败')
    }
}
const getUserList = async () => {
    try {
        const { data, code } = await seed({
            pageIndex: page.pageIndex,
            pageSize: page.pageSize
        })
        if (code == 200) {
            seedConfigData.value = data || {}

        }

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
  name: 'exchange',
  meta: {
    i18n: 'Exchange'
  },
}
</route>

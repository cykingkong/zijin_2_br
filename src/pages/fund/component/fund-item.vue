<template>
    <div class="discont-item-content w-full  px-12 py-24 flex flex-col gap-20px" v-if="props.itemType == 'fund'">
        <!-- 玩法 - 基金 -->
        <div class="li flex items-center justify-between">
            <div class="li-l">{{ dayjs(_item.startTimeBegin).format('YYYY-MM-DD') }}</div>
            <div class="li-r">{{ dayjs(_item.startTimeEnd).format('YYYY-MM-DD') }}</div>
        </div>
        <div class="top-li flex  items-center">
            <div class="l flex flex-shrink-0 items-center gap-6 justify-between">
                <div class="name font-size-16 font-700">{{ item.name }}</div>
            </div>
            <div class="r flex flex-1 flex-shrink-0 justify-end" @click.stop="handleClickDetail">总收益率: {{
                _item.totalYield || '-' }} % ></div>
        </div>
        <div class="li flex justify-between items-center ">
            <div class="li-l font-size-14">日收益率:{{ _item.dailyYield }}%</div>
            <div class="li-r font-size-14">预计收益:{{ _item.expectedYield }}%</div>

        </div>
        <div class="li flex justify-between items-center ">
            <div class="li-l font-size-14">周期:{{ _item.cycle }}天 </div>
            <div class="li-r font-size-14"><van-button type="primary" :disabled="_item.status == 2"
                    @click="handleClickSubmit" size="small" class="h-35px! w-80px! font-size-12!">{{
                        statusEnum[_item.status] }}</van-button></div>
        </div>
    </div>
    <div class="order-item-content w-full px-12 py-24  font-size-12 flex flex-col gap-10px"
        v-if="props.itemType == 'order'">
        <div class="li flex items-center justify-between">
            <div class="li-l">{{ dayjs(_item.startTimeBegin).format('YYYY-MM-DD') }}</div>
            <div class="li-r">{{ dayjs(_item.startTimeEnd).format('YYYY-MM-DD') }}</div>
        </div>
        <div class="top-li flex  items-center">
            <div class="l flex flex-shrink-0 items-center gap-6 justify-between">
                <div class="name font-size-16 font-700">{{ item.fundInfo.name }}</div>
            </div>
            <div class="r flex flex-1 flex-shrink-0 justify-end" @click.stop="handleClickDetail">周期:{{ item.diffDay }}天
                ></div>
        </div>
        <div class="li flex justify-between items-center ">
            <div class="li-l font-size-14">日收益率:{{ _item.dailyYield }}%</div>
            <div class="li-r font-size-14"> 总收益率: {{
                _item.totalYield }} %</div>
        </div>
        <div class="li flex justify-between items-center ">
            <div class="li-l font-size-14">总收益:{{ _item.assetInfo.unit }} {{ _item.totalProfit }}</div>
            <div class="li-r font-size-14">金额:{{ _item.assetInfo.unit }} {{ _item.amount }}</div>
        </div>
        <div class="li flex gap-12px justify-end items-center">
            <van-button v-if="_item.status == 3 && item.getType == 1 && item.surplusProfit > 0" color="#7232dd"
                @click="handleClickSubmit" size="small" class="h-35px! w-80px! font-size-12!">领取收益</van-button>
            <van-button type="primary" v-if="_item.status == 4" @click="handleClickOrder(1)" size="small"
                class="h-35px! w-80px! font-size-12!">赎回</van-button>
            <van-button type="primary" v-if="_item.status == 4" @click="handleClickOrder(2)" size="small"
                class="h-35px! w-80px! font-size-12!">续期</van-button>

            <van-button :color="_item.status == 1 ? '#1989fa' : '#b5b5b5'" @click="handleClickSubmit" size="small"
                class="h-35px! w-80px! font-size-12!">{{
                    orderStatusEnum[_item.status] }}</van-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { statusEnum, orderStatusEnum } from '../enum'
import dayjs from 'dayjs'
const router = useRouter()
const emits = defineEmits(['handleClickBtn', 'handleClickOrder'])
const props = defineProps({
    item: {
        type: Object as () => any,
    },
    index: {
        type: Number
    },
    itemType: {
        type: String,
        default: 'fund'
    }
})
const _item = computed(() => {
    return props.item
})
const _index = computed(() => {
    return 1

})
const handleClickSubmit = () => {
    if (props.itemType == 'order' && props.item.status != 1) {
        return
    }
    let data = {
        item: props.item,
        itemType: props.itemType,
    }
    emits('handleClickBtn', data)
}
const handleClickOrder = (type: any) => {
    let data = {
        ...props.item,
        type
    }
    emits('handleClickOrder', data)

}
const handleClickDetail = () => {
    let id = props.itemType == 'fund' ? props.item.id : props.item.fundId
    router.push(`/fund/fundDetail?id=${id}`)
}

</script>
<style lang="less" scoped>
.discont-item-content,
.order-item-content {
    // background: var(--bg);
    border-bottom: 1px solid var(--border_color);
}
</style>

<template>
    <div class="payMentMethod-list">
        <!-- 收款方式 -->
        <div class="list-item w-full p-12 " v-for="(item, index) in list" :key="index">
            <div class="item-top flex justify-between items-center ">
                <div class="label flex items-center gap-8">{{ item.address ? item.address.bankName : '-' }}</div>
                <van-icon name="edit" @click="handleClickEdit(index)"></van-icon>
            </div>
            <div class="real-name font-size-14 py-6 pl-12 mt-6 line-height-24">{{ item.address ?
                item.address.receiveAccount : '-' }}</div>
            <div class="real-name font-size-16 pl-12">{{ item.address ? item.address.receiveName : '-' }}</div>
        </div>
        <div class="bottom-btn w-full fixed bottom-0 left-0 p-12 h-110 ">
            <van-button type="primary" block @click="addCard">添加收款方式</van-button>
        </div>
        <empty v-if="list.length == 0" />
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { userCardGrid, userCardAdd, userCardDel } from "@/api/payment";
import { useStore } from "@/stores/modules/index";
import empty from "@/components/empty.vue";
const router = useRouter()
const store = useStore()
const list = ref([])
const page = ref({
    pageIndex: 1,
    pageSize: 10
})

const getList = async () => {
    const { data } = await userCardGrid({
        ...page.value
    })
    list.value = data.rows || []
    store.setUserCardList(data.rows)

}
const handleClickEdit = (index) => {
    router.push('/profile/payMentMethod/add?type=1&edit=1&index=' + index)
}
const addCard = () => {
    router.push('/profile/payMentMethod/selectPay')
}
getList()


</script>
<style lang="less" scoped>
.label {
    &::before {
        width: 4px;
        height: 15px;
        background: #E7BB41;
        content: "";
        display: block;
    }
}
</style>

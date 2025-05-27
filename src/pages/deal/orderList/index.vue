<template>
    <div class="">
        <VanNavBar :title="title" :fixed="true" clickable :left-arrow="true" @click-left="onBack">
        </VanNavBar>
        <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
            v-show="skeleton && list.length == 0" v-for="i in 5" :key="i">
        </div>
        <withdraw v-for="(item, key) in list" :key="key" :item="item"></withdraw>
        <empty v-if="list.length == 0" :noTips="true" />
        <LoadMore :status="listStatus" @load-more="loadMore"></LoadMore>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { withdrawOrderGrid } from "@/api/withdraw"
import { rechargeOrderGrid } from "@/api/recharge"
import withdraw from "./components/withdraw.vue"
const { proxy } = getCurrentInstance()!
const type = ref()
const route = useRoute()
const router = useRouter()
const list = ref([])
const listStatus = ref(0)
const title = ref('')
function onBack() {
    if (window.history.state.back)
        history.back()
    else
        router.replace('/')
}
const page = reactive({
    pageIndex: 1,
    pageSize: 10
})
const skeleton = ref(false)

const loadMore = () => {
    page.pageIndex++
    if (type.value == '1') {
        getRechargeOrderGrid()
    } else {
        getWithdrawOrderGrid()
    }
}
const getWithdrawOrderGrid = async () => {
    listStatus.value = 1
    skeleton.value = true
    const res = await withdrawOrderGrid({
        ...page,
    })
    if (!res.data.rows) {
        listStatus.value = 3;
        skeleton.value = false
        return
    }
    if (page.pageIndex == 1) {
        list.value = res.data.rows || []
    } else {
        list.value = [...list.value, ...res.data.rows || []]
    }
    if (res.data.total <= list.value.length) {
        listStatus.value = 3;
        skeleton.value = false

        return
    }
    skeleton.value = false

    listStatus.value = 2
}
const getRechargeOrderGrid = async () => {
    listStatus.value = 1
    skeleton.value = true
    const res = await rechargeOrderGrid({
        ...page,
    })
    if (!res.data.rows) {
        skeleton.value = false

        listStatus.value = 3
        return
    }
    if (page.pageIndex == 1) {
        list.value = res.data.rows || []
    } else {
        list.value = [...list.value, ...res.data.rows || []]
    }
    if (res.data.total <= list.value.length) {
        listStatus.value = 3
        skeleton.value = false

        return
    }
    skeleton.value = false

    listStatus.value = 2
}
onMounted(() => {
    if (route.query.type) {
        type.value = route.query.type
        if (type.value == '1') {
            getRechargeOrderGrid()

        } else {
            getWithdrawOrderGrid()

        }
    }
    title.value = type.value == '1' ? '充值记录' : '提现记录'
})



</script>
<style lang="less" scoped>
.skeleton-animation {
    animation: pulseskeleton 1s ease-in infinite;
}

@keyframes pulseskeleton {
    0% {
        opacity: 0.7;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.7;
    }
}
</style>

<template>
    <div class="">
        <router-view name=""></router-view>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { creditApplyList } from '@/api/ipo'
const { proxy } = getCurrentInstance()!
let labelEnum = {
    'number': '姓名',
    'gender': '性别',
    'birthday': '出生日期',
    'idCard': '身份证号',
    'address': '地址',
    'income': '年收入',
    'phone': '手机号',
    'work': '工作',
    'taxNumber': '税号',
}
let statusEnum = {
    '1': '审核中',
    '2': '审核通过',
    '3': '审核失败',
}
const page = reactive({
    pageIndex: 1,
    pageSize: 10
})
const listStatus = ref(0) // 1:加载中 2:加载完成 3:没有更多数据
const list = ref([])
const formatDate = (date: ['string', 'string', 'string']) => {
    return date[0] + '-' + date[1] + '-' + date[2]
}
const getPageList = async () => {
    listStatus.value = 1
    const { data } = await creditApplyList({
        pageIndex: page.pageIndex,
        pageSize: page.pageSize,
    })
    listStatus.value = 2
    let result = []
    if (page.pageIndex == 1) {
        result = data.rows.map((e) => {
            e.creditInfoObj = JSON.parse(e.creditInfo)
            e.creditInfoObjArr = Object.entries(e.creditInfoObj).filter((e) => {
                return !['genderDesc', 'birthdayDesc'].includes(e[0])
            })
            return e
        }) || []
    } else {
        result = list.value.concat(data.rows || [])
    }
    list.value = result;
    console.log(list.value)
}
const loadMore = () => {
    if (listStatus.value == 2) {
        page.pageIndex++
        getPageList()
    }
}
onMounted(() => {
    getPageList()
})

</script>
<style lang="less" scoped></style>

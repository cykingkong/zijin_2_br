<template>
    <div class="certificationCenter pt-12">
        <!-- 认证中心 -->
        <div class="user-box px-12 pb-12">
            <div class="user-center-top px-8 w-full flex flex-items-center flex-justify-between">
                <div class="text-white">个人中心</div>
                <div class="r">国家</div>
            </div>
            <div class="flex mt-12">
                <div class="gn p-12  flex flex-items-center gap-4 rounded-40 ">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOCSURBVHgB7ZlfbhMxEMY/b8IjKI9IlGp7g3IDOAHtCdqeoMkJSE+wKRyA3oBygvYGcANWtLyvxCtdM5MQCTVjr72x3aX4J7WV6oz/jMff2BMgk8lkMpnM/4pCD16e62/0p8SwaH622GtmqvExKuDJy0ofY3iLZybPgCk88XYAWbzDQNEFTieVnvjYeDlgwLu/xjsK/CJgwLu/xjcKxq4fNO6+xmWr8VmyKRTeksweuNjQTrymX0de/cs2yyggJZzDAecsYFL+ESlvPVP1tjYl7dpdAf78/d2rb07VntS/xcY5IzgdAcvuXxgX72lD/2t0i3Ohq/JPX/CwcdYCNw0wnP2RxllIGzqPC/rTuPZls3HVgk4HpNj9NQ8RBd0RkGj316SOAqsDUu7+mtRRYI+AxLu/JmUUGNPg0tsFPgpNDVldGswmtNMHnjYymnK8FEmrfhofG9Xi7PtMzSUTswOG+eLri/FeIB6Bf+DO74tRC0QHaNIVPDJa4Fr6v+iA25m6pnMzwyOBNYDXJLbZDHcqvVCkoobmmkLlGr1mJIpV7/4U9acNR9YmgKupdLDzXl+plbpu0LZ49WOmvsIT0piLjVcc3RNupuoEnryo9H5R4IvUpsmht1P1xmbfeRMc3+EQBk2ggT89r3SJB4LH5jkYmuuxRqdDOx3Atyx6vrIXpdxbjmkCvmWoEPCYTwpcQQ79mufscvN0eg1yR3TVPJTa6AztPx2hQmJoTL6klVIbzfXEZfGMc0nMmhk0jnc/6GTlsh0eS75xWhVfwqsmSGq6MDw62Ovz3XN9hMiQo09pkXOprUvxJbzL4uTdqVZyuqJUtGBVRiS4b3L0QmpjxfddPOP/vQCsmWESKzOEUHyJXg5InRlCKb5ELwcsR02YGUIpvkRvBzApMkNIxZfYygFMzMwQWvEltnYAEyMzxFB8iSAOYEJmhliKLxHMAaEyQ0zFlwjmACZEZoip+IZ5hWe30lMqR4uLpQLLXP/CnlQP0CPUsUVvo19EorOatLnLfHTEIxJr8cu+ERFbNckVl6rONgTVgPvYqkmOBFV8iagRwJSU0u5WNTvft0FwxZeIGgGMLTPYiKH4EtEdwPh+zxDiju88FhLSkRmWxFR8cTwkxpYZYiu+RJIj8DeWzBBd8SWSRwAjZIYkii+RPAKY+5khleIPDn4z0M8cmUwmk8lkMg/Ab/q/GCPKnh+uAAAAAElFTkSuQmCC"
                        alt="" class="w-20 h-20">
                    <div class="t font-size-14">查看当前功能</div>
                </div>
            </div>
        </div>
        <div class="tab-box flex px-12">
            <div class="tab-item px-18 h-40px rounded-40 flex flex-items-center flex-justify-center gap-4 font-size-14"
                v-for="(item, index) in tabList" :key="index"
                :class="{ 'active': tabAcitve === index, 't1': index == 0 }" @click="changeTab(index)">
                <img src="@/assets/image/icon-success.png" alt="" class="w-20 h-20">
                {{ item }}
            </div>
        </div>
        <div class="tab-pan  px-20 pt-24 pb-12 flex flex-col gap-12" v-if="tabAcitve == 0">
            <div class="title color-gray-400">要求</div>
            <div class="line flex gap-4 flex-items-center font-size-12">
                <van-icon name="user-o" />
                資訊科技業
            </div>
            <div class="line flex gap-4 flex-items-center font-size-12">
                <van-icon name="credit-pay" />
                身份证
            </div>
            <div class="title color-gray-400">功能与限制</div>
            <div class="t flex flex-items-center gap-4 font-size-12"><van-icon name="underway-o" />審核時間:3天</div>
            <van-button type="primary" block>认证详情</van-button>
        </div>
        <div class="tab-pan  px-20 pt-24 pb-12 flex flex-col gap-12" v-if="tabAcitve == 1">
            <div class="title color-gray-400">要求</div>
            <div class="line flex gap-4 flex-items-center font-size-12">
                <van-icon name="user-o" />
                家庭住址
            </div>
            <div class="line flex gap-4 flex-items-center font-size-12">
                <van-icon name="credit-pay" />
                工作地址
            </div>
            <div class="line flex gap-4 flex-items-center font-size-12">
                <van-icon name="credit-pay" />
                亲属联系方式
            </div>
            <div class="title color-gray-400">功能与限制</div>
            <div class="t flex flex-items-center gap-4 font-size-12"><van-icon name="underway-o" />公證時間為1-30個工作日</div>
            <van-button type="primary" block>认证详情</van-button>
        </div>
        <div class="fixed fixed-status">认证状态</div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const tabList = ['普通认证', '高级认证']
const tabAcitve = ref(0)
const changeTab = (index: number) => {
    tabAcitve.value = index
}




</script>
<route lang="json5">
    {
      name: 'certificationCenter',
      path: '/certificationCenter', // 添加静态路径段明确层级
      meta: {
        title: 'certificationCenter',
        i18n: 'menus.certificationCenter'
      }
    }
  </route>
<style lang="less" scoped>
.gn {}

.tab-item {
    background-color: #1A2136
}

.active {
    background: var(--btn-bg);
}

.fixed-status {
    width: 80px;
    border-radius: 40px 0 0 40px;
    height: 40px;
    right: 0%;
    top: 25%;
    text-align: center;
    font-size: 14px;
    padding-left: 6px;
    line-height: 40px;
    background: red;
}
</style>

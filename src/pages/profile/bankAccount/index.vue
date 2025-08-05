<template>
    <div class="bankAccount p-24">
        <div class="label mb-16px">Bank Account</div>
        <div class="cell-box flex flex-col gap-16px">
            <div
                class="cell-item px-12px w-full rounded-12px border-1px border-#E2E8F0 border-solid h-72px flex items-center justify-between mb-16px">
                <div class="left flex items-center h-40 gap-12px">
                    <div class="w-40 h-40 flex-shrink-0 block bg-#7fff" alt="" />
                    <div class="info h-full flex flex-col justify-between">
                        <div class="t">{{ 1223 }}</div>
                        <div class="t2 text-#64748B text-10px">{{ 123123 }}</div>
                    </div>
                </div>
            </div>

        </div>
        <div class="label mb-16px">数字货币</div>
        <div class="cell-box flex flex-col gap-16px">
            <div
                class="cell-item px-12px w-full rounded-12px border-1px border-#E2E8F0 border-solid h-72px flex items-center justify-between mb-16px">
                <div class="left flex items-center h-40 gap-12px">
                    <div class="w-40 h-40 flex-shrink-0 block bg-#7fff" alt="" />
                    <div class="info h-full flex flex-col justify-between">
                        <div class="t">{{ 1223 }}</div>
                        <div class="t2 text-#64748B text-10px">{{ 123123 }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full bottom-btn  bg-#FFF mt-24px fixed left-0 px-24px">
            <van-button type="primary" color="#6B39F4" block @click="showPicker = true">
                Add Bank Account
            </van-button>
        </div>
        <van-popup v-model:show="showPicker" destroy-on-close round :position="'bottom'" :safe-area-inset-bottom="true">
            <div class="content py-12px">
                <div class="mid w-40px h-6px bg-#E2E8F0 rounded-6px mx-auto mb-12px"></div>
                <div
                    class="title h-38px flex items-start justify-between border-b-1px border-b-#E2E8F0 border-b-solid mb16px">
                    <div class="left pl-24px text-16px font-700">Picker</div>
                </div>
                <div class="radio-group px-24px">
                    <div class="radio-item w-full px-16px rounded-12px border-1px border-#E2E8F0 border-solid h-58px flex items-center justify-between mb-16px"
                        :class="{ 'border-#6B39F4 bg-#F8F5FF': activeRadio == index }"
                        v-for="(item, index) in radioList" :key="index" @click="activeRadio = index">
                        {{ item.title }}
                        <div class="radio border-solid border-1px border-#D1D5DB rounded-full w-20px h-20px relative flex-shrink-0"
                            :class="activeRadio == index ? 'radio-active' : ''">
                        </div>
                    </div>
                    <van-button type="primary" color="#6B39F4" block @click="showPicker = false; herfUrl()">
                        Done
                    </van-button>
                </div>
            </div>

        </van-popup>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const { proxy } = getCurrentInstance()!
const showPicker = ref(false)
const activeRadio = ref(0)
const router = useRouter()
const radioList = [{
    title: '添加银行卡',
    value: 0
}, {
    title: '添加数字货币',
    value: 1
}]
const herfUrl = () => {
    router.push({
        path: '/profile/bankAccount/add?type=' + activeRadio.value
    })
}


</script>
<style lang="less" scoped>
.bottom-btn {
    bottom: 0px;
    left: 0px;
    right: 0px;
    padding-bottom: calc(env(safe-area-inset-bottom) + 8px);
    padding-top: 8px;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
}

.radio-active {
    border-color: #6B39F4 !important;
    position: relative;
}

.radio-active::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 13.33px;
    height: 13.33px;
    background-color: #6B39F4;
    border-radius: 50%;
    transform: translate(-50%, -50%);
}
</style>

<route lang="json5">
    {
      name: 'bankAccount',
      meta: {
        title: 'bankAccount',
        i18n: 'bankAccount'
      },
    }
    </route>
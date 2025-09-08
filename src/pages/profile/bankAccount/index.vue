<template>
    <div class="bankAccount p-24 pb-120">

        <div class="cell-box flex flex-col gap-16px">
            <div class="cell-item px-12px w-full rounded-12px border-1px border-#E2E8F0 border-solid h-72px flex items-center justify-between "
                v-for="(item, index) in bankListData" :key="index">
                <div class="left flex items-center h-40 gap-12px">
                    <div class="w-40 h-40 flex items-center  justify-center flex-shrink-0 block bg-#6B39F4 rounded-full"
                        alt="">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M17.9 8V5C17.9 4.73478 17.7947 4.48043 17.6071 4.29289C17.4196 4.10536 17.1652 4 16.9 4H6.90002C6.36959 4 5.86088 4.21071 5.48581 4.58579C5.11074 4.96086 4.90002 5.46957 4.90002 6M4.90002 6C4.90002 6.53043 5.11074 7.03914 5.48581 7.41421C5.86088 7.78929 6.36959 8 6.90002 8H18.9C19.1652 8 19.4196 8.10536 19.6071 8.29289C19.7947 8.48043 19.9 8.73478 19.9 9V12M4.90002 6V18C4.90002 18.5304 5.11074 19.0391 5.48581 19.4142C5.86088 19.7893 6.36959 20 6.90002 20H18.9C19.1652 20 19.4196 19.8946 19.6071 19.7071C19.7947 19.5196 19.9 19.2652 19.9 19V16"
                                stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M20.9 12V16H16.9C16.3696 16 15.8609 15.7893 15.4858 15.4142C15.1107 15.0391 14.9 14.5304 14.9 14C14.9 13.4696 15.1107 12.9609 15.4858 12.5858C15.8609 12.2107 16.3696 12 16.9 12H20.9Z"
                                stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="info h-full flex flex-col justify-between">
                        <div class="t">{{ item.account }}</div>
                        <div class="t2 text-#64748B text-10px">{{ item.name }}</div>
                    </div>
                </div>
                <van-icon name="edit" size="24" @click="handleClickEdit(item)" />
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
import { ref, reactive } from "vue";
import { bank_list } from '@/api/payment'
const { proxy } = getCurrentInstance()!
const showPicker = ref(false)
const activeRadio = ref(0)
const router = useRouter();
const bankListData = ref([])
const page = reactive({
    page: 1,
    size: 30,
})
const radioList = [{
    title: '添加银行卡',
    value: 0
},
    // {
    //     title: '添加数字货币',
    //     value: 1
    // }
]
const getBankList = async () => {
    const { data, code } = await bank_list({ "wallet_type": "auto" })
    if (code == 200) {

        bankListData.value = data
    }
}
const herfUrl = () => {
    if (activeRadio.value == 0) {
        router.push({
            path: '/profile/bankAccount/addBank?edit=0'
        })
    } else if (activeRadio.value == 1) {
        router.push('/profile/bankAccount/add?edit=0')
    }
}
const handleClickEdit = (item: any) => {
    router.push('/profile/bankAccount/addBank?edit=1&id=' + item.id)
}
onMounted(() => {
    getBankList()
})

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
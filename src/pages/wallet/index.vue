<template>
    <div class="wallet">
        <div class="h-265px w-full top-info">
            <div class="w-full h-56px mb-4px"></div>
            <div class="info-box px-24px flex flex-col gap-4px h-102px">
                <div class="t1 text-#B59CFA text-16px">Balance</div>
                <div class="t1 text-#fff text-34px line-height-140%">MX$ {{ addCommasToNumber(20200) }}</div>
                <div class="t1 text-#D7D7D7 text-16px">$ 20200</div>
            </div>
            <div class="btn-box w-full flex gap-10px px-24px mt-33px">
                <div class="rounded-12px border-#fff border-1px border-solid h-36px flex-1 flex items-center gap-12px justify-center text-#fff text-16px"
                    @click="handleClickBtn(1)">
                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M8.5 1.8335C5.09424 1.8335 2.33333 4.59441 2.33333 8.00016C2.33333 11.4059 5.09424 14.1668 8.5 14.1668C11.9058 14.1668 14.6667 11.4059 14.6667 8.00016C14.6667 4.59441 11.9058 1.8335 8.5 1.8335ZM1.33333 8.00016C1.33333 4.04212 4.54196 0.833496 8.5 0.833496C12.458 0.833496 15.6667 4.04212 15.6667 8.00016C15.6667 11.9582 12.458 15.1668 8.5 15.1668C4.54196 15.1668 1.33333 11.9582 1.33333 8.00016ZM6.14645 6.97994L8.14645 4.97994C8.34171 4.78468 8.65829 4.78468 8.85355 4.97994L10.8536 6.97994C11.0488 7.1752 11.0488 7.49179 10.8536 7.68705C10.6583 7.88231 10.3417 7.88231 10.1464 7.68705L9 6.5406V10.6668C9 10.943 8.77614 11.1668 8.5 11.1668C8.22386 11.1668 8 10.943 8 10.6668V6.5406L6.85355 7.68705C6.65829 7.88231 6.34171 7.88231 6.14645 7.68705C5.95118 7.49179 5.95118 7.1752 6.14645 6.97994Z"
                            fill="white" />
                    </svg>
                    Withdraw
                </div>
                <div class="rounded-12px border-#fff border-1px border-solid h-36px flex-1 flex items-center gap-12px justify-center text-#fff text-16px"
                    @click="handleClickBtn(2)">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_226_2318)">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M8 1.8335C4.59424 1.8335 1.83333 4.59441 1.83333 8.00016C1.83333 11.4059 4.59424 14.1668 8 14.1668C11.4058 14.1668 14.1667 11.4059 14.1667 8.00016C14.1667 4.59441 11.4058 1.8335 8 1.8335ZM0.833328 8.00016C0.833328 4.04212 4.04195 0.833496 8 0.833496C11.958 0.833496 15.1667 4.04212 15.1667 8.00016C15.1667 11.9582 11.958 15.1668 8 15.1668C4.04195 15.1668 0.833328 11.9582 0.833328 8.00016ZM8 4.8335C8.27614 4.8335 8.5 5.05735 8.5 5.3335V9.45972L9.64644 8.31328C9.8417 8.11801 10.1583 8.11801 10.3535 8.31328C10.5488 8.50854 10.5488 8.82512 10.3535 9.02038L8.35355 11.0204C8.15829 11.2156 7.8417 11.2156 7.64644 11.0204L5.64644 9.02038C5.45118 8.82512 5.45118 8.50854 5.64644 8.31328C5.8417 8.11801 6.15829 8.11801 6.35355 8.31328L7.5 9.45972V5.3335C7.5 5.05735 7.72385 4.8335 8 4.8335Z"
                                fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_226_2318">
                                <rect width="16" height="16" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    Deposit
                </div>
            </div>
        </div>
        <div class="list w-full px-14px">
            <div class="list-title  flex  items-center h-40px justify-between">
                <div class="text-#0F172A text-16px font-700">My Portfolio</div>
                <div class="text-#6B39F4 text-16px">Reload</div>
            </div>
            <div class="list-content">
                <div class="list-items">
                    <div class="item-time text-#64748B text-14px font-600">
                        20 October 2022
                    </div>
                    <item class="mt-16px"></item>
                </div>

            </div>
        </div>


    </div>
</template>
<script setup lang="ts">
import { addCommasToNumber } from "@/utils/tool";
import { ref, reactive } from "vue"
import item from './component/item.vue'
const { proxy } = getCurrentInstance()!

const router = useRouter()
const handleClickBtn = (type: number) => {
    if (type == 1) {
        router.push('/wallet/exchange/cashierCenter')
    } else {
        router.push('/wallet/exchange/channel-out')
    }
}


</script>
<style lang="less" scoped>
.top-info {
    background: url('../../assets/portfolio-bg.jpg') no-repeat;
    background-size: cover;
    background-position: center;
}
</style>
<route lang="json5">
{
  name: 'wallet',
  meta: {
    title: 'wallet',
    i18n: 'menus.wallet'
  },
}
</route>
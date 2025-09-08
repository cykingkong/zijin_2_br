<template>
  <div class="wallet">
    <div class="h-165px w-full top-info relative">
      <VanNavBar title="" :fixed="true" clickable :left-arrow="true" placeholder @click-left="onBack" z-index="999"
        class="transparent-navbar">
        <template #title>
          Order Detail
        </template>
      </VanNavBar>
      <div
        class="info-box w-327px  flex flex-col gap-10px  rounded-12px bg-#fff absolute bottom-[-50%] left-50% transform-translate-x-[-50%]  transform-translate-y-[-0%]   p-16px">
        <div class="top-li font-size-14 flex items-center text-#5126B5">
          <div class="l flex flex-shrink-0 items-center gap-6 justify-between ">
            <div class="name font-size-16 font-700">
              {{ info.name }}
            </div>
          </div>


          <div class="r flex flex-1 flex-shrink-0 justify-end">
            MX$ {{ info.amount }}
          </div>
        </div>
        <div class="line w-full bg-#693CFF1F rounded-16px h-16px">
          <div class="line-inner bg-#693CFF rounded-16px h-16px" :style="{ width: info.calculateProgress + '%' }">
          </div>

        </div>
        <div class="li flex justify-between items-center text-#717680">
          <div class="li-l font-size-16 ">
            {{ "MX$" }}
            {{ info.total_profit }} / {{ "MX$" }}
            {{ addCommasToNumber(info.total_amount) }}
          </div>
          <div class="li-r font-size-14 text-align-right">
            <div class="rate">{{ t("dailyYield") }}:{{ info.daily_yield }}%</div>
            <div class="rate">
              {{ t("totalYield") }}: <span :class="info.total_yield >= 0 ? 'up' : 'down'"> {{ info.total_yield }}
                %</span>
            </div>

          </div>
        </div>

        <div class="li flex items-center justify-between">
          <div class="li-l text-14px text-#A3A7AE">{{ info.status_time }}</div>
          <div class="li-r text-14px text-#A3A7AE">{{ info.end_time }}</div>
        </div>

      </div>

    </div>
    <div class="list w-full px-14px mt-90px">
      <div class="list-title  flex  items-center h-40px justify-between">
        <div class="text-#0F172A text-16px font-700">收益发放记录</div>

      </div>

      <div class="li-item h-50px flex items-center justify-between rounded-12px px-12px">
        <div class="label color-#64748B text-14px">day</div>
        <div class="value  flex  justify-between h-40px items-center gap-12px">
          <div class="text-#0F172A text-14px font-bold color-#693CFF">+ MX$ 1000</div>
          <!-- <div class="radio border-solid border-1px border-#D1D5DB rounded-full w-20px h-20px relative flex-shrink-0"
            >
          </div> -->
          <svg class="w-20px h-20px " :class="radioList.includes(1) ? 'radio-active' : ''" viewBox="0 0 20 20"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.99963 1.5415C14.6709 1.5415 18.4584 5.32825 18.4586 9.99951C18.4586 14.6709 14.671 18.4585 9.99963 18.4585C5.32837 18.4583 1.54163 14.6708 1.54163 9.99951C1.5418 5.32836 5.32848 1.54168 9.99963 1.5415ZM9.99963 1.7915C5.46655 1.79168 1.7918 5.46643 1.79163 9.99951C1.79163 14.5327 5.46645 18.2083 9.99963 18.2085C14.533 18.2085 18.2086 14.5328 18.2086 9.99951C18.2084 5.46632 14.5329 1.7915 9.99963 1.7915ZM12.8278 7.82764C12.8766 7.77882 12.9567 7.77882 13.0055 7.82764C13.0543 7.87645 13.0543 7.95656 13.0055 8.00537L8.8385 12.1714C8.78968 12.2202 8.71056 12.2202 8.66174 12.1714L6.99475 10.5054C6.94593 10.4566 6.94593 10.3765 6.99475 10.3276C7.04347 10.2791 7.12272 10.2792 7.17151 10.3276L8.39612 11.5532L8.74963 11.9067L9.10315 11.5532L12.8278 7.82764Z"
              stroke="#A3A7AE" stroke-linecap="round" />
          </svg>


        </div>
      </div>


    </div>


  </div>
</template>
<script setup lang="ts">
import { addCommasToNumber } from "@/utils/tool";
import { ref, reactive } from "vue"
import { fundOrderDetail } from '@/api/bond'
import item from '@/components/item.vue'
const { proxy } = getCurrentInstance()!

const router = useRouter()
const route = useRoute()
const radioList = ref([1])
const info = ref({
  name: "",
  total_profit: 0,
  total_amount: 0,
  daily_yield: 0,
  total_yield: 0,
  status_time: "-",
  end_time: "-",
  status: 1,
  status_text: "Pending"

})
const { t } = useI18n();

const handleClickBtn = (type: number) => {
  if (type == 1) {
    router.push('/wallet/exchange/cashierCenter')
  } else {
    router.push('/wallet/exchange/channel-out')
  }
}
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
const getInfo = async (id: string) => {
  const res = await fundOrderDetail({ id: id })
  info.value = res.data
}
onMounted(() => {
  console.log(route)
  if (route.query.id) {
    getInfo(route.query.id as string)
  }
})
</script>
<style lang="less" scoped>
.top-info {
  background: url('@/assets/portfolio-bg.jpg') no-repeat;
  background-size: cover;
  background-position: center;
}

// 透明导航栏样式
.transparent-navbar {
  background: transparent !important;
  --van-border-color: transparent !important;

  :deep(.van-nav-bar) {
    background: transparent !important;
    border-bottom: none !important;
  }

  :deep(.van-nav-bar__content) {
    background: transparent !important;
  }

  :deep(.van-nav-bar__title) {
    color: white !important;
  }

  :deep(.van-icon) {
    color: white !important;
  }
}

.li-item {
  border: 1px solid #E9EAEB;
}

.radio-active {
  // border-color: #6B39F4 !important;
  // position: relative;

  path {
    stroke: #693CFF !important;
  }
}

.radio-active::after {}

.info-box {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1) !important;
}
</style>
<route lang="json5">
{
name: 'fundOrderDetail',
meta: {
  title: 'fundOrderDetail',
  i18n: 'menus.fundOrderDetail'
},
}
</route>
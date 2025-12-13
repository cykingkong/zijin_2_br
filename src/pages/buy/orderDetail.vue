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
        class="info-box w-327px h-92px flex  rounded-12px bg-#fff absolute bottom-[-50%] left-50% transform-translate-x--50% transform-translate-y--50%  flex items-center justify-between px-16px">
        <div class="left h-46px flex items-center gap-16px">
          <div class="img rounded-full w-40px h-40px overflow-hidden ">
            <img :src="info.logo" alt="" class="w-full h-full" v-if="info.logo">
          </div>
          <div class="info h-46px flex flex-col justify-center ">
            <div class="name text-#0F172A text-14px font-bold">{{ info.name }}</div>
            <!-- <div class="name2 text-#64748B text-12px">Send (AMD)</div> -->
          </div>
        </div>
        <div class="right h-46px flex flex flex-col justify-between ">
          <div class="name text-#0F172A text-14px font-bold">₹{{ info.amount }}</div>
          <div class="name2 text-#64748B text-12px text-align-right">{{ info.quantity }}{{ t('share') }}</div>
        </div>


      </div>

    </div>
    <div class="list w-full px-14px mt-60px">
      <div class="list-title  flex  items-center h-40px justify-between">
        <div class="text-#0F172A text-16px font-700">Order summary</div>
      </div>
      <div class="list-content bg-#F8F9FD w-full rounded-12px p-16px">
        <div class="li h-50px flex items-center justify-between h-44 ">
          <div class="label color-#64748B text-14px">Amount</div>
          <div class="value  flex flex-col justify-center h-40px">
            ₹{{ info.amount }}
          </div>
        </div>
        <div class="li h-50px flex items-center justify-between h-44 ">
          <div class="label color-#64748B text-14px">Stock purchased</div>
          <div class="value  flex flex-col justify-center h-40px">
            {{ info.quantity }}
          </div>
        </div>
        <div class="li h-50px flex items-center justify-between h-44 border-none!">
          <div class="label color-#64748B text-14px">Buy fee</div>
          <div class="value  flex flex-col justify-center h-40px color-#1DCE5C">
            ₹{{ info.fee }}
          </div>
        </div>
      </div>
    </div>


  </div>
</template>
<script setup lang="ts">
import { addCommasToNumber } from "@/utils/tool";
import { ref, } from "vue"
import item from '@/components/item.vue'
import { orderDetail } from '@/api/stock'
const { proxy } = getCurrentInstance()!
const { t } = useI18n()
const router = useRouter()
const transaction_id = ref()
const info = ref({
  logo: '',
  name: '',
  amount: '',
  quantity: '',
  status: '',
  created_at: '',
  updated_at: '',
})
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
const route = useRoute()
const getOrderDetail = async (id: any) => {
  const { data, code } = await orderDetail({ transaction_id: id })
  if (code == 200) {
    info.value = data
  }
}
onMounted(() => {
  transaction_id.value = route.query.transaction_id
  getOrderDetail(transaction_id.value)
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

.li {
  border-bottom: 1px solid #E2E8F0;
}

.info-box {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1) !important;
}
</style>
<route lang="json5">
{
name: 'orderDetail',
meta: {
  title: 'orderDetail',
  i18n: 'menus.orderDetail'
},
}
</route>
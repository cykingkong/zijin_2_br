<template>
    <div class="loan bg-#0F172A min-h-100vh p-24">
         <VanNavBar title="" :fixed="true" clickable :left-arrow="true"  @click-left="onBack" z-index="999"
        class="transparent-navbar">
        <template #title>
         {{t('Credit loan')}}
        </template>
      </VanNavBar>
        <div class="loan-content bg-#fff rounded-24 p-24">
       
            <img src="@/assets/image/loan.png" alt="" class="block mx-auto w-48">
            <!-- 待还金额 -->
            <div class="text-14 font-bold text-#64748B text-center mt-12 mb-4">{{ t(loanData.status == 1? 'Amount Due': 'Amount Repaid') }}</div> 
            <!-- 待还金额数值 -->
            <div class="text-24 font-bold text-#0F172A text-center">+MX$ {{ addCommasToNumber(loanData.status == 1? loanData.amount: loanData.returned_amount) || 0 }}</div>
            <div class="li-content mt-16">
              <div class="li flex justify-between items-center gap-10 h-48" v-for="item in liData">
                <div class="label text-14  color-#64748B">{{ item.label }}</div>
                <!-- 总金额数值 -->
                <div class="text-14 font-bold text-#0F172A flex-shrink-0">{{ item.value }}</div>
              </div>
              
            </div>

        </div>
        <div class="repay-record mt-16" v-if="[2,3].includes(loanData.status)  && loanData.loan_order">
          <div class="text-14 font-bold text-#fff mb-16" >{{ t('Repayment Record') }}</div>
          <div class="record-list pb-100">
            <div class="record-li bg-#fff rounded-12px h-50 flex justify-between items-center p-12 mb-15" v-for="i in loanData.loan_order">
              <div class="label text-14  color-#414651">{{ i.time }}</div>
              <div class="label text-14  color-#6B39F4">+MX$ {{ i.amount}}</div>
            </div>
          </div>
        </div>
        <bottomButton :buttonText="btnText" @click="handleClickSubmit" :bg-color="'#0F172A'" />
         <van-popup
      v-model:show="showPicker"
      destroy-on-close
      round
      position="bottom"
      :safe-area-inset-bottom="true"
      z-index="10000"
    >
    <div class="w-40 h-6 rounded-6px bg-#E2E8F0 mt-12px mx-auto"></div>
       <div class="w-full p-12 flex flex-col gap-12">
      <div class="l flex flex-[2] flex-shrink-0 items-center gap-6">
        <div class="name font-size-16 font-bold flex items-center gap-6">
          {{ t('Repayment') }}
          
        </div>
      </div>
      <div class="fundDivider w-full h-1px bg-#EBECEF"></div>
      <div
        class="input w-full rounded-12px bg-#F8F9FD text-align-center font-bold items-center text-16px h-58px flex px-24px gap-8px"
        :class="{

        }" >
        <div class="unit text-16px">MX$</div>
        <input type="number" placeholder="" v-model="amount" 
          class="w-full h-full text-16px text-align-left input"
        />
      </div>

    
      <!-- <Keypad v-model="form.amount" /> -->
      <div class="w-full flex gap-12">
        <!-- <div class="btn-box flex-1">
          <van-button type="default" class="h-40!" plain block @click="showPicker = false">{{ t("cancel")
            }}</van-button>
        </div> -->
        <div class="btn-box flex-1">
          <van-button type="primary" color="#6B39F4" class="h-56px! rounded-12px" block @click="confirm">{{ t(btnText)
            }}</van-button>
        </div>
      </div>
    </div>
  </van-popup>
    </div>
</template>
<script setup lang="ts">
import { ref,onMounted,computed } from 'vue'
import { useI18n } from 'vue-i18n'
import bottomButton from '@/components/bottom-button.vue'
import {loanIndex,receive,repay,aplicar} from "@/api/ipo";
import { addCommasToNumber } from '@/utils/tool';
const showPicker = ref(false)
const loanData = ref<any>({
  amount: 0,
});
const {t} = useI18n()
const amount = ref<any>('')
const router = useRouter()
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
const pay_price = ref('1000000')
const liData = computed(() => {
  if(loanData.value && loanData.value.status == 1){
    return [
       {
    label: t('Available Balance'),
    value: '$'+addCommasToNumber(loanData.value.amount || 0),
  },
  {
    label: t('15-day interest'),
    value: '$'+addCommasToNumber(loanData.value.interest || 0),
  },
    ]
  }
  if(loanData.value.status == 2){
    return [
      {
        label: t('15-day interest'),
        value: '$'+addCommasToNumber(loanData.value.interest || 0),
      },
      {
        label: t('Final repayment date'),
        value: loanData.value.repayment_time,
      },
    ]
  }
  if(loanData.value.status == 3){
    return [
      {
        label: t('15-day interest'),
        value: '$'+addCommasToNumber(loanData.value.interest || 0),
      },
      {
        label: t('Final repayment date'),
        value: loanData.value.repayment_time,
      },
    ]
  }
})
const btnText = computed(() => {
  if(loanData.value.status == 1){
    return t('Receive')
  }
  if(loanData.value.status == 2){
    return t('Repayment')
  }
   if(loanData.value.status == 3){
    return t('Reapply Again')
  }
})
onMounted(async () => {
 getLoanInfo()
})
const getLoanInfo = async () => {
  let res = await loanIndex({});
  if(res.code == 200){
    loanData.value = res.data;
    console.log(loanData.value)
  }
}
const handleClickSubmit = () => {
if(loanData.value.status == 1){
  receive({
    id: loanData.value.id,
  }).then(res => {
    if(res.code == 200){
      showSuccessToast({
        message: t('Receive Success'),
      })
      getLoanInfo()
    }
  })
}
if(loanData.value.status == 2){
  showPicker.value = true;
  amount.value = 0
}
if(loanData.value.status == 3){
  aplicar({}).then(({code})=>{
    if(code == 200){
      showSuccessToast({
        message: t('Reapply Success'),
      })
      getLoanInfo()
    }
  })
}
}
const confirm = async () =>{
  console.log(amount.value)
  if(!amount.value){
    showToast({
      message: t('Please input repayment amount'),
    })
    return
  }
  repay({
    id: loanData.value.id,
    amount: Number(amount.value),
  }).then(res => {
    if(res.code == 200){
      showSuccessToast({
        message: t('Repayment Success'),
      })
      showPicker.value = false;
      amount.value = 0
      getLoanInfo()
    }
  })
}
const handleAmountInput = (val: any)=>{
  
  }
</script>

<style scoped lang="less">
// 透明导航栏样式
.transparent-navbar {
  background: #0F172A !important;
  --van-border-color: #0F172A !important;

  :deep(.van-nav-bar) {
    background: #0F172A !important;
    border-bottom: none !important;
  }

 

  :deep(.van-nav-bar__title) {
    color: white !important;
  }

  :deep(.van-icon) {
    color: white !important;
  }
}
.li{
  border-bottom: 1px solid #E2E8F0
}
.input {
  transition: all 0.3s ease;

  &.border-1px {
    border-color: #e11d48;
    background: #fef2f2;
  }
}

input {
  background: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
  }

  &::-webkit-input-placeholder {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
  }

  &::-moz-placeholder {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
  }

  &:-ms-input-placeholder {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
  }

  &.color-#E11D48 {
    color: #e11d48;
  }
}
</style>
<route lang="json5">
{
  name: 'loan',
  meta: {
    title: 'loan',
    i18n: 'loan'
  },
}
</route>

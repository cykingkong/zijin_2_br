<template>
  <div class="credit-loan min-h-100vh  pb-60px">
    <CloseButton @close="onBack" :title="t('Credit Loan')" class="mb-48px">
    </CloseButton>
    <div class="px-24">
       <div class="content bg-#fff rounded-24px px-24px py-48px min-h-400px">
      <div class="img w-168px mx-auto">
        <img src="@/assets/image/creditLoanImg.png" alt="" class="w-full h-full">
      </div>
      <div class="text color-#334155 text-20px font-bold text-center mt-77px mb-8px line-height-140%">
        {{ t('Credit loans to help you invest in your Dreams') }}
      </div>
      <div class="tips text-#64748B text-12px font-200 text-center line-height-170%  mb-126px">{{
        t("Submit your information and your credit will be evaluated based on your information.") }}</div>
      <div class="button w-full">
        <van-button type="primary" class="h-56px" :color="loanData.status == 0 ? '#ddd' : '#6B39F4'" block @click="handleClick">
          {{ t('Apply for a loan') }}
        </van-button>
      </div>
    </div>
    </div>
   
    <!-- <VanNavBar title="" :fixed="true" clickable :left-arrow="true" placeholder @click-left="onBack" z-index="999"
        class="transparent-navbar">
        <template #title>
          {{ t('creditLoan') }}
        </template>
</VanNavBar> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import CloseButton from "@/components/CloseButton.vue";
import {loanIndex} from "@/api/ipo";
const activeIndex = ref(0);
const loanData = ref<any>({
  status: 0,
});
onMounted(async () => {
  let res = await loanIndex({});
  if(res.code == 200){
    loanData.value = res.data;
  }
})
const { t } = useI18n();
const changeTab = (index: number) => {
  activeIndex.value = index;
};
const router = useRouter();
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
const handleClick = () => {
    console.log(loanData.value)

  if(loanData.value.status == 0){
    showToast(t('Under review'))
    return 
  }else if(loanData.value.status == 1){
    router.push({ path: '/creditLoan/loan' });
  }
}
</script>

<route lang="json5">
{
  name: 'creditLoan',
  meta: {
    title: 'Credit Loan',
    i18n: 'creditLoan'
  },
}
</route>
<style scoped lang="less">
.credit-loan {
  height: 100%;
  background: radial-gradient(111.3% 149.35% at 104.4% 132.04%, #0F172A 13.53%, #6B39F4 33.44%, #0F172A 73.12%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */
  ;

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
</style>

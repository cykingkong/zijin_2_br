<!-- 充值 -->
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLoadingStore } from '@/stores/modules/loading'
import { optimizeRichText } from '@/utils/richText';
import { useUserStore } from '@/stores'
import { deposit, rechargeConfig } from '@/api/billing'
import item from '../../../components/item.vue'
import BottomButton from '@/components/bottom-button.vue'
import { addCommasToNumber } from '@/utils/tool';

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const info = ref<any>()
const count = ref(null)
const displayValue = ref('')
const { t } = useI18n()
const { proxy } = getCurrentInstance()!
const loadingStore = useLoadingStore()
const showPicker = ref(false);
const selected = ref(-1)
const methodsList = ref([])
const rechargeContent = ref("")
// 数字键盘布局数据
const keypadRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [".", "0", "delete"],

]

// 统一的按键处理方法
function handleKeyClick(key: string) {
  if (key === 'delete') {
    deleteLastChar()
  } else if (key === ".") {
    appendDecimal();
  }
  else {
    appendNumber(key)
  }
}
function onSelect() {
  router.replace('/wallet/exchange/channel-out')
}

// 添加小数点方法
const appendDecimal = () => {
  // 如果已经包含小数点，则不允许再添加
  if (displayValue.value.includes(".")) {
    return;
  }

  // 如果当前值为空或0，则添加0.
  if (displayValue.value === "" || displayValue.value === "0") {
    displayValue.value = "0.";
  } else {
    displayValue.value += ".";
  }

  // 更新count值
  count.value = displayValue.value === "" ? 0 : parseFloat(displayValue.value);
};
async function handleBuyClickOriginal() {
  // 处理购买逻辑
  console.log('购买金额:', count.value)
  console.log('购买信息:', info.value)
  // 这里可以添加购买确认、API调用等逻辑
  const { data, code } = await deposit({
    amount: count.value,
    methodId: info.value.id,
  })
  if (code === 200) {
    // if (data.type == 'bank') {
    setTimeout(() => {
      window.location.href = data.payUrl
    }, 40)
    return
    // }
    if (data.type == 'crypto') {
      let cInfo = {
        ...data,
        amount: count.value,
      }
      localStorage.setItem('cryptoInfo', JSON.stringify(cInfo))
      setTimeout(() => {
        router.push({
          path: '/wallet/exchange/deposit-preview',
          replace: true,
        })
      }, 400)
    }
  }
}
const onConfirm = proxy!.$throttle(handleBuyClickOriginal, 1000, {
  onStart: () => loadingStore.show(),
  onEnd: () => loadingStore.hide(),
})

// 数字键盘相关方法
function appendNumber(num: string) {
  if (displayValue.value === "0" && num !== ".") {
    displayValue.value = num;
  } else {
    displayValue.value += num;
  }
  // 更新count值
  count.value = displayValue.value === "" ? 0 : parseFloat(displayValue.value);
}

function deleteLastChar() {
  if (displayValue.value.length > 0) {
    displayValue.value = displayValue.value.slice(0, -1)
    // 如果删除后为空，则count为0，否则解析数值
    count.value = displayValue.value === '' ? 0 : Number.parseInt(displayValue.value)
  }
}

// 更新info的函数
function updateInfo() {
  const dataInfo = localStorage.getItem('payType')
  if (dataInfo) {
    try {
      // 如果dataInfo是JSON字符串，则解析为对象
      info.value = JSON.parse(dataInfo)
    }
    catch (error) {
      // 如果不是JSON格式，直接赋值字符串
      info.value = dataInfo
    }
  }
  else {
    info.value = null
  }
}
const minAmount = ref(0)
const amountArr = ref([])

onMounted(() => {
  // 初始获取localStorage中的dataInfo
  updateInfo()
  rechargeConfig().then(({ data, code }) => {
    if (code === 200) {
      minAmount.value = Number(data.settings.find((item: any) => item.key == 'recharge_min_amount').value)
      amountArr.value = data.settings.find((item: any) => item.key == 'recharge_number').value ? data.settings.find((item: any) => item.key == 'recharge_number').value?.split(',') : []
      methodsList.value = data.methods;
      rechargeContent.value = data.rechargeContent || ""
      selected.value = methodsList.value[0].id
      info.value = methodsList.value[0]
    }
  })
  // 监听localStorage变化
  window.addEventListener('storage', (e) => {
    if (e.key === 'dataInfo') {
      updateInfo()
    }
  })
})

// // 页面离开时清空payType
// onBeforeUnmount(() => {
//   localStorage.removeItem("payType");
// });

// 使用watch监听info的变化（可选，用于调试）
watch(
  info,
  (newValue) => {
    console.log('info已更新:', newValue)
  },
  { deep: true },
)

const router = useRouter()
function onBack() {
  if (window.history.state.back)
    history.back()
  else router.replace('/')
}
</script>

<template>
  <div class="cashier-center-content w-full px-12 pb-120 bg-[#f7f7f7]">
    <VanNavBar :title="`${t('Deposit')}`" :fixed="true" clickable :left-arrow="true" z-index="999" @click-left="onBack">
      <template #title>
        <div class="text-[16px] color-[#0F172A] font-bold">
          {{ t("Deposit") }}
        </div>
      </template>
    </VanNavBar>
    <div v-if="info" class="info mt-32">
      <div class="text-[14px] mt-[57px] text-center">{{ t("Withdrawal account") }}</div>
      <div class="min-count mx-a  overflow-y-auto text-center font-size-[24px] text-[#0F172A] font-bold">
        R$ {{ count || '0' }}
      </div>
      <div class="text-[14px] mt-[20px] text-center">{{ t("累计充值:") }}R$ {{ addCommasToNumber(userInfo.rechargePrice) ||
        '0.00' }}</div>

      <div class="mt-[30px] ">
        <div class="px-12 py-[20px] bg-[#fff] rounded-[20px] flex-col flex gap-12 card">
          <div class="label  " :class="['flex items-center gap-4']"">
            {{ t('Top-up Amount') }}
          </div>
          <div class=" phone-input">
            <inputCom :placeholder="t('PleaseEnterAmount')" v-model:value="count" :tips="''" class="flex-1 w-full">
            </inputCom>
          </div>
          <div class="label mb-8 " :class="['flex items-center gap-4']"">
            {{ t('Top-up Amount') }}
          </div>
          <div class=" grid grid-cols-3 gap-[10px]">
            <div
              class="grid-item rounded-[12px] h-[92px] flex flex-col justify-center items-center gap-[10px] py-12 bg-[#F7F7F7]"
              v-for="(item, index) in methodsList" :key="index" :class="{ 'active-item': selected === item.id }"
              @click="selected = item.id">
              <svg class="w-28 h-28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_5701_58988)">
                  <rect width="28" height="28" rx="8" fill="green" fill-opacity="0.05" />
                  <path
                    d="M16 16.3333C16 18.7267 14.06 20.6667 11.6667 20.6667C9.27337 20.6667 7.33337 18.7267 7.33337 16.3333C7.33337 13.94 9.27337 12 11.6667 12C11.78 12 11.9 12.0067 12.0134 12.0133C14.1267 12.18 15.82 13.8733 15.9867 15.9867C15.9934 16.1 16 16.22 16 16.3333Z"
                    :fill="selected == item.id ? '#000' : '#8C91A2'" />
                  <path opacity="0.4"
                    d="M20.6667 11.6668C20.6667 14.0602 18.7267 16.0002 16.3333 16.0002C16.22 16.0002 16.1 15.9935 15.9867 15.9868C15.82 13.8735 14.1267 12.1802 12.0133 12.0135C12.0067 11.9002 12 11.7802 12 11.6668C12 9.2735 13.94 7.3335 16.3333 7.3335C18.7267 7.3335 20.6667 9.2735 20.6667 11.6668Z"
                    fill="#8C91A2" />
                  <path
                    d="M9.7267 7.3335H8.00004C7.63337 7.3335 7.33337 7.6335 7.33337 8.00016V9.72683C7.33337 10.3202 8.05337 10.6202 8.47337 10.2002L10.2 8.4735C10.6134 8.0535 10.32 7.3335 9.7267 7.3335Z"
                    :fill="selected == item.id ? '#000' : '#8C91A2'" />
                  <path
                    d="M18.2733 20.6667H20C20.3666 20.6667 20.6666 20.3667 20.6666 20V18.2733C20.6666 17.68 19.9466 17.38 19.5266 17.8L17.8 19.5267C17.3866 19.9467 17.68 20.6667 18.2733 20.6667Z"
                    :fill="selected == item.id ? '#000' : '#8C91A2'" />
                </g>
                <defs>
                  <clipPath id="clip0_5701_58988">
                    <rect width="28" height="28" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <div class="text-[#161616] text-[12px] font-bold">
                {{ item.method }}
              </div>


            </div>
          </div>
          <van-button type="primary" class="h-[56px]" color="#1b1b1b" block @click="onConfirm">
            {{ t(`Deposit Preview`) }}
          </van-button>
        </div>
      </div>
    </div>


    <div class="v-html" v-html="optimizeRichText(rechargeContent)"></div>
    <!-- <BottomButton :button-text="" color="#1B1B1B" @click="onConfirm" /> -->
    <!-- <van-popup v-model:show="showPicker" destroy-on-close round :position="'bottom'" :safe-area-inset-bottom="true">
      <div class="p-12">
        <div class="top w-32 h-4 bg-[#f0f0f0] mx-auto mb-32"></div>
        <div
          class="add-bank-li mb-12 h-52 border border-[#f0f0f0] border-solid rounded-[16px] p-[12px] flex justify-between items-center"
          v-for="(item, index) in methodsList" :key="index"
          @click="selected = item.id; showPicker = false; info = item;">
          <div class="name text-[#0F172A] text-[14px] font-bold">
            {{ item.method }}
          </div>
          <div
            class="picker border border-[#f0f0f0] border-solid rounded-[4px] w-16 h-16 flex justify-center items-center"
            :class="selected == item.id ? 'bg-[#F47C3E]' : ''">
            <svg v-if="selected == item.id" class="w-10 h-10" viewBox="0 0 10 10" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M8.33341 2.70825L3.75008 7.29159L1.66675 5.20825" stroke="white" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </div>
        </div>
      </div>
    </van-popup> -->

  </div>
</template>

<style lang="less" scoped>
.cashier-center-content {
  padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
}


.dot {
  flex-shrink: 0;
  margin-top: 8px;
}

.active-item {
  border: 1px solid #161616;
  box-shadow: 0px 3px 4px 0px #00000026;

  box-shadow: 0px 2px 3px 0px #0000004D;

  box-shadow: 0px -3px 0px 0px #00000029 inset;

  box-shadow: 0px 2px 2px 0px #FFFFFFCC inset;

}

.phone-input {
  border: 1px solid #F0F0F0;
  border-radius: 12px;

  :deep(.input-box) {
    /* height: 48px; */
    margin-top: 0px;


  }

  :deep(.tips) {
    margin-bottom: 0px;
  }
}

.card {
  border: 1px solid #0000001A
}
</style>
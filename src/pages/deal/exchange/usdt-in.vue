<template>
  <div class="exchange-in-content p-12">
    <div class="t font-size-16   ">请选择充值币种</div>
    <div class="flex w-full gap-12 my-12 ">
      <div class="channel-item  rounded-10 flex-1 text-align-center py-12" v-for="(item, index) in tabList"
        :class="{ 'active': index == active }" @click="handleClickTab(index)">
        <img :src="item.icon" alt="" class="block w-55px h-55px mx-auto">
        <div class="font-size-12 mt-12">{{ item.name }}充值</div>
      </div>
    </div>

    <inputCom :label="'充值数量'" :placeholder="'请输入'" v-model:value="form.num" :tips="''">
    </inputCom>
    <div class="tab-box flex gap-12">
      <div class="tab-item p-12 font-size-16 rounded-10px " v-for="(item, index) in btnList"
        @click="handleClickAupay(index)" :class="{ 'active-item': index == activeBtn }" :key="index">
        {{ item.label }}
      </div>
    </div>
    <div v-if="showQrCode" class="qrcode-container mt-20 text-center mx-auto">
      <QrcodeVue ref="qrCodeRef" :value="qrValue" :size="200" level="H" render-as="canvas" class="mx-auto" />
    </div>
    <div class="w-120 mt-12 mx-auto">

      <van-button type="primary" block @click="safeQrcode">保存二维码</van-button>

    </div>
    <div class="font-size-14 mt-12 text-#1678FF text-align-center">{{ qrValue }}</div>

    <div class="w-120 mt-12 mx-auto">

      <van-button type="primary" class="h-30!" plain block @click="copyQrValue">复制地址</van-button>

    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Toast, showToast } from 'vant';
import { aupay_notify, mgm_notify, qeawapay_notify } from '@/api/payment'
import QrcodeVue from 'qrcode.vue'
import btcIcon from '@/assets/btc_icon.png'
import trxIcon from '@/assets/trx_icon.png'
import ethIcon from '@/assets/eth_icon.png'
const tabList = [
  { name: 'BTC', icon: btcIcon },
  { name: 'TRX', icon: trxIcon },
  { name: 'ETH', icon: ethIcon },
]
let form = reactive({ num: '' })
const btnList = computed(() => {
  if (active.value == 0) {
    return [
      { label: 'ERC20', value: 'ERC20' }, { label: 'TRC20', value: 'TRC20' },
    ]
  } else if (active.value == 1) {
    return [{ label: 'BTC', value: 'https://penkn.com/syn/ ' }]
  } else if (active.value == 2) {
    return [{ label: 'ERC20', value: '0xcccccccccccccccccccccc' }]
  }
})
const active = ref(0)
const router = useRouter()
const toUrl = (url) => {
  router.push({ path: url })
}

const showQrCode = ref(true) // 默认显示二维码
const qrValue = ref('')
const activeBtn = ref(0)

// 页面加载时初始化第一个二维码
onMounted(() => {
  qrValue.value = btnList.value[0].value
})
const handleClickTab = (index) => {
  active.value = index
  qrValue.value = btnList.value[activeBtn.value].value

}
const handleClickAupay = (index) => {
  activeBtn.value = index
  showQrCode.value = true
  qrValue.value = btnList.value[activeBtn.value].value
}
// 保存二维码图片
const qrCodeRef = ref<InstanceType<typeof QrcodeVue>>()
import { nextTick } from 'vue'

const safeQrcode = async () => {

}

// 复制二维码文本内容
const copyQrValue = async () => {
  try {
    await navigator.clipboard.writeText(qrValue.value)
    showToast('地址已复制到剪贴板')
  } catch (err) {
    showToast('复制失败，请手动选择复制')
    console.error('复制失败:', err)
  }
}

const handleClickQeawapay = () => {
  qeawapay_notify({}).then(res => {
    if (res.code == 200) {
      // toUrl('/deal/exchange/usdt-in-qeawapay')
    }
  })
}

</script>
<style lang="less" scoped>
:deep(.van-cell) {
  --van-cell-background: #131a2e;
}

.channel-item {
  border: 1px solid #1678FF;
}

.tab-item {
  border: 1px solid;
  border-color: #fff;
}

.active {
  background: #116677b0;
}

.active-item {
  border-color: #1678FF;
  background: #116677b0;

}

.qrcode-container {
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  display: block;
  width: 224px;

}
</style>

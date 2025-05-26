<template>
    <div class="color-blueGray-400 charge-bank-page p-12">
        <div class="color-blueGray-400 t font-size-18">提币USDT</div>
        <div class="tips color-[#f43368] my-12">请将余额转至美元账户再提款</div>
        <inputCom class="mt-12" :label="'请选择币种'" :placeholder="''" v-model:value="form.assetId" :type="'picker'">
            <div class="w-full flex justify-between">
                <div class="l flex-1 font-size-14" @click="showPicker = true">{{ form.assetId ? form.assetIdText :
                    '请选择币种'
                }}</div>
                <div class="r flex-shrink-0">
                    <van-icon name="arrow" class="rotate-90" />
                </div>
            </div>
        </inputCom>
        <div class="tab-title font-size-14 mb-12">
            区块链网络
        </div>
        <div class="tab-box flex gap-12 mb-12">
            <div class="tab-item p-12 font-size-16 rounded-10px " v-for="(item, index) in btnList"
                @click="handleClickNetwork(index)" :class="{ 'active-item': index == activeBtn }" :key="index">
                {{ item.label }}
            </div>
        </div>
        <inputCom :label="'地址'" :placeholder="'请输入地址'" v-model:value="form.address">
        </inputCom>
        <inputCom :label="'充值数量'" :placeholder="'请输入提币数量'" :input-type="'number'" v-model:value="form.amount"
            :tips="tips" class="mb-12">
            <template #sendCode>
                <div class="absolute right-0 font-size-12 top-3 sendCode ">
                    USDT <span class="text-blue-500" @click="maxAmount">全部</span>
                </div>
            </template>
        </inputCom>
        <div class="li flex justify-between font-size-14 mb-12">
            <div class="l">可用</div>
            <div class="r">{{ addCommasToNumber(Number(networkInfo.balance)) }} {{ networkInfo.symbol }}</div>
        </div>
        <div class="info color-blueGray-400 font-size-14 line-height-28 mb-12">
            <div class="li flex ">
                可到账数量
            </div>
            <div class="li ">
                <span class="num color-white font-500">{{ addCommasToNumber(Number(canWithdrawAmount)) }} </span> {{
                    networkInfo.symbol
                }}
            </div>
            <div class="li mb-12">提现费用：{{ addCommasToNumber(Number(form.amount) - Number(canWithdrawAmount)) }} USDT
            </div>
            <div class="li mb-6">提币说明：</div>
            <div class="html font-size-12" v-html="html"></div>
        </div>

        <van-button type="primary" block @click="orderInfoShow = true">提交</van-button>
        <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
            <van-picker :columns="columns" :model-value="[form.methodId]" @confirm="onConfirm"
                @cancel="showPicker = false" />
        </van-popup>
        <van-popup v-model:show="orderInfoShow" destroy-on-close position="bottom" :safe-area-inset-bottom="true"
            :closeable="true">
            <div class="order-info-content text-align-center p-12 text-blueGray-400">
                <div class=" font-size-20 mb-16">确认订单</div>
                <div class="t2 font-size-16 mb-12">实际到账</div>
                <div class="num font-size-22 mb-12"><span class="price text-white font-500">{{
                    addCommasToNumber(Number(canWithdrawAmount)) }} </span> USDT</div>
                <div class="li flex justify-between font-size-16 mb-12">
                    <div class="l text-white">提币地址</div>
                    <div class="v">{{ form.address }}</div>
                </div>
                <div class="li flex justify-between font-size-16 mb-12">
                    <div class="l text-white">主网络</div>
                    <div class="v">222</div>
                </div>
                <div class="li flex justify-between font-size-16 mb-12">
                    <div class="l text-white">提现来源账户</div>
                    <div class="v">钱包账户</div>
                </div>
                <div class="divdiver w-full h-1px bg-blueGray-400 my-12"></div>
                <div class="li flex justify-between font-size-16 mb-12">
                    <div class="l text-white">币种</div>
                    <div class="v">{{ networkInfo.symbol }}</div>
                </div>
                <div class="li flex justify-between font-size-16 mb-12">
                    <div class="l text-white">金额</div>
                    <div class="v">{{ networkInfo.symbol }} {{ form.amount }}</div>
                </div>
                <div class="li flex justify-between font-size-16 mb-12">
                    <div class="l text-white">网络手续费</div>
                    <div class="v">{{ networkInfo.symbol }} {{ addCommasToNumber(Number(form.amount) -
                        Number(canWithdrawAmount))
                    }}</div>
                </div>
                <div class="tips text-align-left mb-12"> 1. 请确保您输入了正确的提币地址并且您选择的转账网络与地址相匹配</div>
                <div class="tips text-align-left mb-12"> 2. 提币订单创建后不可取消。</div>
                <van-button type="primary" block @click="handleClickSubmit()">确定</van-button>
            </div>
        </van-popup>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { coinWithdrawConfig, coinRechargeConfig, withdraw } from '@/api/recharge'
import { useLoadingStore } from '@/stores/modules/loading'
import { addCommasToNumber } from "@/utils/tool"
import { useStore } from '@/stores/modules/index';
const store = useStore()
const loadingStore = useLoadingStore()
const { proxy } = getCurrentInstance()
const priceTabArr = ref([])
const tips = ref('')
const columns = ref([])
const showPicker = ref(false)
const orderInfoShow = ref(false)
const html = `<div class="text-grey mt-2 text-14" >·提币时间为24小时。 <br>
·目前提币只支持USDT币种。<br>
·提交提币申请后，该笔资金属于冻结状态是因为提现正在进行中，该笔资金暂时由系统托管，并不代表您损失了这笔资产或资产出现异常。 <br>
·提交提币申请后12h内到账，如预计提币时间后未到账请咨询在线客服。</div>`
const active = ref(0)
const router = useRouter()
const activeBtn = ref(0)
const btnList = ref([])
const configData = ref([])
const form = reactive({
    amount: '',
    assetIdText: '',
    assetId: 0,
    "address": "",
    "cardId": 0,
    "networkId": "",
    "type": 1
})
const networkInfo = ref({
    balance: 0,
    symbol: 'USDT',
    withdrawFee: 0
})
watch(() => form.assetId, (val) => {
    if (configData.value.length === 0) return
    const data = configData.value.find(item => item.method.id === val)
    btnList.value = data.network.map((e) => {
        return {
            label: e.name,
            value: e.id
        }
    })
    form.networkId = data.network[0].name;
    networkInfo.value = data.network[0];
    tips.value = `最小提现金额 ${data.network[0].minWithdraw} 最大提现金额 ${data.network[0].maxWithdraw} `
    console.log(form, 'data')
})
const canWithdrawAmount = computed(() => {
    if (networkInfo.value) {
        if (networkInfo.value.withdrawFee == 0) return Number(form.amount)
        return Number(form.amount) * (1 - networkInfo.value.withdrawFee / 100)
    }
    return 0
})
const handleClickNetwork = (index) => {
    activeBtn.value = index
    // form.networkId = btnList.value[index].value
    networkInfo.value = configData.value.find(item => item.method.id === form.assetId).network[index]
    console.log(form, 'data', networkInfo.value)
}
const getRechargeConfig = async () => {
    coinWithdrawConfig({ mode: 'gp' }).then(res => {
        // priceTabArr.value = res.data.settings.find(item => item.key === 'recharge_number').value.split(',')
        // tips.value = `充值范围${res.data.settings.find(item => item.key === 'recharge_min_amount').value}-10000000000`
        configData.value = res.data
        columns.value = res.data.map((e) => {
            return {
                text: e.method.name,
                value: e.method.id
            }
        })
        form.assetId = res.data[0].method.id
        form.assetIdText = res.data[0].method.name
        btnList.value = res.data[0].network.map((e) => {
            return {
                label: e.name,
                value: e.id
            }
        })
    })
}
const onConfirm = ({ selectedValues, selectedOptions }) => {
    form.methodId = selectedValues[0];
    form.methodIdText = selectedOptions[0].text
    console.log(form, selectedValues)
    showPicker.value = false
}
const maxAmount = () => {
    form.amount = Number(networkInfo.value.balance)
}
const handleClickSubmitOriginal = async () => {
    if (!form.amount) {
        showToast('请输入金额')
        return
    }
    if (Number(form.amount) < Number(networkInfo.value.minWithdraw)) {
        showToast(`最小提现金额为${networkInfo.value.minWithdraw}`)
        return
    }
    if (Number(form.amount) > Number(networkInfo.value.maxWithdraw)) {
        showToast(`最大提现金额为${networkInfo.value.maxWithdraw}`)
        return
    }
    if (!form.address) {
        showToast('请输入提币地址')
        return
    }
    if (!form.networkId) {
        showToast('请选择网络')
        return
    }
    let params = {
        assetId: form.assetId,
        amount: form.amount,
        methodId: form.assetId,
        address: form.address,
        networkId: form.networkId,
        type: 2,

    }
    console.log(store, 'params')
    store.setWithdrawParams(params)
    router.push('/deal/exchange/securityVerification')
    // const { data, code } = await withdraw(params)
    // if (code === 200) {
    //     showToast('提交充值成功')
    //     getRechargeConfig();
    //     orderInfoShow.value = false
    // }
}
const handleClickSubmit = proxy!.$throttle(handleClickSubmitOriginal, 1000, {
    onStart: () => loadingStore.show(),
    onEnd: () => loadingStore.hide()
});
onMounted(() => {
    getRechargeConfig()
})
</script>
<style lang="less" scoped>
.price-item {
    width: 33%;
    border: 1px solid #1678FF;

}

.active-item {
    border-color: #1678FF;
    background: #1678FF;
    color: #fff
}

.tab-item {
    border: 1px solid;
    border-color: #fff;
}

.active {
    background: #116677b0;
}

.charge-bank-page {
    padding-bottom: calc(env(safe-area-inset-bottom) + 24px);
}
</style>

<template>
    <div class="add-content p-12 flex flex-col gap-24">
        <nationalityList ref="controlChildRef" :title="'选择'" @getName="getName"></nationalityList>

        <inputCom :label="'订单'" :placeholder="''" v-model:value="t" :type="'picker'" require>
            <div class="w-full flex justify-between">
                <div class="l flex-1 font-size-14" @click="showPicker = true">{{ form.bankType ? form.bankType :
                    '请选择银行卡类型'
                    }}</div>
                <div class="r flex-shrink-0">
                    <van-icon name="arrow" class="rotate-90" />
                </div>
            </div>
        </inputCom>
        <inputCom :label="'银行卡名称'" :placeholder="'请输入银行卡名称'" v-model:value="form.bankName" :tips="''" require>
        </inputCom>
        <inputCom :label="'持有人名称'" :placeholder="'请输入持有人名称'" v-model:value="form.receiveName" :tips="''" require>
        </inputCom>
        <inputCom :label="'持有人帐号'" :placeholder="'请输入持有人帐号'" v-model:value="form.receiveAccount" :tips="''" require>
        </inputCom>

        <inputCom :label="'手机号'" :placeholder="'请输入手机号'" v-model:value="form.receivePhone" :tips="''" require>
            <template #picker>
                <div class="picker-box pr-8 mr-6  h-full flex items-center gap-8" @click="hanleClickAreaPick">
                    <!-- <img :src="icon1" alt="" class="w16 h16"> -->
                    <div class="iti-flag mr-10" :class="areaInfo?.code" style="transform: scale(1.5)"></div>
                    <div class="num">+{{ areaInfo?.dialCode }}</div>
                </div>
            </template>
        </inputCom>
        <inputCom :label="'税号'" :placeholder="'请输入税号'" v-model:value="form.receiveCpf" :tips="''" require></inputCom>
        <inputCom :label="'其他(PIX密钥/CNPJ税号)'" :placeholder="''" v-model:value="form.other" :tips="''"
            :require="result == 'PIX' || result == 'CNPJ'"></inputCom>
        <div class="tips-box rounded-10 p-12">
            <div class="t flex font-size-16">温馨提示</div>
            <div class="t-c  font-size-12 mt-12 font-wight-500 color-blueGray-400">
                請確保添加您的銀行卡號進行即時付款。請勿包含其他銀行或付款方式的詳細信息。您必須添加所選銀行的付款/收款信息
            </div>
        </div>
        <div class="t2 font-size-12 color-blueGray-400">溫馨提示：當您出售數字貨幣時，您選擇的收款方式將向買方展示，請確認信息填寫準確無誤。</div>
        <div class="w-full flex flex-col gap-12">
            <van-button type="primary" block @click="handleClickSubmit">提交</van-button>
            <van-button type="danger" block @click="handleClickDel" v-if="isEdit">删除</van-button>
        </div>

        <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
            <van-picker :columns="columns" :model-value="[form.bankType]" @confirm="onConfirm"
                @cancel="showPicker = false" />
        </van-popup>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import setPageTitle from "@/utils/set-page-title";
import inputCom from "@/components/inputCom.vue";
import { userCardAdd, userCardUpdate, userCardDel } from "@/api/payment";
import { useStore } from "@/stores/modules/index";
import { showToast } from "vant";
import nationalityList from '@/components/nationality-list/nationalityList.vue'

const t = ref('notk')
const typeDesc = ['所有银行卡', '虚拟货币支付']
const showPicker = ref(false);
const result = ref('');
const store = useStore()
const isEdit = ref(false)
const pickerValue = ref([]);
const columns = [
    { text: 'PIX', value: 'PIX' },
    { text: 'CPF', value: 'CPF' },
    { text: 'CNPJ', value: 'CNPJ' },
];
const form = reactive({
    id: 0,
    type: '',
    typeDesc: '',
    network: '',
    bankType: '',
    receiveCpf: '',
    address: '',
    currency: '',
    bankName: "",
    receiveName: '',
    receiveAccount: '',
    receivePhone: '',
    other: ''
})
const route = useRoute();
const router = useRouter();
const onConfirm = ({ selectedValues, selectedOptions }) => {
    result.value = selectedOptions[0]?.text;
    pickerValue.value = selectedValues;
    form.bankType = selectedOptions[0]?.text;
    showPicker.value = false;

};
const areaInfo = ref({
    code: "br",
    dialCode: 55,
    key: "br",
    name: ""
})
const getName = (val: any) => {
    areaInfo.value = val
}
const controlChildRef = ref()
const hanleClickAreaPick = () => {
    controlChildRef.value.open();

    // areaPopRef.value.popShow()
}
const handleClickDel = () => {
    userCardDel({ id: form.id }).then(res => {
        if (res.code == 200) {
            showToast("删除成功")
            setTimeout(() => {
                router.push('/profile/payMentMethod/list')
            }, 500);
        }
    })
}
const handleClickSubmit = () => {
    // 校验必填
    if (!form.bankName) {
        return
    }
    if (!form.receiveName) {
        return
    }
    if (!form.receiveAccount) {
        return
    }
    if (!form.receivePhone) {
        return
    }
    if (!form.receiveCpf) {
        return
    }
    if (['PIX', 'CNPJ'].includes(result.value) && !form.other) {
        return
    }
    let area = areaInfo.value?.dialCode
    let params = {
        ...form,
    }
    params.receivePhone = area + form.receivePhone
    if (route.query.edit == '1') {
        userCardUpdate(params).then(res => {
            if (res.code == 200) {
                showToast("修改成功")
                setTimeout(() => {
                    router.push('/profile/payMentMethod/list')
                }, 500);
                // 跳转
                return
            }
        })
        return


    }
    // 提交
    userCardAdd(params).then(res => {
        if (res.code == 200) {
            showToast("添加成功")
            // 跳转
            setTimeout(() => {
                router.push('/profile/payMentMethod/list')
            }, 500);
        }
    })
}
onMounted(() => {
    const isEditMode = route.query.edit === '1';
    const newTitle = isEditMode ? '编辑银行卡' : '添加银行卡';
    // 更新浏览器标题
    setPageTitle(newTitle);
    // 更新路由meta标题（用于导航栏显示）
    router.currentRoute.value.meta.title = newTitle;
    form.type = route.query.type == '1' ? 'bank_card' : 'crypto'
    form.typeDesc = typeDesc[Number(route.query.type)]
    if (route.query.edit == '1') {
        isEdit.value = true
        let item = store.userCardList[Number(route.query.index)]
        console.log(item)
        form.bankName = item.address.bankName
        form.bankType = item.address.bankType
        form.receiveName = item.address.receiveName
        form.receiveAccount = item.address.receiveAccount
        form.receivePhone = item.address.receivePhone
        form.receiveCpf = item.address.receiveCpf
        form.other = item.address.other
        form.id = item.id
        console.log(form, 23123)
    }
})
</script>
<style lang="less" scoped>
@import "@/components/nationality-list/intl.css";
</style>

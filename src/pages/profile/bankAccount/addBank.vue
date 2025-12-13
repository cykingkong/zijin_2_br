<template>
  <div class="add-content p-24 flex flex-col">
    <div class="label font-bold text-[16px] color-[#64748B]">
      {{ t("Bank") }}
    </div>
    <div class="phone-input my-[12px]">

      <inputCom :placeholder="''" v-model:value="bankCardType" :type="'picker'">
        <div class="w-full flex justify-between">
          <div class="l flex-1 font-size-14" :class="form.bankName ? '' : 'color-[#9CA3AF]'" @click="showPicker = true">
            {{ form.bankName ? form.bankName : t("PleaseSelect") }}
          </div>
          <div class="r flex-shrink-0">
            <van-icon receiveName="arrow" class="rotate-90" />
          </div>
        </div>
      </inputCom>
    </div>

    <div class="label font-bold text-[16px] color-[#64748B]">
      {{ t("Name") }}
    </div>
    <div class="phone-input my-[12px]">
      <inputCom v-model:value="form.receiveName" :placeholder="t('')" :onlyRead="false" :inputType="'text'">
      </inputCom>
    </div>

    <div class="label font-bold text-[16px] color-[#64748B]">
      {{ t("Account") }}
    </div>
    <div class="phone-input my-[12px]">
      <inputCom v-model:value="form.receiveAccount" :placeholder="t('')" :onlyRead="false" :inputType="'text'">
      </inputCom>
    </div>

    <div class="label font-bold text-[16px] color-[#64748B]">
      {{ t("Phone") }}
    </div>
    <div class="phone-input my-[12px]">

      <inputCom :placeholder="t('')" v-model:value="form.receivePhone" :tips="''">
      </inputCom>
    </div>

    <div class="label font-bold text-[16px] color-[#64748B]">
      {{ t("Email") }}
    </div>
    <div class="phone-input my-[12px]">

      <inputCom :placeholder="t('')" v-model:value="form.receiveEmail" :tips="''">
      </inputCom>
    </div>
    <BottomButton color="#1B1B1B" :button-text="t('Submit')" @click="handleClickSubmit"></BottomButton>


    <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
      <van-picker :columns="columns" :model-value="[form.bankCode]" @confirm="onConfirm" @cancel="showPicker = false" />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import setPageTitle from "@/utils/set-page-title";
import inputCom from "@/components/inputCom.vue";
import {
  create_bank,
  userCardUpdate,
  userCardDel,
  bank_info,
} from "@/api/payment";
import { useStore } from "@/stores/modules/index";
import { showToast, showSuccessToast, allowMultipleToast } from "vant";

import { bankList } from "@/api/user";
import local from "@/utils/local";
import nationalityList from "@/components/nationality-list/nationalityList.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const showPicker = ref(false);
const result = ref("");
const isEdit = ref(false);
const pickerValue = ref([]);
const columns = ref([]);
const getBankList = async () => {
  const { data, code } = await bankList({});
  if (code == 200) {
    columns.value =
      data && data.length
        ? data.map((item: any) => {
          return {
            text: item.bank_name,
            value: item.bank_code,
          };
        })
        : [];
  }
};
const bankCardType = ref("");
const form = reactive({
  type: "bank_card",
  receiveName: "",
  receiveAccount: "",
  bankCode: "",
  bankName: "",
  id: "",
  receivePhone: "",
  receiveEmail: "",
});
const route = useRoute();
const router = useRouter();
const onConfirm = ({ selectedValues, selectedOptions }) => {
  result.value = selectedOptions[0]?.text;
  pickerValue.value = selectedValues;
  form.bankName = selectedOptions[0]?.text;
  form.bankCode = selectedOptions[0]?.value;
  showPicker.value = false;
};
const areaInfo = ref({
  code: "br",
  dialCode: 55,
  key: "br",
  name: "",
});

const getCardInfo = () => {
  let res = local.getlocal('bankAccountInfo')

  form.receiveName = res.address.receiveName;

  form.receiveAccount = res.address.receiveAccount;
  form.receivePhone = res.address.receivePhone;
  form.receiveEmail = res.address.receiveEmail;
  form.bankName = res.address.bankName;
  form.bankCode = res.address.bankCode;
  form.id = res.id;

};
const handleClickSubmit = () => {
  // 校验必填
  if (!form.receiveName) {
    return;
  }
  if (!form.receivePhone) {
    return;
  }
  if (!form.receiveEmail) {
    return;
  }
  if (!form.receiveAccount) {
    return;
  }
  if (!form.bankName) {
    return;
  }

  let params = {
    ...form,
  };
  params.bankCode = params.bankCode + "";
  if (route.query.edit == "1") {
    userCardUpdate(params).then((res) => {
      if (res.code == 200) {
        showSuccessToast("");
        setTimeout(() => {
          router.replace("/profile/bankAccount");
        }, 500);
        // 跳转
        return;
      }
    });
    return;
  }
  // 提交
  create_bank(params).then((res) => {
    if (res.code == 200) {
      showSuccessToast("");
      // showToast("添加成功");
      // 跳转
      setTimeout(() => {
        router.replace("/profile/bankAccount");
      }, 500);
    }
  });
};
onMounted(() => {

  // // 更新浏览器标题
  // setPageTitle(newTitle);
  // // 更新路由meta标题（用于导航栏显示）

  // form.type = route.query.type == "1" ? "bank_card" : "crypto";
  // form.typeDesc = typeDesc[Number(route.query.type)];
  getBankList();
  if (route.query.edit == "1") {
    isEdit.value = true;
    getCardInfo();
    form.id = String(route.query.id);

    console.log(form, 23123);
  }
});
</script>
<style lang="less" scoped>
@import "@/components/nationality-list/intl.css";

.bottom-btn {
  bottom: calc(env(safe-area-inset-bottom) + 8px);
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  padding: 8px 24px 0;
}

.phone-input {

  border-radius: 12px;
  background: #F8F9FD;

  :deep(.input-box) {
    /* height: 48px; */
    margin-top: 0px;
    background: transparent;

    .max-input {
      background: transparent;

      input {
        background: transparent;
      }
    }
  }

  :deep(.tips) {
    margin-bottom: 0px;
  }
}
</style>
<route lang="json5">
  {
    receiveName: 'addBank',
    meta: {
      title: 'addBank',
      i18n: 'addBank'
    },
  }
  </route>
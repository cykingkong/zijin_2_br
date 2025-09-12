<template>
  <div class="add-content p-24 flex flex-col">
    <div class="label font-700 text-16px color-#64748B">
      {{ t("Name") }}
    </div>
    <inputCom
      :label="t('name')"
      :placeholder="t('PleaseEnter')"
      v-model:value="form.name"
      :tips="''"
      require
    >
    </inputCom>

    <div class="label font-700 text-16px color-#64748B">
      {{ t("Last Name") }}
    </div>
    <inputCom
      :label="t('lastname')"
      :placeholder="t('PleaseEnter')"
      v-model:value="form.lastname"
      :tips="''"
      require
    >
    </inputCom>

    <div class="label font-700 text-16px color-#64748B">
      {{ t("Bank") }}
    </div>
    <inputCom
      :label="t('bankCardType')"
      :placeholder="''"
      v-model:value="bankCardType"
      :type="'picker'"
      require
    >
      <div class="w-full flex justify-between">
        <div
          class="l flex-1 font-size-14"
          :class="form.bank_name ? '' : 'color-#9CA3AF'"
          @click="showPicker = true"
        >
          {{ form.bank_name ? form.bank_name : t("PleaseSelect") }}
        </div>
        <div class="r flex-shrink-0">
          <van-icon name="arrow" class="rotate-90" />
        </div>
      </div>
    </inputCom>
    <div class="label font-700 text-16px color-#64748B">
      {{ t("Account") }}
    </div>
    <inputCom
      :label="t('account')"
      :placeholder="t('PleaseEnter')"
      v-model:value="form.account"
      :tips="''"
      require
    >
    </inputCom>

    <div class="w-full flex flex-col gap-12 bottom-btn fixed left-0">
      <van-button
        type="primary"
        block
        @click="handleClickSubmit"
        color="#6B39F4"
        >{{ t("Submit") }}</van-button
      >
    </div>
    <nationalityList
      ref="controlChildRef"
      :title="t('Pick')"
      @getName="getName"
    ></nationalityList>

    <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
      <van-picker
        :columns="columns"
        :model-value="[form.bank_code]"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
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

import nationalityList from "@/components/nationality-list/nationalityList.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const typeDesc = ["所有银行卡", "虚拟货币支付"];
const showPicker = ref(false);
const result = ref("");
const store = useStore();
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
  wallet_type: "bank",
  name: "",
  lastname: "",
  account: "",
  bank_code: "",
  bank_name: "",
  id: "",
});
const route = useRoute();
const router = useRouter();
const onConfirm = ({ selectedValues, selectedOptions }) => {
  result.value = selectedOptions[0]?.text;
  pickerValue.value = selectedValues;
  form.bank_name = selectedOptions[0]?.text;
  form.bank_code = selectedOptions[0]?.value;

  showPicker.value = false;
};
const areaInfo = ref({
  code: "br",
  dialCode: 55,
  key: "br",
  name: "",
});
const getName = (val: any) => {
  areaInfo.value = val;
};
const getCardInfo = (id: any) => {
  bank_info({ id }).then((res) => {
    if (res.code == 200) {
      form.name = res.data.name;
      form.lastname = res.data.lastname;
      form.account = res.data.account;
      form.bank_name = res.data.bank_name;
      form.bank_code = res.data.bank_code;
      form.id = res.data.id;
    }
  });
};
const controlChildRef = ref();
const hanleClickAreaPick = () => {
  controlChildRef.value.open();

  // areaPopRef.value.popShow()
};
const handleClickDel = () => {
  userCardDel({ id: form.id }).then((res) => {
    if (res.code == 200) {
      showToast(t("Successfully deleted"));
      setTimeout(() => {
        router.push("/profile/payMentMethod/list");
      }, 500);
    }
  });
};
const handleClickSubmit = () => {
  // 校验必填
  if (!form.name) {
    return;
  }
  if (!form.lastname) {
    return;
  }
  if (!form.account) {
    return;
  }
  if (!form.bank_name) {
    return;
  }

  let params = {
    ...form,
  };
  params.bank_code = params.bank_code + "";
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
  const isEditMode = route.query.edit === "1";
  const newTitle = isEditMode ? "编辑银行卡" : "添加银行卡";
  // // 更新浏览器标题
  // setPageTitle(newTitle);
  // // 更新路由meta标题（用于导航栏显示）
  router.currentRoute.value.meta.title = newTitle;
  // form.type = route.query.type == "1" ? "bank_card" : "crypto";
  form.typeDesc = typeDesc[Number(route.query.type)];
  getBankList();
  if (route.query.edit == "1") {
    isEdit.value = true;
    getCardInfo(route.query.id);
    form.id = route.query.id;

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
</style>
<route lang="json5">
  {
    name: 'addBank',
    meta: {
      title: 'addBank',
      i18n: 'addBank'
    },
  }
  </route>
<template>
  <div class="add-content p-16 flex flex-col pb-90">
    <VanNavBar title="" :fixed="true" clickable :left-arrow="true" @click-left="onBack" placeholder z-index="999">
      <template #title>
        <div class="flex flex-items-center gap-6 font-size-[18px] font-bold">
          {{ isEdit ? t("Edit Bank") : t('Add Bank') }}
        </div>
      </template>
    </VanNavBar>
 <!-- 优化后的提示卡片 -->
    <div class="notice-card rounded-16 mb-12 p-12 flex gap-10 overflow-hidden relative bg-[#FEF2F2] border border-[#FECACA] border-solid">
      <!-- 左侧装饰条：增加视觉锚点 -->
      <div class="absolute left-0 top-0 bottom-0 w-[4px] bg-[#EF4444]"></div>
      
      <!-- 图标区域：使用 SVG 提升专业感 -->
      <div class="flex-shrink-0 mt-[2px]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 8V12" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 16H12.01" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- 文本内容区域：清晰的层级结构 -->
      <div class="flex-1">
        <div class="text-[14px] font-bold text-[#991B1B] mb-[4px] leading-tight">
          Apenas recebimento via NEQUI
        </div>
        <div class="text-[12px] text-[#7F1D1D] leading-[18px] font-normal">
          <p class="">As transferências serão feitas </p>
          <p class="mb-[4px] font-semibold text-[#991B1B] text-[14px]">exclusivamente por NEQUI</p>
          <p>Confirme se o nome e telefone estão corretos antes de enviar.</p>
        </div>
      </div>
    </div>

    <div class="p-16 rounded-20 bg-[#fff] card">
     
      <div class="label font-bold text-[16px] color-[#64748B]">
        {{ t("Phone Number") }}
      </div>
      <div class="phone-input my-[12px]">

        <inputCom :placeholder="t('')" v-model:value="form.phone" :tips="''">
        </inputCom>
      </div>

      <div class="label font-bold text-[16px] color-[#64748B]">
        {{ t("Realname") }}
      </div>
      <div class="phone-input my-[12px]">
        <inputCom v-model:value="form.name" :placeholder="t('')" :onlyRead="false" :inputType="'text'">
        </inputCom>
      </div>

      <div class="label font-bold text-[16px] color-[#64748B]">
        {{ t("NEQUI") }}
      </div>
      <div class="phone-input my-[12px]">
        <inputCom v-model:value="form.nequi" :placeholder="t('')" :onlyRead="false" :inputType="'text'">
        </inputCom>
      </div>

    </div>

    <BottomButton color="var(--btn-primary-bg)" :button-text="t('Submit')" @click="handleClickSubmit"></BottomButton>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue";
import {
  create_bank,
  userCardUpdate,
} from "@/api/payment";
import { showToast, showSuccessToast } from "vant";

import local from "@/utils/local";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const isEdit = ref(false);
const form = reactive({
  nequi: "",
  name: "",
  phone: "",
  id: "", 
   receiveName: "",
  receiveAccount: "",
  bankCode: "",
  bankName: "",
  CPF: "CCPPFF",
  receivePhone: "",
  receiveEmail: "123@gamil.com",
});
const route = useRoute();
const router = useRouter();
const getCardInfo = () => {
  let res = local.getlocal('bankAccountInfo')

  form.name = res.address.receiveName;
  form.nequi = res.address.receiveAccount;
  form.phone = res.address.receivePhone;
  form.id = res.id;

};

const handleClickSubmit = () => {
  // 校验必填
  if (!form.name) {
    showToast(t('PleaseEnterName'))
    return;
  }
  if (!form.phone) {
    showToast(t('PleaseEnterPhone'))
    return;
  }
  if (!form.nequi) {
    showToast(t('PleaseEnterNEQUI'))
    return;
  }

  let params = {
    ...form,
    type: "bank_card",
    receiveAccount: form.nequi,
    receiveName: form.name,
    receivePhone: form.phone,
  };
  if (route.query.edit == "1") {
    userCardUpdate({
      ...params,
      id: form.id,
    }).then((res) => {
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
function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}
onUnmounted(() => {
  local.removelocal('bankAccountInfo')
})
onMounted(() => {
  if (!local.getlocal('bankAccountInfo') && route.query.edit == "1") router.back()
  if (route.query.edit == "1") {
    isEdit.value = true;
    getCardInfo();
    form.id = String(route.query.id);
    isEdit.value = true
    console.log(route, 23123);
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
  border: 1px solid #F0F0F0;

  border-radius: 12px;
  // background: #F8F9FD;

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

.card {
  border: 1px solid #0000001A
}
</style>
<route lang="json5">
  {
    name: 'addBank',
    meta: {
    
    },
  }
  </route>
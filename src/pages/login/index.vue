<script setup lang="ts">
import { useRouter } from "vue-router";
import type { RouteMap } from "vue-router";
import { useUserStore } from "@/stores";
import inputCom from "@/components/inputCom.vue";
import nationalityList from "@/components/nationality-list/nationalityList.vue";
import { languageColumns, locale } from "@/utils/i18n";

import loginTab from "@/components/tab.vue";
import vw from "@/utils/inline-px-to-vw";

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const typeArr = [
  {
    label: `${t("input.Phone")}`,
    value: "phone",
  },
  {
    label: `${t("login.email")}`,
    value: "email",
  },
];
const areaInfo = ref({
  code: "br",
  dialCode: 55,
  key: "br",
  name: "",
});


const postData = reactive({
  account: "",
  password: "",
  type: "phone",
  code: "",
});
const changeIndex = (val: any) => {
  postData.type = typeArr[val].value;
};
const rules = reactive({
  email: [{ required: true, message: t("login.pleaseEnterEmail") }],
  password: [{ required: true, message: t("login.pleaseEnterPassword") }],
});

const controlChildRef = ref();
const hanleClickAreaPick = () => {
  controlChildRef.value.open();

  // areaPopRef.value.popShow()
};
const toRegister = () => {
  console.log("toRegister");
  try {
    router.push({ path: "/register" });
  } catch (e) {
    console.log(e);
  }
};
const toLogin = (type: number) => {
  router.push({ name: "login", query: { type: type.toString() } });
}
const toForget = () => {
  try {
    // router.push("/forgot-password?forgotType=3");
    router.push("/selectLoginType");
  } catch (e) {
    console.log(e);
  }
};
const getName = (val: any) => {
  areaInfo.value = val;
};

async function login(values: any) {
  if (!postData.password) {
    showToast("input.PleaseEnter");
    return;
  }
  try {
    loading.value = true;
    let area = areaInfo.value?.dialCode;
    let params = {
      ...postData,
    };
    if (postData.type == "phone") {
      params.account = `${area}${params.account}`;
    }
    await userStore.login({ ...params, ...values });
    // await userStore.info()
    localStorage.setItem("language", "pt-BR");
    locale.value = "pt-BR";
    const { redirect, ...othersQuery } = router.currentRoute.value.query;
    router.push({
      name: "home",
      query: {
        ...othersQuery,
      },
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="m-x-a w-full max-h-100vh">
    <div class="top-image w-full min-h-366px bg-#D3C4FC">

    </div>
    <div class="btn-box w-7xl m-x-a">
      <van-button type="primary" color="#6b39f4" class="login-btn" block @click="toLogin(1)">{{
        t("邮箱登陆")
        }}</van-button>
      <van-button type="primary" color="#6b39f4" class="login-btn" block @click="toLogin(2)">{{
        t("手机登陆")
        }}</van-button>
      <van-button type="primary" plain color="#6b39f4" class="login-btn" block @click="login({})">{{
        t("Continue with Apple")
        }}</van-button>
      <van-button type="primary" plain color="#6b39f4" class="login-btn" block @click="login({})">{{
        t("Continue with Google")
        }}</van-button>

      <div class="flex items-center mt-36px justify-center">
        Don’t have an account? <span @click="toForget()" class="ml-4px color-#6b39f4">
          {{ $t("Sign Up") }}
        </span>
      </div>
    </div>


  </div>
</template>

<route lang="json5">
{
  name: '',
  meta: {
    i18n: ''
  },
}
</route>
<style lang="less" scoped>
.login-btn {
  margin-top: 24px;
}
</style>
<style scoped>
@import "@/components/nationality-list/intl.css";
</style>
<script setup lang="ts">
import { useRouter } from "vue-router";
import type { RouteMap } from "vue-router";
import { useUserStore } from "@/stores";
import inputCom from "@/components/inputCom.vue";
import nationalityList from "@/components/nationality-list/nationalityList.vue";
import { languageColumns, locale } from "@/utils/i18n";
import { getKfUrlNew } from "@/api/user";
import Apple from "@/assets/image/Apple.svg";
import Google from "@/assets/image/Google.svg";
import loginTab from "@/components/tab.vue";
import vw from "@/utils/inline-px-to-vw";
import CryptoJS from "crypto-js";
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
  code: "mx",
  dialCode: 52,
  key: "mx",
  name: "Mexico",
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
async function initKfUrl() {
  const { data, code } = await getKfUrlNew();
  if (code == 200 && data) {
    setTimeout(() => {
      // window.open(kfUrl.value,'_blank');
      // 使用MD5加密生成游客UUid 时间戳 + 固定字符串
      let ykUUid = CryptoJS.MD5(`${Date.now()}+WTTexcellent`).toString();
      window.location.href = data.kf_url + `&uuid=${ykUUid}`;
    }, 40);
  }
}
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
};
const toForget = () => {
  try {
    // router.push("/forgot-password?forgotType=3");
    router.push("/register");
  } catch (e) {
    console.log(e);
  }
};
const getName = (val: any) => {
  areaInfo.value = val;
};

async function login(values: any) {
  if (!postData.password) {
    showToast("PleaseEnter");
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
  <div
    class="m-x-a w-full min-h-100vh pb-[calc(env(safe-area-inset-bottom)+24px)]"
  >
    <div class="top-image w-full min-h-366px bg-#D3C4FC">
      <img
        src="@/assets/image/login-bg.png"
        alt=""
        class="block w-full h-full"
      />
    </div>
    <div class="btn-box w-7xl m-x-a">
      <van-button
        type="primary"
        color="#6b39f4"
        class="login-btn"
        block
        @click="toLogin(1)"
        >{{ t("Phone Number Login") }}</van-button
      >
      <van-button
        type="primary"
        color="#6b39f4"
        class="login-btn"
        block
        @click="toLogin(2)"
        >{{ t("Email Account Login") }}</van-button
      >

      <!-- <van-button type="primary" plain color="#6b39f4" class="login-btn items-center" block @click="login({})">
        <template #default>
          <div class="flex items-center justify-center gap-8 color-#0F172A font-bold">
            <img :src="Apple" alt="" class="w-24px h-24px block">

            {{
              t("Continue with Apple")
            }}
          </div>
        </template>
</van-button>
<van-button type="primary" plain color="#6b39f4" class="login-btn items-center" block @click="login({})">
  <template #default>
          <div class="flex items-center justify-center gap-8 color-#0F172A font-bold">
            <img :src="Google" alt="" class="w-24px h-24px block">
            {{
              t("Continue with Google")
            }}
          </div>
        </template>
</van-button> -->
      <div
        class="kf-fixed fixed bottom-120px right-0 h-auto w-40 overflow-hidden rounded-12px"
        @click="initKfUrl"
      >
        <img
          src="@/assets/kf.png"
          class="block h-full w-full scale-[1.1] bg-white"
          alt=""
        />
      </div>
      <div class="mt-36px justify-center text-center">
        {{ t("Don't have an account?") }}
        <span @click="toForget()" class="ml-4px color-#6b39f4">
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
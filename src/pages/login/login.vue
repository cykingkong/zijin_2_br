<script setup lang="ts">
import { useRouter } from "vue-router";
import type { RouteMap } from "vue-router";
import { useUserStore } from "@/stores";
import inputCom from "@/components/inputCom.vue";
import nationalityList from "@/components/nationality-list/nationalityList.vue";
import CloseButton from "@/components/CloseButton.vue";
import { languageColumns, locale } from "@/utils/i18n";
import Apple from "@/assets/image/Apple.svg";
import Google from "@/assets/image/Google.svg";
import loginTab from "@/components/tab.vue";
import vw from "@/utils/inline-px-to-vw";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const type = ref("");
const remember = ref(false);
const areaInfo = ref({
  code: "mx",
  dialCode: 52,
  key: "mx",
  name: "Mexico",
});
const toSetLang = () => {
  router.push("/profile/languange");
};
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
onMounted(() => {
  if (route.query.type) {
    type.value = route.query.type;
    postData.type = route.query.type == "1" ? "phone" : "email";
  }

  // 页面加载时检查是否有保存的登录信息
  const savedLoginInfo = localStorage.getItem("remember");
  if (savedLoginInfo) {
    try {
      const parsedInfo = JSON.parse(savedLoginInfo);
      remember.value = true;
      postData.account = parsedInfo.account || "";
      postData.password = parsedInfo.password || "";
      // postData.type = parsedInfo.type || 'phone';
    } catch (error) {
      console.error("解析保存的登录信息失败:", error);
      localStorage.removeItem("remember");
    }
  }
});
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

const inputType = ref("password");
const changeInputType = () => {
  inputType.value = inputType.value == "password" ? "text" : "password";
};

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
const toForgotPassword = () => {
  try {
    router.push("/forgot-password?noLogin=1");
  } catch (e) {
    console.log(e);
  }
};
const toForget = () => {
  try {
    router.push("/register");
  } catch (e) {
    console.log(e);
  }
};
const getName = (val: any) => {
  areaInfo.value = val;
};

async function login() {
  if (!postData.password) {
    showToast("PleaseEnter");
    return;
  }

  // 处理记住密码功能
  if (remember.value) {
    localStorage.setItem("remember", JSON.stringify(postData));
  } else {
    localStorage.removeItem("remember");
  }

  try {
    loading.value = true;
    let area = areaInfo.value?.dialCode;
    let params = {
      account:
        postData.type == "phone"
          ? `${area}${postData.account}`
          : postData.account,
      password: postData.password,
      type: postData.type,
    };
    await userStore.login(params);
    // await userStore.info()
    localStorage.setItem("language", "es");
    locale.value = "es";
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
    <nationalityList ref="controlChildRef" :title="t('Pick')" @getName="getName"></nationalityList>

    <div class="top-image w-full min-h-235px bg-#0F172A">
      <CloseButton @close="onBack">
        <template #right>
          <svg t="1757699550709" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="2781" width="24" height="24" @click="toSetLang">
            <path
              d="M512 929.959184c-230.4 0-417.959184-187.559184-417.959184-417.959184s187.559184-417.959184 417.959184-417.959184 417.959184 187.559184 417.959184 417.959184-187.559184 417.959184-417.959184 417.959184z m0-794.122449c-207.412245 0-376.163265 168.75102-376.163265 376.163265s168.75102 376.163265 376.163265 376.163265 376.163265-168.75102 376.163265-376.163265-168.75102-376.163265-376.163265-376.163265z"
              fill="#fff" p-id="2782"></path>
            <path
              d="M512 929.959184c-11.493878 0-20.897959-9.404082-20.897959-20.89796V114.938776c0-11.493878 9.404082-20.897959 20.897959-20.89796s20.897959 9.404082 20.897959 20.89796v794.122448c0 11.493878-9.404082 20.897959-20.897959 20.89796z"
              fill="#fff" p-id="2783"></path>
            <path
              d="M909.061224 532.897959H114.938776c-11.493878 0-20.897959-9.404082-20.89796-20.897959s9.404082-20.897959 20.89796-20.897959h794.122448c11.493878 0 20.897959 9.404082 20.89796 20.897959s-9.404082 20.897959-20.89796 20.897959z"
              fill="#fff" p-id="2784"></path>
            <path
              d="M227.787755 809.795918c-5.22449 0-10.971429-2.089796-15.15102-6.269387C136.359184 725.159184 94.040816 621.191837 94.040816 512s42.318367-213.159184 118.595919-291.526531c7.836735-8.359184 21.420408-8.359184 29.779592-0.522449 8.359184 7.836735 8.359184 21.420408 0.522449 29.779592C173.97551 320.261224 135.836735 413.257143 135.836735 512s38.138776 191.738776 106.579592 262.269388c7.836735 8.359184 7.836735 21.420408-0.522449 29.779592-3.657143 3.657143-8.881633 5.746939-14.106123 5.746938z"
              fill="#fff" p-id="2785"></path>
            <path
              d="M504.163265 929.959184c-0.522449 0-0.522449 0 0 0-110.759184-2.089796-214.204082-47.020408-291.52653-126.432653-7.836735-8.359184-7.836735-20.897959 0-29.257143 39.183673-40.228571 84.636735-71.57551 135.836734-92.995919 5.22449-2.089796 10.971429-2.089796 16.195919 0s9.404082 6.269388 11.493877 11.493878c29.779592 76.8 78.889796 146.285714 141.583674 200.097959 6.791837 5.746939 8.881633 15.15102 5.746939 23.510204-3.134694 7.836735-10.971429 13.583673-19.330613 13.583674z m-246.595918-141.061225c53.289796 49.110204 118.073469 80.979592 188.604082 93.518368-42.318367-44.930612-76.277551-97.17551-100.832653-153.6-31.869388 15.673469-61.64898 35.526531-87.771429 60.081632zM356.310204 344.293878c-2.612245 0-5.746939-0.522449-8.359184-1.567347-51.2-21.942857-96.653061-53.289796-135.836734-92.995919-7.836735-8.359184-7.836735-20.897959 0-29.257143C289.959184 141.061224 392.881633 96.653061 503.640816 94.040816c8.881633-0.522449 16.718367 5.22449 19.853062 13.583674s0.522449 17.763265-5.746939 23.510204C454.530612 184.946939 405.420408 253.910204 375.640816 331.232653c-2.089796 5.22449-6.269388 9.404082-11.493877 11.493878-2.089796 1.044898-5.22449 1.567347-7.836735 1.567347zM257.567347 235.102041c26.644898 24.555102 55.902041 44.408163 87.771429 60.604081 24.555102-56.42449 59.036735-108.669388 100.832653-153.6-70.530612 12.016327-135.314286 43.885714-188.604082 92.995919zM796.212245 809.795918c-5.22449 0-10.44898-2.089796-14.628572-5.746938-8.359184-7.836735-8.359184-21.420408-0.522449-29.779592C850.02449 703.738776 888.163265 610.742857 888.163265 512s-38.138776-191.738776-106.579592-262.269388c-7.836735-8.359184-7.836735-21.420408 0.522449-29.779592 8.359184-7.836735 21.420408-7.836735 29.779592 0.522449C887.640816 298.840816 929.959184 402.808163 929.959184 512s-42.318367 213.159184-118.595919 291.526531c-4.179592 4.179592-9.404082 6.269388-15.15102 6.269387z"
              fill="#fff" p-id="2786"></path>
            <path
              d="M514.612245 929.959184c-8.881633 0-16.718367-5.22449-19.330612-13.583674-3.134694-8.359184-0.522449-17.240816 5.746938-22.987755 63.738776-54.334694 112.84898-124.342857 142.628572-202.187755 2.089796-5.22449 6.269388-9.404082 11.493877-11.493878 5.22449-2.089796 10.971429-2.089796 16.195919 0 52.767347 21.942857 100.310204 53.812245 140.538775 95.085715 7.836735 8.359184 7.836735 20.897959 0 29.257143-78.889796 80.457143-184.42449 124.865306-297.273469 125.910204z m159.869388-203.755102c-25.077551 57.991837-59.559184 111.281633-102.922449 157.257142 72.620408-11.493878 140.016327-43.885714 194.873469-94.563265-27.689796-25.6-58.514286-46.497959-91.95102-62.693877zM662.987755 346.383673c-2.612245 0-5.746939-0.522449-8.359184-1.567346-5.22449-2.089796-9.404082-6.269388-11.493877-11.493878-29.779592-77.844898-78.889796-147.853061-142.628572-202.187755-6.791837-5.746939-8.881633-15.15102-5.746938-22.987755 3.134694-8.359184 10.971429-13.583673 19.330612-13.583674 112.84898 0.522449 217.861224 45.453061 296.75102 126.432653 7.836735 8.359184 7.836735 20.897959 0 29.257143-40.228571 41.273469-87.24898 73.142857-140.538775 95.085715-1.567347 0.522449-4.702041 1.044898-7.314286 1.044897z m-91.428571-205.844897c42.840816 45.97551 77.844898 99.265306 102.922449 157.257142 33.436735-16.195918 64.783673-37.093878 91.95102-62.693877-54.857143-50.677551-122.253061-83.069388-194.873469-94.563265z"
              fill="#fff" p-id="2787"></path>
            <path
              d="M356.310204 721.502041c-2.612245 0-5.746939-0.522449-8.359184-1.567347-5.22449-2.089796-9.404082-6.269388-11.493877-11.493878-24.032653-62.693878-36.571429-128.522449-36.571429-195.918367s12.016327-133.22449 36.571429-195.918367c2.089796-5.22449 6.269388-9.404082 11.493877-11.493878s10.971429-2.089796 16.195919 0c47.020408 19.330612 96.653061 29.257143 147.853061 29.257143 49.632653 0 97.697959-9.404082 143.15102-28.212245 5.22449-2.089796 10.971429-2.089796 16.195919 0s9.404082 6.269388 11.493877 11.493878c23.510204 62.171429 35.526531 127.477551 35.526531 193.828571 0 66.873469-12.016327 132.179592-35.526531 193.828571-2.089796 5.22449-6.269388 9.404082-11.493877 11.493878-5.22449 2.089796-10.971429 2.089796-16.195919 0-45.453061-18.808163-93.518367-28.212245-143.15102-28.212245-51.2 0-100.832653 9.926531-147.330612 29.779592-2.612245 2.612245-5.746939 3.134694-8.359184 3.134694z m12.538776-370.416327c-17.763265 51.722449-26.644898 106.057143-26.644898 160.914286s8.881633 109.191837 26.644898 160.914286c45.97551-16.718367 94.040816-25.077551 143.15102-25.077551 47.542857 0 94.040816 7.836735 138.44898 23.510204 17.240816-51.2 26.122449-105.012245 26.122449-159.346939 0-54.857143-8.881633-108.146939-26.122449-159.346939-44.408163 15.673469-90.906122 23.510204-138.44898 23.510204-49.632653 0-97.697959-8.359184-143.15102-25.077551z"
              fill="#fff" p-id="2788"></path>
          </svg>
        </template>
      </CloseButton>
      <div class="mid-logo w-64px h-64px m-x-a">
        <img src="@/assets/logo.png" alt="" class="w-full h-full">
      </div>
      <div class="text-center m-x-a mt-16px color-white">
        <div class="t font-size-24px font-600 m-b-4px">
          {{ t("Welcome Back!") }}
        </div>
        <div class="t2 font-size-14px font-400 color-#94A3B8">
          {{ t("Sign in to your account") }}
        </div>
      </div>
    </div>

    <div class="login-form p-24">
      <div class="phone-input flex items-center gap-12px" v-if="type == '1'">
        <div class="picker flex-shrink-0 h-56px bg-#F8F9FD rounded-12px flex items-center justify-center px-16"
          @click="hanleClickAreaPick">
          <div class="iti-flag mr-10 rounded-full" :class="areaInfo?.code" style="transform: scale(1.5)"></div>
          <div class="num">+{{ areaInfo?.dialCode }}</div>
        </div>
        <inputCom :label="t('Phone')" :placeholder="t('PleaseEnterPhoneNumber')" v-model:value="postData.account"
          :tips="''" class="flex-1 w-full">
        </inputCom>
      </div>
      <inputCom v-model:value="postData.account" :placeholder="type == '1' ? t('Phone') : t('Email')" :onlyRead="false"
        :type="'text'" v-if="type == '2'"></inputCom>
      <inputCom v-model:value="postData.password" :placeholder="t('Password')" :onlyRead="false" :inputType="inputType">
        <template #sendCode>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            @click="changeInputType" v-if="inputType == 'text'">
            <path d="M3 3L21 21" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M10.584 10.587C10.2087 10.962 9.99775 11.4708 9.99756 12.0013C9.99737 12.5318 10.2079 13.0407 10.583 13.416C10.958 13.7913 11.4667 14.0022 11.9973 14.0024C12.5278 14.0026 13.0367 13.792 13.412 13.417"
              stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M9.363 5.365C10.2204 5.11972 11.1082 4.99684 12 5C16 5 19.333 7.333 22 12C21.222 13.361 20.388 14.524 19.497 15.488M17.357 17.349C15.726 18.449 13.942 19 12 19C8 19 4.667 16.667 2 12C3.369 9.605 4.913 7.825 6.632 6.659"
              stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            v-if="inputType == 'password'" @click="changeInputType">
            <path
              d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
              stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M22 12C19.333 16.667 16 19 12 19C8 19 4.667 16.667 2 12C4.667 7.333 8 5 12 5C16 5 19.333 7.333 22 12Z"
              stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </template>
      </inputCom>
      <div class="flex justify-between items-center mt-16px mb-24px gap-16">
        <div class="left flex font-size-14px font-500 flex-shrink-0 gap-12px flex-shrink-0">
          <div class="radio w-16px h-16px rounded-4px border-1px" :class="remember ? 'radio-active' : ''"
            @click="remember = !remember"></div>
          {{ t("Remember me") }}
        </div>
        <div class="right color-#6B39F4 font-size-14px font-700 cursor-pointer flex-shrink-0"
          @click="toForgotPassword()">
          {{ t("Forgot Password") }}
        </div>
      </div>
      <van-button type="primary" r color="#6b39f4" class="login-btn" block @click="login()">{{ t("Login")
        }}</van-button>
      <!--  <div class="tips my-24px">Or sign in with</div>
       <div class="flex gap-16px ">
        <div
          class="plain-btn w-full flex-1 border-1px border-solid h-56px border-#E2E8F0 rounded-12px color-#0F172A flex items-center justify-center gap-8px">
          <img :src="Apple" alt="" class="w-24px h-24px"> {{
            t("Apple")
          }}
        </div>
        <div
          class="plain-btn w-full flex-1 border-1px border-solid h-56px border-#E2E8F0 rounded-12px color-#0F172A flex items-center justify-center gap-8px">

          <img :src="Google" alt="" class="w-24px h-24px">
          {{
            t("Google")
          }}
        </div>
      </div> -->
      <div class="mt-36px justify-center text-center">
        {{ t("Don't have an account?")
        }}<span @click="toForget()" class="ml-4px color-#6b39f4">
          {{ $t("Sign Up") }}
        </span>
      </div>
    </div>
  </div>
</template>

<route lang="json5">
{
  name: 'login',
  meta: {
    i18n: 'login'
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

.radio {
  border: 1px solid #cbd5e1;
}

.tips {
  position: relative;
  text-align: center;
  margin-top: 24px;
  color: #94a3b8;
  font-size: 14px;
  padding: 0 56px;
}

.tips::before,
.tips::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 44px;
  height: 1px;
  background-color: #cbd5e1;
  transform: translateY(-50%);
}

.tips::before {
  left: 0;
}

.tips::after {
  right: 0;
}

.radio.radio-active {
  background-color: #6b39f4;
  border-color: #6b39f4;
}

.radio.radio-active::after {
  content: "";
  width: 8px;
  height: 4px;
  border: 2px solid #ffffff;
  border-top: none;
  border-right: none;
  transform: rotate(-45deg);
  position: absolute;
  top: 4px;
  left: 3px;
}

.radio {
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio:hover {
  border-color: #6b39f4;
}
</style>
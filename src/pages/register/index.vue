<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  showToast,
  type FieldRule,
  showSuccessToast,
  showFailToast,
} from "vant";
import { ref, onUnmounted } from "vue";
import { useUserStore } from "@/stores";
import { sendCode, register, kyc } from "@/api/user";
import { clearToken, setToken } from "@/utils/auth";
import inputCom from "@/components/inputCom.vue";
import slidePop from "@/components/slidePop.vue";

import icon1 from "@/assets/image/icon/icon1.png";
import nationalityList from "@/components/nationality-list/nationalityList.vue";
import { uploadFile } from "@/api/tool";
const countdown = ref(0);
const router = useRouter();
const step = ref(1);
const { t } = useI18n();
const agree = ref(false);
const timer = ref<NodeJS.Timeout>();
const userStore = useUserStore();
const areaInfo = ref({
  code: "br",
  dialCode: 55,
  key: "br",
  name: "",
});
const inviteCodeOnlyRead = ref(false);
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
const kycForm = reactive({
  name: "",
  nationality: "",
  idCard: "",
  idCardFront: "",
  idCardBack: "",
  idCardHand: "",
});
const form = reactive({
  type: "phone",
  email: "",
  account: "",
  phone: "",
  password: "",
  passwordConfirmation: "",
  code: "", // 二次验证码
  inviteCode: "", // 邀请码
});

const list1 = ref([]);
const list2 = ref([]);
const list3 = ref([]);
const slidePopRef = ref();
const areaPopRef = ref();
const handleClickRegister = async () => {
  if (agree.value == false) {
    showToast(t("input.PleaseEnter"));
    return;
  }
  if (form.inviteCode == "") {
    showToast(t("input.PleaseEnter"));
    return;
  }
  try {
    let area = areaInfo.value?.dialCode;

    let params = {
      phone: area + form.phone,
      email: form.email,
      type: form.type,
      password: form.password,
      code: form.code,
      inviteCode: form.inviteCode,
    };
    const { data, code } = await register(params);
    if (code == 200) {
      step.value = 2;
      setToken(data.token);
      showSuccessToast("");
      await userStore.info();
    }
  } catch (e) { }
};
const handleClickSubmit = async () => {
  try {
    let params = {
      name: kycForm.name,
      nationality: areaInfo.value.dialCode,
      idCard: kycForm.idCard,
      idCardFront: kycForm.idCardFront,
      idCardBack: kycForm.idCardBack,
      // idCardHand: kycForm.idCardHand,
    };
    const { data, code } = await kyc(params);
    if (code == 200) {
      showSuccessToast("");
      router.push("/");
      return;
    }
  } catch (e) { }
};
const getCode = async () => {
  if (countdown.value > 0) return;
  if (!form.phone && form.type == "phone") {
    showToast(t("input.PleaseEnter"));
    return;
  }
  if (!form.email && form.type == "email") {
    showToast(t("input.PleaseEnter"));
    return;
  }
  try {
    let area = areaInfo.value?.dialCode;
    let params = {
      phone: area + form.phone,
      email: form.email,
      type: form.type,
    };
    const { data, code } = await sendCode(params);
    if (code == 200) {
      // showToast('验证码已发送，请注意查收')
    }
    startCountdown();
  } catch (e) {
    // 处理错误
  }
};

const startCountdown = () => {
  countdown.value = 60;
  timer.value = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer.value);
      timer.value = undefined;
    }
  }, 1000);
};
const getName = (val: any) => {
  console.log(val, "vvvv");
  areaInfo.value = val;
};

// 上传
const onOversize = (file) => {
  console.log(file);
  showToast("文件大小不能超过 5Mb");
};
const handleAfterRead = async (file: any, type: any) => {
  queryUploadFile(file, type);
};
const queryUploadFile = async (file: any, type: any) => {
  file.status = "uploading"; // 显示上传状态
  // 创建 FormData 对象
  const formData = new FormData();
  formData.append("file", file.file);
  // 发起上传请求
  try {
    const { data, code } = await uploadFile(formData);
    if (code == 200) {
      if (type == 1) {
        kycForm.idCardFront = data.url;
        list1.value = [{ url: data.url }];
      } else if (type == 2) {
        kycForm.idCardBack = data.url;
        list2.value = [{ url: data.url }];
      } else if (type == 3) {
        kycForm.idCardHand = data.url;
        list3.value = [{ url: data.url }];
      }


      showSuccessToast(t("Upload successful"));
      console.log(kycForm);
    } else {
      showFailToast("");
      file.status = 'failed';
      file.message = '';
    }

  } catch (error) {
    file.status = 'failed';
    file.message = '';
    showFailToast(t("Upload failed"));
  }
};
onMounted(() => {
  console.log(router.currentRoute.value.query);
  if (
    router.currentRoute.value.query &&
    router.currentRoute.value.query.inviteCode
  ) {
    // 如果路由带有邀请码则自动填充，并且只读
    form.inviteCode = router.currentRoute.value.query.inviteCode as string;
    inviteCodeOnlyRead.value = true;
  }
});
onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
});
const controlChildRef = ref();
const hanleClickAreaPick = () => {
  controlChildRef.value.open();

  // areaPopRef.value.popShow()
};
// const popOnOk = (val: any) => {
//   areaInfo.value = val
// }
</script>

<template>
  <div class="m-x-a px-12 pb-24">
    <nationalityList ref="controlChildRef" :title="t('pick')" @getName="getName"></nationalityList>
    <div class="steps flex items-center mt-35">
      <div class="steps-item w-40 h-40 rounded-full line-height-40 font-size-14 text-align-center"
        :class="{ green: step >= 1 }">
        1
      </div>
      <div class="line w-64 h-5" :class="{ green: step >= 1 }"></div>
      <div class="steps-item w-40 h-40 rounded-full line-height-40 font-size-14 text-align-center"
        :class="{ green: step >= 2 }">
        2
      </div>
      <div class="line w-64 h-5" :class="{ green: step >= 3 }"></div>
      <div class="steps-item w-40 h-40 rounded-full line-height-40 font-size-14 text-align-center"
        :class="{ green: step == 3 }">
        3
      </div>
    </div>
    <div class="steps-text flex mt-12">
      <div class="font-size-14 w-72">{{ t("menus.register") }}</div>
      <div class="font-size-14 w-104 text-align-center">
        {{ t("Certification") }}
      </div>
      <div class="font-size-14 w-104 text-align-center">
        {{ t("layouts.deal") }}
      </div>
    </div>
    <block v-if="step == 1">
      <div class="title font-size-24 font-bold mt-26 mb-33 flex gap-24 items-center w-full">
        <div class="flex flex-1 flex-shrink-0 justify-center" :class="{ active: form.type == item.value }"
          v-for="(item, index) in typeArr" :key="index" @click="form.type = item.value">
          {{ item.label }}
        </div>
      </div>
      <inputCom :label="t('input.Phone')" :placeholder="t('input.PleaseEnter')" v-model:value="form.phone" :tips="''"
        v-if="form.type == 'phone'">
        <template #picker>
          <div class="picker-box pr-8 mr-6 h-full flex items-center gap-8" @click="hanleClickAreaPick">
            <!-- <img :src="icon1" alt="" class="w16 h16"> -->
            <div class="iti-flag mr-10" :class="areaInfo?.code" style="transform: scale(1.5)"></div>
            <div class="num">+{{ areaInfo?.dialCode }}</div>
          </div>
        </template>
      </inputCom>
      <inputCom :label="t('register.email')" :placeholder="t('input.PleaseEnter')" v-model:value="form.email" :tips="''"
        v-if="form.type == 'email'">
      </inputCom>
      <inputCom :label="t('login.password')" :placeholder="t('input.PleaseEnter')" v-model:value="form.password"
        :tips="''" :inputType="'password'">
      </inputCom>
      <inputCom :label="t('input.ConfirmPassword')" :placeholder="t('input.PleaseEnter')"
        v-model:value="form.passwordConfirmation" :tips="''" :inputType="'password'">
      </inputCom>
      <inputCom :label="t('register.code')" :placeholder="t('input.PleaseEnter')" v-model:value="form.code" :tips="''">
        <template #sendCode>
          <div class="absolute right-0 font-size-12 sendCode" :class="countdown > 0 ? 'text-gray-400' : 'text-white'"
            @click="getCode">
            {{ countdown > 0 ? `${countdown}s` : t("input.SendCode") }}
          </div>
        </template>
      </inputCom>
      <inputCom :label="t('menus.InvitationCode')" :placeholder="t('input.PleaseEnter')" :only-read="inviteCodeOnlyRead"
        v-model:value="form.inviteCode">
      </inputCom>
      <div class="protocol wfull flex gap-8 font-size-12 mb-12 mt-8">
        <van-checkbox :icon-size="14" v-model="agree">
          {{
            t("menus.I have read and agree to the Terms of Service")
          }}</van-checkbox>
        <div></div>
      </div>
      <div class="flex-col gap-12 flex">
        <van-button type="primary" block @click="handleClickRegister">{{
          t("menus.register")
        }}</van-button>
        <!-- <van-button type="primary" block @click="handleClickRegister">登陆</van-button> -->
      </div>
      <!-- <div class="protocol wfull flex  font-size-12  mt-12">
        已有帐号？<span class="link ">登陆</span>
      </div> -->
    </block>
    <block v-if="step == 2">
      <div class="px-12 pt-12 flex-col flex gap-12">
        <vue-flag code="fr" size="small" />
        <inputCom :label="t('input.Nationality')" :placeholder="t('input.PleaseEnter')"
          v-model:value="kycForm.nationality" :type="'picker'">
          <div class="picker pr-8 mr-6 h-full flex items-center gap-8" @click="hanleClickAreaPick">
            <img :src="icon1" alt="" class="w16 h16" />
            <div class="num">{{ areaInfo?.name }}</div>
          </div>
        </inputCom>
        <inputCom :label="t('input.True Name')" :placeholder="t('input.PleaseEnter')" v-model:value="kycForm.name"
          :type="'text'">
        </inputCom>
        <inputCom :label="t('input.IDCard')" :placeholder="t('input.PleaseEnter')" v-model:value="kycForm.idCard"
          :type="'text'">
        </inputCom>
        <inputCom :label="t('input.Upload')" v-model:value="kycForm.idCard" :type="'imageShow'">
          <div class="flex flex-justify-around w-full text-align-center font-size-12">
            <div class="w80">
              <van-uploader accept="image/*" preview-image multiple :max-count="1" v-model="list1"
                :after-read="(file) => handleAfterRead(file, 1)" />
              {{ t("input.Front") }}
            </div>
            <div class="w80">
              <van-uploader accept="image/*" preview-image multiple :max-count="1" v-model="list2"
                :after-read="(file) => handleAfterRead(file, 2)" />
              {{ t("input.Back") }}
            </div>
            <!-- <div class=" w80 ">
              <van-uploader preview-image multiple :max-count="1" v-model="list3"
                :after-read="(file) => handleAfterRead(file, 3)" />
              手持
            </div> -->
          </div>
        </inputCom>
        <van-button type="primary" block @click="handleClickSubmit">{{
          t("submit")
        }}</van-button>
      </div>
    </block>
    <slidePop ref="slidePopRef" />
    <!-- <areaPop ref="areaPopRef" :country_id="25" @popOnOk="popOnOk" /> -->
  </div>
</template>

<route lang="json5">
{
  name: 'register',
  meta: {
    i18n: 'menus.register',
    title:"注册"
  },
}
</route>
<style lang="less" scoped>
@import "@/components/nationality-list/intl.css";

.link {
  color: #1678ff;
}

.steps-item,
.line {
  background: #868c9a;
}

.picker-box {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 16px;
    background: #868c9a;
  }
}

.green {
  background: #06cda5;
}

.active {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 4px;
    background: #06cda5;
  }
}

.sendCode {
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #868c9a;
}
</style>

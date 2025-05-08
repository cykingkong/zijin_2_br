<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showToast, type FieldRule } from 'vant'
import { ref, onUnmounted } from 'vue'
import { useUserStore } from '@/stores'
import { sendCode, register, kyc } from '@/api/user'
import inputCom from '@/components/inputCom.vue'
import slidePop from '@/components/slidePop.vue'
import areaPop from '@/components/areaPop.vue'
import icon1 from '@/assets/image/icon/icon1.png'
import { uploadFile } from '@/api/tool'
const countdown = ref(0)
const router = useRouter()
const step = ref(2)

const agree = ref(false)
const timer = ref<NodeJS.Timeout>()
const userStore = useUserStore()
const areaInfo = ref()
const inviteCodeOnlyRead = ref(false)
const typeArr = [
  {
    label: '手机号注册',
    value: 'phone'
  },
  {
    label: '邮箱注册',
    value: 'email'
  }
]
const kycForm = reactive({
  name: "",
  nationality: "",
  idCard: "",
  idCardFront: "",
  idCardBack: "",
  idCardHand: ""
})
const form = reactive({
  type: "phone",
  email: "",
  account: "",
  phone: "",
  password: "",
  code: "", // 二次验证码
  inviteCode: ""  // 邀请码
})

const list1 = ref([])
const list2 = ref([])
const list3 = ref([])
const slidePopRef = ref()
const areaPopRef = ref()
const handleClickRegister = async () => {
  if (agree.value == false) {
    showToast("请先同意用户协议")
    return

  }
  try {
    let area = areaInfo.value?.area_code.replace(/\+/g, "");

    let params = {
      phone: area + form.phone,
      email: form.email,
      type: form.type,
      password: form.password,
      code: form.code,
    }
    const { data, code } = await register(params)
    if (code == 200) {
      step.value = 2
      userStore.info()


    }
  } catch (e) {

  }
}
const handleClickSubmit = async () => {
  try {
    let params = {
      name: areaInfo.value.country_id,
      nationality: kycForm.nationality,
      idCard: kycForm.idCard,
      idCardFront: kycForm.idCardFront,
      idCardBack: kycForm.idCardBack,
      idCardHand: kycForm.idCardHand,
    }
    const { data, code } = await kyc(params)
    if (code == 200) {
      step.value = 3
      return
    }
  } catch (e) {

  }
}
const getCode = async () => {
  if (countdown.value > 0) return
  if (!form.phone && form.type == 'phone') {
    showToast("请输入手机号")
    return
  }
  if (!form.email && form.type == 'email') {
    showToast("请输入邮箱")
    return
  }
  try {
    let area = areaInfo.value?.area_code.replace(/\+/g, "");
    let params = {
      phone: area + form.phone,
      email: form.email,
      type: form.type
    }
    await sendCode(params)
    startCountdown()
  } catch (e) {
    // 处理错误
  }
}

const startCountdown = () => {
  countdown.value = 60
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value)
      timer.value = undefined
    }
  }, 1000)
}


// 上传
const onOversize = (file) => {
  console.log(file)
  showToast('文件大小不能超过 5Mb');
}
const handleAfterRead = async (file: any, type: any) => {
  queryUploadFile(file, type);
}
const queryUploadFile = async (file: any, type: any) => {
  file.status = 'uploading'; // 显示上传状态
  // 创建 FormData 对象
  const formData = new FormData();
  formData.append('file', file.file);
  // 发起上传请求
  try {
    const { data } = await uploadFile(formData);
    if (type == 1) {
      kycForm.idCardFront = data.url
      list1.value = [{ url: data.url }]
    } else if (type == 2) {
      kycForm.idCardBack = data.url
      list2.value = [{ url: data.url }]
    } else if (type == 3) {
      kycForm.idCardHand = data.url
      list3.value = [{ url: data.url }]
    }

    showToast('文件上传成功');

    console.log(kycForm)
  } catch (error) {
    showToast('文件上传失败');
  }

}
onMounted(() => {
  console.log(router.currentRoute.value.query)
  if (router.currentRoute.value.query) {
    // 如果路由带有邀请码则自动填充，并且只读
    form.inviteCode = router.currentRoute.value.query.inviteCode as string
    inviteCodeOnlyRead.value = true
  }
})
onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
})
const hanleClickAreaPick = () => {
  areaPopRef.value.popShow()
}
const popOnOk = (val: any) => {
  areaInfo.value = val
}
</script>

<template>
  <div class="m-x-a px-12 pb-24">
    <div class="steps flex items-center mt-35">
      <div class="steps-item w-40 h-40 rounded-full line-height-40 font-size-14 text-align-center"
        :class="{ 'green': step >= 1 }">1</div>
      <div class="line w-64 h-5 " :class="{ 'green': step >= 1 }"></div>
      <div class="steps-item w-40 h-40 rounded-full line-height-40 font-size-14 text-align-center"
        :class="{ 'green': step >= 2 }">2</div>
      <div class="line w-64 h-5 " :class="{ 'green': step >= 3 }"></div>
      <div class="steps-item w-40 h-40 rounded-full line-height-40 font-size-14 text-align-center"
        :class="{ 'green': step == 3 }">3</div>
    </div>
    <div class="steps-text flex mt-12">
      <div class="font-size-14 w-72">帐号注册</div>
      <div class="font-size-14  w-104 text-align-center">实名认证</div>
      <div class="font-size-14  w-104 text-align-center">去交易</div>
    </div>
    <block v-if="step == 1">
      <div class="title font-size-24 font-bold mt-26 mb-33 flex gap-24 items-center">
        <div class="flex flex-1 justify-center" :class="{ 'active': form.type == item.value }"
          v-for="(item, index) in typeArr" :key="index" @click="form.type = item.value">
          {{ item.label }} </div>
      </div>
      <inputCom :label="'手机号'" :placeholder="'请输入手机号'" v-model:value="form.phone" :tips="''"
        v-if="form.type == 'phone'">
        <template #picker>
          <div class="picker-box pr-8 mr-6  h-full flex items-center gap-8" @click="hanleClickAreaPick">
            <img :src="icon1" alt="" class="w16 h16">
            <div class="num">{{ areaInfo?.area_code }}</div>
          </div>
        </template>
      </inputCom>
      <inputCom :label="'邮箱'" :placeholder="'请输入邮箱'" v-model:value="form.email" :tips="''" v-if="form.type == 'email'">
      </inputCom>
      <inputCom :label="'密码'" :placeholder="'请输入密码'" v-model:value="form.password" :tips="''" :inputType="'password'">
      </inputCom>
      <inputCom :label="'确认密码'" :placeholder="'请再次输入密码'" v-model:value="form.password" :tips="''"
        :inputType="'password'">
      </inputCom>
      <inputCom :label="'验证码'" :placeholder="'请输入验证码'" v-model:value="form.code" :tips="''">
        <template #sendCode>
          <div class="absolute right-0 font-size-12 sendCode" :class="countdown > 0 ? 'text-gray-400' : 'text-blue-500'"
            @click="getCode">
            {{ countdown > 0 ? `${countdown}秒后重发` : '发送验证码' }}
          </div>
        </template>
      </inputCom>
      <inputCom :label="'邀请码'" :placeholder="'请输入邀请码'" :only-read="inviteCodeOnlyRead" v-model:value="form.inviteCode"
        :labelTips="'(选填)'">
      </inputCom>
      <div class="protocol wfull flex gap-8 font-size-12 mb-12 mt-8" @click="agree = !agree">
        <van-checkbox :name="false" :icon-size="14" v-model="agree"></van-checkbox>
        <div>
          我已阅读并同意<span class="link ">服务条款</span>
        </div>
      </div>
      <div class="flex-col gap-12 flex">
        <van-button type="primary" block @click="handleClickRegister">注册</van-button>
        <van-button type="primary" block @click="handleClickRegister">登陆</van-button>
      </div>

      <!-- <div class="protocol wfull flex  font-size-12  mt-12">
        已有帐号？<span class="link ">登陆</span>
      </div> -->
    </block>
    <block v-if="step == 2">
      <div class="px-12 pt-12 flex-col flex gap-12">
        <vue-flag code="fr" size="small" />
        <inputCom :label="'国籍'" :placeholder="'请选择国籍'" v-model:value="kycForm.nationality" :type="'picker'">
          <div class="picker pr-8 mr-6  h-full flex items-center gap-8" @click="hanleClickAreaPick">
            <img :src="icon1" alt="" class="w16 h16">
            <div class="num">{{ areaInfo?.name_cn }}</div>
          </div>
        </inputCom>
        <inputCom :label="'真实姓名'" :placeholder="'请输入真实姓名'" v-model:value="kycForm.name" :type="'text'"></inputCom>
        <inputCom :label="'證件/護照號碼'" :placeholder="'请输入證件/護照號碼'" v-model:value="kycForm.idCard" :type="'text'">
        </inputCom>
        <inputCom :label="'證件照/上傳護照'" v-model:value="kycForm.idCard" :type="'imageShow'">
          <div class="flex  flex-justify-around w-full text-align-center font-size-12">
            <div class=" w80  ">
              <van-uploader preview-image multiple :max-count="1" v-model="list1"
                :after-read="(file) => handleAfterRead(file, 1)" />
              正面
            </div>
            <div class=" w80 ">
              <van-uploader preview-image multiple :max-count="1" v-model="list2"
                :after-read="(file) => handleAfterRead(file, 2)" />
              背面
            </div>
            <div class=" w80 ">
              <van-uploader preview-image multiple :max-count="1" v-model="list3"
                :after-read="(file) => handleAfterRead(file, 3)" />
              手持
            </div>
          </div>
        </inputCom>
        <van-button type="primary" block @click="handleClickSubmit">提交</van-button>

      </div>
    </block>
    <slidePop ref="slidePopRef" />
    <areaPop ref="areaPopRef" :country_id="25" @popOnOk="popOnOk" />
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
.link {
  color: #1678FF
}

.steps-item,
.line {
  background: #868C9A;
}

.picker-box {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 16px;
    background: #868C9A;
  }
}

.green {
  background: #06CDA5;
}

.active {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 4px;
    background: #06CDA5;
  }
}
</style>

<template>
  <div class="community p-16">
    <div class="label mb-8 my-12" :class="['flex items-center gap-4']">
      {{ t('Picture Upload') }}
    </div>

    <van-uploader accept="image/*" preview-image :max-count="4" v-model="pictureList"
      :after-read="(file) => handleAfterRead(file, 1)" class="w-full flex items-center justify-center">
      <div
        class="upload-box w-[100px] h-[100px] mx-auto rounded-[12px] h-[100px] border flex items-center justify-center flex-col text-center">
        <svg class="w-48 h-48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" fill="white" />
          <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" stroke="#F0F0F0" />
          <path d="M17.125 24H30.875" stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M24 17.125V30.875" stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </div>
    </van-uploader>
    <!-- <div class="label mb-8 my-12" :class="['flex items-center gap-4']">
      {{ t('Content') }}
    </div>

    <div class="border b-[#F0F0F0] b-solid rounded-16 overflow-hidden min-h-[120px] max-h-400 py-16">
      <van-cell-group inset>
        <van-field v-model="text" rows="1" autosize type="textarea" placeholder="请输入留言" />
      </van-cell-group>
    </div> -->


    <BottomButton color="#1b1b1b" :button-text="t('Submit')" @click="handleClickSubmit"></BottomButton>

  </div>
</template>
<script setup lang="ts">
import { uploadFile, } from '@/api/tool'
import { create, list } from '@/api/dyname'
import { userProductList as userProductListApi, claimIncome, tipsList } from '@/api/product'

const { t } = useI18n()
const text = ref('')
const router = useRouter()
const watingReceiveId = ref<any>([])
const route = useRoute()
/** 上传头像 */
const canUpdateAvatar = ref(true)
const uploadPopShow = ref<boolean>(false)
const pictureList = ref<any[]>([])
const userAvatar = ref('')
const handleClickUploadAvatar = () => {
  uploadPopShow.value = true;
  canUpdateAvatar.value = true
}


const handleAfterRead = async (file: any, type: any) => {
  queryUploadFile(file, type);
};
const queryUploadFile = async (file: any, type: any) => {
  file.status = "uploading"; // 显示上传状态
  let { objectUrl } = file.file
  // 创建 FormData 对象
  const formData = new FormData();
  formData.append("image", file.file);
  console.log(file, "file.file");
  // 发起上传请求
  try {
    const { data, code } = await uploadFile(formData);
    if (code == 200) {
      if (type == 1) {
        file.url = data.url;
        file.status = 'done'
        console.log(data.url, "dataUrl", type, pictureList.value);
      }
      canUpdateAvatar.value = false
      console.log(userAvatar.value);
    }
  } catch (error) {
    file.status = "failed";
    file.message = "";
    showFailToast(t("Upload failed"));
    console.log(error)
  }
};

/** 上传结束 */
const handleClickReceive = async () => {
  try {
    let flag = true
    for (let i = 0; i < watingReceiveId.value.length; i++) {
      console.log(watingReceiveId.value[i])
      const { data, code, message } = await claimIncome({ id: watingReceiveId.value[i] })
      console.log(data, message, 'asdasd')
      if (code !== 200) {
        flag = false
        break
      }
    }
    if (flag) {
      showSuccessToast({})
      setTimeout(() => {
        router.push({
          path: '/profile'
        })
      }, 400)
    }
  } catch (e) {
    console.log(e, 'error')
  }
}
const handleClickSubmit = async () => {
  try {
    const { data, code } = await create({
      content: text.value + 'OK',
      img: pictureList.value.map((item: any) => item.url).join(','),
    })
    if (code == 200) {
      showSuccessToast({})
      handleClickReceive()
    }
  } catch {

  }
}
onMounted(() => {
  if (route.query.watingReceiveIds) {
    watingReceiveId.value = JSON.parse(route.query.watingReceiveIds as string)
    console.log(watingReceiveId.value)
  }

})
</script>
<style scoped lang="less">
.community {
  padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
}

.upload-box {
  border: 1px #1c2024 dashed;
}
</style>
<route lang="json5">
{
  name: 'addCommunity',
  meta: {
    i18n: 'addCommunity'
  },
}
</route>
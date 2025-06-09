<template>
  <div class="authentication-content">
    <!-- 认证详情 -->
    <!-- <div
            class="pt-14 pb-14 box-border   px-12 font-size-14 flex-items-center flex flex-justify-between border-b-color">
            <div class="l">认证状态</div>
            <div class="r flex-items-center flex gap-8">
                <img src="@/assets/image/success.png" alt="" class="w16 h16">
                审核成功
            </div>
        </div> -->
    <div class="flex-col flex gap-12">
      <div class="px-12 pt-12 flex-col flex gap-12">
        <vue-flag code="fr" size="small" />

        <inputCom
          :label="t('input.Nationality')"
          :placeholder="t('input.PleaseSelect')"
          :inputType="'picker'"
          v-model:value="kycForm.nationality"
          :tips="''"
        >
          <template #picker>
            <div
              class="picker-box w-full pr-8 mr-6 h-full flex items-center gap-8 pl-6"
              @click="hanleClickAreaPick"
            >
              <!-- <img :src="icon1" alt="" class="w16 h16"> -->
              <div
                class="iti-flag mr-10"
                :class="areaInfo?.code"
                style="transform: scale(1.5)"
              ></div>
              <div class="num">{{ areaInfo?.name }}</div>
            </div>
          </template>
          <template #sendCode></template>
        </inputCom>
        <inputCom
          :label="t('input.True Name')"
          :placeholder="t('input.PleaseEnter')"
          v-model:value="kycForm.name"
          :type="'text'"
        >
        </inputCom>
        <inputCom
          :label="t('input.IDCard')"
          :placeholder="t('input.PleaseEnter')"
          v-model:value="kycForm.idCard"
          :type="'text'"
        >
        </inputCom>
        <inputCom
          :label="t('input.Upload')"
          v-model:value="kycForm.idCard"
          :type="'imageShow'"
        >
          <div
            class="flex flex-justify-around w-full text-align-center font-size-12"
          >
            <div class="w80">
              <van-uploader
                preview-image
                multiple
                :max-count="1"
                v-model="list1"
                :after-read="(file) => handleAfterRead(file, 1)"
              />
              {{ t("input.Front") }}
            </div>
            <div class="w80">
              <van-uploader
                preview-image
                multiple
                :max-count="1"
                v-model="list2"
                :after-read="(file) => handleAfterRead(file, 2)"
              />
              {{ t("input.Back") }}
            </div>
          </div>
        </inputCom>
        <!-- <div class="w-full">
                    <div class="t font-size-16 mb-12">拍照示例</div>
                    <img src="../../assets/uploadTips.png" class="w-full block" alt="">
                </div> -->
        <van-button type="primary" block @click="handleClickSubmit">{{
          t("submit")
        }}</van-button>
      </div>
    </div>

    <nationalityList
      ref="controlChildRef"
      :title="t('pick')"
      @getName="getName"
    ></nationalityList>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue";
import nationalityList from "@/components/nationality-list/nationalityList.vue";
import { uploadFile } from "@/api/tool";

import { sendCode, register, kyc } from "@/api/user";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const parentValue = ref("");
const list1 = ref([]);
const list2 = ref([]);
const list3 = ref([]);
const kycForm = reactive({
  name: "",
  nationality: "",
  idCard: "",
  idCardFront: "",
  idCardBack: "",
  idCardHand: "",
});
const areaInfo = ref({
  code: "br",
  dialCode: 55,
  key: "br",
  name: "",
});
const router = useRouter();
const getName = (val: any) => {
  console.log(val, "vvvv");
  areaInfo.value = val;
};
const controlChildRef = ref();
const hanleClickAreaPick = () => {
  controlChildRef.value.open();

  // areaPopRef.value.popShow()
};
// 上传
const onOversize = (file) => {
  console.log(file);
  // showToast('文件大小不能超过 5Mb');
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
    const { data } = await uploadFile(formData);
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

    showToast(t("Upload successful"));

    console.log(kycForm);
  } catch (error) {
    showToast(t("Upload failed"));
  }
};
const handleClickSubmit = async () => {
  try {
    let params = {
      name: kycForm.name,
      nationality: areaInfo.value.dialCode,
      idCard: kycForm.idCard,
      idCardFront: kycForm.idCardFront,
      idCardBack: kycForm.idCardBack,
      idCardHand: kycForm.idCardHand,
    };
    const { data, code } = await kyc(params);
    if (code == 200) {
      setTimeout(() => {
        router.back();
      });

      return;
    }
  } catch (e) {}
};
</script>
<route lang="json5">
    {
      name: 'Certification',
      meta: {
        title: '认证',
        i18n:'Certification'
      },
    }
</route>
<style lang="less" scoped>
@import "@/components/nationality-list/intl.css";

.border-b-color {
  border-bottom: 1px solid var(--border_color);
}
</style>
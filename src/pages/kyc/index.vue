<script setup>
import router from "@/router";
import { useUserStore } from "@/stores";
import { navTitleStore } from "@/stores/index";
import { isLogin } from "@/utils/auth";
import { useI18n } from "vue-i18n";
import { closeToast, showLoadingToast, showSuccessToast, showToast } from "vant";
import { ref, computed, watch, onMounted } from 'vue';
import { uploadFile } from '@/api/tool'
import { kycSubmit } from '@/api/user'
import ImageUploader from '@/components/ImageUploader.vue';
// import { upload, uploadImage, getUserImagesNum } from '@/api/tool'
const { t } = useI18n();
const navStore = navTitleStore();
const userStore = useUserStore();
const step = ref(1)
// 1. 定义共用的图片列表
const pictureList = ref([]);
const limit = ref(1)
const idCard = ref('')
const realName = ref('')



const handleAfterRead = async (file, type) => {
    console.log('File read:', file, 'Type:', type);

    // 判断是单个文件还是多个文件
    const files = Array.isArray(file) ? file : [file];

    // 循环上传每个文件
    for (const item of files) {
        item.status = 'uploading';
        item.message = t('Uploading');
        try {
            const formData = new FormData();
            formData.append("image", item.file);
            const { data, code } = await uploadFile(formData)
            if (code == 200) {
                console.log(pictureList.value)
                item.status = 'done';
                item.uploadUrl = data.url;
                item.message = t('Done');
            }
        } catch (e) {
            console.log(e, 'err')
            item.status = 'failed';
            item.message = t('failed');
        }
    }
};
const submit = async () => {
    try {
        let params = {
            "real_name": realName.value,
            "id_card": idCard.value,
            "id_card_front": pictureList.value[0].uploadUrl
        }
        const { data, code } = await kycSubmit(params)
        if (code == 200) {
            console.log(data.url, 'data.url')
            showSuccessToast({})
            pictureList.value = [];
            setTimeout(() => {
                router.push({ path: "/profile" })
            }, 1000);

        }
    } catch (e) {
        console.log(e, 'err')
    }
}
function onBack() {
    if ([2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].includes(step.value)) {
        step.value--;
        return;
    }
    if (window.history.state.back) history.back();
    else router.replace("/");
}
function onSubmit() {
    if (step.value == 1) {
        if (idCard.value.length == 0) {
            showToast({
                message: t("Please enter your ID card number"),
                duration: 1000,
            });
            return;
        }
    }
    submit()
}
onMounted(() => {
    // init(); // 暂时注释，按需开启
    navStore.setShowNavLeft(true);
    // getUserImagesNum().then((res) => {
    //     if (res.code == 200) {
    //         limit.value = res.data.num
    //     }
    // })
});
</script>

<template>
    <div class="Home bg-[#fff] pb-[120px] px-[24px]">
        <VanNavBar title="" :fixed="true" clickable :left-arrow="true" @click-left="onBack" z-index="999" placeholder>
            <template #left>
                <div class="flex items-center gap-14">
                    <svg class="w-28 h-28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M23.3333 14.3201C23.3333 14.763 23.0041 15.1291 22.577 15.1871L22.4583 15.1951L4.95831 15.1951C4.47506 15.1951 4.08331 14.8033 4.08331 14.3201C4.08331 13.8771 4.41249 13.511 4.83958 13.4531L4.95831 13.4451L22.4583 13.4451C22.9416 13.4451 23.3333 13.8368 23.3333 14.3201Z"
                            fill="#212121" />
                        <path
                            d="M12.6338 20.7284C12.9762 21.0694 12.9774 21.6234 12.6365 21.9658C12.3265 22.2771 11.8404 22.3064 11.4974 22.053L11.399 21.9685L4.3407 14.9405C4.02846 14.6296 4.00005 14.1418 4.2555 13.7987L4.34065 13.7004L11.399 6.67126C11.7414 6.33026 12.2954 6.33141 12.6364 6.67382C12.9464 6.98511 12.9737 7.47128 12.7188 7.8133L12.6339 7.91126L6.19848 14.3208L12.6338 20.7284Z"
                            fill="#212121" />
                    </svg>
                    <div class="flex flex-items-center gap-6 font-size-[18px] font-bold">
                        {{ t('KYC') }}
                    </div>
                </div>
            </template>
        </VanNavBar>
        <block v-if="step == 1">

            <div class="top-title mb-[40px] mt-20">
                <div class="t1 font-size-[28px] font-bold color-[#0F172A] leading-[36px]">
                    {{ t("Upload a photo of your national ID card") }} 🪪
                </div>
                <div class="t2 line-height-[140%] font-light mt-12">
                    Regulations require you to upload a national identity card. Don't worry, your data will stay safe
                    and
                    private.
                </div>
            </div>

            <!-- 使用图片上传组件 -->
            <ImageUploader v-model="pictureList" :max-count="limit" :show-camera-button="true"
                @after-read="handleAfterRead" />

            <bottom-button @click="step = 2"></bottom-button>
        </block>
        <block v-if="step == 2">
            <div class="top-title mb-[40px] mt-20">
                <div class="t1 font-size-[28px] font-bold color-[#0F172A] leading-[36px]">
                    {{ t("What is your address on the ID Card you just uploaded? ") }} 🏠
                </div>
            </div>
            <div class="label-text font-size-[16px] font-bold color-[#1b1b1b] mb-[12px]">
                {{ t("Full Name") }}
            </div>
            <!-- Full Name 输入框 -->
            <div class="name-input-wrapper">
                <input type="text" v-model="realName" :placeholder="t('Enter your Full Name')"
                    class="w-full h-[56px] bg-transparent border-b-[1px] border-[#E2E8F0] border border-solid font-size-[18px] color-[#0F172A] pb-[8px] focus:border-[#2DC07E] outline-none transition-all" />
            </div>
            <div class="label-text font-size-[16px] font-bold color-[#1b1b1b] mb-[12px] mt-20">
                {{ t("ID Card Number") }}

            </div>
            <!-- Full Name 输入框 -->
            <div class="name-input-wrapper">
                <input type="text" v-model="idCard" :placeholder="t('Enter your ID Card Number')"
                    class="w-full h-[56px] bg-transparent border-b-[1px] border-[#E2E8F0] border border-solid font-size-[18px] color-[#0F172A] pb-[8px] focus:border-[#2DC07E] outline-none transition-all" />
            </div>
            <bottom-button @click="onSubmit"></bottom-button>

        </block>
    </div>
</template>

<route lang="json5">
{
  name: 'kyc',
  meta: {
    i18n: 'kyc'
  },
}
</route>
<style lang="less" scoped>
// Step 2 全名输入样式
.name-input-wrapper {
    input {
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid #2DC07e;

        &::placeholder {
            color: #94A3B8;
            font-size: 18px;
        }

        &:focus {
            border-bottom: 1px solid #2DC07e;

        }
    }
}

.progress-bar {
    width: 100%;
}
</style>
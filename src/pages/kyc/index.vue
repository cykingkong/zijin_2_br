<script setup>
import router from "@/router";
import { useUserStore } from "@/stores";
import { navTitleStore } from "@/stores/index";
import { isLogin } from "@/utils/auth";
import { useI18n } from "vue-i18n";
import { closeToast, showLoadingToast, showSuccessToast, showToast } from "vant";
import { ref, computed, watch, onMounted } from 'vue';
import { upload } from '@/api/tool'
import { kycSubmit } from '@/api/user'
import ImageUploader from '@/components/ImageUploader.vue';
// import { upload, upload, getUserImagesNum } from '@/api/tool'
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
            const { data, code } = await upload(formData)
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
    <div class="kyc-page px-[20px] pt-[12px] pb-[140px] min-h-[100vh] overflow-auto">
        <div class="kyc-nav">
            <button type="button" class="kyc-nav__back" @click="onBack">
                <svg class="w-[18px] h-[18px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 4.16675L6.66667 10.0001L12.5 15.8334" stroke="currentColor" stroke-width="1.67"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
            <div class="kyc-nav__copy">
                <div class="kyc-nav__eyebrow">{{ t("Verification") }}</div>
                <div class="kyc-nav__title">{{ t("KYC") }}</div>
            </div>
        </div>

        <block v-if="step == 1">
            <div class="hero-panel mb-[24px]">
                <div class="hero-tag">{{ t("KYC") }}</div>
                <div class="hero-title">
                    {{ t("What is your address on the ID Card you just uploaded? ") }}
                </div>
                <div class="hero-subtitle">
                    {{ t("Complete your identity details and upload the front of your ID card for verification.") }}
                </div>
            </div>

            <div class="kyc-form-card">
                <div class="label-text mb-[12px]">
                    {{ t("Real Name") }}
                </div>
                <div class="name-input-wrapper">
                    <input type="text" v-model="realName" :placeholder="t('Enter your Real Name')" class="kyc-input" />
                </div>

                <div class="label-text mb-[12px] mt-[20px]">
                    {{ t("ID Card Number") }}
                </div>
                <div class="name-input-wrapper">
                    <input type="text" v-model="idCard" :placeholder="t('Enter your ID Card Number')" class="kyc-input" />
                </div>

                <div class="label-text mb-[12px] mt-[20px]">
                    {{ t("ID Card Front") }}
                </div>
                <div class="upload-panel-wrap">
                    <ImageUploader v-model="pictureList" :max-count="limit" :show-camera-button="false"
                        @after-read="handleAfterRead" />
                </div>
            </div>

            <div class="submit-wrap">
                <bottom-button @click="onSubmit"></bottom-button>
            </div>
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
.kyc-page {
    background:
        radial-gradient(circle at top, rgba(124, 255, 178, 0.16), transparent 30%),
        linear-gradient(180deg, #050505 0%, #000 100%);
    color: #f5f5f5;
}

.kyc-nav {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
}

.kyc-nav__back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border: 1px solid rgba(124, 255, 178, 0.18);
    border-radius: 14px;
    background: rgba(124, 255, 178, 0.08);
    color: #8bffbe;
    box-shadow:
        inset 0 0 0 1px rgba(124, 255, 178, 0.12),
        0 0 18px rgba(124, 255, 178, 0.14);
}

.kyc-nav__copy {
    display: grid;
    gap: 2px;
}

.kyc-nav__eyebrow {
    font-size: 11px;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #8bffbe;
}

.kyc-nav__title {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.25;
    color: #f5f5f5;
}

.hero-panel {
    position: relative;
    padding: 28px 22px 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 28px;
    background: linear-gradient(180deg, rgba(17, 17, 17, 0.96) 0%, rgba(8, 8, 8, 0.96) 100%);
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.04),
        inset 0 -8px 20px rgba(0, 0, 0, 0.45),
        0 8px 24px rgba(0, 0, 0, 0.45);
}

.hero-tag {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border: 1px solid rgba(124, 255, 178, 0.35);
    border-radius: 999px;
    background: rgba(124, 255, 178, 0.08);
    color: #8bffbe;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.hero-title {
    margin-top: 18px;
    font-size: 30px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: #f5f5f5;
}

.hero-subtitle {
    margin-top: 10px;
    color: #a3a3a3;
    font-size: 14px;
    line-height: 1.6;
}

.kyc-form-card {
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 28px;
    background: linear-gradient(180deg, rgba(17, 17, 17, 0.96) 0%, rgba(8, 8, 8, 0.96) 100%);
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.04),
        inset 0 -8px 20px rgba(0, 0, 0, 0.45),
        0 8px 24px rgba(0, 0, 0, 0.45);
    padding: 22px 18px;
}

.label-text {
    font-size: 14px;
    font-weight: 700;
    color: #f5f5f5;
}

.name-input-wrapper {
    input {
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: none;
    }
}

.kyc-input {
    width: 100%;
    height: 56px;
    padding: 0 16px;
    border: 1px solid rgba(255, 255, 255, 0.06) !important;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.03);
    font-size: 16px;
    color: #f5f5f5;
    outline: none;
    transition: all 0.2s ease;

    &::placeholder {
        color: #6b6b6b;
        font-size: 16px;
    }

    &:focus {
        border-color: rgba(124, 255, 178, 0.35) !important;
        box-shadow: 0 0 0 3px rgba(124, 255, 178, 0.08);
    }
}

.upload-panel-wrap {
    padding: 14px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.03);
}

.submit-wrap {
    margin-top: 24px;
}

.progress-bar {
    width: 100%;
}
</style>
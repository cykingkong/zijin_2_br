<template>
    <div class="invite-friends-page min-h-[100vh] bg-[#F7F7F7] flex flex-col font-sans">
        <!-- 内容区域 -->
        <div class="content flex-1 px-[16px] pt-[10px] pb-[30px]">

            <!-- 主要卡片 -->
            <div class="main-card bg-white rounded-[16px] p-[20px] shadow-sm flex flex-col items-center">

                <!-- 1. 邀请码输入框 -->
                <div
                    class="w-full border border-[#EAEAEA] border-solid rounded-[12px] px-[16px] py-[14px] flex justify-between items-center mb-[16px] bg-white">
                    <span class="text-[#333] font-bold text-[15px]">{{ userInfo.inviteCode || '-' }}</span>
                    <!-- 复制图标按钮 -->
                    <div class="cursor-pointer active:opacity-70 p-2 -mr-2" @click="copyText(userInfo.inviteCode)">
                        <svg class="w-20 h-20 flex-shrink-0" viewBox="0 0 20 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.6665 1.66602H8.33317C7.414 1.66602 6.6665 2.41352 6.6665 3.33268V6.66602H3.33317C2.414 6.66602 1.6665 7.41352 1.6665 8.33268V16.666C1.6665 17.5852 2.414 18.3327 3.33317 18.3327H11.6665C12.5857 18.3327 13.3332 17.5852 13.3332 16.666V13.3327H16.6665C17.5857 13.3327 18.3332 12.5852 18.3332 11.666V3.33268C18.3332 2.41352 17.5857 1.66602 16.6665 1.66602ZM3.33317 16.666V8.33268H11.6665L11.6682 16.666H3.33317ZM16.6665 11.666H13.3332V8.33268C13.3332 7.41352 12.5857 6.66602 11.6665 6.66602H8.33317V3.33268H16.6665V11.666Z"
                                fill="#8C91A2" />
                        </svg>
                    </div>
                </div>

                <!-- 2. 邀请链接输入框 -->
                <div
                    class="w-full border border-[#EAEAEA] border-solid rounded-[12px] px-[16px] py-[14px] flex justify-between items-center mb-[24px] bg-white text-left">
                    <span class="text-[#333] text-[13px] break-all mr-[10px] leading-[1.4] line-clamp-1">{{ inviteLink
                    }}</span>
                    <!-- 复制图标按钮 -->
                    <div class="cursor-pointer active:opacity-70 p-2 -mr-2" @click="copyText(inviteLink)">
                        <svg class="w-20 h-20 flex-shrink-0" viewBox="0 0 20 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.6665 1.66602H8.33317C7.414 1.66602 6.6665 2.41352 6.6665 3.33268V6.66602H3.33317C2.414 6.66602 1.6665 7.41352 1.6665 8.33268V16.666C1.6665 17.5852 2.414 18.3327 3.33317 18.3327H11.6665C12.5857 18.3327 13.3332 17.5852 13.3332 16.666V13.3327H16.6665C17.5857 13.3327 18.3332 12.5852 18.3332 11.666V3.33268C18.3332 2.41352 17.5857 1.66602 16.6665 1.66602ZM3.33317 16.666V8.33268H11.6665L11.6682 16.666H3.33317ZM16.6665 11.666H13.3332V8.33268C13.3332 7.41352 12.5857 6.66602 11.6665 6.66602H8.33317V3.33268H16.6665V11.666Z"
                                fill="#8C91A2" />
                        </svg>
                    </div>
                </div>

                <!-- 3. 警告/说明文字 -->
                <p class="text-[#8C91A2] text-[12px] text-left leading-[1.3] mb-[16px] px-[4px]">
                    {{ t('Please do not invite fake accounts to join. Each person can only have one account in our company to make money.')}}
                </p>

                <!-- 4. 二维码区域 -->
                <!-- 容器样式：居中 flex 布局，确保二维码居中显示 -->
                <div
                    class="qr-container p-[16px] bg-[#F7F7F7] rounded-[28px] w-200 h-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-[16px] border border-[#0000000D] border-solid flex justify-center items-center">
                    <!-- 使用 qrcode.vue 组件 -->
                    <!-- value: 二维码内容 -->
                    <!-- size: 尺寸，容器是200px(假设w-200是px)，padding是16px，所以最大内容约168px -->
                    <!-- level: 纠错等级 H (High) -->
                    <!-- render-as: 渲染为 svg 清晰度更高 -->
                    <QrcodeVue v-if="inviteLink" :value="inviteLink" :size="200" level="H" render-as="svg" :margin="0"
                        background="#F7F7F7" foreground="#000000" />
                </div>

                <!-- 5. 底部提示 -->
                <span class="text-[#AAA] text-[12px]">{{ t('Long press the image to save') }}</span>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores';
// 1. 引入 qrcode 组件
import QrcodeVue from 'qrcode.vue';
// 2. 引入 Vant 的 Toast 组件（如果项目中已自动引入可忽略）
import { showToast, showSuccessToast, showFailToast } from 'vant';
import 'vant/es/toast/style';

const userStore = useUserStore();
const router = useRouter();
const {t}= useI18n()
// 使用 computed 确保 userInfo 更新时获取最新数据
const userInfo = computed(() => userStore.userInfo || {});

// 3. 将 inviteLink 改为 computed，确保依赖 inviteCode 变化时自动更新
const inviteLink = computed(() => {
    const code = userInfo.value.inviteCode || '';
    return `${location.origin}/#/login?loginType=1&inviteCode=${code}`;
});

// 4. 优化后的复制功能
const copyText = async (text) => {
    if (!text) {
        showFailToast('No content to copy');
        return;
    }

    // 兼容性处理
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            showSuccessToast('Copied successfully');
        } catch (err) {
            console.error('Failed to copy: ', err);
            fallbackCopy(text);
        }
    } else {
        // Fallback for older browsers or non-secure contexts
        fallbackCopy(text);
    }
};

// 降级复制方案
const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // 避免页面滚动
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showSuccessToast('Copied successfully');
        } else {
            showFailToast('Copy failed');
        }
    } catch (err) {
        showFailToast('Copy failed');
    }
    document.body.removeChild(textArea);
};

function goBack() {
    if (router) router.back();
}
</script>

<route lang="json5">
{
  name: 'inviteFriends',
  meta: {
    title: 'Invite Friends',
    i18n: 'inviteFriends'
  },
}
</route>

<style scoped>
/* 
 * 模拟截图中的二维码外框柔和阴影 
 */
.qr-container {
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.05);
}
</style>
<template>
    <div class="invite-friends-page min-h-[100vh] bg-[#F7F7F7] flex flex-col font-sans">



        <!-- 内容区域 -->
        <div class="content flex-1 px-[16px] pt-[10px] pb-[30px]">

            <!-- 主要卡片 -->
            <div class="main-card bg-white rounded-[16px] p-[20px] shadow-sm flex flex-col items-center">

                <!-- 1. 邀请码输入框 -->
                <div
                    class="w-full border border-[#EAEAEA] border-solid rounded-[12px] px-[16px] py-[14px] flex justify-between items-center mb-[16px] bg-white">
                    <span class="text-[#333] font-bold text-[15px]">{{ inviteCode }}</span>
                    <!-- 复制图标按钮 -->
                    <svg class="w-20 h-20 flex-shrink-0" viewBox="0 0 20 20" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M16.6665 1.66602H8.33317C7.414 1.66602 6.6665 2.41352 6.6665 3.33268V6.66602H3.33317C2.414 6.66602 1.6665 7.41352 1.6665 8.33268V16.666C1.6665 17.5852 2.414 18.3327 3.33317 18.3327H11.6665C12.5857 18.3327 13.3332 17.5852 13.3332 16.666V13.3327H16.6665C17.5857 13.3327 18.3332 12.5852 18.3332 11.666V3.33268C18.3332 2.41352 17.5857 1.66602 16.6665 1.66602ZM3.33317 16.666V8.33268H11.6665L11.6682 16.666H3.33317ZM16.6665 11.666H13.3332V8.33268C13.3332 7.41352 12.5857 6.66602 11.6665 6.66602H8.33317V3.33268H16.6665V11.666Z"
                            fill="#8C91A2" />
                    </svg>

                </div>

                <!-- 2. 邀请链接输入框 -->
                <div
                    class="w-full border border-[#EAEAEA] border-solid rounded-[12px] px-[16px] py-[14px] flex justify-between items-center mb-[24px] bg-white text-left">
                    <span class="text-[#333] text-[13px] break-all mr-[10px] leading-[1.4]">{{ inviteLink }}</span>
                    <!-- 复制图标按钮 -->
                    <svg class="w-20 h-20 flex-shrink-0" viewBox="0 0 20 20" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M16.6665 1.66602H8.33317C7.414 1.66602 6.6665 2.41352 6.6665 3.33268V6.66602H3.33317C2.414 6.66602 1.6665 7.41352 1.6665 8.33268V16.666C1.6665 17.5852 2.414 18.3327 3.33317 18.3327H11.6665C12.5857 18.3327 13.3332 17.5852 13.3332 16.666V13.3327H16.6665C17.5857 13.3327 18.3332 12.5852 18.3332 11.666V3.33268C18.3332 2.41352 17.5857 1.66602 16.6665 1.66602ZM3.33317 16.666V8.33268H11.6665L11.6682 16.666H3.33317ZM16.6665 11.666H13.3332V8.33268C13.3332 7.41352 12.5857 6.66602 11.6665 6.66602H8.33317V3.33268H16.6665V11.666Z"
                            fill="#8C91A2" />
                    </svg>

                </div>

                <!-- 3. 警告/说明文字 -->
                <p class="text-[#8C91A2] text-[12px] text-left leading-[1.3] mb-[16px] px-[4px]">
                    Please do not invite fake accounts to join. Each person can only have one account in our company to
                    make money.
                </p>

                <!-- 4. 二维码区域 -->
                <!-- 容器增加了 padding 和浅色阴影来模拟截图中的立体感 -->
                <div
                    class="qr-container p-[16px] bg-[#F7F7F7] rounded-[28px] w-200 h-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-[16px] border border-[#0000000D] border-solid">
                    <!-- 这里使用 api 生成一个占位二维码，实际开发请替换为你的图片或 QR 组件 -->

                </div>

                <!-- 5. 底部提示 -->
                <span class="text-[#AAA] text-[12px]">Long press the image to save</span>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const inviteCode = ref('57v689');
const inviteLink = ref('https://a.cgonzhuo.top/register?inviteCode=b396835a');

// 简单的复制功能逻辑
const copyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        // 这里可以加一个 Toast 提示
        console.log('Copied:', text);
        alert('Copied successfully!');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
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
 * 如果 UnoCSS shadow-lg 不够还原，可以自定义 box-shadow
 */
.qr-container {
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.05);
}
</style>

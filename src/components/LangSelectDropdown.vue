<template>
    <!-- 使用 Vant Popover 气泡弹出框 -->
    <van-popover v-model:show="showPopover" placement="bottom-end" :offset="[0, 8]" class="language-popover">
        <!-- 触发器：胶囊按钮 -->
        <template #reference>
            <div
                class="flex items-center justify-between h-[23px] bg-[#0000000D] px-6 py-4.5 rounded-full cursor-pointer select-none transition-opacity active:opacity-70 gap-8">
                <!-- 左侧地球图标 -->
                <svg class="w-14 h-14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M7.00002 12.8333C10.2217 12.8333 12.8334 10.2216 12.8334 6.99996C12.8334 3.7783 10.2217 1.16663 7.00002 1.16663C3.77836 1.16663 1.16669 3.7783 1.16669 6.99996C1.16669 10.2216 3.77836 12.8333 7.00002 12.8333Z"
                        stroke="#161616" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M4.66664 1.75H5.24998C4.11248 5.15667 4.11248 8.84333 5.24998 12.25H4.66664"
                        stroke="#161616" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.75 1.75C9.8875 5.15667 9.8875 8.84333 8.75 12.25" stroke="#161616"
                        stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M1.75 9.33333V8.75C5.15667 9.8875 8.84333 9.8875 12.25 8.75V9.33333" stroke="#161616"
                        stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M1.75 5.24998C5.15667 4.11248 8.84333 4.11248 12.25 5.24998" stroke="#161616"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <!-- 当前语言文字 -->
                <span class="text-[14px] font-medium text-[#161616] mr-2 leading-none pt-[1px]">
                    {{ currentLangLabel }}
                </span>

                <!-- 右侧下拉箭头 (根据展开状态旋转) -->
                <van-icon name="play" class="text-gray-800 transition-transform duration-200"
                    :class="showPopover ? '-rotate-90' : 'rotate-90'" size="10" />
            </div>
        </template>

        <!-- 弹出层内容：语言列表 -->
        <div class="w-[160px] py-9 px-6 bg-white rounded-lg shadow-lg">
            <div v-for="item in languageColumns" :key="item.value" @click="onSelect(item.value)"
                class="flex items-center justify-between px-4 py-3 cursor-pointer active:bg-gray-50 transition-colors">

                <!-- 语言名称 -->
                <span class="text-[15px]"
                    :class="item.value === currentLang ? 'font-medium text-black' : 'text-gray-600'">
                    {{ item.text }}
                </span>

                <!-- 选中状态图标 (黑色圆底白勾) -->

                <svg v-if="item.value === currentLang" class="w-14 h-14" viewBox="0 0 14 14" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M7.00002 12.8333C10.2084 12.8333 12.8334 10.2083 12.8334 6.99996C12.8334 3.79163 10.2084 1.16663 7.00002 1.16663C3.79169 1.16663 1.16669 3.79163 1.16669 6.99996C1.16669 10.2083 3.79169 12.8333 7.00002 12.8333Z"
                        fill="#161616" />
                    <path d="M4.52081 6.99995L6.17165 8.65079L9.47915 5.34912" stroke="white" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>

            </div>
        </div>
    </van-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { languageColumns, locale } from "@/utils/i18n";

import type { PickerColumn } from 'vant';


// 控制 Popover 显示状态
const showPopover = ref(false);

// 获取当前语言 (利用 i18n.ts 中的计算属性 getter)
const currentLang = computed(() => locale.value);

// 计算当前语言显示的文本标签
const currentLangLabel = computed(() => {
    const find = languageColumns.find((col) => col.value === currentLang.value);
    return find ? find.text : 'Language';
});

// 选择语言处理
const onSelect = (value: string) => {
    // 利用 i18n.ts 中的计算属性 setter，自动触发 setLang 逻辑
    locale.value = value;

    // 关闭弹窗
    showPopover.value = false;
};
</script>

<style scoped>
/* 可选：如果 Unocss 没有覆盖到 Vant 的某些样式，可以在这里微调 */
:deep(.van-popover__content) {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>

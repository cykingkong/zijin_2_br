<template>
    <!-- 使用 Vant Popover 气泡弹出框 -->
    <van-popover v-model:show="showPopover" placement="bottom-end" :offset="[0, 8]" class="language-popover">
        <!-- 触发器：胶囊按钮 -->
        <template #reference>
            <div
                class="lang-trigger flex items-center justify-between h-[32px] px-[10px] py-[6px] rounded-full cursor-pointer select-none transition-opacity active:opacity-70 gap-[8px]">
                <!-- 左侧地球图标 -->
                <svg class="w-14 h-14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M7.00002 12.8333C10.2217 12.8333 12.8334 10.2216 12.8334 6.99996C12.8334 3.7783 10.2217 1.16663 7.00002 1.16663C3.77836 1.16663 1.16669 3.7783 1.16669 6.99996C1.16669 10.2216 3.77836 12.8333 7.00002 12.8333Z"
                        stroke="#F5F5F5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M4.66664 1.75H5.24998C4.11248 5.15667 4.11248 8.84333 5.24998 12.25H4.66664"
                        stroke="#F5F5F5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.75 1.75C9.8875 5.15667 9.8875 8.84333 8.75 12.25" stroke="#F5F5F5"
                        stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M1.75 9.33333V8.75C5.15667 9.8875 8.84333 9.8875 12.25 8.75V9.33333" stroke="#F5F5F5"
                        stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M1.75 5.24998C5.15667 4.11248 8.84333 4.11248 12.25 5.24998" stroke="#F5F5F5"
                        stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <!-- 当前语言文字 -->
                <span class="text-[13px] font-medium text-[#F5F5F5] mr-2 leading-none pt-[1px]">
                    {{ currentLangLabel }}
                </span>

                <!-- 右侧下拉箭头 (根据展开状态旋转) -->
                <van-icon name="play" class="text-[#fff] transition-transform duration-200"
                    :class="showPopover ? '-rotate-90' : 'rotate-90'" size="10" />
            </div>
        </template>

        <!-- 弹出层内容：语言列表 -->
        <div class="lang-menu w-[176px] py-[8px] px-[8px]">
            <div v-for="item in languageColumns" :key="item.value" @click="onSelect(item.value)"
                class="lang-option flex items-center justify-between px-[10px] py-[10px] cursor-pointer transition-colors">

                <!-- 语言名称 -->
                <span class="text-[14px]"
                    :class="item.value === currentLang ? 'font-medium text-[#F5F5F5]' : 'text-[#A3A3A3]'">
                    {{ item.text }}
                </span>

                <!-- 选中状态图标 (黑色圆底白勾) -->

                <svg v-if="item.value === currentLang" class="w-14 h-14" viewBox="0 0 14 14" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M7.00002 12.8333C10.2084 12.8333 12.8334 10.2083 12.8334 6.99996C12.8334 3.79163 10.2084 1.16663 7.00002 1.16663C3.79169 1.16663 1.16669 3.79163 1.16669 6.99996C1.16669 10.2083 3.79169 12.8333 7.00002 12.8333Z"
                        fill="#8BFFBE" />
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
const onSelect = (value: any) => {
    // 利用 i18n.ts 中的计算属性 setter，自动触发 setLang 逻辑
    locale.value = value;

    // 关闭弹窗
    showPopover.value = false;
};
</script>

<style scoped>
.lang-trigger {
    border: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(255, 255, 255, 0.04);
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.04),
        0 8px 24px rgba(0, 0, 0, 0.24);
}

.lang-menu {
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 18px;
    background: linear-gradient(180deg, rgba(17, 17, 17, 0.98) 0%, rgba(8, 8, 8, 0.98) 100%);
    box-shadow:
        inset 0 1px 2px rgba(255, 255, 255, 0.04),
        inset 0 -8px 20px rgba(0, 0, 0, 0.45),
        0 8px 24px rgba(0, 0, 0, 0.45);
}

.lang-option {
    border-radius: 12px;
}

.lang-option:active {
    background: rgba(255, 255, 255, 0.04);
}

:deep(.van-popover__content) {
    border-radius: 18px;
    background: transparent;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
    overflow: hidden;
}
</style>

<template>
  <div class="close-button h-[56px] w-full flex items-center px-[24px] justify-between"
    :class="[customClass, { disabled: disabled }]">
    <!-- <div class="close-icon" :style="iconStyle" ></div> -->
    <slot name="left">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"
        @click="handleClose">
        <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="white" />
        <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#F0F0F0" />
        <path d="M21.6667 16.6667L18.3333 20L21.6667 23.3333" stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    </slot>


    <div class="text-[16px] font-bold color-white">
      <slot name="center">{{ title }}</slot>
    </div>
    <slot name="right">
      <div></div>
    </slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  // 自定义样式类
  customClass?: string;
  // 是否禁用点击
  disabled?: boolean;
  // 自定义图标样式
  iconStyle?: Record<string, string>;
  // 图标大小
  iconSize?: string;
  // 标题
  title?: string;
}

interface Emits {
  (e: "close"): void;
}

const props = withDefaults(defineProps<Props>(), {
  customClass: "",
  disabled: false,
  iconStyle: () => ({}),
  iconSize: "24px",
  title: "",
});

const emit = defineEmits<Emits>();

// 处理关闭事件
const handleClose = () => {
  if (!props.disabled) {
    emit("close");
  }
};
</script>

<style scoped>
.close-button {
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.close-button:hover {
  opacity: 0.8;
}

.close-button:active {
  opacity: 0.6;
}

.close-button.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.close-icon {
  width: 24px;
  height: 24px;
  background: url("@/assets/image/white-close.svg") no-repeat center;
  background-size: 100% 100%;
}
</style>

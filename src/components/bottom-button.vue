<template>
  <div class="fixed bottom-btn-box w-full px-[20px] left-0 flex gap-12 flex-wrap"
    :style="{ background: bgColor, zIndex: zIndex }">
    <slot name='top'>

    </slot>
    <van-button type="primary" class="bottom-action-btn" :color="color" block @click="handleClick" :loading="loading"
      :disabled="disabled">
      {{ buttonText }}
    </van-button>
    <slot name="btn"> </slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  buttonText?: string;
  loading?: boolean;
  disabled?: boolean;
  bgColor?: string;
  color?: string;
  zIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: "Confirm",
  loading: false,
  disabled: false,
  bgColor: "transparent",
  color: "#68F7A1",
  zIndex: 10,
});

const emit = defineEmits<{
  click: [];
}>();

const handleClick = () => {
  emit("click");
};
</script>

<style lang="less" scoped>
.bottom-btn-box {
  bottom: 0;
  padding-top: 12px;
  padding-bottom: calc(env(safe-area-inset-bottom) + 14px);
  backdrop-filter: blur(16px);
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(5, 5, 5, 0.78) 35%, rgba(5, 5, 5, 0.96) 100%);
}

.bottom-action-btn {
  height: 56px !important;
  border: none;
  border-radius: 999px !important;
  color: #050505 !important;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(90deg, #68f7a1 0%, #8bffbe 100%) !important;
  box-shadow: 0 0 12px rgba(124, 255, 178, 0.45), 0 0 36px rgba(124, 255, 178, 0.18);
}

:deep(.bottom-action-btn.van-button--disabled) {
  opacity: 0.5;
  box-shadow: none;
}

:deep(.bottom-action-btn .van-button__text) {
  font-size: 16px;
  font-weight: 700;
}
</style>
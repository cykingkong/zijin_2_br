<template>
  <div class="fixed bottom-btn-box w-full px-[24px] left-0 flex gap-12"
    :style="{ background: bgColor, zIndex: zIndex }">
    <van-button type="primary" class="h-[56px]" :color="color" block @click="handleClick" :loading="loading"
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
  bgColor: "white",
  color: "#6B39F4",
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
  padding-top: 12px;
  bottom: 0;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
}
</style>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  maxCount: {
    type: Number,
    default: 1,
  },
  showCameraButton: {
    type: Boolean,
    default: true,
  },
  showUploadButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue', 'after-read'])

const { t } = useI18n()

const pictureList = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// 计算剩余可上传数量
const remainingCount = computed(() => {
  return props.maxCount - pictureList.value.length
})

// 是否显示分割线和拍照按钮
const showDivider = computed(() => {
  return props.showCameraButton && props.showUploadButton && pictureList.value.length < props.maxCount
})

// 选择文件前的验证
const beforeRead = (file) => {
  const files = Array.isArray(file) ? file : [file]
  const currentCount = pictureList.value.length
  const newCount = files.length

  // 检查是否超过限制
  if (currentCount + newCount > props.maxCount) {
    // 如果超过限制，只接受能容纳的数量
    const allowedCount = props.maxCount - currentCount
    if (allowedCount > 0) {
      return files.slice(0, allowedCount)
    }
    return false
  }

  return true
}

// 文件读取后的处理
const handleAfterRead = async (file, type) => {
  emit('after-read', file, type)
}
</script>

<template>
  <div class="image-uploader-component w-full">
    <div v-if="pictureList.length > 0" class="upload-progress">
      <span class="upload-progress__label">{{ t("uploaded") }}</span>
      <span class="upload-progress__value">{{ pictureList.length }} / {{ maxCount }}</span>
    </div>

    <div v-if="showUploadButton" class="w-full">
      <van-uploader accept="image/*" multiple preview-image :max-count="maxCount" v-model="pictureList"
        :before-read="beforeRead" :after-read="(file) => handleAfterRead(file, 'file')"
        class="full-width-uploader custom-preview-uploader">
        <div class="upload-box upload-box--primary">
          <div class="upload-box__glow"></div>
          <div class="upload-box__icon-wrap">
            <svg class="upload-box__icon" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19.0559 2.33334C23.0101 2.33334 25.6663 5.10829 25.6663 9.23666V18.764C25.6662 22.8923 23.0102 25.6663 19.0549 25.6664H8.9436C4.9896 25.6663 2.33333 22.8922 2.33325 18.764V9.23666C2.33325 5.10836 4.98954 2.33343 8.9436 2.33334H19.0559ZM20.342 14.6419C19.0916 13.8621 18.1259 14.9576 17.8655 15.308C17.6146 15.6461 17.3986 16.0199 17.1711 16.3929C16.6151 17.3138 15.9778 18.376 14.8752 18.9935C13.2729 19.8804 12.056 19.0628 11.1809 18.4681C10.8525 18.2466 10.5329 18.0374 10.2151 17.8978C9.43157 17.5598 8.72622 17.9448 7.67993 19.2738C7.13107 19.9682 6.58661 20.6571 6.0354 21.3431C5.70618 21.7535 5.78465 22.3869 6.22876 22.6615C6.93845 23.0985 7.80515 23.3333 8.78345 23.3333H18.6155C19.1702 23.3333 19.727 23.2576 20.2571 23.0843C21.4509 22.6942 22.3987 21.8008 22.8938 20.6214C23.3114 19.6294 23.5148 18.4249 23.1243 17.4232C22.994 17.0909 22.799 16.7812 22.5256 16.5091C21.8089 15.7976 21.1386 15.1331 20.342 14.6419ZM9.91528 7.00034C8.30701 7.00051 6.99927 8.30946 6.99927 9.91733C6.99962 11.5249 8.30723 12.8332 9.91528 12.8333C11.5222 12.8332 12.83 11.5249 12.8303 9.91733C12.8303 8.30947 11.5224 7.00053 9.91528 7.00034Z"
                fill="currentColor" />
            </svg>
          </div>
          <div class="upload-box__title">{{ t("Select file") }}</div>
          <div class="upload-box__text">{{ t("Upload Photo") }}</div>
        </div>
      </van-uploader>
    </div>

    <div v-if="showDivider" class="or my-[28px]">
      <span></span>
      <em>{{ t("or") }}</em>
      <span></span>
    </div>

    <div v-if="showCameraButton" class="w-full">
      <van-uploader accept="image/*" multiple :max-count="maxCount" :preview-image="false" capture="camera"
        v-model="pictureList" :before-read="beforeRead" :after-read="(file) => handleAfterRead(file, 'camera')"
        class="full-width-uploader">
        <div class="upload-box upload-box--secondary">
          <div class="upload-box__icon-wrap upload-box__icon-wrap--small">
            <svg class="upload-box__icon upload-box__icon--small" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M14.5334 5.197C14.5667 5.25527 14.6251 5.29689 14.7001 5.29689C16.7001 5.29689 18.3334 6.92841 18.3334 8.92619V13.8707C18.3334 15.8685 16.7001 17.5 14.7001 17.5H5.30008C3.29175 17.5 1.66675 15.8685 1.66675 13.8707V8.92619C1.66675 6.92841 3.29175 5.29689 5.30008 5.29689C5.36675 5.29689 5.43341 5.2636 5.45841 5.197L5.50841 5.09711C5.53714 5.03666 5.56662 4.97457 5.59654 4.91153C5.80973 4.46248 6.0456 3.96567 6.19175 3.6737C6.57508 2.92453 7.22508 2.50832 8.03341 2.5H11.9584C12.7667 2.50832 13.4251 2.92453 13.8084 3.6737C13.9397 3.93592 14.1397 4.35833 14.3324 4.76545C14.3722 4.84942 14.4116 4.93274 14.4501 5.01387L14.5334 5.197ZM13.9251 8.39345C13.9251 8.80966 14.2584 9.14262 14.6751 9.14262C15.0917 9.14262 15.4334 8.80966 15.4334 8.39345C15.4334 7.97725 15.0917 7.63596 14.6751 7.63596C14.2584 7.63596 13.9251 7.97725 13.9251 8.39345ZM8.55841 9.68368C8.95008 9.29245 9.45841 9.08435 10.0001 9.08435C10.5417 9.08435 11.0501 9.29245 11.4334 9.67536C11.8167 10.0583 12.0251 10.566 12.0251 11.1071C12.0167 12.2225 11.1167 13.1299 10.0001 13.1299C9.45841 13.1299 8.95008 12.9218 8.56675 12.5388C8.18341 12.1559 7.97508 11.6482 7.97508 11.1071V11.0988C7.96675 10.5744 8.17508 10.0666 8.55841 9.68368ZM12.3084 13.4212C11.7167 14.0122 10.9001 14.3785 10.0001 14.3785C9.12508 14.3785 8.30841 14.0372 7.68341 13.4212C7.06675 12.7969 6.72508 11.9811 6.72508 11.1071C6.71675 10.2414 7.05841 9.42564 7.67508 8.80133C8.30008 8.17703 9.12508 7.83574 10.0001 7.83574C10.8751 7.83574 11.7001 8.17703 12.3167 8.79301C12.9334 9.41731 13.2751 10.2414 13.2751 11.1071C13.2667 12.0144 12.9001 12.8302 12.3084 13.4212Z"
                fill="currentColor" />
            </svg>
          </div>
          <div class="upload-box__action">{{ t("Open Camera & Take Photo") }}</div>
        </div>
      </van-uploader>
    </div>
  </div>
</template>

<style lang="less" scoped>
.upload-progress {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-left: 3px solid #d8921b;
  border-radius: 18px;
  background: rgba(216, 146, 27, 0.12);
  box-shadow: inset 0 0 0 1px rgba(216, 146, 27, 0.16);
}

.upload-progress__label {
  color: #d8921b;
  font-size: 13px;
}

.upload-progress__value {
  color: #f5f5f5;
  font-size: 15px;
  font-weight: 700;
}

:deep(.van-uploader.full-width-uploader) {
  width: 100%;
  display: block;

  .van-uploader__wrapper {
    width: 100%;
    display: block;
  }

  .van-uploader__input-wrapper {
    width: 100%;
    display: block;
  }

  .van-uploader__input {
    width: 100%;
    height: 100%;
  }
}

:deep(.custom-preview-uploader) {
  .van-uploader__preview {
    width: 100%;
    margin: 0 0 16px 0;
    padding: 8px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 28px;
    background: linear-gradient(180deg, #111 0%, #0b0b0b 100%);
    box-shadow:
      inset 0 1px 2px rgba(255, 255, 255, 0.04),
      inset 0 -8px 20px rgba(0, 0, 0, 0.45),
      0 8px 24px rgba(0, 0, 0, 0.35);

    .van-image {
      width: 100%;
      height: 220px;
      border-radius: 22px;
      overflow: hidden;

      img {
        object-fit: cover;
      }
    }
  }

  .van-uploader__preview-delete {
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(8px);

    .van-icon {
      font-size: 18px;
      color: #f5f5f5;
    }
  }
}

.upload-box {
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
}

.upload-box--primary {
  min-height: 240px;
  gap: 14px;
  padding: 28px 20px;
  border-radius: 32px;
  border: 1px solid rgba(124, 255, 178, 0.2);
  background:
    radial-gradient(circle at center, rgba(124, 255, 178, 0.14), transparent 42%),
    linear-gradient(180deg, #111 0%, #0b0b0b 100%);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.04),
    inset 0 -8px 20px rgba(0, 0, 0, 0.45),
    0 0 24px rgba(124, 255, 178, 0.14);
}

.upload-box--secondary {
  min-height: 64px;
  flex-direction: row;
  gap: 12px;
  padding: 0 20px;
  border-radius: 999px;
  border: 1px solid rgba(124, 255, 178, 0.14);
  background: #0b0b0b;
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.04),
    inset 0 -8px 20px rgba(0, 0, 0, 0.45),
    0 8px 24px rgba(0, 0, 0, 0.3);
}

.upload-box__glow {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124, 255, 178, 0.22) 0%, rgba(124, 255, 178, 0) 72%);
  filter: blur(8px);
}

.upload-box__icon-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  color: #8bffbe;
  background: rgba(124, 255, 178, 0.08);
  box-shadow:
    inset 0 0 0 1px rgba(124, 255, 178, 0.2),
    0 0 12px rgba(124, 255, 178, 0.24),
    0 0 36px rgba(124, 255, 178, 0.12);
}

.upload-box__icon-wrap--small {
  width: 40px;
  height: 40px;
}

.upload-box__icon {
  width: 30px;
  height: 30px;
}

.upload-box__icon--small {
  width: 18px;
  height: 18px;
}

.upload-box__title,
.upload-box__action {
  position: relative;
  z-index: 1;
  color: #f5f5f5;
  font-size: 16px;
  font-weight: 700;
}

.upload-box__text {
  position: relative;
  z-index: 1;
  color: #a3a3a3;
  font-size: 13px;
}

.or {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #6b6b6b;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  span {
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
  }

  em {
    font-style: normal;
  }
}
</style>

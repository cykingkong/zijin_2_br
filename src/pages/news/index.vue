<script setup>
import router from "@/router";
import { useUserStore } from "@/stores";
import { navTitleStore } from "@/stores/index";
import { isLogin } from "@/utils/auth";
import { useI18n } from "vue-i18n";
import { closeToast, showLoadingToast, showSuccessToast } from "vant";
import { ref, computed, watch, onMounted } from 'vue';
import { upload, uploadImage ,getUserImagesNum} from '@/api/tool'
const { t } = useI18n();
const navStore = navTitleStore();
const userStore = useUserStore();

// 1. 定义共用的图片列表
const pictureList = ref([]);
const limit =ref(1)
const handleAfterRead = async (file, type) => {
  console.log('File read:', file);
  file.status = 'uploading';
  file.message = t('Uploading');
  try {
    const formData = new FormData();
    formData.append("image", file.file);
    const { data, code } = await upload(formData)
    if (code == 200) {
      console.log(pictureList.value)
      file.status = 'done';
      file.uploadUrl = data.url;
      file.message = t('Done');
    }
  } catch (e) {
    console.log(e, 'err')
    file.status = 'failed';
    file.message = t('failed');
  }



};
const submit = async () => {
  try {
    let formData = pictureList.value.map((e) => {
      return e.uploadUrl
    })
    const { data, code } = await uploadImage({ url_list: formData })
    if (code == 200) {
      console.log(data.url, 'data.url')
      showSuccessToast({})
      pictureList.value = [];
        router.push({ path: "/" })
    }
  } catch (e) {
    console.log(e, 'err')
  }
}
onMounted(() => {
  // init(); // 暂时注释，按需开启
  navStore.setShowNavLeft(true);
  getUserImagesNum().then((res) => {
    if (res.code == 200) {
      limit.value = res.data.num
    }
  })
});
</script>

<template>
  <div class="Home bg-[#f7f7f7] pb-[120px] px-[24px]">
    <div class="label w-full text-center h-44 pt-16 font-bold">
    
    </div>
    <div class="label w-full text-[32px] fontbold mb-32">
      {{ t("Upload Photo") }}
    </div>

    <!-- 
      顶部上传组件：
      1. 负责展示预览列表 (默认功能)
      2. 负责普通文件选择
    -->
    <div class="w-full">
      <van-uploader accept="image/*" preview-image :max-count="limit" v-model="pictureList"
        :after-read="(file) => handleAfterRead(file, 1)" class="full-width-uploader custom-preview-uploader">
        <!-- 自定义上传按钮区域 -->
        <div
          class="upload-box w-full flex flex-col gap-[16px] items-center justify-center h-[200px] rounded-[32px] border-[3px] border-solid border-[#12D18E] border text-center bg-[#FAFAFA] text-[#9e9e9e]">
          <svg class="w-28 h-28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.0559 2.33334C23.0101 2.33334 25.6663 5.10829 25.6663 9.23666V18.764C25.6662 22.8923 23.0102 25.6663 19.0549 25.6664H8.9436C4.9896 25.6663 2.33333 22.8922 2.33325 18.764V9.23666C2.33325 5.10836 4.98954 2.33343 8.9436 2.33334H19.0559ZM20.342 14.6419C19.0916 13.8621 18.1259 14.9576 17.8655 15.308C17.6146 15.6461 17.3986 16.0199 17.1711 16.3929C16.6151 17.3138 15.9778 18.376 14.8752 18.9935C13.2729 19.8804 12.056 19.0628 11.1809 18.4681C10.8525 18.2466 10.5329 18.0374 10.2151 17.8978C9.43157 17.5598 8.72622 17.9448 7.67993 19.2738C7.13107 19.9682 6.58661 20.6571 6.0354 21.3431C5.70618 21.7535 5.78465 22.3869 6.22876 22.6615C6.93845 23.0985 7.80515 23.3333 8.78345 23.3333H18.6155C19.1702 23.3333 19.727 23.2576 20.2571 23.0843C21.4509 22.6942 22.3987 21.8008 22.8938 20.6214C23.3114 19.6294 23.5148 18.4249 23.1243 17.4232C22.994 17.0909 22.799 16.7812 22.5256 16.5091C21.8089 15.7976 21.1386 15.1331 20.342 14.6419ZM9.91528 7.00034C8.30701 7.00051 6.99927 8.30946 6.99927 9.91733C6.99962 11.5249 8.30723 12.8332 9.91528 12.8333C11.5222 12.8332 12.83 11.5249 12.8303 9.91733C12.8303 8.30947 11.5224 7.00053 9.91528 7.00034Z"
              fill="#9E9E9E" />
          </svg>
          <span>{{ t("Select file") }}</span>
        </div>
      </van-uploader>
    </div>

    <div class="or my-32 font-normal text-center w-full color-[#616161] relative block" :class="{'hidden': pictureList.length == limit}">
      {{ t("or") }}
    </div>

    <!-- 
      底部上传组件：
      1. 绑定相同的 v-model="pictureList"
      2. :show-upload-list="false" -> 不显示预览列表（由上面那个组件显示）
      3. capture="camera" -> 优先调起相机
    -->
    <div class="w-full">
      <van-uploader accept="image/*" :max-count="limit" :preview-image="false" capture="camera" v-model="pictureList"
        :after-read="(file) => handleAfterRead(file, 1)" class="full-width-uploader">
        <div
          class="upload-box w-full flex gap-[16px] items-center justify-center h-[58px] rounded-[58px] border-[3px] border-solid border-[#E7FAF4] border bg-[#E7FAF4] text-[#12D18E] font-bold">
          <svg class="w-20 h-20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M14.5334 5.197C14.5667 5.25527 14.6251 5.29689 14.7001 5.29689C16.7001 5.29689 18.3334 6.92841 18.3334 8.92619V13.8707C18.3334 15.8685 16.7001 17.5 14.7001 17.5H5.30008C3.29175 17.5 1.66675 15.8685 1.66675 13.8707V8.92619C1.66675 6.92841 3.29175 5.29689 5.30008 5.29689C5.36675 5.29689 5.43341 5.2636 5.45841 5.197L5.50841 5.09711C5.53714 5.03666 5.56662 4.97457 5.59654 4.91153C5.80973 4.46248 6.0456 3.96567 6.19175 3.6737C6.57508 2.92453 7.22508 2.50832 8.03341 2.5H11.9584C12.7667 2.50832 13.4251 2.92453 13.8084 3.6737C13.9397 3.93592 14.1397 4.35833 14.3324 4.76545C14.3722 4.84942 14.4116 4.93274 14.4501 5.01387L14.5334 5.197ZM13.9251 8.39345C13.9251 8.80966 14.2584 9.14262 14.6751 9.14262C15.0917 9.14262 15.4334 8.80966 15.4334 8.39345C15.4334 7.97725 15.0917 7.63596 14.6751 7.63596C14.2584 7.63596 13.9251 7.97725 13.9251 8.39345ZM8.55841 9.68368C8.95008 9.29245 9.45841 9.08435 10.0001 9.08435C10.5417 9.08435 11.0501 9.29245 11.4334 9.67536C11.8167 10.0583 12.0251 10.566 12.0251 11.1071C12.0167 12.2225 11.1167 13.1299 10.0001 13.1299C9.45841 13.1299 8.95008 12.9218 8.56675 12.5388C8.18341 12.1559 7.97508 11.6482 7.97508 11.1071V11.0988C7.96675 10.5744 8.17508 10.0666 8.55841 9.68368ZM12.3084 13.4212C11.7167 14.0122 10.9001 14.3785 10.0001 14.3785C9.12508 14.3785 8.30841 14.0372 7.68341 13.4212C7.06675 12.7969 6.72508 11.9811 6.72508 11.1071C6.71675 10.2414 7.05841 9.42564 7.67508 8.80133C8.30008 8.17703 9.12508 7.83574 10.0001 7.83574C10.8751 7.83574 11.7001 8.17703 12.3167 8.79301C12.9334 9.41731 13.2751 10.2414 13.2751 11.1071C13.2667 12.0144 12.9001 12.8302 12.3084 13.4212Z"
              fill="#12D18E" />
          </svg>
          {{ t("Open Camera & Take Photo") }}
        </div>
      </van-uploader>
    </div>
    <div class="submit-btn mt-32">
      <van-button type="primary" color="#12D18E" class="h-[48px]! rounded-full!" block @click="submit()">
        {{ t("Submit") }}
      </van-button>
    </div>
  </div>
</template>

<route lang="json5">
{
  name: 'home',
  meta: {
    i18n: 'home'
  },
}
</route>
<style lang="less" scoped>
/* 1. 基础布局修复：保证 uploader 占满全宽 */
:deep(.van-uploader.full-width-uploader) {
  width: 100%;

  .van-uploader__wrapper {
    width: 100%;
  }

  .van-uploader__input-wrapper {
    width: 100%;
  }
}

/* 2. 核心修复：自定义已上传图片的样式 (针对 custom-preview-uploader) */
:deep(.custom-preview-uploader) {
  .van-uploader__preview {
    /* 让预览容器占满一行 */
    width: 100%;
    margin: 0 0 16px 0;
    /* 图片下间距 */

    .van-image {
      width: 100%;
      height: 200px;
      /* 固定高度 200px */
      border-radius: 32px;
      /* 圆角 32px，保持一致 */
      overflow: hidden;

      img {
        object-fit: cover;
        /* 裁剪模式：保持比例填满 */
      }
    }
  }

  /* 调整删除按钮的位置（可选，防止挡住图片内容） */
  .van-uploader__preview-delete {
    width: 24px;
    height: 24px;
    border-radius: 0 0 0 12px;

    .van-icon {
      font-size: 24px;
    }
  }
}

/* 分割线样式 */
.or::before,
.or::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 144px;
  height: 1px;
  background-color: #cbd5e1;
  transform: translateY(-50%);
}

.or::before {
  left: 0;
}

.or::after {
  right: 0;
}
</style>
<template>
    <div class="webview-container">
        <iframe :src="webviewUrl" style="width: 100%; border: none;" class="webview-iframe" allowfullscreen></iframe>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import CryptoJS from "crypto-js";
import { useUserStore } from "@/stores";
import { getKfUrlNew } from "@/api/user";

const route = useRoute()
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
function jumptoSearchUrl(data, url) {
    for (var key in data) {
        if (data[key]) {
            url += '&' + key + '=' + data[key];
        }
    }
    return encodeURI(url)
}

const webviewUrl = computed(() => {
    const islogin = route.query.islogin

    if (islogin === 'true') {
        // 使用MD5加密生成wttUUid
        let wttUUid = CryptoJS.MD5(
            `${userInfo.value.user_id}+DDBworkers`
        ).toString();
        const selData = {
            uuid: wttUUid,
            nickname: userInfo.value.user_id || userInfo.value.account || userInfo.value.email || userInfo.value.phone || 'User',
        }

        return jumptoSearchUrl(selData, userInfo.value.kf_url)


    } else if (islogin === 'false') {
        // 使用MD5加密生成游客UUid 时间戳 + 固定字符串
        let ykUUid = CryptoJS.MD5(`${Date.now()}+DDBworkers`).toString();
        return localStorage.getItem("kf_url") + `&uuid=${ykUUid}`;


    } else {
        // 默认显示空白页面
        return 'about:blank'
    }
})
</script>

<style scoped>
.webview-container {
    width: 100%;
    height: calc(100vh - var(--van-nav-bar-height));
    overflow: hidden;
}

.webview-iframe {
    height: calc(100vh - var(--van-nav-bar-height));
}
</style>
<route lang="json5">
    {
      name: 'webview',
      meta: {
        title: '',
        i18n: ''
      },
    }
</route>
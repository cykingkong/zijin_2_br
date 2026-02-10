<template>
    <div class="faq-list flex-col gap-[12px] min-h-[100vh] bg-[#F7F7F7] p-20  flex">
        <!-- -->
        <FaqItem v-for="(item, index) in newsList" :key="index" :item="item" @click="handleClickItem(item)" />

    </div>
</template>

<script setup>
import { indexInfo, articleList } from "@/api/market";
import { ref } from 'vue';
const newsList = ref([]);
const router = useRouter()
function getArticleList(params) {
    // 1 关于我们 常见问题 2 新闻中心 3 新闻活动
    articleList({ pageIndex: 1, pageSize: 20, ...params }).then(({ data, code }) => {
        if (code == 200) {
            if (params.article_type === 2) {
                newsList.value = data.rows
            }
            else if (params.article_type === 3) {
                activityList.value = data.rows
            }
        }
    });
}
const handleClickItem = (item) => {
    localStorage.setItem('activityDetail', JSON.stringify(item))
    router.push({
        path: '/activityDetail',
    })
    // local.setlocal('activityDetail', item)
}
onMounted(() => {
    getArticleList({ article_type: 2 })

})
const feature = ref();
</script>

<route lang="json5">
{
  name: 'faqList',
  meta: {
    i18n: 'faqList'
  },
}
</route>
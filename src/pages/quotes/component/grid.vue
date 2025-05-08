<template>
    <div class="grid-content">
        <div v-for="(i, k) in gridList" :key="k" class="grid-item" @click="handleClickItem(k)">
            <div class="grid-img">
                <img :src="i.icon" alt="">
            </div>
            <div class="grid-text font-size-14 mt-12">
                {{ i.label }}
            </div>
        </div>
    </div>
</template>
<script setup>
import grid1 from '@/assets/grid/grid1-quotes.png'
import grid2 from '@/assets/grid/grid2-quotes.png'
import grid3 from '@/assets/grid/grid3-quotes.png'
import grid4 from '@/assets/grid/grid4-quotes.png'
import grid5 from '@/assets/grid/grid5-quotes.png'
import grid6 from '@/assets/grid/grid6-quotes.png'
import grid7 from '@/assets/grid/grid7-quotes.png'
import grid8 from '@/assets/grid/grid8-quotes.png'
import grid9 from '@/assets/grid/grid9-quotes.png'
import grid10 from '@/assets/grid/grid10-quotes.png'
const props = defineProps({
    categoryId: {
        type: Number,
        default: 0
    },

})

const gridList = computed(() => {
    if (props.categoryId == 200) {
        return [
            {
                label: '美股交易',
                icon: grid1,
            },
            {
                label: '永续合约',
                icon: grid2,
            },
            {
                label: '期货交易',
                icon: grid3,
            },
            {
                label: '账变记录',
                icon: grid4,
            },
            {
                label: '新股认购',
                icon: grid5,
            },
            {
                label: '新股库存',
                icon: grid6,
            },

        ]
    }
    else {
        return [
            {
                label: '港股交易',
                icon: grid7,
            },
            {
                label: '永续合约',
                icon: grid8,
            },
            {
                label: '交割合约',
                icon: grid9,
            },
            {
                label: '账变记录',
                icon: grid10,
            },
        ]
    }
})
const emits = defineEmits(['handleClickGrid'])
const handleClickItem = (k) => {

    emits('handleClickGrid', k)
}
</script>
<style lang="less">
.grid-content {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 12px 0;
    gap: 12px;
    background: var(--banner-bg);

    .grid-item {
        flex: 1;
        // height: 75px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 16px;

        .grid-img {
            width: 48px;
            height: 48px;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .grid-text {
            color: var(--van-text)
        }
    }
}
</style>

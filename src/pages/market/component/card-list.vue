<template>
    <div class="card-list">
        <!-- 标题和分页指示器 -->
        <div class="header flex items-center justify-between mb-16px">
            <h2 class="title text-16px font-700 color-#0F172A">Stock Futures</h2>
            <div class="custom-scrollbar flex items-center gap-4px">
                <div class="scrollbar-track w-60px h-4px bg-#E2E8F0 rounded-2px relative cursor-pointer"
                    @click="handleScrollbarClick" ref="scrollbarTrack">
                    <div class="scrollbar-thumb w-20px h-4px bg-#64748B rounded-2px absolute left-0 top-0 transition-all duration-300"
                        :style="{ left: thumbPosition + 'px' }"></div>
                </div>
            </div>
        </div>

        <!-- 股票卡片容器 -->
        <div class="cards-container flex gap-16px overflow-x-auto" ref="cardsContainer" @scroll="handleScroll">
            <!-- 股票卡片 1 -->
            <div class="stock-card min-w-212px bg-white border-1px border-#E2E8F0 border-solid rounded-16px p-20px border border-#E5E7EB"
                v-for="item in 5" :key="item">
                <div class="card-header flex items-start justify-between mb-16px">
                    <div class="left flex items-center gap-12px">
                        <!-- S&P Logo -->
                        <div
                            class="logo w-40px h-40px rounded-full bg-#DC2626 flex items-center justify-center flex-shrink-0">
                            <div class="text-white font-700 text-14px leading-1">
                                <div>S</div>
                                <div class="w-full h-1px bg-white my-1px"></div>
                                <div>P</div>
                            </div>
                        </div>
                        <!-- 指数信息 -->
                        <div class="index-info">
                            <div class="symbol text-14px font-700 color-#374151">SNP500</div>
                            <div class="name text-10px color-#6B7280">S&P 500 Index</div>
                        </div>
                    </div>

                </div>
                <div class="flex ">
                    <div class="price-info">
                        <div class="current-price text-14px font-700 color-#374151 mb-4px">$37,31</div>
                        <div class="change flex items-center gap-4px">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 4L12 8L8 12" stroke="#10B981" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path d="M12 8H4" stroke="#10B981" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                            <span class="text-14px font-500 color-#10B981">1.55%</span>
                        </div>
                    </div>
                    <!-- 价格图表 -->

                    <div class="chart">

                    </div>
                </div>
                <!-- 价格信息 -->

            </div>


        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue"
const { proxy } = getCurrentInstance()!

// 响应式数据
const stockData = ref([
    {
        symbol: 'SNP500',
        name: 'S&P 500 Index',
        price: '$37,31',
        change: '1.55%',
        isPositive: true
    }
])

// 滚动条相关
const cardsContainer = ref<HTMLElement>()
const scrollbarTrack = ref<HTMLElement>()
const thumbPosition = ref(0)

// 滚动条点击处理
const handleScrollbarClick = (event: MouseEvent) => {
    if (!scrollbarTrack.value || !cardsContainer.value) return

    const trackRect = scrollbarTrack.value.getBoundingClientRect()
    const clickX = event.clientX - trackRect.left
    const trackWidth = trackRect.width
    const thumbWidth = 20 // 滑块宽度

    // 计算点击位置对应的滚动比例
    const scrollRatio = Math.max(0, Math.min(1, clickX / trackWidth))

    // 计算滑块位置
    const maxThumbPosition = trackWidth - thumbWidth
    thumbPosition.value = scrollRatio * maxThumbPosition

    // 计算卡片容器的滚动位置
    const maxScrollLeft = cardsContainer.value.scrollWidth - cardsContainer.value.clientWidth
    const scrollLeft = scrollRatio * maxScrollLeft

    // 执行滚动
    cardsContainer.value.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
    })
}

// 滚动事件处理
const handleScroll = () => {
    if (!cardsContainer.value || !scrollbarTrack.value) return

    const { scrollLeft, scrollWidth, clientWidth } = cardsContainer.value
    const maxScrollLeft = scrollWidth - clientWidth

    if (maxScrollLeft <= 0) {
        thumbPosition.value = 0
        return
    }

    // 计算滚动比例
    const scrollRatio = scrollLeft / maxScrollLeft

    // 计算滑块位置
    const trackWidth = scrollbarTrack.value.offsetWidth
    const thumbWidth = 20
    const maxThumbPosition = trackWidth - thumbWidth
    thumbPosition.value = scrollRatio * maxThumbPosition
}

// 组件挂载后初始化
onMounted(() => {
    nextTick(() => {
        handleScroll()
    })
})
</script>

<style lang="less" scoped>
.card-list {
    // padding: 20px;
    // background: #F9FAFB;
    // min-height: 100vh;
}

.header {
    .title {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .custom-scrollbar {
        .scrollbar-track {
            background: #E2E8F0;
            position: relative;

            .scrollbar-thumb {
                background: #64748B;
                transition: all 0.3s ease;
                border-radius: 2px;
            }
        }
    }
}

.cards-container {
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }
}


.price-info {
    .current-price {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .change {
        svg {
            transform: rotate(-45deg);
        }
    }
}
</style>
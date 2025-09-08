<template>
    <div class="stock-item w-full border-1px border-solid border-#E2E8F0 rounded-12px bg-white p-16px">
        <div class="flex items-center justify-between">
            <!-- 左侧：Logo和公司信息 -->
            <div class="left flex items-center gap-12px">
                <!-- 亚马逊Logo -->
                <div class="logo w-40px h-40px rounded-full bg-#FF9900 flex items-center justify-center flex-shrink-0">
                    <img :src="item.logo" alt="" class="w-40px h-40px rounded-full">
                </div>

                <!-- 股票信息 -->
                <div class="stock-info h-40 flex flex-col justify-between">
                    <div class="symbol text-16px font-700 color-#374151">{{ item.type }}{{ item?.full_name }}
                    </div>
                    <div class="company-name text-12px color-#6B7280">{{ item?.time }}
                    </div>
                </div>
            </div>

            <!-- 右侧：价格信息 -->
            <div class="right text-right">
                <div class="current-price text-16px font-bold color-#374151 mb-2px">
                    + {{ item.quantity }}</div>
                <div class="price-change flex items-center justify-end gap-4px color-#64748B text-12px">
                    MX$ {{ item.price }}

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
const { proxy } = getCurrentInstance()!

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    }
})

</script>

<style lang="less" scoped>
.stock-item {
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
    }

    .logo {
        box-shadow: 0 2px 4px rgba(255, 153, 0, 0.2);
    }

    .stock-info {
        .symbol {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.2;
        }

        .company-name {
            line-height: 1.2;
        }
    }

    .right {
        .current-price {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.2;
        }

        .price-change {
            line-height: 1.2;
        }
    }
}
</style>
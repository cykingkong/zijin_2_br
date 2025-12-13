<template>
    <div class="stock-item w-full border border-solid border-[#E2E8F0] rounded-[12px] bg-white p-[16px]">
        <div class="flex items-center justify-between">
            <!-- 左侧：Logo和公司信息 -->
            <div class="left flex items-center gap-[12px]">
                <!-- 亚马逊Logo -->


                <!-- 股票信息 -->
                <div class="stock-info h-40 flex flex-col justify-between">
                    <div class="symbol text-[16px] font-bold color-[#374151]">{{ item.logTypeDesc }}
                    </div>
                    <div class="company-name text-[12px] color-[#6B7280]">{{ item?.createdAt }}
                    </div>
                </div>
            </div>

            <!-- 右侧：价格信息 -->
            <div class="right text-right ">

                <div
                    class="price-change text-nowrap flex items-center justify-end gap-[4px] color-[#64748B] text-[12px]">
                    {{ item.type == '1' ? '+' : '-' }} ₹ {{ item.amount }}

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
// 字符串 字母首大写
function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
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
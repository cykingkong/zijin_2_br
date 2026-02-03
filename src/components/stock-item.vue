<template>
    <div class="stock-item w-full border border-solid border-[#E2E8F0] rounded-[12px] bg-white p-[16px]">

        <!-- 左侧：Logo和公司信息 -->
        <div class="left  gap-[12px] w-full">
            <!-- 股票信息 -->

            <div
                class="symbol text-[16px] font-normal color-[#374151] pb-[16px] border-b-solid border-b-[#E2E8F0] border-b-[1px]">
                {{ props.showType == 2 ? t('Withdrawal')
                    : item.logTypeDesc }}
            </div>
            <div class="buttom-flex w-full flex items-center justify-between pt-[16px]">
                <div class="company-name text-[12px] color-[#161616] flex justify-center items-center gap-[6px]"> <svg
                        class="w-18 h-18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.1425 1.5H5.8575C3.1275 1.5 1.5 3.1275 1.5 5.8575V12.135C1.5 14.8725 3.1275 16.5 5.8575 16.5H12.135C14.865 16.5 16.4925 14.8725 16.4925 12.1425V5.8575C16.5 3.1275 14.8725 1.5 12.1425 1.5ZM6.3525 8.235C6.57 8.0175 6.93 8.0175 7.1475 8.235L8.4375 9.525V4.8825C8.4375 4.575 8.6925 4.32 9 4.32C9.3075 4.32 9.5625 4.575 9.5625 4.8825V9.525L10.8525 8.235C11.07 8.0175 11.43 8.0175 11.6475 8.235C11.865 8.4525 11.865 8.8125 11.6475 9.03L9.3975 11.28C9.345 11.3325 9.285 11.37 9.2175 11.4C9.15 11.43 9.075 11.445 9 11.445C8.925 11.445 8.8575 11.43 8.7825 11.4C8.715 11.37 8.655 11.3325 8.6025 11.28L6.3525 9.03C6.135 8.8125 6.135 8.46 6.3525 8.235ZM13.68 12.915C12.1725 13.4175 10.59 13.6725 9 13.6725C7.41 13.6725 5.8275 13.4175 4.32 12.915C4.0275 12.8175 3.87 12.495 3.9675 12.2025C4.065 11.91 4.38 11.745 4.68 11.85C7.47 12.78 10.5375 12.78 13.3275 11.85C13.62 11.7525 13.9425 11.91 14.04 12.2025C14.13 12.5025 13.9725 12.8175 13.68 12.915Z"
                            fill="#161616" />
                    </svg>
                    -R$ {{ item?.amount }}
                </div>
                <div class="company-name text-[12px] color-[#161616]">{{ item?.createdAt }}
                </div>
            </div>


        </div>
        <!-- 右侧：价格信息 -->


    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
const { proxy } = getCurrentInstance()!

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    showType: {
        type: String || Number
    }
})
const { t } = useI18n()
const statusEnum = {
    0: "Under review",
    1: 'Successful',
    2: 'Processed',
    3: "Under review",
    4: "Under review",
    5: "Under review",
    6: "Under review",

}
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
<template>
    <div class="exchange-content p-16">
        <div class="input-box flex gap-8 w-full">
            <div class="input-content h-48 w-full">
                <input type="text" :placeholder="t('Codes')" v-model="codes">
            </div>
            <div class="button border b-solid border flex-shrink-0 bg-[#1b1b1b] text-white px-12 h-48 rounded-16 flex items-center justify-center"
                @click="handleClickExchange">
                {{ t('Exchange') }}</div>
        </div>
        <div class="flex w-full items-center justify-center mb-16">
            <div class="piggy-wrapper">
                <div class="piggy-wrap">
                    <div class="piggy">
                        <div class="nose"></div>
                        <div class="mouth"></div>
                        <div class="ear"></div>
                        <div class="tail">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div class="eye"></div>
                        <div class="hole"></div>
                    </div>
                </div>
                <div class="coin-wrap">
                    <div class="coin">$</div>
                </div>
                <div class="legs"></div>
                <div class="legs back"></div>
            </div>
        </div>
        <!-- Team Member List -->
        <div class="member-list bg-[#F9FAFB] rounded-[16px] overflow-hidden">
            <!-- Table Header -->
            <div class="flex items-center h-[44px] px-[16px] border-b border-[#eee]">
                <div class="w-[30%] text-[12px] text-[#333] font-medium">{{ $t('Codes') }}</div>
                <div class="w-[30%] text-[12px] text-[#333] font-medium text-center">{{ $t('Amount') }}</div>
                <div class="w-[40%] text-[12px] text-[#333] font-medium text-right">{{ $t('Receive Time') }}
                </div>
            </div>
            <!-- Table Body -->
            <div class="list-body">
                <div v-for="(item, index) in userList" :key="index"
                    class="flex items-center h-[48px] px-[16px] bg-white">
                    <div class="w-[30%] text-[14px] text-[#1A1A1A]">{{ item.account }}</div>
                    <div class="w-[30%] text-[14px] text-[#1A1A1A] text-center">{{ item.chilrenCount }}</div>
                    <div class="w-[40%] text-[14px] text-[#1A1A1A] text-right">{{ item.productPrice }}</div>
                </div>

                <empty v-if="userList?.length == 0" :no-tips="true"></empty>
                <LoadMore :status="listStatus" @load-more="loadMore" />

            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { create, list } from '@/api/gift'

const codes = ref('')
const userList = ref([])
const listStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const { t } = useI18n()
const page = reactive({
    pageIndex: 1,
    pageSize: 10
})
const handleClickExchange = async () => {
        codes.value = ''
        
    try {
        const { code } = await create({
            code: codes.value
        })

        if (code == 200) {
            showSuccessToast({
                message:t("Redemption successful")
            })
            getUserList()
        }
    } catch (err) {
        console.log(err, '兑换失败')
    }
}
const getUserList = async () => {
    try {
        const { data } = await list({
            pageIndex: page.pageIndex,
            pageSize: page.pageSize
        })
        if (!data.rows || data.rows.length == 0) {
            listStatus.value = 3
            return
        }
        if (page.pageIndex == 1) {
            userList.value = data.rows || []
        } else {
            userList.value = [...userList.value, ...data.rows || []]
        }
        if (data.length >= data.total) {
            listStatus.value = 3
            return
        }
        listStatus.value = 2
    } catch (err) {
        console.log(err, '获取用户列表失败')
    }
}
const loadMore = () => {
    page.pageIndex++;
    getUserList();
}
onMounted(() => {
    getUserList()
})
</script>
<style scoped lang="less">
.exchange-content {
    padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
}

.input-content {
    border: 1px solid #F0F0F0;
    border-radius: 16px;
    padding: 6px;



    input {
        // background: #F8F9FD;
        border: none;
        height: 100%;
        padding: 0 16px;
        width: 100%;

        &::placeholder {
            color: #999999;
            font-size: 14px;
            font-weight: 400;
        }

        &::-webkit-input-placeholder {
            color: #999999;
            font-size: 14px;
            font-weight: 400;
        }

        &::-moz-placeholder {
            color: #999999;
            font-size: 14px;
            font-weight: 400;
        }

        &:-ms-input-placeholder {
            color: #999999;
            font-size: 14px;
            font-weight: 400;
        }
    }
}

/* From Uiverse.io by JkHuger */
.piggy-wrapper {
    position: relative;
    width: 350px;
    height: 350px;
    display: block;
    margin: 0 auto;
    margin-top: 0px;
    transform: scale(.7);
}

.piggy-wrap {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    transform-origin: bottom center;
    animation: trembling 5s linear infinite;
}

@keyframes trembling {
    0% {
        transform: scale(1);
    }

    19% {
        transform: scale(1);
    }

    21% {
        transform: scale(0.99);
    }

    22% {
        transform: scale(1);
    }

    23% {
        transform: scale(0.99);
    }

    24% {
        transform: scale(1);
    }

    25% {
        transform: scale(0.99);
    }

    26% {
        transform: scale(1);
    }

    25% {
        transform: scale(0.99);
    }

    26% {
        transform: scale(1);
    }

    27% {
        transform: scale(0.99);
    }

    28% {
        transform: scale(1);
    }

    29% {
        transform: scale(0.99);
    }

    30% {
        transform: scale(1);
    }

    60% {
        transform: scale(0.95);
    }

    61% {
        transform: scale(1);
    }

    100% {
        transform: scale(1);
    }
}

.piggy {
    position: absolute;
    bottom: 40px;
    left: 50%;
    margin-left: -160px;
    width: 270px;
    height: 200px;
    display: block;
    border-radius: 100px;
    background-color: #d88fa0;
}

.nose {
    position: absolute;
    top: 80px;
    left: -25px;
    width: 40px;
    height: 60px;
    display: block;
    background-color: #d88fa0;
    z-index: 1;
    border-radius: 4px;
}

.mouth {
    position: absolute;
    top: 95px;
    left: -15px;
    width: 0;
    height: 0;
    z-index: 8;
    display: block;
    border-bottom: 60px solid #d88fa0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-radius: 4px;
}

.ear {
    position: absolute;
    top: -35px;
    left: 70px;
    width: 45px;
    height: 40px;
    display: block;
    border-top-right-radius: 60px;
    background-color: #d88fa0;
    z-index: 1;
}

.piggy:before {
    position: absolute;
    content: '';
    top: -25px;
    left: 55px;
    width: 60px;
    height: 60px;
    display: block;
    border-top-right-radius: 60px;
    background-color: #cb6980;
    z-index: -1;
}

.tail {
    position: absolute;
    left: 254px;
    top: 125px;
}

.tail span {
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    height: 5px;
    transform: rotate(30deg);
    background-color: #d88fa0;
}

.tail span:nth-child(2) {
    left: 3px;
    top: -38px;
    width: 50px;
    height: 50px;
    transform: rotate(-20deg);
    background-color: transparent;
    border-radius: 50%;
    border-width: 5px;
    border-style: solid;
    border-color: transparent #d88fa0 #d88fa0 transparent;
}

.tail span:nth-child(3) {
    left: 22px;
    top: -36px;
    width: 30px;
    height: 30px;
    transform: rotate(-40deg);
    background-color: transparent;
    border-radius: 50%;
    border-width: 5px;
    border-style: solid;
    border-color: #d88fa0 transparent transparent #d88fa0;
}

.tail span:nth-child(4) {
    left: 7px;
    top: -66px;
    width: 60px;
    height: 60px;
    transform: rotate(-40deg);
    background-color: transparent;
    border-radius: 50%;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #d88fa0 transparent;
}

.eye {
    position: absolute;
    left: 35px;
    top: 75px;
    width: 30px;
    height: 30px;
    transform: rotate(45deg);
    border-radius: 50%;
    border-width: 4px;
    border-style: solid;
    border-color: #555 transparent transparent #555;
    animation: blink 5s linear infinite;
}

@keyframes blink {
    0% {
        border-color: #555 transparent transparent #555;
    }

    19% {
        border-color: #555 transparent transparent #555;
    }

    20% {
        border-color: transparent #555 #555 transparent;
    }

    60% {
        border-color: transparent #555 #555 transparent;
    }

    61% {
        border-color: #555 transparent transparent #555;
    }

    100% {
        border-color: #555 transparent transparent #555;
    }
}

.hole {
    position: absolute;
    left: 121px;
    top: 0;
    width: 60px;
    height: 5px;
    background-color: #555;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.coin-wrap {
    position: absolute;
    top: 0;
    left: -8px;
    z-index: 9;
    width: 100%;
    height: 100%;
    opacity: 0;
    transform-origin: bottom center;
    animation: trembling 5s linear infinite, moveCoin 5s linear infinite;
}

.coin {
    position: absolute;
    top: 110px;
    left: 143px;
    z-index: 9;
    width: 61.5px;
    height: 61.5px;
    border-radius: 50%;
    border: 6px solid #e67e22;
    background-color: #f39c12;
    text-align: center;
    line-height: 68px;
    font-size: 45px;
    font-weight: 500;
    color: rgba(32, 32, 32, 0.5);
    box-shadow: inset 0 0 4px #777;
}

@keyframes moveCoin {
    0% {
        opacity: 0;
        top: 0;
    }

    19% {
        opacity: 1;
        top: 0;
    }

    21% {
        top: -7px;
    }

    22% {
        top: -7px;
    }

    23% {
        top: -14px;
    }

    24% {
        top: -14px;
    }

    25% {
        top: -21px;
    }

    26% {
        top: -21px;
    }

    27% {
        top: -28px;
    }

    28% {
        top: -28px;
    }

    29% {
        top: -35px;
    }

    30% {
        top: -35px;
    }

    60% {
        top: -35px;
    }

    66% {
        top: -220px;
        opacity: 1;
    }

    67% {
        top: -220px;
        opacity: 0;
    }

    99% {
        top: 0;
        opacity: 0;
    }

    100% {
        opacity: 0;
        top: 0;
    }
}

.legs {
    position: absolute;
    bottom: 14px;
    left: 96px;
    width: 40px;
    height: 60px;
    display: block;
    background-color: #cb6980;
    border-radius: 3px;
    z-index: 1;
}

.legs:after {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    width: 30px;
    height: 12px;
    display: block;
    background-color: #d88fa0;
    border-bottom-left-radius: 3px;
    border-top-right-radius: 3px;
    z-index: 1;
}

.legs.back {
    left: 206px;
}
</style>
<route lang="json5">
{
  name: 'exchange',
  meta: {
    i18n: 'Exchange'
  },
}
</route>

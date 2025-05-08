<template>
    <div class="exchangeRate-content p-12 flex  flex-col gap-24">
        <!-- 汇率修改 -->
        <div class="rate-item h-32  flex flex-justify-between px-8" v-for="(item, i) in rateList" :key="item.name"
            @click="active = i">
            <div class="l flex items-center gap-8">
                <img :src="item.img" alt="" class="w24 h24"> {{ item.name }}
            </div>
            <img src="@/assets/image/choice-blue.png" alt="" class="w22 h22" v-show="active == i">
        </div>




    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import AUD from "../../../assets/image/exchange-rate/AUD.png";
import CAD from "../../../assets/image/exchange-rate/CAD.png";
import CNY from "../../../assets/image/exchange-rate/CNY.png";
import USD from "../../../assets/image/exchange-rate/USD.png";
import EUR from "../../../assets/image/exchange-rate/EUR.png";
import GBP from "../../../assets/image/exchange-rate/GBP.png";
import HKD from "../../../assets/image/exchange-rate/HKD.png";
import IDR from "../../../assets/image/exchange-rate/IDR.png";
import INR from "../../../assets/image/exchange-rate/INR.png";
import JPY from "../../../assets/image/exchange-rate/JPY.png";
import KRW from "../../../assets/image/exchange-rate/KRW.png";
import SGD from "../../../assets/image/exchange-rate/SGD.png";
import THB from "../../../assets/image/exchange-rate/THB.png";
import TWD from "../../../assets/image/exchange-rate/TWD.png";
const active = ref(0)
const rateList = [
    {
        name: "AUD",
        img: AUD,
    },
    {
        name: "CAD",
        img: CAD,
    },
    {
        name: "CNY",
        img: CNY,
    },
    {
        name: "EUR",
        img: EUR,
    },
    {
        name: "GBP",
        img: GBP,
    },
    {
        name: "HKD",
        img: HKD,
    },
    {
        name: "INR",
        img: INR,
    },
    {
        name: "JPY",
        img: JPY,
    },
    {
        name: "KRW",
        img: KRW,
    },
    {
        name: "SGD",
        img: SGD,
    },
    {
        name: "THB",
        img: THB,
    },
    {
        name: "TWD",
        img: TWD,
    },
    {
        name: "USD",
        img: USD,
    },





]



</script>
<style lang="less" scoped></style>
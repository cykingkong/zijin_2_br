<template>
  <div class="tab-table-table-page px-12 py-12">
    <div class="th font-size-12px flex flex-items-center text-align-center font-extralight">
        <div class="th-item " :class="index==0?'w-100 flex-shrink-0 text-align-left' : 'flex-1'" v-for="(item,index) in props.tableTh" :key="index">{{item}}</div>
    </div>
    <block v-if="props.tdType === 1">
         <div class="td font-size-12px flex flex-items-center text-align-center font-extralight py-12" >
        <div class="td-item w-100 flex-shrink-0 text-align-left" >
            <div class="title">LUSE</div>
            <div class="title font-size-11 text-coolGray">2025-03-03</div>
        </div>
        <div class="td-item flex-1 " >
            <div>1</div>
        </div>
        <div class="td-item flex-1" >
            <div>2</div>
        </div>
        <div class="td-item flex-1" >
            正常
        </div>
    </div>
    </block>
    <block v-if="props.tdType === 2">
         <div class="td font-size-12px flex flex-items-center text-align-center font-extralight py-12" >
        <div class="td-item w-100 flex-shrink-0 text-align-left" >
            <div class="title">LUSE</div>
            <div class="title font-size-11 text-coolGray">2312312USD</div>
        </div>
        <div class="td-item flex-1 " >
            <div class="up">2</div>
            <div class="up">1</div>
        </div>
        <div class="td-item flex-1" >
            <div class="up">2</div>
            <div class="up">2</div>
        </div>
        <div class="td-item flex-1" >
            <div class="down">2</div>
            <div class="down">2</div>
        </div>
        <div class="td-item flex-1" >
            正常
        </div>
    </div>
    </block>


  </div>
</template>
<script setup lang="ts">
import {ref,reactive} from "vue"
const props = defineProps({
    tableTh:{
        type:Array,
        default:()=>[]
    },
    tableData:{
        type:Array,
        default:()=>[1]
    },
    tdType:{
        type:Number,
        default:1
    }
})



</script>
<style lang="less" scoped>
.th{
    color:#747a8f;
}
.td{
    border-bottom:1px solid #747a8f
}


</style>

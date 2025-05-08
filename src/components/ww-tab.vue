<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  time: {
    type: Array,
    default: () => [],
  },
  linewidth: {
    type: Number,
    default: 60,
  },
  widthpercent: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['onchange'])
let action = ref(0)
let slideIndex = ref(0)
function selectIndex(index) {
  action.value = index
  if (props.widthpercent) {
    slideIndex.value = `${index * props.widthpercent}%`
  }
  else {
    slideIndex.value = `${index * props.linewidth}px`
  }
  emit('onchange', index)
}
</script>

<template>
  <div class="pd-top-10">
    <div class="times">
      <p
        v-for="(item, index) in time"
        :key="index"
        class="f-s-14 color-w times-item"
        :class="[action == index ? 'color-b' : '']"
        :style="{ width: widthpercent ? `${widthpercent}%` : `${linewidth}px` }"
        @click="selectIndex(index)"
      >
        {{ item }}
      </p>
      <p
        class="slide"
        :style="{ width: widthpercent ? `${widthpercent}%` : `${linewidth}px`, left: slideIndex }"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
.times {
  width: 95%;
  margin: auto;
  overflow-x: scroll;
  white-space: nowrap;
  position: relative;
  .times-item {
    padding: 10px 0;
    display: inline-block;
    text-align: center;
  }
}
.slide {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: #5e87d3;
  transition: left 0.3s;
}
</style>

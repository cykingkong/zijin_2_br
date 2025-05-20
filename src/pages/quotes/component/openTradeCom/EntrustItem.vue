<template>
  <div class="entrust-item pt-12 flex-col gap-12 flex">
    <div class="flex w-full justify-between items-center">
      <div style="min-width: 70px;" class="text-18 " :class="entrust.offset == 'open' ? 'down' : 'up'">
        {{ entrust.order_type }}/{{ entrust.direction }}
      </div>
      <div class="status">
        {{ entrust.statusDesc }}
      </div>
    </div>

    <div class="flex justify-between ">
      <div class="flex flex-col">
        <div class="flex items-center">

          <div class=" text-16 font-semibold textColor">{{ entrust.symbol_name || '--' }}</div>
        </div>
      </div>
      <div class="text-grey text-14 flex flex-col justify-between">
        {{ entrust.createdAt ? entrust.createdAt : '--' }}
      </div>
    </div>
    <div class="flex justify-between pb-34">
      <div class="flex items-center flex-between">

        <div class=" font-size-14">
          <div class="flex items-center">
            <div class="text-grey">
              <div>{{ $t('数量') }}</div>
              <!-- <di(USDT)v></div> -->
            </div>
            <div class="ml-10 text-14 textColor volume-title">{{ entrust.amount }}
            </div>
          </div>
          <div class="flex mt-20 items-center">
            <div class="text-grey">{{ $t('价格') }}</div>
            <div class="ml-10 text-14 textColor">{{ entrust.amountTotal || '--' }}</div>
          </div>
        </div>
      </div>
      <div class="btn-wrap mt-64">
        <van-button v-if="entrust.status == '1'" type="primary"
          class="ml-19 order-btn border-none h-54 lh-54 cancel-btn" @click.stop="cancelSingle(entrust)">
          {{ $t('撤单') }}</van-button>
        <button v-if="state == 'created'" class="ml-19 order-btn border-none h-54 lh-54 cancel-btn down">{{
          $t('已完成') }}</button>
        <button v-if="state == 'canceled'" class="ml-19 order-btn border-none h-54 lh-54 cancel-btn">{{
          $t('canceled') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Circle } from 'vant'
import dayjs from 'dayjs'
export default {
  name: 'EntrustItem', // 订单委托项
  components: {
    [Circle.name]: Circle
  },
  props: {
    entrust: {
      type: Object,
      default() {
        return {}
      }
    },
    state: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      text: '0',
      currentRate: 0,
      finishRate: 100,
      finishText: '100%',
      item: {},
      dayjs
    }
  },
  watch: {
    entrust(val) {
      // console.log(val)
    }
  },
  mounted() {

  },
  methods: {
    handleWord(type, offset) {
      let str1 = type == 'limit' ? this.$t('限价') : this.$t('市价');
      let str2 = offset == 'open' ? this.$t('买入') : this.$t('卖出');
      return str1 + '/' + str2
    },
    goDetail(order_no) { // 详情
      this.$router.push({ path: "/cryptos/symbolOrderDetail", query: { order_no } });
    },
    cancelSingle(order_no) { // 撤单
      this.$emit('cancelOrder', order_no)
    }
  }
}
</script>
<style lang="less" scoped>
// .ml-40 {
//   margin-left: 20px !important;
// }

.ml-19 {
  margin-left: 9px;
}

.pt-42 {
  padding-top: 21px;
}

.pb-20 {
  padding-bottom: 10px;
}

.mt-20 {
  margin-top: 10px;
}

.mt-64 {
  margin-top: 32px;
}

.h-54 {
  height: 27px;
}

.lh-54 {
  line-height: 27px;
}

.pb-34 {
  padding-bottom: 17px;
}



.entrust-item {
  font-size: 13px;

  border-bottom: 1px solid var(--border_color);

  :deep(.van-circle__text) {}

  s .greyBg {
    background: transparent;
  }

  .volume-title {
    width: 80px;
  }
}

.btn-wrap {
  display: flex;

  button {
    padding: 0 13px;
    border-radius: 3px;
    font-size: 13px;

  }

  .detailBtn {
    font-size: 13px;

  }

  .cancel-btn {}

}

.w-100 {
  min-width: 70px;
}

.circle-box {
  height: 100%;
}

.ml-62 {
  margin-left: 10px;
}
</style>

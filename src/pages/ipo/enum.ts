export const statusEnum = {
    // 0 = 关闭 1 = 可购买 2 = 已购完 3 = 已完结
    0: 'close',
    1: 'Buyable',
    2: 'Sold out',
    3: 'Completed'
} as const;
export const orderStatusEnum = {
    //  0:已申请(等待中签) 1:已中签 2:支付完 3:可出售 4:已出售
    0: 'Waiting',
    1: 'Need Pay',
    2: 'Can Sell',
    3: 'Can Sell',
    4: 'Selled',
} as const;

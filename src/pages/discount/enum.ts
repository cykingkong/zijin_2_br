export const statusEnum = {
    // 0 = 关闭 1 = 可购买 2 = 已购完 3 = 已完结
    0: 'close',
    1: 'Buyable',
    2: 'Sold out',
    3: 'Completed'
} as const;
export const orderStatusEnum = {
    // 0 = 关闭 1 = 可购买 2 = 已购完 3 = 已完结
    1: 'Sell',
    2: 'Not for sale',
} as const;

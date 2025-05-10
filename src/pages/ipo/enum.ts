export const statusEnum = {
    // 0=关闭,1=开始,2=抽签中,3=已结束
    0: '关闭',
    1: '可购买',
    2: '已购完',
    3: '已完结'
} as const;
export const orderStatusEnum = {
    // 0 = 关闭 1 = 可购买 2 = 已购完 3 = 已完结
    1: '未卖出',
    2: '不可出售',
} as const;

export const statusEnum = {
    //  1 = 已完成 2 = 可预约
    0: 'Pending',
    1: 'Available',
    2: 'Completed',

} as const;
export const orderStatusEnum = {
    /**
        *当status = 1 的时候,订单页面显示支付按钮
        *当status = 2 的时候,订单页面显示等待按钮(不可点击)
        *当status = 3 的时候,订单页面显示进行中按钮(不可点击)
        *当status = 4 的时候,订单页面显示已完成按钮(不可点击)
        *当status = 5 和 status = 6 的时候,订单页面显示已结束按钮(不可点击)
        *当status = 7 的时候,订单页面显示 续期 或 赎回 按钮
     */
    1: 'Pay',
    2: 'Waiting',
    3: 'In Progress',
    4: 'Completed',
    5: 'Ended',
    6: 'Ended',
    7: 'Ended'
} as const;

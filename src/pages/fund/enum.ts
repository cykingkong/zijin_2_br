export const statusEnum = {
    //  1 = 已完成 2 = 可预约
    0: 'Pending',
    1: 'Available',
    2: 'Completed',

} as const;
export const orderStatusEnum = {
    //  1 = 已预约 2 = 已支付 3 = 已激活 4 = 已完成 5 = 未支付/失败 6 = 已赎回
    1: 'Reserved',
    2: 'Paid',
    3: 'Activated',
    4: 'Completed',
    5: 'Unpaid/Failed',
    6: 'Redeemed',
    7: 'Completed'
} as const;

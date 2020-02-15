


// 付款状态
export const enumPayType = {
  All:0,
  ToBePaid: 10,
  Freezing: 20,
  Paid: 30,
  Closed: 40,
};

// 付款状态文字
export const TextMapPayStatus = {
  [enumPayType.All]: '全部',
  [enumPayType.ToBePaid]: '待支付',
  [enumPayType.Freezing]: '冻结中',
  [enumPayType.Paid]: '已支付',
  [enumPayType.Closed]: '已关闭'
};




// 结算状态
export const enumSettleType = {
  All:0,
  ToBeSettled: 10,
  Settling: 20,
  Abnormal: 40,
  Settled: 50
};

// 付款状态文字
export const TextMapSettleStatus = {
  [enumSettleType.All]: '全部',
  [enumSettleType.ToBeSettled]: '待结算',
  [enumSettleType.Settling]: '结算中',
  [enumSettleType.Abnormal]: '结算异常',
  [enumSettleType.Settled]: '已结算',

};


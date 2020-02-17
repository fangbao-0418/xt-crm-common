// 付款状态
export const enumPayType = {
  All:'',
  ToBePaid: 10,
  Paid: 20,
  Closed: 30,
  Freezing: 40
};

// 付款状态文字
export const TextMapPayStatus = {
  [enumPayType.All]: '全部',
  [enumPayType.ToBePaid]: '待支付',
  [enumPayType.Paid]: '已支付',
  [enumPayType.Closed]: '已关闭',
  [enumPayType.Freezing]: '冻结中'
};




// 结算状态
export const enumSettleType = {
  All:'',
  ToBeSettled: 10,
  Settling: 20,
  partSettled: 30,
  Abnormal: 40,
  Settled: 50
};

// 付款状态文字
export const TextMapSettleStatus = {
  [enumSettleType.All]: '全部',
  [enumSettleType.ToBeSettled]: '待结算',
  [enumSettleType.Settling]: '结算中',
  [enumSettleType.partSettled]: '部分结算',
  [enumSettleType.Abnormal]: '结算异常',
  [enumSettleType.Settled]: '已结算',

};


import React from 'react';
import GoodCell from '@/components/good-cell';
import MoneyRender from '@/components/money-render'
export const goodsTableColumn = [{
  title: '商品信息',
  dataIndex: 'skuName',
  key: 'skuName',
  render(skuName, row) {
    return <GoodCell {...row} />;
  },
},
{ title: '商品单价', dataIndex: 'salePrice', key: 'salePrice', render: MoneyRender },
{
  title: '购买价格',
  dataIndex: 'buyPrice',
  render: MoneyRender,
  key: 'buyPrice'
},
{
  title: '商品数量',
  dataIndex: 'num',
  key: 'num',
},
{
  title: '实际支付',
  dataIndex: 'totalPrice',
  render: MoneyRender,
  key: 'totalPrice'
}]

export const storeType = ['喜团', '1688', '淘宝联盟'];
export const enumOrderStatus = {
  Refund: -1,
  Unpaid: 10,
  Undelivered: 20,
  Delivered: 30,
  Received: 40,
  Complete: 50,
  Closed: 60,
};
//0所有，10待审核，20处理中，30完成
//0:无售后，10待审核，20售后中，30售后完成，40审核被驳回
// '' 所有
// 当前售后状态
export const enumRefundStatus = {
  All: '',
  NoRefund: 0,
  WaitConfirm: 10,
  Operating: 20,
  OperatingFailed: 21, // 退款失败
  OperatingAll: 22, // 退款退货
  OperatingOfMoney: 23, // 退款中
  OperatingOfGoods: 24, // 换货中
  Complete: 30,
  Rejected: 40,
};

//售后类型（10 退款退货 20 退款 30 换货）
export const enumRefundType = {
  Both: '10',
  Refund: '20',
  Exchange: '30',
};

export const TextMapRefundStatus = {
  [enumRefundStatus.All]: '所有',
  [enumRefundStatus.NoRefund]: '无售后',
  [enumRefundStatus.WaitConfirm]: '待审核',
  [enumRefundStatus.Operating]: '处理中',
  [enumRefundStatus.OperatingFailed]: '处理中(退款失败)',
  [enumRefundStatus.OperatingAll]: '处理中(退款退货中)',
  [enumRefundStatus.OperatingOfMoney]: '处理中(退款中)',
  [enumRefundStatus.OperatingOfGoods]: '处理中(退货中)',
  [enumRefundStatus.Complete]: '已完成',
  [enumRefundStatus.Rejected]: '审核被驳回',
};

export const TextMapRefundType = {
  [enumRefundType.Both]: '退款退货',
  [enumRefundType.Refund]: '退款',
  [enumRefundType.Exchange]: '换货',
};

export const OrderStatusTextMap = {
  [enumOrderStatus.Refund]: '售后',
  [enumOrderStatus.Closed]: '关闭',
  [enumOrderStatus.Complete]: '完成',
  [enumOrderStatus.Delivered]: '已发货',
  [enumOrderStatus.Received]: '已收货',
  [enumOrderStatus.Undelivered]: '待发货',
  [enumOrderStatus.Unpaid]: '待付款',
};

export const TabList = [
  {
    name: '所有订单',
    url: '/order/mainOrder',
    status: undefined,
  },
  {
    name: OrderStatusTextMap[enumOrderStatus.Unpaid],
    url: '/order/unpaidOrder',
    status: enumOrderStatus.Unpaid,
  },
  {
    name: OrderStatusTextMap[enumOrderStatus.Undelivered],
    url: '/order/undeliveredOrder',
    status: enumOrderStatus.Undelivered,
  },
  {
    name: OrderStatusTextMap[enumOrderStatus.Delivered],
    url: '/order/deliveredOrder',
    status: enumOrderStatus.Delivered,
  },
  {
    name: OrderStatusTextMap[enumOrderStatus.Complete],
    url: '/order/completeOrder',
    status: enumOrderStatus.Complete,
  },
  {
    name: OrderStatusTextMap[enumOrderStatus.Closed],
    url: '/order/closedOrder',
    status: enumOrderStatus.Closed,
  },
];

//0非会员 10-团长，20-区长，30-合伙人，40-管理员，50-公司
export const enumMemberType = {
  Visitor: 0,
  Chief: 10,
  Warden: 20,
  Partner: 30,
  Manager: 40,
  Company: 50,
};

export const MemberTypeTextMap = {
  [enumMemberType.Visitor]: '非会员',
  [enumMemberType.Chief]: '团长',
  [enumMemberType.Warden]: '区长',
  [enumMemberType.Partner]: '合伙人',
  [enumMemberType.Manager]: '管理员',
  [enumMemberType.Company]: '公司',
};

export const refundType = [
  {
    label: '全部',
    value: ''
  }, {
    label: '退货退款',
    value: '10'
  }, {
    label: '仅退款',
    value: '20'
  }, {
    label: '仅换货',
    value: '30'
  }
]

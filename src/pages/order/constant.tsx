import React from 'react';
import { Link } from 'react-router-dom';
import GoodCell from '@/components/good-cell';
import MoneyRender from '@/components/money-render'
export const getDetailColumns = () => [
  {
    title: '名称',
    dataIndex: 'skuName',
    key: 'skuName',
    width: '20%',
    render(skuName: any, row: any) {
      return <GoodCell {...row} />;
    }
  },
  {
    title: '商品ID',
    dataIndex: 'productId',
    key: 'productId',
    width: '8%',
    render(text: any) {
      return <Link to={`/goods/edit/${text}?page=1&pageSize=10`}>{text}</Link>
    }
  },
  {
    title: '实名认证',
    dataIndex: 'isAuthentication',
    key: 'isAuthentication',
    render(text: any) {
      return String(text) === '1' ? '是': '否'
    }
  },
  {
    title: '属性',
    dataIndex: 'properties',
    key: 'properties',
  },
  {
    title: '供应商',
    dataIndex: 'storeName',
    key: 'storeName'
  },
  {
    title: '单价',
    width: '8%',
    dataIndex: 'salePrice',
    key: 'salePrice',
    render: MoneyRender
  },
  {
    title: '数量',
    width: '8%',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: '商品总价（元）',
    dataIndex: 'saleTotalPrice',
    width: '8%',
    key: 'saleTotalPrice',
    render: MoneyRender
  },
  {
    title: '使用优惠券',
    dataIndex: 'faceValue',
    key: 'faceValue'
  },
  {
    title: '应付金额',
    dataIndex: 'dealTotalPrice',
    width: '8%',
    key: 'dealTotalPrice',
    render: MoneyRender
  },
  {
    title: '优惠金额',
    dataIndex: 'discountPrice',
    key: 'discountPrice',
    width: '8%',
    render: MoneyRender
  },
  {
    title: '实付金额',
    dataIndex: 'preferentialTotalPrice',
    key: 'preferentialTotalPrice',
    width: '8%',
    render: MoneyRender
  }
];

export const storeType = ['喜团', '1688', '淘宝联盟'];
export const supplierOperate: any = {
  0: '未验收',
  10: '已验收'
}
export enum enumSupplierOperate {
  UNACCEPTED = 0,
  ACCEPTED = 10
}

/**
 * 当前售后状态
 * @readonly
 * @enum {number}
 * @property WaitConfirm {number} 待审核:10
 * 
 * @description 退货，换货
 * @description Operating {number} 待用户发货:20
 * @property OperatingFailed {number} 退款失败:21
 * @property OperatingOfMoney {number} 退款中:23
 * @property OperatingOfGoods{number} 待平台收货:24
 * 
 * 
 * @description 换货
 * @property WaitPlatformDelivery {number} 待平台发货:25
 * @property WaitUserReceipt {number} 待用户收货:26
 * 
 * @description 仅退款
 * @property WaitCustomerServiceOperating {number} 等待客服跟进:27
 * @description 退货退款，仅退款
 *
 * @property Complete {number} 售后完成:30
 * @property Rejected {number} 售后关闭:40
 */
export enum enumRefundStatus {
  All = '',
  NoRefund = 0,
  WaitConfirm = 10,
  Operating = 20,
  OperatingFailed = 21,
  OperatingAll = 22,
  OperatingOfMoney = 23,
  OperatingOfGoods = 24,
  WaitPlatformDelivery = 25,
  WaitUserReceipt = 26,
  WaitCustomerServiceOperating = 27,
  Complete = 30,
  Rejected = 40
};

/**
 * 售后类型
 * @property Both {string} 退货退款:10
 * @property Refund {string} 退款:20
 * @property Exchange {string} 换货:30
 */
export enum enumRefundType {
  Both = 10,
  Refund = 20,
  Exchange = 30,
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


export enum enumOrderStatus {
  Refund = -1,
  Unpaid = 10,
  Undelivered = 20,
  Delivered = 30,
  Received = 40,
  Complete = 50,
  Closed = 60
};

export const OrderStatusTextMap = {
  [enumOrderStatus.Refund]: '售后',
  [enumOrderStatus.Closed]: '关闭',
  [enumOrderStatus.Complete]: '完成',
  [enumOrderStatus.Delivered]: '已发货',
  [enumOrderStatus.Received]: '已收货',
  [enumOrderStatus.Undelivered]: '待发货',
  [enumOrderStatus.Unpaid]: '待付款'
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

import React from 'react'
import { Link } from 'react-router-dom'
import GoodCell from '@/components/good-cell'
import MoneyRender from '@/components/money-render'

/**
 * 返回订单、售后订单table columns
 * @param {0 | 1} type - 订单类型 0-订单，1-售后订单
 * @returns object[]
 */
export function getDetailColumns (type = 0) {
  return [
    {
      title: '名称',
      dataIndex: 'skuName',
      key: 'skuName',
      width: '20%',
      render (skuName: string, row: any) {
        return <GoodCell {...row} isRefund={type === 1} />
      }
    },
    {
      title: '商品ID',
      dataIndex: 'productId',
      key: 'productId',
      width: '8%',
      render (id: any, record: any) {
        console.log('record => ', record)
        return <Link to={`/fresh/goods/sku-sale/${id}`}>{id}</Link>
      }
    },
    {
      title: '属性',
      dataIndex: 'properties',
      key: 'properties'
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
      key: 'quantity'
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
  ]
}

/** 供应商分类(0-喜团,1-1688,2-淘宝联盟,3-一般海外供应商,4-保税仓海外供应商,5-喜团买菜供应商) */
export const storeType = ['喜团', '1688', '淘宝联盟', '一般海外供应商', '保税仓海外供应商', '喜团买菜供应商']
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
}

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
}

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
  [enumRefundStatus.Rejected]: '审核被驳回'
}

export const TextMapRefundType = {
  [enumRefundType.Both]: '退款退货',
  [enumRefundType.Refund]: '退款',
  [enumRefundType.Exchange]: '换货'
}

export enum enumOrderStatus {
  // 代付款
  Unpaid = 10,
  // 待发货
  Undelivered = 20,
  // 已发货
  Delivered = 30,
  // 已提货
  Complete = 50,
  // 关闭
  Closed = 60
}

export const OrderStatusTextMap = {
  10: '待付款',
  20: '待发货',
  30: '待提货',
  50: '已提货',
  60: '关闭'
}

export const TabList = [
  {
    name: '所有订单',
    url: '/fresh/order/mainOrder',
    status: undefined
  },
  {
    name: OrderStatusTextMap[enumOrderStatus.Unpaid],
    url: '/fresh/order/unpaidOrder',
    status: enumOrderStatus.Unpaid
  },
  {
    name: OrderStatusTextMap[enumOrderStatus.Undelivered],
    url: '/fresh/order/undeliveredOrder',
    status: enumOrderStatus.Undelivered
  },
  {
    name: OrderStatusTextMap[enumOrderStatus.Delivered],
    url: '/fresh/order/deliveredOrder',
    status: enumOrderStatus.Delivered
  },
  {
    name: OrderStatusTextMap[enumOrderStatus.Complete],
    url: '/fresh/order/completeOrder',
    status: enumOrderStatus.Complete
  },
  {
    name: OrderStatusTextMap[enumOrderStatus.Closed],
    url: '/fresh/order/closedOrder',
    status: enumOrderStatus.Closed
  }
]

//0非会员 10-团长，20-区长，30-合伙人，40-管理员，50-公司
export const enumMemberType = {
  Visitor: 0,
  Chief: 10,
  Warden: 20,
  Partner: 30,
  Manager: 40,
  Company: 50
}

export const MemberTypeTextMap = {
  [enumMemberType.Visitor]: '非会员',
  [enumMemberType.Chief]: '团长',
  [enumMemberType.Warden]: '区长',
  [enumMemberType.Partner]: '合伙人',
  [enumMemberType.Manager]: '管理员',
  [enumMemberType.Company]: '公司'
}

export enum storeTypes {
  喜团小店 = 1,
  喜团工厂店 = 2,
  生鲜店 = 3
}
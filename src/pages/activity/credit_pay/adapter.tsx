import React from 'react'
import { formatDate, formatMoneyWithSign } from '@/pages/helper'
/** 花呗分期明细 */
interface CostDetailProps {
  id: number
  title: React.ReactNode,
  /** 普通用户 */
  generalUser: React.ReactNode,
  /** 团长 */
  head: React.ReactNode,
  /** 区长 */
  areaMember: React.ReactNode,
  /** 城市合伙人 */
  cityMember: React.ReactNode,
  /** 管理员 */
  managerMember: React.ReactNode
}
export const handleCostDetailData = (data: {
  price: {
    areaMemberPrice: number
    headPrice: number
    managerMemberPrice: number
    memberPrice: number
    salePrice: number
    cityMemberPrice: number
  },
  costList: {[key: string]: {
    handlingFee: number
    payMoney: number
    paymentMoney: number
    sellerPercent: number
    totalHandlingFee: number
  }}[]
}): CostDetailProps[] => {
  const { costList, price } = data
  const first: CostDetailProps[] = [
    {
      id: 0,
      title: '商品售价',
      /** 普通用户 */
      generalUser: formatMoneyWithSign(price.salePrice),
      /** 团长 */
      head: formatMoneyWithSign(price.headPrice),
      /** 区长 */
      areaMember: formatMoneyWithSign(price.areaMemberPrice),
      /** 城市合伙人 */
      cityMember: formatMoneyWithSign(price.cityMemberPrice),
      /** 管理员 */
      managerMember: formatMoneyWithSign(price.managerMemberPrice)
    }
  ]
  const mapper = ['三期分期', '六期分期', '十二期分期']
  function getNode (data: {
    handlingFee: number
    payMoney: number
    paymentMoney: number
    sellerPercent: number
    totalHandlingFee: number
  }): React.ReactNode {
    return (
      <div>
        <div>每期支付{formatMoneyWithSign(data.paymentMoney)}</div>
        <div>每期手续费{formatMoneyWithSign(data.handlingFee)}</div>
        <div>{data.sellerPercent === 100 ? (<span style={{color: 'red'}}>(喜团补贴)</span>) : ''}</div>
      </div>
    )
  }
  const second: CostDetailProps[] = costList.map((item, index) => {
    return {
      id: index + 1,
      title: mapper[index],
      /** 普通用户 */
      generalUser: getNode(item.generalUser),
      /** 团长 */
      head: getNode(item.head),
      /** 区长 */
      areaMember:  getNode(item.areaMember),
      /** 城市合伙人 */
      cityMember: getNode(item.cityMember),
      /** 管理员 */
      managerMember: getNode(item.managerMember),
    }
  })
  return first.concat(second)
}

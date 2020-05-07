/*
 * @Date: 2020-04-29 10:32:59
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-30 17:05:19
 * @FilePath: /supplier/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/merchant-accounts/checking/interface.d.ts
 */
export interface RecordProps {
  /** 日期 */
  billDate: number
  /** 账单金额 */
  billMoney: number
  /** 状态值 */
  billStatus: number
  /** 状态描述 */
  billStatusInfo: string
  /** 支出 */
  disburseMoney: string
  id: number
  /** 收入 */
  incomeMoney: number
  /** 序列号，用于展示 */
  serialNo: string
  supplierId: number
  /** 供应商名称 */
  supplierName: string
}

/** 对账单明细商品属性 */
export interface ShopProps {
  /** 商品id */
  productId: any
  /** 商品名称 */
  productName: string
  /** 商品数量 */
  quantity: number
  /** 对账类型值，10：货款收入，20：售后支出 */
  recordType: 10 | 20
  /** 对账类型描述 */
  recordTypeInfo: string
  skuId: any
  /** 商品规格 */
  skuName: string
  /** 交易金额 */
  tradeMoney: number
  /** 交易状态描述描述，目前都为已完成 */
  tradeStatusInfo: string
  /** 商品单价 */
  unitPrice: number
}
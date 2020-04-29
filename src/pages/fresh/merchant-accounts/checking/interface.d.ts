/*
 * @Date: 2020-04-29 10:32:59
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-29 20:00:31
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/merchant-accounts/checking/interface.d.ts
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
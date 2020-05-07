/*
 * @Date: 2020-04-28 15:45:25
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-28 15:55:58
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/merchant-accounts/withdraw/interface.d.ts
 */
export interface RecordProps {
  /** 提现单ID */
  supplierCashOutId: any
  /** 提现金额，单位分 */
  cashOutMoney: number
  /** 提现状态（5-提现中，15-提现成功，25-提现失败） */
  status: 5 | 15 | 25
  /** 提现时间 */
  createTime: number
  /** 操作备注 */
  operateRemark: string
  storeId: number
  /** 供应商名称 */
  storeName: string
  /** 提现方式 */
  payType: number
  /** 账户名 */
  accountName: string
  /** 卡号 */
  accountNo: string
  /** 银行名称 */
  bankName: string
  /** 银行支行名称 */
  bankBranchName: string
  /** 操作人名称 */
  operator: string
  /** 操作时间 */
  operateTime: number
  /** 时间戳 */
  time: number
}
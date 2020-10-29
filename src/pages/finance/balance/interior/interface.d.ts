/** 资金总计 */
export interface BalanceProfile {
  /** 可提现余额 */
  cashableAmount: number
  /** 待结算金额 */
  unsettledAmount: number
  /** 冻结金额 */
  frozenAmount: number
  /** 已提现总额 */
  presentedAmount: number
  /** 累计金额 */
  totalAmount: number
}

export interface SupplierBalanceProfile {
  supplierId: any
  supplierName: string
  /** 供应商类型 */
  supplierTypeDesc: string
  /** 可提现余额 */
  cashableAmount: number
  /** 待结算金额 */
  unsettledAmount: number
  /** 冻结金额 */
  frozenAmount: number
  /** 已提现总额 */
  presentedAmount: number
  /** 累计金额 */
  totalAmount: number
}
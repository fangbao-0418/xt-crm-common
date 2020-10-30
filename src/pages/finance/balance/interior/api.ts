const { post, get, newPost, newPut, del } = APP.http
import { BalanceProfile } from './interface'

// 查询供应商资金余额
export const supplierBalance = (payload: {
  subjectId?: any
  subjectType?: any
  /** 供应商名称名称 */
  subjectName?: string
}) => {
  return newPost('/mcweb/account/supplier/financial/account/yx/list/v1', payload)
}

// 资金汇总
export const fetchBalanceProfile = () => {
  return get<BalanceProfile>('/mcweb/account/supplier/financial/account/yx/summary/v1')
}

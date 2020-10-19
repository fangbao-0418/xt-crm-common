const { post, get, newPost, newPut, del } = APP.http
import { BalanceProfile } from './interface'
// 查询供应商
export const supplierBalance = (payload: any) => {
  return get('/mcweb/account/balance/supplierBalance', payload)
}

// 资金汇总
export const fetchBalanceProfile = () => {
  return get<BalanceProfile>('/mcweb/account/supplier/financial/account/yx/summary/v1')
}

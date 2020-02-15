const { get, newPost } = APP.http
import { GetDetailsListOnPageRequest, GetIcExDetailsListOnPageRequest } from './interface'
/** 对账单分页查询列表 */
export const fetchList = (payload: GetDetailsListOnPageRequest) => {
  return get('/finance/accountRecord/getListOnPage', payload)
}

/** 对账单明细列表 */
export const fetchDetailList = (payload: GetIcExDetailsListOnPageRequest) => {
  return get(`/finance/accountRecord/getDetailsListOnPage`, payload)
}


// /** 新建调整单 */
// export const addAdjustment = (payload: any) => {
//   return http('/financeTrimRecord/build', 'POST', payload)
// }

// /** 撤销 */
// export const toRevoke = (id: number) => {
//   return http(`/financeTrimRecord/revoke?id=${id}`, 'POST')
// }
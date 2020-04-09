const { get, newPost } = APP.http
import {
  GetDetailsListOnPageRequest,
  GetIcExDetailsListOnPageRequest,
  AddSettlementRequest
} from './interface'
/** 对账单分页查询列表 */
export const fetchList = (payload: GetDetailsListOnPageRequest) => {
  return get('/finance/accountRecord/getListOnPage', payload)
}

/** 对账单明细列表 */
export const fetchDetailList = (payload: GetIcExDetailsListOnPageRequest) => {
  return get(`/finance/accountRecord/getDetailsListOnPage`, payload)
}

/** 获取收款账户列表 */
export const fetchGatheringAccountList = (id: number) => {
  return get(`/finance/settlement/account/list?accid=${id}`)
}

/** 单条导出 */
export const exportAccount = (accId: number) => {
  return newPost(`/finance/accountRecord/exportAccountData`, {accId})
}

/** 批量导出 */
export const batchExport = (api: string, params: object) => {
  return newPost(api, params)
}


/** 新建结算单 */
export const addSettlement = (payload: AddSettlementRequest) => {
  return newPost('/finance/settlement/generate', payload)
}
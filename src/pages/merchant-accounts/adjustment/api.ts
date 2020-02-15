const { get, newPost } = APP.http
import { ListRequest, BuildRequest, ExamineRequest } from './interface'
/** 获取对账单列表 */
export const fetchCheckingList = (payload: any) => {
  return Promise.resolve({
    records: []
  })
}

/** 获取对账单列表 */
export const fetchList = (payload: ListRequest) => {
  return newPost('/finance/trimRecord/list', payload)
}

/** 调整单详情 */
export const fetchInfo = (id: number) => {
  return get(`/finance/trimRecord/info?id=${id}`)
}

/** 调整单审核 */
export const toAudit = (payload: ExamineRequest) => {
  return newPost(`/finance/trimRecord/examine`, payload)
}

/** 导出 */
export const toExport = (ids?: number[]) => {
  if (ids) {
    return newPost('/finance/trimRecord/exportTrim')
  } else {
    return newPost('/finance/trimRecord/exportTrimByTrimIds', ids)
  }
}

/** 新建调整单 */
export const addAdjustment = (payload: BuildRequest) => {
  return newPost('/crm/financeTrimRecord/build', payload)
}

/** 撤销 */
export const toRevoke = (id: number) => {
  return newPost(`/crm/financeTrimRecord/revoke?id=${id}`)
}
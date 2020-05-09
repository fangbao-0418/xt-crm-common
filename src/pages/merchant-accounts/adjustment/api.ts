const { get, newPost } = APP.http
import { ListRequest, BuildRequest, ExamineRequest } from './interface'

/** 获取对账单列表 */
export const fetchList = (payload: ListRequest) => {
  return newPost('/finance/trimRecord/list', payload)
}

/** 调整单详情 */
export const fetchInfo = (id: number) => {
  return get(`/finance/trimRecord/info?id=${id}`)
}

/** 调整单审核 */
export const toAudit = (payload: ExamineRequest, type: 'purchase' | 'finance') => {
  let url = '/finance/trimRecord/purchase/examine'
  if (type === 'finance') {
    url = '/finance/trimRecord/finance/examine'
  }
  return newPost(url, payload)
}

/** 根据ID导出 */
export const toExport = (ids: number[]) => {
  return newPost('/finance/trimRecord/exportTrimByTrimIds', ids)
}

/** 根据条件全部导出 */
export const toSearchExport = (payload: Partial<ListRequest>) => {
  return newPost('/finance/trimRecord/exportTrim', payload)
}

/** 新建调整单 */
export const addAdjustment = (payload: Partial<BuildRequest>) => {
  return newPost('/finance/trimRecord/build', payload)
}

/** 撤销 */
export const toRevoke = (id: number) => {
  return get(`/finance/trimRecord/purchaseRevoke?id=${id}`)
}

/** 校验对账单 */
export const validateAccNo = (id: number) => {
  return get(`/finance/accountRecord/getSimplifyInfo?accNo=${id}`)
}
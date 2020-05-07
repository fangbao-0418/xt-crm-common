/*
 * @Date: 2020-04-29 15:23:54
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-03 20:40:40
 * @FilePath: /xt-crm/src/pages/fresh/merchant-accounts/adjustment/api.ts
 */
const { get, newPost, post } = APP.http
import { ListRequest, BuildRequest, ExamineRequest } from './interface'

/** 供应商列表 */
export const fetchStoreList = (id: any) => {
  return post('/store/list', {
    id,
    page: 1,
    pageSize: 1,
    category: 5
  }).then((res) => {
    if (res.records && res.records.length > 0) {
      return res.records[0]
    }
    return Promise.reject()
  })
}

const handlePayload = (payload: Partial<ListRequest>) => {
  const supplier = (payload as any).supplier || {}
  console.log(supplier, 'supplier')
  payload = {
    ...payload,
    supplierId: !payload.supplierId ? supplier.key : payload.supplierId,
    supplier: undefined
  } as ListRequest
  return payload
}

/** 获取调整单列表 */
export const fetchList = (payload: Partial<ListRequest>) => {
  return newPost('::guard/mcweb/merchant/adjustment/record/list', handlePayload(payload))
}

/** 根据条件全部导出 */
export const toSearchExport = (payload: Partial<ListRequest>) => {
  return newPost('::guard/mcweb/merchant/adjustment/record/export', handlePayload(payload))
}

/** 调整单详情 */
export const fetchInfo = (id: number) => {
  return get(`::guard/mcweb/merchant/adjustment/record/info?serialNo=${id}`)
}

/**
 * 调整单审核
 * @param {(0|1)} type - 审核类型 0-初审 1-复审
 * */
export const toAudit = (payload: ExamineRequest, type: 0 | 1) => {
  const url = '::guard/mcweb/merchant/adjustment/record/examine'
  return newPost(url, {
    ...payload,
    type
  })
}

/** 新建调整单 */
export const addAdjustment = (payload: Partial<BuildRequest>) => {
  return newPost('::guard/mcweb/merchant/adjustment/record/save', payload)
}

/** 撤销 */
export const toRevoke = (id: number) => {
  return get(`::guard/mcweb/merchant/adjustment/record/cancel?serialNo=${id}`)
}

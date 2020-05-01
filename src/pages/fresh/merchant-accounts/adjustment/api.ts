/*
 * @Date: 2020-04-29 15:23:54
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-01 17:31:52
 * @FilePath: /supplier/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/merchant-accounts/adjustment/api.ts
 */
const { get, newPost, post } = APP.http
import { ListRequest, BuildRequest, ExamineRequest } from './interface'
/** 获取对账单列表 */
export const fetchCheckingList = (payload: any) => {
  return Promise.resolve({
    records: []
  })
}

export const fetchStoreList = (id: any) => {
  return post('/store/list', {
    id,
    page: 1,
    pageSize: 1
  }).then((res) => {
    if (res.records && res.records.length > 0) {
      return res.records[0]
    }
    return Promise.reject()
  })
}

/** 获取调整单列表 */
export const fetchList = (payload: ListRequest) => {
  console.log(payload, 'fetchList')
  return Promise.resolve({
    total: 0,
    result: [
      { id: 222 }
    ]
  })
  // return newPost('/adjustment/record/list', payload)
}

/** 调整单详情 */
export const fetchInfo = (id: number) => {
  return get(`/adjustment/record/info?id=${id}`)
  // return get(`/finance/trimRecord/info?id=${id}`)
}

/**
 * 调整单审核
 * @param {(0|1)} type - 审核类型 0-初审 1-复审
 * */
export const toAudit = (payload: ExamineRequest, type: 0 | 1) => {
  const url = '/adjustment/record/examine'
  return newPost(url, {
    ...payload,
    type
  })
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
  return get(`/adjustment/record/cancel?adjustmentRecordSerialNo=${id}`)
  // return get(`/finance/trimRecord/purchaseRevoke?id=${id}`)
}

/** 校验对账单 */
export const validateAccNo = (id: number) => {
  return get(`/finance/accountRecord/getSimplifyInfo?accNo=${id}`)
}
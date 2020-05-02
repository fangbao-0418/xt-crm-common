/*
 * @Date: 2020-04-29 15:23:54
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-02 16:44:51
 * @FilePath: /supplier/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/merchant-accounts/adjustment/api.ts
 */
const { get, newPost, post } = APP.http
import { ListRequest, BuildRequest, ExamineRequest } from './interface'

/** 供应商列表 */
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
  return newPost('/mcweb/merchant/adjustment/record/list', payload)
}

/** 调整单详情 */
export const fetchInfo = (id: number) => {
  return get(`/mcweb/merchant/adjustment/record/info?serialNo=${id}`)
}

/**
 * 调整单审核
 * @param {(0|1)} type - 审核类型 0-初审 1-复审
 * */
export const toAudit = (payload: ExamineRequest, type: 0 | 1) => {
  const url = '/mcweb/merchant/adjustment/record/examine'
  return newPost(url, {
    ...payload,
    type
  })
}

/** 根据条件全部导出 */
export const toSearchExport = (payload: Partial<ListRequest>) => {
  return newPost('/mcweb/merchant/adjustment/record/export', payload)
}

/** 新建调整单 */
export const addAdjustment = (payload: Partial<BuildRequest>) => {
  return newPost('/mcweb/merchant/adjustment/record/save', payload)
}

/** 撤销 */
export const toRevoke = (id: number) => {
  return get(`/mcweb/merchant/adjustment/record/cancel?serialNo=${id}`)
}

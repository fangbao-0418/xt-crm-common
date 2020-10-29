/*
 * @Date: 2020-04-28 14:00:21
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-28 14:02:10
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/template/list-page/api.ts
 */
const { newPost, get } = APP.http
export const fetchList = (data: {
  startTime: number
  endTime: number
  productId: number
  /** 举报类型 1 广告内容 2 不友善内容 3 造谣传谣 4 违法违规 5 色情低俗 6 其他 */
  type: 1 | 2 | 3 | 4 | 5 | 6
  /** 1. 待审核 2. 举报成功 3 举报失败 */
  status: 1 | 2 | 3
  page: number
  pageSize: number
}) => {
  return newPost('/mcweb/product/material/reply/report/list', data)
}

/** 获取举报详情 */
export const fetchDetail = (id: number) => {
  return get('/mcweb/product/material/reply/report/detail', { id })
}

/** 审核举报信息 */
export const auditReport = (data: {
  id: number
  /** 1. 举报成功 2 举报无效 */
  status: number
  /** 举报反馈 */
  feedbackWord: string
}) => {
  return newPost('/mcweb/product/material/reply/report/approve', data)
}

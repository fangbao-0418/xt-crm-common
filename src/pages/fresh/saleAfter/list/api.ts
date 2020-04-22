const { get, newPost } = APP.http
import { exportFile } from '../../../../util/fetch'

/**
 *  获取列表接口
 * @param payload
 */
export const fetcOrderList = (payload?: any) => {
  // 幽灵bug，偶先丢失pageSize
  payload.pageSize = payload.pageSize || 10
  return newPost('/order/fresh/saleAfter/list', payload)
}

/**
 * 售后单导出
 * @param payload
 */
export const exportOrderList = (payload?: any) => {
  // 幽灵bug，偶先丢失pageSize
  payload.pageSize = payload.pageSize || 10
  return exportFile('/order/fresh/saleAfter/export', payload)
}

/** 自提点模糊搜索 */
export const searchPoints = (keyWords: string) => {
  return get(`/point/list?name=${keyWords}`).then((res) => {
    return res.result.map((v: { name: string, id: string }) => ({ text: v.name, value: v.id }))
  })
}

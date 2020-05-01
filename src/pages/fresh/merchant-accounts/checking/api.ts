/*
 * @Date: 2020-04-28 14:00:21
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-01 20:00:37
 * @FilePath: /supplier/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/merchant-accounts/checking/api.ts
 */
const { get, newPost } = APP.http
export const fetchList = (payload: any) => {
  return Promise.resolve({
    total: 0,
    records: []
  })
  return get('/fresh/account/statement/list', payload)
}
export const fetchDetail = (id: any) => {
  return Promise.resolve({
    total: 0,
    records: [
      {
        supplierCashOutId: '2222'
      }
    ]
  })
  return get(`/fresh/account/statement/${id}`)
}

export const batchExport = (payload: {
  page?: number
  pageSize?: number
  serialNo?: string
  supplierId?: number
  supplierName?: string
  productId?: number
  year?: number
  month?: number
}) => {
  return get('/fresh/account/statement/export', payload)
}

export const batchExportDetail = (payload: {
  page?: number
  pageSize?: number
  serialNo?: string
  supplierId?: number
  supplierName?: string
  productId?: number
  year?: number
  month?: number
}) => {
  return get('/fresh/account/statement/export/detail', payload)
}
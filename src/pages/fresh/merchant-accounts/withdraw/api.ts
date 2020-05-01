/*
 * @Date: 2020-04-28 14:01:39
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-01 20:28:47
 * @FilePath: /supplier/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/merchant-accounts/withdraw/api.ts
 */
const { get, newPost } = APP.http

interface ListPayload {
  /** 提现单ID */
  supplierCashOutId: any
  storeNameLike: string
  storeId: number
  operator: string
  operateTimeStart: number
  operateTimeEnd: number
  payType: 3 | 4
  createTimeStart: number
  createTimeEnd: number
  pageNum: number
  pageSize: number
}

export const fetchList = (payload: Partial<ListPayload>) => {
  return get('/spm/supplier/cash/out/crm/page', payload)
}

export const batchExport = (payload: Partial<ListPayload>) => {
  return get('/spm/supplier/cash/out/crm/page/export', payload)
}

export const batchPay = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  newPost('/spm/supplier/cash/out/batch/fail', form, {
    headers: {
      ContentType: 'multipart/form-data'
    }
  })
}
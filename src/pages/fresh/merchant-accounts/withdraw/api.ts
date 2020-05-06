/*
 * @Date: 2020-04-28 14:01:39
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-05 14:55:29
 * @FilePath: /xt-crm/src/pages/fresh/merchant-accounts/withdraw/api.ts
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
  return get('::guard/mcweb/merchant/supplier/cash/out/page', payload)
}

export const batchExport = (payload: Partial<ListPayload>) => {
  return get('::guard/mcweb/merchant/supplier/cash/out/export', payload)
}

/** 批量支付 */
export const batchPay = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  return newPost('::guard/mcweb/merchant/supplier/cash/out/batch/success', form, {
    // hideToast: true,
    // timeout: 10,
    headers: {
      ContentType: 'multipart/form-data'
    }
  })
}

/** 批量支付失败 */
export const batchPayFail = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  return newPost('::guard/mcweb/merchant/supplier/cash/out/batch/fail', form, {
    // hideToast: true,
    // timeout: 10,
    headers: {
      ContentType: 'multipart/form-data'
    }
  })
}

export const toOperate = (payload: {
  supplierCashOutId: any
  /** 提现状态（15-提现成功，25-提现失败） */
  status: 15 | 25
  operateRemark: string
}) => {
  return newPost('::guard/mcweb/merchant/supplier/cash/out/operate', payload)
}
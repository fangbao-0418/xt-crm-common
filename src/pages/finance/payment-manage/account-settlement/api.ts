const { post, get, newPost, newPut, del } = APP.http
import { ListRecordProps, ConfirmDataProps } from './interface'

//账务对象校验
export const checkSubject = (payload: any) => {
  return get('/mcweb/account/financial/disposable/settlement/subject/check/v1', payload)
}
//一次性账务结算列表
export const getList = (payload: any) => {
  return newPost('/mcweb/account/financial/disposable/settlement/list/v1', payload)
}
/** 创建账务结算单 */
export const add = (payload: any) => {
  return newPost('/mcweb/account/financial/disposable/settlement/apply/v1', payload)
}
/** 账务结算单详情 */
export const getDetail = (id: any) => {
  return get('/mcweb/account/financial/disposable/settlement/detail/v1', { id })
}

/** 单条批次创建 */
export const createBatchSingle = (id: any) => {
  return get<ConfirmDataProps>('/mcweb/account/financial/disposable/out/xt/single/detail/v1', { id })
}

/** 单条批次创建 */
export const createBatch = (ids: any[]) => {
  return newPost<ConfirmDataProps>('/mcweb/account/financial/disposable/out/xt/batch/list/v1', { ids })
}

/** 审核账务结算单 */
export const audit = (payload: any) => {
  return newPost('/mcweb/account/financial/disposable/settlement/audit/v1', payload)
}

/** 提交支付确认 */
export const paymentConfirm = (data: {
  settlementIds: any[]
  batchId: string
  messageOrderNo: string
  smsCode: string
}) => {
  return newPost('/mcweb/account/financial/disposable/out/xt/bill/confirm/v1', data)
}

/** 获取支付短信验证码 */
export const fetchPaymentVerifyCode = (data: {
  settlementIds: any[]
  batchId: string
}) => {
  return newPost<{ messageOrderNo: string }>('/mcweb/account/financial/disposable/out/xt/sendSmsVerifyCode/v1', data)
}


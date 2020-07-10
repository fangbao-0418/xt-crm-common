/*
 * @Date: 2020-03-27 11:00:32
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-03 10:30:22
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/finance/withdraw/api.ts
 */
import { listResponse, RecordsResponse } from './adapter'
import { exportFile } from '@/util/fetch'
import { queryString } from '@/util/utils'
const { get, newPost } = APP.http

interface ListPayload {
  // 银行卡号
  bankCardNo: string,
  // 批次ID
  batchId: string,
  // 提现申请开始时间，格式yyyy-MM-dd
  createStartTime: string,
  // 提现申请结束时间，格式yyyy-MM-dd
  createEndTime: string,
  // 持卡人身份证号码
  idCarNo: string,
  // 申请人手机号
  memberMobile: string,
  // 提现类型，0=普通提现，1=拦截提现
  moneyAccountType: 1| 0,
  // 打款提交开始时间，格式yyyy-MM-dd
  remitStartTime: string,
  // 打款提交结束时间，格式yyyy-MM-dd
  remitEndTime: string,
  // 提现单号
  transferNo: string,
  // 提现状态， -2=提现取消 -1=提现失败 0=待提现 1=提现成功 2=提现中
  transferStatus: -2 | -1 | 0 | 1 | 2,
  // 当前页码
  pageNum: number,
  // 每页记录数
  pageSize: number
}

interface RecordsPaylod {}
// 提现申请列表，分页
export function getRemittanceList (payload: ListPayload) {
  return newPost('/crm/member/fund/remittance/v1/list', payload).then(listResponse)
}

// 批次记录，分页
export function getBatchList (payload: RecordsPaylod) {
  return newPost('/crm/member/fund/remittance/v1/batch/list', payload).then(RecordsResponse)
}

// 提现申请详情
export function getRemittanceDetail (id: string) {
  return get(`/crm/member/fund/remittance/v1/detail?id=${id}`)
}

// 单笔提交打款申请
export function submitRemittance (id: string) {
  return newPost('/crm/member/fund/remittance/v1/submit', { id })
}

// 导出
export function exportList (payload: ListPayload) {
  return exportFile('/crm/member/fund/remittance/v1/export', payload)
}

// 取消提现
export function cancelRemittance (payload: { id: string, remark: string }) {
  return newPost('/crm/member/fund/remittance/v1/cancel', payload)
}

// 提现操作日志
export function getRemittanceLog (id: string) {
  return get(`/crm/member/fund/remittance/v1/log?id=${id}`)
}

// 批量打款申请
export function batchSubmit (payload: {
  startTime: string,
  endTime: string,
  batchId: string
}) {
  return newPost('/crm/member/fund/remittance/v1/batchSubmit', payload)
}

// 批量打款统计信息
export function getRemittanceInfo (payload: { startTime: string, endTime: string }) {
  const search = queryString(payload)
  return get(`/crm/member/fund/remittance/v1/info${search}`)
}

/** 提交打款 */
export function submitPay (id: any) {
  return newPost('/crm/member/fund/remittance/v1/remit', { id })
}

/** 申请凭证 */
export function applyVoucher (id: any) {
  return newPost('/crm/member/fund/remittance/v1/receiptApply', { id })
}

/** 提现汇总信息 */
export function getSummary () {
  return get('/crm/member/fund/remittance/v1/summary')
}

/** 获取提现请求详情 */
export function batchDetail (id: any) {
  return get('/crm/member/fund/remittance/v1/batch/detail', { id })
}
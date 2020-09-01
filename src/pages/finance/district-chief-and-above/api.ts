import { number, string } from "prop-types"

const { get, newPost } = APP.http

/**
 * 区长及以上会员提现管理提现列表
 * @param payload
 */
export function getWithdrawalList (payload: {
  withdrawalStartDate: string,
  withdrawalEndDate: string,
  withdrawalCode: string,
  transferStatus: number,
  memberId: number,
  memberPhone: string,
  page: number,
  pageSize: number
}) {
  return newPost('/mcweb/account/member/withdrawal/list/v1', payload)
}

/**
 * 单条确认提现
 * @param id
 */
export function createBatchWithdrawal (id: number) {
  return newPost('/mcweb/account/member/withdrawal/batch/create/v1', { id })
}

/**
 * 提现列表导出
 * @param payload
 */
export function exportWithdrawal (payload: {
  withdrawalStartDate: string,
  withdrawalEndDate: string,
  withdrawalCode: string,
  transferStatus: -1 | 0 | 1,
  memberId: number,
  memberPhone: string,
  page: number,
  pageSize: number
}) {
  return newPost('/mcweb/account/member/withdrawal/export/v1', payload)
}

/**
 * 批量确认提现
 * @param payload
 */
export function createAllWithdrawal (payload: {
  withdrawalStartDate: string,
  withdrawalEndDate: string,
  withdrawalCode: string,
  transferStatus: -1 | 0 | 1,
  memberId: number,
  memberPhone: string,
  page: number,
  pageSize: number
}) {
  return newPost('/mcweb/account/member/withdrawal/createAll/v1', payload)
}

/**
 * 发送确认提现短信验证码
 */
export function sendSmsVerifyCode (batchId: number) {
  return get(`/mcweb/account/member/withdrawal/batch/sendSmsVerifyCode/v1?batchId=${batchId}`)
}

/**
 * 校验确认提现短信验证码
 */
export function checkSmsVerifyCode(payload: {
  batchId: number,
  messageOrderNo: string,
  smsCode: string
}) {
  return newPost('/mcweb/account/member/withdrawal/batch/checkSmsVerifyCode/v1', payload)
}
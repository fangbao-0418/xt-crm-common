import { listResponse, RecordsResponse } from './adapter';
const { newPost } = APP.http;

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
export function getRemittanceList(payload: ListPayload) {
  return newPost('/crm/member/fund/remittance/v1/list', payload).then(listResponse);
}

// 批次记录，分页
export function getBatchList(payload: RecordsPaylod) {
  return newPost('/crm/member/fund/remittance/v1/batch/list', payload).then(RecordsResponse)
}
/*
 * @Date: 2020-04-16 13:58:08
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-02 20:20:20
 * @FilePath: /supplier/Users/fangbao/Documents/xituan/xt-crm/src/pages/merchant-accounts/api.js
 */
import { post, get, newPost } from '../../util/fetch';

// export function getPromotionList(data) {
//   return post('/promotion/list', data);
// }

// export function setBasePromotion(data) {
//   return post('/promotion/addBasePromotion', {}, { data, headers: {} });
// }
/******************************付款单**************************/
// 付款单确认支付
export function paymentConfirm({ id, ...data }) {
  return newPost(`/finance/payment/confirm/${id}`, data);
}

// 付款单详情
export function getPaymentDetail(id) {
  return get(`/finance/payment/detail/${id}`);
}

// 付款单列表
export function getPaymentList(data) {
  return get('/finance/payment/list', data);
}

/** 付款单支付失败 批量 */
export const paymentBatchFail = (data) => {
  return newPost(`/finance/payment/batch/fail`, data)
}

/** 付款单支付失败 单个 */
export const paymentFail = ({ id, ...data }) => {
  return newPost(`/finance/payment/fail/${id}`, data)
}

/** 付款单上传凭证 */
export const paymentUpload = ({ id, ...data }) => {
  return newPost(`/finance/payment/upload/${id}`, data)
}

/******************************结算单**************************/

// 结算单详情
export function getSettlementDetail(id) {
  return get(`/finance/settlement/detail/${id}`);
}

// 结算单导出 -> 这期不做
export function getSettlementExport(id) {
  return get(`/finance/settlement/export/${id}`);
}

// 结算单创建
export function createSettlement(data) {
  return post(`/finance/settlement/generate`, data);
}

// 结算单列表
export function getSettlementList(data) {
  return get(`/finance/settlement/list`, data);
}

// 结算单付款
export function settlementPay(id) {
  return get(`/finance/settlement/pay/${id}`);
}

// 结算单驳回--包括待结算的结算单和结算中的结算单
export function settlementReject({ id, remark = '' }) {
  return post(`/finance/settlement/reject/${id}`, { remark });
}

// 待结算的结算单提交结算
export function settlementSubmit ({ id, ...data }) {
  return newPost(`/finance/settlement/submit/${id}`, { ...data });
}

/** 批量导出 */
export const batchExport = (api, params) => {
  return newPost(api, params)
}

/** 批量导出 */
export const paymentBatchExport = (api, params) => {
  return newPost(api, params)
}
/** 获取收款账户列表 */
export const fetchGatheringAccountList = () => {
  // return get(`/finance/settlement/account/list?accid=${id}`)
  return get(`/finance/payment/account/list`)
}

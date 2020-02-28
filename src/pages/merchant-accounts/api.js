import { post, get, newPost } from '../../util/fetch';

// export function getPromotionList(data) {
//   return post('/promotion/list', data);
// }

// export function setBasePromotion(data) {
//   return post('/promotion/addBasePromotion', {}, { data, headers: {} });
// }
/******************************付款单**************************/
// 付款单确认支付
export function paymentConfirm({id, paymentImg}) {
  return post(`/finance/payment/confirm/${id}`,{paymentImg});
}

// 付款单详情
export function getPaymentDetail(id) {
  return get(`/finance/payment/detail/${id}`);
}

// 付款单列表
export function getPaymentList(data) {
  return get('/finance/payment/list', data);
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
  return post(`/finance/settlement/generate`,data);
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
export function settlementReject({id,remark=''}) {
  return post(`/finance/settlement/reject/${id}`, {remark});
}
// 待结算的结算单提交结算
export function settlementSubmit({id,payMod=''}) {
  return post(`/finance/settlement/submit/${id}`, {payMod});
}
/** 测试接口 */
export const fetchCheckingList = payload => {
  return get('::ulive/live/plan/list', payload)
}
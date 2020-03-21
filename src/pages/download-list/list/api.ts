const { get } = APP.http

/** 订单收益结算快照 */
export function getEarningsDetail () {
  return get('/finance/accountRecord//queryExportAccountData')
}
const { get } = APP.http

/** 请求下载接口 */
export function getEarningsDetail (pageNum: number) {
  return get(`/finance/accountRecord/queryExportAccountData?pageNum=${pageNum}`)
}
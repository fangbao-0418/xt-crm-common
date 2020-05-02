const { get, newPost } = APP.http

/** 请求下载接口 */
export function getEarningsDetail (payload: any) {
  return newPost('::guard/exporter/task/list/v1', { ...payload })
}
/* eslint-disable no-duplicate-imports */
/* eslint-disable no-empty-pattern */
export function replaceHttpUrl (imgUrl?: string) {
  return APP.fn.deleteOssDomainUrl(imgUrl || '')
}

// 过滤表单请求
export function formRequest (payload: any) {
  return payload
}

// 过滤详情响应
export function formResponse (res: any) {
  return res
}

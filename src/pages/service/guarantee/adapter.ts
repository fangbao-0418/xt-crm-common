import { initImgList } from '@/util/utils'

// 数组转换到字符串
function array2String(list: any[]) {
  return (list || []).map((item: any) => APP.fn.deleteOssDomainUrl(item.url || '')).join(',')
}
// 字符串转数组
function string2Array(value: string) {
  return (value || '').split(',').reduce((prev: any[], curr) => prev.concat(initImgList(curr)), [])
}

// 适配保障信息入参
export function adapterGuaranteeReq (payload: any) {
  const imageUrl =  array2String(payload.imageUrl)
  return { ...payload, imageUrl }
}

// 适配保障信息响应
export function adapterGuaranteeRes (res: any) {
  const imageUrl = string2Array(res.imageUrl)
  return { ...res, imageUrl }
}
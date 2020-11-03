// 数组转换到字符串
function array2String(list: any[]) {
  return (list || []).map((item: any) => APP.fn.deleteOssDomainUrl(item.url || '')).join(',');
}

// 适配保障信息
export function adapterGuaranteeInfo (req: any) {
  req.imageUrl =  array2String(req.imageUrl)
  return req
}
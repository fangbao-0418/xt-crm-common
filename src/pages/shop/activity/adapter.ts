export function requestPromotion(params: any) {
  params.shopIds = (params.dataSource || []).map((item: any) => item.shopId + '')
  delete params.dataSource
  return params
}
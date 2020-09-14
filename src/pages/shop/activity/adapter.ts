export function requestPromotion(params: any) {
  params.shopIds = (params.dataSource || []).map((item: any) => item.id + '')
  delete params.dataSource
  return params
}
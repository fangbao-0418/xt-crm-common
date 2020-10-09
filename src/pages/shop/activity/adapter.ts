import { initImgList } from '@/util/utils'

// 新增编辑表单
export function requestPromotion(params: any) {
  params.shopIds = (params.dataSource || []).map((item: any) => item.shopId + '')
  delete params.dataSource
  return params
}

// 查询表单详情
export function responseDetail(res: any) {
  res.dataSource = [{
    shopId: res.shopId,
    shopName: res.shopName
  }]
  return res;
}
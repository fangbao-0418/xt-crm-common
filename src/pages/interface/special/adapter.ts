import { removeURLDomain, initImgList } from '@/util/utils'

/** 过滤专题详情响应 */
export function specDetailResponse (res: any) {
  res = res || {}
  res.shareOpen = res.shareOpen === 1
  res.shareImgUrl = initImgList(res.shareImgUrl)
  res.imgUrl = initImgList(res.imgUrl)
  res.css = res.couponStyle
  if (!Array.isArray(res.categorys)) res.categorys = []
  return res
}

function filterParams(column: Special.DetailContentProps, list: any) {
  const items = (list || []).map((v: any) => ({
    id: v.id,
    sort: v.sort
  }))
  return { 
    ...column,
    items
  }
}
/** 新增详情转换成入参 */
export function saveSpecialParams(detail: any) {
  const result: any = {}
  result.jumpUrl = (detail.jumpUrl || '').trim()
  result.shareOpen = detail.shareOpen ? 1 : 0
  result.couponStyle = detail.css
  if (detail.imgUrl instanceof Array) {
    result.imgUrl = removeURLDomain(detail.imgUrl[0] && detail.imgUrl[0].url)
  }
  if (detail.shareImgUrl instanceof Array) {
    result.shareImgUrl = removeURLDomain(detail.shareImgUrl[0] && detail.shareImgUrl[0].url)
  }
  return {
    ...detail,
    ...result
  }
}
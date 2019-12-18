import { replaceHttpUrl, initImgList } from '@/util/utils'

/** 过滤专题详情响应 */
export function specDetailResponse (res: any) {
  res.shareOpen = res.shareOpen === 1
  res.shareImgUrl = initImgList(res.shareImgUrl)
  res.imgUrl = initImgList(res.imgUrl)
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
export function saveSpecialParams(detail: Special.DetailProps) {
  const result: any = {}
  result.jumpUrl = (detail.jumpUrl || '').trim()
  result.shareOpen = detail.shareOpen ? 1 : 0
  if (detail.imgUrl instanceof Array) {
    result.imgUrl = detail.imgUrl[0] && detail.imgUrl[0].url
  }
  if (detail.shareImgUrl instanceof Array) {
    result.shareImgUrl = detail.shareImgUrl[0] && detail.shareImgUrl[0].url
  }
  const list = (detail.list || []).map((column: Special.DetailContentProps) => {
    switch (column.type) {
      case 1:
        return filterParams(column, column.list);
      case 2:
        return filterParams(column, column.coupons);
      case 3:
        return {
          type: column.type,
          sort: column.sort,
          advertisementUrl: replaceHttpUrl((column.advertisementUrl || '').trim()),
          advertisementJumpUrl: (column.advertisementJumpUrl || '').trim()
        };
      default:
        return {};
    }
  })
  return {
    ...detail,
    ...result,
    list
  }
}
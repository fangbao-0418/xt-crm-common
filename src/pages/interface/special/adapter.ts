import { replaceHttpUrl } from '@/util/utils'

/** 转换详情数据 */
export function conversionDetails (res: any) {
  let result: any = {}
  result.list = res && res.list || []
  return {
    ...res,
    ...result
  }
}

function requestParamsCreator(column: Special.DetailContentProps, list: any) {
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
export function mapDetailToRequestParams(detail: Special.DetailProps) {
  detail.jumpUrl = (detail.jumpUrl || '').trim()
  const list = (detail.list || []).map((column: Special.DetailContentProps) => {
    switch (column.type) {
      case 1:
        return requestParamsCreator(column, column.list);
      case 2:
        return requestParamsCreator(column, column.coupons);
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
    list
  }
}
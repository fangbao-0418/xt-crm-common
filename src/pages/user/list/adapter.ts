/** 会员列表 */
export function memberListParams (payload: any) {
  const results: any = {}
  if (typeof payload.enableGroupBuyPermission === 'number') {
    results.enableGroupBuyPermission = payload.enableGroupBuyPermission === 1
  }
  return {
    ...payload,
    ...results
  }
}
/** 采购详情 */
export function purchaseListRespones (res: any) {
  if (!Array.isArray(res.records)) res.records = []
  const records = res.records.map((v: any) => {
    const result: any = {}
    result.createTime = APP.fn.formatDate(v.createTime)
    result.purchasePrice = APP.fn.formatMoney(v.purchasePrice)
    result.headPrice = APP.fn.formatMoney(v.headPrice)
    result.cityPrice = APP.fn.formatMoney(v.cityPrice)
    result.areaPrice = APP.fn.formatMoney(v.areaPrice)
    result.managerPrice = APP.fn.formatMoney(v.managerPrice)
    return {
      ...v,
      ...result
    }
  })
  console.log('res.records => ', res.records)
  return {
    ...res,
    records
  }
}
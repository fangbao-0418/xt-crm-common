/** 采购详情 */
export function purchaseListRespones (res: any) {
  if (!Array.isArray(res.records)) res.records = []
  res.records.map((v: any) => {
    v.createTime = APP.fn.formatDate(v.createTime)
    v.purchasePrice = APP.fn.formatMoney(v.purchasePrice)
    v.headPrice = APP.fn.formatMoney(v.headPrice)
    v.cityPrice = APP.fn.formatMoney(v.cityPrice)
    v.areaPrice = APP.fn.formatMoney(v.areaPrice)
    v.managerPrice = APP.fn.formatMoney(v.managerPrice)
    return v
  })
  return res
}
/** 采购详情 */
export function purchaseListRespones (res: any) {
  if (!Array.isArray(res.records)) res.records = []
  res.records.map((v: any) => {
    v.createTime = APP.fn.formatDate(v.createTime)
    return v
  })
  return res
}
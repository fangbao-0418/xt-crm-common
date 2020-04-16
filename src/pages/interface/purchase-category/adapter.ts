/** 团购会分类响应 */
export function categoryLitResponse (res: any) {
  if (!Array.isArray(res.records)) res.records = []
  res.records.map((v: any) => {
    v.modifyTime = v.modifyTime ? APP.fn.formatDate(v.modifyTime): '--'
    v.status = v.status === 1 ? '显示' : '不显示'
    return v
  })
  return res
}
/** 团购会分类响应 */
export function categoryLitResponse (res: any) {
  res.modifyTime = res.modifyTime ? APP.fn.formatDate(res.modifyTime): '--'
  res.status = res.status === 1 ? '显示' : '不显示'
  return res
}
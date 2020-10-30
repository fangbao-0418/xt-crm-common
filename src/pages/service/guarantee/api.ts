const { get, newPut } = APP.http
/**
 * 查询服务保障关联类目信息详情
 */
export function getCategoryRelationDetail (guaranteeId: number) {
  return get(`/mcweb/product/guarantee/category/relation/detail?guaranteeId=${guaranteeId}`)
}

/**
 * 查询服务保障列表
 */
export function getGuaranteeList () {
  return get('/mcweb/product/guarantee/list')
}

/**
 * 修改服务保障信息
 */
export function updategGuarantee (payload: {
  id: number
  name: string
  content: string
  sort: number
}) {
  return newPut('/mcweb/product/guarantee/update', payload)
}
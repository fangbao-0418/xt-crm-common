import { adapterGuaranteeReq, adapterGuaranteeRes } from "./adapter"

const { get, newPost, newPut } = APP.http

interface ProductGuaranteeCategoryRelationDTO {
  id: number
  guaranteeId: number
  firstCategoryId: number
  secondCategoryId: number
  thirdCategoryId: number
}

/**
 * 商品类目树形菜单查询
 */
export function getTreeCategory () {
  return newPost('/mcweb/product/category/treeCategory')
}
/**
 * 保存服务保障关联类目信息
 */
export function saveRelationCategory (payload: { productGuaranteeCategoryRelationDTOList: ProductGuaranteeCategoryRelationDTO []}) {
  return newPost('/mcweb/product/guarantee/category/relation/save', payload)
}

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
  payload = adapterGuaranteeReq(payload)
  return newPut('/mcweb/product/guarantee/update', payload)
}
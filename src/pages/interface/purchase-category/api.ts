import { queryString } from '@/util/utils'
import * as adapter from './adapter'
const { get, del, newPut, newPost} = APP.http

/** 查询类目列表 */
export async function categoryLit (payload: {
  page: number,
  pageSize: number
}) {
  const search = queryString(payload)
  const result = await get(`/category/menu/store/purchase${search}`)
  console.log('result =>', result)
  return adapter.categoryLitResponse(result)
}

/** 删除前台类目 */
export function deleteCategory (categoryId: number) {
  return del(`/category/menu/delete?categoryId=${categoryId}`)
}

/** 新增、编辑前台类目 */
export function processCategory (payload: {
  id: number,
  name: string,
  sort: number,
  /** 1：显示、0：不显示 */
  status: 1 | 0,
  productCategoryVOS: any[]
}) {
  return payload.id ? newPut('/category/menu/update', payload) : newPost('/category/menu/add', payload)
}

/** 查询前台类目详情 */
export function queryCategoryDetail (categoryMenuId: number) {
  return get(`/category/menu/${categoryMenuId}`)
}
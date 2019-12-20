import { queryString } from '@/util/utils'
import * as adapter from './adapter'
const { get } = APP.http

/** 查询团购会类目列表 */
export async function categoryLit (payload: {
  page: number,
  pageSize: number
}) {
  const search = queryString(payload)
  const result = await get(`/category/menu/purchase${search}`)
  console.log('result =>', result)
  return adapter.categoryLitResponse(result)
}

/** /category/menu */
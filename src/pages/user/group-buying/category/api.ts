import { queryString } from '@/util/utils'
const { get } = APP.http

/** 查询团购会类目列表 */
export function categoryLit (payload: {
  page: number,
  pageSize: number
}) {
  const search = queryString(payload)
  return get(`/category/menu/purchase${search}`)
}

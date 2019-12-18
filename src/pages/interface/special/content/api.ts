import * as adapter from './adapter'
const { get, newPut, newPost } = APP.http

/** 分页查询 */
export async function queryFloor (payload: {
  page: number,
  pageSize: number,
  endModifyTime?: number,
  floorName?: string,
  operator?: string,
  startModifyTime?: number,
  status?: 0 | 1
}) {
  const result = await newPost('/crm/subject/floor/query', payload)
  return adapter.queryFloorRespones(result)
}

/** 查询详情 */
export async function queryFloorDetail (floorId: number) {
  const res = await get(`/crm/subject/floor/detail/${floorId}`) || {}
  return adapter.queryFloorDetailRespones(res)
}

/** 启用、停用 */
export function updateStatus (floorId: number) {
  return newPut('/crm/subject/floor/setStatus/{floorId}')
}
